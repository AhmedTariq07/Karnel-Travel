using System.ComponentModel.DataAnnotations;

namespace KarnelTravelAPI.Models
{
    public class UpdateProfileRequest
    {
        [Required]
        public string Name { get; set; } = "";

        [Required]
        [EmailAddress]
        public string Email { get; set; } = "";

        // Only required when changing password
        public string? CurrentPassword { get; set; }

        public string? NewPassword { get; set; }
    }
}