namespace Smajobb.DTOs
{
    public record AnalyticsEventDto
    {
        public string Id { get; init; } = string.Empty;
        public string UserId { get; init; } = string.Empty;
        public string EventType { get; init; } = string.Empty;
        public string EventName { get; init; } = string.Empty;
        public string? Description { get; init; }
        public string? Properties { get; init; }
        public string? Category { get; init; }
        public string? Action { get; init; }
        public string? Label { get; init; }
        public int? Value { get; init; }
        public string? SessionId { get; init; }
        public string? PageUrl { get; init; }
        public string? Referrer { get; init; }
        public string? UserAgent { get; init; }
        public string? IpAddress { get; init; }
        public DateTime CreatedAt { get; init; }
    }

    public record CreateAnalyticsEventDto
    {
        public string EventType { get; init; } = string.Empty;
        public string EventName { get; init; } = string.Empty;
        public string? Description { get; init; }
        public string? Properties { get; init; }
        public string? Category { get; init; }
        public string? Action { get; init; }
        public string? Label { get; init; }
        public int? Value { get; init; }
        public string? SessionId { get; init; }
        public string? PageUrl { get; init; }
        public string? Referrer { get; init; }
    }

    public record SystemMetricDto
    {
        public string Id { get; init; } = string.Empty;
        public string MetricName { get; init; } = string.Empty;
        public string MetricType { get; init; } = string.Empty;
        public double Value { get; init; }
        public string? Labels { get; init; }
        public string? Description { get; init; }
        public DateTime Timestamp { get; init; }
        public string? Source { get; init; }
    }

    public record CreateSystemMetricDto
    {
        public string MetricName { get; init; } = string.Empty;
        public string MetricType { get; init; } = string.Empty;
        public double Value { get; init; }
        public string? Labels { get; init; }
        public string? Description { get; init; }
        public string? Source { get; init; }
    }

    public record ErrorLogDto
    {
        public string Id { get; init; } = string.Empty;
        public string ErrorType { get; init; } = string.Empty;
        public string ErrorMessage { get; init; } = string.Empty;
        public string? StackTrace { get; init; }
        public string? Source { get; init; }
        public string? Method { get; init; }
        public string? RequestUrl { get; init; }
        public string? RequestMethod { get; init; }
        public string? UserId { get; init; }
        public string? SessionId { get; init; }
        public string? IpAddress { get; init; }
        public string? UserAgent { get; init; }
        public string? AdditionalData { get; init; }
        public string Severity { get; init; } = string.Empty;
        public DateTime CreatedAt { get; init; }
        public bool IsResolved { get; init; }
        public DateTime? ResolvedAt { get; init; }
    }

    public record AnalyticsSummaryDto
    {
        public int TotalEvents { get; init; }
        public int UniqueUsers { get; init; }
        public int TotalErrors { get; init; }
        public int UnresolvedErrors { get; init; }
        public Dictionary<string, int> EventTypes { get; init; } = new();
        public Dictionary<string, int> ErrorTypes { get; init; } = new();
        public List<AnalyticsEventDto> RecentEvents { get; init; } = new();
        public List<ErrorLogDto> RecentErrors { get; init; } = new();
    }

    public record SystemHealthDto
    {
        public string Status { get; init; } = string.Empty; // healthy, degraded, unhealthy
        public DateTime Timestamp { get; init; }
        public Dictionary<string, object> Checks { get; init; } = new();
        public List<SystemMetricDto> Metrics { get; init; } = new();
        public string? Message { get; init; }
    }

    public record PerformanceMetricsDto
    {
        public double AverageResponseTime { get; init; }
        public double P95ResponseTime { get; init; }
        public double P99ResponseTime { get; init; }
        public int TotalRequests { get; init; }
        public int ErrorRate { get; init; }
        public double CpuUsage { get; init; }
        public double MemoryUsage { get; init; }
        public double DiskUsage { get; init; }
        public DateTime Timestamp { get; init; }
    }
}
