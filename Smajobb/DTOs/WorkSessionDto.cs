using System.ComponentModel.DataAnnotations;

namespace Smajobb.DTOs;

public class WorkSessionDto
{
    public Guid Id { get; set; }
    
    [Required]
    public Guid BookingId { get; set; }
    
    [Required]
    public Guid YouthId { get; set; }
    
    public DateTime? StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public decimal? Hours { get; set; }
    
    [StringLength(50)]
    public string Status { get; set; } = "scheduled";
    
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    
    // Additional fields
    public string? Notes { get; set; }
    public string? Location { get; set; }
    public bool IsVerified { get; set; } = false;
    public Guid? VerifiedBy { get; set; }
    public DateTime? VerifiedAt { get; set; }
    
    // Navigation properties
    public BookingDto? Booking { get; set; }
    public UserDto? Youth { get; set; }
}

public class WorkSessionSearchDto
{
    public Guid? BookingId { get; set; }
    public Guid? YouthId { get; set; }
    public string? Status { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public bool? IsVerified { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public string? SortBy { get; set; } = "createdAt";
    public string? SortOrder { get; set; } = "desc";
}
