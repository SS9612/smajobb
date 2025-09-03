using Smajobb.DTOs;

namespace Smajobb.Services.Interfaces;

public interface ISearchService
{
    // Job search
    Task<SearchResultDto<JobDto>> SearchJobsAsync(JobSearchDto searchDto);
    Task<SearchFiltersDto> GetJobSearchFiltersAsync(JobSearchDto searchDto);
    Task<IEnumerable<SearchSuggestionDto>> GetJobSearchSuggestionsAsync(string query, int limit = 10);
    
    // User search
    Task<SearchResultDto<UserDto>> SearchUsersAsync(UserSearchDto searchDto);
    Task<IEnumerable<SearchSuggestionDto>> GetUserSearchSuggestionsAsync(string query, int limit = 10);
    
    // Popular searches and analytics
    Task<IEnumerable<string>> GetPopularSearchesAsync(int limit = 10);
    Task<IEnumerable<string>> GetPopularCategoriesAsync(int limit = 10);
    Task<IEnumerable<string>> GetPopularSkillsAsync(int limit = 10);
    
    // Search analytics
    Task LogSearchAsync(string query, string? userId = null, string? filters = null);
}
