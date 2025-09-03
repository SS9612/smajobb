using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Smajobb.Models;

public class Message
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    public Guid SenderId { get; set; }
    
    [Required]
    public Guid ReceiverId { get; set; }
    
    public Guid? BookingId { get; set; }
    
    [Required]
    [StringLength(2000)]
    public string Content { get; set; } = string.Empty;
    
    [StringLength(20)]
    public string Type { get; set; } = "text"; // 'text', 'image', 'file', 'system'
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ReadAt { get; set; }
    
    public bool IsRead { get; set; } = false;
    public bool IsDeleted { get; set; } = false;
    
    [StringLength(500)]
    public string? AttachmentUrl { get; set; }
    
    [StringLength(100)]
    public string? AttachmentName { get; set; }
    
    [StringLength(50)]
    public string? AttachmentType { get; set; }
    
    // Navigation properties
    [ForeignKey(nameof(SenderId))]
    public virtual User Sender { get; set; } = null!;
    
    [ForeignKey(nameof(ReceiverId))]
    public virtual User Receiver { get; set; } = null!;
    
    [ForeignKey(nameof(BookingId))]
    public virtual Booking? Booking { get; set; }
}
