using Microsoft.EntityFrameworkCore;
using Smajobb.Data;
using Smajobb.DTOs;
using Smajobb.Models;
using Smajobb.Services.Interfaces;

namespace Smajobb.Services;

public class ReviewService : IReviewService
{
    private readonly SmajobbDbContext _db;

    public ReviewService(SmajobbDbContext db)
    {
        _db = db;
    }

    public async Task<ReviewDto?> GetReviewByIdAsync(Guid reviewId)
    {
        var review = await _db.Reviews
            .Include(r => r.Reviewer)
            .Include(r => r.Reviewee)
            .Include(r => r.Booking)
            .ThenInclude(b => b.Job)
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.Id == reviewId);

        return review != null ? Map(review) : null;
    }

    public async Task<IEnumerable<ReviewDto>> GetReviewsByUserAsync(Guid userId, int page = 1, int pageSize = 20)
    {
        var reviews = await _db.Reviews
            .Include(r => r.Reviewer)
            .Include(r => r.Reviewee)
            .Include(r => r.Booking)
            .ThenInclude(b => b.Job)
            .Where(r => r.RevieweeId == userId && r.IsPublic)
            .OrderByDescending(r => r.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .AsNoTracking()
            .ToListAsync();

        return reviews.Select(Map);
    }

    public async Task<IEnumerable<ReviewDto>> GetReviewsByBookingAsync(Guid bookingId)
    {
        var reviews = await _db.Reviews
            .Include(r => r.Reviewer)
            .Include(r => r.Reviewee)
            .Include(r => r.Booking)
            .ThenInclude(b => b.Job)
            .Where(r => r.BookingId == bookingId && r.IsPublic)
            .OrderByDescending(r => r.CreatedAt)
            .AsNoTracking()
            .ToListAsync();

        return reviews.Select(Map);
    }

    public async Task<IEnumerable<ReviewDto>> SearchReviewsAsync(ReviewSearchDto searchDto)
    {
        var query = _db.Reviews
            .Include(r => r.Reviewer)
            .Include(r => r.Reviewee)
            .Include(r => r.Booking)
            .ThenInclude(b => b.Job)
            .AsQueryable();

        if (searchDto.UserId.HasValue)
            query = query.Where(r => r.RevieweeId == searchDto.UserId.Value);
        
        if (searchDto.BookingId.HasValue)
            query = query.Where(r => r.BookingId == searchDto.BookingId.Value);
        
        if (searchDto.MinRating.HasValue)
            query = query.Where(r => r.Rating >= searchDto.MinRating.Value);
        
        if (searchDto.MaxRating.HasValue)
            query = query.Where(r => r.Rating <= searchDto.MaxRating.Value);
        
        if (searchDto.IsVerified.HasValue)
            query = query.Where(r => r.IsVerified == searchDto.IsVerified.Value);
        
        if (searchDto.FromDate.HasValue)
            query = query.Where(r => r.CreatedAt >= searchDto.FromDate.Value);
        
        if (searchDto.ToDate.HasValue)
            query = query.Where(r => r.CreatedAt <= searchDto.ToDate.Value);

        var reviews = await query
            .Where(r => r.IsPublic)
            .OrderByDescending(r => r.CreatedAt)
            .Skip((searchDto.Page - 1) * searchDto.PageSize)
            .Take(searchDto.PageSize)
            .AsNoTracking()
            .ToListAsync();

        return reviews.Select(Map);
    }

    public async Task<ReviewDto> CreateReviewAsync(Guid reviewerId, CreateReviewDto createDto)
    {
        // Validate that the user can review this booking
        var canReview = await CanUserReviewAsync(reviewerId, createDto.BookingId);
        if (!canReview)
            throw new InvalidOperationException("User cannot review this booking");

        // Check if user has already reviewed this booking
        var hasReviewed = await HasUserReviewedAsync(reviewerId, createDto.BookingId);
        if (hasReviewed)
            throw new InvalidOperationException("User has already reviewed this booking");

        var review = new Review
        {
            BookingId = createDto.BookingId,
            ReviewerId = reviewerId,
            RevieweeId = createDto.RevieweeId,
            Rating = createDto.Rating,
            Comment = createDto.Comment,
            IsVerified = true, // Auto-verify for now
            CreatedAt = DateTime.UtcNow
        };

        _db.Reviews.Add(review);
        await _db.SaveChangesAsync();

        // Reload with includes
        return await GetReviewByIdAsync(review.Id) ?? throw new InvalidOperationException("Failed to create review");
    }

    public async Task<ReviewDto> UpdateReviewAsync(Guid reviewId, Guid userId, UpdateReviewDto updateDto)
    {
        var review = await _db.Reviews.FirstOrDefaultAsync(r => r.Id == reviewId);
        if (review == null)
            throw new ArgumentException("Review not found");

        if (review.ReviewerId != userId)
            throw new UnauthorizedAccessException("User can only update their own reviews");

        review.Rating = updateDto.Rating;
        review.Comment = updateDto.Comment;
        review.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return await GetReviewByIdAsync(review.Id) ?? throw new InvalidOperationException("Failed to update review");
    }

    public async Task<bool> DeleteReviewAsync(Guid reviewId, Guid userId)
    {
        var review = await _db.Reviews.FirstOrDefaultAsync(r => r.Id == reviewId);
        if (review == null) return false;

        if (review.ReviewerId != userId)
            throw new UnauthorizedAccessException("User can only delete their own reviews");

        _db.Reviews.Remove(review);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<ReviewSummaryDto> GetReviewSummaryAsync(Guid userId)
    {
        var reviews = await _db.Reviews
            .Where(r => r.RevieweeId == userId && r.IsPublic)
            .AsNoTracking()
            .ToListAsync();

        if (!reviews.Any())
        {
            return new ReviewSummaryDto
            {
                UserId = userId,
                AverageRating = 0,
                TotalReviews = 0,
                RatingCounts = 0,
                RatingCount4 = 0,
                RatingCount3 = 0,
                RatingCount2 = 0,
                RatingCount1 = 0
            };
        }

        var averageRating = reviews.Average(r => r.Rating);
        var ratingCounts = reviews.GroupBy(r => r.Rating)
            .ToDictionary(g => g.Key, g => g.Count());

        return new ReviewSummaryDto
        {
            UserId = userId,
            AverageRating = Math.Round(averageRating, 1),
            TotalReviews = reviews.Count,
            RatingCounts = ratingCounts.GetValueOrDefault(5, 0),
            RatingCount4 = ratingCounts.GetValueOrDefault(4, 0),
            RatingCount3 = ratingCounts.GetValueOrDefault(3, 0),
            RatingCount2 = ratingCounts.GetValueOrDefault(2, 0),
            RatingCount1 = ratingCounts.GetValueOrDefault(1, 0)
        };
    }

    public async Task<bool> CanUserReviewAsync(Guid userId, Guid bookingId)
    {
        var booking = await _db.Bookings
            .Include(b => b.Job)
            .AsNoTracking()
            .FirstOrDefaultAsync(b => b.Id == bookingId);

        if (booking == null) return false;

        // User can review if:
        // 1. They are the customer or youth in the booking
        // 2. The booking is completed
        // 3. The job is completed
        return (booking.CustomerId == userId || booking.YouthId == userId) &&
               booking.Status == "completed" &&
               booking.Job.Status == "completed";
    }

    public async Task<bool> HasUserReviewedAsync(Guid userId, Guid bookingId)
    {
        return await _db.Reviews
            .AnyAsync(r => r.ReviewerId == userId && r.BookingId == bookingId);
    }

    private static ReviewDto Map(Review r) => new ReviewDto
    {
        Id = r.Id,
        BookingId = r.BookingId,
        ReviewerId = r.ReviewerId,
        RevieweeId = r.RevieweeId,
        Rating = r.Rating,
        Comment = r.Comment,
        CreatedAt = r.CreatedAt,
        UpdatedAt = r.UpdatedAt,
        IsPublic = r.IsPublic,
        IsVerified = r.IsVerified,
        ReviewerName = r.Reviewer?.DisplayName,
        RevieweeName = r.Reviewee?.DisplayName,
        JobTitle = r.Booking?.Job?.Title
    };
}
