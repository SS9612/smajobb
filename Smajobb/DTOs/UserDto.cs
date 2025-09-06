namespace Smajobb.DTOs;

public record UserRegistrationDto
{
    public string Email { get; init; } = string.Empty;
    public string Phone { get; init; } = string.Empty;
    public string DisplayName { get; init; } = string.Empty;
    public string Role { get; init; } = "customer";
}

public record UserLoginDto
{
    public string Email { get; init; } = string.Empty;
    public string Phone { get; init; } = string.Empty;
}

public record LoginRequest
{
    public string Email { get; init; } = string.Empty;
    public string Password { get; init; } = string.Empty;
}

public record UserProfileDto
{
    public Guid Id { get; init; }
    public string Email { get; init; } = string.Empty;
    public string Phone { get; init; } = string.Empty;
    public string DisplayName { get; init; } = string.Empty;
    public string Role { get; init; } = string.Empty;
    public DateTime CreatedAt { get; init; }
}

public record UserDto
{
    public Guid Id { get; init; }
    public string? Email { get; init; }
    public string? Phone { get; init; }
    public string? DisplayName { get; init; }
    public string Role { get; init; } = string.Empty;
    public string? BankIdSubject { get; init; }
    public DateTime CreatedAt { get; init; }
    public YouthProfileDto? YouthProfile { get; init; }
}

public record YouthProfileDto
{
    public Guid UserId { get; init; }
    public DateOnly? DateOfBirth { get; init; }
    public string? City { get; init; }
    public string? Bio { get; init; }
    public int? HourlyRate { get; init; }
    public string[] AllowedCategories { get; init; } = Array.Empty<string>();
}

public record GuardianDto
{
    public Guid Id { get; init; }
    public Guid UserId { get; init; }
    public Guid YouthUserId { get; init; }
    public bool ConsentGiven { get; init; }
    public DateTime? ConsentAt { get; init; }
}
