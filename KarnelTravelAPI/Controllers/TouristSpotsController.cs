using KarnelTravelAPI.Data;
using KarnelTravelAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KarnelTravelAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TouristSpotsController : ControllerBase
    {
        private readonly TravelDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public TouristSpotsController(
            TravelDbContext context,
            IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }


        // =====================================================
        // GET ALL TOURIST SPOTS
        // Public
        // GET: api/TouristSpots
        // =====================================================

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TouristSpot>>> GetTouristSpots()
        {
            var touristSpots = await _context.TouristSpots
                .ToListAsync();

            return Ok(touristSpots);
        }


        // =====================================================
        // GET ONE TOURIST SPOT
        // Public
        // GET: api/TouristSpots/1
        // =====================================================

        [HttpGet("{id}")]
        public async Task<ActionResult<TouristSpot>> GetTouristSpot(int id)
        {
            var touristSpot = await _context.TouristSpots
                .FirstOrDefaultAsync(x => x.Id == id);

            if (touristSpot == null)
            {
                return NotFound(new
                {
                    message = "Tourist spot not found"
                });
            }

            return Ok(touristSpot);
        }


        // =====================================================
        // CREATE TOURIST SPOT
        // Admin only
        // POST: api/TouristSpots
        // =====================================================

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<TouristSpot>> CreateTouristSpot(
            [FromForm] string name,
            [FromForm] string? location,
            [FromForm] string? description,
            [FromForm] decimal? rating,
            [FromForm] int tourDays,
            [FromForm] decimal price,
            IFormFile? image)
        {
            // =================================================
            // VALIDATE TOUR DAYS
            // =================================================

            if (tourDays <= 0)
            {
                return BadRequest(new
                {
                    message =
                        "Tour duration must be at least 1 day."
                });
            }


            // =================================================
            // VALIDATE PRICE
            // =================================================

            if (price < 0)
            {
                return BadRequest(new
                {
                    message =
                        "Tour package price cannot be negative."
                });
            }


            var touristSpot = new TouristSpot
            {
                Name = name,
                Location = location,
                Description = description,
                Rating = rating,

                TourDays = tourDays,
                Price = price,

                // Permanent 20% discount
                DiscountPercent = 20
            };


            // =================================================
            // IMAGE UPLOAD
            // =================================================

            if (image != null && image.Length > 0)
            {
                var allowedExtensions = new[]
                {
                    ".jpg",
                    ".jpeg",
                    ".png",
                    ".webp"
                };

                var extension = Path
                    .GetExtension(image.FileName)
                    .ToLowerInvariant();


                // Check file type
                if (!allowedExtensions.Contains(extension))
                {
                    return BadRequest(new
                    {
                        message =
                            "Only JPG, JPEG, PNG and WEBP images are allowed."
                    });
                }


                // Maximum image size = 5 MB
                if (image.Length > 5 * 1024 * 1024)
                {
                    return BadRequest(new
                    {
                        message =
                            "Image size must be less than 5 MB."
                    });
                }


                // =================================================
                // CREATE UPLOAD FOLDER
                // =================================================

                var webRootPath =
                    _environment.WebRootPath ??
                    Path.Combine(
                        Directory.GetCurrentDirectory(),
                        "wwwroot"
                    );


                var uploadFolder = Path.Combine(
                    webRootPath,
                    "uploads",
                    "tourist-spots"
                );


                Directory.CreateDirectory(uploadFolder);


                // =================================================
                // CREATE UNIQUE FILE NAME
                // =================================================

                var uniqueFileName =
                    $"{Guid.NewGuid()}{extension}";


                var filePath = Path.Combine(
                    uploadFolder,
                    uniqueFileName
                );


                // =================================================
                // SAVE IMAGE
                // =================================================

                using (var stream = new FileStream(
                    filePath,
                    FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }


                // =================================================
                // SAVE IMAGE URL
                // =================================================

                touristSpot.Image =
                    $"{Request.Scheme}://{Request.Host}/uploads/tourist-spots/{uniqueFileName}";
            }


            // =====================================================
            // SAVE TOURIST SPOT
            // =====================================================

            _context.TouristSpots.Add(touristSpot);

            await _context.SaveChangesAsync();


            return CreatedAtAction(
                nameof(GetTouristSpot),
                new { id = touristSpot.Id },
                touristSpot
            );
        }


        // =====================================================
        // UPDATE TOURIST SPOT
        // Admin only
        // PUT: api/TouristSpots/1
        // =====================================================

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTouristSpot(
            int id,
            TouristSpot touristSpot)
        {
            if (id != touristSpot.Id)
            {
                return BadRequest(new
                {
                    message = "ID does not match"
                });
            }


            // =================================================
            // VALIDATE TOUR DAYS
            // =================================================

            if (touristSpot.TourDays <= 0)
            {
                return BadRequest(new
                {
                    message =
                        "Tour duration must be at least 1 day."
                });
            }


            // =================================================
            // VALIDATE PRICE
            // =================================================

            if (touristSpot.Price < 0)
            {
                return BadRequest(new
                {
                    message =
                        "Tour package price cannot be negative."
                });
            }


            var existingSpot =
                await _context.TouristSpots
                    .FirstOrDefaultAsync(x => x.Id == id);


            if (existingSpot == null)
            {
                return NotFound(new
                {
                    message =
                        "Tourist spot not found"
                });
            }


            // =================================================
            // UPDATE BASIC INFORMATION
            // =================================================

            existingSpot.Name =
                touristSpot.Name;

            existingSpot.Location =
                touristSpot.Location;

            existingSpot.Description =
                touristSpot.Description;

            existingSpot.Rating =
                touristSpot.Rating;


            // =================================================
            // UPDATE TOUR PACKAGE
            // =================================================

            existingSpot.TourDays =
                touristSpot.TourDays;

            existingSpot.Price =
                touristSpot.Price;


            // =================================================
            // KEEP DISCOUNT FIXED AT 20%
            // =================================================

            existingSpot.DiscountPercent = 20;


            // =================================================
            // KEEP EXISTING IMAGE
            // =================================================

            if (!string.IsNullOrWhiteSpace(
                touristSpot.Image))
            {
                existingSpot.Image =
                    touristSpot.Image;
            }


            await _context.SaveChangesAsync();


            return Ok(new
            {
                message =
                    "Tourist spot updated successfully",

                touristSpot =
                    existingSpot
            });
        }


        // =====================================================
        // DELETE TOURIST SPOT
        // Admin only
        // DELETE: api/TouristSpots/1
        // =====================================================

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTouristSpot(int id)
        {
            var touristSpot =
                await _context.TouristSpots
                    .FirstOrDefaultAsync(x => x.Id == id);


            if (touristSpot == null)
            {
                return NotFound(new
                {
                    message =
                        "Tourist spot not found"
                });
            }


            _context.TouristSpots.Remove(
                touristSpot);


            await _context.SaveChangesAsync();


            return Ok(new
            {
                message =
                    "Tourist spot deleted successfully"
            });
        }
    }
}
