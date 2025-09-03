using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Smajobb.Configuration;

public static class AuthConfiguration
{
    public static void ConfigureJwtAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        var jwtSettings = configuration.GetSection("Jwt");
        var secretKey = jwtSettings["Secret"] ?? "default-secret-key-change-in-production";
        var issuer = jwtSettings["Issuer"] ?? "smajobb";
        var audience = jwtSettings["Audience"] ?? "smajobb-users";

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secretKey)),
                ValidateIssuer = true,
                ValidIssuer = issuer,
                ValidateAudience = true,
                ValidAudience = audience,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero,
                RequireExpirationTime = true
            };

            // Handle token from query string for WebSocket connections
            options.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    var accessToken = context.Request.Query["access_token"];
                    var path = context.HttpContext.Request.Path;
                    
                    if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hub"))
                    {
                        context.Token = accessToken;
                    }
                    
                    return Task.CompletedTask;
                },
                OnAuthenticationFailed = context =>
                {
                    if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
                    {
                        context.Response.Headers.Add("Token-Expired", "true");
                    }
                    return Task.CompletedTask;
                }
            };
        });
    }

    public static void ConfigureAuthorizationPolicies(this IServiceCollection services)
    {
        services.AddAuthorization(options =>
        {
            // Role-based policies
            options.AddPolicy("CustomerOnly", policy =>
                policy.RequireRole("customer"));

            options.AddPolicy("YouthOnly", policy =>
                policy.RequireRole("youth"));

            options.AddPolicy("AdminOnly", policy =>
                policy.RequireRole("admin"));

            options.AddPolicy("ModeratorOrAdmin", policy =>
                policy.RequireRole("moderator", "admin"));

            // Resource ownership policies
            options.AddPolicy("JobOwner", policy =>
                policy.AddRequirements(new ResourceOwnershipRequirement("job", "id")));

            options.AddPolicy("BookingParticipant", policy =>
                policy.AddRequirements(new ResourceOwnershipRequirement("booking", "id")));

            options.AddPolicy("UserOwner", policy =>
                policy.AddRequirements(new ResourceOwnershipRequirement("user", "id")));

            // Combined policies
            options.AddPolicy("JobOwnerOrAdmin", policy =>
            {
                policy.RequireRole("admin");
                policy.AddRequirements(new ResourceOwnershipRequirement("job", "id"));
            });

            options.AddPolicy("BookingParticipantOrAdmin", policy =>
            {
                policy.RequireRole("admin");
                policy.AddRequirements(new ResourceOwnershipRequirement("booking", "id"));
            });

            // Permission-based policies
            options.AddPolicy("CanCreateJobs", policy =>
                policy.RequireAssertion(context =>
                    context.User.IsInRole("customer") || context.User.IsInRole("admin")));

            options.AddPolicy("CanModerate", policy =>
                policy.RequireAssertion(context =>
                    context.User.IsInRole("moderator") || context.User.IsInRole("admin")));

            options.AddPolicy("CanViewAnalytics", policy =>
                policy.RequireAssertion(context =>
                    context.User.IsInRole("admin") || context.User.IsInRole("moderator")));
        });
    }
}
