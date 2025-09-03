import React, { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../hooks/useNotifications';
import { notificationsApi } from '../services/notificationsApi';

interface NotificationBellProps {
  className?: string;
  showCount?: boolean;
  maxCount?: number;
}

const NotificationBell: React.FC<NotificationBellProps> = ({
  className = '',
  showCount = true,
  maxCount = 99
}) => {
  const { unreadCount, isConnected } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [showPulse, setShowPulse] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  // Show pulse animation when new notifications arrive
  useEffect(() => {
    if (unreadCount > 0) {
      setShowPulse(true);
      const timer = setTimeout(() => setShowPulse(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [unreadCount]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayCount = unreadCount > maxCount ? `${maxCount}+` : unreadCount.toString();

  return (
    <div ref={bellRef} className={`notification-bell ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`notification-bell-button ${showPulse ? 'pulse' : ''} ${isConnected ? 'connected' : 'disconnected'}`}
        title={isConnected ? 'Notifikationer' : 'Anslutning till notifikationer saknas'}
      >
        <span className="notification-bell-icon">
          🔔
        </span>
        {showCount && unreadCount > 0 && (
          <span className="notification-bell-count">
            {displayCount}
          </span>
        )}
        {!isConnected && (
          <span className="notification-bell-status" title="Anslutning saknas">
            ⚠️
          </span>
        )}
      </button>

      {isOpen && (
        <NotificationDropdown onClose={() => setIsOpen(false)} />
      )}
    </div>
  );
};

interface NotificationDropdownProps {
  onClose: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onClose }) => {
  const { 
    notifications, 
    unreadCount, 
    loading, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification,
    refreshNotifications 
  } = useNotifications();

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleNotificationClick = async (notification: any) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
    
    onClose();
  };

  const handleDeleteNotification = async (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    await deleteNotification(notificationId);
  };

  const handleRefresh = async () => {
    await refreshNotifications();
  };

  return (
    <div className="notification-dropdown">
      <div className="notification-dropdown-header">
        <h3>Notifikationer</h3>
        <div className="notification-dropdown-actions">
          <button
            onClick={handleRefresh}
            className="notification-refresh-btn"
            title="Uppdatera"
            disabled={loading}
          >
            🔄
          </button>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="notification-mark-all-btn"
              title="Markera alla som lästa"
            >
              Markera alla som lästa
            </button>
          )}
        </div>
      </div>

      <div className="notification-dropdown-content">
        {loading ? (
          <div className="notification-loading">
            <div className="loading-spinner"></div>
            <p>Laddar notifikationer...</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="notification-empty">
            <div className="notification-empty-icon">🔔</div>
            <p>Inga notifikationer</p>
          </div>
        ) : (
          <div className="notification-list">
            {notifications.slice(0, 10).map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="notification-item-content">
                  <div className="notification-item-header">
                    <span className="notification-item-icon">
                      {notificationsApi.getNotificationIcon(notification.type)}
                    </span>
                    <span className="notification-item-title">
                      {notification.title}
                    </span>
                    <button
                      onClick={(e) => handleDeleteNotification(e, notification.id)}
                      className="notification-delete-btn"
                      title="Ta bort notifikation"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="notification-item-message">
                    {notification.message}
                  </p>
                  <div className="notification-item-footer">
                    <span className="notification-item-time">
                      {notificationsApi.formatNotificationTime(notification.createdAt)}
                    </span>
                    {notification.priority === 'high' && (
                      <span className="notification-item-priority high">
                        Hög prioritet
                      </span>
                    )}
                    {notification.priority === 'urgent' && (
                      <span className="notification-item-priority urgent">
                        Akut
                      </span>
                    )}
                  </div>
                </div>
                {!notification.isRead && (
                  <div className="notification-item-indicator"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {notifications.length > 10 && (
        <div className="notification-dropdown-footer">
          <button
            onClick={() => {
              window.location.href = '/notifications';
              onClose();
            }}
            className="notification-view-all-btn"
          >
            Visa alla notifikationer
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
