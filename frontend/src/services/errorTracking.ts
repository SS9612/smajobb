import { analyticsApi } from './analyticsApi';

export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  pageUrl?: string;
  userAgent?: string;
  timestamp?: string;
  additionalData?: Record<string, any>;
  filename?: string;
  reason?: any;
  lineno?: number;
  colno?: number;
  stack?: string;
}

class ErrorTrackingService {
  private sessionId: string;
  private isInitialized = false;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initialize();
  }

  private generateSessionId(): string {
    return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }

  private initialize() {
    if (this.isInitialized) return;

    // Track unhandled JavaScript errors
    window.addEventListener('error', (event) => {
      this.trackError('JavaScript Error', event.error?.message || event.message, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        pageUrl: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      });
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError('Unhandled Promise Rejection', event.reason?.message || String(event.reason), {
        reason: event.reason,
        stack: event.reason?.stack,
        pageUrl: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      });
    });

    // Track React error boundaries
    this.setupReactErrorBoundary();

    this.isInitialized = true;
  }

  private setupReactErrorBoundary() {
    // This will be used by the ErrorBoundary component
    (window as any).__errorTrackingService = this;
  }

  async trackError(
    errorType: string,
    errorMessage: string,
    context: ErrorContext = {}
  ): Promise<void> {
    try {
      const errorData = {
        errorType,
        errorMessage,
        stackTrace: context.additionalData?.stack,
        source: 'frontend',
        method: context.additionalData?.method || 'unknown',
        requestUrl: context.pageUrl || window.location.href,
        requestMethod: 'GET', // Default for frontend errors
        sessionId: this.sessionId,
        additionalData: JSON.stringify({
          ...context.additionalData,
          timestamp: context.timestamp || new Date().toISOString(),
          userAgent: context.userAgent || navigator.userAgent,
          pageUrl: context.pageUrl || window.location.href,
          referrer: document.referrer,
          viewport: {
            width: window.innerWidth,
            height: window.innerHeight
          },
          screen: {
            width: window.screen.width,
            height: window.screen.height
          }
        }),
        severity: this.determineSeverity(errorType, errorMessage)
      };

      await analyticsApi.logError(errorData);
    } catch (error) {
      console.error('Failed to track error:', error);
    }
  }

  private determineSeverity(errorType: string, errorMessage: string): string {
    // Determine severity based on error type and message
    if (errorType.includes('Network') || errorType.includes('API')) {
      return 'error';
    }
    
    if (errorType.includes('Validation') || errorType.includes('User')) {
      return 'warning';
    }
    
    if (errorMessage.includes('ChunkLoadError') || errorMessage.includes('Loading chunk')) {
      return 'warning'; // These are often recoverable
    }
    
    return 'error';
  }

  async trackPerformanceMetric(
    metricName: string,
    value: number,
    labels?: Record<string, any>
  ): Promise<void> {
    try {
      await analyticsApi.recordMetric({
        metricName,
        metricType: 'histogram',
        value,
        labels: labels ? JSON.stringify(labels) : undefined,
        description: `Frontend performance metric: ${metricName}`,
        source: 'frontend'
      });
    } catch (error) {
      console.error('Failed to track performance metric:', error);
    }
  }

  async trackUserEvent(
    eventType: string,
    eventName: string,
    properties?: Record<string, any>
  ): Promise<void> {
    try {
      await analyticsApi.trackEvent({
        eventType,
        eventName,
        properties: properties ? JSON.stringify(properties) : undefined,
        pageUrl: window.location.href,
        referrer: document.referrer,
        sessionId: this.sessionId
      });
    } catch (error) {
      console.error('Failed to track user event:', error);
    }
  }

  // Performance monitoring
  measurePageLoad(): void {
    if (typeof window !== 'undefined' && window.performance) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          
          if (navigation) {
            this.trackPerformanceMetric('page_load_time', navigation.loadEventEnd - navigation.fetchStart, {
              page: window.location.pathname
            });
            
            this.trackPerformanceMetric('dom_content_loaded', navigation.domContentLoadedEventEnd - navigation.fetchStart, {
              page: window.location.pathname
            });
            
            this.trackPerformanceMetric('first_paint', navigation.responseEnd - navigation.fetchStart, {
              page: window.location.pathname
            });
          }
        }, 0);
      });
    }
  }

  // Track route changes
  trackRouteChange(from: string, to: string, duration?: number): void {
    this.trackUserEvent('navigation', 'route_change', {
      from,
      to,
      duration
    });
  }

  // Track API calls
  trackApiCall(
    method: string,
    url: string,
    statusCode: number,
    duration: number,
    error?: string
  ): void {
    this.trackPerformanceMetric('api_call_duration', duration, {
      method,
      url,
      statusCode,
      hasError: !!error
    });

    if (error) {
      this.trackError('API Error', error, {
        additionalData: {
          method,
          url,
          statusCode,
          duration
        }
      });
    }
  }

  // Track user interactions
  trackClick(element: string, page: string): void {
    this.trackUserEvent('interaction', 'click', {
      element,
      page
    });
  }

  trackFormSubmit(formName: string, success: boolean, error?: string): void {
    this.trackUserEvent('interaction', 'form_submit', {
      formName,
      success,
      error
    });

    if (error) {
      this.trackError('Form Error', error, {
        additionalData: {
          formName,
          success
        }
      });
    }
  }

  trackSearch(query: string, results: number, filters?: Record<string, any>): void {
    this.trackUserEvent('search', 'search_performed', {
      query,
      results,
      filters
    });
  }

  // Get session ID for external use
  getSessionId(): string {
    return this.sessionId;
  }
}

// Create singleton instance
export const errorTracking = new ErrorTrackingService();

// Initialize performance monitoring
errorTracking.measurePageLoad();
