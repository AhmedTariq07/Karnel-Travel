using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KarnelTravelAPI.Models
{
    [Table("bookings")]
    public class Booking
    {
        public int Id { get; set; }

        [Required]
        public string FullName { get; set; } = "";

        [Required]
        public string Email { get; set; } = "";

        [Required]
        public string Phone { get; set; } = "";

        [Required]
        public string Subject { get; set; } = "";

        [Required]
        public string Message { get; set; } = "";

        // =====================================================
        // BOOKING INFORMATION
        // =====================================================

        // Example:
        // Hotel / Restaurant / Tourist Spot / Resort / Itinerary
        public string? Type { get; set; }

        // ID of the selected item
        public int? ItemId { get; set; }

        // Name of the selected item
        public string? ItemName { get; set; }


        // =====================================================
        // PAYMENT / CASHBOOK INFORMATION
        // =====================================================

        // Total amount for this booking
        public decimal Amount { get; set; } = 0;

        // Amount already received
        public decimal PaidAmount { get; set; } = 0;

        // Amount still remaining
        public decimal RemainingAmount { get; set; } = 0;

        // Cash / Card / Bank Transfer
        public string? PaymentMethod { get; set; }

        // Pending / Paid / Partially Paid / Cancelled
        public string? PaymentStatus { get; set; }


        // =====================================================
        // DATE
        // =====================================================

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
