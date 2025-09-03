import { apiService } from './api';

// Types for jobs
export interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  price: number;
  priceType: 'fixed' | 'hourly';
  postedBy: string;
  postedByUserId: string;
  postedDate: string;
  applications: number;
  urgent: boolean;
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  requirements?: string[];
  estimatedDuration?: string;
  images?: string[];
}

export interface CreateJobRequest {
  title: string;
  description: string;
  category: string;
  location: string;
  price: number;
  priceType: 'fixed' | 'hourly';
  urgent?: boolean;
  requirements?: string[];
  estimatedDuration?: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  applicantId: string;
  applicantName: string;
  message: string;
  proposedPrice?: number;
  status: 'pending' | 'accepted' | 'rejected';
  appliedDate: string;
}

export interface JobFilter {
  category?: string;
  location?: string;
  priceMin?: number;
  priceMax?: number;
  priceType?: 'fixed' | 'hourly';
  urgent?: boolean;
  search?: string;
}

export interface JobSearchResponse {
  jobs: Job[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Jobs API service
export const jobsApi = {
  // Get all jobs with optional filtering
  getJobs: async (filters: JobFilter = {}, page = 1, pageSize = 10): Promise<JobSearchResponse> => {
    const params = new URLSearchParams();
    
    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());
    
    const response = await apiService.get<JobSearchResponse>(`/jobs?${params.toString()}`);
    return response.data;
  },

  // Get job by ID
  getJobById: async (jobId: string): Promise<Job> => {
    const response = await apiService.get<Job>(`/jobs/${jobId}`);
    return response.data;
  },

  // Create new job
  createJob: async (jobData: CreateJobRequest): Promise<Job> => {
    const response = await apiService.post<Job>('/jobs', jobData);
    return response.data;
  },

  // Update job
  updateJob: async (jobId: string, jobData: Partial<CreateJobRequest>): Promise<Job> => {
    const response = await apiService.put<Job>(`/jobs/${jobId}`, jobData);
    return response.data;
  },

  // Delete job
  deleteJob: async (jobId: string): Promise<{ message: string }> => {
    const response = await apiService.delete<{ message: string }>(`/jobs/${jobId}`);
    return response.data;
  },

  // Apply to job
  applyToJob: async (jobId: string, application: { message: string; proposedPrice?: number }): Promise<JobApplication> => {
    const response = await apiService.post<JobApplication>(`/jobs/${jobId}/apply`, application);
    return response.data;
  },

  // Get job applications (for job poster)
  getJobApplications: async (jobId: string): Promise<JobApplication[]> => {
    const response = await apiService.get<JobApplication[]>(`/jobs/${jobId}/applications`);
    return response.data;
  },

  // Accept/reject application
  updateApplicationStatus: async (
    jobId: string, 
    applicationId: string, 
    status: 'accepted' | 'rejected'
  ): Promise<JobApplication> => {
    const response = await apiService.patch<JobApplication>(
      `/jobs/${jobId}/applications/${applicationId}`,
      { status }
    );
    return response.data;
  },

  // Get user's posted jobs
  getUserJobs: async (): Promise<Job[]> => {
    const response = await apiService.get<Job[]>('/jobs/my-jobs');
    return response.data;
  },

  // Get user's job applications
  getUserApplications: async (): Promise<JobApplication[]> => {
    const response = await apiService.get<JobApplication[]>('/jobs/my-applications');
    return response.data;
  },

  // Save job to favorites
  saveJob: async (jobId: string): Promise<{ message: string }> => {
    const response = await apiService.post<{ message: string }>(`/jobs/${jobId}/save`);
    return response.data;
  },

  // Remove job from favorites
  unsaveJob: async (jobId: string): Promise<{ message: string }> => {
    const response = await apiService.delete<{ message: string }>(`/jobs/${jobId}/save`);
    return response.data;
  },

  // Get saved jobs
  getSavedJobs: async (): Promise<Job[]> => {
    const response = await apiService.get<Job[]>('/jobs/saved');
    return response.data;
  },

  // Get job categories
  getCategories: async (): Promise<{ id: string; name: string; icon: string }[]> => {
    const response = await apiService.get<{ id: string; name: string; icon: string }[]>('/jobs/categories');
    return response.data;
  },
};
