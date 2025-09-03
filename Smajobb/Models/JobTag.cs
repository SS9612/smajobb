using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Smajobb.Models;

public class JobTag
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    public Guid JobId { get; set; }
    
    [Required]
    [StringLength(50)]
    public string Tag { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    [ForeignKey(nameof(JobId))]
    public virtual Job Job { get; set; } = null!;
}
