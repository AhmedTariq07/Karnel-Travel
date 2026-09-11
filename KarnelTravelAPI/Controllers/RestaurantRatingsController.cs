
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
    public class RestaurantRatingsController : ControllerBase
    {
        private readonly TravelDbContext _context;

        public RestaurantRatingsController(TravelDbContext context)
        {
            _context = context;
        }


        // =====================================================
        // GET RESTAURANT RATING
        // GET: /api/RestaurantRatings/{restaurantId}
        // =====================================================

        [HttpGet("{restaurantId}")]
        public async Task<IActionResult> GetRestaurantRating(int restaurantId)
        {
            var restaurant = await _context.Restaurants
                .FirstOrDefaultAsync(x => x.Id == restaurantId);

            if (restaurant == null)
            {
                return NotFound(new
                {
                    message = "Restaurant not found."
                });
            }

            var ratings = await _context.RestaurantRatings
                .Where(x => x.RestaurantId == restaurantId)
                .ToListAsync();

            double averageRating = ratings.Any()
                ? ratings.Average(x => x.Rating)
                : 0;

            return Ok(new
            {
                restaurantId = restaurantId,
                averageRating = Math.Round(averageRating, 1),
                totalRatings = ratings.Count
            });
        }


        // =====================================================
        // SUBMIT / UPDATE RESTAURANT RATING
        // POST: /api/RestaurantRatings
        // =====================================================

        [Authorize(Roles = "User")]
        [HttpPost]
        public async Task<IActionResult> SubmitRating(
            [FromBody] RestaurantRating rating)
        {
            // =================================================
            // VALIDATE RATING
            // =================================================

            if (rating.Rating < 1 || rating.Rating > 5)
            {
                return BadRequest(new
                {
                    message = "Rating must be between 1 and 5."
                });
            }


            // =================================================
            // GET LOGGED-IN USER ID FROM JWT
            // =================================================

            var userIdClaim =
                User.FindFirstValue(
                    ClaimTypes.NameIdentifier
                );

            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized(new
                {
                    message = "User is not authenticated."
                });
            }


            if (!int.TryParse(
                userIdClaim,
                out int userId))
            {
                return Unauthorized(new
                {
                    message = "Invalid user information."
                });
            }


            // =================================================
            // FIND USER
            // =================================================

            var user = await _context.Users
                .FirstOrDefaultAsync(
                    x => x.Id == userId
                );

            if (user == null)
            {
                return Unauthorized(new
                {
                    message = "User not found."
                });
            }


            // =================================================
            // FIND RESTAURANT
            // =================================================

            var restaurant = await _context.Restaurants
                .FirstOrDefaultAsync(
                    x => x.Id == rating.RestaurantId
                );

            if (restaurant == null)
            {
                return NotFound(new
                {
                    message = "Restaurant not found."
                });
            }


            // =================================================
            // CHECK EXISTING RATING
            // ONE USER = ONE RATING PER RESTAURANT
            // =================================================

            var existingRating =
                await _context.RestaurantRatings
                    .FirstOrDefaultAsync(x =>
                        x.RestaurantId ==
                            rating.RestaurantId
                        &&
                        x.UserId == userId
                    );


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
                    new RestaurantRating
                    {
                        RestaurantId =
                            rating.RestaurantId,

                        UserId =
                            userId,

                        UserName =
                            user.Name,

                        Rating =
                            rating.Rating,

                        CreatedAt =
                            DateTime.UtcNow
                    };

                _context.RestaurantRatings.Add(
                    newRating
                );
            }


            // =================================================
            // SAVE
            // =================================================

            await _context.SaveChangesAsync();


            // =================================================
            // CALCULATE UPDATED AVERAGE
            // =================================================

            var ratings =
                await _context.RestaurantRatings
                    .Where(x =>
                        x.RestaurantId ==
                        rating.RestaurantId
                    )
                    .ToListAsync();


            double averageRating =
                ratings.Any()
                    ? ratings.Average(
                        x => x.Rating
                    )
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

                restaurantId =
                    rating.RestaurantId,

                averageRating =
                    Math.Round(
                        averageRating,
                        1
                    ),

                totalRatings =
                    ratings.Count
            });
        }
    }
}

