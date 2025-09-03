using Microsoft.AspNetCore.Mvc;
using Smajobb.DTOs;
using Smajobb.Services.Interfaces;

namespace Smajobb.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WorkSessionController : ControllerBase
{
    private readonly IWorkSessionService _workSessionService;
    private readonly ILogger<WorkSessionController> _logger;

    public WorkSessionController(IWorkSessionService workSessionService, ILogger<WorkSessionController> logger)
    {
        _workSessionService = workSessionService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetWorkSessions([FromQuery] WorkSessionSearchDto searchDto)
    {
        try
        {
            var workSessions = await _workSessionService.GetWorkSessionsAsync(searchDto);
            return Ok(workSessions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting work sessions");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetWorkSessionById(Guid id)
    {
        try
        {
            var workSession = await _workSessionService.GetWorkSessionByIdAsync(id);
            
            if (workSession == null)
            {
                return NotFound("Work session not found");
            }

            return Ok(workSession);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting work session by ID: {WorkSessionId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("start")]
    public async Task<IActionResult> StartWorkSession([FromBody] StartWorkSessionRequest request)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var workSession = await _workSessionService.StartWorkSessionAsync(request.BookingId, request.YouthId);
            
            return CreatedAtAction(nameof(GetWorkSessionById), new { id = workSession.Id }, workSession);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error starting work session");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateWorkSession(Guid id, [FromBody] WorkSessionDto workSessionDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var workSession = await _workSessionService.UpdateWorkSessionAsync(id, workSessionDto);
            
            if (workSession == null)
            {
                return NotFound("Work session not found");
            }

            return Ok(workSession);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating work session: {WorkSessionId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteWorkSession(Guid id)
    {
        try
        {
            var deleted = await _workSessionService.DeleteWorkSessionAsync(id);
            
            if (!deleted)
            {
                return NotFound("Work session not found");
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting work session: {WorkSessionId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("booking/{bookingId}")]
    public async Task<IActionResult> GetWorkSessionsByBooking(Guid bookingId)
    {
        try
        {
            var workSessions = await _workSessionService.GetWorkSessionsByBookingAsync(bookingId);
            return Ok(workSessions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting work sessions for booking: {BookingId}", bookingId);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("youth/{youthId}")]
    public async Task<IActionResult> GetWorkSessionsByYouth(Guid youthId, [FromQuery] DateTime? startDate = null, [FromQuery] DateTime? endDate = null)
    {
        try
        {
            var workSessions = await _workSessionService.GetWorkSessionsByYouthAsync(youthId, startDate, endDate);
            return Ok(workSessions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting work sessions for youth: {YouthId}", youthId);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("{id}/end")]
    public async Task<IActionResult> EndWorkSession(Guid id, [FromQuery] Guid youthId)
    {
        try
        {
            var workSession = await _workSessionService.EndWorkSessionAsync(id, youthId);
            
            return Ok(workSession);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error ending work session: {WorkSessionId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("{id}/pause")]
    public async Task<IActionResult> PauseWorkSession(Guid id, [FromQuery] Guid youthId)
    {
        try
        {
            var workSession = await _workSessionService.PauseWorkSessionAsync(id, youthId);
            
            return Ok(workSession);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error pausing work session: {WorkSessionId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("{id}/resume")]
    public async Task<IActionResult> ResumeWorkSession(Guid id, [FromQuery] Guid youthId)
    {
        try
        {
            var workSession = await _workSessionService.ResumeWorkSessionAsync(id, youthId);
            
            return Ok(workSession);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error resuming work session: {WorkSessionId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("youth/{youthId}/total-hours")]
    public async Task<IActionResult> GetTotalWorkHours(Guid youthId, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
    {
        try
        {
            var totalHours = await _workSessionService.GetTotalWorkHoursAsync(youthId, startDate, endDate);
            return Ok(new { TotalHours = totalHours });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting total work hours for youth: {YouthId}", youthId);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("booking/{bookingId}/hours")]
    public async Task<IActionResult> GetWorkHoursForBooking(Guid bookingId)
    {
        try
        {
            var hours = await _workSessionService.GetWorkHoursForBookingAsync(bookingId);
            return Ok(new { Hours = hours });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting work hours for booking: {BookingId}", bookingId);
            return StatusCode(500, "Internal server error");
        }
    }
}

public record StartWorkSessionRequest
{
    public Guid BookingId { get; init; }
    public Guid YouthId { get; init; }
}
