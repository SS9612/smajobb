using Smajobb.DTOs;
using Smajobb.Models;

namespace Smajobb.Services.Interfaces;

public interface IWorkSessionService
{
    Task<WorkSessionDto> StartWorkSessionAsync(Guid bookingId, Guid youthId);
    Task<WorkSessionDto> EndWorkSessionAsync(Guid sessionId, Guid youthId);
    Task<WorkSessionDto?> GetWorkSessionByIdAsync(Guid sessionId);
    Task<IEnumerable<WorkSessionDto>> GetWorkSessionsByBookingAsync(Guid bookingId);
    Task<IEnumerable<WorkSessionDto>> GetWorkSessionsByYouthAsync(Guid youthId, DateTime? startDate = null, DateTime? endDate = null);
    
    // Timer operations
    Task<WorkSessionDto> PauseWorkSessionAsync(Guid sessionId, Guid youthId);
    Task<WorkSessionDto> ResumeWorkSessionAsync(Guid sessionId, Guid youthId);
    
    // Evidence operations
    Task<bool> AddProofMediaAsync(Guid sessionId, string mediaUrl, Guid youthId);
    Task<bool> AttestWorkSessionAsync(Guid sessionId, Guid customerId);
    
    // Time tracking
    Task<decimal> GetTotalWorkHoursAsync(Guid youthId, DateTime startDate, DateTime endDate);
    Task<decimal> GetWorkHoursForBookingAsync(Guid bookingId);
}
