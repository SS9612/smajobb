import { apiService } from './api';

// Types for authentication
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  birthDate?: string;
  userType: 'customer' | 'youth';
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    userType: 'customer' | 'youth';
    displayName: string;
  };
}

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
}

// Authentication API service
export const authApi = {
  // Login user
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiService.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  // Register new user
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiService.post<AuthResponse>('/auth/register', userData);
    return response.data;
  },

  // Get current user profile
  getProfile: async (): Promise<UserProfile> => {
    const response = await apiService.get<UserProfile>('/auth/me');
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData: Partial<UserProfile>): Promise<UserProfile> => {
    // This project updates the user via UserController, not AuthController
    // Callers should prefer userApi.updateUser with the current user's ID
    const response = await apiService.put<UserProfile>('/auth/profile', profileData);
    return response.data;
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string): Promise<{ message: string }> => {
    const response = await apiService.post<{ message: string }>('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  // Refresh token
  refreshToken: async (): Promise<{ token: string }> => {
    const response = await apiService.post<{ token: string }>('/auth/refresh-token');
    return response.data;
  },

  // Logout (client-side only, backend can invalidate if needed)
  logout: async (): Promise<void> => {
    // Clear local storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    // Optionally call backend logout endpoint
    try {
      await apiService.post('/auth/logout');
    } catch (error) {
      // Ignore errors on logout
      console.log('Logout completed');
    }
  },
};
