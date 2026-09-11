
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KarnelTravelAPI.Models
{
    [Table("restaurant_ratings")]
    public class RestaurantRating
    {
        public int Id { get; set; }

        // RESTAURANT
        [Required]
        public int RestaurantId { get; set; }

        [ForeignKey("RestaurantId")]
        public Restaurant? Restaurant { get; set; }

        // USER
        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User? User { get; set; }

        // RATING
        [Range(1, 5)]
        public int Rating { get; set; }

        // USER NAME
        public string? UserName { get; set; }

        // DATE
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

