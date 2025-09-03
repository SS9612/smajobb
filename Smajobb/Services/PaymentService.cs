using Microsoft.EntityFrameworkCore;
using Smajobb.Data;
using Smajobb.DTOs;
using Smajobb.Models;
using Smajobb.Services.Interfaces;

namespace Smajobb.Services;

public class PaymentService : IPaymentService
{
    private readonly SmajobbDbContext _db;

    public PaymentService(SmajobbDbContext db)
    {
        _db = db;
    }

    public async Task<PaymentIntentDto> CreatePaymentIntentAsync(Guid bookingId, int amountCents)
    {
        // In a real integration you'd call a PSP like Stripe/Klarna/Swish.
        // Here we create a pending Payment and return a mock intent.
        var booking = await _db.Bookings.AsNoTracking().FirstOrDefaultAsync(b => b.Id == bookingId)
            ?? throw new ArgumentException("Booking not found");

        // Determine payer/payee based on booking
        var fromUserId = booking.CustomerId;
        var toUserId = booking.YouthId;

        var amount = (decimal)amountCents / 100m;
        var platformFee = Math.Round(amount * 0.1m, 2); // 10% platform fee placeholder
        var netAmount = amount - platformFee;

        var payment = new Payment
        {
            BookingId = booking.Id,
            FromUserId = fromUserId,
            ToUserId = toUserId,
            Amount = amount,
            CommissionAmount = platformFee,
            NetAmount = netAmount,
            Status = "pending",
            Currency = "SEK",
            Description = $"Payment for booking {booking.Id}"
        };

        _db.Payments.Add(payment);
        await _db.SaveChangesAsync();

        return new PaymentIntentDto
        {
            PaymentIntentId = payment.Id.ToString(),
            ClientSecret = Guid.NewGuid().ToString("N"),
            AmountCents = amountCents,
            Currency = "SEK",
            Status = "requires_confirmation"
        };
    }

    public async Task<bool> ConfirmPaymentAsync(string paymentIntentId)
    {
        if (!Guid.TryParse(paymentIntentId, out var id)) return false;
        var payment = await _db.Payments.FirstOrDefaultAsync(p => p.Id == id);
        if (payment == null) return false;

        payment.Status = "completed";
        payment.ProcessedAt = DateTime.UtcNow;
        payment.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> CancelPaymentAsync(string paymentIntentId)
    {
        if (!Guid.TryParse(paymentIntentId, out var id)) return false;
        var payment = await _db.Payments.FirstOrDefaultAsync(p => p.Id == id);
        if (payment == null) return false;

        payment.Status = "cancelled";
        payment.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<PaymentDto?> GetPaymentByIdAsync(Guid paymentId)
    {
        var p = await _db.Payments.AsNoTracking().FirstOrDefaultAsync(x => x.Id == paymentId);
        return p is null ? null : Map(p);
    }

    public async Task<IEnumerable<PaymentDto>> GetPaymentsByBookingAsync(Guid bookingId)
    {
        var list = await _db.Payments.AsNoTracking().Where(p => p.BookingId == bookingId).OrderByDescending(p => p.CreatedAt).ToListAsync();
        return list.Select(Map);
    }

    public async Task<IEnumerable<PaymentDto>> GetPaymentsByUserAsync(Guid userId, string? type = null, DateTime? fromDate = null, DateTime? toDate = null)
    {
        var query = _db.Payments.AsNoTracking()
            .Where(p => p.FromUserId == userId || p.ToUserId == userId);

        if (!string.IsNullOrEmpty(type))
            query = query.Where(p => p.Type == type);
        
        if (fromDate.HasValue)
            query = query.Where(p => p.CreatedAt >= fromDate.Value);
            
        if (toDate.HasValue)
            query = query.Where(p => p.CreatedAt <= toDate.Value);

        var list = await query.OrderByDescending(p => p.CreatedAt).ToListAsync();
        return list.Select(Map);
    }

    public async Task<IEnumerable<PaymentDto>> GetPaymentsAsync(PaymentSearchDto searchDto)
    {
        var query = _db.Payments.AsNoTracking().AsQueryable();

        if (searchDto.BookingId.HasValue)
            query = query.Where(p => p.BookingId == searchDto.BookingId.Value);
        if (searchDto.FromUserId.HasValue)
            query = query.Where(p => p.FromUserId == searchDto.FromUserId.Value);
        if (searchDto.ToUserId.HasValue)
            query = query.Where(p => p.ToUserId == searchDto.ToUserId.Value);
        if (!string.IsNullOrEmpty(searchDto.Type))
            query = query.Where(p => p.Type == searchDto.Type);
        if (!string.IsNullOrEmpty(searchDto.Status))
            query = query.Where(p => p.Status == searchDto.Status);
        if (searchDto.FromDate.HasValue)
            query = query.Where(p => p.CreatedAt >= searchDto.FromDate.Value);
        if (searchDto.ToDate.HasValue)
            query = query.Where(p => p.CreatedAt <= searchDto.ToDate.Value);
        if (searchDto.MinAmount.HasValue)
            query = query.Where(p => p.Amount >= searchDto.MinAmount.Value);
        if (searchDto.MaxAmount.HasValue)
            query = query.Where(p => p.Amount <= searchDto.MaxAmount.Value);

        var list = await query.OrderByDescending(p => p.CreatedAt)
            .Skip((searchDto.Page - 1) * searchDto.PageSize)
            .Take(searchDto.PageSize)
            .ToListAsync();
        return list.Select(Map);
    }

    public async Task<PaymentDto> UpdatePaymentAsync(Guid id, PaymentDto paymentDto)
    {
        var payment = await _db.Payments.FirstOrDefaultAsync(p => p.Id == id);
        if (payment == null) throw new ArgumentException("Payment not found");

        payment.Status = paymentDto.Status;
        payment.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return Map(payment);
    }

    public async Task<bool> DeletePaymentAsync(Guid id)
    {
        var payment = await _db.Payments.FirstOrDefaultAsync(p => p.Id == id);
        if (payment == null) return false;

        _db.Payments.Remove(payment);
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UpdatePaymentStatusAsync(Guid id, string status)
    {
        var payment = await _db.Payments.FirstOrDefaultAsync(p => p.Id == id);
        if (payment == null) return false;

        payment.Status = status;
        payment.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<PaymentSummaryDto> GetPaymentSummaryAsync(Guid userId, DateTime? fromDate = null, DateTime? toDate = null)
    {
        var query = _db.Payments.AsNoTracking()
            .Where(p => p.FromUserId == userId || p.ToUserId == userId);

        if (fromDate.HasValue)
            query = query.Where(p => p.CreatedAt >= fromDate.Value);
        if (toDate.HasValue)
            query = query.Where(p => p.CreatedAt <= toDate.Value);

        var payments = await query.ToListAsync();
        
        return new PaymentSummaryDto
        {
            TotalEarnings = payments.Where(p => p.ToUserId == userId).Sum(p => p.Amount),
            TotalPayments = payments.Where(p => p.FromUserId == userId).Sum(p => p.Amount),
            TotalCommissions = payments.Sum(p => p.CommissionAmount ?? 0),
            PendingAmount = payments.Where(p => p.Status == "pending").Sum(p => p.Amount),
            TotalTransactions = payments.Count,
            PendingTransactions = payments.Count(p => p.Status == "pending")
        };
    }

    public async Task<bool> ProcessPaymentAsync(Guid paymentId)
    {
        var p = await _db.Payments.FirstOrDefaultAsync(x => x.Id == paymentId);
        if (p == null) return false;
        p.Status = "processing";
        p.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> RefundPaymentAsync(Guid paymentId, int refundAmountCents)
    {
        var p = await _db.Payments.FirstOrDefaultAsync(x => x.Id == paymentId);
        if (p == null) return false;
        p.Status = "refunded";
        p.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return true;
    }

    public Task<int> CalculatePlatformFeeAsync(int amountCents)
    {
        var fee = (int)Math.Round(amountCents * 0.1m, MidpointRounding.AwayFromZero); // 10%
        return Task.FromResult(fee);
    }

    public Task<int> CalculateTotalAmountAsync(int baseAmountCents)
    {
        return Task.FromResult(baseAmountCents);
    }

    private static PaymentDto Map(Payment p) => new PaymentDto
    {
        Id = p.Id,
        BookingId = p.BookingId,
        FromUserId = p.FromUserId,
        ToUserId = p.ToUserId,
        Amount = p.Amount,
        Type = p.Type,
        Status = p.Status,
        PaymentMethod = p.PaymentMethod,
        TransactionId = p.TransactionId,
        CreatedAt = p.CreatedAt,
        ProcessedAt = p.ProcessedAt,
        UpdatedAt = p.UpdatedAt,
        Description = p.Description,
        FailureReason = p.FailureReason,
        CommissionAmount = p.CommissionAmount,
        NetAmount = p.NetAmount,
        Currency = p.Currency
    };
}


