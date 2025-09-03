namespace Smajobb.DTOs;

public record JobSearchDto
{
    public string? Query { get; init; }
    public string? Category { get; init; }
    public string? Location { get; init; }
    public double? Latitude { get; init; }
    public double? Longitude { get; init; }
    public int? RadiusKm { get; init; }
    public string? PriceType { get; init; }
    public int? MinPrice { get; init; }
    public int? MaxPrice { get; init; }
    public string? Urgency { get; init; }
    public string? Status { get; init; }
    public DateTime? StartDate { get; init; }
    public DateTime? EndDate { get; init; }
    public int? MinAge { get; init; }
    public int? MaxAge { get; init; }
    public bool? RequiresBackgroundCheck { get; init; }
    public string[]? Skills { get; init; }
    public string[]? Tags { get; init; }
    public string? SortBy { get; init; } = "createdAt"; // createdAt, price, urgency, distance
    public string? SortOrder { get; init; } = "desc"; // asc, desc
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 20;
}

public record UserSearchDto
{
    public string? Query { get; init; }
    public string? Role { get; init; }
    public string? Location { get; init; }
    public double? Latitude { get; init; }
    public double? Longitude { get; init; }
    public int? RadiusKm { get; init; }
    public string[]? Skills { get; init; }
    public int? MinAge { get; init; }
    public int? MaxAge { get; init; }
    public bool? IsVerified { get; init; }
    public double? MinRating { get; init; }
    public string? SortBy { get; init; } = "createdAt";
    public string? SortOrder { get; init; } = "desc";
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 20;
}

public record SearchSuggestionDto
{
    public string Text { get; init; } = string.Empty;
    public string Type { get; init; } = string.Empty; // job, category, skill, location
    public int Count { get; init; }
}

public record SearchFiltersDto
{
    public string[] Categories { get; init; } = Array.Empty<string>();
    public string[] PriceTypes { get; init; } = Array.Empty<string>();
    public string[] Urgencies { get; init; } = Array.Empty<string>();
    public string[] Statuses { get; init; } = Array.Empty<string>();
    public string[] Skills { get; init; } = Array.Empty<string>();
    public string[] Tags { get; init; } = Array.Empty<string>();
    public PriceRangeDto PriceRange { get; init; } = new();
    public DateRangeDto DateRange { get; init; } = new();
    public AgeRangeDto AgeRange { get; init; } = new();
}

public record PriceRangeDto
{
    public int Min { get; init; }
    public int Max { get; init; }
}

public record DateRangeDto
{
    public DateTime? Start { get; init; }
    public DateTime? End { get; init; }
}

public record AgeRangeDto
{
    public int Min { get; init; }
    public int Max { get; init; }
}

public record SearchResultDto<T>
{
    public IEnumerable<T> Items { get; init; } = Enumerable.Empty<T>();
    public int TotalCount { get; init; }
    public int Page { get; init; }
    public int PageSize { get; init; }
    public int TotalPages { get; init; }
    public SearchFiltersDto? AvailableFilters { get; init; }
    public string[]? Suggestions { get; init; }
}
