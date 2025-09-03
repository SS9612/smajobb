import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { notificationsApi, Notification } from '../services/notificationsApi';

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
  const [selectedNotifications, setSelectedNotifications] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    refreshNotifications();
  }, [refreshNotifications]);

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

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }
    
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  const handleSelectNotification = (notificationId: string) => {
    setSelectedNotifications(prev => {
      const newSet = new Set(prev);
      if (newSet.has(notificationId)) {
        newSet.delete(notificationId);
      } else {
        newSet.add(notificationId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedNotifications.size === filteredNotifications.length) {
      setSelectedNotifications(new Set());
    } else {
      setSelectedNotifications(new Set(filteredNotifications.map(n => n.id)));
    }
  };

  const handleDeleteSelected = async () => {
    const notificationIds = Array.from(selectedNotifications);
    for (const notificationId of notificationIds) {
      await deleteNotification(notificationId);
    }
    setSelectedNotifications(new Set());
    setShowDeleteConfirm(false);
  };

  const handleDeleteAll = async () => {
    await deleteAllNotifications();
    setShowDeleteConfirm(false);
  };

  const handleMarkSelectedAsRead = async () => {
    const notificationIds = Array.from(selectedNotifications);
    for (const notificationId of notificationIds) {
      await markAsRead(notificationId);
    }
    setSelectedNotifications(new Set());
  };

  if (!user) {
    return (
      <div className="container-wide">
        <div className="dashboard-content">
          <div className="error-container">
            <h2>Åtkomst nekad</h2>
            <p>Du måste vara inloggad för att se notifikationer.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-wide">
      <div className="dashboard-content">
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Notifikationer</h2>
            <p>Hantera dina notifikationer och meddelanden</p>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="notification-stats">
              <div className="stats-card">
                <div className="stats-card-icon">📊</div>
                <div className="stats-card-content">
                  <h3>{stats.totalNotifications}</h3>
                  <p>Totalt</p>
                </div>
              </div>
              <div className="stats-card">
                <div className="stats-card-icon">🔔</div>
                <div className="stats-card-content">
                  <h3>{stats.unreadNotifications}</h3>
                  <p>Olästa</p>
                </div>
              </div>
              <div className="stats-card">
                <div className="stats-card-icon">⚠️</div>
                <div className="stats-card-content">
                  <h3>{stats.highPriorityNotifications}</h3>
                  <p>Hög prioritet</p>
                </div>
              </div>
              <div className="stats-card">
                <div className="stats-card-icon">🚨</div>
                <div className="stats-card-content">
                  <h3>{stats.urgentNotifications}</h3>
                  <p>Akuta</p>
                </div>
              </div>
            </div>
          )}

          {/* Filters and Actions */}
          <div className="notification-controls">
            <div className="notification-filters">
              <button
                onClick={() => setFilter('all')}
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              >
                Alla ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
              >
                Olästa ({unreadCount})
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
              >
                Lästa ({notifications.length - unreadCount})
              </button>
            </div>

            <div className="notification-actions">
              {filteredNotifications.length > 0 && (
                <>
                  <button
                    onClick={handleSelectAll}
                    className="action-btn secondary"
                  >
                    {selectedNotifications.size === filteredNotifications.length ? 'Avmarkera alla' : 'Markera alla'}
                  </button>
                  
                  {selectedNotifications.size > 0 && (
                    <>
                      <button
                        onClick={handleMarkSelectedAsRead}
                        className="action-btn primary"
                      >
                        Markera som lästa ({selectedNotifications.size})
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="action-btn danger"
                      >
                        Ta bort ({selectedNotifications.size})
                      </button>
                    </>
                  )}
                </>
              )}

              {notifications.length > 0 && (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="action-btn danger"
                >
                  Ta bort alla
                </button>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          {/* Notifications List */}
          <div className="notification-list-container">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Laddar notifikationer...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="notification-empty">
                <div className="notification-empty-icon">
                  {filter === 'unread' ? '✅' : filter === 'read' ? '📖' : '🔔'}
                </div>
                <h3>
                  {filter === 'unread' ? 'Inga olästa notifikationer' : 
                   filter === 'read' ? 'Inga lästa notifikationer' : 
                   'Inga notifikationer'}
                </h3>
                <p>
                  {filter === 'unread' ? 'Alla dina notifikationer är lästa!' : 
                   filter === 'read' ? 'Du har inte läst några notifikationer än.' : 
                   'Du har inga notifikationer än.'}
                </p>
              </div>
            ) : (
              <div className="notification-list">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification-item ${!notification.isRead ? 'unread' : ''} ${selectedNotifications.has(notification.id) ? 'selected' : ''}`}
                  >
                    <div className="notification-item-checkbox">
                      <input
                        type="checkbox"
                        checked={selectedNotifications.has(notification.id)}
                        onChange={() => handleSelectNotification(notification.id)}
                      />
                    </div>
                    
                    <div 
                      className="notification-item-content"
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="notification-item-header">
                        <span className="notification-item-icon">
                          {notificationsApi.getNotificationIcon(notification.type)}
                        </span>
                        <span className="notification-item-title">
                          {notification.title}
                        </span>
                        <span className="notification-item-time">
                          {notificationsApi.formatNotificationTime(notification.createdAt)}
                        </span>
                      </div>
                      
                      <p className="notification-item-message">
                        {notification.message}
                      </p>
                      
                      <div className="notification-item-footer">
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
                        {notification.actionText && (
                          <span className="notification-item-action">
                            {notification.actionText} →
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="notification-item-actions">
                      {!notification.isRead && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notification.id);
                          }}
                          className="notification-mark-read-btn"
                          title="Markera som läst"
                        >
                          ✓
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notification.id);
                        }}
                        className="notification-delete-btn"
                        title="Ta bort notifikation"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Bekräfta borttagning</h3>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="modal-close-btn"
              >
                ✕
              </button>
            </div>
            <div className="modal-content">
              {selectedNotifications.size > 0 ? (
                <p>
                  Är du säker på att du vill ta bort {selectedNotifications.size} valda notifikationer?
                </p>
              ) : (
                <p>
                  Är du säker på att du vill ta bort alla notifikationer? Denna åtgärd kan inte ångras.
                </p>
              )}
            </div>
            <div className="modal-footer">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn btn-secondary"
              >
                Avbryt
              </button>
              <button
                onClick={selectedNotifications.size > 0 ? handleDeleteSelected : handleDeleteAll}
                className="btn btn-danger"
              >
                Ta bort
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
