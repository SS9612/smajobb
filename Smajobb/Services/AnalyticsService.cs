using Microsoft.EntityFrameworkCore;
using Smajobb.Data;
using Smajobb.DTOs;
using Smajobb.Models;
using Smajobb.Services.Interfaces;
using System.Diagnostics;
using System.Text.Json;

namespace Smajobb.Services
{
    public class AnalyticsService : IAnalyticsService
    {
        private readonly SmajobbDbContext _db;
        private readonly ILogger<AnalyticsService> _logger;

        public AnalyticsService(SmajobbDbContext db, ILogger<AnalyticsService> logger)
        {
            _db = db;
            _logger = logger;
        }

        public async Task<AnalyticsEventDto> TrackEventAsync(CreateAnalyticsEventDto eventDto, string userId, string? ipAddress = null, string? userAgent = null)
        {
            try
            {
                var analyticsEvent = new AnalyticsEvent
                {
                    UserId = Guid.Parse(userId),
                    EventType = eventDto.EventType,
                    EventName = eventDto.EventName,
                    Description = eventDto.Description,
                    Properties = eventDto.Properties,
                    Category = eventDto.Category,
                    Action = eventDto.Action,
                    Label = eventDto.Label,
                    Value = eventDto.Value,
                    SessionId = eventDto.SessionId,
                    PageUrl = eventDto.PageUrl,
                    Referrer = eventDto.Referrer,
                    UserAgent = userAgent,
                    IpAddress = ipAddress,
                    CreatedAt = DateTime.UtcNow
                };

                _db.AnalyticsEvents.Add(analyticsEvent);
                await _db.SaveChangesAsync();

                _logger.LogInformation("Analytics event tracked: {EventType} - {EventName} for user {UserId}", 
                    eventDto.EventType, eventDto.EventName, userId);

                return MapToAnalyticsEventDto(analyticsEvent);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error tracking analytics event for user {UserId}", userId);
                throw;
            }
        }

        public async Task<IEnumerable<AnalyticsEventDto>> GetEventsAsync(string? userId = null, string? eventType = null, DateTime? from = null, DateTime? to = null, int page = 1, int pageSize = 50)
        {
            try
            {
                var query = _db.AnalyticsEvents.AsQueryable();

                if (!string.IsNullOrEmpty(userId))
                    query = query.Where(e => e.UserId == Guid.Parse(userId));

                if (!string.IsNullOrEmpty(eventType))
                    query = query.Where(e => e.EventType == eventType);

                if (from.HasValue)
                    query = query.Where(e => e.CreatedAt >= from.Value);

                if (to.HasValue)
                    query = query.Where(e => e.CreatedAt <= to.Value);

                var events = await query
                    .OrderByDescending(e => e.CreatedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return events.Select(MapToAnalyticsEventDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving analytics events");
                throw;
            }
        }

        public async Task<AnalyticsSummaryDto> GetAnalyticsSummaryAsync(DateTime? from = null, DateTime? to = null)
        {
            try
            {
                var query = _db.AnalyticsEvents.AsQueryable();

                if (from.HasValue)
                    query = query.Where(e => e.CreatedAt >= from.Value);

                if (to.HasValue)
                    query = query.Where(e => e.CreatedAt <= to.Value);

                var totalEvents = await query.CountAsync();
                var uniqueUsers = await query.Select(e => e.UserId).Distinct().CountAsync();
                var eventTypes = await query
                    .GroupBy(e => e.EventType)
                    .Select(g => new { Type = g.Key, Count = g.Count() })
                    .ToDictionaryAsync(x => x.Type, x => x.Count);

                var errorQuery = _db.ErrorLogs.AsQueryable();
                if (from.HasValue)
                    errorQuery = errorQuery.Where(e => e.CreatedAt >= from.Value);
                if (to.HasValue)
                    errorQuery = errorQuery.Where(e => e.CreatedAt <= to.Value);

                var totalErrors = await errorQuery.CountAsync();
                var unresolvedErrors = await errorQuery.CountAsync(e => !e.IsResolved);
                var errorTypes = await errorQuery
                    .GroupBy(e => e.ErrorType)
                    .Select(g => new { Type = g.Key, Count = g.Count() })
                    .ToDictionaryAsync(x => x.Type, x => x.Count);

                var recentEvents = await query
                    .OrderByDescending(e => e.CreatedAt)
                    .Take(10)
                    .Select(e => MapToAnalyticsEventDto(e))
                    .ToListAsync();

                var recentErrors = await errorQuery
                    .OrderByDescending(e => e.CreatedAt)
                    .Take(10)
                    .Select(e => MapToErrorLogDto(e))
                    .ToListAsync();

                return new AnalyticsSummaryDto
                {
                    TotalEvents = totalEvents,
                    UniqueUsers = uniqueUsers,
                    TotalErrors = totalErrors,
                    UnresolvedErrors = unresolvedErrors,
                    EventTypes = eventTypes,
                    ErrorTypes = errorTypes,
                    RecentEvents = recentEvents,
                    RecentErrors = recentErrors
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error generating analytics summary");
                throw;
            }
        }

        public async Task<SystemMetricDto> RecordMetricAsync(CreateSystemMetricDto metricDto)
        {
            try
            {
                var metric = new SystemMetric
                {
                    MetricName = metricDto.MetricName,
                    MetricType = metricDto.MetricType,
                    Value = metricDto.Value,
                    Labels = metricDto.Labels,
                    Description = metricDto.Description,
                    Source = metricDto.Source,
                    Timestamp = DateTime.UtcNow
                };

                _db.SystemMetrics.Add(metric);
                await _db.SaveChangesAsync();

                return MapToSystemMetricDto(metric);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error recording system metric: {MetricName}", metricDto.MetricName);
                throw;
            }
        }

        public async Task<IEnumerable<SystemMetricDto>> GetMetricsAsync(string? metricName = null, string? source = null, DateTime? from = null, DateTime? to = null)
        {
            try
            {
                var query = _db.SystemMetrics.AsQueryable();

                if (!string.IsNullOrEmpty(metricName))
                    query = query.Where(m => m.MetricName == metricName);

                if (!string.IsNullOrEmpty(source))
                    query = query.Where(m => m.Source == source);

                if (from.HasValue)
                    query = query.Where(m => m.Timestamp >= from.Value);

                if (to.HasValue)
                    query = query.Where(m => m.Timestamp <= to.Value);

                var metrics = await query
                    .OrderByDescending(m => m.Timestamp)
                    .ToListAsync();

                return metrics.Select(MapToSystemMetricDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving system metrics");
                throw;
            }
        }

        public async Task<PerformanceMetricsDto> GetPerformanceMetricsAsync(DateTime? from = null, DateTime? to = null)
        {
            try
            {
                var query = _db.SystemMetrics.AsQueryable();

                if (from.HasValue)
                    query = query.Where(m => m.Timestamp >= from.Value);

                if (to.HasValue)
                    query = query.Where(m => m.Timestamp <= to.Value);

                var responseTimeMetrics = await query
                    .Where(m => m.MetricName == "response_time")
                    .ToListAsync();

                var requestCountMetrics = await query
                    .Where(m => m.MetricName == "request_count")
                    .ToListAsync();

                var errorCountMetrics = await query
                    .Where(m => m.MetricName == "error_count")
                    .ToListAsync();

                var cpuMetrics = await query
                    .Where(m => m.MetricName == "cpu_usage")
                    .OrderByDescending(m => m.Timestamp)
                    .FirstOrDefaultAsync();

                var memoryMetrics = await query
                    .Where(m => m.MetricName == "memory_usage")
                    .OrderByDescending(m => m.Timestamp)
                    .FirstOrDefaultAsync();

                var diskMetrics = await query
                    .Where(m => m.MetricName == "disk_usage")
                    .OrderByDescending(m => m.Timestamp)
                    .FirstOrDefaultAsync();

                var responseTimes = responseTimeMetrics.Select(m => m.Value).ToList();
                var totalRequests = requestCountMetrics.Sum(m => (int)m.Value);
                var totalErrors = errorCountMetrics.Sum(m => (int)m.Value);

                return new PerformanceMetricsDto
                {
                    AverageResponseTime = responseTimes.Any() ? responseTimes.Average() : 0,
                    P95ResponseTime = responseTimes.Any() ? CalculatePercentile(responseTimes, 0.95) : 0,
                    P99ResponseTime = responseTimes.Any() ? CalculatePercentile(responseTimes, 0.99) : 0,
                    TotalRequests = totalRequests,
                    ErrorRate = totalRequests > 0 ? (int)((double)totalErrors / totalRequests * 100) : 0,
                    CpuUsage = cpuMetrics?.Value ?? 0,
                    MemoryUsage = memoryMetrics?.Value ?? 0,
                    DiskUsage = diskMetrics?.Value ?? 0,
                    Timestamp = DateTime.UtcNow
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calculating performance metrics");
                throw;
            }
        }

        public async Task<ErrorLogDto> LogErrorAsync(string errorType, string errorMessage, string? stackTrace = null, string? source = null, string? method = null, string? requestUrl = null, string? requestMethod = null, string? userId = null, string? sessionId = null, string? ipAddress = null, string? userAgent = null, string? additionalData = null, string severity = "error")
        {
            try
            {
                var errorLog = new ErrorLog
                {
                    ErrorType = errorType,
                    ErrorMessage = errorMessage,
                    StackTrace = stackTrace,
                    Source = source,
                    Method = method,
                    RequestUrl = requestUrl,
                    RequestMethod = requestMethod,
                    UserId = !string.IsNullOrEmpty(userId) ? Guid.Parse(userId) : null,
                    SessionId = sessionId,
                    IpAddress = ipAddress,
                    UserAgent = userAgent,
                    AdditionalData = additionalData,
                    Severity = severity,
                    CreatedAt = DateTime.UtcNow
                };

                _db.ErrorLogs.Add(errorLog);
                await _db.SaveChangesAsync();

                _logger.LogError("Error logged: {ErrorType} - {ErrorMessage}", errorType, errorMessage);

                return MapToErrorLogDto(errorLog);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error logging error: {ErrorMessage}", errorMessage);
                throw;
            }
        }

        public async Task<IEnumerable<ErrorLogDto>> GetErrorsAsync(string? errorType = null, string? severity = null, bool? isResolved = null, DateTime? from = null, DateTime? to = null, int page = 1, int pageSize = 50)
        {
            try
            {
                var query = _db.ErrorLogs.AsQueryable();

                if (!string.IsNullOrEmpty(errorType))
                    query = query.Where(e => e.ErrorType == errorType);

                if (!string.IsNullOrEmpty(severity))
                    query = query.Where(e => e.Severity == severity);

                if (isResolved.HasValue)
                    query = query.Where(e => e.IsResolved == isResolved.Value);

                if (from.HasValue)
                    query = query.Where(e => e.CreatedAt >= from.Value);

                if (to.HasValue)
                    query = query.Where(e => e.CreatedAt <= to.Value);

                var errors = await query
                    .OrderByDescending(e => e.CreatedAt)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                return errors.Select(MapToErrorLogDto);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving error logs");
                throw;
            }
        }

        public async Task<ErrorLogDto> ResolveErrorAsync(string errorId)
        {
            try
            {
                var error = await _db.ErrorLogs
                    .FirstOrDefaultAsync(e => e.Id == Guid.Parse(errorId));

                if (error == null)
                    throw new ArgumentException("Error not found");

                error.IsResolved = true;
                error.ResolvedAt = DateTime.UtcNow;

                await _db.SaveChangesAsync();

                return MapToErrorLogDto(error);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error resolving error: {ErrorId}", errorId);
                throw;
            }
        }

        public async Task<int> GetUnresolvedErrorCountAsync()
        {
            try
            {
                return await _db.ErrorLogs.CountAsync(e => !e.IsResolved);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting unresolved error count");
                throw;
            }
        }

        public async Task<SystemHealthDto> GetSystemHealthAsync()
        {
            try
            {
                var checks = new Dictionary<string, object>();
                var status = "healthy";

                // Database health check
                try
                {
                    await _db.Database.ExecuteSqlRawAsync("SELECT 1");
                    checks["database"] = new { status = "healthy", message = "Database connection successful" };
                }
                catch (Exception ex)
                {
                    checks["database"] = new { status = "unhealthy", message = ex.Message };
                    status = "unhealthy";
                }

                // Recent error rate check
                var recentErrors = await _db.ErrorLogs
                    .Where(e => e.CreatedAt >= DateTime.UtcNow.AddHours(-1))
                    .CountAsync();

                if (recentErrors > 10)
                {
                    checks["error_rate"] = new { status = "degraded", message = $"High error rate: {recentErrors} errors in the last hour" };
                    if (status == "healthy") status = "degraded";
                }
                else
                {
                    checks["error_rate"] = new { status = "healthy", message = $"Error rate normal: {recentErrors} errors in the last hour" };
                }

                // System metrics
                var recentMetrics = await _db.SystemMetrics
                    .Where(m => m.Timestamp >= DateTime.UtcNow.AddMinutes(-5))
                    .ToListAsync();

                var metrics = recentMetrics.Select(MapToSystemMetricDto).ToList();

                return new SystemHealthDto
                {
                    Status = status,
                    Timestamp = DateTime.UtcNow,
                    Checks = checks,
                    Metrics = metrics,
                    Message = status == "healthy" ? "All systems operational" : "Some systems require attention"
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking system health");
                return new SystemHealthDto
                {
                    Status = "unhealthy",
                    Timestamp = DateTime.UtcNow,
                    Checks = new Dictionary<string, object> { ["health_check"] = new { status = "unhealthy", message = ex.Message } },
                    Metrics = new List<SystemMetricDto>(),
                    Message = "Health check failed"
                };
            }
        }

        public async Task<bool> IsSystemHealthyAsync()
        {
            try
            {
                var health = await GetSystemHealthAsync();
                return health.Status == "healthy";
            }
            catch
            {
                return false;
            }
        }

        public async Task CleanupOldDataAsync(int daysToKeep = 30)
        {
            try
            {
                var cutoffDate = DateTime.UtcNow.AddDays(-daysToKeep);

                // Clean up old analytics events
                var oldEvents = await _db.AnalyticsEvents
                    .Where(e => e.CreatedAt < cutoffDate)
                    .ToListAsync();

                if (oldEvents.Any())
                {
                    _db.AnalyticsEvents.RemoveRange(oldEvents);
                    _logger.LogInformation("Cleaned up {Count} old analytics events", oldEvents.Count);
                }

                // Clean up old system metrics
                var oldMetrics = await _db.SystemMetrics
                    .Where(m => m.Timestamp < cutoffDate)
                    .ToListAsync();

                if (oldMetrics.Any())
                {
                    _db.SystemMetrics.RemoveRange(oldMetrics);
                    _logger.LogInformation("Cleaned up {Count} old system metrics", oldMetrics.Count);
                }

                // Clean up old resolved errors
                var oldErrors = await _db.ErrorLogs
                    .Where(e => e.IsResolved && e.CreatedAt < cutoffDate)
                    .ToListAsync();

                if (oldErrors.Any())
                {
                    _db.ErrorLogs.RemoveRange(oldErrors);
                    _logger.LogInformation("Cleaned up {Count} old resolved errors", oldErrors.Count);
                }

                await _db.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error cleaning up old analytics data");
                throw;
            }
        }

        private static double CalculatePercentile(List<double> values, double percentile)
        {
            if (!values.Any()) return 0;

            var sortedValues = values.OrderBy(x => x).ToList();
            var index = (int)Math.Ceiling(percentile * sortedValues.Count) - 1;
            return sortedValues[Math.Max(0, Math.Min(index, sortedValues.Count - 1))];
        }

        private static AnalyticsEventDto MapToAnalyticsEventDto(AnalyticsEvent analyticsEvent) => new AnalyticsEventDto
        {
            Id = analyticsEvent.Id.ToString(),
            UserId = analyticsEvent.UserId.ToString(),
            EventType = analyticsEvent.EventType,
            EventName = analyticsEvent.EventName,
            Description = analyticsEvent.Description,
            Properties = analyticsEvent.Properties,
            Category = analyticsEvent.Category,
            Action = analyticsEvent.Action,
            Label = analyticsEvent.Label,
            Value = analyticsEvent.Value,
            SessionId = analyticsEvent.SessionId,
            PageUrl = analyticsEvent.PageUrl,
            Referrer = analyticsEvent.Referrer,
            UserAgent = analyticsEvent.UserAgent,
            IpAddress = analyticsEvent.IpAddress,
            CreatedAt = analyticsEvent.CreatedAt
        };

        private static SystemMetricDto MapToSystemMetricDto(SystemMetric metric) => new SystemMetricDto
        {
            Id = metric.Id.ToString(),
            MetricName = metric.MetricName,
            MetricType = metric.MetricType,
            Value = metric.Value,
            Labels = metric.Labels,
            Description = metric.Description,
            Timestamp = metric.Timestamp,
            Source = metric.Source
        };

        private static ErrorLogDto MapToErrorLogDto(ErrorLog error) => new ErrorLogDto
        {
            Id = error.Id.ToString(),
            ErrorType = error.ErrorType,
            ErrorMessage = error.ErrorMessage,
            StackTrace = error.StackTrace,
            Source = error.Source,
            Method = error.Method,
            RequestUrl = error.RequestUrl,
            RequestMethod = error.RequestMethod,
            UserId = error.UserId?.ToString(),
            SessionId = error.SessionId,
            IpAddress = error.IpAddress,
            UserAgent = error.UserAgent,
            AdditionalData = error.AdditionalData,
            Severity = error.Severity,
            CreatedAt = error.CreatedAt,
            IsResolved = error.IsResolved,
            ResolvedAt = error.ResolvedAt
        };
    }
}
