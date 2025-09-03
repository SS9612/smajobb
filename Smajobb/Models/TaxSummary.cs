using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Smajobb.Models;

public class TaxSummary
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    public int Year { get; set; }
    
    [Required]
    public Guid CustomerId { get; set; }
    
    [Required]
    public Guid YouthId { get; set; }
    
    // Navigation properties
    [ForeignKey(nameof(CustomerId))]
    public virtual User Customer { get; set; } = null!;
    
    [ForeignKey(nameof(YouthId))]
    public virtual User Youth { get; set; } = null!;
}
