import React, { useState, useEffect } from 'react';
import { analyticsApi } from '../../services/analyticsApi';
import LoadingSpinner from '../LoadingSpinner';

const ErrorsTab: React.FC = () => {
  const [errors, setErrors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    severity: '',
    isResolved: undefined as boolean | undefined,
    page: 1,
    pageSize: 20
  });

  useEffect(() => {
    loadErrors();
  }, [filters]);

  const loadErrors = async () => {
    try {
      const data = await analyticsApi.getErrors(filters);
      setErrors(data);
    } catch (error) {
      console.error('Failed to load errors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveError = async (errorId: string) => {
    try {
      await analyticsApi.resolveError(errorId);
      await loadErrors();
    } catch (error) {
      console.error('Failed to resolve error:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <LoadingSpinner size="lg" text="Loading errors..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filters.severity}
            onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Severities</option>
            <option value="error">Error</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>

          <select
            value={filters.isResolved === undefined ? '' : filters.isResolved.toString()}
            onChange={(e) => {
              const value = e.target.value === '' ? undefined : e.target.value === 'true';
              setFilters({ ...filters, isResolved: value });
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Status</option>
            <option value="false">Unresolved</option>
            <option value="true">Resolved</option>
          </select>

          <button
            onClick={() => setFilters({ severity: '', isResolved: undefined, page: 1, pageSize: 20 })}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 text-sm"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Errors List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Error Logs</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {errors.map((error) => (
            <div key={error.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      error.severity === 'error' ? 'text-red-600 bg-red-100' :
                      error.severity === 'warning' ? 'text-yellow-600 bg-yellow-100' :
                      'text-blue-600 bg-blue-100'
                    }`}>
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
                  {error.stackTrace && (
                    <details className="mt-2">
                      <summary className="text-xs text-gray-500 cursor-pointer">Stack Trace</summary>
                      <pre className="text-xs text-gray-600 mt-1 bg-gray-50 p-2 rounded overflow-x-auto">
                        {error.stackTrace}
                      </pre>
                    </details>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
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
      </div>
    </div>
  );
};

export default ErrorsTab;
