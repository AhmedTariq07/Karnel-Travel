
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
    public class HotelRatingsController : ControllerBase
    {
        private readonly TravelDbContext _context;

        public HotelRatingsController(TravelDbContext context)
        {
            _context = context;
        }


        // =====================================================
        // GET HOTEL RATING
        // =====================================================

        [HttpGet("{hotelId}")]
        public async Task<IActionResult> GetHotelRating(int hotelId)
        {
            var hotel = await _context.Hotels
                .FirstOrDefaultAsync(x => x.Id == hotelId);

            if (hotel == null)
            {
                return NotFound(new
                {
                    message = "Hotel not found."
                });
            }


            var ratings = await _context.HotelRatings
                .Where(x => x.HotelId == hotelId)
                .ToListAsync();


            double averageRating = ratings.Any()
                ? ratings.Average(x => x.Rating)
                : 0;


            return Ok(new
            {
                hotelId = hotelId,

                averageRating = Math.Round(
                    averageRating,
                    1
                ),

                totalRatings = ratings.Count
            });
        }


        // =====================================================
        // SUBMIT / UPDATE HOTEL RATING
        // =====================================================

        [Authorize(Roles = "User")]
        [HttpPost]
        public async Task<IActionResult> SubmitRating(
            [FromBody] HotelRating rating)
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
            // GET USER ID FROM JWT
            // =================================================

            var userIdClaim =
                User.FindFirstValue(
                    ClaimTypes.NameIdentifier
                );


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

            var user = await _context.Users
                .FirstOrDefaultAsync(
                    x => x.Id == userId
                );


            if (user == null)
            {
                return Unauthorized(new
                {
                    message =
                        "User not found."
                });
            }


            // =================================================
            // CHECK HOTEL
            // =================================================

            var hotel = await _context.Hotels
                .FirstOrDefaultAsync(
                    x => x.Id == rating.HotelId
                );


            if (hotel == null)
            {
                return NotFound(new
                {
                    message =
                        "Hotel not found."
                });
            }


            // =================================================
            // FIND EXISTING USER RATING
            // =================================================

            var existingRating =
                await _context.HotelRatings
                    .FirstOrDefaultAsync(x =>
                        x.HotelId == rating.HotelId &&
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
                    new HotelRating
                    {
                        HotelId =
                            rating.HotelId,

                        UserId =
                            userId,

                        UserName =
                            user.Name,

                        Rating =
                            rating.Rating,

                        CreatedAt =
                            DateTime.UtcNow
                    };


                _context.HotelRatings.Add(
                    newRating
                );
            }


            // =================================================
            // SAVE
            // =================================================

            await _context.SaveChangesAsync();


            // =================================================
            // CALCULATE NEW AVERAGE
            // =================================================

            var ratings =
                await _context.HotelRatings
                    .Where(x =>
                        x.HotelId ==
                        rating.HotelId
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

                hotelId =
                    rating.HotelId,

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

