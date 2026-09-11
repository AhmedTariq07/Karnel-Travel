using KarnelTravelAPI.Data;
using KarnelTravelAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KarnelTravelAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HotelsController : ControllerBase
    {
        private readonly TravelDbContext _context;

        // =====================================================
        // REACT PUBLIC IMAGES FOLDER
        // =====================================================

        private readonly string _imagesFolder =
            @"C:\Projects\Karnel-Travel-React\public\images";


        public HotelsController(TravelDbContext context)
        {
            _context = context;
        }


        // =====================================================
        // GET ALL HOTELS
        // GET: api/Hotels
        // =====================================================

        [HttpGet]
        public async Task<IActionResult> GetHotels()
        {
            var hotels = await _context.Hotels
                .OrderByDescending(x => x.Id)
                .ToListAsync();

            return Ok(hotels);
        }


        // =====================================================
        // GET HOTEL BY ID
        // GET: api/Hotels/{id}
        // =====================================================

        [HttpGet("{id}")]
        public async Task<IActionResult> GetHotel(int id)
        {
            var hotel = await _context.Hotels
                .FirstOrDefaultAsync(x => x.Id == id);

            if (hotel == null)
            {
                return NotFound(new
                {
                    message = "Hotel not found."
                });
            }

            return Ok(hotel);
        }


        // =====================================================
        // CREATE HOTEL
        // POST: api/Hotels
        // ADMIN ONLY
        // =====================================================

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateHotel(
            [FromForm] HotelRequest request)
        {
            // =================================================
            // VALIDATE ROOM INFORMATION
            // =================================================

            if (request.TotalRooms < 0)
            {
                return BadRequest(new
                {
                    message = "Total rooms cannot be negative."
                });
            }

            if (request.AvailableRooms < 0)
            {
                return BadRequest(new
                {
                    message = "Available rooms cannot be negative."
                });
            }

            if (request.AvailableRooms > request.TotalRooms)
            {
                return BadRequest(new
                {
                    message =
                        "Available rooms cannot be greater than total rooms."
                });
            }


            // =================================================
            // CREATE HOTEL
            // =================================================

            var hotel = new Hotel
            {
                Name = request.Name,
                Location = request.Location,
                Description = request.Description,
                Price = request.Price,
                Rating = request.Rating,

                TotalRooms = request.TotalRooms,
                AvailableRooms = request.AvailableRooms,

                DiscountPercent = request.DiscountPercent,
                OfferText = request.OfferText
            };


            // =================================================
            // UPLOAD IMAGE
            // =================================================

            if (request.Image != null &&
                request.Image.Length > 0)
            {
                Directory.CreateDirectory(_imagesFolder);


                // ---------------------------------------------
                // CHECK FILE EXTENSION
                // ---------------------------------------------

                var extension =
                    Path.GetExtension(request.Image.FileName)
                        .ToLowerInvariant();

                var allowedExtensions =
                    new[]
                    {
                        ".jpg",
                        ".jpeg",
                        ".png",
                        ".webp"
                    };

                if (!allowedExtensions.Contains(extension))
                {
                    return BadRequest(new
                    {
                        message =
                            "Only JPG, JPEG, PNG and WEBP images are allowed."
                    });
                }


                // ---------------------------------------------
                // CREATE UNIQUE FILE NAME
                // ---------------------------------------------

                var fileName =
                    Guid.NewGuid().ToString()
                    + extension;


                var filePath =
                    Path.Combine(
                        _imagesFolder,
                        fileName);


                // ---------------------------------------------
                // SAVE FILE
                // ---------------------------------------------

                using (var stream =
                    new FileStream(
                        filePath,
                        FileMode.Create))
                {
                    await request.Image.CopyToAsync(stream);
                }


                // ---------------------------------------------
                // SAVE IMAGE URL IN DATABASE
                // ---------------------------------------------

                hotel.Image =
                    "/images/"
                    + fileName;
            }


            // =================================================
            // SAVE HOTEL
            // =================================================

            _context.Hotels.Add(hotel);

            await _context.SaveChangesAsync();


            return Ok(new
            {
                message =
                    "Hotel created successfully.",

                hotel
            });
        }


        // =====================================================
        // UPDATE HOTEL
        // PUT: api/Hotels/{id}
        // ADMIN ONLY
        // =====================================================

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateHotel(
            int id,
            [FromForm] HotelRequest request)
        {
            // =================================================
            // FIND HOTEL
            // =================================================

            var hotel = await _context.Hotels
                .FirstOrDefaultAsync(x => x.Id == id);

            if (hotel == null)
            {
                return NotFound(new
                {
                    message = "Hotel not found."
                });
            }


            // =================================================
            // VALIDATE ROOM INFORMATION
            // =================================================

            if (request.TotalRooms < 0)
            {
                return BadRequest(new
                {
                    message =
                        "Total rooms cannot be negative."
                });
            }

            if (request.AvailableRooms < 0)
            {
                return BadRequest(new
                {
                    message =
                        "Available rooms cannot be negative."
                });
            }

            if (request.AvailableRooms > request.TotalRooms)
            {
                return BadRequest(new
                {
                    message =
                        "Available rooms cannot be greater than total rooms."
                });
            }


            // =================================================
            // UPDATE BASIC INFORMATION
            // =================================================

            hotel.Name =
                request.Name;

            hotel.Location =
                request.Location;

            hotel.Description =
                request.Description;

            hotel.Price =
                request.Price;

            hotel.Rating =
                request.Rating;

            hotel.TotalRooms =
                request.TotalRooms;

            hotel.AvailableRooms =
                request.AvailableRooms;

            hotel.DiscountPercent =
                request.DiscountPercent;

            hotel.OfferText =
                request.OfferText;


            // =================================================
            // UPDATE IMAGE ONLY IF NEW IMAGE IS PROVIDED
            // =================================================

            if (request.Image != null &&
                request.Image.Length > 0)
            {
                Directory.CreateDirectory(_imagesFolder);


                // ---------------------------------------------
                // CHECK FILE EXTENSION
                // ---------------------------------------------

                var extension =
                    Path.GetExtension(request.Image.FileName)
                        .ToLowerInvariant();

                var allowedExtensions =
                    new[]
                    {
                        ".jpg",
                        ".jpeg",
                        ".png",
                        ".webp"
                    };

                if (!allowedExtensions.Contains(extension))
                {
                    return BadRequest(new
                    {
                        message =
                            "Only JPG, JPEG, PNG and WEBP images are allowed."
                    });
                }


                // ---------------------------------------------
                // DELETE OLD IMAGE
                // ---------------------------------------------

                if (!string.IsNullOrWhiteSpace(hotel.Image))
                {
                    var oldFileName =
                        Path.GetFileName(hotel.Image);

                    if (!string.IsNullOrWhiteSpace(oldFileName))
                    {
                        var oldImagePath =
                            Path.Combine(
                                _imagesFolder,
                                oldFileName);

                        if (System.IO.File.Exists(
                            oldImagePath))
                        {
                            System.IO.File.Delete(
                                oldImagePath);
                        }
                    }
                }


                // ---------------------------------------------
                // CREATE NEW FILE NAME
                // ---------------------------------------------

                var fileName =
                    Guid.NewGuid().ToString()
                    + extension;


                var filePath =
                    Path.Combine(
                        _imagesFolder,
                        fileName);


                // ---------------------------------------------
                // SAVE NEW IMAGE
                // ---------------------------------------------

                using (var stream =
                    new FileStream(
                        filePath,
                        FileMode.Create))
                {
                    await request.Image.CopyToAsync(stream);
                }


                // ---------------------------------------------
                // SAVE NEW IMAGE URL
                // ---------------------------------------------

                hotel.Image =
                    "/images/"
                    + fileName;
            }


            // =================================================
            // SAVE
            // =================================================

            await _context.SaveChangesAsync();


            return Ok(new
            {
                message =
                    "Hotel updated successfully.",

                hotel
            });
        }


        // =====================================================
        // DELETE HOTEL
        // DELETE: api/Hotels/{id}
        // ADMIN ONLY
        // =====================================================

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHotel(
            int id)
        {
            var hotel = await _context.Hotels
                .FirstOrDefaultAsync(x => x.Id == id);

            if (hotel == null)
            {
                return NotFound(new
                {
                    message = "Hotel not found."
                });
            }


            // =================================================
            // DELETE IMAGE FILE
            // =================================================

            if (!string.IsNullOrWhiteSpace(hotel.Image))
            {
                var imageFileName =
                    Path.GetFileName(hotel.Image);

                if (!string.IsNullOrWhiteSpace(
                    imageFileName))
                {
                    var fullImagePath =
                        Path.Combine(
                            _imagesFolder,
                            imageFileName);

                    if (System.IO.File.Exists(
                        fullImagePath))
                    {
                        System.IO.File.Delete(
                            fullImagePath);
                    }
                }
            }


            // =================================================
            // DELETE HOTEL
            // =================================================

            _context.Hotels.Remove(hotel);

            await _context.SaveChangesAsync();


            return Ok(new
            {
                message =
                    "Hotel deleted successfully."
            });
        }


        // =====================================================
        // RESERVE HOTEL ROOMS
        // POST: api/Hotels/{id}/reserve-rooms
        // =====================================================

        [HttpPost("{id}/reserve-rooms")]
        public async Task<IActionResult> ReserveRooms(
            int id,
            [FromBody] ReserveRoomsRequest request)
        {
            // =================================================
            // VALIDATE ROOM COUNT
            // =================================================

            if (request.Rooms <= 0)
            {
                return BadRequest(new
                {
                    message =
                        "Number of rooms must be at least 1."
                });
            }


            // =================================================
            // FIND HOTEL
            // =================================================

            var hotel = await _context.Hotels
                .FirstOrDefaultAsync(x => x.Id == id);

            if (hotel == null)
            {
                return NotFound(new
                {
                    message =
                        "Hotel not found."
                });
            }


            // =================================================
            // CHECK AVAILABLE ROOMS
            // =================================================

            if (hotel.AvailableRooms <
                request.Rooms)
            {
                return BadRequest(new
                {
                    message =
                        $"Only {hotel.AvailableRooms} room(s) are currently available.",

                    availableRooms =
                        hotel.AvailableRooms
                });
            }


            // =================================================
            // REDUCE AVAILABLE ROOMS
            // =================================================

            hotel.AvailableRooms -=
                request.Rooms;


            // =================================================
            // SAVE
            // =================================================

            await _context.SaveChangesAsync();


            // =================================================
            // RESPONSE
            // =================================================

            return Ok(new
            {
                message =
                    "Rooms reserved successfully.",

                hotelId =
                    hotel.Id,

                reservedRooms =
                    request.Rooms,

                availableRooms =
                    hotel.AvailableRooms,

                totalRooms =
                    hotel.TotalRooms
            });
        }
    }
}

