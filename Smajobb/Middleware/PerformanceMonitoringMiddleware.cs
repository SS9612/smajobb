using Smajobb.Services.Interfaces;
using Smajobb.DTOs;
using System.Diagnostics;

namespace Smajobb.Middleware
{
    public class PerformanceMonitoringMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<PerformanceMonitoringMiddleware> _logger;
        private readonly IAnalyticsService _analyticsService;

        public PerformanceMonitoringMiddleware(RequestDelegate next, ILogger<PerformanceMonitoringMiddleware> logger, IAnalyticsService analyticsService)
        {
            _next = next;
            _logger = logger;
            _analyticsService = analyticsService;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var stopwatch = Stopwatch.StartNew();
            var requestPath = context.Request.Path.Value ?? "";
            var requestMethod = context.Request.Method;
            var userAgent = context.Request.Headers.UserAgent.ToString();
            var ipAddress = context.Connection.RemoteIpAddress?.ToString();

            try
            {
                await _next(context);
            }
            finally
            {
                stopwatch.Stop();
                var responseTime = stopwatch.ElapsedMilliseconds;
                var statusCode = context.Response.StatusCode;

                // Record performance metrics
                await RecordPerformanceMetrics(requestPath, requestMethod, responseTime, statusCode, userAgent, ipAddress);
            }
        }

        private async Task RecordPerformanceMetrics(string requestPath, string requestMethod, long responseTime, int statusCode, string userAgent, string? ipAddress)
        {
            try
            {
                // Record response time metric
                await _analyticsService.RecordMetricAsync(new CreateSystemMetricDto
                {
                    MetricName = "response_time",
                    MetricType = "histogram",
                    Value = responseTime,
                    Labels = System.Text.Json.JsonSerializer.Serialize(new
                    {
                        path = requestPath,
                        method = requestMethod,
                        status_code = statusCode
                    }),
                    Description = "HTTP request response time",
                    Source = "api"
                });

                // Record request count metric
                await _analyticsService.RecordMetricAsync(new CreateSystemMetricDto
                {
                    MetricName = "request_count",
                    MetricType = "counter",
                    Value = 1,
                    Labels = System.Text.Json.JsonSerializer.Serialize(new
                    {
                        path = requestPath,
                        method = requestMethod,
                        status_code = statusCode
                    }),
                    Description = "HTTP request count",
                    Source = "api"
                });

                // Record error count if status code indicates error
                if (statusCode >= 400)
                {
                    await _analyticsService.RecordMetricAsync(new CreateSystemMetricDto
                    {
                        MetricName = "error_count",
                        MetricType = "counter",
                        Value = 1,
                        Labels = System.Text.Json.JsonSerializer.Serialize(new
                        {
                            path = requestPath,
                            method = requestMethod,
                            status_code = statusCode
                        }),
                        Description = "HTTP error count",
                        Source = "api"
                    });

                    // Log error details
                    await _analyticsService.LogErrorAsync(
                        "HTTP_ERROR",
                        $"HTTP {statusCode} error for {requestMethod} {requestPath}",
                        null,
                        "PerformanceMonitoringMiddleware",
                        "InvokeAsync",
                        requestPath,
                        requestMethod,
                        null,
                        null,
                        ipAddress,
                        userAgent,
                        System.Text.Json.JsonSerializer.Serialize(new { response_time = responseTime }),
                        statusCode >= 500 ? "error" : "warning"
                    );
                }

                // Log slow requests
                if (responseTime > 5000) // 5 seconds
                {
                    _logger.LogWarning("Slow request detected: {Method} {Path} took {ResponseTime}ms", 
                        requestMethod, requestPath, responseTime);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error recording performance metrics for {Method} {Path}", 
                    requestMethod, requestPath);
            }
        }
    }

    public static class PerformanceMonitoringMiddlewareExtensions
    {
        public static IApplicationBuilder UsePerformanceMonitoring(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<PerformanceMonitoringMiddleware>();
        }
    }
}
