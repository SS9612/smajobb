using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Smajobb.Models
{
    public class AnalyticsEvent
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid UserId { get; set; }

        [Required]
        [StringLength(100)]
        public string EventType { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string EventName { get; set; } = string.Empty;

        [StringLength(1000)]
        public string? Description { get; set; }

        [StringLength(2000)]
        public string? Properties { get; set; } // JSON properties

        [StringLength(50)]
        public string? Category { get; set; }

        [StringLength(50)]
        public string? Action { get; set; }

        [StringLength(200)]
        public string? Label { get; set; }

        public int? Value { get; set; }

        [StringLength(100)]
        public string? SessionId { get; set; }

        [StringLength(100)]
        public string? PageUrl { get; set; }

        [StringLength(100)]
        public string? Referrer { get; set; }

        [StringLength(50)]
        public string? UserAgent { get; set; }

        [StringLength(45)]
        public string? IpAddress { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [ForeignKey(nameof(UserId))]
        public virtual User User { get; set; } = null!;
    }

    public class SystemMetric
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [StringLength(100)]
        public string MetricName { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string MetricType { get; set; } = string.Empty; // counter, gauge, histogram, summary

        public double Value { get; set; }

        [StringLength(1000)]
        public string? Labels { get; set; } // JSON labels

        [StringLength(200)]
        public string? Description { get; set; }

        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        [StringLength(50)]
        public string? Source { get; set; } // api, frontend, database, etc.
    }

    public class ErrorLog
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [StringLength(100)]
        public string ErrorType { get; set; } = string.Empty;

        [Required]
        [StringLength(200)]
        public string ErrorMessage { get; set; } = string.Empty;

        [StringLength(5000)]
        public string? StackTrace { get; set; }

        [StringLength(200)]
        public string? Source { get; set; }

        [StringLength(100)]
        public string? Method { get; set; }

        [StringLength(200)]
        public string? RequestUrl { get; set; }

        [StringLength(50)]
        public string? RequestMethod { get; set; }

        public Guid? UserId { get; set; }

        [StringLength(100)]
        public string? SessionId { get; set; }

        [StringLength(45)]
        public string? IpAddress { get; set; }

        [StringLength(50)]
        public string? UserAgent { get; set; }

        [StringLength(1000)]
        public string? AdditionalData { get; set; } // JSON additional data

        [StringLength(20)]
        public string Severity { get; set; } = "error"; // error, warning, info, debug

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool IsResolved { get; set; } = false;

        public DateTime? ResolvedAt { get; set; }

        [ForeignKey(nameof(UserId))]
        public virtual User? User { get; set; }
    }
}
