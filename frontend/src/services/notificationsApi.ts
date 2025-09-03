import { apiService } from './api';

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: string;
  actionUrl?: string;
  actionText?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  isRead: boolean;
  createdAt: string;
  readAt?: string;
  expiresAt?: string;
  metadata?: Record<string, any>;
}

export interface CreateNotificationRequest {
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: string;
  actionUrl?: string;
  actionText?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  expiresAt?: string;
  metadata?: Record<string, any>;
}

export interface UpdateNotificationRequest {
  isRead?: boolean;
  readAt?: string;
}

export interface NotificationListResponse {
  items: Notification[];
  totalCount: number;
  unreadCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface NotificationStats {
  totalNotifications: number;
  unreadNotifications: number;
  highPriorityNotifications: number;
  urgentNotifications: number;
  lastNotificationAt?: string;
}

export interface NotificationEvent {
  id: string;
  type: string;
  title: string;
  message: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  actionUrl?: string;
  actionText?: string;
  createdAt: string;
  data?: Record<string, any>;
}

export interface BulkNotificationRequest {
  userIds: string[];
  type: string;
  title: string;
  message: string;
  data?: string;
  actionUrl?: string;
  actionText?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  expiresAt?: string;
  metadata?: Record<string, any>;
}

export const notificationsApi = {
  // Get notifications
  getNotifications: async (
    page: number = 1,
    pageSize: number = 20,
    unreadOnly: boolean = false
  ): Promise<NotificationListResponse> => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());
    if (unreadOnly) params.append('unreadOnly', 'true');

    const response = await apiService.get<NotificationListResponse>(`/notification?${params.toString()}`);
    return response.data;
  },

  // Get single notification
  getNotification: async (id: string): Promise<Notification> => {
    const response = await apiService.get<Notification>(`/notification/${id}`);
    return response.data;
  },

  // Get notification stats
  getNotificationStats: async (): Promise<NotificationStats> => {
    const response = await apiService.get<NotificationStats>('/notification/stats');
    return response.data;
  },

  // Get unread count
  getUnreadCount: async (): Promise<{ count: number }> => {
    const response = await apiService.get<{ count: number }>('/notification/unread-count');
    return response.data;
  },

  // Create notification
  createNotification: async (notification: CreateNotificationRequest): Promise<Notification> => {
    const response = await apiService.post<Notification>('/notification', notification);
    return response.data;
  },

  // Create bulk notifications
  createBulkNotifications: async (bulkRequest: BulkNotificationRequest): Promise<Notification[]> => {
    const response = await apiService.post<Notification[]>('/notification/bulk', bulkRequest);
    return response.data;
  },

  // Update notification
  updateNotification: async (id: string, update: UpdateNotificationRequest): Promise<Notification> => {
    const response = await apiService.put<Notification>(`/notification/${id}`, update);
    return response.data;
  },

  // Mark notification as read
  markAsRead: async (id: string): Promise<{ success: boolean }> => {
    const response = await apiService.put<{ success: boolean }>(`/notification/${id}/read`);
    return response.data;
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<{ count: number }> => {
    const response = await apiService.put<{ count: number }>('/notification/mark-all-read');
    return response.data;
  },

  // Delete notification
  deleteNotification: async (id: string): Promise<void> => {
    await apiService.delete(`/notification/${id}`);
  },

  // Delete all notifications
  deleteAllNotifications: async (): Promise<{ success: boolean }> => {
    const response = await apiService.delete<{ success: boolean }>('/notification/all');
    return response.data;
  },

  // Specific notification types
  sendJobApplicationNotification: async (request: {
    customerId: string;
    youthId: string;
    jobId: string;
    jobTitle: string;
  }): Promise<{ success: boolean }> => {
    const response = await apiService.post<{ success: boolean }>('/notification/job-application', request);
    return response.data;
  },

  sendJobAcceptedNotification: async (request: {
    youthId: string;
    customerId: string;
    jobId: string;
    jobTitle: string;
  }): Promise<{ success: boolean }> => {
    const response = await apiService.post<{ success: boolean }>('/notification/job-accepted', request);
    return response.data;
  },

  sendPaymentReceivedNotification: async (request: {
    userId: string;
    jobId: string;
    amount: number;
  }): Promise<{ success: boolean }> => {
    const response = await apiService.post<{ success: boolean }>('/notification/payment-received', request);
    return response.data;
  },

  sendMessageReceivedNotification: async (request: {
    receiverId: string;
    senderId: string;
    messagePreview: string;
  }): Promise<{ success: boolean }> => {
    const response = await apiService.post<{ success: boolean }>('/notification/message-received', request);
    return response.data;
  },

  // Helper functions
  formatNotificationTime: (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Nu';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} min sedan`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} tim sedan`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} dag${days > 1 ? 'ar' : ''} sedan`;
    } else {
      return date.toLocaleDateString('sv-SE');
    }
  },

  getNotificationIcon: (type: string): string => {
    const icons: Record<string, string> = {
      job_application: '📝',
      job_accepted: '✅',
      job_completed: '🎉',
      job_cancelled: '❌',
      payment_received: '💰',
      payment_sent: '💸',
      review_received: '⭐',
      message_received: '💬',
      booking_reminder: '⏰',
      system_maintenance: '🔧',
      system_announcement: '📢',
      default: '🔔'
    };
    return icons[type] || icons.default;
  },

  getPriorityColor: (priority: string): string => {
    const colors: Record<string, string> = {
      low: '#6b7280',
      normal: '#3b82f6',
      high: '#f59e0b',
      urgent: '#ef4444'
    };
    return colors[priority] || colors.normal;
  }
};
