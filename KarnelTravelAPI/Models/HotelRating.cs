using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KarnelTravelAPI.Models
{
    [Table("hotel_ratings")]
    public class HotelRating
    {
        [Key]
        public int Id { get; set; }

        public int HotelId { get; set; }

        public int UserId { get; set; }

        public string UserName { get; set; } = "";

        public int Rating { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation properties
        [ForeignKey(nameof(HotelId))]
        public Hotel? Hotel { get; set; }

        [ForeignKey(nameof(UserId))]
        public User? User { get; set; }
    }
}