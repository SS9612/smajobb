using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Smajobb.Models;

public class Skill
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;
    
    [StringLength(500)]
    public string? Description { get; set; }
    
    public Guid? CategoryId { get; set; }
    
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; } = 0;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    // Navigation properties
    [ForeignKey(nameof(CategoryId))]
    public virtual JobCategory? Category { get; set; }
    
    public virtual ICollection<UserSkill> UserSkills { get; set; } = new List<UserSkill>();
}
