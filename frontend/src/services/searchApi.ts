import { apiService, publicApiService } from './api';

export interface JobSearchRequest {
  query?: string;
  category?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  priceType?: string;
  minPrice?: number;
  maxPrice?: number;
  urgency?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  minAge?: number;
  maxAge?: number;
  requiresBackgroundCheck?: boolean;
  skills?: string[];
  tags?: string[];
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  pageSize?: number;
}

export interface UserSearchRequest {
  query?: string;
  role?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
  skills?: string[];
  minAge?: number;
  maxAge?: number;
  isVerified?: boolean;
  minRating?: number;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  pageSize?: number;
}

export interface SearchSuggestion {
  text: string;
  type: string;
  count: number;
}

export interface SearchFilters {
  categories: string[];
  priceTypes: string[];
  urgencies: string[];
  statuses: string[];
  skills: string[];
  tags: string[];
  priceRange: {
    min: number;
    max: number;
  };
  dateRange: {
    start?: string;
    end?: string;
  };
  ageRange: {
    min: number;
    max: number;
  };
}

export interface SearchResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  availableFilters?: SearchFilters;
  suggestions?: string[];
}

export interface Job {
  id: string;
  title: string;
  description?: string;
  category: string;
  address?: string;
  creatorId: string;
  creatorName?: string;
  priceType: string;
  price: number;
  createdAt: string;
  updatedAt?: string;
  startsAt?: string;
  endsAt?: string;
  status: string;
  urgency: string;
  estimatedHours?: number;
  requiresBackgroundCheck: boolean;
  minAge?: number;
  maxAge?: number;
  requiredSkills?: string;
  specialInstructions?: string;
  viewCount: number;
  applicationCount: number;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt?: string;
}

export const searchApi = {
  searchJobs: async (searchRequest: JobSearchRequest): Promise<SearchResult<Job>> => {
    const response = await publicApiService.post<SearchResult<Job>>('/search/jobs', searchRequest);
    return response.data;
  },

  getJobSearchFilters: async (searchRequest: JobSearchRequest): Promise<SearchFilters> => {
    const params = new URLSearchParams();
    Object.entries(searchRequest).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => params.append(key, v.toString()));
        } else {
          params.append(key, value.toString());
        }
      }
    });
    
    const response = await publicApiService.get<SearchFilters>(`/search/jobs/filters?${params.toString()}`);
    return response.data;
  },

  getJobSearchSuggestions: async (query: string, limit: number = 10): Promise<SearchSuggestion[]> => {
    const response = await publicApiService.get<SearchSuggestion[]>(`/search/jobs/suggestions?query=${encodeURIComponent(query)}&limit=${limit}`);
    return response.data;
  },

  searchUsers: async (searchRequest: UserSearchRequest): Promise<SearchResult<User>> => {
    const response = await apiService.post<SearchResult<User>>('/search/users', searchRequest);
    return response.data;
  },

  getUserSearchSuggestions: async (query: string, limit: number = 10): Promise<SearchSuggestion[]> => {
    const response = await apiService.get<SearchSuggestion[]>(`/search/users/suggestions?query=${encodeURIComponent(query)}&limit=${limit}`);
    return response.data;
  },

  getPopularSearches: async (limit: number = 10): Promise<string[]> => {
    const response = await publicApiService.get<string[]>(`/search/popular/searches?limit=${limit}`);
    return response.data;
  },

  getPopularCategories: async (limit: number = 10): Promise<string[]> => {
    const response = await publicApiService.get<string[]>(`/search/popular/categories?limit=${limit}`);
    return response.data;
  },

  getPopularSkills: async (limit: number = 10): Promise<string[]> => {
    const response = await publicApiService.get<string[]>(`/search/popular/skills?limit=${limit}`);
    return response.data;
  },

  logSearch: async (query: string, filters?: string): Promise<void> => {
    await apiService.post('/search/log', { query, filters });
  }
};
