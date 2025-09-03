using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Smajobb.Models;

public class JobCategory
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [StringLength(500)]
    public string? Description { get; set; }
    
    [StringLength(50)]
    public string? Icon { get; set; }
    
    [StringLength(7)]
    public string? Color { get; set; } // Hex color code
    
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; } = 0;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    // Navigation properties
    public virtual ICollection<Job> Jobs { get; set; } = new List<Job>();
    public virtual ICollection<UserCategoryPreference> UserPreferences { get; set; } = new List<UserCategoryPreference>();
    public virtual ICollection<Skill> Skills { get; set; } = new List<Skill>();
}
