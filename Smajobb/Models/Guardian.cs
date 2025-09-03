using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Smajobb.Models;

public class Guardian
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    public Guid UserId { get; set; }
    
    [Required]
    public Guid YouthUserId { get; set; }
    
    public bool ConsentGiven { get; set; } = false;
    
    public DateTime? ConsentAt { get; set; }
    
    // Navigation properties
    [ForeignKey(nameof(UserId))]
    public virtual User User { get; set; } = null!;
    
    [ForeignKey(nameof(YouthUserId))]
    public virtual User YouthUser { get; set; } = null!;
}
