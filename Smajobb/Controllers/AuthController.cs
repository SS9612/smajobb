using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Smajobb.DTOs;
using Smajobb.Services.Interfaces;

namespace Smajobb.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IUserService _userService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, IUserService userService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _userService = userService;
        _logger = logger;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] Smajobb.DTOs.LoginRequest request)
    {
        try
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest("Email and password are required");
            }

            // For development: simple mock authentication
            // In production, this would validate against a user database
            if (request.Email == "test@example.com" && request.Password == "password")
            {
                var mockUser = new
                {
                    id = Guid.NewGuid().ToString(),
                    firstName = "Test",
                    lastName = "User",
                    email = request.Email,
                    phone = "1234567890",
                    userType = "customer",
                    displayName = "Test User"
                };

                var token = "mock-jwt-token-" + Guid.NewGuid().ToString();
                
                return Ok(new
                {
                    token = token,
                    user = mockUser
                });
            }

            return Unauthorized("Invalid email or password");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("bankid/initiate")]
    public async Task<IActionResult> InitiateBankIdAuthentication([FromBody] BankIdInitiateRequest request)
    {
        try
        {
            if (string.IsNullOrEmpty(request.PersonalNumber))
            {
                return BadRequest("Personal number is required");
            }

            var orderRef = await _authService.InitiateBankIdAuthenticationAsync(request.PersonalNumber);
            
            return Ok(new { OrderRef = orderRef });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error initiating BankID authentication");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("bankid/complete")]
    public async Task<IActionResult> CompleteBankIdAuthentication([FromBody] BankIdCompleteRequest request)
    {
        try
        {
            if (string.IsNullOrEmpty(request.OrderRef))
            {
                return BadRequest("Order reference is required");
            }

            var result = await _authService.CompleteBankIdAuthenticationAsync(request.OrderRef);
            
            if (!result.Success)
            {
                return BadRequest(new { Error = result.ErrorMessage });
            }

            // Check if user exists, if not create one
            var user = await _userService.GetUserByBankIdSubjectAsync(result.PersonalNumber!);
            if (user == null)
            {
                // Create new user with BankID information
                var registrationDto = new UserRegistrationDto
                {
                    Email = "", // Will be filled later
                    Phone = "", // Will be filled later
                    DisplayName = result.Name ?? "Unknown User",
                    Role = "customer"
                };

                user = await _userService.CreateUserAsync(registrationDto);
            }

            // Generate JWT token
            var token = await _authService.GenerateJwtTokenAsync(user.Id);
            
            return Ok(new
            {
                Token = token,
                User = user,
                ExpiresAt = DateTime.UtcNow.AddDays(7)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error completing BankID authentication");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("validate")]
    public async Task<IActionResult> ValidateToken([FromBody] TokenValidationRequest request)
    {
        try
        {
            if (string.IsNullOrEmpty(request.Token))
            {
                return BadRequest("Token is required");
            }

            var isValid = await _authService.ValidateJwtTokenAsync(request.Token);
            
            if (!isValid)
            {
                return Unauthorized("Invalid token");
            }

            var userId = await _authService.GetUserIdFromTokenAsync(request.Token);
            
            return Ok(new { Valid = true, UserId = userId });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating token");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("refresh")]
    [Authorize]
    public async Task<IActionResult> RefreshToken()
    {
        try
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized("Invalid user");
            }

            var token = await _authService.GenerateJwtTokenAsync(userId);
            
            return Ok(new
            {
                Token = token,
                ExpiresAt = DateTime.UtcNow.AddDays(7)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error refreshing token");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("logout")]
    [Authorize]
    public async Task<IActionResult> Logout()
    {
        try
        {
            // In a more sophisticated implementation, you might want to:
            // 1. Add the token to a blacklist
            // 2. Store logout events for audit purposes
            // 3. Clear any server-side sessions
            
            _logger.LogInformation("User {UserId} logged out", User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value);
            
            return Ok(new { Message = "Logged out successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during logout");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("me")]
    [Authorize]
    public async Task<IActionResult> GetCurrentUser()
    {
        try
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized("Invalid user");
            }

            var user = await _userService.GetUserByIdAsync(userId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            return Ok(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting current user");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("change-role")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> ChangeUserRole([FromBody] ChangeRoleRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _userService.GetUserByIdAsync(request.UserId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            // Update user role
            var updateDto = new UserRegistrationDto
            {
                Email = user.Email ?? "",
                Phone = user.Phone ?? "",
                DisplayName = user.DisplayName ?? "",
                Role = request.NewRole
            };

            var updatedUser = await _userService.UpdateUserAsync(request.UserId, updateDto);
            
            return Ok(updatedUser);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error changing user role");
            return StatusCode(500, "Internal server error");
        }
    }
}

public record BankIdInitiateRequest
{
    public string PersonalNumber { get; init; } = string.Empty;
}

public record BankIdCompleteRequest
{
    public string OrderRef { get; init; } = string.Empty;
}

public record TokenValidationRequest
{
    public string Token { get; init; } = string.Empty;
}

public record ChangeRoleRequest
{
    public Guid UserId { get; init; }
    public string NewRole { get; init; } = string.Empty;
}