import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:7000/api';

export interface AnalyticsEvent {
  id: string;
  userId: string;
  eventType: string;
  eventName: string;
  description?: string;
  properties?: string;
  category?: string;
  action?: string;
  label?: string;
  value?: number;
  sessionId?: string;
  pageUrl?: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
  createdAt: string;
}

export interface CreateAnalyticsEvent {
  eventType: string;
  eventName: string;
  description?: string;
  properties?: string;
  category?: string;
  action?: string;
  label?: string;
  value?: number;
  sessionId?: string;
  pageUrl?: string;
  referrer?: string;
}

export interface SystemMetric {
  id: string;
  metricName: string;
  metricType: string;
  value: number;
  labels?: string;
  description?: string;
  timestamp: string;
  source?: string;
}

export interface ErrorLog {
  id: string;
  errorType: string;
  errorMessage: string;
  stackTrace?: string;
  source?: string;
  method?: string;
  requestUrl?: string;
  requestMethod?: string;
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  additionalData?: string;
  severity: string;
  createdAt: string;
  isResolved: boolean;
  resolvedAt?: string;
}

export interface AnalyticsSummary {
  totalEvents: number;
  uniqueUsers: number;
  totalErrors: number;
  unresolvedErrors: number;
  eventTypes: Record<string, number>;
  errorTypes: Record<string, number>;
  recentEvents: AnalyticsEvent[];
  recentErrors: ErrorLog[];
}

export interface SystemHealth {
  status: string;
  timestamp: string;
  checks: Record<string, any>;
  metrics: SystemMetric[];
  message?: string;
}

export interface PerformanceMetrics {
  averageResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
  totalRequests: number;
  errorRate: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  timestamp: string;
}

class AnalyticsApi {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Analytics Events
  async trackEvent(event: CreateAnalyticsEvent): Promise<AnalyticsEvent> {
    const response = await axios.post(`${API_BASE_URL}/analytics/events`, event, {
      headers: this.getAuthHeaders()
    });
    return response.data;
  }

  async getEvents(params?: {
    userId?: string;
    eventType?: string;
    from?: string;
    to?: string;
    page?: number;
    pageSize?: number;
  }): Promise<AnalyticsEvent[]> {
    const response = await axios.get(`${API_BASE_URL}/analytics/events`, {
      headers: this.getAuthHeaders(),
      params
    });
    return response.data;
  }

  async getAnalyticsSummary(params?: {
    from?: string;
    to?: string;
  }): Promise<AnalyticsSummary> {
    const response = await axios.get(`${API_BASE_URL}/analytics/summary`, {
      headers: this.getAuthHeaders(),
      params
    });
    return response.data;
  }

  // System Metrics
  async recordMetric(metric: {
    metricName: string;
    metricType: string;
    value: number;
    labels?: string;
    description?: string;
    source?: string;
  }): Promise<SystemMetric> {
    const response = await axios.post(`${API_BASE_URL}/analytics/metrics`, metric, {
      headers: this.getAuthHeaders()
    });
    return response.data;
  }

  async getMetrics(params?: {
    metricName?: string;
    source?: string;
    from?: string;
    to?: string;
  }): Promise<SystemMetric[]> {
    const response = await axios.get(`${API_BASE_URL}/analytics/metrics`, {
      headers: this.getAuthHeaders(),
      params
    });
    return response.data;
  }

  async getPerformanceMetrics(params?: {
    from?: string;
    to?: string;
  }): Promise<PerformanceMetrics> {
    const response = await axios.get(`${API_BASE_URL}/analytics/performance`, {
      headers: this.getAuthHeaders(),
      params
    });
    return response.data;
  }

  // Error Logging
  async logError(error: {
    errorType: string;
    errorMessage: string;
    stackTrace?: string;
    source?: string;
    method?: string;
    requestUrl?: string;
    requestMethod?: string;
    sessionId?: string;
    additionalData?: string;
    severity?: string;
  }): Promise<ErrorLog> {
    const response = await axios.post(`${API_BASE_URL}/analytics/errors`, error, {
      headers: this.getAuthHeaders()
    });
    return response.data;
  }

  async getErrors(params?: {
    errorType?: string;
    severity?: string;
    isResolved?: boolean;
    from?: string;
    to?: string;
    page?: number;
    pageSize?: number;
  }): Promise<ErrorLog[]> {
    const response = await axios.get(`${API_BASE_URL}/analytics/errors`, {
      headers: this.getAuthHeaders(),
      params
    });
    return response.data;
  }

  async resolveError(errorId: string): Promise<ErrorLog> {
    const response = await axios.put(`${API_BASE_URL}/analytics/errors/${errorId}/resolve`, {}, {
      headers: this.getAuthHeaders()
    });
    return response.data;
  }

  async getUnresolvedErrorCount(): Promise<number> {
    const response = await axios.get(`${API_BASE_URL}/analytics/errors/unresolved-count`, {
      headers: this.getAuthHeaders()
    });
    return response.data;
  }

  // System Health
  async getSystemHealth(): Promise<SystemHealth> {
    const response = await axios.get(`${API_BASE_URL}/analytics/health`, {
      headers: this.getAuthHeaders()
    });
    return response.data;
  }

  // Cleanup
  async cleanupOldData(daysToKeep: number = 30): Promise<void> {
    await axios.post(`${API_BASE_URL}/analytics/cleanup`, {}, {
      headers: this.getAuthHeaders(),
      params: { daysToKeep }
    });
  }
}

export const analyticsApi = new AnalyticsApi();
