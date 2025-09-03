using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Smajobb.Models;

public class Booking
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    public Guid JobId { get; set; }
    
    [Required]
    public Guid YouthId { get; set; }
    
    [Required]
    public Guid CustomerId { get; set; }
    
    public DateTime? ScheduledStart { get; set; }
    public DateTime? ScheduledEnd { get; set; }
    
    public decimal? ActualHours { get; set; }
    public decimal? TotalAmount { get; set; }
    public decimal? PlatformFee { get; set; }
    public decimal? YouthEarnings { get; set; }
    
    [StringLength(20)]
    public string Status { get; set; } = "booked"; // booked, confirmed, in_progress, completed, cancelled
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? ConfirmedAt { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public DateTime? CancelledAt { get; set; }
    
    [StringLength(1000)]
    public string? Notes { get; set; }
    
    [StringLength(1000)]
    public string? SpecialInstructions { get; set; }
    
    [StringLength(500)]
    public string? CancellationReason { get; set; }
    
    public bool IsRecurring { get; set; } = false;
    public Guid? RecurringBookingId { get; set; }
    
    // Navigation properties
    [ForeignKey(nameof(JobId))]
    public virtual Job Job { get; set; } = null!;
    
    [ForeignKey(nameof(YouthId))]
    public virtual User Youth { get; set; } = null!;
    
    [ForeignKey(nameof(CustomerId))]
    public virtual User Customer { get; set; } = null!;
    
    [ForeignKey(nameof(RecurringBookingId))]
    public virtual Booking? RecurringBooking { get; set; }
    
    public virtual ICollection<Booking> RecurringBookings { get; set; } = new List<Booking>();
    public virtual ICollection<WorkSession> WorkSessions { get; set; } = new List<WorkSession>();
    public virtual ICollection<Payment> Payments { get; set; } = new List<Payment>();
    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
    public virtual ICollection<Message> Messages { get; set; } = new List<Message>();
}
