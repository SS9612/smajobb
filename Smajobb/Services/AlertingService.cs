using Smajobb.Services.Interfaces;
using Microsoft.Extensions.Options;
using System.Text.Json;

namespace Smajobb.Services
{
    public interface IAlertingService
    {
        Task SendAlertAsync(string alertType, string message, string severity = "warning", Dictionary<string, object>? metadata = null);
        Task CheckSystemHealthAlertsAsync();
        Task CheckPerformanceAlertsAsync();
        Task CheckErrorRateAlertsAsync();
    }

    public class AlertingService : IAlertingService
    {
        private readonly IAnalyticsService _analyticsService;
        private readonly INotificationService _notificationService;
        private readonly ILogger<AlertingService> _logger;
        private readonly AlertingOptions _options;

        public AlertingService(
            IAnalyticsService analyticsService,
            INotificationService notificationService,
            ILogger<AlertingService> logger,
            IOptions<AlertingOptions> options)
        {
            _analyticsService = analyticsService;
            _notificationService = notificationService;
            _logger = logger;
            _options = options.Value;
        }

        public async Task SendAlertAsync(string alertType, string message, string severity = "warning", Dictionary<string, object>? metadata = null)
        {
            try
            {
                _logger.LogWarning("ALERT: {AlertType} - {Message} (Severity: {Severity})", alertType, message, severity);

                // Log the alert as an error for tracking
                await _analyticsService.LogErrorAsync(
                    "SYSTEM_ALERT",
                    $"{alertType}: {message}",
                    null,
                    "AlertingService",
                    "SendAlertAsync",
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    JsonSerializer.Serialize(metadata ?? new Dictionary<string, object>()),
                    severity
                );

                // Send notification to admin users if severity is high
                if (severity == "critical" || severity == "error")
                {
                    await SendAdminNotificationAsync(alertType, message, severity, metadata);
                }

                // Here you could integrate with external alerting services like:
                // - Slack webhooks
                // - Email services
                // - SMS services
                // - PagerDuty
                // - Discord webhooks
                // etc.
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send alert: {AlertType} - {Message}", alertType, message);
            }
        }

        public async Task CheckSystemHealthAlertsAsync()
        {
            try
            {
                var health = await _analyticsService.GetSystemHealthAsync();
                
                if (health.Status == "unhealthy")
                {
                    await SendAlertAsync(
                        "SYSTEM_HEALTH",
                        $"System health is {health.Status}: {health.Message}",
                        "critical",
                        new Dictionary<string, object>
                        {
                            { "status", health.Status },
                            { "checks", health.Checks },
                            { "timestamp", health.Timestamp }
                        }
                    );
                }
                else if (health.Status == "degraded")
                {
                    await SendAlertAsync(
                        "SYSTEM_HEALTH",
                        $"System health is {health.Status}: {health.Message}",
                        "warning",
                        new Dictionary<string, object>
                        {
                            { "status", health.Status },
                            { "checks", health.Checks },
                            { "timestamp", health.Timestamp }
                        }
                    );
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking system health alerts");
            }
        }

        public async Task CheckPerformanceAlertsAsync()
        {
            try
            {
                var metrics = await _analyticsService.GetPerformanceMetricsAsync();
                
                // Check response time
                if (metrics.AverageResponseTime > _options.MaxResponseTime)
                {
                    await SendAlertAsync(
                        "PERFORMANCE",
                        $"Average response time is {metrics.AverageResponseTime:F0}ms (threshold: {_options.MaxResponseTime}ms)",
                        "warning",
                        new Dictionary<string, object>
                        {
                            { "averageResponseTime", metrics.AverageResponseTime },
                            { "threshold", _options.MaxResponseTime },
                            { "p95ResponseTime", metrics.P95ResponseTime },
                            { "p99ResponseTime", metrics.P99ResponseTime }
                        }
                    );
                }

                // Check error rate
                if (metrics.ErrorRate > _options.MaxErrorRate)
                {
                    await SendAlertAsync(
                        "PERFORMANCE",
                        $"Error rate is {metrics.ErrorRate:F2}% (threshold: {_options.MaxErrorRate}%)",
                        "critical",
                        new Dictionary<string, object>
                        {
                            { "errorRate", metrics.ErrorRate },
                            { "threshold", _options.MaxErrorRate },
                            { "totalRequests", metrics.TotalRequests }
                        }
                    );
                }

                // Check CPU usage
                if (metrics.CpuUsage > _options.MaxCpuUsage)
                {
                    await SendAlertAsync(
                        "RESOURCE_USAGE",
                        $"CPU usage is {metrics.CpuUsage:F1}% (threshold: {_options.MaxCpuUsage}%)",
                        "warning",
                        new Dictionary<string, object>
                        {
                            { "cpuUsage", metrics.CpuUsage },
                            { "threshold", _options.MaxCpuUsage },
                            { "memoryUsage", metrics.MemoryUsage },
                            { "diskUsage", metrics.DiskUsage }
                        }
                    );
                }

                // Check memory usage
                if (metrics.MemoryUsage > _options.MaxMemoryUsage)
                {
                    await SendAlertAsync(
                        "RESOURCE_USAGE",
                        $"Memory usage is {metrics.MemoryUsage:F1}% (threshold: {_options.MaxMemoryUsage}%)",
                        "warning",
                        new Dictionary<string, object>
                        {
                            { "memoryUsage", metrics.MemoryUsage },
                            { "threshold", _options.MaxMemoryUsage },
                            { "cpuUsage", metrics.CpuUsage },
                            { "diskUsage", metrics.DiskUsage }
                        }
                    );
                }

                // Check disk usage
                if (metrics.DiskUsage > _options.MaxDiskUsage)
                {
                    await SendAlertAsync(
                        "RESOURCE_USAGE",
                        $"Disk usage is {metrics.DiskUsage:F1}% (threshold: {_options.MaxDiskUsage}%)",
                        "critical",
                        new Dictionary<string, object>
                        {
                            { "diskUsage", metrics.DiskUsage },
                            { "threshold", _options.MaxDiskUsage },
                            { "cpuUsage", metrics.CpuUsage },
                            { "memoryUsage", metrics.MemoryUsage }
                        }
                    );
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking performance alerts");
            }
        }

        public async Task CheckErrorRateAlertsAsync()
        {
            try
            {
                var unresolvedCount = await _analyticsService.GetUnresolvedErrorCountAsync();
                
                if (unresolvedCount > _options.MaxUnresolvedErrors)
                {
                    await SendAlertAsync(
                        "ERROR_RATE",
                        $"Number of unresolved errors is {unresolvedCount} (threshold: {_options.MaxUnresolvedErrors})",
                        "warning",
                        new Dictionary<string, object>
                        {
                            { "unresolvedErrors", unresolvedCount },
                            { "threshold", _options.MaxUnresolvedErrors }
                        }
                    );
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking error rate alerts");
            }
        }

        private Task SendAdminNotificationAsync(string alertType, string message, string severity, Dictionary<string, object>? metadata)
        {
            try
            {
                // This would typically query for admin users and send them notifications
                // For now, we'll create a system notification
                var notificationMessage = $"[{severity.ToUpper()}] {alertType}: {message}";
                
                // In a real implementation, you would:
                // 1. Query for admin users
                // 2. Send notifications to each admin
                // 3. Or send to a specific admin group
                
                _logger.LogInformation("Would send admin notification: {Message}", notificationMessage);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send admin notification");
            }
            
            return Task.CompletedTask;
        }
    }

    public class AlertingOptions
    {
        public int MaxResponseTime { get; set; } = 5000; // 5 seconds
        public double MaxErrorRate { get; set; } = 5.0; // 5%
        public double MaxCpuUsage { get; set; } = 80.0; // 80%
        public double MaxMemoryUsage { get; set; } = 85.0; // 85%
        public double MaxDiskUsage { get; set; } = 90.0; // 90%
        public int MaxUnresolvedErrors { get; set; } = 50;
        public bool EnableAlerts { get; set; } = true;
    }
}
