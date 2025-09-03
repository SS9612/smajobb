using Smajobb.DTOs;

namespace Smajobb.Services.Interfaces;

public interface IReviewService
{
    Task<ReviewDto?> GetReviewByIdAsync(Guid reviewId);
    Task<IEnumerable<ReviewDto>> GetReviewsByUserAsync(Guid userId, int page = 1, int pageSize = 20);
    Task<IEnumerable<ReviewDto>> GetReviewsByBookingAsync(Guid bookingId);
    Task<IEnumerable<ReviewDto>> SearchReviewsAsync(ReviewSearchDto searchDto);
    Task<ReviewDto> CreateReviewAsync(Guid reviewerId, CreateReviewDto createDto);
    Task<ReviewDto> UpdateReviewAsync(Guid reviewId, Guid userId, UpdateReviewDto updateDto);
    Task<bool> DeleteReviewAsync(Guid reviewId, Guid userId);
    Task<ReviewSummaryDto> GetReviewSummaryAsync(Guid userId);
    Task<bool> CanUserReviewAsync(Guid userId, Guid bookingId);
    Task<bool> HasUserReviewedAsync(Guid userId, Guid bookingId);
}
