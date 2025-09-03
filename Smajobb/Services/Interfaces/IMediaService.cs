using Smajobb.DTOs;

namespace Smajobb.Services.Interfaces;

public interface IMediaService
{
    // File upload
    Task<MediaUploadResultDto> UploadFileAsync(Stream fileStream, CreateMediaDto mediaDto, string userId);
    Task<IEnumerable<MediaUploadResultDto>> UploadMultipleFilesAsync(IEnumerable<(Stream stream, CreateMediaDto dto)> files, string userId);
    
    // File management
    Task<MediaDto?> GetMediaByIdAsync(string id);
    Task<IEnumerable<MediaDto>> GetMediaByEntityAsync(string entityType, string entityId);
    Task<MediaListDto> GetMediaListAsync(string? entityType = null, string? entityId = null, int page = 1, int pageSize = 20);
    Task<MediaDto> UpdateMediaAsync(string id, UpdateMediaDto updateDto, string userId);
    Task<bool> DeleteMediaAsync(string id, string userId);
    Task<bool> DeleteMediaByEntityAsync(string entityType, string entityId, string userId);
    
    // File processing
    Task<bool> ProcessMediaAsync(string id);
    Task<string?> GenerateThumbnailAsync(string id);
    Task<bool> OptimizeImageAsync(string id);
    
    // File serving
    Task<Stream?> GetFileStreamAsync(string id);
    Task<Stream?> GetThumbnailStreamAsync(string id);
    Task<string?> GetFileUrlAsync(string id, bool useThumbnail = false);
    
    // Validation
    Task<bool> ValidateFileAsync(Stream fileStream, string contentType, long fileSize);
    Task<bool> IsFileTypeAllowedAsync(string contentType);
    Task<long> GetMaxFileSizeAsync(string contentType);
    
    // Cleanup
    Task CleanupOrphanedFilesAsync();
    Task CleanupExpiredFilesAsync();
}
