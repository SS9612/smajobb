using Smajobb.DTOs;

namespace Smajobb.Services.Interfaces;

public interface IAuthService
{
    Task<string> InitiateBankIdAuthenticationAsync(string personalNumber);
    Task<BankIdAuthResult> CompleteBankIdAuthenticationAsync(string orderRef);
    Task<string> GenerateJwtTokenAsync(Guid userId);
    Task<bool> ValidateJwtTokenAsync(string token);
    Task<Guid?> GetUserIdFromTokenAsync(string token);
}

public record BankIdAuthResult
{
    public bool Success { get; init; }
    public string? PersonalNumber { get; init; }
    public string? Name { get; init; }
    public string? ErrorMessage { get; init; }
}
