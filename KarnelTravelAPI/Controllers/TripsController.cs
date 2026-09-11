using KarnelTravelAPI.Data;
using KarnelTravelAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace KarnelTravelAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TripsController : ControllerBase
    {
        private readonly TravelDbContext _context;

        public TripsController(TravelDbContext context)
        {
            _context = context;
        }


        // =====================================================
        // GET ALL TRIPS
        // USERS + ADMIN
        // =====================================================

        [Authorize(Roles = "User,Admin")]
        [HttpGet]
        public async Task<IActionResult> GetTrips()
        {
            var trips = await _context.Trips
                .OrderBy(x => x.StartDate)
                .ToListAsync();

            return Ok(trips);
        }


        // =====================================================
        // GET SINGLE TRIP
        // USERS + ADMIN
        // =====================================================

        [Authorize(Roles = "User,Admin")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTrip(int id)
        {
            var trip = await _context.Trips
                .FirstOrDefaultAsync(x => x.Id == id);

            if (trip == null)
            {
                return NotFound(new
                {
                    message = "Trip not found."
                });
            }

            return Ok(trip);
        }


        // =====================================================
        // CREATE TRIP
        // ADMIN ONLY
        // =====================================================

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> CreateTrip(
            [FromBody] Trip trip
        )
        {
            if (trip.EndDate < trip.StartDate)
            {
                return BadRequest(new
                {
                    message =
                        "End date cannot be before start date."
                });
            }

            trip.Id = 0;

            // Admin-created itinerary does not belong
            // to a normal user.
            trip.UserId = null;
            trip.User = null;

            _context.Trips.Add(trip);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Trip created successfully.",
                trip
            });
        }


        // =====================================================
        // UPDATE TRIP
        // ADMIN ONLY
        // =====================================================

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTrip(
            int id,
            [FromBody] Trip updatedTrip
        )
        {
            var trip = await _context.Trips
                .FirstOrDefaultAsync(x => x.Id == id);

            if (trip == null)
            {
                return NotFound(new
                {
                    message = "Trip not found."
                });
            }

            if (updatedTrip.EndDate < updatedTrip.StartDate)
            {
                return BadRequest(new
                {
                    message =
                        "End date cannot be before start date."
                });
            }

            trip.Name = updatedTrip.Name;
            trip.Destination = updatedTrip.Destination;
            trip.StartDate = updatedTrip.StartDate;
            trip.EndDate = updatedTrip.EndDate;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Trip updated successfully.",
                trip
            });
        }


        // =====================================================
        // DELETE TRIP
        // ADMIN ONLY
        // =====================================================

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTrip(int id)
        {
            var trip = await _context.Trips
                .FirstOrDefaultAsync(x => x.Id == id);

            if (trip == null)
            {
                return NotFound(new
                {
                    message = "Trip not found."
                });
            }

            _context.Trips.Remove(trip);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Trip deleted successfully."
            });
        }
    }
}