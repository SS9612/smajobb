using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Smajobb.DTOs;
using Smajobb.Services.Interfaces;
using System.Security.Claims;

namespace Smajobb.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AnalyticsController : ControllerBase
    {
        private readonly IAnalyticsService _analyticsService;
        private readonly ILogger<AnalyticsController> _logger;

        public AnalyticsController(IAnalyticsService analyticsService, ILogger<AnalyticsController> logger)
        {
            _analyticsService = analyticsService;
            _logger = logger;
        }

        [HttpPost("events")]
        public async Task<ActionResult<AnalyticsEventDto>> TrackEvent([FromBody] CreateAnalyticsEventDto eventDto)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized();

                var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
                var userAgent = Request.Headers.UserAgent.ToString();

                var result = await _analyticsService.TrackEventAsync(eventDto, userId, ipAddress, userAgent);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error tracking analytics event");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("events")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<AnalyticsEventDto>>> GetEvents(
            [FromQuery] string? userId = null,
            [FromQuery] string? eventType = null,
            [FromQuery] DateTime? from = null,
            [FromQuery] DateTime? to = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 50)
        {
            try
            {
                var events = await _analyticsService.GetEventsAsync(userId, eventType, from, to, page, pageSize);
                return Ok(events);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving analytics events");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("summary")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<AnalyticsSummaryDto>> GetAnalyticsSummary(
            [FromQuery] DateTime? from = null,
            [FromQuery] DateTime? to = null)
        {
            try
            {
                var summary = await _analyticsService.GetAnalyticsSummaryAsync(from, to);
                return Ok(summary);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving analytics summary");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("metrics")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<SystemMetricDto>> RecordMetric([FromBody] CreateSystemMetricDto metricDto)
        {
            try
            {
                var result = await _analyticsService.RecordMetricAsync(metricDto);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error recording system metric");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("metrics")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<SystemMetricDto>>> GetMetrics(
            [FromQuery] string? metricName = null,
            [FromQuery] string? source = null,
            [FromQuery] DateTime? from = null,
            [FromQuery] DateTime? to = null)
        {
            try
            {
                var metrics = await _analyticsService.GetMetricsAsync(metricName, source, from, to);
                return Ok(metrics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving system metrics");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("performance")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<PerformanceMetricsDto>> GetPerformanceMetrics(
            [FromQuery] DateTime? from = null,
            [FromQuery] DateTime? to = null)
        {
            try
            {
                var metrics = await _analyticsService.GetPerformanceMetricsAsync(from, to);
                return Ok(metrics);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving performance metrics");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("errors")]
        public async Task<ActionResult<ErrorLogDto>> LogError([FromBody] LogErrorDto errorDto)
        {
            try
            {
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
                var userAgent = Request.Headers.UserAgent.ToString();

                var result = await _analyticsService.LogErrorAsync(
                    errorDto.ErrorType,
                    errorDto.ErrorMessage,
                    errorDto.StackTrace,
                    errorDto.Source,
                    errorDto.Method,
                    errorDto.RequestUrl,
                    errorDto.RequestMethod,
                    userId,
                    errorDto.SessionId,
                    ipAddress,
                    userAgent,
                    errorDto.AdditionalData,
                    errorDto.Severity);

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error logging error");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("errors")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<ErrorLogDto>>> GetErrors(
            [FromQuery] string? errorType = null,
            [FromQuery] string? severity = null,
            [FromQuery] bool? isResolved = null,
            [FromQuery] DateTime? from = null,
            [FromQuery] DateTime? to = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 50)
        {
            try
            {
                var errors = await _analyticsService.GetErrorsAsync(errorType, severity, isResolved, from, to, page, pageSize);
                return Ok(errors);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving error logs");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPut("errors/{errorId}/resolve")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<ErrorLogDto>> ResolveError(string errorId)
        {
            try
            {
                var result = await _analyticsService.ResolveErrorAsync(errorId);
                return Ok(result);
            }
            catch (ArgumentException)
            {
                return NotFound("Error not found");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error resolving error: {ErrorId}", errorId);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("errors/unresolved-count")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<int>> GetUnresolvedErrorCount()
        {
            try
            {
                var count = await _analyticsService.GetUnresolvedErrorCountAsync();
                return Ok(count);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting unresolved error count");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("health")]
        public async Task<ActionResult<SystemHealthDto>> GetSystemHealth()
        {
            try
            {
                var health = await _analyticsService.GetSystemHealthAsync();
                return Ok(health);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking system health");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("cleanup")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> CleanupOldData([FromQuery] int daysToKeep = 30)
        {
            try
            {
                await _analyticsService.CleanupOldDataAsync(daysToKeep);
                return Ok("Cleanup completed successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error cleaning up old data");
                return StatusCode(500, "Internal server error");
            }
        }
    }

    public record LogErrorDto
    {
        public string ErrorType { get; init; } = string.Empty;
        public string ErrorMessage { get; init; } = string.Empty;
        public string? StackTrace { get; init; }
        public string? Source { get; init; }
        public string? Method { get; init; }
        public string? RequestUrl { get; init; }
        public string? RequestMethod { get; init; }
        public string? SessionId { get; init; }
        public string? AdditionalData { get; init; }
        public string Severity { get; init; } = "error";
    }
}
