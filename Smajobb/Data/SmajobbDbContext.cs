using Microsoft.EntityFrameworkCore;
using Smajobb.Models;

namespace Smajobb.Data;

public class SmajobbDbContext : DbContext
{
    public SmajobbDbContext(DbContextOptions<SmajobbDbContext> options) : base(options)
    {
    }

    // Core entities
    public DbSet<User> Users { get; set; }
    public DbSet<Guardian> Guardians { get; set; }
    public DbSet<YouthProfile> YouthProfiles { get; set; }
    public DbSet<UserSession> UserSessions { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    
    // Job-related entities
    public DbSet<Job> Jobs { get; set; }
    public DbSet<JobCategory> JobCategories { get; set; }
    public DbSet<JobApplication> JobApplications { get; set; }
    public DbSet<JobImage> JobImages { get; set; }
    public DbSet<JobTag> JobTags { get; set; }
    
    // Booking and work entities
    public DbSet<Booking> Bookings { get; set; }
    public DbSet<WorkSession> WorkSessions { get; set; }
    
    // Payment entities
    public DbSet<Payment> Payments { get; set; }
    public DbSet<TaxSummary> TaxSummaries { get; set; }
    
    // Communication entities
    public DbSet<Message> Messages { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    
    // Review and rating entities
    public DbSet<Review> Reviews { get; set; }
    
    // Media entities
    public DbSet<Media> Media { get; set; }
    
    // Skill and preference entities
    public DbSet<Skill> Skills { get; set; }
    public DbSet<UserSkill> UserSkills { get; set; }
    public DbSet<UserCategoryPreference> UserCategoryPreferences { get; set; }
    public DbSet<Availability> Availabilities { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure User entity
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(e => e.Email).IsUnique();
            entity.HasIndex(e => e.BankIdSubject).IsUnique();
            
            entity.Property(e => e.Role)
                .HasConversion<string>()
                .HasMaxLength(20);
        });

        // Configure UserSession entity
        modelBuilder.Entity<UserSession>(entity =>
        {
            entity.HasOne(d => d.User)
                .WithMany(p => p.Sessions)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure RefreshToken entity
        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.HasOne(d => d.User)
                .WithMany(p => p.RefreshTokens)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure Guardian entity
        modelBuilder.Entity<Guardian>(entity =>
        {
            entity.HasOne(d => d.User)
                .WithMany(p => p.GuardianRelations)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(d => d.YouthUser)
                .WithMany(p => p.YouthRelations)
                .HasForeignKey(d => d.YouthUserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure YouthProfile entity
        modelBuilder.Entity<YouthProfile>(entity =>
        {
            entity.HasOne(d => d.User)
                .WithOne(p => p.YouthProfile)
                .HasForeignKey<YouthProfile>(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.Property(e => e.AllowedCategories)
                .HasColumnType("text[]");
        });

        // Configure Job entity
        modelBuilder.Entity<Job>(entity =>
        {
            entity.HasOne(d => d.Creator)
                .WithMany(p => p.CreatedJobs)
                .HasForeignKey(d => d.CreatorId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.Property(e => e.PriceType)
                .HasConversion<string>()
                .HasMaxLength(20);

            entity.Property(e => e.Status)
                .HasConversion<string>()
                .HasMaxLength(20);
        });

        // Configure JobApplication entity
        modelBuilder.Entity<JobApplication>(entity =>
        {
            entity.HasOne(d => d.Job)
                .WithMany(p => p.Applications)
                .HasForeignKey(d => d.JobId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(d => d.Youth)
                .WithMany(p => p.JobApplications)
                .HasForeignKey(d => d.YouthId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure JobImage entity
        modelBuilder.Entity<JobImage>(entity =>
        {
            entity.HasOne(d => d.Job)
                .WithMany(p => p.Images)
                .HasForeignKey(d => d.JobId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure JobTag entity
        modelBuilder.Entity<JobTag>(entity =>
        {
            entity.HasOne(d => d.Job)
                .WithMany(p => p.Tags)
                .HasForeignKey(d => d.JobId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure Booking entity
        modelBuilder.Entity<Booking>(entity =>
        {
            entity.HasOne(d => d.Job)
                .WithMany(p => p.Bookings)
                .HasForeignKey(d => d.JobId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(d => d.Youth)
                .WithMany(p => p.YouthBookings)
                .HasForeignKey(d => d.YouthId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(d => d.Customer)
                .WithMany(p => p.CustomerBookings)
                .HasForeignKey(d => d.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(d => d.RecurringBooking)
                .WithMany(p => p.RecurringBookings)
                .HasForeignKey(d => d.RecurringBookingId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.Property(e => e.Status)
                .HasConversion<string>()
                .HasMaxLength(20);
        });

        // Configure WorkSession entity
        modelBuilder.Entity<WorkSession>(entity =>
        {
            entity.HasOne(d => d.Booking)
                .WithMany(p => p.WorkSessions)
                .HasForeignKey(d => d.BookingId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(d => d.Youth)
                .WithMany(p => p.WorkSessions)
                .HasForeignKey(d => d.YouthId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(d => d.Verifier)
                .WithMany()
                .HasForeignKey(d => d.VerifiedBy)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Configure Payment entity
        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasOne(d => d.Booking)
                .WithMany(p => p.Payments)
                .HasForeignKey(d => d.BookingId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(d => d.FromUser)
                .WithMany(p => p.SentPayments)
                .HasForeignKey(d => d.FromUserId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(d => d.ToUser)
                .WithMany(p => p.ReceivedPayments)
                .HasForeignKey(d => d.ToUserId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.Property(e => e.Status)
                .HasConversion<string>()
                .HasMaxLength(20);
        });

        // Configure TaxSummary entity
        modelBuilder.Entity<TaxSummary>(entity =>
        {
            entity.HasOne(d => d.Customer)
                .WithMany()
                .HasForeignKey(d => d.CustomerId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(d => d.Youth)
                .WithMany()
                .HasForeignKey(d => d.YouthId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Configure Message entity
        modelBuilder.Entity<Message>(entity =>
        {
            entity.HasOne(d => d.Sender)
                .WithMany(p => p.SentMessages)
                .HasForeignKey(d => d.SenderId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(d => d.Receiver)
                .WithMany(p => p.ReceivedMessages)
                .HasForeignKey(d => d.ReceiverId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(d => d.Booking)
                .WithMany(p => p.Messages)
                .HasForeignKey(d => d.BookingId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Configure Notification entity
        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasOne(d => d.User)
                .WithMany(p => p.Notifications)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure Review entity
        modelBuilder.Entity<Review>(entity =>
        {
            entity.HasOne(d => d.Booking)
                .WithMany(p => p.Reviews)
                .HasForeignKey(d => d.BookingId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(d => d.Reviewer)
                .WithMany(p => p.GivenReviews)
                .HasForeignKey(d => d.ReviewerId)
                .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(d => d.Reviewee)
                .WithMany(p => p.ReceivedReviews)
                .HasForeignKey(d => d.RevieweeId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Configure Skill entity
        modelBuilder.Entity<Skill>(entity =>
        {
            entity.HasOne(d => d.Category)
                .WithMany(p => p.Skills)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);
        });

        // Configure UserSkill entity
        modelBuilder.Entity<UserSkill>(entity =>
        {
            entity.HasOne(d => d.User)
                .WithMany(p => p.UserSkills)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(d => d.Skill)
                .WithMany(p => p.UserSkills)
                .HasForeignKey(d => d.SkillId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(d => d.Verifier)
                .WithMany()
                .HasForeignKey(d => d.VerifiedBy)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure composite primary key
            entity.HasKey(us => new { us.UserId, us.SkillId });
        });

        // Configure UserCategoryPreference entity
        modelBuilder.Entity<UserCategoryPreference>(entity =>
        {
            entity.HasOne(d => d.User)
                .WithMany(p => p.CategoryPreferences)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(d => d.Category)
                .WithMany(p => p.UserPreferences)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure composite primary key
            entity.HasKey(ucp => new { ucp.UserId, ucp.CategoryId });
        });

        // Configure Availability entity
        modelBuilder.Entity<Availability>(entity =>
        {
            entity.HasOne(d => d.User)
                .WithMany(p => p.Availabilities)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Configure indexes for better performance
        modelBuilder.Entity<Job>()
            .HasIndex(j => j.Status);
        
        modelBuilder.Entity<Job>()
            .HasIndex(j => j.Category);
        
        modelBuilder.Entity<Job>()
            .HasIndex(j => j.CreatedAt);
        
        modelBuilder.Entity<Booking>()
            .HasIndex(b => b.Status);
        
        modelBuilder.Entity<Booking>()
            .HasIndex(b => b.CreatedAt);
        
        modelBuilder.Entity<Message>()
            .HasIndex(m => new { m.SenderId, m.ReceiverId });
        
        modelBuilder.Entity<Message>()
            .HasIndex(m => m.CreatedAt);
        
        modelBuilder.Entity<Notification>()
            .HasIndex(n => new { n.UserId, n.IsRead });
        
        modelBuilder.Entity<Notification>()
            .HasIndex(n => n.CreatedAt);
        
        modelBuilder.Entity<Review>()
            .HasIndex(r => r.RevieweeId);
        
        modelBuilder.Entity<Review>()
            .HasIndex(r => r.CreatedAt);
        
        // Configure Media entity
        modelBuilder.Entity<Media>(entity =>
        {
            entity.HasOne(d => d.Uploader)
                .WithMany()
                .HasForeignKey(d => d.UploadedBy)
                .OnDelete(DeleteBehavior.Restrict);
        });
        
        modelBuilder.Entity<Media>()
            .HasIndex(m => new { m.EntityType, m.EntityId });
        
        modelBuilder.Entity<Media>()
            .HasIndex(m => m.CreatedAt);
    }
}
