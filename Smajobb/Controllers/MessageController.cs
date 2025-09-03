using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Smajobb.DTOs;
using Smajobb.Services;
using Smajobb.Services.Interfaces;

namespace Smajobb.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MessageController : ControllerBase
{
    private readonly IMessageService _messageService;
    private readonly IHubContext<MessageHub> _hubContext;
    private readonly ILogger<MessageController> _logger;

    public MessageController(IMessageService messageService, IHubContext<MessageHub> hubContext, ILogger<MessageController> logger)
    {
        _messageService = messageService;
        _hubContext = hubContext;
        _logger = logger;
    }

    private bool TryGetUserId(out Guid userId)
    {
        userId = Guid.Empty;
        var claim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
        return claim != null && Guid.TryParse(claim.Value, out userId);
    }

    [HttpGet("conversations")]
    public async Task<IActionResult> GetConversations([FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        if (!TryGetUserId(out var userId))
        {
            return Unauthorized();
        }

        var list = await _messageService.GetConversationsAsync(userId, page, pageSize);
        return Ok(list);
    }

    [HttpGet("with/{otherUserId}")]
    public async Task<IActionResult> GetMessagesWithUser(Guid otherUserId, [FromQuery] int page = 1, [FromQuery] int pageSize = 50)
    {
        if (!TryGetUserId(out var userId))
        {
            return Unauthorized();
        }

        var messages = await _messageService.GetMessagesWithUserAsync(userId, otherUserId, page, pageSize);
        return Ok(messages);
    }

    [HttpPost]
    public async Task<IActionResult> SendMessage([FromBody] SendMessageRequestDto request)
    {
        if (!TryGetUserId(out var userId))
        {
            return Unauthorized();
        }

        if (request.ReceiverId == Guid.Empty || string.IsNullOrWhiteSpace(request.Content))
        {
            return BadRequest("ReceiverId and Content are required");
        }

        var created = await _messageService.SendMessageAsync(userId, request);
        // Notify receiver in real-time
        await _hubContext.Clients.Group($"user:{created.ReceiverId}").SendAsync("messageReceived", created);
        // Optionally notify sender for echo/confirmation
        await _hubContext.Clients.Group($"user:{created.SenderId}").SendAsync("messageSent", created);
        return Ok(created);
    }

    [HttpPost("read/{messageId}")]
    public async Task<IActionResult> MarkAsRead(Guid messageId)
    {
        if (!TryGetUserId(out var userId))
        {
            return Unauthorized();
        }

        var ok = await _messageService.MarkAsReadAsync(userId, messageId);
        if (!ok) return NotFound();
        await _hubContext.Clients.Group($"user:{userId}").SendAsync("messageRead", new { messageId });
        return Ok(new { success = true });
    }

    [HttpPost("read-conversation/{otherUserId}")]
    public async Task<IActionResult> MarkConversationAsRead(Guid otherUserId)
    {
        if (!TryGetUserId(out var userId))
        {
            return Unauthorized();
        }

        var count = await _messageService.MarkConversationAsReadAsync(userId, otherUserId);
        await _hubContext.Clients.Group($"user:{userId}").SendAsync("conversationRead", new { otherUserId, updated = count });
        return Ok(new { success = true, updated = count });
    }
}


