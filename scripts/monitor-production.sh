#!/bin/bash

# Production Monitoring Script for Småjobb
# This script monitors the health and performance of the production environment

set -e

# Configuration
LOG_DIR="/opt/smajobb/logs"
ALERT_EMAIL="admin@your-domain.com"
SLACK_WEBHOOK_URL="${SLACK_WEBHOOK_URL:-}"
DISCORD_WEBHOOK_URL="${DISCORD_WEBHOOK_URL:-}"

# Thresholds
CPU_THRESHOLD=80
MEMORY_THRESHOLD=85
DISK_THRESHOLD=90
RESPONSE_TIME_THRESHOLD=5000  # milliseconds

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Send alert notification
send_alert() {
    local message="$1"
    local severity="${2:-warning}"
    
    log "Sending alert: $message"
    
    # Log to file
    echo "$(date): [$severity] $message" >> "$LOG_DIR/monitoring.log"
    
    # Send email (if configured)
    if command -v mail &> /dev/null && [[ -n "$ALERT_EMAIL" ]]; then
        echo "$message" | mail -s "Småjobb Alert: $severity" "$ALERT_EMAIL"
    fi
    
    # Send Slack notification (if configured)
    if [[ -n "$SLACK_WEBHOOK_URL" ]]; then
        local color="good"
        case $severity in
            "critical") color="danger" ;;
            "warning") color="warning" ;;
        esac
        
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"text\":\"Småjobb Alert\",\"attachments\":[{\"color\":\"$color\",\"text\":\"$message\"}]}" \
            "$SLACK_WEBHOOK_URL" 2>/dev/null || true
    fi
    
    # Send Discord notification (if configured)
    if [[ -n "$DISCORD_WEBHOOK_URL" ]]; then
        local color=65280  # Green
        case $severity in
            "critical") color=16711680 ;;  # Red
            "warning") color=16776960 ;;   # Yellow
        esac
        
        curl -X POST -H 'Content-type: application/json' \
            --data "{\"embeds\":[{\"title\":\"Småjobb Alert\",\"description\":\"$message\",\"color\":$color}]}" \
            "$DISCORD_WEBHOOK_URL" 2>/dev/null || true
    fi
}

# Check Docker containers
check_containers() {
    log "Checking Docker containers..."
    
    local unhealthy_containers=$(docker-compose -f docker-compose.production.yml ps --services --filter "status=unhealthy" 2>/dev/null || echo "")
    local stopped_containers=$(docker-compose -f docker-compose.production.yml ps --services --filter "status=exited" 2>/dev/null || echo "")
    
    if [[ -n "$unhealthy_containers" ]]; then
        send_alert "Unhealthy containers detected: $unhealthy_containers" "critical"
        return 1
    fi
    
    if [[ -n "$stopped_containers" ]]; then
        send_alert "Stopped containers detected: $stopped_containers" "critical"
        return 1
    fi
    
    success "All containers are healthy"
    return 0
}

# Check system resources
check_system_resources() {
    log "Checking system resources..."
    
    # CPU usage
    local cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | awk -F'%' '{print $1}')
    if (( $(echo "$cpu_usage > $CPU_THRESHOLD" | bc -l) )); then
        send_alert "High CPU usage: ${cpu_usage}%" "warning"
    fi
    
    # Memory usage
    local memory_usage=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')
    if [[ $memory_usage -gt $MEMORY_THRESHOLD ]]; then
        send_alert "High memory usage: ${memory_usage}%" "warning"
    fi
    
    # Disk usage
    local disk_usage=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
    if [[ $disk_usage -gt $DISK_THRESHOLD ]]; then
        send_alert "High disk usage: ${disk_usage}%" "critical"
    fi
    
    success "System resources check completed"
}

# Check application health
check_application_health() {
    log "Checking application health..."
    
    # Check API health endpoint
    local response_time=$(curl -o /dev/null -s -w '%{time_total}' http://localhost/health 2>/dev/null || echo "9999")
    local response_time_ms=$(echo "$response_time * 1000" | bc -l | cut -d. -f1)
    
    if [[ $response_time_ms -gt $RESPONSE_TIME_THRESHOLD ]]; then
        send_alert "Slow API response time: ${response_time_ms}ms" "warning"
    fi
    
    # Check if health endpoint returns 200
    local health_status=$(curl -s -o /dev/null -w '%{http_code}' http://localhost/health 2>/dev/null || echo "000")
    if [[ "$health_status" != "200" ]]; then
        send_alert "API health check failed with status: $health_status" "critical"
        return 1
    fi
    
    success "Application health check passed"
    return 0
}

# Check database connectivity
check_database() {
    log "Checking database connectivity..."
    
    if docker-compose -f docker-compose.production.yml exec -T postgres pg_isready -U smajobb_user -d smajobb_production > /dev/null 2>&1; then
        success "Database is accessible"
    else
        send_alert "Database connectivity check failed" "critical"
        return 1
    fi
    
    # Check database size
    local db_size=$(docker-compose -f docker-compose.production.yml exec -T postgres psql -U smajobb_user -d smajobb_production -t -c "SELECT pg_size_pretty(pg_database_size('smajobb_production'));" 2>/dev/null | xargs)
    log "Database size: $db_size"
    
    return 0
}

# Check Redis connectivity
check_redis() {
    log "Checking Redis connectivity..."
    
    if docker-compose -f docker-compose.production.yml exec -T redis redis-cli ping > /dev/null 2>&1; then
        success "Redis is accessible"
    else
        send_alert "Redis connectivity check failed" "critical"
        return 1
    fi
    
    return 0
}

# Check log files for errors
check_logs() {
    log "Checking application logs for errors..."
    
    local error_count=0
    
    # Check for recent errors in container logs
    local recent_errors=$(docker-compose -f docker-compose.production.yml logs --since=1h 2>&1 | grep -i "error\|exception\|fatal" | wc -l)
    
    if [[ $recent_errors -gt 10 ]]; then
        send_alert "High number of errors in logs: $recent_errors errors in the last hour" "warning"
    fi
    
    # Check for specific critical errors
    local critical_errors=$(docker-compose -f docker-compose.production.yml logs --since=1h 2>&1 | grep -i "fatal\|panic\|out of memory" | wc -l)
    
    if [[ $critical_errors -gt 0 ]]; then
        send_alert "Critical errors detected in logs: $critical_errors critical errors in the last hour" "critical"
    fi
    
    success "Log check completed"
}

# Check SSL certificate expiration (if HTTPS is configured)
check_ssl_certificate() {
    log "Checking SSL certificate..."
    
    # This is a placeholder - implement based on your SSL setup
    # Example for Let's Encrypt certificates:
    # local cert_file="/etc/letsencrypt/live/your-domain.com/fullchain.pem"
    # if [[ -f "$cert_file" ]]; then
    #     local expiry_date=$(openssl x509 -enddate -noout -in "$cert_file" | cut -d= -f2)
    #     local expiry_timestamp=$(date -d "$expiry_date" +%s)
    #     local current_timestamp=$(date +%s)
    #     local days_until_expiry=$(( (expiry_timestamp - current_timestamp) / 86400 ))
    #     
    #     if [[ $days_until_expiry -lt 30 ]]; then
    #         send_alert "SSL certificate expires in $days_until_expiry days" "warning"
    #     fi
    # fi
    
    success "SSL certificate check completed"
}

# Generate monitoring report
generate_report() {
    log "Generating monitoring report..."
    
    local report_file="$LOG_DIR/monitoring-report-$(date +%Y%m%d-%H%M%S).txt"
    
    {
        echo "Småjobb Production Monitoring Report"
        echo "Generated: $(date)"
        echo "=================================="
        echo ""
        
        echo "Container Status:"
        docker-compose -f docker-compose.production.yml ps
        echo ""
        
        echo "System Resources:"
        echo "CPU Usage: $(top -bn1 | grep "Cpu(s)" | awk '{print $2}')"
        echo "Memory Usage: $(free | grep Mem | awk '{printf "%.1f%%", $3/$2 * 100.0}')"
        echo "Disk Usage: $(df / | tail -1 | awk '{print $5}')"
        echo ""
        
        echo "Application Health:"
        local health_status=$(curl -s -o /dev/null -w '%{http_code}' http://localhost/health 2>/dev/null || echo "000")
        echo "API Health Status: $health_status"
        echo ""
        
        echo "Database Status:"
        if docker-compose -f docker-compose.production.yml exec -T postgres pg_isready -U smajobb_user -d smajobb_production > /dev/null 2>&1; then
            echo "Database: Accessible"
        else
            echo "Database: Not accessible"
        fi
        echo ""
        
        echo "Recent Errors (last hour):"
        docker-compose -f docker-compose.production.yml logs --since=1h 2>&1 | grep -i "error\|exception" | tail -10
        
    } > "$report_file"
    
    success "Monitoring report generated: $report_file"
}

# Main monitoring function
run_monitoring() {
    log "Starting production monitoring..."
    
    local overall_status=0
    
    # Run all checks
    check_containers || overall_status=1
    check_system_resources
    check_application_health || overall_status=1
    check_database || overall_status=1
    check_redis || overall_status=1
    check_logs
    check_ssl_certificate
    
    if [[ $overall_status -eq 0 ]]; then
        success "All monitoring checks passed"
    else
        error "Some monitoring checks failed"
    fi
    
    return $overall_status
}

# Continuous monitoring mode
continuous_monitoring() {
    local interval="${1:-300}"  # Default 5 minutes
    
    log "Starting continuous monitoring (interval: ${interval}s)"
    
    while true; do
        run_monitoring
        sleep "$interval"
    done
}

# Main function
main() {
    case "${1:-check}" in
        "check")
            run_monitoring
            ;;
        "report")
            generate_report
            ;;
        "continuous")
            continuous_monitoring "$2"
            ;;
        "containers")
            check_containers
            ;;
        "resources")
            check_system_resources
            ;;
        "health")
            check_application_health
            ;;
        "database")
            check_database
            ;;
        "redis")
            check_redis
            ;;
        "logs")
            check_logs
            ;;
        *)
            echo "Usage: $0 {check|report|continuous|containers|resources|health|database|redis|logs}"
            echo ""
            echo "Commands:"
            echo "  check              - Run all monitoring checks (default)"
            echo "  report             - Generate monitoring report"
            echo "  continuous [sec]   - Run continuous monitoring"
            echo "  containers         - Check container status only"
            echo "  resources          - Check system resources only"
            echo "  health             - Check application health only"
            echo "  database           - Check database connectivity only"
            echo "  redis              - Check Redis connectivity only"
            echo "  logs               - Check application logs only"
            echo ""
            echo "Environment variables:"
            echo "  ALERT_EMAIL        - Email for alerts"
            echo "  SLACK_WEBHOOK_URL  - Slack webhook for notifications"
            echo "  DISCORD_WEBHOOK_URL - Discord webhook for notifications"
            exit 1
            ;;
    esac
}

# Create log directory if it doesn't exist
mkdir -p "$LOG_DIR"

# Run main function with all arguments
main "$@"
