using Smajobb.DTOs;
using Smajobb.Models;

namespace Smajobb.Services.Interfaces;

public interface ITaxService
{
    Task<TaxSummaryDto> GenerateYearlyTaxSummaryAsync(int year, Guid customerId, Guid youthId);
    Task<TaxSummaryDto?> GetTaxSummaryAsync(int year, Guid customerId, Guid youthId);
    Task<IEnumerable<TaxSummaryDto>> GetTaxSummariesByYearAsync(int year);
    Task<IEnumerable<TaxSummaryDto>> GetTaxSummariesByUserAsync(Guid userId);
    
    // KU export operations
    Task<byte[]> ExportKUFileAsync(int year, Guid customerId, Guid youthId);
    Task<byte[]> ExportYearlyKUFileAsync(int year);
    
    // Tax calculations
    Task<decimal> CalculateTotalEarningsAsync(Guid youthId, int year);
    Task<decimal> CalculateTotalPaymentsAsync(Guid customerId, int year);
    Task<decimal> CalculateTaxableAmountAsync(Guid youthId, int year);
}

public record TaxSummaryDto
{
    public Guid Id { get; init; }
    public int Year { get; init; }
    public Guid CustomerId { get; init; }
    public Guid YouthId { get; init; }
    public decimal TotalEarnings { get; init; }
    public decimal TotalPayments { get; init; }
    public decimal TaxableAmount { get; init; }
    public int TotalHours { get; init; }
    public int TotalJobs { get; init; }
}
