using Smajobb.Services.Interfaces;
using Smajobb.DTOs;
using System.Diagnostics;

namespace Smajobb.Services
{
    public class SystemMetricsCollector : BackgroundService
    {
        private readonly IAnalyticsService _analyticsService;
        private readonly ILogger<SystemMetricsCollector> _logger;
        private readonly TimeSpan _collectionInterval = TimeSpan.FromMinutes(1);

        public SystemMetricsCollector(IAnalyticsService analyticsService, ILogger<SystemMetricsCollector> logger)
        {
            _analyticsService = analyticsService;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    await CollectSystemMetrics();
                    await Task.Delay(_collectionInterval, stoppingToken);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error collecting system metrics");
                    await Task.Delay(TimeSpan.FromMinutes(5), stoppingToken); // Wait longer on error
                }
            }
        }

        private async Task CollectSystemMetrics()
        {
            try
            {
                // Collect CPU usage
                var cpuUsage = await GetCpuUsageAsync();
                await _analyticsService.RecordMetricAsync(new CreateSystemMetricDto
                {
                    MetricName = "cpu_usage",
                    MetricType = "gauge",
                    Value = cpuUsage,
                    Description = "CPU usage percentage",
                    Source = "system"
                });

                // Collect memory usage
                var memoryUsage = GetMemoryUsage();
                await _analyticsService.RecordMetricAsync(new CreateSystemMetricDto
                {
                    MetricName = "memory_usage",
                    MetricType = "gauge",
                    Value = memoryUsage,
                    Description = "Memory usage percentage",
                    Source = "system"
                });

                // Collect disk usage
                var diskUsage = GetDiskUsage();
                await _analyticsService.RecordMetricAsync(new CreateSystemMetricDto
                {
                    MetricName = "disk_usage",
                    MetricType = "gauge",
                    Value = diskUsage,
                    Description = "Disk usage percentage",
                    Source = "system"
                });

                // Collect process count
                var processCount = Process.GetProcesses().Length;
                await _analyticsService.RecordMetricAsync(new CreateSystemMetricDto
                {
                    MetricName = "process_count",
                    MetricType = "gauge",
                    Value = processCount,
                    Description = "Number of running processes",
                    Source = "system"
                });

                // Collect thread count
                var threadCount = Process.GetCurrentProcess().Threads.Count;
                await _analyticsService.RecordMetricAsync(new CreateSystemMetricDto
                {
                    MetricName = "thread_count",
                    MetricType = "gauge",
                    Value = threadCount,
                    Description = "Number of threads in current process",
                    Source = "system"
                });

                // Collect GC metrics
                var gen0Collections = GC.CollectionCount(0);
                var gen1Collections = GC.CollectionCount(1);
                var gen2Collections = GC.CollectionCount(2);

                await _analyticsService.RecordMetricAsync(new CreateSystemMetricDto
                {
                    MetricName = "gc_collections",
                    MetricType = "counter",
                    Value = gen0Collections,
                    Labels = System.Text.Json.JsonSerializer.Serialize(new { generation = 0 }),
                    Description = "GC collection count",
                    Source = "system"
                });

                await _analyticsService.RecordMetricAsync(new CreateSystemMetricDto
                {
                    MetricName = "gc_collections",
                    MetricType = "counter",
                    Value = gen1Collections,
                    Labels = System.Text.Json.JsonSerializer.Serialize(new { generation = 1 }),
                    Description = "GC collection count",
                    Source = "system"
                });

                await _analyticsService.RecordMetricAsync(new CreateSystemMetricDto
                {
                    MetricName = "gc_collections",
                    MetricType = "counter",
                    Value = gen2Collections,
                    Labels = System.Text.Json.JsonSerializer.Serialize(new { generation = 2 }),
                    Description = "GC collection count",
                    Source = "system"
                });

                // Collect working set memory
                var workingSet = Process.GetCurrentProcess().WorkingSet64;
                await _analyticsService.RecordMetricAsync(new CreateSystemMetricDto
                {
                    MetricName = "working_set_memory",
                    MetricType = "gauge",
                    Value = workingSet / 1024.0 / 1024.0, // Convert to MB
                    Description = "Working set memory in MB",
                    Source = "system"
                });

                _logger.LogDebug("System metrics collected successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error collecting system metrics");
                throw;
            }
        }

        private async Task<double> GetCpuUsageAsync()
        {
            try
            {
                var process = Process.GetCurrentProcess();
                var startTime = DateTime.UtcNow;
                var startCpuUsage = process.TotalProcessorTime;

                await Task.Delay(1000); // Wait 1 second

                var endTime = DateTime.UtcNow;
                var endCpuUsage = process.TotalProcessorTime;

                var cpuUsedMs = (endCpuUsage - startCpuUsage).TotalMilliseconds;
                var totalMsPassed = (endTime - startTime).TotalMilliseconds;
                var cpuUsageTotal = cpuUsedMs / (Environment.ProcessorCount * totalMsPassed);

                return Math.Min(100, cpuUsageTotal * 100);
            }
            catch
            {
                return 0;
            }
        }

        private double GetMemoryUsage()
        {
            try
            {
                var process = Process.GetCurrentProcess();
                var workingSet = process.WorkingSet64;
                var totalMemory = GC.GetTotalMemory(false);
                
                // Get total system memory (this is a simplified approach)
                var totalSystemMemory = GC.GetTotalMemory(true) * 10; // Rough estimate
                
                return Math.Min(100, (double)workingSet / totalSystemMemory * 100);
            }
            catch
            {
                return 0;
            }
        }

        private double GetDiskUsage()
        {
            try
            {
                var drives = DriveInfo.GetDrives();
                var systemDrive = drives.FirstOrDefault(d => d.IsReady && d.DriveType == DriveType.Fixed);
                
                if (systemDrive != null)
                {
                    var totalSpace = systemDrive.TotalSize;
                    var freeSpace = systemDrive.AvailableFreeSpace;
                    var usedSpace = totalSpace - freeSpace;
                    
                    return (double)usedSpace / totalSpace * 100;
                }
                
                return 0;
            }
            catch
            {
                return 0;
            }
        }
    }
}
