using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Smajobb.Models;

public class WorkSession
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    public Guid BookingId { get; set; }
    
    [Required]
    public Guid YouthId { get; set; }
    
    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public decimal? Hours { get; set; }
    
    [StringLength(50)]
    public string Status { get; set; } = "scheduled"; // scheduled, in_progress, paused, completed, cancelled
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    [StringLength(1000)]
    public string? Notes { get; set; }
    
    [StringLength(200)]
    public string? Location { get; set; }
    
    [StringLength(500)]
    public string? ProofMediaUrl { get; set; }
    
    public bool IsVerified { get; set; } = false;
    public Guid? VerifiedBy { get; set; }
    public DateTime? VerifiedAt { get; set; }
    
    public bool AttestedByCustomer { get; set; } = false;
    public DateTime? AttestedAt { get; set; }
    
    // Navigation properties
    [ForeignKey(nameof(BookingId))]
    public virtual Booking Booking { get; set; } = null!;
    
    [ForeignKey(nameof(YouthId))]
    public virtual User Youth { get; set; } = null!;
    
    [ForeignKey(nameof(VerifiedBy))]
    public virtual User? Verifier { get; set; }
}
