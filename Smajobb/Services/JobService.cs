using Smajobb.Data;
using Smajobb.DTOs;
using Smajobb.Models;
using Smajobb.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Smajobb.Services;

public class JobService : IJobService
{
    private readonly SmajobbDbContext _context;
    private readonly ILogger<JobService> _logger;

    public JobService(SmajobbDbContext context, ILogger<JobService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<JobDto> CreateJobAsync(CreateJobDto createJobDto, Guid creatorId)
    {
        try
        {
            var job = new Job
            {
                Id = Guid.NewGuid(),
                Title = createJobDto.Title,
                Description = createJobDto.Description,
                Category = createJobDto.Category,
                PriceType = createJobDto.PriceType,
                Price = createJobDto.Price,
                EstimatedHours = createJobDto.EstimatedHours,
                Urgency = createJobDto.Urgency ?? "medium",
                Address = createJobDto.Address,
                RequiredSkills = createJobDto.RequiredSkills != null ? string.Join(",", createJobDto.RequiredSkills) : null,
                MinAge = createJobDto.MinAge,
                MaxAge = createJobDto.MaxAge,
                RequiresBackgroundCheck = createJobDto.RequiresBackgroundCheck,
                StartsAt = createJobDto.StartsAt,
                EndsAt = createJobDto.EndsAt,
                CreatorId = creatorId,
                Status = "active",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Jobs.Add(job);
            await _context.SaveChangesAsync();

            return MapToJobDto(job);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating job");
            throw;
        }
    }

    public async Task<JobDto?> GetJobByIdAsync(Guid jobId)
    {
        try
        {
            var job = await _context.Jobs
                .Include(j => j.Creator)
                .FirstOrDefaultAsync(j => j.Id == jobId);

            return job != null ? MapToJobDto(job) : null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting job by ID: {JobId}", jobId);
            throw;
        }
    }

    public async Task<IEnumerable<JobDto>> GetJobsByCreatorAsync(Guid creatorId)
    {
        try
        {
            var jobs = await _context.Jobs
                .Include(j => j.Creator)
                .Where(j => j.CreatorId == creatorId)
                .OrderByDescending(j => j.CreatedAt)
                .ToListAsync();

            return jobs.Select(MapToJobDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting jobs by creator: {CreatorId}", creatorId);
            throw;
        }
    }

    public async Task<IEnumerable<JobDto>> SearchJobsAsync(JobSearchDto searchDto)
    {
        try
        {
            var query = _context.Jobs
                .Include(j => j.Creator)
                .AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(searchDto.Query))
            {
                query = query.Where(j => j.Title.Contains(searchDto.Query) || 
                                        j.Description.Contains(searchDto.Query));
            }

            if (!string.IsNullOrEmpty(searchDto.Category))
            {
                query = query.Where(j => j.Category == searchDto.Category);
            }

            if (!string.IsNullOrEmpty(searchDto.Location))
            {
                query = query.Where(j => j.Address.Contains(searchDto.Location));
            }

            if (searchDto.MinPrice.HasValue)
            {
                query = query.Where(j => j.Price >= searchDto.MinPrice.Value);
            }

            if (searchDto.MaxPrice.HasValue)
            {
                query = query.Where(j => j.Price <= searchDto.MaxPrice.Value);
            }

            if (!string.IsNullOrEmpty(searchDto.Status))
            {
                query = query.Where(j => j.Status == searchDto.Status);
            }

            // Apply sorting
            switch (searchDto.SortBy?.ToLower())
            {
                case "price":
                    query = searchDto.SortOrder?.ToLower() == "asc" 
                        ? query.OrderBy(j => j.Price)
                        : query.OrderByDescending(j => j.Price);
                    break;
                case "urgency":
                    query = searchDto.SortOrder?.ToLower() == "asc"
                        ? query.OrderBy(j => j.Urgency)
                        : query.OrderByDescending(j => j.Urgency);
                    break;
                default:
                    query = searchDto.SortOrder?.ToLower() == "asc"
                        ? query.OrderBy(j => j.CreatedAt)
                        : query.OrderByDescending(j => j.CreatedAt);
                    break;
            }

            // Apply pagination
            var jobs = await query
                .Skip((searchDto.Page - 1) * searchDto.PageSize)
                .Take(searchDto.PageSize)
                .ToListAsync();

            return jobs.Select(MapToJobDto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching jobs");
            throw;
        }
    }

    public async Task<JobDto> UpdateJobAsync(Guid jobId, CreateJobDto updateDto, Guid userId)
    {
        try
        {
            var job = await _context.Jobs.FirstOrDefaultAsync(j => j.Id == jobId);
            if (job == null)
            {
                throw new ArgumentException("Job not found");
            }

            if (job.CreatorId != userId)
            {
                throw new UnauthorizedAccessException("You can only update your own jobs");
            }

            // Update properties
            job.Title = updateDto.Title;
            job.Description = updateDto.Description;
            job.Category = updateDto.Category;
            job.PriceType = updateDto.PriceType;
            job.Price = updateDto.Price;
            job.EstimatedHours = updateDto.EstimatedHours;
            job.Urgency = updateDto.Urgency ?? "medium";
            job.Address = updateDto.Address;
            job.RequiredSkills = updateDto.RequiredSkills != null ? string.Join(",", updateDto.RequiredSkills) : null;
            job.MinAge = updateDto.MinAge;
            job.MaxAge = updateDto.MaxAge;
            job.RequiresBackgroundCheck = updateDto.RequiresBackgroundCheck;
            job.StartsAt = updateDto.StartsAt;
            job.EndsAt = updateDto.EndsAt;
            job.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return MapToJobDto(job);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating job: {JobId}", jobId);
            throw;
        }
    }

    public async Task<bool> DeleteJobAsync(Guid jobId, Guid userId)
    {
        try
        {
            var job = await _context.Jobs.FirstOrDefaultAsync(j => j.Id == jobId);
            if (job == null)
            {
                return false;
            }

            if (job.CreatorId != userId)
            {
                throw new UnauthorizedAccessException("You can only delete your own jobs");
            }

            _context.Jobs.Remove(job);
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting job: {JobId}", jobId);
            throw;
        }
    }

    public async Task<bool> UpdateJobStatusAsync(Guid jobId, string status, Guid userId)
    {
        try
        {
            var job = await _context.Jobs.FirstOrDefaultAsync(j => j.Id == jobId);
            if (job == null)
            {
                return false;
            }

            if (job.CreatorId != userId)
            {
                throw new UnauthorizedAccessException("You can only update your own jobs");
            }

            job.Status = status;
            job.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating job status: {JobId}", jobId);
            throw;
        }
    }

    public async Task<IEnumerable<string>> GetJobCategoriesAsync()
    {
        try
        {
            // Return hardcoded categories for now
            return new List<string>
            {
                "Hushållsarbete",
                "Trädgårdsarbete", 
                "Transport",
                "IT & Teknik",
                "Undervisning",
                "Hantverk",
                "Vård & Omsorg",
                "Event & Fest"
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting job categories");
            throw;
        }
    }

    public async Task<bool> AddJobCategoryAsync(string category)
    {
        // Implementation for adding categories
        return await Task.FromResult(true);
    }

    public async Task<bool> RemoveJobCategoryAsync(string category)
    {
        // Implementation for removing categories
        return await Task.FromResult(true);
    }

    private static JobDto MapToJobDto(Job job)
    {
        return new JobDto
        {
            Id = job.Id,
            Title = job.Title,
            Description = job.Description,
            Category = job.Category,
            PriceType = job.PriceType,
            Price = job.Price,
            EstimatedHours = job.EstimatedHours,
            Urgency = job.Urgency,
            Address = job.Address,
            RequiredSkills = !string.IsNullOrEmpty(job.RequiredSkills) ? job.RequiredSkills.Split(',').ToList() : null,
            MinAge = job.MinAge,
            MaxAge = job.MaxAge,
            RequiresBackgroundCheck = job.RequiresBackgroundCheck,
            StartsAt = job.StartsAt,
            EndsAt = job.EndsAt,
            Status = job.Status,
            CreatorId = job.CreatorId,
            CreatedAt = job.CreatedAt
        };
    }
}
