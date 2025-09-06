import React from 'react';

interface NotificationActionsProps {
  onMarkAllAsRead: () => void;
  onDeleteAll: () => void;
  hasUnread: boolean;
  hasNotifications: boolean;
}

const NotificationActions: React.FC<NotificationActionsProps> = ({
  onMarkAllAsRead,
  onDeleteAll,
  hasUnread,
  hasNotifications
}) => {
  if (!hasNotifications) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Bulkåtgärder</h3>
        <div className="flex items-center space-x-3">
          {hasUnread && (
            <button
              onClick={onMarkAllAsRead}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Markera alla som lästa
            </button>
          )}
          <button
            onClick={onDeleteAll}
            className="text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Ta bort alla
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationActions;
