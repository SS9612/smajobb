namespace Smajobb.DTOs;

public record MediaDto
{
    public string Id { get; init; } = string.Empty;
    public string FileName { get; init; } = string.Empty;
    public string OriginalFileName { get; init; } = string.Empty;
    public string ContentType { get; init; } = string.Empty;
    public long FileSize { get; init; }
    public string FilePath { get; init; } = string.Empty;
    public string Url { get; init; } = string.Empty;
    public string? ThumbnailUrl { get; init; }
    public string? AltText { get; init; }
    public string? Description { get; init; }
    public string EntityType { get; init; } = string.Empty; // job, user, message, etc.
    public string EntityId { get; init; } = string.Empty;
    public string UploadedBy { get; init; } = string.Empty;
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; init; }
    public bool IsPublic { get; init; }
    public bool IsProcessed { get; init; }
    public Dictionary<string, object>? Metadata { get; init; }
}

public record CreateMediaDto
{
    public string FileName { get; init; } = string.Empty;
    public string ContentType { get; init; } = string.Empty;
    public long FileSize { get; init; }
    public string EntityType { get; init; } = string.Empty;
    public string EntityId { get; init; } = string.Empty;
    public string? AltText { get; init; }
    public string? Description { get; init; }
    public bool IsPublic { get; init; } = true;
    public Dictionary<string, object>? Metadata { get; init; }
}

public record UpdateMediaDto
{
    public string? AltText { get; init; }
    public string? Description { get; init; }
    public bool? IsPublic { get; init; }
    public Dictionary<string, object>? Metadata { get; init; }
}

public record MediaUploadResultDto
{
    public string Id { get; init; } = string.Empty;
    public string FileName { get; init; } = string.Empty;
    public string Url { get; init; } = string.Empty;
    public string? ThumbnailUrl { get; init; }
    public bool Success { get; init; }
    public string? ErrorMessage { get; init; }
}

public record MediaListDto
{
    public IEnumerable<MediaDto> Items { get; init; } = Enumerable.Empty<MediaDto>();
    public int TotalCount { get; init; }
    public int Page { get; init; }
    public int PageSize { get; init; }
    public int TotalPages { get; init; }
}
