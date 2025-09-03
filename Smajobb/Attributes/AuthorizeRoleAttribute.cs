using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System.Security.Claims;

namespace Smajobb.Attributes;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class AuthorizeRoleAttribute : Attribute, IAuthorizationFilter
{
    private readonly string[] _allowedRoles;

    public AuthorizeRoleAttribute(params string[] allowedRoles)
    {
        _allowedRoles = allowedRoles;
    }

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        var user = context.HttpContext.User;
        
        if (!user.Identity?.IsAuthenticated ?? true)
        {
            context.Result = new UnauthorizedObjectResult(new { message = "Authentication required" });
            return;
        }

        var userRole = user.FindFirst(ClaimTypes.Role)?.Value;
        
        if (string.IsNullOrEmpty(userRole) || !_allowedRoles.Contains(userRole))
        {
            context.Result = new ForbidResult();
            return;
        }
    }
}

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class AuthorizeCustomerAttribute : AuthorizeRoleAttribute
{
    public AuthorizeCustomerAttribute() : base("customer") { }
}

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class AuthorizeYouthAttribute : AuthorizeRoleAttribute
{
    public AuthorizeYouthAttribute() : base("youth") { }
}

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class AuthorizeAdminAttribute : AuthorizeRoleAttribute
{
    public AuthorizeAdminAttribute() : base("admin") { }
}

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class AuthorizeModeratorAttribute : AuthorizeRoleAttribute
{
    public AuthorizeModeratorAttribute() : base("moderator", "admin") { }
}
