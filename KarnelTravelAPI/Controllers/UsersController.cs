using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KarnelTravelAPI.Data;
using System.Security.Claims;

namespace KarnelTravelAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly TravelDbContext _context;

        public UsersController(TravelDbContext context)
        {
            _context = context;
        }

        // =====================================================
        // GET ALL USERS
        // =====================================================

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _context.Users
                .Select(u => new
                {
                    u.Id,
                    u.Name,
                    u.Email,
                    u.Role,
                    u.IsMainAdmin
                })
                .OrderByDescending(u => u.Id)
                .ToListAsync();

            return Ok(users);
        }


        // =====================================================
        // GET USER BY ID
        // =====================================================

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _context.Users
                .Where(u => u.Id == id)
                .Select(u => new
                {
                    u.Id,
                    u.Name,
                    u.Email,
                    u.Role,
                    u.IsMainAdmin
                })
                .FirstOrDefaultAsync();

            if (user == null)
            {
                return NotFound(new
                {
                    message = "User not found."
                });
            }

            return Ok(user);
        }


        // =====================================================
        // CHANGE USER ROLE
        // ONLY MAIN ADMIN CAN DO THIS
        // =====================================================

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/role")]
        public async Task<IActionResult> ChangeUserRole(
            int id,
            [FromBody] ChangeRoleRequest request)
        {
            // -------------------------------------------------
            // GET CURRENT LOGGED-IN USER ID FROM JWT
            // -------------------------------------------------

            var currentUserIdClaim =
                User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (!int.TryParse(
                currentUserIdClaim,
                out int currentUserId))
            {
                return Unauthorized(new
                {
                    message = "Invalid user authentication."
                });
            }


            // -------------------------------------------------
            // GET CURRENT USER FROM DATABASE
            // -------------------------------------------------

            var currentUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == currentUserId);

            if (currentUser == null)
            {
                return Unauthorized(new
                {
                    message = "Current user was not found."
                });
            }


            // -------------------------------------------------
            // ONLY MAIN ADMIN CAN CHANGE ROLES
            // -------------------------------------------------

            if (!currentUser.IsMainAdmin)
            {
                return StatusCode(403, new
                {
                    message =
                        "Only the Main Admin can give or remove Admin access."
                });
            }


            // -------------------------------------------------
            // FIND TARGET USER
            // -------------------------------------------------

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound(new
                {
                    message = "User not found."
                });
            }


            // -------------------------------------------------
            // VALIDATE ROLE
            // -------------------------------------------------

            if (
                request.Role != "User" &&
                request.Role != "Admin"
            )
            {
                return BadRequest(new
                {
                    message =
                        "Invalid role. Use User or Admin."
                });
            }


            // -------------------------------------------------
            // MAIN ADMIN CANNOT BE DEMOTED
            // -------------------------------------------------

            if (
                user.IsMainAdmin &&
                request.Role == "User"
            )
            {
                return BadRequest(new
                {
                    message =
                        "Main Admin access cannot be removed."
                });
            }


            // -------------------------------------------------
            // CURRENT MAIN ADMIN CANNOT REMOVE OWN ACCESS
            // -------------------------------------------------

            if (
                user.Id == currentUser.Id &&
                request.Role == "User"
            )
            {
                return BadRequest(new
                {
                    message =
                        "You cannot remove your own Main Admin access."
                });
            }


            // -------------------------------------------------
            // UPDATE ROLE
            // -------------------------------------------------

            user.Role = request.Role;

            await _context.SaveChangesAsync();


            // -------------------------------------------------
            // RESPONSE
            // -------------------------------------------------

            return Ok(new
            {
                message =
                    request.Role == "Admin"
                        ? "Admin access granted successfully."
                        : "Admin access removed successfully.",

                user = new
                {
                    user.Id,
                    user.Name,
                    user.Email,
                    user.Role,
                    user.IsMainAdmin
                }
            });
        }
    }


    // =========================================================
    // CHANGE ROLE REQUEST
    // =========================================================

    public class ChangeRoleRequest
    {
        public string Role { get; set; } = "User";
    }
}

