using Microsoft.EntityFrameworkCore;
using Smajobb.Data;
using Smajobb.DTOs;
using Smajobb.Models;
using Smajobb.Services.Interfaces;
using System.Drawing;
using System.Drawing.Imaging;

namespace Smajobb.Services;

public class MediaService : IMediaService
{
    private readonly SmajobbDbContext _db;
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<MediaService> _logger;
    private readonly string _uploadsPath;
    private readonly string _thumbnailsPath;
    
    // Allowed file types and sizes
    private readonly Dictionary<string, long> _allowedFileTypes = new()
    {
        { "image/jpeg", 10 * 1024 * 1024 }, // 10MB
        { "image/png", 10 * 1024 * 1024 },  // 10MB
        { "image/gif", 5 * 1024 * 1024 },   // 5MB
        { "image/webp", 10 * 1024 * 1024 }, // 10MB
        { "application/pdf", 20 * 1024 * 1024 }, // 20MB
        { "text/plain", 1 * 1024 * 1024 },  // 1MB
        { "application/msword", 10 * 1024 * 1024 }, // 10MB
        { "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 10 * 1024 * 1024 }, // 10MB
    };

    public MediaService(SmajobbDbContext db, IWebHostEnvironment environment, ILogger<MediaService> logger)
    {
        _db = db;
        _environment = environment;
        _logger = logger;
        _uploadsPath = Path.Combine(_environment.WebRootPath, "uploads");
        _thumbnailsPath = Path.Combine(_environment.WebRootPath, "thumbnails");
        
        // Ensure directories exist
        Directory.CreateDirectory(_uploadsPath);
        Directory.CreateDirectory(_thumbnailsPath);
    }

    public async Task<MediaUploadResultDto> UploadFileAsync(Stream fileStream, CreateMediaDto mediaDto, string userId)
    {
        try
        {
            // Validate file
            if (!await ValidateFileAsync(fileStream, mediaDto.ContentType, mediaDto.FileSize))
            {
                return new MediaUploadResultDto
                {
                    Success = false,
                    ErrorMessage = "Invalid file type or size"
                };
            }

            // Generate unique filename
            var fileExtension = Path.GetExtension(mediaDto.FileName);
            var uniqueFileName = $"{Guid.NewGuid()}{fileExtension}";
            var filePath = Path.Combine(_uploadsPath, uniqueFileName);
            var relativePath = Path.Combine("uploads", uniqueFileName);

            // Save file
            using (var fileStreamToSave = new FileStream(filePath, FileMode.Create))
            {
                fileStream.Position = 0;
                await fileStream.CopyToAsync(fileStreamToSave);
            }

            // Create media record
            var media = new Media
            {
                FileName = uniqueFileName,
                OriginalFileName = mediaDto.FileName,
                ContentType = mediaDto.ContentType,
                FileSize = mediaDto.FileSize,
                FilePath = relativePath,
                Url = $"/uploads/{uniqueFileName}",
                EntityType = mediaDto.EntityType,
                EntityId = mediaDto.EntityId,
                UploadedBy = Guid.Parse(userId),
                AltText = mediaDto.AltText,
                Description = mediaDto.Description,
                IsPublic = mediaDto.IsPublic,
                Metadata = mediaDto.Metadata
            };

            _db.Media.Add(media);
            await _db.SaveChangesAsync();

            // Generate thumbnail for images
            string? thumbnailUrl = null;
            if (IsImageFile(mediaDto.ContentType))
            {
                thumbnailUrl = await GenerateThumbnailAsync(media.Id);
            }

            return new MediaUploadResultDto
            {
                Id = media.Id,
                FileName = media.OriginalFileName,
                Url = media.Url,
                ThumbnailUrl = thumbnailUrl,
                Success = true
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading file: {FileName}", mediaDto.FileName);
            return new MediaUploadResultDto
            {
                Success = false,
                ErrorMessage = "Upload failed"
            };
        }
    }

    public async Task<IEnumerable<MediaUploadResultDto>> UploadMultipleFilesAsync(IEnumerable<(Stream stream, CreateMediaDto dto)> files, string userId)
    {
        var results = new List<MediaUploadResultDto>();
        
        foreach (var (stream, dto) in files)
        {
            var result = await UploadFileAsync(stream, dto, userId);
            results.Add(result);
        }
        
        return results;
    }

    public async Task<MediaDto?> GetMediaByIdAsync(string id)
    {
        var media = await _db.Media
            .Include(m => m.Uploader)
            .FirstOrDefaultAsync(m => m.Id == id);
            
        return media != null ? MapToMediaDto(media) : null;
    }

    public async Task<IEnumerable<MediaDto>> GetMediaByEntityAsync(string entityType, string entityId)
    {
        var media = await _db.Media
            .Include(m => m.Uploader)
            .Where(m => m.EntityType == entityType && m.EntityId == entityId)
            .OrderBy(m => m.CreatedAt)
            .ToListAsync();
            
        return media.Select(MapToMediaDto);
    }

    public async Task<MediaListDto> GetMediaListAsync(string? entityType = null, string? entityId = null, int page = 1, int pageSize = 20)
    {
        var query = _db.Media.Include(m => m.Uploader).AsQueryable();
        
        if (!string.IsNullOrEmpty(entityType))
            query = query.Where(m => m.EntityType == entityType);
            
        if (!string.IsNullOrEmpty(entityId))
            query = query.Where(m => m.EntityId == entityId);
            
        var totalCount = await query.CountAsync();
        var media = await query
            .OrderByDescending(m => m.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();
            
        return new MediaListDto
        {
            Items = media.Select(MapToMediaDto),
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize,
            TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
        };
    }

    public async Task<MediaDto> UpdateMediaAsync(string id, UpdateMediaDto updateDto, string userId)
    {
        var media = await _db.Media.FirstOrDefaultAsync(m => m.Id == id);
        if (media == null)
            throw new ArgumentException("Media not found");
            
        if (media.UploadedBy != Guid.Parse(userId))
            throw new UnauthorizedAccessException("Not authorized to update this media");

        if (updateDto.AltText != null)
            media.AltText = updateDto.AltText;
            
        if (updateDto.Description != null)
            media.Description = updateDto.Description;
            
        if (updateDto.IsPublic.HasValue)
            media.IsPublic = updateDto.IsPublic.Value;
            
        if (updateDto.Metadata != null)
            media.Metadata = updateDto.Metadata;
            
        media.UpdatedAt = DateTime.UtcNow;
        
        await _db.SaveChangesAsync();
        return MapToMediaDto(media);
    }

    public async Task<bool> DeleteMediaAsync(string id, string userId)
    {
        var media = await _db.Media.FirstOrDefaultAsync(m => m.Id == id);
        if (media == null)
            return false;
            
        if (media.UploadedBy != Guid.Parse(userId))
            return false;

        // Delete physical file
        var fullPath = Path.Combine(_environment.WebRootPath, media.FilePath);
        if (File.Exists(fullPath))
        {
            File.Delete(fullPath);
        }

        // Delete thumbnail if exists
        if (!string.IsNullOrEmpty(media.ThumbnailUrl))
        {
            var thumbnailPath = Path.Combine(_environment.WebRootPath, media.ThumbnailUrl.TrimStart('/'));
            if (File.Exists(thumbnailPath))
            {
                File.Delete(thumbnailPath);
            }
        }

        _db.Media.Remove(media);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteMediaByEntityAsync(string entityType, string entityId, string userId)
    {
        var media = await _db.Media
            .Where(m => m.EntityType == entityType && m.EntityId == entityId && m.UploadedBy == Guid.Parse(userId))
            .ToListAsync();
            
        if (!media.Any())
            return false;

        foreach (var item in media)
        {
            await DeleteMediaAsync(item.Id, userId);
        }
        
        return true;
    }

    public async Task<bool> ProcessMediaAsync(string id)
    {
        var media = await _db.Media.FirstOrDefaultAsync(m => m.Id == id);
        if (media == null)
            return false;

        try
        {
            if (IsImageFile(media.ContentType))
            {
                await GenerateThumbnailAsync(id);
                await OptimizeImageAsync(id);
            }
            
            media.IsProcessed = true;
            media.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing media: {Id}", id);
            return false;
        }
    }

    public async Task<string?> GenerateThumbnailAsync(string id)
    {
        var media = await _db.Media.FirstOrDefaultAsync(m => m.Id == id);
        if (media == null || !IsImageFile(media.ContentType))
            return null;

        try
        {
            var fullPath = Path.Combine(_environment.WebRootPath, media.FilePath);
            if (!File.Exists(fullPath))
                return null;

            var thumbnailFileName = $"thumb_{media.FileName}";
            var thumbnailPath = Path.Combine(_thumbnailsPath, thumbnailFileName);
            var thumbnailUrl = $"/thumbnails/{thumbnailFileName}";

            using (var originalImage = Image.FromFile(fullPath))
            {
                var thumbnailSize = CalculateThumbnailSize(originalImage.Size, 300, 300);
                using (var thumbnail = new Bitmap(thumbnailSize.Width, thumbnailSize.Height))
                using (var graphics = Graphics.FromImage(thumbnail))
                {
                    graphics.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
                    graphics.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality;
                    graphics.PixelOffsetMode = System.Drawing.Drawing2D.PixelOffsetMode.HighQuality;
                    graphics.CompositingQuality = System.Drawing.Drawing2D.CompositingQuality.HighQuality;
                    
                    graphics.DrawImage(originalImage, 0, 0, thumbnailSize.Width, thumbnailSize.Height);
                    
                    thumbnail.Save(thumbnailPath, ImageFormat.Jpeg);
                }
            }

            media.ThumbnailUrl = thumbnailUrl;
            media.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();

            return thumbnailUrl;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error generating thumbnail for media: {Id}", id);
            return null;
        }
    }

    public async Task<bool> OptimizeImageAsync(string id)
    {
        var media = await _db.Media.FirstOrDefaultAsync(m => m.Id == id);
        if (media == null || !IsImageFile(media.ContentType))
            return false;

        try
        {
            var fullPath = Path.Combine(_environment.WebRootPath, media.FilePath);
            if (!File.Exists(fullPath))
                return false;

            // For now, just update the processed flag
            // In a real implementation, you might want to compress the image
            media.IsProcessed = true;
            media.UpdatedAt = DateTime.UtcNow;
            await _db.SaveChangesAsync();
            
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error optimizing image: {Id}", id);
            return false;
        }
    }

    public async Task<Stream?> GetFileStreamAsync(string id)
    {
        var media = await _db.Media.FirstOrDefaultAsync(m => m.Id == id);
        if (media == null)
            return null;

        var fullPath = Path.Combine(_environment.WebRootPath, media.FilePath);
        return File.Exists(fullPath) ? new FileStream(fullPath, FileMode.Open, FileAccess.Read) : null;
    }

    public async Task<Stream?> GetThumbnailStreamAsync(string id)
    {
        var media = await _db.Media.FirstOrDefaultAsync(m => m.Id == id);
        if (media == null || string.IsNullOrEmpty(media.ThumbnailUrl))
            return null;

        var thumbnailPath = Path.Combine(_environment.WebRootPath, media.ThumbnailUrl.TrimStart('/'));
        return File.Exists(thumbnailPath) ? new FileStream(thumbnailPath, FileMode.Open, FileAccess.Read) : null;
    }

    public async Task<string?> GetFileUrlAsync(string id, bool useThumbnail = false)
    {
        var media = await _db.Media.FirstOrDefaultAsync(m => m.Id == id);
        if (media == null)
            return null;

        return useThumbnail && !string.IsNullOrEmpty(media.ThumbnailUrl) ? media.ThumbnailUrl : media.Url;
    }

    public async Task<bool> ValidateFileAsync(Stream fileStream, string contentType, long fileSize)
    {
        if (!await IsFileTypeAllowedAsync(contentType))
            return false;

        var maxSize = await GetMaxFileSizeAsync(contentType);
        return fileSize <= maxSize;
    }

    public async Task<bool> IsFileTypeAllowedAsync(string contentType)
    {
        return await Task.FromResult(_allowedFileTypes.ContainsKey(contentType));
    }

    public async Task<long> GetMaxFileSizeAsync(string contentType)
    {
        return await Task.FromResult(_allowedFileTypes.TryGetValue(contentType, out var size) ? size : 0);
    }

    public async Task CleanupOrphanedFilesAsync()
    {
        // Implementation for cleaning up orphaned files
        // This would typically run as a background job
        await Task.CompletedTask;
    }

    public async Task CleanupExpiredFilesAsync()
    {
        // Implementation for cleaning up expired files
        // This would typically run as a background job
        await Task.CompletedTask;
    }

    private static bool IsImageFile(string contentType)
    {
        return contentType.StartsWith("image/");
    }

    private static Size CalculateThumbnailSize(Size originalSize, int maxWidth, int maxHeight)
    {
        var ratio = Math.Min((double)maxWidth / originalSize.Width, (double)maxHeight / originalSize.Height);
        return new Size((int)(originalSize.Width * ratio), (int)(originalSize.Height * ratio));
    }

    private static MediaDto MapToMediaDto(Media media) => new MediaDto
    {
        Id = media.Id,
        FileName = media.FileName,
        OriginalFileName = media.OriginalFileName,
        ContentType = media.ContentType,
        FileSize = media.FileSize,
        FilePath = media.FilePath,
        Url = media.Url,
        ThumbnailUrl = media.ThumbnailUrl,
        AltText = media.AltText,
        Description = media.Description,
        EntityType = media.EntityType,
        EntityId = media.EntityId,
        UploadedBy = media.UploadedBy.ToString(),
        CreatedAt = media.CreatedAt,
        UpdatedAt = media.UpdatedAt,
        IsPublic = media.IsPublic,
        IsProcessed = media.IsProcessed,
        Metadata = media.Metadata
    };
}
