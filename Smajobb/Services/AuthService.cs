using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Smajobb.Services.Interfaces;

namespace Smajobb.Services;

public class AuthService : IAuthService
{
    private readonly IConfiguration _configuration;
    private readonly IUserService _userService;
    private readonly ILogger<AuthService> _logger;

    public AuthService(IConfiguration configuration, IUserService userService, ILogger<AuthService> logger)
    {
        _configuration = configuration;
        _userService = userService;
        _logger = logger;
    }

    public async Task<string> InitiateBankIdAuthenticationAsync(string personalNumber)
    {
        try
        {
            // In a real implementation, this would call the BankID API
            // For now, we'll simulate the process
            _logger.LogInformation("Initiating BankID authentication for personal number: {PersonalNumber}", personalNumber);
            
            // Generate a mock order reference
            var orderRef = Guid.NewGuid().ToString();
            
            // In production, this would be stored in a database or cache
            // and the actual BankID API call would be made
            
            return orderRef;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error initiating BankID authentication");
            throw;
        }
    }

    public async Task<BankIdAuthResult> CompleteBankIdAuthenticationAsync(string orderRef)
    {
        try
        {
            // In a real implementation, this would poll the BankID API
            // to check the status of the authentication
            _logger.LogInformation("Completing BankID authentication for order ref: {OrderRef}", orderRef);
            
            // Simulate successful authentication
            // In production, this would verify the actual BankID response
            var result = new BankIdAuthResult
            {
                Success = true,
                PersonalNumber = "198001011234", // Mock personal number
                Name = "Test User"
            };
            
            return result;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error completing BankID authentication");
            return new BankIdAuthResult
            {
                Success = false,
                ErrorMessage = "Authentication failed"
            };
        }
    }

    public async Task<string> GenerateJwtTokenAsync(Guid userId)
    {
        try
        {
            var user = await _userService.GetUserByIdAsync(userId);
            if (user == null)
            {
                throw new ArgumentException("User not found");
            }

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Secret"] ?? "default-secret-key-change-in-production");
            
            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, userId.ToString()),
                new(ClaimTypes.Email, user.Email ?? ""),
                new(ClaimTypes.Name, user.DisplayName ?? ""),
                new(ClaimTypes.Role, user.Role)
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature
                ),
                Issuer = _configuration["Jwt:Issuer"] ?? "smajobb",
                Audience = _configuration["Jwt:Audience"] ?? "smajobb-users"
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating JWT token for user {UserId}", userId);
            throw;
        }
    }

    public async Task<bool> ValidateJwtTokenAsync(string token)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Secret"] ?? "default-secret-key-change-in-production");

            tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = _configuration["Jwt:Issuer"] ?? "smajobb",
                ValidateAudience = true,
                ValidAudience = _configuration["Jwt:Audience"] ?? "smajobb-users",
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error validating JWT token");
            return false;
        }
    }

    public async Task<Guid?> GetUserIdFromTokenAsync(string token)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Secret"] ?? "default-secret-key-change-in-production");

            var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = _configuration["Jwt:Issuer"] ?? "smajobb",
                ValidateAudience = true,
                ValidAudience = _configuration["Jwt:Audience"] ?? "smajobb-users",
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);

            var userIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim != null && Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return userId;
            }

            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error extracting user ID from JWT token");
            return null;
        }
    }
}
