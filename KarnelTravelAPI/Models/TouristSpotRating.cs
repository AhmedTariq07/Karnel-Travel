
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KarnelTravelAPI.Models
{
    [Table("tourist_spot_ratings")]
    public class TouristSpotRating
    {
        public int Id { get; set; }

        [Required]
        public int TouristSpotId { get; set; }

        [ForeignKey("TouristSpotId")]
        public TouristSpot? TouristSpot { get; set; }

        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User? User { get; set; }

        [Range(1, 5)]
        public int Rating { get; set; }

        public string? UserName { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
