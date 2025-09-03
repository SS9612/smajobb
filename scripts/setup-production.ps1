# Småjobb Production Setup Script for Windows
# This script sets up the production environment on Windows

param(
    [string]$Environment = "production",
    [switch]$SkipBackup,
    [switch]$Force
)

# Configuration
$ProjectName = "smajobb"
$BackupDir = "C:\smajobb\backups"
$LogDir = "C:\smajobb\logs"
$EnvFile = "C:\smajobb\.env.production"

# Colors for output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"

# Logging functions
function Write-Log {
    param([string]$Message)
    Write-Host "[$(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')] $Message" -ForegroundColor $Blue
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor $Red
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor $Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor $Yellow
}

# Check if running as administrator
function Test-Administrator {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

# Check if Docker is installed and running
function Test-Docker {
    Write-Log "Checking Docker installation..."
    
    if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
        Write-Error "Docker is not installed. Please install Docker Desktop first."
        exit 1
    }

    try {
        docker info | Out-Null
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Docker is not running. Please start Docker Desktop first."
            exit 1
        }
    }
    catch {
        Write-Error "Docker is not running. Please start Docker Desktop first."
        exit 1
    }

    if (-not (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
        Write-Error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    }

    Write-Success "Docker and Docker Compose are available"
}

# Check if environment file exists
function Test-Environment {
    Write-Log "Checking environment configuration..."
    
    if (-not (Test-Path $EnvFile)) {
        Write-Error "Environment file not found at $EnvFile"
        Write-Error "Please create the environment file with the required variables:"
        Write-Error "  Copy-Item env.production.example $EnvFile"
        Write-Error "  # Edit the file with your production values"
        exit 1
    }

    # Load environment variables
    Get-Content $EnvFile | ForEach-Object {
        if ($_ -match '^([^#][^=]+)=(.*)$') {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
        }
    }

    # Check required variables
    $requiredVars = @("DB_PASSWORD", "JWT_SECRET_KEY", "JWT_ISSUER", "JWT_AUDIENCE", "FRONTEND_URL", "REDIS_PASSWORD")
    foreach ($var in $requiredVars) {
        if (-not [Environment]::GetEnvironmentVariable($var, "Process")) {
            Write-Error "Required environment variable $var is not set"
            exit 1
        }
    }

    Write-Success "Environment configuration is valid"
}

# Create necessary directories
function New-Directories {
    Write-Log "Creating necessary directories..."
    
    $directories = @($BackupDir, $LogDir, "C:\smajobb\uploads", "C:\smajobb\thumbnails")
    
    foreach ($dir in $directories) {
        if (-not (Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
        }
    }
    
    Write-Success "Directories created"
}

# Backup current deployment
function Backup-Current {
    if ($SkipBackup) {
        Write-Warning "Skipping backup as requested"
        return
    }

    Write-Log "Creating backup of current deployment..."
    
    $containers = docker-compose -f docker-compose.production.yml ps --services --filter "status=running"
    if ($containers) {
        $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
        $backupName = "${ProjectName}_backup_${timestamp}"
        
        # Backup database
        Write-Log "Backing up database..."
        docker-compose -f docker-compose.production.yml exec -T postgres pg_dump -U smajobb_user smajobb_production | Out-File -FilePath "$BackupDir\${backupName}_database.sql" -Encoding UTF8
        
        # Backup uploads
        Write-Log "Backing up uploads..."
        Compress-Archive -Path "C:\smajobb\uploads", "C:\smajobb\thumbnails" -DestinationPath "$BackupDir\${backupName}_uploads.zip" -Force
        
        # Keep only last 5 backups
        Get-ChildItem -Path $BackupDir -Filter "${ProjectName}_backup_*" | Sort-Object CreationTime -Descending | Select-Object -Skip 5 | Remove-Item -Force
        
        Write-Success "Backup created: $backupName"
    }
    else {
        Write-Warning "No running containers found, skipping backup"
    }
}

# Pull latest images
function Invoke-PullImages {
    Write-Log "Pulling latest Docker images..."
    docker-compose -f docker-compose.production.yml pull
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Images pulled successfully"
    }
    else {
        Write-Error "Failed to pull images"
        exit 1
    }
}

# Build application
function Invoke-BuildApplication {
    Write-Log "Building application..."
    docker-compose -f docker-compose.production.yml build --no-cache
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Application built successfully"
    }
    else {
        Write-Error "Failed to build application"
        exit 1
    }
}

# Run database migrations
function Invoke-Migrations {
    Write-Log "Running database migrations..."
    docker-compose -f docker-compose.production.yml run --rm smajobb-api dotnet ef database update
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Database migrations completed"
    }
    else {
        Write-Error "Database migrations failed"
        exit 1
    }
}

# Deploy application
function Invoke-DeployApplication {
    Write-Log "Deploying application..."
    
    # Stop existing containers
    Write-Log "Stopping existing containers..."
    docker-compose -f docker-compose.production.yml down
    
    # Start new containers
    Write-Log "Starting new containers..."
    docker-compose -f docker-compose.production.yml up -d
    
    # Wait for services to be healthy
    Write-Log "Waiting for services to be healthy..."
    Start-Sleep -Seconds 30
    
    # Check health
    $unhealthyContainers = docker-compose -f docker-compose.production.yml ps --services --filter "status=unhealthy"
    if ($unhealthyContainers) {
        Write-Error "Some services are unhealthy. Check logs:"
        docker-compose -f docker-compose.production.yml logs
        exit 1
    }
    
    Write-Success "Application deployed successfully"
}

# Run health checks
function Test-HealthChecks {
    Write-Log "Running health checks..."
    
    # Check API health
    try {
        $response = Invoke-WebRequest -Uri "http://localhost/health" -UseBasicParsing -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Success "API health check passed"
        }
        else {
            Write-Error "API health check failed"
            return $false
        }
    }
    catch {
        Write-Error "API health check failed: $($_.Exception.Message)"
        return $false
    }
    
    # Check database connection
    $dbCheck = docker-compose -f docker-compose.production.yml exec -T postgres pg_isready -U smajobb_user -d smajobb_production
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Database health check passed"
    }
    else {
        Write-Error "Database health check failed"
        return $false
    }
    
    # Check Redis connection
    $redisCheck = docker-compose -f docker-compose.production.yml exec -T redis redis-cli ping
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Redis health check passed"
    }
    else {
        Write-Error "Redis health check failed"
        return $false
    }
    
    Write-Success "All health checks passed"
    return $true
}

# Clean up old images
function Invoke-Cleanup {
    Write-Log "Cleaning up old Docker images..."
    docker image prune -f
    docker system prune -f
    Write-Success "Cleanup completed"
}

# Show deployment status
function Show-Status {
    Write-Log "Deployment Status:"
    Write-Host "=================="
    docker-compose -f docker-compose.production.yml ps
    Write-Host ""
    Write-Host "Application URL: http://localhost"
    Write-Host "API Health: http://localhost/health"
    Write-Host "Logs: docker-compose -f docker-compose.production.yml logs -f"
}

# Main deployment function
function Start-Deployment {
    Write-Log "Starting Småjobb production deployment..."
    
    Test-Docker
    Test-Environment
    New-Directories
    Backup-Current
    Invoke-PullImages
    Invoke-BuildApplication
    Invoke-Migrations
    Invoke-DeployApplication
    
    if (Test-HealthChecks) {
        Invoke-Cleanup
        Write-Success "Deployment completed successfully!"
        Show-Status
    }
    else {
        Write-Error "Deployment failed health checks"
        exit 1
    }
}

# Handle script parameters
switch ($args[0]) {
    "deploy" {
        Start-Deployment
    }
    "backup" {
        Test-Environment
        Backup-Current
    }
    "health" {
        Test-HealthChecks
    }
    "status" {
        Show-Status
    }
    "logs" {
        docker-compose -f docker-compose.production.yml logs -f
    }
    "stop" {
        docker-compose -f docker-compose.production.yml down
    }
    "start" {
        docker-compose -f docker-compose.production.yml up -d
    }
    "restart" {
        docker-compose -f docker-compose.production.yml restart
    }
    default {
        Start-Deployment
    }
}
