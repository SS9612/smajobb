import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import type { UserProfile } from './userApi';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:7000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Create a separate axios instance for public endpoints (no auth required)
const publicApi: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Common API functions
export const apiService = {
  get: <T>(url: string, config = {}) => api.get<T>(url, config),
  post: <T>(url: string, data = {}, config = {}) => api.post<T>(url, data, config),
  put: <T>(url: string, data = {}, config = {}) => api.put<T>(url, data, config),
  delete: <T>(url: string, config = {}) => api.delete<T>(url, config),
  patch: <T>(url: string, data = {}, config = {}) => api.patch<T>(url, data, config),
};

// Public API functions (no authentication required)
export const publicApiService = {
  get: <T>(url: string, config = {}) => publicApi.get<T>(url, config),
  post: <T>(url: string, data = {}, config = {}) => publicApi.post<T>(url, data, config),
};

// Re-export types and services from other API modules
export type { Job, CreateJobRequest, JobApplication, JobFilter, JobSearchResponse } from './jobsApi';
export type { UserProfile, UpdateProfileRequest, UserPreferences, UserStats, UserNotification } from './userApi';
export { jobsApi, jobsApi as jobApi } from './jobsApi';
export { userApi } from './userApi';

// Legacy type export
export type User = UserProfile;

export default api;
