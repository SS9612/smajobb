import { apiService } from './api';

// Types for user management
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location?: string;
  bio?: string;
  birthDate?: string;
  userType: 'customer' | 'youth';
  displayName: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  avatar?: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  location?: string;
  bio?: string;
  birthDate?: string;
}

export interface UserPreferences {
  notifications: boolean;
  emailUpdates: boolean;
  smsUpdates: boolean;
  language: 'sv' | 'en';
  timezone: string;
}

export interface UserStats {
  totalJobs: number;
  completedJobs: number;
  activeJobs: number;
  totalEarnings: number;
  rating: number;
  reviewCount: number;
}

export interface UserNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

// User API service
export const userApi = {
  // Get current user profile via auth controller
  getCurrentProfile: async (): Promise<UserProfile> => {
    const response = await apiService.get<UserProfile>('/auth/me');
    return response.data;
  },

  // Get user by ID
  getUserById: async (userId: string): Promise<UserProfile> => {
    const response = await apiService.get<UserProfile>(`/user/${userId}`);
    return response.data;
  },

  // Update basic user fields supported by backend (email, phone, displayName, role)
  updateUser: async (
    userId: string,
    update: Partial<Pick<UserProfile, 'email' | 'phone' | 'displayName'>> & { role?: string }
  ): Promise<UserProfile> => {
    const response = await apiService.put<UserProfile>(`/user/${userId}`, {
      Email: update.email ?? '',
      Phone: update.phone ?? '',
      DisplayName: update.displayName ?? '',
      Role: update.role ?? 'customer',
    });
    return response.data;
  },

  // Youth profile endpoints
  getYouthProfile: async (userId: string): Promise<{
    userId: string;
    dateOfBirth?: string;
    city?: string;
    bio?: string;
    hourlyRate?: number;
    allowedCategories: string[];
  }> => {
    const response = await apiService.get(
      `/user/${userId}/youth-profile`
    );
    return response.data as any;
  },

  updateYouthProfile: async (
    userId: string,
    profile: {
      dateOfBirth?: string; // ISO string (yyyy-MM-dd)
      city?: string;
      bio?: string;
      hourlyRate?: number;
      allowedCategories?: string[];
    }
  ): Promise<any> => {
    const response = await apiService.put(`/user/${userId}/youth-profile`, {
      DateOfBirth: profile.dateOfBirth ? profile.dateOfBirth.split('T')[0] : undefined,
      City: profile.city,
      Bio: profile.bio,
      HourlyRate: profile.hourlyRate,
      AllowedCategories: profile.allowedCategories ?? [],
    });
    return response.data;
  },
};
