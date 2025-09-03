using System.Security.Claims;

namespace Smajobb.Services.Interfaces;

public interface IAuthorizationService
{
    Task<bool> CanAccessResourceAsync(Guid userId, string resourceType, Guid resourceId);
    Task<bool> CanModifyResourceAsync(Guid userId, string resourceType, Guid resourceId);
    Task<bool> IsUserInRoleAsync(Guid userId, string role);
    Task<bool> HasPermissionAsync(Guid userId, string permission);
    Task<IEnumerable<string>> GetUserPermissionsAsync(Guid userId);
    Task<IEnumerable<string>> GetUserRolesAsync(Guid userId);
}

public interface IPermissionService
{
    Task<bool> HasPermissionAsync(Guid userId, string resourceType, string action);
    Task<IEnumerable<string>> GetResourcePermissionsAsync(Guid userId, string resourceType);
    Task<bool> CanAccessUserDataAsync(Guid requestingUserId, Guid targetUserId);
    Task<bool> CanModifyJobAsync(Guid userId, Guid jobId);
    Task<bool> CanModifyBookingAsync(Guid userId, Guid bookingId);
    Task<bool> CanViewUserProfileAsync(Guid requestingUserId, Guid targetUserId);
}
