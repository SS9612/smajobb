using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Smajobb.DTOs;
using Smajobb.Services.Interfaces;

namespace Smajobb.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SearchController : ControllerBase
{
    private readonly ISearchService _searchService;
    private readonly ILogger<SearchController> _logger;

    public SearchController(ISearchService searchService, ILogger<SearchController> logger)
    {
        _searchService = searchService;
        _logger = logger;
    }

    [HttpPost("jobs")]
    public async Task<IActionResult> SearchJobs([FromBody] JobSearchDto searchDto)
    {
        try
        {
            var result = await _searchService.SearchJobsAsync(searchDto);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching jobs");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("jobs/filters")]
    public async Task<IActionResult> GetJobSearchFilters([FromQuery] JobSearchDto searchDto)
    {
        try
        {
            var filters = await _searchService.GetJobSearchFiltersAsync(searchDto);
            return Ok(filters);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting job search filters");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("jobs/suggestions")]
    public async Task<IActionResult> GetJobSearchSuggestions([FromQuery] string query, [FromQuery] int limit = 10)
    {
        try
        {
            var suggestions = await _searchService.GetJobSearchSuggestionsAsync(query, limit);
            return Ok(suggestions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting job search suggestions");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("users")]
    [Authorize]
    public async Task<IActionResult> SearchUsers([FromBody] UserSearchDto searchDto)
    {
        try
        {
            var result = await _searchService.SearchUsersAsync(searchDto);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching users");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("users/suggestions")]
    [Authorize]
    public async Task<IActionResult> GetUserSearchSuggestions([FromQuery] string query, [FromQuery] int limit = 10)
    {
        try
        {
            var suggestions = await _searchService.GetUserSearchSuggestionsAsync(query, limit);
            return Ok(suggestions);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user search suggestions");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("popular/searches")]
    public async Task<IActionResult> GetPopularSearches([FromQuery] int limit = 10)
    {
        try
        {
            var searches = await _searchService.GetPopularSearchesAsync(limit);
            return Ok(searches);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting popular searches");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("popular/categories")]
    public async Task<IActionResult> GetPopularCategories([FromQuery] int limit = 10)
    {
        try
        {
            var categories = await _searchService.GetPopularCategoriesAsync(limit);
            return Ok(categories);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting popular categories");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpGet("popular/skills")]
    public async Task<IActionResult> GetPopularSkills([FromQuery] int limit = 10)
    {
        try
        {
            var skills = await _searchService.GetPopularSkillsAsync(limit);
            return Ok(skills);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting popular skills");
            return StatusCode(500, "Internal server error");
        }
    }

    [HttpPost("log")]
    [Authorize]
    public async Task<IActionResult> LogSearch([FromBody] LogSearchRequest request)
    {
        try
        {
            var userId = GetCurrentUserId();
            await _searchService.LogSearchAsync(request.Query, userId, request.Filters);
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error logging search");
            return StatusCode(500, "Internal server error");
        }
    }

    private string GetCurrentUserId()
    {
        return User.FindFirst("userId")?.Value ?? string.Empty;
    }
}

public record LogSearchRequest
{
    public string Query { get; init; } = string.Empty;
    public string? Filters { get; init; }
}
