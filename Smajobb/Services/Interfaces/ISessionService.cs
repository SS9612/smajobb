using Smajobb.Models;

namespace Smajobb.Services.Interfaces;

public interface ISessionService
{
    Task<UserSession> CreateSessionAsync(Guid userId, string tokenHash, string? deviceInfo = null, string? ipAddress = null, string? userAgent = null);
    Task<UserSession?> GetSessionAsync(Guid sessionId);
    Task<UserSession?> GetSessionByTokenHashAsync(string tokenHash);
    Task<bool> ValidateSessionAsync(Guid sessionId);
    Task<bool> ValidateSessionByTokenAsync(string tokenHash);
    Task RevokeSessionAsync(Guid sessionId);
    Task RevokeAllUserSessionsAsync(Guid userId);
    Task CleanupExpiredSessionsAsync();
    Task<IEnumerable<UserSession>> GetUserSessionsAsync(Guid userId);
    Task UpdateSessionLastAccessedAsync(Guid sessionId);
}

public interface IRefreshTokenService
{
    Task<RefreshToken> GenerateRefreshTokenAsync(Guid userId, string? ipAddress = null);
    Task<RefreshToken?> GetRefreshTokenAsync(string token);
    Task<RefreshToken?> GetRefreshTokenByIdAsync(Guid id);
    Task RevokeRefreshTokenAsync(string token, string? ipAddress = null);
    Task RevokeAllUserRefreshTokensAsync(Guid userId, string? ipAddress = null);
    Task<RefreshToken> RotateRefreshTokenAsync(string token, string? ipAddress = null);
    Task CleanupExpiredRefreshTokensAsync();
    Task<IEnumerable<RefreshToken>> GetUserRefreshTokensAsync(Guid userId);
}
