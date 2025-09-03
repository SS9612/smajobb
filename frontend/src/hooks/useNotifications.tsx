import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { useAuth } from './useAuth';
import { notificationsApi, Notification, NotificationEvent, NotificationStats } from '../services/notificationsApi';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  stats: NotificationStats | null;
  loading: boolean;
  error: string | null;
  connection: HubConnection | null;
  isConnected: boolean;
  
  // Actions
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  deleteAllNotifications: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
  refreshStats: () => Promise<void>;
  
  // Real-time events
  onNotificationReceived: (callback: (notification: NotificationEvent) => void) => void;
  offNotificationReceived: (callback: (notification: NotificationEvent) => void) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: React.ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notificationCallbacks, setNotificationCallbacks] = useState<Set<(notification: NotificationEvent) => void>>(new Set());

  // Initialize SignalR connection
  useEffect(() => {
    if (!isAuthenticated || !user) {
      if (connection) {
        connection.stop();
        setConnection(null);
        setIsConnected(false);
      }
      return;
    }

    const createConnection = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const newConnection = new HubConnectionBuilder()
          .withUrl('/hubs/notification', {
            accessTokenFactory: () => token
          })
          .configureLogging(LogLevel.Information)
          .withAutomaticReconnect()
          .build();

        // Set up event handlers
        newConnection.on('ReceiveNotification', (notification: NotificationEvent) => {
          console.log('Received notification:', notification);
          
          // Add to notifications list
          const newNotification: Notification = {
            id: notification.id,
            userId: user.id,
            type: notification.type,
            title: notification.title,
            message: notification.message,
            data: notification.data ? JSON.stringify(notification.data) : undefined,
            actionUrl: notification.actionUrl,
            actionText: notification.actionText,
            priority: notification.priority,
            isRead: false,
            createdAt: notification.createdAt,
            metadata: notification.data
          };

          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          // Call registered callbacks
          notificationCallbacks.forEach(callback => callback(notification));
        });

        newConnection.on('UnreadCountUpdated', (count: number) => {
          setUnreadCount(count);
        });

        newConnection.on('NotificationMarkedAsRead', (notificationId: string) => {
          setNotifications(prev => 
            prev.map(n => 
              n.id === notificationId 
                ? { ...n, isRead: true, readAt: new Date().toISOString() }
                : n
            )
          );
          setUnreadCount(prev => Math.max(0, prev - 1));
        });

        newConnection.onclose(() => {
          setIsConnected(false);
          console.log('Notification hub connection closed');
        });

        newConnection.onreconnecting(() => {
          setIsConnected(false);
          console.log('Notification hub reconnecting...');
        });

        newConnection.onreconnected(() => {
          setIsConnected(true);
          console.log('Notification hub reconnected');
        });

        // Start connection
        await newConnection.start();
        setConnection(newConnection);
        setIsConnected(true);
        console.log('Notification hub connected');

      } catch (err) {
        console.error('Error connecting to notification hub:', err);
        setError('Kunde inte ansluta till notifikationer');
      }
    };

    createConnection();

    return () => {
      if (connection) {
        connection.stop();
      }
    };
  }, [isAuthenticated, user, notificationCallbacks]);

  // Load initial data
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshNotifications();
      refreshStats();
    }
  }, [isAuthenticated, user]);

  const refreshNotifications = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      setError(null);
      const response = await notificationsApi.getNotifications(1, 50);
      setNotifications(response.items);
      setUnreadCount(response.unreadCount);
    } catch (err: any) {
      setError('Kunde inte ladda notifikationer');
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const refreshStats = useCallback(async () => {
    if (!isAuthenticated) return;

    try {
      const statsData = await notificationsApi.getNotificationStats();
      setStats(statsData);
    } catch (err: any) {
      console.error('Error loading notification stats:', err);
    }
  }, [isAuthenticated]);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications(prev => 
        prev.map(n => 
          n.id === id 
            ? { ...n, isRead: true, readAt: new Date().toISOString() }
            : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // Notify hub
      if (connection && isConnected) {
        await connection.invoke('MarkNotificationAsRead', id);
      }
    } catch (err: any) {
      console.error('Error marking notification as read:', err);
    }
  }, [connection, isConnected]);

  const markAllAsRead = useCallback(async () => {
    try {
      const result = await notificationsApi.markAllAsRead();
      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true, readAt: new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch (err: any) {
      console.error('Error marking all notifications as read:', err);
    }
  }, []);

  const deleteNotification = useCallback(async (id: string) => {
    try {
      await notificationsApi.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      setUnreadCount(prev => {
        const notification = notifications.find(n => n.id === id);
        return notification && !notification.isRead ? Math.max(0, prev - 1) : prev;
      });
    } catch (err: any) {
      console.error('Error deleting notification:', err);
    }
  }, [notifications]);

  const deleteAllNotifications = useCallback(async () => {
    try {
      await notificationsApi.deleteAllNotifications();
      setNotifications([]);
      setUnreadCount(0);
    } catch (err: any) {
      console.error('Error deleting all notifications:', err);
    }
  }, []);

  const onNotificationReceived = useCallback((callback: (notification: NotificationEvent) => void) => {
    setNotificationCallbacks(prev => new Set([...prev, callback]));
  }, []);

  const offNotificationReceived = useCallback((callback: (notification: NotificationEvent) => void) => {
    setNotificationCallbacks(prev => {
      const newSet = new Set(prev);
      newSet.delete(callback);
      return newSet;
    });
  }, []);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    stats,
    loading,
    error,
    connection,
    isConnected,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    refreshNotifications,
    refreshStats,
    onNotificationReceived,
    offNotificationReceived
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
