using Smajobb.DTOs;
using Smajobb.Models;

namespace Smajobb.Services.Interfaces;

public interface IBookingService
{
    Task<BookingDto> CreateBookingAsync(CreateBookingDto createBookingDto, Guid customerId);
    Task<BookingDto?> GetBookingByIdAsync(Guid bookingId);
    Task<IEnumerable<BookingDto>> GetBookingsByCustomerAsync(Guid customerId);
    Task<IEnumerable<BookingDto>> GetBookingsByYouthAsync(Guid youthId);
    Task<BookingDto> UpdateBookingStatusAsync(Guid bookingId, UpdateBookingStatusDto updateDto, Guid userId);
    Task<bool> CancelBookingAsync(Guid bookingId, Guid userId);
    
    // Availability operations
    Task<bool> CheckAvailabilityAsync(Guid youthId, DateTime startTime, DateTime endTime);
    Task<IEnumerable<TimeSlot>> GetAvailableTimeSlotsAsync(Guid youthId, DateTime date);
    Task<bool> ReserveTimeSlotAsync(Guid youthId, DateTime startTime, DateTime endTime);
}

public record TimeSlot
{
    public DateTime StartTime { get; init; }
    public DateTime EndTime { get; init; }
    public bool IsAvailable { get; init; }
}
