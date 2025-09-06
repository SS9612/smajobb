import { apiService } from './api';

export interface Review {
  id: string;
  bookingId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt?: string;
  isPublic: boolean;
  isVerified: boolean;
  reviewerName?: string;
  revieweeName?: string;
  jobTitle?: string;
}

export interface CreateReviewRequest {
  bookingId: string;
  revieweeId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewRequest {
  rating: number;
  comment?: string;
}

export interface ReviewSummary {
  userId: string;
  averageRating: number;
  totalReviews: number;
  ratingCounts: number; // 5-star reviews
  ratingCount4: number; // 4-star reviews
  ratingCount3: number; // 3-star reviews
  ratingCount2: number; // 2-star reviews
  ratingCount1: number; // 1-star reviews
}

export interface ReviewSearchRequest {
  userId?: string;
  bookingId?: string;
  minRating?: number;
  maxRating?: number;
  isVerified?: boolean;
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
}

export const reviewsApi = {
  getReview: async (id: string): Promise<Review> => {
    const response = await apiService.get<Review>(`/review/${id}`);
    return response.data;
  },

  getReviewsByUser: async (userId: string, page: number = 1, pageSize: number = 20): Promise<Review[]> => {
    const response = await apiService.get<Review[]>(`/review/user/${userId}?page=${page}&pageSize=${pageSize}`);
    return response.data;
  },

  getReviewsByBooking: async (bookingId: string): Promise<Review[]> => {
    const response = await apiService.get<Review[]>(`/review/booking/${bookingId}`);
    return response.data;
  },

  getReviewSummary: async (userId: string): Promise<ReviewSummary> => {
    const response = await apiService.get<ReviewSummary>(`/review/summary/${userId}`);
    return response.data;
  },

  createReview: async (review: CreateReviewRequest): Promise<Review> => {
    const response = await apiService.post<Review>('/review', review);
    return response.data;
  },

  updateReview: async (id: string, review: UpdateReviewRequest): Promise<Review> => {
    const response = await apiService.put<Review>(`/review/${id}`, review);
    return response.data;
  },

  deleteReview: async (id: string): Promise<void> => {
    await apiService.delete(`/review/${id}`);
  },

  canUserReview: async (bookingId: string): Promise<{ canReview: boolean; hasReviewed: boolean }> => {
    const response = await apiService.get<{ canReview: boolean; hasReviewed: boolean }>(`/review/can-review/${bookingId}`);
    return response.data;
  },

  searchReviews: async (searchRequest: ReviewSearchRequest): Promise<Review[]> => {
    const response = await apiService.post<Review[]>('/review/search', searchRequest);
    return response.data;
  },

  getJobReviews: async (jobId: string): Promise<Review[]> => {
    const response = await apiService.get<Review[]>(`/review/job/${jobId}`);
    return response.data;
  }
};
