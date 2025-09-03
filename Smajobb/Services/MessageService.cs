using Microsoft.EntityFrameworkCore;
using Smajobb.Data;
using Smajobb.DTOs;
using Smajobb.Models;
using Smajobb.Services.Interfaces;

namespace Smajobb.Services;

public class MessageService : IMessageService
{
    private readonly SmajobbDbContext _db;

    public MessageService(SmajobbDbContext db)
    {
        _db = db;
    }

    public async Task<IReadOnlyList<ConversationSummaryDto>> GetConversationsAsync(Guid currentUserId, int page, int pageSize)
    {
        // Latest message per counterpart and unread count
        var messagesQuery = _db.Messages
            .AsNoTracking()
            .Where(m => (m.SenderId == currentUserId || m.ReceiverId == currentUserId) && !m.IsDeleted);

        var grouped = await messagesQuery
            .GroupBy(m => m.SenderId == currentUserId ? m.ReceiverId : m.SenderId)
            .Select(g => new
            {
                OtherUserId = g.Key,
                LastMessageAt = g.Max(m => m.CreatedAt),
                UnreadCount = g.Count(m => m.ReceiverId == currentUserId && !m.IsRead)
            })
            .OrderByDescending(x => x.LastMessageAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        var otherUserIds = grouped.Select(x => x.OtherUserId).ToList();

        var lastMessages = await _db.Messages
            .AsNoTracking()
            .Where(m => (m.SenderId == currentUserId && otherUserIds.Contains(m.ReceiverId)) ||
                        (m.ReceiverId == currentUserId && otherUserIds.Contains(m.SenderId)))
            .OrderByDescending(m => m.CreatedAt)
            .ToListAsync();

        var users = await _db.Users
            .AsNoTracking()
            .Where(u => otherUserIds.Contains(u.Id))
            .ToDictionaryAsync(u => u.Id, u => u.DisplayName ?? "Användare");

        var summaries = new List<ConversationSummaryDto>();
        foreach (var item in grouped)
        {
            var last = lastMessages.FirstOrDefault(m => (m.SenderId == currentUserId && m.ReceiverId == item.OtherUserId) ||
                                                        (m.ReceiverId == currentUserId && m.SenderId == item.OtherUserId));
            summaries.Add(new ConversationSummaryDto
            {
                OtherUserId = item.OtherUserId,
                OtherUserDisplayName = users.TryGetValue(item.OtherUserId, out var name) ? name : "Användare",
                OtherUserAvatarUrl = null,
                LastMessage = last?.Content ?? string.Empty,
                LastMessageAt = item.LastMessageAt,
                UnreadCount = item.UnreadCount
            });
        }

        return summaries;
    }

    public async Task<IReadOnlyList<MessageDto>> GetMessagesWithUserAsync(Guid currentUserId, Guid otherUserId, int page, int pageSize)
    {
        var messages = await _db.Messages
            .AsNoTracking()
            .Where(m => !m.IsDeleted &&
                        ((m.SenderId == currentUserId && m.ReceiverId == otherUserId) ||
                         (m.SenderId == otherUserId && m.ReceiverId == currentUserId)))
            .OrderByDescending(m => m.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return messages
            .OrderBy(m => m.CreatedAt)
            .Select(MapMessage)
            .ToList();
    }

    public async Task<MessageDto> SendMessageAsync(Guid senderId, SendMessageRequestDto request)
    {
        var message = new Message
        {
            SenderId = senderId,
            ReceiverId = request.ReceiverId,
            Content = request.Content,
            Type = request.Type,
            BookingId = request.BookingId,
            CreatedAt = DateTime.UtcNow,
        };

        _db.Messages.Add(message);
        await _db.SaveChangesAsync();

        return MapMessage(message);
    }

    public async Task<bool> MarkAsReadAsync(Guid currentUserId, Guid messageId)
    {
        var message = await _db.Messages.FirstOrDefaultAsync(m => m.Id == messageId && m.ReceiverId == currentUserId);
        if (message == null)
        {
            return false;
        }

        if (!message.IsRead)
        {
            message.IsRead = true;
            message.ReadAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
        }

        return true;
    }

    public async Task<int> MarkConversationAsReadAsync(Guid currentUserId, Guid otherUserId)
    {
        var unread = await _db.Messages
            .Where(m => m.ReceiverId == currentUserId && m.SenderId == otherUserId && !m.IsRead)
            .ToListAsync();

        foreach (var m in unread)
        {
            m.IsRead = true;
            m.ReadAt = DateTime.UtcNow;
        }

        await _db.SaveChangesAsync();
        return unread.Count;
    }

    private static MessageDto MapMessage(Message m) => new MessageDto
    {
        Id = m.Id,
        SenderId = m.SenderId,
        ReceiverId = m.ReceiverId,
        Content = m.Content,
        Type = m.Type,
        CreatedAt = m.CreatedAt,
        IsRead = m.IsRead,
        ReadAt = m.ReadAt,
    };
}


