using System.ComponentModel.DataAnnotations;

namespace Smajobb.DTOs;

public class CreateBookingDto
{
    [Required]
    public Guid JobId { get; set; }
    
    [Required]
    public Guid YouthId { get; set; }
    
    public DateTime? ScheduledStart { get; set; }
    public DateTime? ScheduledEnd { get; set; }
    
    public string? Notes { get; set; }
    public string? SpecialInstructions { get; set; }
}

public class UpdateBookingStatusDto
{
    [Required]
    [StringLength(50)]
    public string Status { get; set; } = string.Empty;
    
    public string? Reason { get; set; }
}
