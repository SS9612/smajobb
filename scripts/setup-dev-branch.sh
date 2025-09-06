#!/bin/bash

# Smajobb Development Branch Setup Script
# This script sets up the development environment and branches

set -e

echo "🚀 Setting up Smajobb development environment..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo " Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit: Smajobb project setup"
fi

# Create and switch to develop branch
echo "🌿 Creating develop branch..."
git checkout -b develop 2>/dev/null || git checkout develop

# Create feature branch structure
echo "🌱 Setting up feature branch structure..."
git checkout -b feature/initial-setup 2>/dev/null || echo "Feature branch already exists"

# Switch back to develop
git checkout develop

echo "✅ Development environment setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Push to GitHub: git remote add origin <your-repo-url>"
echo "2. Push branches: git push -u origin main && git push -u origin develop"
echo "3. Configure branch protection rules in GitHub"
echo "4. Set up GitHub Secrets as documented in .github/SECRETS.md"
echo "5. Run: docker-compose up -d"
echo ""
echo "🎯 Current branch: $(git branch --show-current)"
