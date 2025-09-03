using Smajobb.DTOs;

namespace Smajobb.Services.Interfaces;

public interface IPaymentService
{
    Task<PaymentIntentDto> CreatePaymentIntentAsync(Guid bookingId, int amountCents);
    Task<bool> ConfirmPaymentAsync(string paymentIntentId);
    Task<bool> CancelPaymentAsync(string paymentIntentId);
    Task<DTOs.PaymentDto?> GetPaymentByIdAsync(Guid paymentId);
    Task<IEnumerable<DTOs.PaymentDto>> GetPaymentsByBookingAsync(Guid bookingId);
    Task<IEnumerable<DTOs.PaymentDto>> GetPaymentsByUserAsync(Guid userId, string? type = null, DateTime? fromDate = null, DateTime? toDate = null);
    Task<IEnumerable<DTOs.PaymentDto>> GetPaymentsAsync(PaymentSearchDto searchDto);
    Task<DTOs.PaymentDto> UpdatePaymentAsync(Guid id, DTOs.PaymentDto paymentDto);
    Task<bool> DeletePaymentAsync(Guid id);
    Task<bool> UpdatePaymentStatusAsync(Guid id, string status);
    Task<PaymentSummaryDto> GetPaymentSummaryAsync(Guid userId, DateTime? fromDate = null, DateTime? toDate = null);
    
    // Payment processing
    Task<bool> ProcessPaymentAsync(Guid paymentId);
    Task<bool> RefundPaymentAsync(Guid paymentId, int refundAmountCents);
    
    // Fee calculations
    Task<int> CalculatePlatformFeeAsync(int amountCents);
    Task<int> CalculateTotalAmountAsync(int baseAmountCents);
}

