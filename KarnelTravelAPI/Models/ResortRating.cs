using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KarnelTravelAPI.Models
{
    [Table("resort_ratings")]
    public class ResortRating
    {
        public int Id { get; set; }

        [Required]
        public int ResortId { get; set; }

        [ForeignKey("ResortId")]
        public Resort? Resort { get; set; }

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
