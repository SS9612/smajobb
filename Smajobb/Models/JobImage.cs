using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Smajobb.Models;

public class JobImage
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    public Guid JobId { get; set; }
    
    [Required]
    [StringLength(500)]
    public string ImageUrl { get; set; } = string.Empty;
    
    [StringLength(200)]
    public string? AltText { get; set; }
    
    [StringLength(50)]
    public string? ImageType { get; set; } // 'main', 'gallery', 'before', 'after'
    
    public int SortOrder { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    [ForeignKey(nameof(JobId))]
    public virtual Job Job { get; set; } = null!;
}
