using Microsoft.EntityFrameworkCore;
using Smajobb.Data;
using Smajobb.DTOs;
using Smajobb.Models;
using Smajobb.Services.Interfaces;
using Microsoft.AspNetCore.SignalR;
using Smajobb.Hubs;

namespace Smajobb.Services;

public class NotificationService : INotificationService
{
    private readonly SmajobbDbContext _db;
    private readonly ILogger<NotificationService> _logger;
    private readonly IHubContext<NotificationHub> _hubContext;

    public NotificationService(
        SmajobbDbContext db, 
        ILogger<NotificationService> logger,
        IHubContext<NotificationHub> hubContext)
    {
        _db = db;
        _logger = logger;
        _hubContext = hubContext;
    }

    public async Task<NotificationDto> CreateNotificationAsync(CreateNotificationDto notificationDto)
    {
        var notification = new Notification
        {
            UserId = Guid.Parse(notificationDto.UserId),
            Type = notificationDto.Type,
            Title = notificationDto.Title,
            Message = notificationDto.Message,
            ActionUrl = notificationDto.ActionUrl,
            Priority = notificationDto.Priority,
            IsRead = false,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = notificationDto.ExpiresAt,
            Data = notificationDto.Data
        };

        _db.Notifications.Add(notification);
        await _db.SaveChangesAsync();

        // Send real-time notification
        var eventDto = new NotificationEventDto
        {
            Id = notification.Id.ToString(),
            Type = notification.Type,
            Title = notification.Title,
            Message = notification.Message,
            Priority = notification.Priority.ToString().ToLower(),
            ActionUrl = notification.ActionUrl,
            CreatedAt = notification.CreatedAt,
            Data = notification.Data != null ? System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(notification.Data) : null
        };

        await SendRealTimeNotificationAsync(notification.UserId.ToString(), eventDto);

        return MapToNotificationDto(notification);
    }

    public async Task<IEnumerable<NotificationDto>> CreateBulkNotificationsAsync(BulkNotificationDto bulkDto)
    {
        var notifications = new List<Notification>();
        var eventDto = new NotificationEventDto
        {
            Type = bulkDto.Type,
            Title = bulkDto.Title,
            Message = bulkDto.Message,
            Priority = bulkDto.Priority,
            ActionUrl = bulkDto.ActionUrl,
            ActionText = bulkDto.ActionText,
            CreatedAt = DateTime.UtcNow,
            Data = bulkDto.Metadata
        };

        foreach (var userId in bulkDto.UserIds)
        {
            var notification = new Notification
            {
                UserId = Guid.Parse(userId),
                Type = bulkDto.Type,
                Title = bulkDto.Title,
                Message = bulkDto.Message,
                ActionUrl = bulkDto.ActionUrl,
                Priority = bulkDto.Priority,
                IsRead = false,
                CreatedAt = DateTime.UtcNow,
                ExpiresAt = bulkDto.ExpiresAt,
                Data = bulkDto.Data
            };

            notifications.Add(notification);
        }

        _db.Notifications.AddRange(notifications);
        await _db.SaveChangesAsync();

        // Send real-time notifications
        await SendBulkRealTimeNotificationsAsync(bulkDto.UserIds, eventDto);

        return notifications.Select(MapToNotificationDto);
    }

    public async Task<NotificationDto?> GetNotificationByIdAsync(string id)
    {
        var notification = await _db.Notifications
            .Include(n => n.User)
            .FirstOrDefaultAsync(n => n.Id == Guid.Parse(id));

        return notification != null ? MapToNotificationDto(notification) : null;
    }

    public async Task<NotificationListDto> GetNotificationsByUserIdAsync(string userId, int page = 1, int pageSize = 20, bool unreadOnly = false)
    {
        var query = _db.Notifications
            .Include(n => n.User)
            .Where(n => n.UserId == Guid.Parse(userId));

        if (unreadOnly)
        {
            query = query.Where(n => !n.IsRead);
        }

        var totalCount = await query.CountAsync();
        var unreadCount = await _db.Notifications
            .Where(n => n.UserId == Guid.Parse(userId) && !n.IsRead)
            .CountAsync();

        var notifications = await query
            .OrderByDescending(n => n.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new NotificationListDto
        {
            Items = notifications.Select(MapToNotificationDto),
            TotalCount = totalCount,
            UnreadCount = unreadCount,
            Page = page,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
        };
    }

    public async Task<NotificationDto> UpdateNotificationAsync(string id, UpdateNotificationDto updateDto)
    {
        var notification = await _db.Notifications.FirstOrDefaultAsync(n => n.Id == Guid.Parse(id));
        if (notification == null)
            throw new ArgumentException("Notification not found");

        if (updateDto.IsRead.HasValue)
        {
            notification.IsRead = updateDto.IsRead.Value;
            if (updateDto.IsRead.Value && !notification.ReadAt.HasValue)
            {
                notification.ReadAt = DateTime.UtcNow;
            }
        }

        if (updateDto.ReadAt.HasValue)
        {
            notification.ReadAt = updateDto.ReadAt.Value;
        }

        await _db.SaveChangesAsync();
        return MapToNotificationDto(notification);
    }

    public async Task<bool> DeleteNotificationAsync(string id)
    {
        var notification = await _db.Notifications.FirstOrDefaultAsync(n => n.Id == Guid.Parse(id));
        if (notification == null)
            return false;

        _db.Notifications.Remove(notification);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> MarkNotificationAsReadAsync(string id)
    {
        var notification = await _db.Notifications.FirstOrDefaultAsync(n => n.Id == Guid.Parse(id));
        if (notification == null)
            return false;

        notification.IsRead = true;
        notification.ReadAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<int> MarkAllNotificationsAsReadAsync(string userId)
    {
        var notifications = await _db.Notifications
            .Where(n => n.UserId == Guid.Parse(userId) && !n.IsRead)
            .ToListAsync();

        foreach (var notification in notifications)
        {
            notification.IsRead = true;
            notification.ReadAt = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync();
        return notifications.Count();
    }

    public async Task<bool> DeleteAllNotificationsAsync(string userId)
    {
        var notifications = await _db.Notifications
            .Where(n => n.UserId == Guid.Parse(userId))
            .ToListAsync();

        _db.Notifications.RemoveRange(notifications);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<NotificationStatsDto> GetNotificationStatsAsync(string userId)
    {
        var stats = await _db.Notifications
            .Where(n => n.UserId == Guid.Parse(userId))
            .GroupBy(n => 1)
            .Select(g => new
            {
                TotalCount = g.Count(),
                UnreadCount = g.Count(n => !n.IsRead),
                HighPriorityCount = g.Count(n => n.Priority == "high"),
                UrgentCount = g.Count(n => n.Priority == "urgent"),
                LastNotificationAt = g.Max(n => n.CreatedAt)
            })
            .FirstOrDefaultAsync();

        return new NotificationStatsDto
        {
            TotalNotifications = stats?.TotalCount ?? 0,
            UnreadNotifications = stats?.UnreadCount ?? 0,
            HighPriorityNotifications = stats?.HighPriorityCount ?? 0,
            UrgentNotifications = stats?.UrgentCount ?? 0,
            LastNotificationAt = stats?.LastNotificationAt
        };
    }

    public async Task<int> GetUnreadCountAsync(string userId)
    {
        return await _db.Notifications
            .Where(n => n.UserId == Guid.Parse(userId) && !n.IsRead)
            .CountAsync();
    }

    public async Task SendRealTimeNotificationAsync(string userId, NotificationEventDto notification)
    {
        try
        {
            await _hubContext.Clients.User(userId).SendAsync("ReceiveNotification", notification);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending real-time notification to user {UserId}", userId);
        }
    }

    public async Task SendBulkRealTimeNotificationsAsync(IEnumerable<string> userIds, NotificationEventDto notification)
    {
        try
        {
            var tasks = userIds.Select(userId => 
                _hubContext.Clients.User(userId).SendAsync("ReceiveNotification", notification));
            await Task.WhenAll(tasks);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending bulk real-time notifications");
        }
    }

    public async Task SendBroadcastNotificationAsync(NotificationEventDto notification)
    {
        try
        {
            await _hubContext.Clients.All.SendAsync("ReceiveNotification", notification);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending broadcast notification");
        }
    }

    // Specific notification types
    public async Task SendJobApplicationNotificationAsync(string customerId, string youthId, string jobId, string jobTitle)
    {
        var notification = new CreateNotificationDto
        {
            UserId = customerId,
            Type = "job_application",
            Title = "Ny ansökan",
            Message = $"Du har fått en ny ansökan för jobbet \"{jobTitle}\"",
            ActionUrl = $"/jobs/{jobId}/applications",
            ActionText = "Visa ansökningar",
            Priority = "normal",
            Metadata = new Dictionary<string, object>
            {
                { "jobId", jobId },
                { "youthId", youthId },
                { "jobTitle", jobTitle }
            }
        };

        await CreateNotificationAsync(notification);
    }

    public async Task SendJobAcceptedNotificationAsync(string youthId, string customerId, string jobId, string jobTitle)
    {
        var notification = new CreateNotificationDto
        {
            UserId = youthId,
            Type = "job_accepted",
            Title = "Jobb accepterat!",
            Message = $"Ditt ansökan för jobbet \"{jobTitle}\" har accepterats",
            ActionUrl = $"/jobs/{jobId}",
            ActionText = "Visa jobb",
            Priority = "high",
            Metadata = new Dictionary<string, object>
            {
                { "jobId", jobId },
                { "customerId", customerId },
                { "jobTitle", jobTitle }
            }
        };

        await CreateNotificationAsync(notification);
    }

    public async Task SendJobCompletedNotificationAsync(string customerId, string youthId, string jobId, string jobTitle)
    {
        var notification = new CreateNotificationDto
        {
            UserId = customerId,
            Type = "job_completed",
            Title = "Jobb genomfört",
            Message = $"Jobbet \"{jobTitle}\" har genomförts",
            ActionUrl = $"/jobs/{jobId}",
            ActionText = "Visa jobb",
            Priority = "normal",
            Metadata = new Dictionary<string, object>
            {
                { "jobId", jobId },
                { "youthId", youthId },
                { "jobTitle", jobTitle }
            }
        };

        await CreateNotificationAsync(notification);
    }

    public async Task SendPaymentReceivedNotificationAsync(string userId, string jobId, decimal amount)
    {
        var notification = new CreateNotificationDto
        {
            UserId = userId,
            Type = "payment_received",
            Title = "Betalning mottagen",
            Message = $"Du har fått en betalning på {amount:C}",
            ActionUrl = $"/payments",
            ActionText = "Visa betalningar",
            Priority = "high",
            Metadata = new Dictionary<string, object>
            {
                { "jobId", jobId },
                { "amount", amount }
            }
        };

        await CreateNotificationAsync(notification);
    }

    public async Task SendReviewReceivedNotificationAsync(string userId, string reviewerId, string jobId, int rating)
    {
        var notification = new CreateNotificationDto
        {
            UserId = userId,
            Type = "review_received",
            Title = "Ny recension",
            Message = $"Du har fått en {rating}-stjärnig recension",
            ActionUrl = $"/reviews",
            ActionText = "Visa recensioner",
            Priority = "normal",
            Metadata = new Dictionary<string, object>
            {
                { "jobId", jobId },
                { "reviewerId", reviewerId },
                { "rating", rating }
            }
        };

        await CreateNotificationAsync(notification);
    }

    public async Task SendMessageReceivedNotificationAsync(string receiverId, string senderId, string messagePreview)
    {
        var notification = new CreateNotificationDto
        {
            UserId = receiverId,
            Type = "message_received",
            Title = "Nytt meddelande",
            Message = messagePreview.Length > 50 ? messagePreview.Substring(0, 50) + "..." : messagePreview,
            ActionUrl = "/messages",
            ActionText = "Visa meddelanden",
            Priority = "normal",
            Metadata = new Dictionary<string, object>
            {
                { "senderId", senderId },
                { "messagePreview", messagePreview }
            }
        };

        await CreateNotificationAsync(notification);
    }

    public async Task SendBookingReminderNotificationAsync(string userId, string jobId, string jobTitle, DateTime scheduledTime)
    {
        var notification = new CreateNotificationDto
        {
            UserId = userId,
            Type = "booking_reminder",
            Title = "Påminnelse om jobb",
            Message = $"Jobbet \"{jobTitle}\" är schemalagt för {scheduledTime:HH:mm}",
            ActionUrl = $"/jobs/{jobId}",
            ActionText = "Visa jobb",
            Priority = "high",
            ExpiresAt = scheduledTime.AddHours(1),
            Metadata = new Dictionary<string, object>
            {
                { "jobId", jobId },
                { "jobTitle", jobTitle },
                { "scheduledTime", scheduledTime }
            }
        };

        await CreateNotificationAsync(notification);
    }

    public async Task SendSystemMaintenanceNotificationAsync(IEnumerable<string> userIds, string message, DateTime? scheduledTime = null)
    {
        var bulkDto = new BulkNotificationDto
        {
            UserIds = userIds,
            Type = "system_maintenance",
            Title = "Systemunderhåll",
            Message = message,
            Priority = "urgent",
            ExpiresAt = scheduledTime?.AddHours(2),
            Metadata = new Dictionary<string, object>
            {
                { "scheduledTime", scheduledTime ?? (object)"null" },
                { "isSystemNotification", true }
            }
        };

        await CreateBulkNotificationsAsync(bulkDto);
    }

    public async Task CleanupExpiredNotificationsAsync()
    {
        var expiredNotifications = await _db.Notifications
            .Where(n => n.ExpiresAt.HasValue && n.ExpiresAt < DateTime.UtcNow)
            .ToListAsync();

        if (expiredNotifications.Any())
        {
            _db.Notifications.RemoveRange(expiredNotifications);
            await _db.SaveChangesAsync();
            _logger.LogInformation("Cleaned up {Count} expired notifications", expiredNotifications.Count);
        }
    }

    public async Task CleanupOldNotificationsAsync(int daysOld = 30)
    {
        var cutoffDate = DateTime.UtcNow.AddDays(-daysOld);
        var oldNotifications = await _db.Notifications
            .Where(n => n.CreatedAt < cutoffDate && n.IsRead)
            .ToListAsync();

        if (oldNotifications.Any())
        {
            _db.Notifications.RemoveRange(oldNotifications);
            await _db.SaveChangesAsync();
            _logger.LogInformation("Cleaned up {Count} old notifications", oldNotifications.Count);
        }
    }

    private static NotificationDto MapToNotificationDto(Notification notification) => new NotificationDto
    {
        Id = notification.Id.ToString(),
        UserId = notification.UserId.ToString(),
        Type = notification.Type,
        Title = notification.Title,
        Message = notification.Message,
        ActionUrl = notification.ActionUrl,
        Priority = notification.Priority,
        IsRead = notification.IsRead,
        CreatedAt = notification.CreatedAt,
        ReadAt = notification.ReadAt,
        ExpiresAt = notification.ExpiresAt,
        Data = notification.Data
    };
}
