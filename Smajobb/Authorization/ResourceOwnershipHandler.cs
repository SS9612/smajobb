using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

namespace Smajobb.Authorization;

public class ResourceOwnershipRequirement : IAuthorizationRequirement
{
    public string ResourceType { get; }
    public string ResourceIdParameter { get; }

    public ResourceOwnershipRequirement(string resourceType, string resourceIdParameter)
    {
        ResourceType = resourceType;
        ResourceIdParameter = resourceIdParameter;
    }
}

public class ResourceOwnershipHandler : AuthorizationHandler<ResourceOwnershipRequirement>
{
    private readonly IHttpContextAccessor _httpContextAccessor;

    public ResourceOwnershipHandler(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        ResourceOwnershipRequirement requirement)
    {
        var user = context.User;
        var httpContext = _httpContextAccessor.HttpContext;

        if (httpContext == null)
        {
            return Task.CompletedTask;
        }

        var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userRole = user.FindFirst(ClaimTypes.Role)?.Value;

        // Admins and moderators can access any resource
        if (userRole == "admin" || userRole == "moderator")
        {
            context.Succeed(requirement);
            return Task.CompletedTask;
        }

        // Get the resource ID from route parameters
        if (!httpContext.Request.RouteValues.TryGetValue(requirement.ResourceIdParameter, out var resourceIdValue))
        {
            return Task.CompletedTask;
        }

        if (!Guid.TryParse(resourceIdValue?.ToString(), out var resourceId))
        {
            return Task.CompletedTask;
        }

        // Check ownership based on resource type
        var hasAccess = requirement.ResourceType.ToLower() switch
        {
            "job" => CheckJobOwnership(userId, resourceId),
            "booking" => CheckBookingOwnership(userId, resourceId),
            "user" => CheckUserOwnership(userId, resourceId),
            _ => false
        };

        if (hasAccess)
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }

    private static bool CheckJobOwnership(string? userId, Guid jobId)
    {
        // This would typically involve a database query to check if the user owns the job
        // For now, we'll implement a simple check that could be enhanced with actual database access
        return true; // Placeholder - implement actual ownership check
    }

    private static bool CheckBookingOwnership(string? userId, Guid bookingId)
    {
        // This would typically involve a database query to check if the user is involved in the booking
        // (either as customer or youth)
        return true; // Placeholder - implement actual ownership check
    }

    private static bool CheckUserOwnership(string? userId, Guid targetUserId)
    {
        return userId != null && Guid.TryParse(userId, out var parsedUserId) && parsedUserId == targetUserId;
    }
}
