using Microsoft.EntityFrameworkCore;
using Smajobb.Data;
using Smajobb.DTOs;
using Smajobb.Models;
using Smajobb.Services.Interfaces;
using NetTopologySuite.Geometries;

namespace Smajobb.Services;

public class SearchService : ISearchService
{
    private readonly SmajobbDbContext _db;

    public SearchService(SmajobbDbContext db)
    {
        _db = db;
    }

    public async Task<SearchResultDto<JobDto>> SearchJobsAsync(JobSearchDto searchDto)
    {
        var query = _db.Jobs
            .Include(j => j.Creator)
            .Include(j => j.Tags)
            .AsQueryable();

        // Apply filters
        query = ApplyJobFilters(query, searchDto);

        // Apply sorting
        query = ApplyJobSorting(query, searchDto);

        // Get total count before pagination
        var totalCount = await query.CountAsync();

        // Apply pagination
        var jobs = await query
            .Skip((searchDto.Page - 1) * searchDto.PageSize)
            .Take(searchDto.PageSize)
            .AsNoTracking()
            .ToListAsync();

        var jobDtos = jobs.Select(MapToJobDto);

        return new SearchResultDto<JobDto>
        {
            Items = jobDtos,
            TotalCount = totalCount,
            Page = searchDto.Page,
            PageSize = searchDto.PageSize,
            TotalPages = (int)Math.Ceiling((double)totalCount / searchDto.PageSize),
            AvailableFilters = await GetJobSearchFiltersAsync(searchDto),
            Suggestions = await GetSearchSuggestions(searchDto.Query)
        };
    }

    public async Task<SearchFiltersDto> GetJobSearchFiltersAsync(JobSearchDto searchDto)
    {
        var baseQuery = _db.Jobs.AsQueryable();
        baseQuery = ApplyJobFilters(baseQuery, searchDto);

        var categories = await baseQuery
            .Select(j => j.Category)
            .Distinct()
            .OrderBy(c => c)
            .ToListAsync();

        var priceTypes = await baseQuery
            .Select(j => j.PriceType)
            .Distinct()
            .OrderBy(p => p)
            .ToListAsync();

        var urgencies = await baseQuery
            .Select(j => j.Urgency)
            .Distinct()
            .OrderBy(u => u)
            .ToListAsync();

        var statuses = await baseQuery
            .Select(j => j.Status)
            .Distinct()
            .OrderBy(s => s)
            .ToListAsync();

        var skills = await baseQuery
            .Where(j => !string.IsNullOrEmpty(j.RequiredSkills))
            .Select(j => j.RequiredSkills)
            .ToListAsync();

        var allSkills = skills
            .SelectMany(s => s!.Split(',', StringSplitOptions.RemoveEmptyEntries))
            .Select(s => s.Trim())
            .Distinct()
            .OrderBy(s => s)
            .ToList();

        var priceRange = await baseQuery
            .GroupBy(j => 1)
            .Select(g => new { Min = g.Min(j => j.Price), Max = g.Max(j => j.Price) })
            .FirstOrDefaultAsync();

        return new SearchFiltersDto
        {
            Categories = categories.ToArray(),
            PriceTypes = priceTypes.ToArray(),
            Urgencies = urgencies.ToArray(),
            Statuses = statuses.ToArray(),
            Skills = allSkills.ToArray(),
            PriceRange = new PriceRangeDto
            {
                Min = priceRange?.Min ?? 0,
                Max = priceRange?.Max ?? 0
            }
        };
    }

    public async Task<IEnumerable<SearchSuggestionDto>> GetJobSearchSuggestionsAsync(string query, int limit = 10)
    {
        if (string.IsNullOrWhiteSpace(query))
            return Enumerable.Empty<SearchSuggestionDto>();

        var suggestions = new List<SearchSuggestionDto>();

        // Job title suggestions
        var jobTitles = await _db.Jobs
            .Where(j => j.Title.Contains(query))
            .GroupBy(j => j.Title)
            .Select(g => new SearchSuggestionDto
            {
                Text = g.Key,
                Type = "job",
                Count = g.Count()
            })
            .OrderByDescending(s => s.Count)
            .Take(limit / 2)
            .ToListAsync();

        suggestions.AddRange(jobTitles);

        // Category suggestions
        var categories = await _db.Jobs
            .Where(j => j.Category.Contains(query))
            .GroupBy(j => j.Category)
            .Select(g => new SearchSuggestionDto
            {
                Text = g.Key,
                Type = "category",
                Count = g.Count()
            })
            .OrderByDescending(s => s.Count)
            .Take(limit / 2)
            .ToListAsync();

        suggestions.AddRange(categories);

        return suggestions.OrderByDescending(s => s.Count).Take(limit);
    }

    public async Task<SearchResultDto<UserDto>> SearchUsersAsync(UserSearchDto searchDto)
    {
        var query = _db.Users
            .Include(u => u.Skills)
            .AsQueryable();

        // Apply filters
        query = ApplyUserFilters(query, searchDto);

        // Apply sorting
        query = ApplyUserSorting(query, searchDto);

        // Get total count before pagination
        var totalCount = await query.CountAsync();

        // Apply pagination
        var users = await query
            .Skip((searchDto.Page - 1) * searchDto.PageSize)
            .Take(searchDto.PageSize)
            .AsNoTracking()
            .ToListAsync();

        var userDtos = users.Select(MapToUserDto);

        return new SearchResultDto<UserDto>
        {
            Items = userDtos,
            TotalCount = totalCount,
            Page = searchDto.Page,
            PageSize = searchDto.PageSize,
            TotalPages = (int)Math.Ceiling((double)totalCount / searchDto.PageSize)
        };
    }

    public async Task<IEnumerable<SearchSuggestionDto>> GetUserSearchSuggestionsAsync(string query, int limit = 10)
    {
        if (string.IsNullOrWhiteSpace(query))
            return Enumerable.Empty<SearchSuggestionDto>();

        var suggestions = new List<SearchSuggestionDto>();

        // User name suggestions
        var userNames = await _db.Users
            .Where(u => u.DisplayName.Contains(query))
            .GroupBy(u => u.DisplayName)
            .Select(g => new SearchSuggestionDto
            {
                Text = g.Key,
                Type = "user",
                Count = g.Count()
            })
            .OrderByDescending(s => s.Count)
            .Take(limit)
            .ToListAsync();

        return userNames;
    }

    public async Task<IEnumerable<string>> GetPopularSearchesAsync(int limit = 10)
    {
        // This would typically come from a search analytics table
        // For now, return popular job titles
        return await _db.Jobs
            .GroupBy(j => j.Title)
            .OrderByDescending(g => g.Count())
            .Select(g => g.Key)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<IEnumerable<string>> GetPopularCategoriesAsync(int limit = 10)
    {
        return await _db.Jobs
            .GroupBy(j => j.Category)
            .OrderByDescending(g => g.Count())
            .Select(g => g.Key)
            .Take(limit)
            .ToListAsync();
    }

    public async Task<IEnumerable<string>> GetPopularSkillsAsync(int limit = 10)
    {
        var skills = await _db.Jobs
            .Where(j => !string.IsNullOrEmpty(j.RequiredSkills))
            .Select(j => j.RequiredSkills)
            .ToListAsync();

        return skills
            .SelectMany(s => s!.Split(',', StringSplitOptions.RemoveEmptyEntries))
            .Select(s => s.Trim())
            .GroupBy(s => s)
            .OrderByDescending(g => g.Count())
            .Select(g => g.Key)
            .Take(limit)
            .ToList();
    }

    public async Task LogSearchAsync(string query, string? userId = null, string? filters = null)
    {
        // This would typically log to a search analytics table
        // For now, we'll just log to console or a simple table
        // Implementation depends on your analytics requirements
    }

    private IQueryable<Job> ApplyJobFilters(IQueryable<Job> query, JobSearchDto searchDto)
    {
        // Text search
        if (!string.IsNullOrEmpty(searchDto.Query))
        {
            query = query.Where(j => 
                j.Title.Contains(searchDto.Query) ||
                j.Description!.Contains(searchDto.Query) ||
                j.RequiredSkills!.Contains(searchDto.Query));
        }

        // Category filter
        if (!string.IsNullOrEmpty(searchDto.Category))
        {
            query = query.Where(j => j.Category == searchDto.Category);
        }

        // Location filter
        if (searchDto.Latitude.HasValue && searchDto.Longitude.HasValue && searchDto.RadiusKm.HasValue)
        {
            var center = new Point(searchDto.Longitude.Value, searchDto.Latitude.Value) { SRID = 4326 };
            var radiusInMeters = searchDto.RadiusKm.Value * 1000;
            query = query.Where(j => j.Location != null && j.Location.Distance(center) <= radiusInMeters);
        }
        else if (!string.IsNullOrEmpty(searchDto.Location))
        {
            query = query.Where(j => j.Address!.Contains(searchDto.Location));
        }

        // Price filters
        if (!string.IsNullOrEmpty(searchDto.PriceType))
        {
            query = query.Where(j => j.PriceType == searchDto.PriceType);
        }

        if (searchDto.MinPrice.HasValue)
        {
            query = query.Where(j => j.Price >= searchDto.MinPrice.Value);
        }

        if (searchDto.MaxPrice.HasValue)
        {
            query = query.Where(j => j.Price <= searchDto.MaxPrice.Value);
        }

        // Other filters
        if (!string.IsNullOrEmpty(searchDto.Urgency))
        {
            query = query.Where(j => j.Urgency == searchDto.Urgency);
        }

        if (!string.IsNullOrEmpty(searchDto.Status))
        {
            query = query.Where(j => j.Status == searchDto.Status);
        }

        if (searchDto.StartDate.HasValue)
        {
            query = query.Where(j => j.StartsAt >= searchDto.StartDate.Value);
        }

        if (searchDto.EndDate.HasValue)
        {
            query = query.Where(j => j.EndsAt <= searchDto.EndDate.Value);
        }

        if (searchDto.MinAge.HasValue)
        {
            query = query.Where(j => j.MinAge == null || j.MinAge <= searchDto.MinAge.Value);
        }

        if (searchDto.MaxAge.HasValue)
        {
            query = query.Where(j => j.MaxAge == null || j.MaxAge >= searchDto.MaxAge.Value);
        }

        if (searchDto.RequiresBackgroundCheck.HasValue)
        {
            query = query.Where(j => j.RequiresBackgroundCheck == searchDto.RequiresBackgroundCheck.Value);
        }

        // Skills filter
        if (searchDto.Skills != null && searchDto.Skills.Length > 0)
        {
            foreach (var skill in searchDto.Skills)
            {
                query = query.Where(j => j.RequiredSkills!.Contains(skill));
            }
        }

        return query;
    }

    private IQueryable<Job> ApplyJobSorting(IQueryable<Job> query, JobSearchDto searchDto)
    {
        return searchDto.SortBy switch
        {
            "price" => searchDto.SortOrder == "asc" 
                ? query.OrderBy(j => j.Price) 
                : query.OrderByDescending(j => j.Price),
            "urgency" => searchDto.SortOrder == "asc"
                ? query.OrderBy(j => j.Urgency)
                : query.OrderByDescending(j => j.Urgency),
            "createdAt" => searchDto.SortOrder == "asc"
                ? query.OrderBy(j => j.CreatedAt)
                : query.OrderByDescending(j => j.CreatedAt),
            _ => query.OrderByDescending(j => j.CreatedAt)
        };
    }

    private IQueryable<User> ApplyUserFilters(IQueryable<User> query, UserSearchDto searchDto)
    {
        if (!string.IsNullOrEmpty(searchDto.Query))
        {
            query = query.Where(u => 
                u.DisplayName.Contains(searchDto.Query) ||
                u.Email.Contains(searchDto.Query));
        }

        if (!string.IsNullOrEmpty(searchDto.Role))
        {
            query = query.Where(u => u.Role == searchDto.Role);
        }

        if (searchDto.MinAge.HasValue)
        {
            query = query.Where(u => u.DateOfBirth.HasValue && 
                DateTime.Now.Year - u.DateOfBirth.Value.Year >= searchDto.MinAge.Value);
        }

        if (searchDto.MaxAge.HasValue)
        {
            query = query.Where(u => u.DateOfBirth.HasValue && 
                DateTime.Now.Year - u.DateOfBirth.Value.Year <= searchDto.MaxAge.Value);
        }

        if (searchDto.IsVerified.HasValue)
        {
            query = query.Where(u => u.IsVerified == searchDto.IsVerified.Value);
        }

        return query;
    }

    private IQueryable<User> ApplyUserSorting(IQueryable<User> query, UserSearchDto searchDto)
    {
        return searchDto.SortBy switch
        {
            "createdAt" => searchDto.SortOrder == "asc"
                ? query.OrderBy(u => u.CreatedAt)
                : query.OrderByDescending(u => u.CreatedAt),
            _ => query.OrderByDescending(u => u.CreatedAt)
        };
    }

    private async Task<string[]?> GetSearchSuggestions(string? query)
    {
        if (string.IsNullOrWhiteSpace(query))
            return null;

        var suggestions = new List<string>();

        // Add category suggestions
        var categories = await _db.Jobs
            .Where(j => j.Category.Contains(query))
            .Select(j => j.Category)
            .Distinct()
            .Take(3)
            .ToListAsync();

        suggestions.AddRange(categories);

        return suggestions.ToArray();
    }

    private static JobDto MapToJobDto(Job job) => new JobDto
    {
        Id = job.Id,
        Title = job.Title,
        Description = job.Description,
        Category = job.Category,
        Address = job.Address,
        CreatorId = job.CreatorId,
        CreatorName = job.Creator?.DisplayName,
        PriceType = job.PriceType,
        Price = job.Price,
        CreatedAt = job.CreatedAt,
        UpdatedAt = job.UpdatedAt,
        StartsAt = job.StartsAt,
        EndsAt = job.EndsAt,
        Status = job.Status,
        Urgency = job.Urgency,
        EstimatedHours = job.EstimatedHours,
        RequiresBackgroundCheck = job.RequiresBackgroundCheck,
        MinAge = job.MinAge,
        MaxAge = job.MaxAge,
        RequiredSkills = job.RequiredSkills,
        SpecialInstructions = job.SpecialInstructions,
        ViewCount = job.ViewCount,
        ApplicationCount = job.ApplicationCount
    };

    private static UserDto MapToUserDto(User user) => new UserDto
    {
        Id = user.Id,
        Email = user.Email,
        DisplayName = user.DisplayName,
        Role = user.Role,
        PhoneNumber = user.PhoneNumber,
        DateOfBirth = user.DateOfBirth,
        Address = user.Address,
        City = user.City,
        PostalCode = user.PostalCode,
        IsVerified = user.IsVerified,
        CreatedAt = user.CreatedAt,
        UpdatedAt = user.UpdatedAt
    };
}
