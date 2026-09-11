using Microsoft.AspNetCore.Http;

namespace KarnelTravelAPI.Models
{
    public class HotelRequest
    {
        public string Name { get; set; } = "";

        public string? Location { get; set; }

        public string? Description { get; set; }

        public string? Price { get; set; }

        public decimal? Rating { get; set; }

        public int TotalRooms { get; set; }

        public int AvailableRooms { get; set; }

        public decimal DiscountPercent { get; set; }

        public string? OfferText { get; set; }

        public IFormFile? Image { get; set; }
    }
}