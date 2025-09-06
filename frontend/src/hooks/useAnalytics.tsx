import React, { createContext, useContext, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from './useAuth';
import { errorTracking } from '../services/errorTracking';

interface AnalyticsContextType {
  trackEvent: (eventType: string, eventName: string, properties?: Record<string, any>) => Promise<void>;
  trackPageView: (page: string) => Promise<void>;
  trackClick: (element: string, page: string) => Promise<void>;
  trackFormSubmit: (formName: string, success: boolean, error?: string) => Promise<void>;
  trackSearch: (query: string, results: number, filters?: Record<string, any>) => Promise<void>;
  trackApiCall: (method: string, url: string, statusCode: number, duration: number, error?: string) => Promise<void>;
  trackError: (errorType: string, errorMessage: string, context?: Record<string, any>) => Promise<void>;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

interface AnalyticsProviderProps {
  children: ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const { user } = useAuth();

  const trackPageView = useCallback(async (page: string) => {
    if (!user) return;
    
    try {
      await errorTracking.trackUserEvent('navigation', 'page_view', {
        page,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to track page view:', error);
    }
  }, [user]);

  useEffect(() => {
    // Track page view on mount
    if (user) {
      trackPageView(window.location.pathname);
    }
  }, [user, trackPageView]);

  const trackEvent = async (eventType: string, eventName: string, properties?: Record<string, any>) => {
    if (!user) return;
    
    try {
      await errorTracking.trackUserEvent(eventType, eventName, properties);
    } catch (error) {
      console.error('Failed to track event:', error);
    }
  };

  const trackClick = async (element: string, page: string) => {
    if (!user) return;
    
    try {
      await errorTracking.trackClick(element, page);
    } catch (error) {
      console.error('Failed to track click:', error);
    }
  };

  const trackFormSubmit = async (formName: string, success: boolean, error?: string) => {
    if (!user) return;
    
    try {
      await errorTracking.trackFormSubmit(formName, success, error);
    } catch (error) {
      console.error('Failed to track form submit:', error);
    }
  };

  const trackSearch = async (query: string, results: number, filters?: Record<string, any>) => {
    if (!user) return;
    
    try {
      await errorTracking.trackSearch(query, results, filters);
    } catch (error) {
      console.error('Failed to track search:', error);
    }
  };

  const trackApiCall = async (method: string, url: string, statusCode: number, duration: number, error?: string) => {
    try {
      await errorTracking.trackApiCall(method, url, statusCode, duration, error);
    } catch (error) {
      console.error('Failed to track API call:', error);
    }
  };

  const trackError = async (errorType: string, errorMessage: string, context?: Record<string, any>) => {
    try {
      await errorTracking.trackError(errorType, errorMessage, {
        additionalData: context
      });
    } catch (error) {
      console.error('Failed to track error:', error);
    }
  };

  const value: AnalyticsContextType = {
    trackEvent,
    trackPageView,
    trackClick,
    trackFormSubmit,
    trackSearch,
    trackApiCall,
    trackError
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = (): AnalyticsContextType => {
  const context = useContext(AnalyticsContext);
  if (context === undefined) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider');
  }
  return context;
};

// Higher-order component for automatic page view tracking
export const withAnalytics = <P extends object>(Component: React.ComponentType<P>) => {
  const WrappedComponent = (props: P) => {
    const { trackPageView } = useAnalytics();
    const { user } = useAuth();

    useEffect(() => {
      if (user) {
        trackPageView(window.location.pathname);
      }
    }, [user, trackPageView]);

    return <Component {...props} />;
  };
  
  WrappedComponent.displayName = `withAnalytics(${Component.displayName || Component.name})`;
  return WrappedComponent;
};

// Hook for tracking component interactions
export const useComponentAnalytics = (componentName: string) => {
  const { trackEvent, trackClick, trackError } = useAnalytics();

  const trackComponentEvent = (eventName: string, properties?: Record<string, any>) => {
    trackEvent('component', eventName, {
      component: componentName,
      ...properties
    });
  };

  const trackComponentClick = (element: string) => {
    trackClick(`${componentName}.${element}`, window.location.pathname);
  };

  const trackComponentError = (errorMessage: string, context?: Record<string, any>) => {
    trackError('Component Error', errorMessage, {
      component: componentName,
      ...context
    });
  };

  return {
    trackComponentEvent,
    trackComponentClick,
    trackComponentError
  };
};
