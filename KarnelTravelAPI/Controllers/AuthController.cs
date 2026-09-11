using Microsoft.AspNetCore.Authorization;
using KarnelTravelAPI.Data;
using KarnelTravelAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace KarnelTravelAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly TravelDbContext _context;

        public AuthController(TravelDbContext context)
        {
            _context = context;
        }


        // =====================================================
        // TEST
        // =====================================================

        [HttpGet("test")]
        public IActionResult Test()
        {
            return Ok("Auth API is working");
        }


        // =====================================================
        // USER SIGNUP
        // =====================================================

        [HttpPost("signup")]
        public async Task<IActionResult> Signup(SignupRequest request)
        {
            // -------------------------------------------------
            // CHECK IF EMAIL ALREADY EXISTS
            // -------------------------------------------------

            var existingUser = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == request.Email);

            if (existingUser != null)
            {
                return BadRequest(new
                {
                    message = "Email is already registered"
                });
            }


            // -------------------------------------------------
            // HASH PASSWORD
            // -------------------------------------------------

            string passwordHash = BCrypt.Net.BCrypt.HashPassword(
                request.Password
            );


            // -------------------------------------------------
            // CREATE NORMAL USER
            // -------------------------------------------------

            var user = new User
            {
                Name = request.Name,
                Email = request.Email,
                PasswordHash = passwordHash,

                // Every account created through signup
                // is a normal User by default.
                Role = "User",

                // Every new signup is NOT a Main Admin.
                IsMainAdmin = false
            };


            // -------------------------------------------------
            // SAVE USER
            // -------------------------------------------------

            _context.Users.Add(user);

            await _context.SaveChangesAsync();


            // -------------------------------------------------
            // RESPONSE
            // -------------------------------------------------

            return Ok(new
            {
                message = "Signup successful",

                user = new
                {
                    id = user.Id,
                    name = user.Name,
                    email = user.Email,
                    role = user.Role,
                    isMainAdmin = user.IsMainAdmin
                }
            });
        }


        // =====================================================
        // ADMIN LOGIN
        // =====================================================

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var admin = await _context.Admins
                .FirstOrDefaultAsync(a =>
                    a.Username == request.Username);

            if (admin == null)
            {
                return Unauthorized(new
                {
                    message = "Invalid username or password"
                });
            }


            // -------------------------------------------------
            // VERIFY ADMIN PASSWORD
            // -------------------------------------------------

            bool passwordValid = BCrypt.Net.BCrypt.Verify(
                request.Password,
                admin.PasswordHash
            );

            if (!passwordValid)
            {
                return Unauthorized(new
                {
                    message = "Invalid username or password"
                });
            }


            // =================================================
            // CREATE ADMIN JWT TOKEN
            // =================================================

            var claims = new[]
            {
                new Claim(
                    ClaimTypes.Name,
                    admin.Username
                ),

                new Claim(
                    ClaimTypes.Role,
                    "Admin"
                )
            };


            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(
                    "KarnelTravelSecretKey2026_ChangeThisLater"
                )
            );


            var credentials = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256
            );


            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: credentials
            );


            var tokenString = new JwtSecurityTokenHandler()
                .WriteToken(token);


            return Ok(new
            {
                message = "Login successful",
                username = admin.Username,
                token = tokenString
            });
        }


        // =====================================================
        // USER / ADMIN LOGIN USING EMAIL
        // =====================================================

        [HttpPost("user-login")]
        public async Task<IActionResult> UserLogin(
            UserLoginRequest request
        )
        {
            // -------------------------------------------------
            // FIND USER BY EMAIL
            // -------------------------------------------------

            var user = await _context.Users
                .FirstOrDefaultAsync(u =>
                    u.Email == request.Email);

            if (user == null)
            {
                return Unauthorized(new
                {
                    message = "Invalid email or password"
                });
            }


            // -------------------------------------------------
            // VERIFY PASSWORD
            // -------------------------------------------------

            bool passwordValid = BCrypt.Net.BCrypt.Verify(
                request.Password,
                user.PasswordHash
            );

            if (!passwordValid)
            {
                return Unauthorized(new
                {
                    message = "Invalid email or password"
                });
            }


            // =================================================
            // GET ROLE
            // =================================================

            string role = string.IsNullOrWhiteSpace(user.Role)
                ? "User"
                : user.Role;


            // =================================================
            // GET MAIN ADMIN STATUS
            // =================================================

            bool isMainAdmin = user.IsMainAdmin;


            // =================================================
            // CREATE JWT TOKEN
            // =================================================

            var claims = new[]
            {
                new Claim(
                    ClaimTypes.NameIdentifier,
                    user.Id.ToString()
                ),

                new Claim(
                    ClaimTypes.Name,
                    user.Name
                ),

                new Claim(
                    ClaimTypes.Email,
                    user.Email
                ),

                new Claim(
                    ClaimTypes.Role,
                    role
                ),

                new Claim(
                    "IsMainAdmin",
                    isMainAdmin.ToString()
                )
            };


            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(
                    "KarnelTravelSecretKey2026_ChangeThisLater"
                )
            );


            var credentials = new SigningCredentials(
                key,
                SecurityAlgorithms.HmacSha256
            );


            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddHours(2),
                signingCredentials: credentials
            );


            var tokenString = new JwtSecurityTokenHandler()
                .WriteToken(token);


            // -------------------------------------------------
            // RESPONSE
            // -------------------------------------------------

            return Ok(new
            {
                message = "Login successful",

                token = tokenString,

                user = new
                {
                    id = user.Id,
                    name = user.Name,
                    email = user.Email,
                    role = role,
                    isMainAdmin = isMainAdmin
                }
            });
        }


        // =====================================================
        // UPDATE USER PROFILE
        // =====================================================

        [Authorize(Roles = "User")]
        [HttpPut("update-profile")]
        public async Task<IActionResult> UpdateProfile(
            UpdateProfileRequest request
        )
        {
            // -------------------------------------------------
            // GET USER ID FROM JWT TOKEN
            // -------------------------------------------------

            var userIdClaim = User.FindFirstValue(
                ClaimTypes.NameIdentifier
            );

            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized(new
                {
                    message = "User is not authenticated."
                });
            }


            // -------------------------------------------------
            // CONVERT USER ID
            // -------------------------------------------------

            if (!int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized(new
                {
                    message = "Invalid user information."
                });
            }


            // -------------------------------------------------
            // FIND USER IN DATABASE
            // -------------------------------------------------

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null)
            {
                return NotFound(new
                {
                    message = "User not found."
                });
            }


            // -------------------------------------------------
            // CHECK DUPLICATE EMAIL
            // -------------------------------------------------

            var emailExists = await _context.Users
                .AnyAsync(u =>
                    u.Email == request.Email &&
                    u.Id != userId
                );

            if (emailExists)
            {
                return BadRequest(new
                {
                    message =
                        "Email is already registered by another user."
                });
            }


            // -------------------------------------------------
            // UPDATE NAME AND EMAIL
            // -------------------------------------------------

            user.Name = request.Name;
            user.Email = request.Email;


            // =================================================
            // PASSWORD CHANGE
            // =================================================

            if (!string.IsNullOrWhiteSpace(request.NewPassword))
            {
                // ---------------------------------------------
                // CURRENT PASSWORD REQUIRED
                // ---------------------------------------------

                if (string.IsNullOrWhiteSpace(
                    request.CurrentPassword
                ))
                {
                    return BadRequest(new
                    {
                        message =
                            "Current password is required to change password."
                    });
                }


                // ---------------------------------------------
                // VERIFY CURRENT PASSWORD
                // ---------------------------------------------

                bool passwordValid = BCrypt.Net.BCrypt.Verify(
                    request.CurrentPassword,
                    user.PasswordHash
                );

                if (!passwordValid)
                {
                    return BadRequest(new
                    {
                        message =
                            "Current password is incorrect."
                    });
                }


                // ---------------------------------------------
                // CHECK NEW PASSWORD LENGTH
                // ---------------------------------------------

                if (request.NewPassword.Length < 6)
                {
                    return BadRequest(new
                    {
                        message =
                            "New password must be at least 6 characters."
                    });
                }


                // ---------------------------------------------
                // HASH NEW PASSWORD
                // ---------------------------------------------

                user.PasswordHash =
                    BCrypt.Net.BCrypt.HashPassword(
                        request.NewPassword
                    );
            }


            // -------------------------------------------------
            // SAVE CHANGES
            // -------------------------------------------------

            await _context.SaveChangesAsync();


            // -------------------------------------------------
            // RESPONSE
            // -------------------------------------------------

            return Ok(new
            {
                message = "Profile updated successfully.",

                user = new
                {
                    id = user.Id,
                    name = user.Name,
                    email = user.Email,
                    role = user.Role,
                    isMainAdmin = user.IsMainAdmin
                }
            });
        }
    }
}

