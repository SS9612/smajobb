using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace Smajobb.Middleware;

public class JwtMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IConfiguration _configuration;
    private readonly ILogger<JwtMiddleware> _logger;

    public JwtMiddleware(RequestDelegate next, IConfiguration configuration, ILogger<JwtMiddleware> logger)
    {
        _next = next;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var token = ExtractTokenFromRequest(context.Request);

        if (!string.IsNullOrEmpty(token))
        {
            try
            {
                var principal = ValidateToken(token);
                if (principal != null)
                {
                    context.User = principal;
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Invalid JWT token provided");
            }
        }

        await _next(context);
    }

    private string? ExtractTokenFromRequest(HttpRequest request)
    {
        // Check Authorization header
        var authHeader = request.Headers["Authorization"].FirstOrDefault();
        if (authHeader?.StartsWith("Bearer ") == true)
        {
            return authHeader.Substring("Bearer ".Length).Trim();
        }

        // Check query parameter (for WebSocket connections)
        var tokenFromQuery = request.Query["access_token"].FirstOrDefault();
        if (!string.IsNullOrEmpty(tokenFromQuery))
        {
            return tokenFromQuery;
        }

        // Check cookie (for web applications)
        var tokenFromCookie = request.Cookies["access_token"];
        if (!string.IsNullOrEmpty(tokenFromCookie))
        {
            return tokenFromCookie;
        }

        return null;
    }

    private ClaimsPrincipal? ValidateToken(string token)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Secret"] ?? "default-secret-key-change-in-production");

            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = _configuration["Jwt:Issuer"] ?? "smajobb",
                ValidateAudience = true,
                ValidAudience = _configuration["Jwt:Audience"] ?? "smajobb-users",
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            };

            var principal = tokenHandler.ValidateToken(token, validationParameters, out SecurityToken validatedToken);
            return principal;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Token validation failed");
            return null;
        }
    }
}
