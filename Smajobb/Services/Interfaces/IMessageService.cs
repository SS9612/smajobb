using Smajobb.DTOs;

namespace Smajobb.Services.Interfaces;

public interface IMessageService
{
    Task<IReadOnlyList<ConversationSummaryDto>> GetConversationsAsync(Guid currentUserId, int page, int pageSize);
    Task<IReadOnlyList<MessageDto>> GetMessagesWithUserAsync(Guid currentUserId, Guid otherUserId, int page, int pageSize);
    Task<MessageDto> SendMessageAsync(Guid senderId, SendMessageRequestDto request);
    Task<bool> MarkAsReadAsync(Guid currentUserId, Guid messageId);
    Task<int> MarkConversationAsReadAsync(Guid currentUserId, Guid otherUserId);
}


