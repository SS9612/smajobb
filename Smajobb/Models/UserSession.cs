using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Smajobb.Models;

public class UserSession
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    public Guid UserId { get; set; }
    
    [Required]
    [StringLength(500)]
    public string TokenHash { get; set; } = string.Empty;
    
    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? ExpiresAt { get; set; }
    
    public DateTime? LastAccessedAt { get; set; }
    
    [StringLength(50)]
    public string Status { get; set; } = "active"; // active, expired, revoked
    
    [StringLength(200)]
    public string? DeviceInfo { get; set; }
    
    [StringLength(45)]
    public string? IpAddress { get; set; }
    
    [StringLength(500)]
    public string? UserAgent { get; set; }
    
    // Navigation properties
    [ForeignKey(nameof(UserId))]
    public virtual User User { get; set; } = null!;
}

public class RefreshToken
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [Required]
    public Guid UserId { get; set; }
    
    [Required]
    [StringLength(500)]
    public string TokenHash { get; set; } = string.Empty;
    
    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    [Required]
    public DateTime ExpiresAt { get; set; }
    
    public DateTime? RevokedAt { get; set; }
    
    [StringLength(200)]
    public string? RevokedByIp { get; set; }
    
    [StringLength(200)]
    public string? ReplacedByToken { get; set; }
    
    public bool IsExpired => DateTime.UtcNow >= ExpiresAt;
    public bool IsRevoked => RevokedAt.HasValue;
    public bool IsActive => !IsRevoked && !IsExpired;
    
    // Navigation properties
    [ForeignKey(nameof(UserId))]
    public virtual User User { get; set; } = null!;
}
