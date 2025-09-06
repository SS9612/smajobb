using System.ComponentModel.DataAnnotations;

namespace Smajobb.DTOs;

public class JobDto
{
    public Guid Id { get; set; }
    
    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;
    
    [StringLength(2000)]
    public string? Description { get; set; }
    
    [Required]
    [StringLength(100)]
    public string Category { get; set; } = string.Empty;
    
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public string? Address { get; set; }
    
    [Required]
    public Guid CreatorId { get; set; }
    
    [Required]
    [StringLength(20)]
    public string PriceType { get; set; } = string.Empty; // 'hourly' or 'fixed'
    
    [Required]
    [Range(0, int.MaxValue)]
    public int Price { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime? StartsAt { get; set; }
    public DateTime? EndsAt { get; set; }
    
    [StringLength(50)]
    public string Status { get; set; } = "open";
    
    // Additional fields for job management
    public List<string>? RequiredSkills { get; set; }
    public int? EstimatedHours { get; set; }
    public string? Urgency { get; set; } // 'low', 'medium', 'high'
    public bool RequiresBackgroundCheck { get; set; } = false;
    public int? MinAge { get; set; }
    public int? MaxAge { get; set; }
}



public class JobCategoryDto
{
    public string Name { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? Icon { get; set; }
    public List<string>? Subcategories { get; set; }
    public int JobCount { get; set; }
}