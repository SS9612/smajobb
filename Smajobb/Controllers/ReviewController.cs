using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Smajobb.DTOs;
using Smajobb.Services.Interfaces;

namespace Smajobb.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReviewController : ControllerBase
{
    private readonly IReviewService _reviewService;
    private readonly ILogger<ReviewController> _logger;

    public ReviewController(IReviewService reviewService, ILogger<ReviewController> logger)
    {
        _reviewService = reviewService;
        _logger = logger;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetReview(Guid id)
    {
        try
        {
            var review = await _reviewService.GetReviewByIdAsync(id);
            if (review == null)
            {
                return NotFound();
            }

            return Ok(review);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting review: {ReviewId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetReviewsByUser(Guid userId, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        try
        {
            var reviews = await _reviewService.GetReviewsByUserAsync(userId, page, pageSize);
            return Ok(reviews);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting reviews for user: {UserId}", userId);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("booking/{bookingId}")]
    public async Task<IActionResult> GetReviewsByBooking(Guid bookingId)
    {
        try
        {
            var reviews = await _reviewService.GetReviewsByBookingAsync(bookingId);
            return Ok(reviews);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting reviews for booking: {BookingId}", bookingId);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("summary/{userId}")]
    public async Task<IActionResult> GetReviewSummary(Guid userId)
    {
        try
        {
            var summary = await _reviewService.GetReviewSummaryAsync(userId);
            return Ok(summary);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting review summary for user: {UserId}", userId);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateReview([FromBody] CreateReviewDto createDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            var review = await _reviewService.CreateReviewAsync(userId, createDto);
            
            return CreatedAtAction(nameof(GetReview), new { id = review.Id }, review);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { Error = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating review");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateReview(Guid id, [FromBody] UpdateReviewDto updateDto)
    {
        try
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = GetCurrentUserId();
            var review = await _reviewService.UpdateReviewAsync(id, userId, updateDto);
            
            return Ok(review);
        }
        catch (ArgumentException)
        {
            return NotFound();
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating review: {ReviewId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteReview(Guid id)
    {
        try
        {
            var userId = GetCurrentUserId();
            var deleted = await _reviewService.DeleteReviewAsync(id, userId);
            
            if (!deleted)
            {
                return NotFound();
            }

            return NoContent();
        }
        catch (UnauthorizedAccessException ex)
        {
            return Forbid(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting review: {ReviewId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("can-review/{bookingId}")]
    public async Task<IActionResult> CanUserReview(Guid bookingId)
    {
        try
        {
            var userId = GetCurrentUserId();
            var canReview = await _reviewService.CanUserReviewAsync(userId, bookingId);
            var hasReviewed = await _reviewService.HasUserReviewedAsync(userId, bookingId);
            
            return Ok(new { CanReview = canReview, HasReviewed = hasReviewed });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking if user can review booking: {BookingId}", bookingId);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("search")]
    public async Task<IActionResult> SearchReviews([FromBody] ReviewSearchDto searchDto)
    {
        try
        {
            var reviews = await _reviewService.SearchReviewsAsync(searchDto);
            return Ok(reviews);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching reviews");
            return StatusCode(500, "Internal server error");
        }
    }

    private Guid GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst("userId")?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            throw new UnauthorizedAccessException("Invalid user ID");
        }
        return userId;
    }
}
