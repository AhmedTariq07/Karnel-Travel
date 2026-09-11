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
    public class ResortRatingsController : ControllerBase
    {
        private readonly TravelDbContext _context;

        public ResortRatingsController(TravelDbContext context)
        {
            _context = context;
        }


        // =====================================================
        // GET RESORT RATING
        // GET: api/ResortRatings/{resortId}
        // =====================================================

        [HttpGet("{resortId}")]
        public async Task<IActionResult> GetResortRating(
            int resortId)
        {
            var resort = await _context.Resorts
                .FirstOrDefaultAsync(x => x.Id == resortId);

            if (resort == null)
            {
                return NotFound(new
                {
                    message = "Resort not found."
                });
            }

            var ratings = await _context.ResortRatings
                .Where(x => x.ResortId == resortId)
                .ToListAsync();

            double averageRating = ratings.Any()
                ? ratings.Average(x => x.Rating)
                : 0;

            return Ok(new
            {
                resortId = resortId,

                averageRating =
                    Math.Round(
                        averageRating,
                        1),

                totalRatings =
                    ratings.Count
            });
        }


        // =====================================================
        // SUBMIT / UPDATE RESORT RATING
        // POST: api/ResortRatings
        // USER ONLY
        // =====================================================

        [Authorize(Roles = "User")]
        [HttpPost]
        public async Task<IActionResult> SubmitRating(
            [FromBody] ResortRating rating)
        {
            // -------------------------------------------------
            // VALIDATE RATING
            // -------------------------------------------------

            if (rating.Rating < 1 ||
                rating.Rating > 5)
            {
                return BadRequest(new
                {
                    message =
                        "Rating must be between 1 and 5."
                });
            }


            // -------------------------------------------------
            // GET LOGGED-IN USER ID
            // -------------------------------------------------

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


            // -------------------------------------------------
            // FIND USER
            // -------------------------------------------------

            var user = await _context.Users
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


            // -------------------------------------------------
            // FIND RESORT
            // -------------------------------------------------

            var resort = await _context.Resorts
                .FirstOrDefaultAsync(
                    x => x.Id == rating.ResortId);

            if (resort == null)
            {
                return NotFound(new
                {
                    message =
                        "Resort not found."
                });
            }


            // -------------------------------------------------
            // CHECK EXISTING RATING
            // ONE RATING PER USER PER RESORT
            // -------------------------------------------------

            var existingRating =
                await _context.ResortRatings
                    .FirstOrDefaultAsync(x =>
                        x.ResortId ==
                            rating.ResortId
                        &&
                        x.UserId == userId);


            // -------------------------------------------------
            // UPDATE EXISTING RATING
            // -------------------------------------------------

            if (existingRating != null)
            {
                existingRating.Rating =
                    rating.Rating;

                existingRating.UserName =
                    user.Name;

                existingRating.CreatedAt =
                    DateTime.UtcNow;
            }


            // -------------------------------------------------
            // CREATE NEW RATING
            // -------------------------------------------------

            else
            {
                var newRating =
                    new ResortRating
                    {
                        ResortId =
                            rating.ResortId,

                        UserId =
                            userId,

                        UserName =
                            user.Name,

                        Rating =
                            rating.Rating,

                        CreatedAt =
                            DateTime.UtcNow
                    };

                _context.ResortRatings.Add(
                    newRating);
            }


            // -------------------------------------------------
            // SAVE
            // -------------------------------------------------

            await _context.SaveChangesAsync();


            // -------------------------------------------------
            // GET UPDATED RATINGS
            // -------------------------------------------------

            var ratings =
                await _context.ResortRatings
                    .Where(x =>
                        x.ResortId ==
                        rating.ResortId)
                    .ToListAsync();


            // -------------------------------------------------
            // CALCULATE AVERAGE
            // -------------------------------------------------

            double averageRating =
                ratings.Any()
                    ? ratings.Average(
                        x => x.Rating)
                    : 0;


            // -------------------------------------------------
            // RETURN RESULT
            // -------------------------------------------------

            return Ok(new
            {
                message =
                    existingRating != null
                        ? "Rating updated successfully."
                        : "Rating submitted successfully.",

                resortId =
                    rating.ResortId,

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
