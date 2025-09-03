# Smajobb Development Branch Setup Script (PowerShell)
# This script sets up the development environment and branches

Write-Host "🚀 Setting up Smajobb development environment..." -ForegroundColor Green

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "📁 Initializing git repository..." -ForegroundColor Yellow
    git init
    git add .
    git commit -m "Initial commit: Smajobb project setup"
}

# Create and switch to develop branch
Write-Host "🌿 Creating develop branch..." -ForegroundColor Yellow
try {
    git checkout -b develop
} catch {
    git checkout develop
}

# Create feature branch structure
Write-Host "🌱 Setting up feature branch structure..." -ForegroundColor Yellow
try {
    git checkout -b feature/initial-setup
} catch {
    Write-Host "Feature branch already exists" -ForegroundColor Blue
}

# Switch back to develop
git checkout develop

Write-Host "✅ Development environment setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Push to GitHub: git remote add origin <your-repo-url>" -ForegroundColor White
Write-Host "2. Push branches: git push -u origin main && git push -u origin develop" -ForegroundColor White
Write-Host "3. Configure branch protection rules in GitHub" -ForegroundColor White
Write-Host "4. Set up GitHub Secrets as documented in .github/SECRETS.md" -ForegroundColor White
Write-Host "5. Run: docker-compose up -d" -ForegroundColor White
Write-Host ""
Write-Host "🎯 Current branch: $(git branch --show-current)" -ForegroundColor Magenta
