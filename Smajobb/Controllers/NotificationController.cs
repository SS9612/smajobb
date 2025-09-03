using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Smajobb.DTOs;
using Smajobb.Services.Interfaces;

namespace Smajobb.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class NotificationController : ControllerBase
{
    private readonly INotificationService _notificationService;
    private readonly ILogger<NotificationController> _logger;

    public NotificationController(INotificationService notificationService, ILogger<NotificationController> logger)
    {
        _notificationService = notificationService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetNotifications([FromQuery] int page = 1, [FromQuery] int pageSize = 20, [FromQuery] bool unreadOnly = false)
    {
        try
        {
            var userId = GetCurrentUserId();
            var notifications = await _notificationService.GetNotificationsByUserIdAsync(userId, page, pageSize, unreadOnly);
            return Ok(notifications);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting notifications for user");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetNotification(string id)
    {
        try
        {
            var notification = await _notificationService.GetNotificationByIdAsync(id);
            if (notification == null)
                return NotFound();

            return Ok(notification);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting notification: {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetNotificationStats()
    {
        try
        {
            var userId = GetCurrentUserId();
            var stats = await _notificationService.GetNotificationStatsAsync(userId);
            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting notification stats");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("unread-count")]
    public async Task<IActionResult> GetUnreadCount()
    {
        try
        {
            var userId = GetCurrentUserId();
            var count = await _notificationService.GetUnreadCountAsync(userId);
            return Ok(new { count });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting unread count");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateNotification([FromBody] CreateNotificationDto notificationDto)
    {
        try
        {
            var notification = await _notificationService.CreateNotificationAsync(notificationDto);
            return CreatedAtAction(nameof(GetNotification), new { id = notification.Id }, notification);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating notification");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("bulk")]
    public async Task<IActionResult> CreateBulkNotifications([FromBody] BulkNotificationDto bulkDto)
    {
        try
        {
            var notifications = await _notificationService.CreateBulkNotificationsAsync(bulkDto);
            return Ok(notifications);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating bulk notifications");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateNotification(string id, [FromBody] UpdateNotificationDto updateDto)
    {
        try
        {
            var notification = await _notificationService.UpdateNotificationAsync(id, updateDto);
            return Ok(notification);
        }
        catch (ArgumentException)
        {
            return NotFound();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating notification: {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPut("{id}/read")]
    public async Task<IActionResult> MarkNotificationAsRead(string id)
    {
        try
        {
            var success = await _notificationService.MarkNotificationAsReadAsync(id);
            if (!success)
                return NotFound();

            return Ok(new { success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error marking notification as read: {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPut("mark-all-read")]
    public async Task<IActionResult> MarkAllNotificationsAsRead()
    {
        try
        {
            var userId = GetCurrentUserId();
            var count = await _notificationService.MarkAllNotificationsAsReadAsync(userId);
            return Ok(new { count });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error marking all notifications as read");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteNotification(string id)
    {
        try
        {
            var success = await _notificationService.DeleteNotificationAsync(id);
            if (!success)
                return NotFound();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting notification: {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpDelete("all")]
    public async Task<IActionResult> DeleteAllNotifications()
    {
        try
        {
            var userId = GetCurrentUserId();
            var success = await _notificationService.DeleteAllNotificationsAsync(userId);
            return Ok(new { success });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting all notifications");
            return StatusCode(500, "Internal server error");
        }
    }

    // Specific notification endpoints
    [HttpPost("job-application")]
    public async Task<IActionResult> SendJobApplicationNotification([FromBody] JobApplicationNotificationRequest request)
    {
        try
        {
            await _notificationService.SendJobApplicationNotificationAsync(
                request.CustomerId, 
                request.YouthId, 
                request.JobId, 
                request.JobTitle
            );
            return Ok(new { success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending job application notification");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("job-accepted")]
    public async Task<IActionResult> SendJobAcceptedNotification([FromBody] JobAcceptedNotificationRequest request)
    {
        try
        {
            await _notificationService.SendJobAcceptedNotificationAsync(
                request.YouthId, 
                request.CustomerId, 
                request.JobId, 
                request.JobTitle
            );
            return Ok(new { success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending job accepted notification");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("payment-received")]
    public async Task<IActionResult> SendPaymentReceivedNotification([FromBody] PaymentReceivedNotificationRequest request)
    {
        try
        {
            await _notificationService.SendPaymentReceivedNotificationAsync(
                request.UserId, 
                request.JobId, 
                request.Amount
            );
            return Ok(new { success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending payment received notification");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("message-received")]
    public async Task<IActionResult> SendMessageReceivedNotification([FromBody] MessageReceivedNotificationRequest request)
    {
        try
        {
            await _notificationService.SendMessageReceivedNotificationAsync(
                request.ReceiverId, 
                request.SenderId, 
                request.MessagePreview
            );
            return Ok(new { success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending message received notification");
            return StatusCode(500, "Internal server error");
        }
    }

    private string GetCurrentUserId()
    {
        return User.FindFirst("userId")?.Value ?? string.Empty;
    }
}

// Request DTOs for specific notifications
public record JobApplicationNotificationRequest
{
    public string CustomerId { get; init; } = string.Empty;
    public string YouthId { get; init; } = string.Empty;
    public string JobId { get; init; } = string.Empty;
    public string JobTitle { get; init; } = string.Empty;
}

public record JobAcceptedNotificationRequest
{
    public string YouthId { get; init; } = string.Empty;
    public string CustomerId { get; init; } = string.Empty;
    public string JobId { get; init; } = string.Empty;
    public string JobTitle { get; init; } = string.Empty;
}

public record PaymentReceivedNotificationRequest
{
    public string UserId { get; init; } = string.Empty;
    public string JobId { get; init; } = string.Empty;
    public decimal Amount { get; init; }
}

public record MessageReceivedNotificationRequest
{
    public string ReceiverId { get; init; } = string.Empty;
    public string SenderId { get; init; } = string.Empty;
    public string MessagePreview { get; init; } = string.Empty;
}