using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Smajobb.Models;

public class User
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();
    
    [EmailAddress]
    [StringLength(255)]
    public string? Email { get; set; }
    
    [StringLength(20)]
    public string? Phone { get; set; }
    
    [StringLength(100)]
    public string? DisplayName { get; set; }
    
    [Required]
    [StringLength(20)]
    public string Role { get; set; } = "customer";
    
    [StringLength(50)]
    public string? BankIdSubject { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? LastLoginAt { get; set; }
    
    [StringLength(500)]
    public string? ProfileImageUrl { get; set; }
    
    [StringLength(1000)]
    public string? Bio { get; set; }
    
    [StringLength(100)]
    public string? City { get; set; }
    
    [StringLength(10)]
    public string? PostalCode { get; set; }
    
    public bool IsActive { get; set; } = true;
    public bool IsVerified { get; set; } = false;
    public bool EmailVerified { get; set; } = false;
    public bool PhoneVerified { get; set; } = false;
    
    // Navigation properties
    public virtual ICollection<Guardian> GuardianRelations { get; set; } = new List<Guardian>();
    public virtual ICollection<Guardian> YouthRelations { get; set; } = new List<Guardian>();
    public virtual YouthProfile? YouthProfile { get; set; }
    public virtual ICollection<Job> CreatedJobs { get; set; } = new List<Job>();
    public virtual ICollection<Booking> YouthBookings { get; set; } = new List<Booking>();
    public virtual ICollection<Booking> CustomerBookings { get; set; } = new List<Booking>();
    public virtual ICollection<WorkSession> WorkSessions { get; set; } = new List<WorkSession>();
    public virtual ICollection<Payment> SentPayments { get; set; } = new List<Payment>();
    public virtual ICollection<Payment> ReceivedPayments { get; set; } = new List<Payment>();
    public virtual ICollection<Review> GivenReviews { get; set; } = new List<Review>();
    public virtual ICollection<Review> ReceivedReviews { get; set; } = new List<Review>();
    public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();
    public virtual ICollection<UserSession> Sessions { get; set; } = new List<UserSession>();
    public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    public virtual ICollection<Message> SentMessages { get; set; } = new List<Message>();
    public virtual ICollection<Message> ReceivedMessages { get; set; } = new List<Message>();
    public virtual ICollection<JobApplication> JobApplications { get; set; } = new List<JobApplication>();
    public virtual ICollection<UserCategoryPreference> CategoryPreferences { get; set; } = new List<UserCategoryPreference>();
    public virtual ICollection<UserSkill> UserSkills { get; set; } = new List<UserSkill>();
    public virtual ICollection<Availability> Availabilities { get; set; } = new List<Availability>();
}
