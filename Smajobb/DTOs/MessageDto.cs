namespace Smajobb.DTOs;

public record MessageDto
{
    public Guid Id { get; init; }
    public Guid SenderId { get; init; }
    public Guid ReceiverId { get; init; }
    public string Content { get; init; } = string.Empty;
    public string Type { get; init; } = "text";
    public DateTime CreatedAt { get; init; }
    public bool IsRead { get; init; }
    public DateTime? ReadAt { get; init; }
}

public record ConversationSummaryDto
{
    public Guid OtherUserId { get; init; }
    public string OtherUserDisplayName { get; init; } = string.Empty;
    public string? OtherUserAvatarUrl { get; init; }
    public string LastMessage { get; init; } = string.Empty;
    public DateTime LastMessageAt { get; init; }
    public int UnreadCount { get; init; }
}

public record SendMessageRequestDto
{
    public Guid ReceiverId { get; init; }
    public string Content { get; init; } = string.Empty;
    public string Type { get; init; } = "text";
    public Guid? BookingId { get; init; }
}


