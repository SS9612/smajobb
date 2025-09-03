using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Smajobb.Models;

public class Payment
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
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
    public string Status { get; set; } = "pending"; // pending, processing, completed, failed, cancelled, refunded
    
    [StringLength(100)]
    public string? PaymentMethod { get; set; }
    
    [StringLength(200)]
    public string? TransactionId { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ProcessedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    
    [StringLength(1000)]
    public string? Description { get; set; }
    
    [StringLength(500)]
    public string? FailureReason { get; set; }
    
    public decimal? CommissionAmount { get; set; }
    public decimal? NetAmount { get; set; }
    
    [StringLength(10)]
    public string Currency { get; set; } = "SEK";
    
    // Navigation properties
    [ForeignKey(nameof(BookingId))]
    public virtual Booking Booking { get; set; } = null!;
    
    [ForeignKey(nameof(FromUserId))]
    public virtual User FromUser { get; set; } = null!;
    
    [ForeignKey(nameof(ToUserId))]
    public virtual User ToUser { get; set; } = null!;
}
