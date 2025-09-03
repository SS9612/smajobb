using Smajobb.DTOs;
using Smajobb.Models;

namespace Smajobb.Services.Interfaces;

public interface IUserService
{
    Task<UserProfileDto> CreateUserAsync(UserRegistrationDto registrationDto);
    Task<UserProfileDto?> GetUserByIdAsync(Guid userId);
    Task<UserProfileDto?> GetUserByEmailAsync(string email);
    Task<UserProfileDto?> GetUserByBankIdSubjectAsync(string bankIdSubject);
    Task<UserProfileDto> UpdateUserAsync(Guid userId, UserRegistrationDto updateDto);
    Task<bool> DeleteUserAsync(Guid userId);
    
    // Youth profile operations
    Task<YouthProfileDto> CreateYouthProfileAsync(Guid userId, YouthProfileDto profileDto);
    Task<YouthProfileDto?> GetYouthProfileAsync(Guid userId);
    Task<YouthProfileDto> UpdateYouthProfileAsync(Guid userId, YouthProfileDto profileDto);
    
    // Guardian operations
    Task<GuardianDto> CreateGuardianRelationAsync(Guid guardianId, Guid youthId);
    Task<bool> UpdateGuardianConsentAsync(Guid guardianId, bool consentGiven);
    Task<IEnumerable<GuardianDto>> GetGuardiansForYouthAsync(Guid youthId);
    Task<IEnumerable<GuardianDto>> GetYouthsForGuardianAsync(Guid guardianId);
}
