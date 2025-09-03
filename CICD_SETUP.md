# CI/CD Pipeline Setup Guide

This guide explains how to set up and configure the CI/CD pipeline for the Småjobb platform.

## Table of Contents

1. [Overview](#overview)
2. [GitHub Actions Workflows](#github-actions-workflows)
3. [Required Secrets](#required-secrets)
4. [Environment Setup](#environment-setup)
5. [Deployment Process](#deployment-process)
6. [Monitoring and Alerts](#monitoring-and-alerts)
7. [Troubleshooting](#troubleshooting)

## Overview

The CI/CD pipeline is built using GitHub Actions and includes:

- **Continuous Integration (CI)**: Automated testing, building, and security scanning
- **Continuous Deployment (CD)**: Automated deployment to staging and production
- **Release Management**: Automated versioning and release creation
- **Security Scanning**: Comprehensive security checks and vulnerability scanning

## GitHub Actions Workflows

### 1. CI Pipeline (`.github/workflows/ci.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**Jobs:**
- **Backend Tests**: Unit tests, integration tests, code coverage
- **Frontend Tests**: Linting, type checking, unit tests
- **Security Scan**: Vulnerability scanning, dependency checks
- **Build Images**: Docker image building and pushing
- **Integration Tests**: End-to-end testing with Docker Compose

### 2. CD Pipeline (`.github/workflows/cd.yml`)

**Triggers:**
- Push to `main` branch (staging deployment)
- Manual workflow dispatch (production deployment)

**Jobs:**
- **Deploy Staging**: Automatic deployment to staging environment
- **Deploy Production**: Manual deployment to production with approval
- **Rollback**: Automatic rollback on deployment failure

### 3. Release Pipeline (`.github/workflows/release.yml`)

**Triggers:**
- Git tags (e.g., `v1.0.0`)
- Manual workflow dispatch

**Jobs:**
- **Create Release**: Generate release notes and create GitHub release
- **Build Release Images**: Build and tag Docker images for release
- **Deploy Staging**: Deploy release to staging
- **Deploy Production**: Deploy release to production
- **Update Documentation**: Update version numbers in documentation

### 4. Security Pipeline (`.github/workflows/security.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches
- Weekly schedule (Mondays at 2 AM)

**Jobs:**
- **Dependency Scan**: Vulnerability scanning with Trivy
- **Backend Security**: .NET security audit, SonarCloud analysis
- **Frontend Security**: npm audit, Snyk vulnerability scanning
- **Container Security**: Docker image security scanning
- **Secrets Scan**: Detect exposed secrets in code
- **License Scan**: Check for license compliance issues

## Required Secrets

Configure the following secrets in your GitHub repository:

### Docker Registry
```
DOCKER_USERNAME          # Docker Hub username
DOCKER_PASSWORD          # Docker Hub password or access token
```

### Deployment
```
STAGING_HOST             # Staging server hostname/IP
STAGING_USERNAME         # SSH username for staging
STAGING_SSH_KEY          # SSH private key for staging
STAGING_PORT             # SSH port for staging (default: 22)
STAGING_URL              # Staging application URL

PRODUCTION_HOST          # Production server hostname/IP
PRODUCTION_USERNAME      # SSH username for production
PRODUCTION_SSH_KEY       # SSH private key for production
PRODUCTION_PORT          # SSH port for production (default: 22)
PRODUCTION_URL           # Production application URL
```

### Security Tools
```
SONAR_TOKEN              # SonarCloud authentication token
SNYK_TOKEN               # Snyk authentication token
```

### Notifications
```
SLACK_WEBHOOK_URL        # Slack webhook URL for notifications
```

## Environment Setup

### 1. GitHub Repository Settings

1. Go to your repository settings
2. Navigate to "Secrets and variables" → "Actions"
3. Add all required secrets listed above

### 2. Environment Protection Rules

Set up environment protection rules for production:

1. Go to repository settings → "Environments"
2. Create "production" environment
3. Add protection rules:
   - Required reviewers (at least 1)
   - Wait timer (optional)
   - Deployment branches (only `main` branch)

### 3. Branch Protection Rules

1. Go to repository settings → "Branches"
2. Add rule for `main` branch:
   - Require pull request reviews
   - Require status checks to pass
   - Require branches to be up to date
   - Include administrators

## Deployment Process

### Automatic Deployment (Staging)

1. **Push to main branch** triggers:
   - CI pipeline (tests, security scans, builds)
   - Automatic deployment to staging
   - Health checks and smoke tests

### Manual Deployment (Production)

1. **Go to Actions tab** in GitHub
2. **Select "CD - Continuous Deployment"** workflow
3. **Click "Run workflow"**
4. **Select "production"** environment
5. **Click "Run workflow"**
6. **Wait for approval** (if protection rules are enabled)
7. **Monitor deployment** progress

### Release Deployment

1. **Create a git tag**:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

2. **Or use manual workflow dispatch**:
   - Go to Actions → "Release" workflow
   - Click "Run workflow"
   - Enter version (e.g., `v1.0.0`)

## Monitoring and Alerts

### Slack Notifications

The pipeline sends notifications to Slack for:
- ✅ Successful deployments
- ❌ Failed deployments
- 🚨 Security issues detected
- 🎉 Release deployments

### Health Checks

After each deployment:
- API health endpoint check
- Database connectivity test
- Redis connectivity test
- Application response time check

### Logs and Artifacts

- **Test results** are uploaded as artifacts
- **Coverage reports** are sent to Codecov
- **Security scan results** are uploaded to GitHub Security tab
- **Deployment logs** are available in GitHub Actions

## Troubleshooting

### Common Issues

#### 1. Deployment Fails

**Check:**
- SSH key permissions
- Server connectivity
- Environment variables
- Docker daemon status

**Debug:**
```bash
# Check deployment logs in GitHub Actions
# SSH to server and check:
docker-compose -f docker-compose.production.yml logs
docker-compose -f docker-compose.production.yml ps
```

#### 2. Tests Fail

**Check:**
- Test environment setup
- Database connectivity
- Test data setup
- Environment variables

**Debug:**
```bash
# Run tests locally
npm test                    # Frontend tests
dotnet test                 # Backend tests
```

#### 3. Security Scan Fails

**Check:**
- Vulnerable dependencies
- Exposed secrets
- License compliance
- Container vulnerabilities

**Fix:**
```bash
# Update dependencies
npm update                  # Frontend
dotnet add package --version latest <package>  # Backend

# Fix security issues
npm audit fix              # Frontend
dotnet list package --vulnerable  # Backend
```

#### 4. Build Fails

**Check:**
- Dockerfile syntax
- Build context
- Resource limits
- Network connectivity

**Debug:**
```bash
# Build locally
docker build -f Dockerfile.production .
docker build -f frontend/Dockerfile.production ./frontend
```

### Rollback Procedure

If deployment fails:

1. **Automatic rollback** (if configured):
   - Pipeline automatically rolls back to previous version
   - Database backup is restored
   - Services are restarted

2. **Manual rollback**:
   ```bash
   # SSH to production server
   cd /opt/smajobb
   ./scripts/deploy.sh rollback
   ```

### Performance Optimization

#### 1. Build Optimization

- Use Docker layer caching
- Parallel job execution
- Optimize Dockerfile layers
- Use multi-stage builds

#### 2. Test Optimization

- Run tests in parallel
- Use test databases
- Cache dependencies
- Skip unnecessary tests

#### 3. Deployment Optimization

- Use blue-green deployments
- Implement health checks
- Use rolling updates
- Monitor resource usage

## Best Practices

### 1. Code Quality

- Write comprehensive tests
- Use linting and formatting
- Follow coding standards
- Document changes

### 2. Security

- Regular dependency updates
- Security scanning
- Secrets management
- Access control

### 3. Monitoring

- Set up alerts
- Monitor performance
- Track errors
- Regular health checks

### 4. Documentation

- Update documentation
- Document deployment process
- Maintain runbooks
- Version control documentation

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Security Best Practices](https://docs.github.com/en/code-security)
- [Deployment Strategies](https://docs.microsoft.com/en-us/azure/devops/pipelines/release/deployment-patterns)
