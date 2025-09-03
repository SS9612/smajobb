using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Smajobb.Models;

public class UserSkill
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    public Guid UserId { get; set; }
    
    [Required]
    public Guid SkillId { get; set; }
    
    [Range(1, 5)]
    public int ProficiencyLevel { get; set; } = 1; // 1-5 scale
    
    public bool IsVerified { get; set; } = false;
    public DateTime? VerifiedAt { get; set; }
    public Guid? VerifiedBy { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    // Navigation properties
    [ForeignKey(nameof(UserId))]
    public virtual User User { get; set; } = null!;
    
    [ForeignKey(nameof(SkillId))]
    public virtual Skill Skill { get; set; } = null!;
    
    [ForeignKey(nameof(VerifiedBy))]
    public virtual User? Verifier { get; set; }
}
