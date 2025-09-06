using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Smajobb.Models;

public class Media
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    
    [Required]
    [MaxLength(255)]
    public string FileName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(255)]
    public string OriginalFileName { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(100)]
    public string ContentType { get; set; } = string.Empty;
    
    public long FileSize { get; set; }
    
    [Required]
    [MaxLength(500)]
    public string FilePath { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(500)]
    public string Url { get; set; } = string.Empty;
    
    [MaxLength(500)]
    public string? ThumbnailUrl { get; set; }
    
    [MaxLength(255)]
    public string? AltText { get; set; }
    
    [MaxLength(1000)]
    public string? Description { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string EntityType { get; set; } = string.Empty; // job, user, message, etc.
    
    [Required]
    [MaxLength(50)]
    public string EntityId { get; set; } = string.Empty;
    
    [Required]
    public Guid UploadedBy { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    
    public bool IsPublic { get; set; } = true;
    public bool IsProcessed { get; set; } = false;
    
    [Column(TypeName = "jsonb")]
    public string? MetadataJson { get; set; }
    
    // Navigation properties
    [ForeignKey("UploadedBy")]
    public virtual User? Uploader { get; set; }
    
    // Helper property for metadata
    [NotMapped]
    public Dictionary<string, object>? Metadata
    {
        get => string.IsNullOrEmpty(MetadataJson) ? null : System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(MetadataJson);
        set => MetadataJson = value == null ? null : System.Text.Json.JsonSerializer.Serialize(value);
    }
}
