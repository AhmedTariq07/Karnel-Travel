using System.ComponentModel.DataAnnotations.Schema;

namespace KarnelTravelAPI.Models
{
    [Table("hotels")]
    public class Hotel
    {
        public int Id { get; set; }

        public string Name { get; set; } = "";

        public string? Location { get; set; }

        public string? Description { get; set; }

        public string? Image { get; set; }

        public string? Price { get; set; }

        public decimal? Rating { get; set; }

        // =====================================================
        // ROOM AVAILABILITY
        // =====================================================

        public int TotalRooms { get; set; } = 0;

        public int AvailableRooms { get; set; } = 0;


        // =====================================================
        // DISCOUNT / OFFER
        // =====================================================

        public decimal DiscountPercent { get; set; } = 0;

        public string? OfferText { get; set; }
    }
}