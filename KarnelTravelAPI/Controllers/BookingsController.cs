using Microsoft.AspNetCore.Mvc;
using KarnelTravelAPI.Data;
using KarnelTravelAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace KarnelTravelAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingsController : ControllerBase
    {
        private readonly TravelDbContext _context;

        public BookingsController(TravelDbContext context)
        {
            _context = context;
        }


        // =====================================================
        // CREATE BOOKING / CONTACT REQUEST
        // POST: api/Bookings
        // =====================================================

        [HttpPost]
        public async Task<IActionResult> CreateBooking(
            [FromBody] Booking booking)
        {
            if (booking == null)
            {
                return BadRequest(new
                {
                    message = "Invalid booking data."
                });
            }


            // =================================================
            // REQUIRED FIELDS
            // =================================================

            if (string.IsNullOrWhiteSpace(booking.FullName) ||
                string.IsNullOrWhiteSpace(booking.Email) ||
                string.IsNullOrWhiteSpace(booking.Phone) ||
                string.IsNullOrWhiteSpace(booking.Subject) ||
                string.IsNullOrWhiteSpace(booking.Message))
            {
                return BadRequest(new
                {
                    message = "Please fill in all required fields."
                });
            }


            // =================================================
            // BOOKING PAYMENT INFORMATION
            // =================================================

            if (booking.Amount < 0)
            {
                return BadRequest(new
                {
                    message = "Booking amount cannot be negative."
                });
            }


            if (booking.PaidAmount < 0)
            {
                return BadRequest(new
                {
                    message = "Paid amount cannot be negative."
                });
            }


            if (booking.PaidAmount > booking.Amount)
            {
                return BadRequest(new
                {
                    message =
                        "Paid amount cannot be greater than booking amount."
                });
            }


            // =================================================
            // PAYMENT METHOD
            // =================================================

            if (!string.IsNullOrWhiteSpace(booking.PaymentMethod))
            {
                var paymentMethod =
                    booking.PaymentMethod.Trim();

                if (paymentMethod != "Cash" &&
                    paymentMethod != "Card" &&
                    paymentMethod != "Bank Transfer")
                {
                    return BadRequest(new
                    {
                        message =
                            "Invalid payment method."
                    });
                }

                booking.PaymentMethod = paymentMethod;
            }


            // =================================================
            // CALCULATE PAYMENT
            // =================================================

            booking.RemainingAmount =
                booking.Amount -
                booking.PaidAmount;


            // =================================================
            // PAYMENT STATUS
            // =================================================

            if (booking.Amount <= 0)
            {
                booking.PaymentStatus = "Pending";
            }
            else if (booking.PaidAmount <= 0)
            {
                booking.PaymentStatus = "Pending";
            }
            else if (booking.PaidAmount >= booking.Amount)
            {
                booking.PaymentStatus = "Paid";
            }
            else
            {
                booking.PaymentStatus = "Partially Paid";
            }


            // =================================================
            // SAVE BOOKING
            // =================================================

            booking.Id = 0;

            booking.CreatedAt =
                DateTime.UtcNow;

            _context.Bookings.Add(booking);

            await _context.SaveChangesAsync();


            // =================================================
            // RESPONSE
            // =================================================

            return Ok(new
            {
                message =
                    "Booking request submitted successfully.",

                bookingId =
                    booking.Id,

                amount =
                    booking.Amount,

                paidAmount =
                    booking.PaidAmount,

                remainingAmount =
                    booking.RemainingAmount,

                paymentMethod =
                    booking.PaymentMethod,

                paymentStatus =
                    booking.PaymentStatus
            });
        }


        // =====================================================
        // GET ALL BOOKINGS
        // GET: api/Bookings
        // =====================================================

        [HttpGet]
        public async Task<IActionResult> GetBookings()
        {
            var bookings =
                await _context.Bookings
                    .OrderByDescending(
                        b => b.CreatedAt)
                    .ToListAsync();

            return Ok(bookings);
        }


        // =====================================================
        // GET BOOKING BY ID
        // GET: api/Bookings/1
        // =====================================================

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBooking(
            int id)
        {
            var booking =
                await _context.Bookings
                    .FindAsync(id);

            if (booking == null)
            {
                return NotFound(new
                {
                    message =
                        "Booking not found."
                });
            }

            return Ok(booking);
        }
    }
}