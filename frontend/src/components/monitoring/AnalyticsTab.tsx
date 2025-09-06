import React, { useState, useEffect } from 'react';
import { analyticsApi, AnalyticsSummary } from '../../services/analyticsApi';
import LoadingSpinner from '../LoadingSpinner';

const AnalyticsTab: React.FC = () => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalyticsSummary();
  }, []);

  const loadAnalyticsSummary = async () => {
    try {
      const data = await analyticsApi.getAnalyticsSummary();
      setSummary(data);
    } catch (error) {
      console.error('Failed to load analytics summary:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <LoadingSpinner size="lg" text="Loading analytics..." />
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <p className="text-gray-500 text-center">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {summary.totalEvents.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">Total Events</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {summary.uniqueUsers.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">Unique Users</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {summary.totalErrors.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">Total Errors</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {summary.unresolvedErrors.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500">Unresolved Errors</div>
          </div>
        </div>
      </div>

      {/* Event Types */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Types</h3>
          <div className="space-y-2">
            {Object.entries(summary.eventTypes).map(([type, count]) => (
              <div key={type} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 capitalize">{type.replace('_', ' ')}</span>
                <span className="text-sm font-medium">{count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Error Types</h3>
          <div className="space-y-2">
            {Object.entries(summary.errorTypes).map(([type, count]) => (
              <div key={type} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{type}</span>
                <span className="text-sm font-medium">{count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Events</h3>
        <div className="space-y-3">
          {summary.recentEvents.map((event) => (
            <div key={event.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-900">{event.eventName}</div>
                  <div className="text-xs text-gray-500">{event.eventType}</div>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(event.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsTab;
