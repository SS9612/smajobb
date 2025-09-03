using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace Smajobb.Hubs;

[Authorize]
public class NotificationHub : Hub
{
    private readonly ILogger<NotificationHub> _logger;

    public NotificationHub(ILogger<NotificationHub> logger)
    {
        _logger = logger;
    }

    public override async Task OnConnectedAsync()
    {
        var userId = GetUserId();
        if (!string.IsNullOrEmpty(userId))
        {
            // Add user to their personal group
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
            _logger.LogInformation("User {UserId} connected to notification hub", userId);
        }

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = GetUserId();
        if (!string.IsNullOrEmpty(userId))
        {
            // Remove user from their personal group
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"user_{userId}");
            _logger.LogInformation("User {UserId} disconnected from notification hub", userId);
        }

        await base.OnDisconnectedAsync(exception);
    }

    // Method for clients to join specific groups (e.g., job-specific notifications)
    public async Task JoinGroup(string groupName)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        _logger.LogInformation("User {UserId} joined group {GroupName}", GetUserId(), groupName);
    }

    // Method for clients to leave specific groups
    public async Task LeaveGroup(string groupName)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
        _logger.LogInformation("User {UserId} left group {GroupName}", GetUserId(), groupName);
    }

    // Method for clients to mark notifications as read
    public async Task MarkNotificationAsRead(string notificationId)
    {
        var userId = GetUserId();
        if (!string.IsNullOrEmpty(userId))
        {
            // This would typically call a service to mark the notification as read
            // For now, we'll just acknowledge the request
            await Clients.Caller.SendAsync("NotificationMarkedAsRead", notificationId);
            _logger.LogInformation("User {UserId} marked notification {NotificationId} as read", userId, notificationId);
        }
    }

    // Method for clients to get their unread count
    public async Task GetUnreadCount()
    {
        var userId = GetUserId();
        if (!string.IsNullOrEmpty(userId))
        {
            // This would typically call a service to get the unread count
            // For now, we'll send a placeholder
            await Clients.Caller.SendAsync("UnreadCountUpdated", 0);
        }
    }

    private string? GetUserId()
    {
        return Context.User?.FindFirst("userId")?.Value;
    }
}
