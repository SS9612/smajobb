using Smajobb.Services.Interfaces;

namespace Smajobb.Services
{
    public class AlertingBackgroundService : BackgroundService
    {
        private readonly IAlertingService _alertingService;
        private readonly ILogger<AlertingBackgroundService> _logger;
        private readonly TimeSpan _checkInterval = TimeSpan.FromMinutes(5);

        public AlertingBackgroundService(IAlertingService alertingService, ILogger<AlertingBackgroundService> logger)
        {
            _alertingService = alertingService;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    _logger.LogDebug("Running alerting checks...");

                    // Run all alert checks in parallel
                    var tasks = new[]
                    {
                        _alertingService.CheckSystemHealthAlertsAsync(),
                        _alertingService.CheckPerformanceAlertsAsync(),
                        _alertingService.CheckErrorRateAlertsAsync()
                    };

                    await Task.WhenAll(tasks);

                    _logger.LogDebug("Alerting checks completed");
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error during alerting checks");
                }

                await Task.Delay(_checkInterval, stoppingToken);
            }
        }
    }
}
