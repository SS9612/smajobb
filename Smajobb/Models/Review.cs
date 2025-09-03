using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Smajobb.Models;

public class Review
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    public Guid BookingId { get; set; }
    
    [Required]
    public Guid ReviewerId { get; set; }
    
    [Required]
    public Guid RevieweeId { get; set; }
    
    [Required]
    [Range(1, 5)]
    public int Rating { get; set; }
    
    [StringLength(1000)]
    public string? Comment { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    public bool IsPublic { get; set; } = true;
    public bool IsVerified { get; set; } = false;
    
    // Navigation properties
    [ForeignKey(nameof(BookingId))]
    public virtual Booking Booking { get; set; } = null!;
    
    [ForeignKey(nameof(ReviewerId))]
    public virtual User Reviewer { get; set; } = null!;
    
    [ForeignKey(nameof(RevieweeId))]
    public virtual User Reviewee { get; set; } = null!;
}
