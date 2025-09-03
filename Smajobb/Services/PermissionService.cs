using Microsoft.EntityFrameworkCore;
using Smajobb.Data;
using Smajobb.Services.Interfaces;

namespace Smajobb.Services;

public class PermissionService : IPermissionService
{
    private readonly SmajobbDbContext _context;
    private readonly ILogger<PermissionService> _logger;

    public PermissionService(SmajobbDbContext context, ILogger<PermissionService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<bool> HasPermissionAsync(Guid userId, string resourceType, string action)
    {
        try
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;

            // Admins have all permissions
            if (user.Role == "admin") return true;

            var permission = $"{action}:{resourceType}";
            var rolePermissions = GetRolePermissions(user.Role);

            return rolePermissions.Contains(permission) || rolePermissions.Contains($"{action}:all");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking permission for user {UserId}, resource {ResourceType}, action {Action}", 
                userId, resourceType, action);
            return false;
        }
    }

    public async Task<IEnumerable<string>> GetResourcePermissionsAsync(Guid userId, string resourceType)
    {
        try
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return Enumerable.Empty<string>();

            var rolePermissions = GetRolePermissions(user.Role);
            return rolePermissions.Where(p => p.EndsWith($":{resourceType}") || p.EndsWith(":all"));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting resource permissions for user {UserId}, resource {ResourceType}", 
                userId, resourceType);
            return Enumerable.Empty<string>();
        }
    }

    public async Task<bool> CanAccessUserDataAsync(Guid requestingUserId, Guid targetUserId)
    {
        try
        {
            // Users can always access their own data
            if (requestingUserId == targetUserId) return true;

            var requestingUser = await _context.Users.FindAsync(requestingUserId);
            if (requestingUser == null) return false;

            // Admins and moderators can access any user data
            if (requestingUser.Role == "admin" || requestingUser.Role == "moderator") return true;

            // For now, allow access to other user profiles (could be restricted later)
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking user data access for user {RequestingUserId} to {TargetUserId}", 
                requestingUserId, targetUserId);
            return false;
        }
    }

    public async Task<bool> CanModifyJobAsync(Guid userId, Guid jobId)
    {
        try
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;

            // Admins and moderators can modify any job
            if (user.Role == "admin" || user.Role == "moderator") return true;

            // Check if user is the job creator
            var job = await _context.Jobs.FindAsync(jobId);
            return job?.CreatorId == userId;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking job modification permission for user {UserId}, job {JobId}", 
                userId, jobId);
            return false;
        }
    }

    public async Task<bool> CanModifyBookingAsync(Guid userId, Guid bookingId)
    {
        try
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;

            // Admins and moderators can modify any booking
            if (user.Role == "admin" || user.Role == "moderator") return true;

            // Check if user is involved in the booking
            var booking = await _context.Bookings.FindAsync(bookingId);
            return booking != null && (booking.CustomerId == userId || booking.YouthId == userId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking booking modification permission for user {UserId}, booking {BookingId}", 
                userId, bookingId);
            return false;
        }
    }

    public async Task<bool> CanViewUserProfileAsync(Guid requestingUserId, Guid targetUserId)
    {
        try
        {
            // Users can always view their own profile
            if (requestingUserId == targetUserId) return true;

            var requestingUser = await _context.Users.FindAsync(requestingUserId);
            if (requestingUser == null) return false;

            // Admins and moderators can view any profile
            if (requestingUser.Role == "admin" || requestingUser.Role == "moderator") return true;

            // For now, allow viewing other profiles (could be restricted based on privacy settings)
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking profile view permission for user {RequestingUserId} to {TargetUserId}", 
                requestingUserId, targetUserId);
            return false;
        }
    }

    private static IEnumerable<string> GetRolePermissions(string role)
    {
        return role.ToLower() switch
        {
            "admin" => new[]
            {
                "read:all", "write:all", "delete:all", "moderate:all",
                "create:jobs", "create:bookings", "create:payments",
                "manage:users", "manage:jobs", "manage:bookings", "manage:payments",
                "view:analytics", "manage:system", "view:reports"
            },
            "moderator" => new[]
            {
                "read:all", "moderate:jobs", "moderate:bookings", "moderate:users",
                "view:reports", "manage:disputes", "view:analytics"
            },
            "customer" => new[]
            {
                "read:own", "write:own", "create:jobs", "manage:own_jobs",
                "book:jobs", "manage:own_bookings", "view:own_payments",
                "read:jobs", "read:user_profiles"
            },
            "youth" => new[]
            {
                "read:own", "write:own", "apply:jobs", "manage:own_bookings",
                "track:work", "view:own_payments", "manage:own_profile",
                "read:jobs", "read:user_profiles"
            },
            _ => new[] { "read:own" }
        };
    }
}
