using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace KarnelTravelAPI.Models
{
    [Table("users")]
    public class User
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = "";

        [Required]
        public string Email { get; set; } = "";

        [Required]
        public string PasswordHash { get; set; } = "";

        // User or Admin
        [Required]
        public string Role { get; set; } = "User";

        // Main Admin or normal Admin/User
        public bool IsMainAdmin { get; set; } = false;
    }
}

