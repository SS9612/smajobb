using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Smajobb.DTOs;
using Smajobb.Services.Interfaces;

namespace Smajobb.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MediaController : ControllerBase
{
    private readonly IMediaService _mediaService;
    private readonly ILogger<MediaController> _logger;

    public MediaController(IMediaService mediaService, ILogger<MediaController> logger)
    {
        _mediaService = mediaService;
        _logger = logger;
    }

    [HttpPost("upload")]
    public async Task<IActionResult> UploadFile([FromForm] IFormFile file, [FromForm] string entityType, [FromForm] string entityId, [FromForm] string? altText = null, [FromForm] string? description = null, [FromForm] bool isPublic = true)
    {
        try
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file provided");

            var userId = GetCurrentUserId();
            var mediaDto = new CreateMediaDto
            {
                FileName = file.FileName,
                ContentType = file.ContentType,
                FileSize = file.Length,
                EntityType = entityType,
                EntityId = entityId,
                AltText = altText,
                Description = description,
                IsPublic = isPublic
            };

            using var stream = file.OpenReadStream();
            var result = await _mediaService.UploadFileAsync(stream, mediaDto, userId);

            if (!result.Success)
                return BadRequest(result.ErrorMessage);

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading file");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("upload-multiple")]
    public async Task<IActionResult> UploadMultipleFiles([FromForm] List<IFormFile> files, [FromForm] string entityType, [FromForm] string entityId, [FromForm] bool isPublic = true)
    {
        try
        {
            if (files == null || !files.Any())
                return BadRequest("No files provided");

            var userId = GetCurrentUserId();
            var fileData = files.Select(file => (
                stream: file.OpenReadStream(),
                dto: new CreateMediaDto
                {
                    FileName = file.FileName,
                    ContentType = file.ContentType,
                    FileSize = file.Length,
                    EntityType = entityType,
                    EntityId = entityId,
                    IsPublic = isPublic
                }
            ));

            var results = await _mediaService.UploadMultipleFilesAsync(fileData, userId);
            return Ok(results);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error uploading multiple files");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetMedia(string id)
    {
        try
        {
            var media = await _mediaService.GetMediaByIdAsync(id);
            if (media == null)
                return NotFound();

            return Ok(media);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting media: {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("entity/{entityType}/{entityId}")]
    public async Task<IActionResult> GetMediaByEntity(string entityType, string entityId)
    {
        try
        {
            var media = await _mediaService.GetMediaByEntityAsync(entityType, entityId);
            return Ok(media);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting media for entity: {EntityType}/{EntityId}", entityType, entityId);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("list")]
    public async Task<IActionResult> GetMediaList([FromQuery] string? entityType = null, [FromQuery] string? entityId = null, [FromQuery] int page = 1, [FromQuery] int pageSize = 20)
    {
        try
        {
            var mediaList = await _mediaService.GetMediaListAsync(entityType, entityId, page, pageSize);
            return Ok(mediaList);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting media list");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMedia(string id, [FromBody] UpdateMediaDto updateDto)
    {
        try
        {
            var userId = GetCurrentUserId();
            var media = await _mediaService.UpdateMediaAsync(id, updateDto, userId);
            return Ok(media);
        }
        catch (ArgumentException)
        {
            return NotFound();
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating media: {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMedia(string id)
    {
        try
        {
            var userId = GetCurrentUserId();
            var success = await _mediaService.DeleteMediaAsync(id, userId);
            
            if (!success)
                return NotFound();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting media: {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpDelete("entity/{entityType}/{entityId}")]
    public async Task<IActionResult> DeleteMediaByEntity(string entityType, string entityId)
    {
        try
        {
            var userId = GetCurrentUserId();
            var success = await _mediaService.DeleteMediaByEntityAsync(entityType, entityId, userId);
            
            if (!success)
                return NotFound();

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting media for entity: {EntityType}/{EntityId}", entityType, entityId);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("{id}/file")]
    public async Task<IActionResult> GetFile(string id)
    {
        try
        {
            var media = await _mediaService.GetMediaByIdAsync(id);
            if (media == null)
                return NotFound();

            var stream = await _mediaService.GetFileStreamAsync(id);
            if (stream == null)
                return NotFound();

            return File(stream, media.ContentType, media.OriginalFileName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting file: {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("{id}/thumbnail")]
    public async Task<IActionResult> GetThumbnail(string id)
    {
        try
        {
            var media = await _mediaService.GetMediaByIdAsync(id);
            if (media == null)
                return NotFound();

            var stream = await _mediaService.GetThumbnailStreamAsync(id);
            if (stream == null)
                return NotFound();

            return File(stream, "image/jpeg", $"thumb_{media.OriginalFileName}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting thumbnail: {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("{id}/process")]
    public async Task<IActionResult> ProcessMedia(string id)
    {
        try
        {
            var success = await _mediaService.ProcessMediaAsync(id);
            if (!success)
                return NotFound();

            return Ok(new { message = "Media processing started" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error processing media: {Id}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("allowed-types")]
    public async Task<IActionResult> GetAllowedFileTypes()
    {
        try
        {
            var allowedTypes = new Dictionary<string, long>
            {
                { "image/jpeg", 10 * 1024 * 1024 },
                { "image/png", 10 * 1024 * 1024 },
                { "image/gif", 5 * 1024 * 1024 },
                { "image/webp", 10 * 1024 * 1024 },
                { "application/pdf", 20 * 1024 * 1024 },
                { "text/plain", 1 * 1024 * 1024 },
                { "application/msword", 10 * 1024 * 1024 },
                { "application/vnd.openxmlformats-officedocument.wordprocessingml.document", 10 * 1024 * 1024 }
            };

            return Ok(allowedTypes);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting allowed file types");
            return StatusCode(500, "Internal server error");
        }
    }

    private string GetCurrentUserId()
    {
        return User.FindFirst("userId")?.Value ?? string.Empty;
    }
}
