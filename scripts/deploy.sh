#!/bin/bash

# Småjobb Production Deployment Script
# This script handles the deployment of the Småjobb application to production

set -e  # Exit on any error

# Configuration
PROJECT_NAME="smajobb"
BACKUP_DIR="/opt/smajobb/backups"
LOG_DIR="/opt/smajobb/logs"
ENV_FILE="/opt/smajobb/.env.production"

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

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        error "This script should not be run as root for security reasons"
        exit 1
    fi
}

# Check if Docker is installed and running
check_docker() {
    log "Checking Docker installation..."
    if ! command -v docker &> /dev/null; then
        error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    if ! docker info &> /dev/null; then
        error "Docker is not running. Please start Docker first."
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi

    success "Docker and Docker Compose are available"
}

# Check if environment file exists
check_environment() {
    log "Checking environment configuration..."
    if [[ ! -f "$ENV_FILE" ]]; then
        error "Environment file not found at $ENV_FILE"
        error "Please create the environment file with the required variables:"
        error "  cp env.production.example $ENV_FILE"
        error "  # Edit the file with your production values"
        exit 1
    fi

    # Source the environment file
    source "$ENV_FILE"

    # Check required variables
    required_vars=("DB_PASSWORD" "JWT_SECRET_KEY" "JWT_ISSUER" "JWT_AUDIENCE" "FRONTEND_URL" "REDIS_PASSWORD")
    for var in "${required_vars[@]}"; do
        if [[ -z "${!var}" ]]; then
            error "Required environment variable $var is not set"
            exit 1
        fi
    done

    success "Environment configuration is valid"
}

# Create necessary directories
create_directories() {
    log "Creating necessary directories..."
    sudo mkdir -p "$BACKUP_DIR" "$LOG_DIR" "/opt/smajobb/uploads" "/opt/smajobb/thumbnails"
    sudo chown -R $(whoami):$(whoami) "$BACKUP_DIR" "$LOG_DIR" "/opt/smajobb/uploads" "/opt/smajobb/thumbnails"
    success "Directories created"
}

# Backup current deployment
backup_current() {
    log "Creating backup of current deployment..."
    if docker-compose -f docker-compose.production.yml ps | grep -q "Up"; then
        timestamp=$(date +"%Y%m%d_%H%M%S")
        backup_name="${PROJECT_NAME}_backup_${timestamp}"
        
        # Backup database
        log "Backing up database..."
        docker-compose -f docker-compose.production.yml exec -T postgres pg_dump -U smajobb_user smajobb_production > "$BACKUP_DIR/${backup_name}_database.sql"
        
        # Backup uploads
        log "Backing up uploads..."
        tar -czf "$BACKUP_DIR/${backup_name}_uploads.tar.gz" -C /opt/smajobb uploads thumbnails
        
        # Keep only last 5 backups
        find "$BACKUP_DIR" -name "${PROJECT_NAME}_backup_*" -type f -mtime +5 -delete
        
        success "Backup created: $backup_name"
    else
        warning "No running containers found, skipping backup"
    fi
}

# Pull latest images
pull_images() {
    log "Pulling latest Docker images..."
    
    # Use custom registry if specified
    if [[ -n "$REGISTRY" && -n "$IMAGE_NAME" ]]; then
        log "Using custom registry: $REGISTRY/$IMAGE_NAME"
        
        # Update docker-compose file to use custom images
        sed -i "s|smajobb-api|$REGISTRY/$IMAGE_NAME-api:${IMAGE_TAG:-latest}|g" docker-compose.production.yml
        sed -i "s|smajobb-frontend|$REGISTRY/$IMAGE_NAME-frontend:${IMAGE_TAG:-latest}|g" docker-compose.production.yml
    fi
    
    docker-compose -f docker-compose.production.yml pull
    success "Images pulled successfully"
}

# Build application
build_application() {
    log "Building application..."
    docker-compose -f docker-compose.production.yml build --no-cache
    success "Application built successfully"
}

# Run database migrations
run_migrations() {
    log "Running database migrations..."
    docker-compose -f docker-compose.production.yml run --rm smajobb-api dotnet ef database update
    success "Database migrations completed"
}

# Deploy application
deploy_application() {
    log "Deploying application..."
    
    # Stop existing containers
    log "Stopping existing containers..."
    docker-compose -f docker-compose.production.yml down
    
    # Start new containers
    log "Starting new containers..."
    docker-compose -f docker-compose.production.yml up -d
    
    # Wait for services to be healthy
    log "Waiting for services to be healthy..."
    sleep 30
    
    # Check health
    if docker-compose -f docker-compose.production.yml ps | grep -q "unhealthy"; then
        error "Some services are unhealthy. Check logs:"
        docker-compose -f docker-compose.production.yml logs
        exit 1
    fi
    
    success "Application deployed successfully"
}

# Run health checks
health_check() {
    log "Running health checks..."
    
    # Check API health
    if curl -f http://localhost/health > /dev/null 2>&1; then
        success "API health check passed"
    else
        error "API health check failed"
        return 1
    fi
    
    # Check database connection
    if docker-compose -f docker-compose.production.yml exec -T postgres pg_isready -U smajobb_user -d smajobb_production > /dev/null 2>&1; then
        success "Database health check passed"
    else
        error "Database health check failed"
        return 1
    fi
    
    # Check Redis connection
    if docker-compose -f docker-compose.production.yml exec -T redis redis-cli ping > /dev/null 2>&1; then
        success "Redis health check passed"
    else
        error "Redis health check failed"
        return 1
    fi
    
    success "All health checks passed"
}

# Rollback deployment
rollback_deployment() {
    log "Rolling back deployment..."
    
    # Find the latest backup
    latest_backup=$(find "$BACKUP_DIR" -name "${PROJECT_NAME}_backup_*_database.sql" -type f -printf '%T@ %p\n' | sort -n | tail -1 | cut -d' ' -f2-)
    
    if [[ -z "$latest_backup" ]]; then
        error "No backup found for rollback"
        exit 1
    fi
    
    log "Rolling back to backup: $latest_backup"
    
    # Stop current deployment
    docker-compose -f docker-compose.production.yml down
    
    # Restore database
    log "Restoring database..."
    docker-compose -f docker-compose.production.yml up -d postgres
    sleep 10
    
    # Drop and recreate database
    docker-compose -f docker-compose.production.yml exec -T postgres dropdb -U smajobb_user smajobb_production || true
    docker-compose -f docker-compose.production.yml exec -T postgres createdb -U smajobb_user smajobb_production
    
    # Restore from backup
    cat "$latest_backup" | docker-compose -f docker-compose.production.yml exec -T postgres psql -U smajobb_user -d smajobb_production
    
    # Start all services
    docker-compose -f docker-compose.production.yml up -d
    
    success "Rollback completed"
}

# Clean up old images
cleanup() {
    log "Cleaning up old Docker images..."
    docker image prune -f
    docker system prune -f
    success "Cleanup completed"
}

# Show deployment status
show_status() {
    log "Deployment Status:"
    echo "=================="
    docker-compose -f docker-compose.production.yml ps
    echo ""
    echo "Application URL: http://localhost"
    echo "API Health: http://localhost/health"
    echo "Logs: docker-compose -f docker-compose.production.yml logs -f"
}

# Main deployment function
main() {
    log "Starting Småjobb production deployment..."
    
    check_root
    check_docker
    check_environment
    create_directories
    backup_current
    pull_images
    build_application
    run_migrations
    deploy_application
    
    if health_check; then
        cleanup
        success "Deployment completed successfully!"
        show_status
    else
        error "Deployment failed health checks"
        exit 1
    fi
}

# Handle script arguments
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "backup")
        check_environment
        backup_current
        ;;
    "health")
        health_check
        ;;
    "status")
        show_status
        ;;
    "logs")
        docker-compose -f docker-compose.production.yml logs -f
        ;;
    "stop")
        docker-compose -f docker-compose.production.yml down
        ;;
    "start")
        docker-compose -f docker-compose.production.yml up -d
        ;;
    "restart")
        docker-compose -f docker-compose.production.yml restart
        ;;
    "rollback")
        rollback_deployment
        ;;
    *)
        echo "Usage: $0 {deploy|backup|health|status|logs|stop|start|restart|rollback}"
        echo ""
        echo "Commands:"
        echo "  deploy   - Full deployment (default)"
        echo "  backup   - Create backup only"
        echo "  health   - Run health checks"
        echo "  status   - Show deployment status"
        echo "  logs     - Show application logs"
        echo "  stop     - Stop all services"
        echo "  start    - Start all services"
        echo "  restart  - Restart all services"
        echo "  rollback - Rollback to previous version"
        exit 1
        ;;
esac