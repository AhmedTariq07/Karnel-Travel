using KarnelTravelAPI.Data;
using KarnelTravelAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KarnelTravelAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RestaurantsController : ControllerBase
    {
        private readonly TravelDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public RestaurantsController(
            TravelDbContext context,
            IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }


        // =========================================================
        // GET ALL RESTAURANTS
        // GET: api/Restaurants
        // =========================================================

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Restaurant>>> GetRestaurants()
        {
            var restaurants = await _context.Restaurants.ToListAsync();

            return Ok(restaurants);
        }


        // =========================================================
        // GET RESTAURANT BY ID
        // GET: api/Restaurants/1
        // =========================================================

        [HttpGet("{id}")]
        public async Task<ActionResult<Restaurant>> GetRestaurant(int id)
        {
            var restaurant = await _context.Restaurants.FindAsync(id);

            if (restaurant == null)
            {
                return NotFound(new
                {
                    message = "Restaurant not found"
                });
            }

            return Ok(restaurant);
        }


        // =========================================================
        // ADD RESTAURANT
        // POST: api/Restaurants
        // =========================================================

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Restaurant>> CreateRestaurant(
            [FromForm] string name,
            [FromForm] string? location,
            [FromForm] string? description,
            [FromForm] string? price,
            [FromForm] decimal? rating,
            [FromForm] int totalSeats,
            [FromForm] int availableSeats,
            IFormFile? image)
        {
            try
            {
                // -------------------------------------------------
                // VALIDATE SEAT COUNTS
                // -------------------------------------------------

                if (totalSeats < 0)
                {
                    return BadRequest(new
                    {
                        message = "Total seats cannot be negative."
                    });
                }

                if (availableSeats < 0)
                {
                    return BadRequest(new
                    {
                        message = "Available seats cannot be negative."
                    });
                }

                if (availableSeats > totalSeats)
                {
                    return BadRequest(new
                    {
                        message =
                            "Available seats cannot be greater than total seats."
                    });
                }


                // -------------------------------------------------
                // CREATE RESTAURANT OBJECT
                // -------------------------------------------------

                var restaurant = new Restaurant
                {
                    Name = name,
                    Location = location,
                    Description = description,
                    Price = price,
                    Rating = rating,

                    TotalSeats = totalSeats,
                    AvailableSeats = availableSeats
                };


                // -------------------------------------------------
                // IMAGE UPLOAD
                // -------------------------------------------------

                if (image != null && image.Length > 0)
                {
                    var allowedExtensions = new[]
                    {
                        ".jpg",
                        ".jpeg",
                        ".png",
                        ".webp"
                    };

                    var extension =
                        Path.GetExtension(image.FileName)
                            .ToLowerInvariant();


                    if (!allowedExtensions.Contains(extension))
                    {
                        return BadRequest(new
                        {
                            message =
                                "Only JPG, JPEG, PNG and WEBP images are allowed."
                        });
                    }


                    // Maximum 5 MB

                    if (image.Length > 5 * 1024 * 1024)
                    {
                        return BadRequest(new
                        {
                            message =
                                "Image size must be less than 5 MB."
                        });
                    }


                    // -------------------------------------------------
                    // WEB ROOT PATH
                    // -------------------------------------------------

                    var webRootPath =
                        _environment.WebRootPath;

                    if (string.IsNullOrEmpty(webRootPath))
                    {
                        webRootPath = Path.Combine(
                            Directory.GetCurrentDirectory(),
                            "wwwroot"
                        );
                    }


                    // -------------------------------------------------
                    // CREATE UPLOAD FOLDER
                    // -------------------------------------------------

                    var uploadFolder = Path.Combine(
                        webRootPath,
                        "uploads",
                        "restaurants"
                    );


                    if (!Directory.Exists(uploadFolder))
                    {
                        Directory.CreateDirectory(uploadFolder);
                    }


                    // -------------------------------------------------
                    // UNIQUE FILE NAME
                    // -------------------------------------------------

                    var uniqueFileName =
                        $"{Guid.NewGuid()}{extension}";


                    var filePath = Path.Combine(
                        uploadFolder,
                        uniqueFileName
                    );


                    // -------------------------------------------------
                    // SAVE IMAGE
                    // -------------------------------------------------

                    using (var stream = new FileStream(
                        filePath,
                        FileMode.Create))
                    {
                        await image.CopyToAsync(stream);
                    }


                    // -------------------------------------------------
                    // SAVE IMAGE URL
                    // -------------------------------------------------

                    restaurant.Image =
                        $"{Request.Scheme}://{Request.Host}/uploads/restaurants/{uniqueFileName}";
                }


                // -------------------------------------------------
                // SAVE RESTAURANT
                // -------------------------------------------------

                _context.Restaurants.Add(restaurant);

                await _context.SaveChangesAsync();


                return Ok(new
                {
                    message = "Restaurant added successfully",
                    restaurant = restaurant
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Error adding restaurant",
                    error = ex.Message
                });
            }
        }


        // =========================================================
        // UPDATE RESTAURANT
        // PUT: api/Restaurants/1
        // =========================================================

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateRestaurant(
            int id,
            [FromBody] Restaurant restaurant)
        {
            if (id != restaurant.Id)
            {
                return BadRequest(new
                {
                    message = "ID does not match"
                });
            }


            // -------------------------------------------------
            // VALIDATE SEAT COUNTS
            // -------------------------------------------------

            if (restaurant.TotalSeats < 0)
            {
                return BadRequest(new
                {
                    message = "Total seats cannot be negative."
                });
            }

            if (restaurant.AvailableSeats < 0)
            {
                return BadRequest(new
                {
                    message = "Available seats cannot be negative."
                });
            }

            if (restaurant.AvailableSeats >
                restaurant.TotalSeats)
            {
                return BadRequest(new
                {
                    message =
                        "Available seats cannot be greater than total seats."
                });
            }


            // -------------------------------------------------
            // FIND EXISTING RESTAURANT
            // -------------------------------------------------

            var existingRestaurant =
                await _context.Restaurants
                    .FirstOrDefaultAsync(x => x.Id == id);


            if (existingRestaurant == null)
            {
                return NotFound(new
                {
                    message = "Restaurant not found"
                });
            }


            // -------------------------------------------------
            // UPDATE TEXT DATA
            // -------------------------------------------------

            existingRestaurant.Name =
                restaurant.Name;

            existingRestaurant.Location =
                restaurant.Location;

            existingRestaurant.Description =
                restaurant.Description;

            existingRestaurant.Price =
                restaurant.Price;

            existingRestaurant.Rating =
                restaurant.Rating;


            // -------------------------------------------------
            // UPDATE SEAT DATA
            // -------------------------------------------------

            existingRestaurant.TotalSeats =
                restaurant.TotalSeats;

            existingRestaurant.AvailableSeats =
                restaurant.AvailableSeats;


            // -------------------------------------------------
            // IMPORTANT:
            // IMAGE IS NOT CHANGED DURING UPDATE
            // -------------------------------------------------

            await _context.SaveChangesAsync();


            return Ok(new
            {
                message = "Restaurant updated successfully",
                restaurant = existingRestaurant
            });
        }


        // =========================================================
        // RESERVE RESTAURANT SEATS
        // POST: api/Restaurants/1/reserve-seats
        // =========================================================

        [HttpPost("{id}/reserve-seats")]
        public async Task<IActionResult> ReserveSeats(
            int id,
            [FromBody] ReserveSeatsRequest request)
        {
            // -------------------------------------------------
            // VALIDATE NUMBER OF SEATS
            // -------------------------------------------------

            if (request.Seats <= 0)
            {
                return BadRequest(new
                {
                    message =
                        "Number of people must be at least 1."
                });
            }


            // -------------------------------------------------
            // FIND RESTAURANT
            // -------------------------------------------------

            var restaurant =
                await _context.Restaurants
                    .FirstOrDefaultAsync(x => x.Id == id);


            if (restaurant == null)
            {
                return NotFound(new
                {
                    message =
                        "Restaurant not found."
                });
            }


            // -------------------------------------------------
            // CHECK AVAILABILITY
            // -------------------------------------------------

            if (restaurant.AvailableSeats <
                request.Seats)
            {
                return BadRequest(new
                {
                    message =
                        $"Only {restaurant.AvailableSeats} seat(s) are currently available.",

                    availableSeats =
                        restaurant.AvailableSeats
                });
            }


            // -------------------------------------------------
            // REDUCE AVAILABLE SEATS
            // -------------------------------------------------

            restaurant.AvailableSeats -=
                request.Seats;


            await _context.SaveChangesAsync();


            // -------------------------------------------------
            // RETURN RESULT
            // -------------------------------------------------

            return Ok(new
            {
                message =
                    "Seats reserved successfully.",

                restaurantId =
                    restaurant.Id,

                reservedSeats =
                    request.Seats,

                availableSeats =
                    restaurant.AvailableSeats,

                totalSeats =
                    restaurant.TotalSeats
            });
        }


        // =========================================================
        // DELETE RESTAURANT
        // DELETE: api/Restaurants/1
        // =========================================================

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRestaurant(int id)
        {
            try
            {
                // -------------------------------------------------
                // FIND RESTAURANT
                // -------------------------------------------------

                var restaurant =
                    await _context.Restaurants
                        .FirstOrDefaultAsync(x => x.Id == id);


                if (restaurant == null)
                {
                    return NotFound(new
                    {
                        message = "Restaurant not found"
                    });
                }


                // -------------------------------------------------
                // GET IMAGE PATH
                // -------------------------------------------------

                var imagePath = restaurant.Image;


                Console.WriteLine(
                    $"Restaurant image in database: {imagePath}"
                );


                // -------------------------------------------------
                // DELETE IMAGE FILE
                // -------------------------------------------------

                if (!string.IsNullOrWhiteSpace(imagePath))
                {
                    try
                    {
                        var fileName =
                            Path.GetFileName(
                                new Uri(imagePath).LocalPath
                            );


                        var webRootPath =
                            _environment.WebRootPath;


                        if (string.IsNullOrEmpty(webRootPath))
                        {
                            webRootPath = Path.Combine(
                                Directory.GetCurrentDirectory(),
                                "wwwroot"
                            );
                        }


                        var physicalImagePath =
                            Path.Combine(
                                webRootPath,
                                "uploads",
                                "restaurants",
                                fileName
                            );


                        Console.WriteLine(
                            $"Restaurant physical image path: {physicalImagePath}"
                        );


                        if (System.IO.File.Exists(
                            physicalImagePath))
                        {
                            System.IO.File.Delete(
                                physicalImagePath);


                            Console.WriteLine(
                                "Restaurant image deleted successfully."
                            );
                        }
                        else
                        {
                            Console.WriteLine(
                                "Restaurant image file does not exist."
                            );
                        }
                    }
                    catch (Exception imageException)
                    {
                        Console.WriteLine(
                            $"Restaurant image delete error: {imageException.Message}"
                        );

                        // Continue deleting database record
                    }
                }


                // -------------------------------------------------
                // DELETE DATABASE RECORD
                // -------------------------------------------------

                _context.Restaurants.Remove(restaurant);

                await _context.SaveChangesAsync();


                return Ok(new
                {
                    message = "Restaurant deleted successfully"
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(
                    $"Restaurant delete error: {ex.Message}"
                );


                return StatusCode(500, new
                {
                    message = "Error deleting restaurant",
                    error = ex.Message
                });
            }
        }
    }
}
