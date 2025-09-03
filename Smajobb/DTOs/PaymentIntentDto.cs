namespace Smajobb.DTOs;

public record PaymentIntentDto
{
    public string PaymentIntentId { get; init; } = string.Empty;
    public string ClientSecret { get; init; } = string.Empty;
    public int AmountCents { get; init; }
    public string Currency { get; init; } = "SEK";
    public string Status { get; init; } = "requires_confirmation";
}


