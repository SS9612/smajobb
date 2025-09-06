# Monitoring and Analytics Setup

This document describes the comprehensive monitoring and analytics system implemented for the Småjobb platform.

## Overview

The monitoring system provides:
- **Real-time system health monitoring**
- **Performance metrics collection**
- **Error tracking and alerting**
- **User behavior analytics**
- **Automated alerting for critical issues**

## Backend Monitoring

### 1. Analytics Service (`IAnalyticsService`)

The analytics service provides comprehensive tracking capabilities:

#### Features:
- **Event Tracking**: Track user interactions and system events
- **System Metrics**: Collect performance and resource usage data
- **Error Logging**: Centralized error tracking with context
- **Health Monitoring**: System health checks and status reporting

#### Key Methods:
```csharp
// Track user events
Task<AnalyticsEventDto> TrackEventAsync(CreateAnalyticsEventDto eventDto, string userId, string? ipAddress = null, string? userAgent = null);

// Record system metrics
Task<SystemMetricDto> RecordMetricAsync(CreateSystemMetricDto metricDto);

// Log errors with context
Task<ErrorLogDto> LogErrorAsync(string errorType, string errorMessage, string? stackTrace = null, ...);

// Get system health status
Task<SystemHealthDto> GetSystemHealthAsync();
```

### 2. Performance Monitoring Middleware

Automatically tracks HTTP request performance:

#### Metrics Collected:
- **Response Time**: Average, P95, P99 response times
- **Request Count**: Total requests by endpoint and method
- **Error Rate**: HTTP error rates by status code
- **Slow Requests**: Requests taking longer than 5 seconds

#### Implementation:
```csharp
// Automatically applied to all HTTP requests
app.UsePerformanceMonitoring();
```

### 3. System Metrics Collector

Background service that collects system resource metrics:

#### Metrics Collected:
- **CPU Usage**: Current CPU utilization
- **Memory Usage**: Memory consumption percentage
- **Disk Usage**: Disk space utilization
- **Process Count**: Number of running processes
- **Thread Count**: Application thread count
- **GC Collections**: Garbage collection statistics
- **Working Set Memory**: Application memory usage

#### Collection Interval:
- Runs every minute
- Stores metrics in database for historical analysis

### 4. Alerting System

Automated alerting for critical system issues:

#### Alert Types:
- **System Health**: Database connectivity, service availability
- **Performance**: High response times, error rates
- **Resource Usage**: CPU, memory, disk usage thresholds
- **Error Rate**: High number of unresolved errors

#### Alert Severities:
- **Critical**: System down, high error rates, disk full
- **Warning**: Performance degradation, resource usage high
- **Info**: General system status updates

#### Configuration:
```json
{
  "Alerting": {
    "MaxResponseTime": 5000,
    "MaxErrorRate": 5.0,
    "MaxCpuUsage": 80.0,
    "MaxMemoryUsage": 85.0,
    "MaxDiskUsage": 90.0,
    "MaxUnresolvedErrors": 50,
    "EnableAlerts": true
  }
}
```

## Frontend Monitoring

### 1. Error Tracking Service

Comprehensive frontend error tracking:

#### Features:
- **JavaScript Error Tracking**: Unhandled errors and promise rejections
- **React Error Boundary Integration**: Component-level error tracking
- **Performance Monitoring**: Page load times, API call durations
- **User Interaction Tracking**: Clicks, form submissions, searches

#### Implementation:
```typescript
// Automatic error tracking
import { errorTracking } from './services/errorTracking';

// Track custom errors
await errorTracking.trackError('Custom Error', 'Something went wrong', {
  additionalData: { context: 'user-action' }
});

// Track user events
await errorTracking.trackUserEvent('interaction', 'button_click', {
  button: 'submit',
  page: '/jobs/create'
});
```

### 2. Analytics Hook

React hook for easy analytics integration:

#### Usage:
```typescript
import { useAnalytics } from './hooks/useAnalytics';

const MyComponent = () => {
  const { trackEvent, trackClick, trackFormSubmit } = useAnalytics();

  const handleClick = () => {
    trackClick('submit-button', window.location.pathname);
  };

  const handleFormSubmit = (success: boolean) => {
    trackFormSubmit('job-creation', success);
  };
};
```

### 3. Performance Monitoring

Automatic performance tracking:

#### Metrics Collected:
- **Page Load Time**: Time to load complete page
- **DOM Content Loaded**: Time to parse HTML
- **First Paint**: Time to first visual content
- **API Call Duration**: Response times for API calls
- **Route Change Duration**: Navigation performance

## Monitoring Dashboard

### 1. System Overview

Real-time dashboard showing:
- **System Health Status**: Overall system health
- **Performance Metrics**: Response times, error rates
- **Resource Usage**: CPU, memory, disk utilization
- **Recent Errors**: Latest error logs with details

### 2. Performance Tab

Detailed performance analysis:
- **Response Time Percentiles**: P50, P95, P99
- **Request Statistics**: Total requests, success rates
- **Resource Monitoring**: Real-time resource usage
- **Historical Trends**: Performance over time

### 3. Error Management

Comprehensive error tracking:
- **Error Filtering**: By type, severity, status
- **Error Details**: Stack traces, context, user info
- **Error Resolution**: Mark errors as resolved
- **Error Trends**: Error patterns and frequency

### 4. Analytics Tab

User behavior and platform analytics:
- **Event Tracking**: User interactions and events
- **User Statistics**: Active users, engagement metrics
- **Error Analytics**: Error types and patterns
- **Performance Analytics**: User experience metrics

## Database Schema

### Analytics Tables

#### `AnalyticsEvents`
- User event tracking
- Event types, properties, timestamps
- Session and page context

#### `SystemMetrics`
- Performance and resource metrics
- Metric types, values, labels
- Source and timestamp information

#### `ErrorLogs`
- Centralized error logging
- Error types, messages, stack traces
- User context and resolution status

## API Endpoints

### Analytics Endpoints

```
GET    /api/analytics/health          - System health status
GET    /api/analytics/performance     - Performance metrics
GET    /api/analytics/summary         - Analytics summary
GET    /api/analytics/events          - Event logs
GET    /api/analytics/errors          - Error logs
POST   /api/analytics/events          - Track event
POST   /api/analytics/errors          - Log error
PUT    /api/analytics/errors/{id}/resolve - Resolve error
```

## Configuration

### Environment Variables

```bash
# Analytics
ANALYTICS_ENABLED=true
ANALYTICS_RETENTION_DAYS=30

# Alerting
ALERTING_ENABLED=true
ALERTING_WEBHOOK_URL=https://hooks.slack.com/...
ALERTING_EMAIL_RECIPIENTS=admin@smajobb.se

# Performance
PERFORMANCE_MONITORING_ENABLED=true
PERFORMANCE_SLOW_REQUEST_THRESHOLD=5000
```

### Production Settings

For production deployment:

1. **Enable all monitoring services**
2. **Configure alerting thresholds**
3. **Set up external alerting (Slack, email, SMS)**
4. **Configure log retention policies**
5. **Set up monitoring dashboards**
6. **Configure backup and recovery**

## Security Considerations

### Data Privacy
- **User Data**: Analytics data is anonymized where possible
- **IP Addresses**: Stored for security but not exposed in APIs
- **Personal Information**: Minimized in error logs and analytics

### Access Control
- **Admin Only**: Monitoring dashboard requires admin privileges
- **API Security**: All monitoring endpoints require authentication
- **Data Retention**: Automatic cleanup of old monitoring data

## Troubleshooting

### Common Issues

1. **High Memory Usage**
   - Check for memory leaks in analytics data
   - Review data retention settings
   - Monitor garbage collection metrics

2. **Slow Performance**
   - Check database query performance
   - Review middleware overhead
   - Monitor system resource usage

3. **Missing Metrics**
   - Verify background services are running
   - Check database connectivity
   - Review error logs for collection failures

### Monitoring Health Checks

The system includes built-in health checks:
- Database connectivity
- Background service status
- Error rate monitoring
- Resource usage alerts

## Future Enhancements

### Planned Features
- **Real-time Dashboards**: Live updating monitoring views
- **Custom Alerts**: User-configurable alert rules
- **Integration APIs**: Third-party monitoring tool integration
- **Advanced Analytics**: Machine learning insights
- **Mobile Monitoring**: Mobile app performance tracking

### External Integrations
- **Slack Notifications**: Real-time alert notifications
- **Email Alerts**: Critical issue email notifications
- **SMS Alerts**: Emergency SMS notifications
- **PagerDuty Integration**: Incident management
- **Grafana Dashboards**: Advanced visualization
- **Prometheus Metrics**: Industry-standard metrics

## Conclusion

The monitoring and analytics system provides comprehensive visibility into the Småjobb platform's health, performance, and user behavior. It enables proactive issue detection, performance optimization, and data-driven decision making.

The system is designed to scale with the platform and can be extended with additional monitoring tools and integrations as needed.
