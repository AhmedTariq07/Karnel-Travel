using KarnelTravelAPI.Data;
using KarnelTravelAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KarnelTravelAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ResortsController : ControllerBase
    {
        private readonly TravelDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public ResortsController(
            TravelDbContext context,
            IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }


        // =====================================================
        // GET: api/Resorts
        // Get all resorts
        // =====================================================

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Resort>>> GetResorts()
        {
            var resorts = await _context.Resorts.ToListAsync();

            return Ok(resorts);
        }


        // =====================================================
        // GET: api/Resorts/1
        // Get single resort
        // =====================================================

        [HttpGet("{id}")]
        public async Task<ActionResult<Resort>> GetResort(int id)
        {
            var resort = await _context.Resorts.FindAsync(id);

            if (resort == null)
            {
                return NotFound(new
                {
                    message = "Resort not found"
                });
            }

            return Ok(resort);
        }


        // =====================================================
        // POST: api/Resorts
        // Create new resort
        // Admin only
        // =====================================================

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Resort>> CreateResort(
            [FromForm] string name,
            [FromForm] string? location,
            [FromForm] string? description,
            [FromForm] string? price,
            [FromForm] decimal? rating,
            [FromForm] int totalRooms,
            [FromForm] int availableRooms,
            IFormFile? image)
        {
            // -------------------------------------------------
            // VALIDATE ROOMS
            // -------------------------------------------------

            if (totalRooms < 0)
            {
                return BadRequest(new
                {
                    message = "Total rooms cannot be negative."
                });
            }

            if (availableRooms < 0)
            {
                return BadRequest(new
                {
                    message = "Available rooms cannot be negative."
                });
            }

            if (availableRooms > totalRooms)
            {
                return BadRequest(new
                {
                    message =
                        "Available rooms cannot be greater than total rooms."
                });
            }


            // -------------------------------------------------
            // Create resort object
            // -------------------------------------------------

            var resort = new Resort
            {
                Name = name,
                Location = location,
                Description = description,
                Price = price,
                Rating = rating,

                TotalRooms = totalRooms,
                AvailableRooms = availableRooms
            };


            // -------------------------------------------------
            // Image upload
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
                // Create upload folder
                // -------------------------------------------------

                var uploadFolder = Path.Combine(
                    _environment.WebRootPath,
                    "uploads",
                    "resorts"
                );

                if (!Directory.Exists(uploadFolder))
                {
                    Directory.CreateDirectory(uploadFolder);
                }


                // -------------------------------------------------
                // Generate unique file name
                // -------------------------------------------------

                var uniqueFileName =
                    $"{Guid.NewGuid()}{extension}";

                var filePath =
                    Path.Combine(
                        uploadFolder,
                        uniqueFileName
                    );


                // -------------------------------------------------
                // Save image
                // -------------------------------------------------

                using (var stream = new FileStream(
                    filePath,
                    FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }


                // -------------------------------------------------
                // Store image URL
                // -------------------------------------------------

                resort.Image =
                    $"{Request.Scheme}://{Request.Host}/uploads/resorts/{uniqueFileName}";
            }


            // -------------------------------------------------
            // Save resort to database
            // -------------------------------------------------

            _context.Resorts.Add(resort);

            await _context.SaveChangesAsync();


            return CreatedAtAction(
                nameof(GetResort),
                new { id = resort.Id },
                resort
            );
        }


        // =====================================================
        // PUT: api/Resorts/1
        // Update resort
        // Admin only
        // =====================================================

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateResort(
            int id,
            [FromBody] Resort resort)
        {
            if (id != resort.Id)
            {
                return BadRequest(new
                {
                    message = "ID does not match"
                });
            }


            // -------------------------------------------------
            // Find existing resort
            // -------------------------------------------------

            var existingResort =
                await _context.Resorts
                    .FirstOrDefaultAsync(x => x.Id == id);

            if (existingResort == null)
            {
                return NotFound(new
                {
                    message = "Resort not found"
                });
            }


            // -------------------------------------------------
            // Validate rooms
            // -------------------------------------------------

            if (resort.TotalRooms < 0)
            {
                return BadRequest(new
                {
                    message =
                        "Total rooms cannot be negative."
                });
            }

            if (resort.AvailableRooms < 0)
            {
                return BadRequest(new
                {
                    message =
                        "Available rooms cannot be negative."
                });
            }

            if (resort.AvailableRooms > resort.TotalRooms)
            {
                return BadRequest(new
                {
                    message =
                        "Available rooms cannot be greater than total rooms."
                });
            }


            // -------------------------------------------------
            // Update data fields
            // Keep existing image
            // -------------------------------------------------

            existingResort.Name =
                resort.Name;

            existingResort.Location =
                resort.Location;

            existingResort.Description =
                resort.Description;

            existingResort.Price =
                resort.Price;

            existingResort.Rating =
                resort.Rating;

            existingResort.TotalRooms =
                resort.TotalRooms;

            existingResort.AvailableRooms =
                resort.AvailableRooms;


            await _context.SaveChangesAsync();


            return Ok(new
            {
                message =
                    "Resort updated successfully",

                resort =
                    existingResort
            });
        }


        // =====================================================
        // POST: api/Resorts/{id}/reserve-rooms
        // Reserve resort rooms
        // =====================================================

        [HttpPost("{id}/reserve-rooms")]
        public async Task<IActionResult> ReserveRooms(
            int id,
            [FromBody] ReserveRoomsRequest request)
        {
            // -------------------------------------------------
            // Validate number of rooms
            // -------------------------------------------------

            if (request.Rooms <= 0)
            {
                return BadRequest(new
                {
                    message =
                        "Number of rooms must be at least 1."
                });
            }


            // -------------------------------------------------
            // Find resort
            // -------------------------------------------------

            var resort =
                await _context.Resorts
                    .FirstOrDefaultAsync(
                        x => x.Id == id);

            if (resort == null)
            {
                return NotFound(new
                {
                    message =
                        "Resort not found."
                });
            }


            // -------------------------------------------------
            // Check availability
            // -------------------------------------------------

            if (resort.AvailableRooms <
                request.Rooms)
            {
                return BadRequest(new
                {
                    message =
                        $"Only {resort.AvailableRooms} room(s) are currently available.",

                    availableRooms =
                        resort.AvailableRooms
                });
            }


            // -------------------------------------------------
            // Reserve rooms
            // -------------------------------------------------

            resort.AvailableRooms -=
                request.Rooms;


            await _context.SaveChangesAsync();


            return Ok(new
            {
                message =
                    "Rooms reserved successfully.",

                resortId =
                    resort.Id,

                reservedRooms =
                    request.Rooms,

                availableRooms =
                    resort.AvailableRooms,

                totalRooms =
                    resort.TotalRooms
            });
        }


        // =====================================================
        // DELETE: api/Resorts/1
        // Delete resort
        // Admin only
        // =====================================================

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteResort(int id)
        {
            var resort =
                await _context.Resorts
                    .FirstOrDefaultAsync(
                        x => x.Id == id);

            if (resort == null)
            {
                return NotFound(new
                {
                    message = "Resort not found"
                });
            }


            // -------------------------------------------------
            // Delete physical image
            // -------------------------------------------------

            if (!string.IsNullOrEmpty(resort.Image))
            {
                try
                {
                    var uri =
                        new Uri(resort.Image);

                    var relativePath =
                        uri.AbsolutePath
                            .TrimStart('/')
                            .Replace(
                                '/',
                                Path.DirectorySeparatorChar
                            );

                    var filePath =
                        Path.Combine(
                            _environment.WebRootPath,
                            relativePath
                                .Replace(
                                    "uploads" +
                                    Path.DirectorySeparatorChar,
                                    "uploads" +
                                    Path.DirectorySeparatorChar
                                )
                        );

                    if (System.IO.File.Exists(filePath))
                    {
                        System.IO.File.Delete(filePath);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine(
                        $"Could not delete resort image: {ex.Message}"
                    );
                }
            }


            // -------------------------------------------------
            // Delete database record
            // -------------------------------------------------

            _context.Resorts.Remove(resort);

            await _context.SaveChangesAsync();


            return Ok(new
            {
                message =
                    "Resort deleted successfully"
            });
        }
    }
}
