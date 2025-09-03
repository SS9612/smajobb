using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Smajobb.Models;

public class UserCategoryPreference
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    public Guid UserId { get; set; }
    
    [Required]
    public Guid CategoryId { get; set; }
    
    public bool IsPreferred { get; set; } = true;
    public int Priority { get; set; } = 0; // Higher number = higher priority
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    // Navigation properties
    [ForeignKey(nameof(UserId))]
    public virtual User User { get; set; } = null!;
    
    [ForeignKey(nameof(CategoryId))]
    public virtual JobCategory Category { get; set; } = null!;
}
