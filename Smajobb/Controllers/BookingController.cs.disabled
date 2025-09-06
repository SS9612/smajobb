using Microsoft.AspNetCore.Mvc;
using Smajobb.DTOs;
using Smajobb.Services.Interfaces;

namespace Smajobb.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookingController : ControllerBase
{
    private readonly IBookingService _bookingService;
    private readonly ILogger<BookingController> _logger;

    public BookingController(IBookingService bookingService, ILogger<BookingController> logger)
    {
        _bookingService = bookingService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetBookings([FromQuery] BookingSearchDto searchDto)
    {
        try
        {
            var bookings = await _bookingService.GetBookingsAsync(searchDto);
            return Ok(bookings);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting bookings");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetBookingById(Guid id)
    {
        try
        {
            var booking = await _bookingService.GetBookingByIdAsync(id);
            
            if (booking == null)
            {
                return NotFound("Booking not found");
            }

            return Ok(booking);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting booking by ID: {BookingId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateBooking([FromBody] CreateBookingDto createBookingDto, [FromQuery] Guid customerId)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var booking = await _bookingService.CreateBookingAsync(createBookingDto, customerId);
            
            return CreatedAtAction(nameof(GetBookingById), new { id = booking.Id }, booking);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating booking");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBooking(Guid id, [FromBody] BookingDto bookingDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var booking = await _bookingService.UpdateBookingAsync(id, bookingDto);
            
            if (booking == null)
            {
                return NotFound("Booking not found");
            }

            return Ok(booking);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating booking: {BookingId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBooking(Guid id)
    {
        try
        {
            var deleted = await _bookingService.DeleteBookingAsync(id);
            
            if (!deleted)
            {
                return NotFound("Booking not found");
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting booking: {BookingId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("customer/{customerId}")]
    public async Task<IActionResult> GetBookingsByCustomer(Guid customerId)
    {
        try
        {
            var bookings = await _bookingService.GetBookingsByCustomerAsync(customerId);
            return Ok(bookings);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting bookings for customer: {CustomerId}", customerId);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("youth/{youthId}")]
    public async Task<IActionResult> GetBookingsByYouth(Guid youthId)
    {
        try
        {
            var bookings = await _bookingService.GetBookingsByYouthAsync(youthId);
            return Ok(bookings);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting bookings for youth: {YouthId}", youthId);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("job/{jobId}")]
    public async Task<IActionResult> GetBookingsByJob(Guid jobId)
    {
        try
        {
            var bookings = await _bookingService.GetBookingsByJobAsync(jobId);
            return Ok(bookings);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting bookings for job: {JobId}", jobId);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateBookingStatus(Guid id, [FromBody] UpdateBookingStatusDto updateDto, [FromQuery] Guid userId)
    {
        try
        {
            var booking = await _bookingService.UpdateBookingStatusAsync(id, updateDto, userId);
            
            return Ok(booking);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating booking status: {BookingId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPut("{id}/schedule")]
    public async Task<IActionResult> UpdateBookingSchedule(Guid id, [FromBody] UpdateBookingScheduleRequest request)
    {
        try
        {
            var updated = await _bookingService.UpdateBookingScheduleAsync(id, request.ScheduledStart, request.ScheduledEnd);
            
            if (!updated)
            {
                return NotFound("Booking not found");
            }

            return Ok(new { Success = true });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating booking schedule: {BookingId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("{id}/cancel")]
    public async Task<IActionResult> CancelBooking(Guid id, [FromQuery] Guid userId)
    {
        try
        {
            var cancelled = await _bookingService.CancelBookingAsync(id, userId);
            
            if (!cancelled)
            {
                return NotFound("Booking not found or cannot be cancelled");
            }

            return Ok(new { Success = true, Message = "Booking cancelled" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error cancelling booking: {BookingId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("availability/{youthId}")]
    public async Task<IActionResult> CheckAvailability(Guid youthId, [FromQuery] DateTime startTime, [FromQuery] DateTime endTime)
    {
        try
        {
            var isAvailable = await _bookingService.CheckAvailabilityAsync(youthId, startTime, endTime);
            return Ok(new { IsAvailable = isAvailable });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking availability for youth: {YouthId}", youthId);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("availability/{youthId}/timeslots")]
    public async Task<IActionResult> GetAvailableTimeSlots(Guid youthId, [FromQuery] DateTime date)
    {
        try
        {
            var timeSlots = await _bookingService.GetAvailableTimeSlotsAsync(youthId, date);
            return Ok(timeSlots);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting available time slots for youth: {YouthId}", youthId);
            return StatusCode(500, "Internal server error");
        }
    }
}

public record UpdateBookingStatusRequest
{
    public string Status { get; init; } = string.Empty;
}

public record UpdateBookingScheduleRequest
{
    public DateTime? ScheduledStart { get; init; }
    public DateTime? ScheduledEnd { get; init; }
}

public record RejectBookingRequest
{
    public string? Reason { get; init; }
}

public record CompleteBookingRequest
{
    public decimal? ActualHours { get; init; }
}
