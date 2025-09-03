using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using NetTopologySuite.Geometries;

namespace Smajobb.Models;

public class Job
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;
    
    [StringLength(2000)]
    public string? Description { get; set; }
    
    [Required]
    [StringLength(100)]
    public string Category { get; set; } = string.Empty;
    
    public Point? Location { get; set; }
    
    [StringLength(200)]
    public string? Address { get; set; }
    
    [Required]
    public Guid CreatorId { get; set; }
    
    [Required]
    [StringLength(20)]
    public string PriceType { get; set; } = string.Empty; // 'hourly' or 'fixed'
    
    [Required]
    [Range(0, int.MaxValue)]
    public int Price { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    public DateTime? StartsAt { get; set; }
    public DateTime? EndsAt { get; set; }
    
    [StringLength(20)]
    public string Status { get; set; } = "open"; // open, in_progress, completed, cancelled
    
    [StringLength(20)]
    public string Urgency { get; set; } = "medium"; // low, medium, high
    
    public int? EstimatedHours { get; set; }
    public bool RequiresBackgroundCheck { get; set; } = false;
    public int? MinAge { get; set; }
    public int? MaxAge { get; set; }
    
    [StringLength(1000)]
    public string? RequiredSkills { get; set; }
    
    [StringLength(500)]
    public string? SpecialInstructions { get; set; }
    
    public int ViewCount { get; set; } = 0;
    public int ApplicationCount { get; set; } = 0;
    
    // Navigation properties
    [ForeignKey(nameof(CreatorId))]
    public virtual User Creator { get; set; } = null!;
    
    public virtual ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    public virtual ICollection<JobApplication> Applications { get; set; } = new List<JobApplication>();
    public virtual ICollection<JobImage> Images { get; set; } = new List<JobImage>();
    public virtual ICollection<JobTag> Tags { get; set; } = new List<JobTag>();
    public virtual ICollection<Review> Reviews { get; set; } = new List<Review>();
}
