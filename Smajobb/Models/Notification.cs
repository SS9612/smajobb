using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Smajobb.Models;

public class Notification
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    public Guid UserId { get; set; }
    
    [Required]
    [StringLength(100)]
    public string Type { get; set; } = string.Empty; // 'job_created', 'booking_request', 'payment_received', etc.
    
    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;
    
    [Required]
    [StringLength(1000)]
    public string Message { get; set; } = string.Empty;
    
    public bool IsRead { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ReadAt { get; set; }
    
    [StringLength(500)]
    public string? ActionUrl { get; set; }
    
    [StringLength(20)]
    public string Priority { get; set; } = "normal"; // 'low', 'normal', 'high', 'urgent'
    
    public DateTime? ExpiresAt { get; set; }
    
    [StringLength(1000)]
    public string? Data { get; set; } // JSON data for additional context
    
    // Navigation properties
    [ForeignKey(nameof(UserId))]
    public virtual User User { get; set; } = null!;
}
