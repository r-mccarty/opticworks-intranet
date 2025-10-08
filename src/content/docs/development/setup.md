---
title: Development Setup
description: Set up your development environment for OpticWorks projects.
---

## Prerequisites

Before starting, ensure you have:
- [ ] Company laptop set up
- [ ] GitHub account with OpticWorks organization access
- [ ] VPN access configured
- [ ] 1Password installed and configured

## Operating System Setup

### macOS (Recommended)

#### Install Homebrew
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

#### Essential Tools
```bash
# Install core development tools
brew install git node python3 postgresql redis docker

# Install useful utilities
brew install wget curl jq tree htop
```

### Linux (Ubuntu/Debian)

```bash
# Update package list
sudo apt update && sudo apt upgrade -y

# Install essential tools
sudo apt install -y git build-essential curl wget

# Install Node.js (via nvm)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

### Windows

1. Install **Windows Subsystem for Linux (WSL 2)**
2. Install **Windows Terminal**
3. Follow Linux setup instructions within WSL
4. Install **Docker Desktop for Windows**

## Development Tools

### Node.js & npm

#### Using nvm (Recommended)
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install Node.js LTS
nvm install --lts
nvm use --lts

# Verify installation
node --version
npm --version
```

#### Global npm Packages
```bash
npm install -g \
  typescript \
  ts-node \
  eslint \
  prettier \
  nodemon \
  pm2
```

### Git Configuration

```bash
# Set your identity
git config --global user.name "Your Name"
git config --global user.email "your.email@opticworks.com"

# Set default branch name
git config --global init.defaultBranch main

# Enable helpful features
git config --global pull.rebase true
git config --global fetch.prune true
git config --global core.editor "code --wait"

# Setup SSH key for GitHub
ssh-keygen -t ed25519 -C "your.email@opticworks.com"
```

Add your SSH key to GitHub:
1. Copy your public key: `cat ~/.ssh/id_ed25519.pub`
2. Go to GitHub Settings → SSH Keys
3. Click "New SSH Key" and paste

### Code Editor

#### VS Code (Recommended)
Download from: [code.visualstudio.com](https://code.visualstudio.com)

**Essential Extensions:**
```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension eamodio.gitlens
code --install-extension ms-azuretools.vscode-docker
code --install-extension bradlc.vscode-tailwindcss
code --install-extension prisma.prisma
code --install-extension ms-vscode.vscode-typescript-next
```

**Settings (settings.json):**
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.updateImportsOnFileMove.enabled": "always"
}
```

### Docker

#### macOS
```bash
brew install --cask docker
```

#### Linux
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install docker-compose-plugin
```

Verify installation:
```bash
docker --version
docker compose version
```

### Database Tools

#### PostgreSQL
```bash
# macOS
brew install postgresql@15
brew services start postgresql@15

# Linux
sudo apt install postgresql postgresql-contrib
```

#### Database Client
- **GUI:** [TablePlus](https://tableplus.com/) (recommended)
- **CLI:** `psql` (included with PostgreSQL)
- **VS Code Extension:** PostgreSQL by Microsoft

### API Testing

#### Postman
Download from: [postman.com/downloads](https://www.postman.com/downloads/)

**Company Workspace:**
- Join OpticWorks team workspace
- Import shared collections
- Set up environment variables

#### Alternative: HTTPie
```bash
# macOS
brew install httpie

# Linux
sudo apt install httpie
```

## Project-Specific Setup

### Clone Repositories

```bash
# Create workspace directory
mkdir -p ~/workspace/opticworks
cd ~/workspace/opticworks

# Clone main projects
git clone git@github.com:opticworks/platform.git
git clone git@github.com:opticworks/web-app.git
git clone git@github.com:opticworks/mobile-app.git
```

### Environment Variables

Each project requires environment variables:

```bash
# Copy example env file
cp .env.example .env

# Edit with your values
code .env
```

:::tip
Store sensitive credentials in 1Password, not in `.env` files committed to git!
:::

### Install Dependencies

```bash
# For Node.js projects
npm install

# Or if using yarn
yarn install
```

### Database Setup

```bash
# Create local database
createdb opticworks_dev

# Run migrations
npm run db:migrate

# Seed database with test data
npm run db:seed
```

### Start Development Server

```bash
# Standard start
npm run dev

# With debugging
npm run dev:debug

# Watch mode with auto-reload
npm run dev:watch
```

The app should now be running at `http://localhost:3000`

## Environment Configuration

### Required Services

#### Redis (for caching and queues)
```bash
# macOS
brew install redis
brew services start redis

# Linux
sudo apt install redis-server
sudo systemctl start redis
```

#### Message Queue (RabbitMQ)
```bash
# Using Docker (recommended)
docker run -d --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
```

### Environment Variables Template

```bash
# Database
DATABASE_URL="postgresql://localhost:5432/opticworks_dev"

# Redis
REDIS_URL="redis://localhost:6379"

# API Keys (get from 1Password)
API_SECRET_KEY="<from-1password>"
STRIPE_SECRET_KEY="<from-1password>"

# External Services
AWS_ACCESS_KEY_ID="<from-1password>"
AWS_SECRET_ACCESS_KEY="<from-1password>"

# Feature Flags
ENABLE_NEW_FEATURE=true
DEBUG_MODE=true
```

## Testing Your Setup

### Run Tests
```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# All tests
npm run test:all
```

### Linting & Formatting
```bash
# Check code style
npm run lint

# Fix auto-fixable issues
npm run lint:fix

# Format code
npm run format
```

### Build Project
```bash
# Development build
npm run build:dev

# Production build
npm run build
```

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Node Modules Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Docker Issues
```bash
# Reset Docker
docker system prune -a

# Restart Docker service
# macOS: Restart Docker Desktop
# Linux: sudo systemctl restart docker
```

### Database Connection Issues
```bash
# Check PostgreSQL is running
# macOS: brew services list
# Linux: sudo systemctl status postgresql

# Test connection
psql -h localhost -U postgres
```

## Development Workflow

### Daily Workflow
1. Start development services
   ```bash
   docker compose up -d
   ```

2. Pull latest changes
   ```bash
   git pull origin main
   ```

3. Install any new dependencies
   ```bash
   npm install
   ```

4. Run migrations if needed
   ```bash
   npm run db:migrate
   ```

5. Start dev server
   ```bash
   npm run dev
   ```

### Before Committing
```bash
# Run pre-commit checks
npm run lint
npm run format
npm test
```

## Additional Resources

- [Git Workflow](/development/git-workflow/)
- [Code Standards](/development/standards/)
- [IT Software List](/it/software/)
- [IT Support](/it/support/)

## Getting Help

- **Slack:** #engineering channel
- **Documentation:** Internal wiki
- **Code reviews:** Ask senior developers
- **Pair programming:** Schedule time with teammates

## Next Steps

1. ✅ Complete this setup guide
2. Read [Code Standards](/development/standards/)
3. Review [Git Workflow](/development/git-workflow/)
4. Pick up your first task from Jira
5. Submit your first pull request!

Welcome to the OpticWorks development team! 🚀
