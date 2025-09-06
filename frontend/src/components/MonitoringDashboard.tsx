import React, { useState, useEffect } from 'react';
import { analyticsApi, SystemHealth, PerformanceMetrics, AnalyticsSummary, ErrorLog } from '../services/analyticsApi';
import LoadingSpinner from './LoadingSpinner';

interface MonitoringDashboardProps {
  className?: string;
}

const MonitoringDashboard: React.FC<MonitoringDashboardProps> = ({ className = '' }) => {
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics | null>(null);
  const [analyticsSummary, setAnalyticsSummary] = useState<AnalyticsSummary | null>(null);
  const [recentErrors, setRecentErrors] = useState<ErrorLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMonitoringData();
    const interval = setInterval(loadMonitoringData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadMonitoringData = async () => {
    try {
      setError(null);
      const [health, performance, summary, errors] = await Promise.all([
        analyticsApi.getSystemHealth(),
        analyticsApi.getPerformanceMetrics(),
        analyticsApi.getAnalyticsSummary(),
        analyticsApi.getErrors({ pageSize: 10 })
      ]);

      setSystemHealth(health);
      setPerformanceMetrics(performance);
      setAnalyticsSummary(summary);
      setRecentErrors(errors);
    } catch (err) {
      setError('Failed to load monitoring data');
      console.error('Error loading monitoring data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'degraded': return 'text-yellow-600 bg-yellow-100';
      case 'unhealthy': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'error': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'info': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className={`monitoring-dashboard ${className}`}>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" text="Loading monitoring data..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`monitoring-dashboard ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`monitoring-dashboard ${className}`}>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* System Health */}
        {systemHealth && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(systemHealth.status)}`}>
                {systemHealth.status.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">{systemHealth.message}</p>
            
            <div className="space-y-2">
              {Object.entries(systemHealth.checks).map(([check, data]: [string, any]) => (
                <div key={check} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 capitalize">{check.replace('_', ' ')}</span>
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(data.status)}`}>
                    {data.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance Metrics */}
        {performanceMetrics && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {performanceMetrics.averageResponseTime.toFixed(0)}ms
                </div>
                <div className="text-xs text-gray-500">Avg Response</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {performanceMetrics.totalRequests.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">Total Requests</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {performanceMetrics.errorRate.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500">Error Rate</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {performanceMetrics.cpuUsage.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-500">CPU Usage</div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Summary */}
        {analyticsSummary && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Analytics</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {analyticsSummary.totalEvents.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">Total Events</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {analyticsSummary.uniqueUsers.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">Unique Users</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {analyticsSummary.totalErrors.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">Total Errors</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {analyticsSummary.unresolvedErrors.toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">Unresolved</div>
              </div>
            </div>
          </div>
        )}

        {/* Recent Errors */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 lg:col-span-2 xl:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Errors</h3>
            <button
              onClick={loadMonitoringData}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Refresh
            </button>
          </div>
          
          {recentErrors.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              No recent errors
            </div>
          ) : (
            <div className="space-y-3">
              {recentErrors.map((error) => (
                <div key={error.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(error.severity)}`}>
                          {error.severity.toUpperCase()}
                        </span>
                        <span className="text-sm font-medium text-gray-900">{error.errorType}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(error.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{error.errorMessage}</p>
                      {error.source && (
                        <p className="text-xs text-gray-500">
                          Source: {error.source} • Method: {error.method || 'N/A'}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {!error.isResolved && (
                        <button
                          onClick={() => handleResolveError(error.id)}
                          className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded hover:bg-green-200"
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  async function handleResolveError(errorId: string) {
    try {
      await analyticsApi.resolveError(errorId);
      await loadMonitoringData(); // Refresh data
    } catch (err) {
      console.error('Failed to resolve error:', err);
    }
  }
};

export default MonitoringDashboard;
