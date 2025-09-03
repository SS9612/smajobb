using Microsoft.EntityFrameworkCore;
using Smajobb.Data;
using Smajobb.DTOs;
using Smajobb.Models;
using Smajobb.Services.Interfaces;

namespace Smajobb.Services;

public class UserService : IUserService
{
    private readonly SmajobbDbContext _context;
    private readonly ILogger<UserService> _logger;

    public UserService(SmajobbDbContext context, ILogger<UserService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task<UserProfileDto> CreateUserAsync(UserRegistrationDto registrationDto)
    {
        try
        {
            var user = new User
            {
                Email = registrationDto.Email,
                Phone = registrationDto.Phone,
                DisplayName = registrationDto.DisplayName,
                Role = registrationDto.Role
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Created user with ID: {UserId}", user.Id);

            return new UserProfileDto
            {
                Id = user.Id,
                Email = user.Email,
                Phone = user.Phone,
                DisplayName = user.DisplayName,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating user");
            throw;
        }
    }

    public async Task<UserProfileDto?> GetUserByIdAsync(Guid userId)
    {
        try
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null) return null;

            return new UserProfileDto
            {
                Id = user.Id,
                Email = user.Email,
                Phone = user.Phone,
                DisplayName = user.DisplayName,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user by ID: {UserId}", userId);
            throw;
        }
    }

    public async Task<UserProfileDto?> GetUserByEmailAsync(string email)
    {
        try
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);

            if (user == null) return null;

            return new UserProfileDto
            {
                Id = user.Id,
                Email = user.Email,
                Phone = user.Phone,
                DisplayName = user.DisplayName,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user by email: {Email}", email);
            throw;
        }
    }

    public async Task<UserProfileDto?> GetUserByBankIdSubjectAsync(string bankIdSubject)
    {
        try
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.BankIdSubject == bankIdSubject);

            if (user == null) return null;

            return new UserProfileDto
            {
                Id = user.Id,
                Email = user.Email,
                Phone = user.Phone,
                DisplayName = user.DisplayName,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user by BankID subject: {BankIdSubject}", bankIdSubject);
            throw;
        }
    }

    public async Task<UserProfileDto> UpdateUserAsync(Guid userId, UserRegistrationDto updateDto)
    {
        try
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                throw new ArgumentException("User not found");
            }

            user.Email = updateDto.Email;
            user.Phone = updateDto.Phone;
            user.DisplayName = updateDto.DisplayName;
            user.Role = updateDto.Role;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Updated user with ID: {UserId}", userId);

            return new UserProfileDto
            {
                Id = user.Id,
                Email = user.Email,
                Phone = user.Phone,
                DisplayName = user.DisplayName,
                Role = user.Role,
                CreatedAt = user.CreatedAt
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user: {UserId}", userId);
            throw;
        }
    }

    public async Task<bool> DeleteUserAsync(Guid userId)
    {
        try
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Deleted user with ID: {UserId}", userId);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting user: {UserId}", userId);
            throw;
        }
    }

    public async Task<YouthProfileDto> CreateYouthProfileAsync(Guid userId, YouthProfileDto profileDto)
    {
        try
        {
            var youthProfile = new YouthProfile
            {
                UserId = userId,
                DateOfBirth = profileDto.DateOfBirth,
                City = profileDto.City,
                Bio = profileDto.Bio,
                HourlyRate = profileDto.HourlyRate,
                AllowedCategories = profileDto.AllowedCategories
            };

            _context.YouthProfiles.Add(youthProfile);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Created youth profile for user: {UserId}", userId);

            return profileDto with { UserId = userId };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating youth profile for user: {UserId}", userId);
            throw;
        }
    }

    public async Task<YouthProfileDto?> GetYouthProfileAsync(Guid userId)
    {
        try
        {
            var profile = await _context.YouthProfiles
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (profile == null) return null;

            return new YouthProfileDto
            {
                UserId = profile.UserId,
                DateOfBirth = profile.DateOfBirth,
                City = profile.City,
                Bio = profile.Bio,
                HourlyRate = profile.HourlyRate,
                AllowedCategories = profile.AllowedCategories
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting youth profile for user: {UserId}", userId);
            throw;
        }
    }

    public async Task<YouthProfileDto> UpdateYouthProfileAsync(Guid userId, YouthProfileDto profileDto)
    {
        try
        {
            var profile = await _context.YouthProfiles.FindAsync(userId);
            if (profile == null)
            {
                throw new ArgumentException("Youth profile not found");
            }

            profile.DateOfBirth = profileDto.DateOfBirth;
            profile.City = profileDto.City;
            profile.Bio = profileDto.Bio;
            profile.HourlyRate = profileDto.HourlyRate;
            profile.AllowedCategories = profileDto.AllowedCategories;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Updated youth profile for user: {UserId}", userId);

            return profileDto with { UserId = userId };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating youth profile for user: {UserId}", userId);
            throw;
        }
    }

    public async Task<GuardianDto> CreateGuardianRelationAsync(Guid guardianId, Guid youthId)
    {
        try
        {
            var guardianRelation = new Guardian
            {
                UserId = guardianId,
                YouthUserId = youthId,
                ConsentGiven = false
            };

            _context.Guardians.Add(guardianRelation);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Created guardian relation: {GuardianId} -> {YouthId}", guardianId, youthId);

            return new GuardianDto
            {
                Id = guardianRelation.Id,
                UserId = guardianRelation.UserId,
                YouthUserId = guardianRelation.YouthUserId,
                ConsentGiven = guardianRelation.ConsentGiven,
                ConsentAt = guardianRelation.ConsentAt
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating guardian relation: {GuardianId} -> {YouthId}", guardianId, youthId);
            throw;
        }
    }

    public async Task<bool> UpdateGuardianConsentAsync(Guid guardianId, bool consentGiven)
    {
        try
        {
            var guardian = await _context.Guardians.FindAsync(guardianId);
            if (guardian == null) return false;

            guardian.ConsentGiven = consentGiven;
            guardian.ConsentAt = consentGiven ? DateTime.UtcNow : null;

            await _context.SaveChangesAsync();

            _logger.LogInformation("Updated guardian consent: {GuardianId} -> {ConsentGiven}", guardianId, consentGiven);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating guardian consent: {GuardianId}", guardianId);
            throw;
        }
    }

    public async Task<IEnumerable<GuardianDto>> GetGuardiansForYouthAsync(Guid youthId)
    {
        try
        {
            var guardians = await _context.Guardians
                .Where(g => g.YouthUserId == youthId)
                .ToListAsync();

            return guardians.Select(g => new GuardianDto
            {
                Id = g.Id,
                UserId = g.UserId,
                YouthUserId = g.YouthUserId,
                ConsentGiven = g.ConsentGiven,
                ConsentAt = g.ConsentAt
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting guardians for youth: {YouthId}", youthId);
            throw;
        }
    }

    public async Task<IEnumerable<GuardianDto>> GetYouthsForGuardianAsync(Guid guardianId)
    {
        try
        {
            var youths = await _context.Guardians
                .Where(g => g.UserId == guardianId)
                .ToListAsync();

            return youths.Select(g => new GuardianDto
            {
                Id = g.Id,
                UserId = g.UserId,
                YouthUserId = g.YouthUserId,
                ConsentGiven = g.ConsentGiven,
                ConsentAt = g.ConsentAt
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting youths for guardian: {GuardianId}", guardianId);
            throw;
        }
    }
}
