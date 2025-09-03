# Småjobb Production Setup Guide

This guide provides comprehensive instructions for setting up the Småjobb platform in a production environment.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Database Setup](#database-setup)
4. [Deployment](#deployment)
5. [SSL/HTTPS Configuration](#sslhttps-configuration)
6. [Monitoring and Maintenance](#monitoring-and-maintenance)
7. [Backup Strategy](#backup-strategy)
8. [Security Considerations](#security-considerations)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements

- **Operating System**: Ubuntu 20.04+ or CentOS 8+ (Linux recommended)
- **CPU**: 2+ cores
- **RAM**: 4GB+ (8GB recommended for production)
- **Storage**: 50GB+ SSD storage
- **Network**: Stable internet connection with static IP (recommended)

### Software Requirements

- Docker 20.10+
- Docker Compose 2.0+
- Git
- curl/wget
- PostgreSQL client tools (for manual database operations)

### Domain and DNS

- Domain name pointing to your server
- SSL certificate (Let's Encrypt recommended)

## Environment Configuration

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd smajobb
```

### 2. Create Environment File

```bash
cp env.production.example .env.production
```

Edit `.env.production` with your production values:

```bash
# Database Configuration
DB_HOST=localhost
DB_NAME=smajobb_production
DB_USER=smajobb_user
DB_PASSWORD=your-secure-database-password
DB_PORT=5432

# JWT Configuration
JWT_SECRET_KEY=your-very-secure-jwt-secret-key-minimum-32-characters
JWT_ISSUER=https://your-domain.com
JWT_AUDIENCE=https://your-domain.com

# Frontend Configuration
FRONTEND_URL=https://your-domain.com

# Redis Configuration
REDIS_PASSWORD=your-secure-redis-password

# Security
REQUIRE_HTTPS=true
CORS_ORIGINS=https://your-domain.com
```

### 3. Generate Secure Keys

```bash
# Generate JWT secret key (32+ characters)
openssl rand -base64 32

# Generate database password
openssl rand -base64 16

# Generate Redis password
openssl rand -base64 16
```

## Database Setup

### 1. Production Database Configuration

The production setup includes:

- **PostgreSQL 15** with optimized settings
- **Redis 7** for caching and sessions
- **Automated backups** with retention policies
- **Performance indexes** for common queries
- **Row-level security** for data protection

### 2. Database Initialization

The database will be automatically initialized with:

- Required extensions (uuid-ossp, pg_trgm, btree_gin)
- Custom data types
- Performance indexes
- Security policies
- Cleanup functions

## Deployment

### Option 1: Automated Deployment (Recommended)

#### Linux/macOS

```bash
# Make deployment script executable
chmod +x scripts/deploy.sh

# Run full deployment
./scripts/deploy.sh deploy

# Or run specific commands
./scripts/deploy.sh backup    # Create backup only
./scripts/deploy.sh health    # Run health checks
./scripts/deploy.sh status    # Show deployment status
./scripts/deploy.sh logs      # Show application logs
```

#### Windows

```powershell
# Run PowerShell deployment script
.\scripts\setup-production.ps1 deploy

# Or run specific commands
.\scripts\setup-production.ps1 backup    # Create backup only
.\scripts\setup-production.ps1 health    # Run health checks
.\scripts\setup-production.ps1 status    # Show deployment status
.\scripts\setup-production.ps1 logs      # Show application logs
```

### Option 2: Manual Deployment

```bash
# 1. Create necessary directories
sudo mkdir -p /opt/smajobb/{backups,logs,uploads,thumbnails}
sudo chown -R $(whoami):$(whoami) /opt/smajobb

# 2. Set environment variables
export $(cat .env.production | xargs)

# 3. Pull and build images
docker-compose -f docker-compose.production.yml pull
docker-compose -f docker-compose.production.yml build

# 4. Start services
docker-compose -f docker-compose.production.yml up -d

# 5. Run database migrations
docker-compose -f docker-compose.production.yml run --rm smajobb-api dotnet ef database update

# 6. Verify deployment
curl http://localhost/health
```

## SSL/HTTPS Configuration

### 1. Using Let's Encrypt (Recommended)

```bash
# Install Certbot
sudo apt update
sudo apt install certbot

# Obtain SSL certificate
sudo certbot certonly --standalone -d your-domain.com

# Update nginx configuration
sudo cp nginx/nginx.production.conf /etc/nginx/nginx.conf
sudo nano /etc/nginx/nginx.conf  # Uncomment HTTPS server block and update paths

# Reload nginx
sudo nginx -t
sudo systemctl reload nginx
```

### 2. Using Custom SSL Certificates

```bash
# Copy your certificates
sudo mkdir -p /etc/nginx/ssl
sudo cp your-cert.pem /etc/nginx/ssl/cert.pem
sudo cp your-key.pem /etc/nginx/ssl/key.pem

# Update nginx configuration
sudo nano /etc/nginx/nginx.conf  # Uncomment and configure HTTPS server block
```

## Monitoring and Maintenance

### 1. Health Monitoring

```bash
# Run health checks
./scripts/monitor-production.sh check

# Generate monitoring report
./scripts/monitor-production.sh report

# Start continuous monitoring
./scripts/monitor-production.sh continuous 300  # Check every 5 minutes
```

### 2. Log Management

```bash
# View application logs
docker-compose -f docker-compose.production.yml logs -f

# View specific service logs
docker-compose -f docker-compose.production.yml logs -f smajobb-api
docker-compose -f docker-compose.production.yml logs -f postgres

# Rotate logs (configure logrotate)
sudo nano /etc/logrotate.d/smajobb
```

### 3. Performance Monitoring

The monitoring script checks:

- Container health status
- System resource usage (CPU, memory, disk)
- Application response times
- Database connectivity
- Redis connectivity
- Error logs
- SSL certificate expiration

## Backup Strategy

### 1. Automated Database Backups

```bash
# Create backup
./scripts/backup-database.sh backup

# List available backups
./scripts/backup-database.sh list

# Test backup integrity
./scripts/backup-database.sh test

# Restore from backup
./scripts/backup-database.sh restore /path/to/backup.sql.gz
```

### 2. Backup Scheduling

Add to crontab for automated backups:

```bash
# Edit crontab
crontab -e

# Add backup schedule (daily at 2 AM)
0 2 * * * /path/to/smajobb/scripts/backup-database.sh backup

# Add monitoring (every 5 minutes)
*/5 * * * * /path/to/smajobb/scripts/monitor-production.sh check
```

### 3. Backup Retention

- **Daily backups**: Kept for 30 days
- **Weekly backups**: Kept for 12 weeks
- **Monthly backups**: Kept for 12 months

## Security Considerations

### 1. Firewall Configuration

```bash
# Configure UFW (Ubuntu)
sudo ufw enable
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw deny 5432/tcp   # PostgreSQL (internal only)
sudo ufw deny 6379/tcp   # Redis (internal only)
```

### 2. Docker Security

- Containers run as non-root users
- Network isolation between services
- Resource limits configured
- Health checks enabled

### 3. Database Security

- Row-level security (RLS) enabled
- Encrypted connections (SSL)
- Strong password requirements
- Regular security updates

### 4. Application Security

- JWT token authentication
- CORS properly configured
- Rate limiting enabled
- Security headers implemented
- Input validation and sanitization

## Troubleshooting

### Common Issues

#### 1. Container Won't Start

```bash
# Check container logs
docker-compose -f docker-compose.production.yml logs <service-name>

# Check container status
docker-compose -f docker-compose.production.yml ps

# Restart specific service
docker-compose -f docker-compose.production.yml restart <service-name>
```

#### 2. Database Connection Issues

```bash
# Test database connectivity
docker-compose -f docker-compose.production.yml exec postgres pg_isready -U smajobb_user -d smajobb_production

# Check database logs
docker-compose -f docker-compose.production.yml logs postgres

# Reset database (WARNING: This will delete all data)
docker-compose -f docker-compose.production.yml down
docker volume rm smajobb_postgres_data
docker-compose -f docker-compose.production.yml up -d
```

#### 3. High Resource Usage

```bash
# Check system resources
./scripts/monitor-production.sh resources

# Check container resource usage
docker stats

# Scale services if needed
docker-compose -f docker-compose.production.yml up -d --scale smajobb-api=2
```

#### 4. SSL Certificate Issues

```bash
# Test SSL configuration
openssl s_client -connect your-domain.com:443

# Renew Let's Encrypt certificate
sudo certbot renew

# Check certificate expiration
openssl x509 -in /etc/letsencrypt/live/your-domain.com/fullchain.pem -text -noout | grep "Not After"
```

### Performance Optimization

#### 1. Database Optimization

```sql
-- Check slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;

-- Analyze table statistics
ANALYZE;

-- Reindex if needed
REINDEX DATABASE smajobb_production;
```

#### 2. Application Optimization

- Enable gzip compression
- Configure caching headers
- Optimize images and assets
- Use CDN for static content
- Implement database connection pooling

### Support and Maintenance

#### Regular Maintenance Tasks

1. **Weekly**:
   - Review monitoring reports
   - Check disk space usage
   - Update system packages

2. **Monthly**:
   - Review and rotate logs
   - Update application dependencies
   - Test backup restoration
   - Security audit

3. **Quarterly**:
   - Performance review
   - Capacity planning
   - Security updates
   - Disaster recovery testing

#### Getting Help

- Check application logs: `docker-compose -f docker-compose.production.yml logs`
- Review monitoring reports: `./scripts/monitor-production.sh report`
- Test individual components: `./scripts/monitor-production.sh <component>`

## Production Checklist

Before going live, ensure:

- [ ] Environment variables configured
- [ ] SSL certificate installed and working
- [ ] Database backups scheduled
- [ ] Monitoring configured
- [ ] Firewall rules applied
- [ ] Domain DNS configured
- [ ] Health checks passing
- [ ] Performance benchmarks met
- [ ] Security audit completed
- [ ] Disaster recovery plan tested

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [ASP.NET Core Production Best Practices](https://docs.microsoft.com/en-us/aspnet/core/fundamentals/servers/kestrel?view=aspnetcore-6.0)
