using Smajobb.DTOs;

namespace Smajobb.Services.Interfaces
{
    public interface IAnalyticsService
    {
        // Analytics Events
        Task<AnalyticsEventDto> TrackEventAsync(CreateAnalyticsEventDto eventDto, string userId, string? ipAddress = null, string? userAgent = null);
        Task<IEnumerable<AnalyticsEventDto>> GetEventsAsync(string? userId = null, string? eventType = null, DateTime? from = null, DateTime? to = null, int page = 1, int pageSize = 50);
        Task<AnalyticsSummaryDto> GetAnalyticsSummaryAsync(DateTime? from = null, DateTime? to = null);

        // System Metrics
        Task<SystemMetricDto> RecordMetricAsync(CreateSystemMetricDto metricDto);
        Task<IEnumerable<SystemMetricDto>> GetMetricsAsync(string? metricName = null, string? source = null, DateTime? from = null, DateTime? to = null);
        Task<PerformanceMetricsDto> GetPerformanceMetricsAsync(DateTime? from = null, DateTime? to = null);

        // Error Logging
        Task<ErrorLogDto> LogErrorAsync(string errorType, string errorMessage, string? stackTrace = null, string? source = null, string? method = null, string? requestUrl = null, string? requestMethod = null, string? userId = null, string? sessionId = null, string? ipAddress = null, string? userAgent = null, string? additionalData = null, string severity = "error");
        Task<IEnumerable<ErrorLogDto>> GetErrorsAsync(string? errorType = null, string? severity = null, bool? isResolved = null, DateTime? from = null, DateTime? to = null, int page = 1, int pageSize = 50);
        Task<ErrorLogDto> ResolveErrorAsync(string errorId);
        Task<int> GetUnresolvedErrorCountAsync();

        // System Health
        Task<SystemHealthDto> GetSystemHealthAsync();
        Task<bool> IsSystemHealthyAsync();

        // Cleanup
        Task CleanupOldDataAsync(int daysToKeep = 30);
    }
}
