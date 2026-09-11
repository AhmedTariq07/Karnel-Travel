using KarnelTravelAPI.Data;
using KarnelTravelAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace KarnelTravelAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TouristSpotRatingsController : ControllerBase
    {
        private readonly TravelDbContext _context;

        public TouristSpotRatingsController(
            TravelDbContext context)
        {
            _context = context;
        }


        // =====================================================
        // GET TOURIST SPOT RATING
        // PUBLIC
        // GET: api/TouristSpotRatings/1
        // =====================================================

        [HttpGet("{touristSpotId}")]
        public async Task<IActionResult> GetTouristSpotRating(
            int touristSpotId)
        {
            var touristSpot =
                await _context.TouristSpots
                    .FirstOrDefaultAsync(
                        x => x.Id == touristSpotId);

            if (touristSpot == null)
            {
                return NotFound(new
                {
                    message = "Tourist spot not found."
                });
            }


            var ratings =
                await _context.TouristSpotRatings
                    .Where(x =>
                        x.TouristSpotId ==
                        touristSpotId)
                    .ToListAsync();


            double averageRating =
                ratings.Any()
                    ? ratings.Average(x => x.Rating)
                    : 0;


            return Ok(new
            {
                touristSpotId = touristSpotId,

                averageRating =
                    Math.Round(
                        averageRating,
                        1),

                totalRatings =
                    ratings.Count
            });
        }


        // =====================================================
        // SUBMIT / UPDATE RATING
        // LOGGED-IN USER ONLY
        // POST: api/TouristSpotRatings
        // =====================================================

        [Authorize(Roles = "User")]
        [HttpPost]
        public async Task<IActionResult> SubmitRating(
            [FromBody] TouristSpotRating rating)
        {
            // =================================================
            // CHECK RATING
            // =================================================

            if (rating.Rating < 1 ||
                rating.Rating > 5)
            {
                return BadRequest(new
                {
                    message =
                        "Rating must be between 1 and 5."
                });
            }


            // =================================================
            // GET LOGGED-IN USER ID
            // =================================================

            var userIdClaim =
                User.FindFirstValue(
                    ClaimTypes.NameIdentifier);


            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized(new
                {
                    message =
                        "User is not authenticated."
                });
            }


            if (!int.TryParse(
                userIdClaim,
                out int userId))
            {
                return Unauthorized(new
                {
                    message =
                        "Invalid user information."
                });
            }


            // =================================================
            // GET USER
            // =================================================

            var user =
                await _context.Users
                    .FirstOrDefaultAsync(
                        x => x.Id == userId);


            if (user == null)
            {
                return Unauthorized(new
                {
                    message =
                        "User not found."
                });
            }


            // =================================================
            // CHECK TOURIST SPOT
            // =================================================

            var touristSpot =
                await _context.TouristSpots
                    .FirstOrDefaultAsync(
                        x =>
                            x.Id ==
                            rating.TouristSpotId);


            if (touristSpot == null)
            {
                return NotFound(new
                {
                    message =
                        "Tourist spot not found."
                });
            }


            // =================================================
            // CHECK EXISTING RATING
            // =================================================

            var existingRating =
                await _context.TouristSpotRatings
                    .FirstOrDefaultAsync(x =>
                        x.TouristSpotId ==
                            rating.TouristSpotId
                        &&
                        x.UserId == userId);


            // =================================================
            // UPDATE EXISTING RATING
            // =================================================

            if (existingRating != null)
            {
                existingRating.Rating =
                    rating.Rating;

                existingRating.UserName =
                    user.Name;

                existingRating.CreatedAt =
                    DateTime.UtcNow;
            }


            // =================================================
            // CREATE NEW RATING
            // =================================================

            else
            {
                var newRating =
                    new TouristSpotRating
                    {
                        TouristSpotId =
                            rating.TouristSpotId,

                        UserId =
                            userId,

                        UserName =
                            user.Name,

                        Rating =
                            rating.Rating,

                        CreatedAt =
                            DateTime.UtcNow
                    };


                _context.TouristSpotRatings.Add(
                    newRating);
            }


            // =================================================
            // SAVE
            // =================================================

            await _context.SaveChangesAsync();


            // =================================================
            // CALCULATE NEW AVERAGE
            // =================================================

            var ratings =
                await _context.TouristSpotRatings
                    .Where(x =>
                        x.TouristSpotId ==
                        rating.TouristSpotId)
                    .ToListAsync();


            double averageRating =
                ratings.Any()
                    ? ratings.Average(
                        x => x.Rating)
                    : 0;


            // =================================================
            // RESPONSE
            // =================================================

            return Ok(new
            {
                message =
                    existingRating != null
                        ? "Rating updated successfully."
                        : "Rating submitted successfully.",

                touristSpotId =
                    rating.TouristSpotId,

                averageRating =
                    Math.Round(
                        averageRating,
                        1),

                totalRatings =
                    ratings.Count
            });
        }
    }
}

