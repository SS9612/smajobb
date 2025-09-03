using Smajobb.DTOs;
using Smajobb.Models;

namespace Smajobb.Services.Interfaces;

public interface IModerationService
{
    // Job moderation
    Task<bool> ModerateJobAsync(Guid jobId);
    Task<bool> ApproveJobAsync(Guid jobId, Guid moderatorId);
    Task<bool> RejectJobAsync(Guid jobId, Guid moderatorId, string reason);
    Task<bool> FlagJobForReviewAsync(Guid jobId, string reason);
    
    // Category management
    Task<IEnumerable<string>> GetForbiddenCategoriesAsync();
    Task<bool> AddForbiddenCategoryAsync(string category, Guid moderatorId);
    Task<bool> RemoveForbiddenCategoryAsync(string category, Guid moderatorId);
    
    // Review queue
    Task<IEnumerable<ModerationQueueItem>> GetModerationQueueAsync();
    Task<ModerationQueueItem?> GetModerationQueueItemAsync(Guid itemId);
    Task<bool> ProcessModerationQueueItemAsync(Guid itemId, string action, Guid moderatorId, string? reason = null);
    
    // User moderation
    Task<bool> ModerateUserAsync(Guid userId);
    Task<bool> SuspendUserAsync(Guid userId, Guid moderatorId, string reason, DateTime? until = null);
    Task<bool> UnsuspendUserAsync(Guid userId, Guid moderatorId);
}

public record ModerationQueueItem
{
    public Guid Id { get; init; }
    public string Type { get; init; } = string.Empty; // 'job', 'user', 'review'
    public Guid EntityId { get; init; }
    public string Status { get; init; } = string.Empty; // 'pending', 'approved', 'rejected'
    public string? Reason { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime? ProcessedAt { get; init; }
    public Guid? ProcessedBy { get; init; }
}
