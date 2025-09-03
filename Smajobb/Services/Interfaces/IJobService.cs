using Smajobb.DTOs;
using Smajobb.Models;

namespace Smajobb.Services.Interfaces;

public interface IJobService
{
    Task<JobDto> CreateJobAsync(CreateJobDto createJobDto, Guid creatorId);
    Task<JobDto?> GetJobByIdAsync(Guid jobId);
    Task<IEnumerable<JobDto>> GetJobsByCreatorAsync(Guid creatorId);
    Task<IEnumerable<JobDto>> SearchJobsAsync(JobSearchDto searchDto);
    Task<JobDto> UpdateJobAsync(Guid jobId, CreateJobDto updateDto, Guid userId);
    Task<bool> DeleteJobAsync(Guid jobId, Guid userId);
    Task<bool> UpdateJobStatusAsync(Guid jobId, string status, Guid userId);
    
    // Category operations
    Task<IEnumerable<string>> GetJobCategoriesAsync();
    Task<bool> AddJobCategoryAsync(string category);
    Task<bool> RemoveJobCategoryAsync(string category);
}
