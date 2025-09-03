using Smajobb.DTOs;

namespace Smajobb.Services.Interfaces;

public interface INotificationService
{
    // CRUD operations
    Task<NotificationDto> CreateNotificationAsync(CreateNotificationDto notificationDto);
    Task<IEnumerable<NotificationDto>> CreateBulkNotificationsAsync(BulkNotificationDto bulkDto);
    Task<NotificationDto?> GetNotificationByIdAsync(string id);
    Task<NotificationListDto> GetNotificationsByUserIdAsync(string userId, int page = 1, int pageSize = 20, bool unreadOnly = false);
    Task<NotificationDto> UpdateNotificationAsync(string id, UpdateNotificationDto updateDto);
    Task<bool> DeleteNotificationAsync(string id);
    Task<bool> MarkNotificationAsReadAsync(string id);
    Task<int> MarkAllNotificationsAsReadAsync(string userId);
    Task<bool> DeleteAllNotificationsAsync(string userId);
    
    // Statistics
    Task<NotificationStatsDto> GetNotificationStatsAsync(string userId);
    Task<int> GetUnreadCountAsync(string userId);
    
    // Real-time notifications
    Task SendRealTimeNotificationAsync(string userId, NotificationEventDto notification);
    Task SendBulkRealTimeNotificationsAsync(IEnumerable<string> userIds, NotificationEventDto notification);
    Task SendBroadcastNotificationAsync(NotificationEventDto notification);
    
    // Notification types and templates
    Task SendJobApplicationNotificationAsync(string customerId, string youthId, string jobId, string jobTitle);
    Task SendJobAcceptedNotificationAsync(string youthId, string customerId, string jobId, string jobTitle);
    Task SendJobCompletedNotificationAsync(string customerId, string youthId, string jobId, string jobTitle);
    Task SendPaymentReceivedNotificationAsync(string userId, string jobId, decimal amount);
    Task SendReviewReceivedNotificationAsync(string userId, string reviewerId, string jobId, int rating);
    Task SendMessageReceivedNotificationAsync(string receiverId, string senderId, string messagePreview);
    Task SendBookingReminderNotificationAsync(string userId, string jobId, string jobTitle, DateTime scheduledTime);
    Task SendSystemMaintenanceNotificationAsync(IEnumerable<string> userIds, string message, DateTime? scheduledTime = null);
    
    // Cleanup
    Task CleanupExpiredNotificationsAsync();
    Task CleanupOldNotificationsAsync(int daysOld = 30);
}