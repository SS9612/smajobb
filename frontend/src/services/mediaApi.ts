import { apiService } from './api';

export interface Media {
  id: string;
  fileName: string;
  originalFileName: string;
  contentType: string;
  fileSize: number;
  filePath: string;
  url: string;
  thumbnailUrl?: string;
  altText?: string;
  description?: string;
  entityType: string;
  entityId: string;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  isProcessed: boolean;
  metadata?: Record<string, any>;
}

export interface CreateMediaRequest {
  fileName: string;
  contentType: string;
  fileSize: number;
  entityType: string;
  entityId: string;
  altText?: string;
  description?: string;
  isPublic?: boolean;
  metadata?: Record<string, any>;
}

export interface UpdateMediaRequest {
  altText?: string;
  description?: string;
  isPublic?: boolean;
  metadata?: Record<string, any>;
}

export interface MediaUploadResult {
  id: string;
  fileName: string;
  url: string;
  thumbnailUrl?: string;
  success: boolean;
  errorMessage?: string;
}

export interface MediaListResponse {
  items: Media[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface AllowedFileTypes {
  [contentType: string]: number; // content type -> max size in bytes
}

export const mediaApi = {
  // Upload single file
  uploadFile: async (
    file: File,
    entityType: string,
    entityId: string,
    altText?: string,
    description?: string,
    isPublic: boolean = true
  ): Promise<MediaUploadResult> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('entityType', entityType);
    formData.append('entityId', entityId);
    if (altText) formData.append('altText', altText);
    if (description) formData.append('description', description);
    formData.append('isPublic', isPublic.toString());

    const response = await apiService.post<MediaUploadResult>('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Upload multiple files
  uploadMultipleFiles: async (
    files: File[],
    entityType: string,
    entityId: string,
    isPublic: boolean = true
  ): Promise<MediaUploadResult[]> => {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    formData.append('entityType', entityType);
    formData.append('entityId', entityId);
    formData.append('isPublic', isPublic.toString());

    const response = await apiService.post<MediaUploadResult[]>('/media/upload-multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Get media by ID
  getMedia: async (id: string): Promise<Media> => {
    const response = await apiService.get<Media>(`/media/${id}`);
    return response.data;
  },

  // Get media by entity
  getMediaByEntity: async (entityType: string, entityId: string): Promise<Media[]> => {
    const response = await apiService.get<Media[]>(`/media/entity/${entityType}/${entityId}`);
    return response.data;
  },

  // Get media list with pagination
  getMediaList: async (
    entityType?: string,
    entityId?: string,
    page: number = 1,
    pageSize: number = 20
  ): Promise<MediaListResponse> => {
    const params = new URLSearchParams();
    if (entityType) params.append('entityType', entityType);
    if (entityId) params.append('entityId', entityId);
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());

    const response = await apiService.get<MediaListResponse>(`/media/list?${params.toString()}`);
    return response.data;
  },

  // Update media
  updateMedia: async (id: string, updateData: UpdateMediaRequest): Promise<Media> => {
    const response = await apiService.put<Media>(`/media/${id}`, updateData);
    return response.data;
  },

  // Delete media
  deleteMedia: async (id: string): Promise<void> => {
    await apiService.delete(`/media/${id}`);
  },

  // Delete media by entity
  deleteMediaByEntity: async (entityType: string, entityId: string): Promise<void> => {
    await apiService.delete(`/media/entity/${entityType}/${entityId}`);
  },

  // Get file URL
  getFileUrl: (id: string, useThumbnail: boolean = false): string => {
    const endpoint = useThumbnail ? 'thumbnail' : 'file';
    return `/api/media/${id}/${endpoint}`;
  },

  // Process media
  processMedia: async (id: string): Promise<void> => {
    await apiService.post(`/media/${id}/process`);
  },

  // Get allowed file types
  getAllowedFileTypes: async (): Promise<AllowedFileTypes> => {
    const response = await apiService.get<AllowedFileTypes>('/media/allowed-types');
    return response.data;
  },

  // Helper function to format file size
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Helper function to get file type icon
  getFileTypeIcon: (contentType: string): string => {
    if (contentType.startsWith('image/')) return '🖼️';
    if (contentType.startsWith('video/')) return '🎥';
    if (contentType.startsWith('audio/')) return '🎵';
    if (contentType === 'application/pdf') return '📄';
    if (contentType.includes('word')) return '📝';
    if (contentType.includes('excel') || contentType.includes('spreadsheet')) return '📊';
    if (contentType.includes('powerpoint') || contentType.includes('presentation')) return '📈';
    if (contentType.includes('zip') || contentType.includes('rar')) return '📦';
    return '📎';
  },

  // Helper function to check if file is image
  isImageFile: (contentType: string): boolean => {
    return contentType.startsWith('image/');
  },

  // Helper function to check if file is video
  isVideoFile: (contentType: string): boolean => {
    return contentType.startsWith('video/');
  },

  // Helper function to check if file is audio
  isAudioFile: (contentType: string): boolean => {
    return contentType.startsWith('audio/');
  }
};
