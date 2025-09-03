using Microsoft.EntityFrameworkCore;
using Smajobb.Data;
using Smajobb.Services.Interfaces;
using System.Security.Claims;

namespace Smajobb.Services;

public class AuthorizationService : IAuthorizationService
{
    private readonly SmajobbDbContext _context;
    private readonly ILogger<AuthorizationService> _logger;

    public AuthorizationService(SmajobbDbContext context, ILogger<AuthorizationService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<bool> CanAccessResourceAsync(Guid userId, string resourceType, Guid resourceId)
    {
        try
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;

            // Admins can access everything
            if (user.Role == "admin") return true;

            return resourceType.ToLower() switch
            {
                "job" => await CanAccessJobAsync(userId, resourceId),
                "booking" => await CanAccessBookingAsync(userId, resourceId),
                "user" => await CanAccessUserAsync(userId, resourceId),
                "worksession" => await CanAccessWorkSessionAsync(userId, resourceId),
                "payment" => await CanAccessPaymentAsync(userId, resourceId),
                _ => false
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking resource access for user {UserId}, resource {ResourceType}:{ResourceId}", 
                userId, resourceType, resourceId);
            return false;
        }
    }

    public async Task<bool> CanModifyResourceAsync(Guid userId, string resourceType, Guid resourceId)
    {
        try
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;

            // Admins and moderators can modify most resources
            if (user.Role == "admin" || user.Role == "moderator") return true;

            return resourceType.ToLower() switch
            {
                "job" => await CanModifyJobAsync(userId, resourceId),
                "booking" => await CanModifyBookingAsync(userId, resourceId),
                "user" => await CanModifyUserAsync(userId, resourceId),
                "worksession" => await CanModifyWorkSessionAsync(userId, resourceId),
                _ => false
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking resource modification for user {UserId}, resource {ResourceType}:{ResourceId}", 
                userId, resourceType, resourceId);
            return false;
        }
    }

    public async Task<bool> IsUserInRoleAsync(Guid userId, string role)
    {
        try
        {
            var user = await _context.Users.FindAsync(userId);
            return user?.Role == role;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking user role for user {UserId}", userId);
            return false;
        }
    }

    public async Task<bool> HasPermissionAsync(Guid userId, string permission)
    {
        try
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;

            // Map roles to permissions
            var rolePermissions = GetRolePermissions(user.Role);
            return rolePermissions.Contains(permission);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking permission for user {UserId}", userId);
            return false;
        }
    }

    public async Task<IEnumerable<string>> GetUserPermissionsAsync(Guid userId)
    {
        try
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return Enumerable.Empty<string>();

            return GetRolePermissions(user.Role);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting permissions for user {UserId}", userId);
            return Enumerable.Empty<string>();
        }
    }

    public async Task<IEnumerable<string>> GetUserRolesAsync(Guid userId)
    {
        try
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return Enumerable.Empty<string>();

            return new[] { user.Role };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting roles for user {UserId}", userId);
            return Enumerable.Empty<string>();
        }
    }

    private async Task<bool> CanAccessJobAsync(Guid userId, Guid jobId)
    {
        var job = await _context.Jobs.FindAsync(jobId);
        if (job == null) return false;

        // Job creator can access their own jobs
        if (job.CreatorId == userId) return true;

        // Users can view public jobs
        return job.Status == "open" || job.Status == "in_progress";
    }

    private async Task<bool> CanAccessBookingAsync(Guid userId, Guid bookingId)
    {
        var booking = await _context.Bookings.FindAsync(bookingId);
        if (booking == null) return false;

        // Customer and youth can access their bookings
        return booking.CustomerId == userId || booking.YouthId == userId;
    }

    private async Task<bool> CanAccessUserAsync(Guid userId, Guid targetUserId)
    {
        // Users can access their own profile
        if (userId == targetUserId) return true;

        // For now, allow access to other user profiles (could be restricted later)
        return true;
    }

    private async Task<bool> CanAccessWorkSessionAsync(Guid userId, Guid workSessionId)
    {
        var workSession = await _context.WorkSessions
            .Include(ws => ws.Booking)
            .FirstOrDefaultAsync(ws => ws.Id == workSessionId);

        if (workSession?.Booking == null) return false;

        // Youth can access their own work sessions
        if (workSession.YouthId == userId) return true;

        // Customer can access work sessions for their bookings
        return workSession.Booking.CustomerId == userId;
    }

    private async Task<bool> CanAccessPaymentAsync(Guid userId, Guid paymentId)
    {
        var payment = await _context.Payments.FindAsync(paymentId);
        if (payment == null) return false;

        // Users can access payments they're involved in
        return payment.FromUserId == userId || payment.ToUserId == userId;
    }

    private async Task<bool> CanModifyJobAsync(Guid userId, Guid jobId)
    {
        var job = await _context.Jobs.FindAsync(jobId);
        if (job == null) return false;

        // Only job creator can modify their jobs
        return job.CreatorId == userId;
    }

    private async Task<bool> CanModifyBookingAsync(Guid userId, Guid bookingId)
    {
        var booking = await _context.Bookings.FindAsync(bookingId);
        if (booking == null) return false;

        // Customer and youth can modify their bookings
        return booking.CustomerId == userId || booking.YouthId == userId;
    }

    private async Task<bool> CanModifyUserAsync(Guid userId, Guid targetUserId)
    {
        // Users can only modify their own profile
        return userId == targetUserId;
    }

    private async Task<bool> CanModifyWorkSessionAsync(Guid userId, Guid workSessionId)
    {
        var workSession = await _context.WorkSessions.FindAsync(workSessionId);
        if (workSession == null) return false;

        // Only youth can modify their own work sessions
        return workSession.YouthId == userId;
    }

    private static IEnumerable<string> GetRolePermissions(string role)
    {
        return role.ToLower() switch
        {
            "admin" => new[]
            {
                "read:all", "write:all", "delete:all", "moderate:all",
                "manage:users", "manage:jobs", "manage:bookings", "manage:payments",
                "view:analytics", "manage:system"
            },
            "moderator" => new[]
            {
                "read:all", "moderate:jobs", "moderate:bookings", "moderate:users",
                "view:reports", "manage:disputes"
            },
            "customer" => new[]
            {
                "read:own", "write:own", "create:jobs", "manage:own_jobs",
                "book:jobs", "manage:own_bookings", "view:own_payments"
            },
            "youth" => new[]
            {
                "read:own", "write:own", "apply:jobs", "manage:own_bookings",
                "track:work", "view:own_payments", "manage:own_profile"
            },
            _ => new[] { "read:own" }
        };
    }
}
