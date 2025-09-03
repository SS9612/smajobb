namespace Smajobb.DTOs;

public record ReviewDto
{
    public Guid Id { get; init; }
    public Guid BookingId { get; init; }
    public Guid ReviewerId { get; init; }
    public Guid RevieweeId { get; init; }
    public int Rating { get; init; }
    public string? Comment { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime? UpdatedAt { get; init; }
    public bool IsPublic { get; init; }
    public bool IsVerified { get; init; }
    
    // Additional info for display
    public string? ReviewerName { get; init; }
    public string? RevieweeName { get; init; }
    public string? JobTitle { get; init; }
}

public record CreateReviewDto
{
    public Guid BookingId { get; init; }
    public Guid RevieweeId { get; init; }
    public int Rating { get; init; }
    public string? Comment { get; init; }
}

public record UpdateReviewDto
{
    public int Rating { get; init; }
    public string? Comment { get; init; }
}

public record ReviewSummaryDto
{
    public Guid UserId { get; init; }
    public double AverageRating { get; init; }
    public int TotalReviews { get; init; }
    public int RatingCounts { get; init; } // 5-star reviews
    public int RatingCount4 { get; init; } // 4-star reviews
    public int RatingCount3 { get; init; } // 3-star reviews
    public int RatingCount2 { get; init; } // 2-star reviews
    public int RatingCount1 { get; init; } // 1-star reviews
}

public record ReviewSearchDto
{
    public Guid? UserId { get; init; }
    public Guid? BookingId { get; init; }
    public int? MinRating { get; init; }
    public int? MaxRating { get; init; }
    public bool? IsVerified { get; init; }
    public DateTime? FromDate { get; init; }
    public DateTime? ToDate { get; init; }
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 20;
}
