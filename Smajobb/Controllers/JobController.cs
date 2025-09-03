using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Smajobb.DTOs;
using Smajobb.Services.Interfaces;

namespace Smajobb.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class JobController : ControllerBase
{
    private readonly IJobService _jobService;
    private readonly ILogger<JobController> _logger;

    public JobController(IJobService jobService, ILogger<JobController> logger)
    {
        _jobService = jobService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetJobs([FromQuery] JobSearchDto searchDto)
    {
        try
        {
            var jobs = await _jobService.SearchJobsAsync(searchDto);
            return Ok(jobs);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting jobs");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetJobById(Guid id)
    {
        try
        {
            var job = await _jobService.GetJobByIdAsync(id);
            
            if (job == null)
            {
                return NotFound("Job not found");
            }

            return Ok(job);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting job by ID: {JobId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost]
    [Authorize(Roles = "customer,admin")]
    public async Task<IActionResult> CreateJob([FromBody] CreateJobDto createJobDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var creatorId))
            {
                return Unauthorized("Invalid user");
            }

            var job = await _jobService.CreateJobAsync(createJobDto, creatorId);
            
            return CreatedAtAction(nameof(GetJobById), new { id = job.Id }, job);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating job");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPut("{id}")]
    [Authorize(Policy = "JobOwnerOrAdmin")]
    public async Task<IActionResult> UpdateJob(Guid id, [FromBody] CreateJobDto updateDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized("Invalid user");
            }

            var job = await _jobService.UpdateJobAsync(id, updateDto, userId);
            
            return Ok(job);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating job: {JobId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Policy = "JobOwnerOrAdmin")]
    public async Task<IActionResult> DeleteJob(Guid id)
    {
        try
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized("Invalid user");
            }

            var deleted = await _jobService.DeleteJobAsync(id, userId);
            
            if (!deleted)
            {
                return NotFound("Job not found");
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting job: {JobId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetJobsByUser(Guid userId, [FromQuery] string? status = null)
    {
        try
        {
            var jobs = await _jobService.GetJobsByCreatorAsync(userId);
            return Ok(jobs);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting jobs for user: {UserId}", userId);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("categories")]
    public async Task<IActionResult> GetJobCategories()
    {
        try
        {
            var categories = await _jobService.GetJobCategoriesAsync();
            return Ok(categories);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting job categories");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPut("{id}/status")]
    [Authorize(Policy = "JobOwnerOrAdmin")]
    public async Task<IActionResult> UpdateJobStatus(Guid id, [FromBody] UpdateJobStatusRequest request)
    {
        try
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized("Invalid user");
            }

            var updated = await _jobService.UpdateJobStatusAsync(id, request.Status, userId);
            
            if (!updated)
            {
                return NotFound("Job not found");
            }

            return Ok(new { Success = true, Status = request.Status });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating job status: {JobId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("nearby")]
    public async Task<IActionResult> GetNearbyJobs([FromQuery] double latitude, [FromQuery] double longitude, [FromQuery] double radiusKm = 10)
    {
        try
        {
            var searchDto = new JobSearchDto
            {
                Latitude = latitude,
                Longitude = longitude,
                RadiusKm = radiusKm
            };
            var jobs = await _jobService.SearchJobsAsync(searchDto);
            return Ok(jobs);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting nearby jobs");
            return StatusCode(500, "Internal server error");
        }
    }
}

public record UpdateJobStatusRequest
{
    public string Status { get; init; } = string.Empty;
}
