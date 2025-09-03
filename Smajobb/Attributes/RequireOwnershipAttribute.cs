using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;

namespace Smajobb.Attributes;

[AttributeUsage(AttributeTargets.Method)]
public class RequireOwnershipAttribute : Attribute, IAuthorizationFilter
{
    private readonly string _resourceIdParameter;
    private readonly string _resourceType;

    public RequireOwnershipAttribute(string resourceIdParameter, string resourceType = "resource")
    {
        _resourceIdParameter = resourceIdParameter;
        _resourceType = resourceType;
    }

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var user = context.HttpContext.User;
        
        if (!user.Identity?.IsAuthenticated ?? true)
        {
            context.Result = new UnauthorizedObjectResult(new { message = "Authentication required" });
            return;
        }

        var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userRole = user.FindFirst(ClaimTypes.Role)?.Value;

        // Admins and moderators can access any resource
        if (userRole == "admin" || userRole == "moderator")
        {
            return;
        }

        // Get the resource ID from route parameters
        if (!context.RouteData.Values.TryGetValue(_resourceIdParameter, out var resourceIdValue))
        {
            context.Result = new BadRequestObjectResult(new { message = $"Resource ID parameter '{_resourceIdParameter}' not found" });
            return;
        }

        if (!Guid.TryParse(resourceIdValue?.ToString(), out var resourceId))
        {
            context.Result = new BadRequestObjectResult(new { message = "Invalid resource ID format" });
            return;
        }

        // Check ownership based on resource type
        var hasAccess = _resourceType.ToLower() switch
        {
            "job" => CheckJobOwnership(context, userId, resourceId),
            "booking" => CheckBookingOwnership(context, userId, resourceId),
            "user" => CheckUserOwnership(userId, resourceId),
            _ => false
        };

        if (!hasAccess)
        {
            context.Result = new ForbidResult();
        }
    }

    private static bool CheckJobOwnership(AuthorizationFilterContext context, string? userId, Guid jobId)
    {
        // This would typically involve a database query to check if the user owns the job
        // For now, we'll implement a simple check that could be enhanced with actual database access
        return true; // Placeholder - implement actual ownership check
    }

    private static bool CheckBookingOwnership(AuthorizationFilterContext context, string? userId, Guid bookingId)
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
