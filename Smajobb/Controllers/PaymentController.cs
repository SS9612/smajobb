using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Smajobb.DTOs;
using Smajobb.Services;
using Smajobb.Services.Interfaces;

namespace Smajobb.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentController : ControllerBase
{
    private readonly IPaymentService _paymentService;
    private readonly IHubContext<MessageHub> _hubContext;
    private readonly ILogger<PaymentController> _logger;

    public PaymentController(IPaymentService paymentService, IHubContext<MessageHub> hubContext, ILogger<PaymentController> logger)
    {
        _paymentService = paymentService;
        _hubContext = hubContext;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetPayments([FromQuery] PaymentSearchDto searchDto)
    {
        try
        {
            var payments = await _paymentService.GetPaymentsAsync(searchDto);
            return Ok(payments);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting payments");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetPaymentById(Guid id)
    {
        try
        {
            var payment = await _paymentService.GetPaymentByIdAsync(id);
            
            if (payment == null)
            {
                return NotFound("Payment not found");
            }

            return Ok(payment);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting payment by ID: {PaymentId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("intent")]
    public async Task<IActionResult> CreatePaymentIntent([FromBody] CreatePaymentIntentRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var paymentIntent = await _paymentService.CreatePaymentIntentAsync(request.BookingId, request.AmountCents);
            
            // Notify about payment intent creation
            await _hubContext.Clients.All.SendAsync("paymentIntentCreated", new { 
                paymentIntentId = paymentIntent.PaymentIntentId, 
                amount = paymentIntent.AmountCents,
                bookingId = request.BookingId 
            });
            
            return Ok(paymentIntent);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating payment intent");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePayment(Guid id, [FromBody] PaymentDto paymentDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var payment = await _paymentService.UpdatePaymentAsync(id, paymentDto);
            
            if (payment == null)
            {
                return NotFound("Payment not found");
            }

            return Ok(payment);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating payment: {PaymentId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePayment(Guid id)
    {
        try
        {
            var deleted = await _paymentService.DeletePaymentAsync(id);
            
            if (!deleted)
            {
                return NotFound("Payment not found");
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting payment: {PaymentId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("booking/{bookingId}")]
    public async Task<IActionResult> GetPaymentsByBooking(Guid bookingId)
    {
        try
        {
            var payments = await _paymentService.GetPaymentsByBookingAsync(bookingId);
            return Ok(payments);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting payments for booking: {BookingId}", bookingId);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetPaymentsByUser(Guid userId, [FromQuery] string? type = null, [FromQuery] DateTime? fromDate = null, [FromQuery] DateTime? toDate = null)
    {
        try
        {
            var payments = await _paymentService.GetPaymentsByUserAsync(userId, type, fromDate, toDate);
            return Ok(payments);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting payments for user: {UserId}", userId);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("confirm")]
    public async Task<IActionResult> ConfirmPayment([FromBody] ConfirmPaymentRequest request)
    {
        try
        {
            var confirmed = await _paymentService.ConfirmPaymentAsync(request.PaymentIntentId);
            
            if (!confirmed)
            {
                return BadRequest(new { Error = "Payment confirmation failed" });
            }

            // Notify users about payment confirmation
            var payment = await _paymentService.GetPaymentByIdAsync(Guid.Parse(request.PaymentIntentId));
            if (payment != null)
            {
                await _hubContext.Clients.Group($"user:{payment.FromUserId}").SendAsync("paymentConfirmed", new { paymentId = payment.Id, amount = (int)(payment.Amount * 100) });
                await _hubContext.Clients.Group($"user:{payment.ToUserId}").SendAsync("paymentReceived", new { paymentId = payment.Id, amount = (int)(payment.Amount * 100) });
            }

            return Ok(new { Success = true, Message = "Payment confirmed successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error confirming payment: {PaymentIntentId}", request.PaymentIntentId);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("cancel")]
    public async Task<IActionResult> CancelPayment([FromBody] CancelPaymentRequest request)
    {
        try
        {
            var cancelled = await _paymentService.CancelPaymentAsync(request.PaymentIntentId);
            
            if (!cancelled)
            {
                return BadRequest(new { Error = "Payment cancellation failed" });
            }

            return Ok(new { Success = true, Message = "Payment cancelled successfully" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error cancelling payment: {PaymentIntentId}", request.PaymentIntentId);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdatePaymentStatus(Guid id, [FromBody] UpdatePaymentStatusRequest request)
    {
        try
        {
            var updated = await _paymentService.UpdatePaymentStatusAsync(id, request.Status);
            
            if (!updated)
            {
                return NotFound("Payment not found");
            }

            return Ok(new { Success = true, Status = request.Status });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating payment status: {PaymentId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("summary/user/{userId}")]
    public async Task<IActionResult> GetPaymentSummary(Guid userId, [FromQuery] DateTime? fromDate = null, [FromQuery] DateTime? toDate = null)
    {
        try
        {
            var summary = await _paymentService.GetPaymentSummaryAsync(userId, fromDate, toDate);
            return Ok(summary);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting payment summary for user: {UserId}", userId);
            return StatusCode(500, "Internal server error");
        }
    }
}

public record CreatePaymentIntentRequest
{
    public Guid BookingId { get; init; }
    public int AmountCents { get; init; }
}

public record ConfirmPaymentRequest
{
    public string PaymentIntentId { get; init; } = string.Empty;
}

public record CancelPaymentRequest
{
    public string PaymentIntentId { get; init; } = string.Empty;
}

public record UpdatePaymentStatusRequest
{
    public string Status { get; init; } = string.Empty;
}
