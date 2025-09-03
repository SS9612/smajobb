import { apiService } from './api';

export interface ConversationSummary {
  otherUserId: string;
  otherUserDisplayName: string;
  otherUserAvatarUrl?: string | null;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: string;
  createdAt: string;
  isRead: boolean;
  readAt?: string | null;
}

export interface SendMessageRequest {
  receiverId: string;
  content: string;
  type?: string;
  bookingId?: string;
}

export const messagesApi = {
  getConversations: async (page = 1, pageSize = 20): Promise<ConversationSummary[]> => {
    const res = await apiService.get<ConversationSummary[]>(`/message/conversations?page=${page}&pageSize=${pageSize}`);
    return res.data;
  },

  getMessagesWithUser: async (otherUserId: string, page = 1, pageSize = 50): Promise<ChatMessage[]> => {
    const res = await apiService.get<ChatMessage[]>(`/message/with/${otherUserId}?page=${page}&pageSize=${pageSize}`);
    return res.data;
  },

  sendMessage: async (payload: SendMessageRequest): Promise<ChatMessage> => {
    const res = await apiService.post<ChatMessage>('/message', payload);
    return res.data;
  },

  markAsRead: async (messageId: string): Promise<{ success: boolean }> => {
    const res = await apiService.post<{ success: boolean }>(`/message/read/${messageId}`);
    return res.data;
  },

  markConversationAsRead: async (otherUserId: string): Promise<{ success: boolean; updated: number }> => {
    const res = await apiService.post<{ success: boolean; updated: number }>(`/message/read-conversation/${otherUserId}`);
    return res.data;
  },
};


