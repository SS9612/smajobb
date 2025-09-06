import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
// import { notificationsApi } from '../services/notificationsApi';
import LoadingSpinner from '../components/LoadingSpinner';
import NotificationFilters from '../components/notifications/NotificationFilters';
import NotificationActions from '../components/notifications/NotificationActions';
import NotificationItem from '../components/notifications/NotificationItem';

const Notifications: React.FC = () => {
  const { user } = useAuth();
  const { 
    notifications, 
    unreadCount, 
    stats, 
    loading, 
    error,
    markAsRead, 
    deleteNotification,
    deleteAllNotifications,
    refreshNotifications 
  } = useNotifications();
  
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  useEffect(() => {
    if (user) {
      refreshNotifications();
    }
  }, [user, refreshNotifications]);

  const handleFilterChange = (newFilter: 'all' | 'unread' | 'read') => {
    setFilter(newFilter);
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.isRead);
      await Promise.all(unreadNotifications.map(n => markAsRead(n.id)));
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleDeleteAll = async () => {
    if (window.confirm('Är du säker på att du vill ta bort alla notifikationer?')) {
      try {
        await deleteAllNotifications();
      } catch (error) {
        console.error('Failed to delete all notifications:', error);
      }
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.isRead;
      case 'read':
        return notification.isRead;
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Laddar notifikationer..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Fel vid laddning</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => refreshNotifications()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Försök igen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <NotificationFilters
          filter={filter}
          onFilterChange={handleFilterChange}
          unreadCount={unreadCount}
          totalCount={notifications.length}
        />

        <NotificationActions
          onMarkAllAsRead={handleMarkAllAsRead}
          onDeleteAll={handleDeleteAll}
          hasUnread={unreadCount > 0}
          hasNotifications={notifications.length > 0}
        />

        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5-5-5h5v-5a7.5 7.5 0 1 0-15 0v5h5l-5 5-5-5h5V7a7.5 7.5 0 1 1 15 0v10z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'Inga notifikationer' : 
               filter === 'unread' ? 'Inga olästa notifikationer' : 
               'Inga lästa notifikationer'}
            </h3>
            <p className="text-gray-500">
              {filter === 'all' ? 'Du har inga notifikationer än.' : 
               filter === 'unread' ? 'Alla notifikationer är lästa.' : 
               'Du har inga lästa notifikationer.'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        {/* Stats Section */}
        {stats && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistik</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {stats.totalNotifications}
                </div>
                <div className="text-sm text-gray-500">Totalt antal</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {stats.totalNotifications - stats.unreadNotifications}
                </div>
                <div className="text-sm text-gray-500">Lästa</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  {stats.unreadNotifications}
                </div>
                <div className="text-sm text-gray-500">Olästa</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;