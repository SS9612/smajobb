using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Smajobb.Models;

public class YouthProfile
{
    [Key]
    public Guid UserId { get; set; }
    
    public DateOnly? DateOfBirth { get; set; }
    
    public string? City { get; set; }
    
    public string? Bio { get; set; }
    
    public int? HourlyRate { get; set; }
    
    public string[] AllowedCategories { get; set; } = Array.Empty<string>();
    
    // Navigation property
    [ForeignKey(nameof(UserId))]
    public virtual User User { get; set; } = null!;
}
