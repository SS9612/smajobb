import React from 'react';

interface NotificationFiltersProps {
  filter: 'all' | 'unread' | 'read';
  onFilterChange: (filter: 'all' | 'unread' | 'read') => void;
  unreadCount: number;
  totalCount: number;
}

const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  filter,
  onFilterChange,
  unreadCount,
  totalCount
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Notifikationer ({totalCount})
          </h2>
          {unreadCount > 0 && (
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {unreadCount} olästa
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onFilterChange('all')}
            className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
              filter === 'all'
                ? 'bg-blue-100 text-blue-800'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            Alla
          </button>
          <button
            onClick={() => onFilterChange('unread')}
            className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
              filter === 'unread'
                ? 'bg-blue-100 text-blue-800'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            Olästa ({unreadCount})
          </button>
          <button
            onClick={() => onFilterChange('read')}
            className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
              filter === 'read'
                ? 'bg-blue-100 text-blue-800'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            Lästa
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationFilters;
