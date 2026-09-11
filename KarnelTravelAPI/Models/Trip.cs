using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KarnelTravelAPI.Models
{
    [Table("trips")]
    public class Trip
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = "";

        public string? Destination { get; set; }

        [Required]
        public DateTime StartDate { get; set; }

        [Required]
        public DateTime EndDate { get; set; }

        // Optional user
        // Admin-created itineraries do not belong to a specific user.
        public int? UserId { get; set; }

        [ForeignKey("UserId")]
        public User? User { get; set; }
    }
}