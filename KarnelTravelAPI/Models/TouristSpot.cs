using System.ComponentModel.DataAnnotations.Schema;

namespace KarnelTravelAPI.Models
{
    [Table("tourist_spots")]
    public class TouristSpot
    {
        public int Id { get; set; }

        public string Name { get; set; } = "";

        public string? Location { get; set; }

        public string? Description { get; set; }

        public string? Image { get; set; }

        public decimal? Rating { get; set; }

        // =====================================================
        // TOUR PACKAGE
        // =====================================================

        public int TourDays { get; set; } = 1;

        public decimal Price { get; set; } = 0;

        // Permanent discount
        public decimal DiscountPercent { get; set; } = 20;
    }
}
