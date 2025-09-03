namespace Smajobb.DTOs;

public record NotificationDto
{
    public string Id { get; init; } = string.Empty;
    public string UserId { get; init; } = string.Empty;
    public string Type { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public string Message { get; init; } = string.Empty;
    public string? Data { get; init; } // JSON data for additional context
    public string? ActionUrl { get; init; }
    public string? ActionText { get; init; }
    public string Priority { get; init; } = "normal"; // low, normal, high, urgent
    public bool IsRead { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime? ReadAt { get; init; }
    public DateTime? ExpiresAt { get; init; }
    public Dictionary<string, object>? Metadata { get; init; }
}

public record CreateNotificationDto
{
    public string UserId { get; init; } = string.Empty;
    public string Type { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public string Message { get; init; } = string.Empty;
    public string? Data { get; init; }
    public string? ActionUrl { get; init; }
    public string? ActionText { get; init; }
    public string Priority { get; init; } = "normal";
    public DateTime? ExpiresAt { get; init; }
    public Dictionary<string, object>? Metadata { get; init; }
}

public record UpdateNotificationDto
{
    public bool? IsRead { get; init; }
    public DateTime? ReadAt { get; init; }
}

public record NotificationListDto
{
    public IEnumerable<NotificationDto> Items { get; init; } = Enumerable.Empty<NotificationDto>();
    public int TotalCount { get; init; }
    public int UnreadCount { get; init; }
    public int Page { get; init; }
    public int PageSize { get; init; }
    public int TotalPages { get; init; }
}

public record NotificationStatsDto
{
    public int TotalNotifications { get; init; }
    public int UnreadNotifications { get; init; }
    public int HighPriorityNotifications { get; init; }
    public int UrgentNotifications { get; init; }
    public DateTime? LastNotificationAt { get; init; }
}

// Real-time notification events
public record NotificationEventDto
{
    public string Id { get; init; } = string.Empty;
    public string Type { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public string Message { get; init; } = string.Empty;
    public string Priority { get; init; } = "normal";
    public string? ActionUrl { get; init; }
    public string? ActionText { get; init; }
    public DateTime CreatedAt { get; init; }
    public Dictionary<string, object>? Data { get; init; }
}

// Bulk notification operations
public record BulkNotificationDto
{
    public IEnumerable<string> UserIds { get; init; } = Enumerable.Empty<string>();
    public string Type { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public string Message { get; init; } = string.Empty;
    public string? Data { get; init; }
    public string? ActionUrl { get; init; }
    public string? ActionText { get; init; }
    public string Priority { get; init; } = "normal";
    public DateTime? ExpiresAt { get; init; }
    public Dictionary<string, object>? Metadata { get; init; }
}