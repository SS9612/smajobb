using System.ComponentModel.DataAnnotations;

namespace Smajobb.DTOs;

public class PaymentDto
{
    public Guid Id { get; set; }
    
    [Required]
    public Guid BookingId { get; set; }
    
    [Required]
    public Guid FromUserId { get; set; }
    
    [Required]
    public Guid ToUserId { get; set; }
    
    [Required]
    [Range(0, double.MaxValue)]
    public decimal Amount { get; set; }
    
    [StringLength(50)]
    public string Type { get; set; } = string.Empty; // 'payment', 'refund', 'commission'
    
    [StringLength(50)]
    public string Status { get; set; } = "pending";
    
    [StringLength(100)]
    public string? PaymentMethod { get; set; }
    
    [StringLength(200)]
    public string? TransactionId { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime? ProcessedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    
    // Additional fields
    public string? Description { get; set; }
    public string? FailureReason { get; set; }
    public decimal? CommissionAmount { get; set; }
    public decimal? NetAmount { get; set; }
    public string? Currency { get; set; } = "SEK";
    
    // Navigation properties
    public BookingDto? Booking { get; set; }
    public UserDto? FromUser { get; set; }
    public UserDto? ToUser { get; set; }
}

public class PaymentSearchDto
{
    public Guid? BookingId { get; set; }
    public Guid? FromUserId { get; set; }
    public Guid? ToUserId { get; set; }
    public string? Type { get; set; }
    public string? Status { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public decimal? MinAmount { get; set; }
    public decimal? MaxAmount { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string? SortBy { get; set; } = "createdAt";
    public string? SortOrder { get; set; } = "desc";
}

public class PaymentSummaryDto
{
    public decimal TotalEarnings { get; set; }
    public decimal TotalPayments { get; set; }
    public decimal TotalCommissions { get; set; }
    public decimal PendingAmount { get; set; }
    public int TotalTransactions { get; set; }
    public int PendingTransactions { get; set; }
    public List<PaymentSummaryByMonthDto>? MonthlyBreakdown { get; set; }
}

public class PaymentSummaryByMonthDto
{
    public int Year { get; set; }
    public int Month { get; set; }
    public decimal Earnings { get; set; }
    public decimal Payments { get; set; }
    public decimal Commissions { get; set; }
    public int TransactionCount { get; set; }
}
