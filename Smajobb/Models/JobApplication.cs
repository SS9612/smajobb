using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Smajobb.Models;

public class JobApplication
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    public Guid JobId { get; set; }
    
    [Required]
    public Guid YouthId { get; set; }
    
    [StringLength(1000)]
    public string? CoverLetter { get; set; }
    
    [StringLength(20)]
    public string Status { get; set; } = "pending"; // pending, accepted, rejected, withdrawn
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? RespondedAt { get; set; }
    
    [StringLength(500)]
    public string? RejectionReason { get; set; }
    
    public int? ProposedPrice { get; set; }
    public DateTime? ProposedStartDate { get; set; }
    public DateTime? ProposedEndDate { get; set; }
    
    // Navigation properties
    [ForeignKey(nameof(JobId))]
    public virtual Job Job { get; set; } = null!;
    
    [ForeignKey(nameof(YouthId))]
    public virtual User Youth { get; set; } = null!;
}
