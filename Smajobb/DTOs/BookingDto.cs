using System.ComponentModel.DataAnnotations;

namespace Smajobb.DTOs;

public class BookingDto
{
    public Guid Id { get; set; }
    
    [Required]
    public Guid JobId { get; set; }
    
    [Required]
    public Guid YouthId { get; set; }
    
    [Required]
    public Guid CustomerId { get; set; }
    
    public DateTime? ScheduledStart { get; set; }
    public DateTime? ScheduledEnd { get; set; }
    public decimal? ActualHours { get; set; }
    
    [StringLength(50)]
    public string Status { get; set; } = "booked";
    
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    
    // Additional fields
    public string? Notes { get; set; }
    public string? RejectionReason { get; set; }
    public decimal? AgreedPrice { get; set; }
    public string? SpecialInstructions { get; set; }
    
    // Navigation properties (for detailed responses)
    public JobDto? Job { get; set; }
    public UserDto? Youth { get; set; }
    public UserDto? Customer { get; set; }
}

public class BookingSearchDto
{
    public Guid? JobId { get; set; }
    public Guid? YouthId { get; set; }
    public Guid? CustomerId { get; set; }
    public string? Status { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string? SortBy { get; set; } = "createdAt";
    public string? SortOrder { get; set; } = "desc";
}