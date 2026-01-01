---
title: Infisical Secret Management
description: How to use Infisical for managing secrets and environment variables at OpticWorks
---

OpticWorks uses [Infisical](https://infisical.com) for centralized secret management across all projects and environments. This guide covers how to access, use, and manage secrets.

## What is Infisical?

Infisical is a secret management platform that provides:

- **Centralized secrets storage** - One place for all credentials
- **Environment separation** - Dev, staging, production secrets
- **Access control** - Role-based permissions per project
- **Audit logging** - Track who accessed what and when
- **Secret rotation** - Automatic credential rotation
- **CLI & SDK integration** - Easy local development

## Getting Access

### New Employee Setup

1. You'll receive an Infisical invite to your @optic.works email
2. Create your account at [app.infisical.com](https://app.infisical.com)
3. Enable 2FA (required)
4. Request project access from your team lead

### Access Levels

| Role | Permissions |
|------|-------------|
| **Viewer** | Read secrets (most engineers) |
| **Developer** | Read + update non-production |
| **Admin** | Full access including production |
| **Owner** | Project settings and member management |

## Projects Overview

| Project | Description | Who Has Access |
|---------|-------------|----------------|
| `opticworks-store` | Store backend secrets | Web team |
| `hardwareos` | Firmware signing keys | Hardware team |
| `presence-engine` | Home Assistant test credentials | OSS team |
| `infrastructure` | Hetzner, Cloudflare API keys | Platform team |

## Using Infisical

### Web Dashboard

Access at: [app.infisical.com](https://app.infisical.com)

1. Select your project
2. Choose environment (Development, Staging, Production)
3. View/edit secrets
4. Copy values or download as `.env`

### CLI Installation

```bash
# macOS
brew install infisical/get-cli/infisical

# Linux
curl -1sLf 'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.deb.sh' | sudo -E bash
sudo apt-get update && sudo apt-get install -y infisical

# Verify installation
infisical --version
```

### CLI Login

```bash
# Login with browser (recommended)
infisical login

# Login with service token (for CI/CD)
export INFISICAL_TOKEN="st.xxx..."
```

### Fetching Secrets

```bash
# Navigate to project directory
cd ~/workspace/opticworks-store

# Initialize Infisical for this project
infisical init

# Run command with secrets injected
infisical run -- npm run dev

# Export secrets to .env file (for development only)
infisical export --env=dev > .env.local
```

### Common Commands

```bash
# List all secrets in current environment
infisical secrets

# Get a specific secret
infisical secrets get DATABASE_URL

# Set a secret (requires write access)
infisical secrets set API_KEY=new-value

# Switch environments
infisical secrets --env=staging

# Run with specific environment
infisical run --env=production -- node script.js
```

## Project Setup

### Linking a Repository

1. Navigate to your project directory
2. Run `infisical init`
3. Select your workspace and project
4. Choose default environment

This creates `.infisical.json`:

```json
{
  "workspaceId": "abc123...",
  "defaultEnvironment": "dev",
  "gitBranchToEnvironmentMapping": {
    "main": "prod",
    "develop": "staging",
    "*": "dev"
  }
}
```

### .gitignore

Ensure these are in your `.gitignore`:

```gitignore
# Infisical
.env
.env.local
.env.*.local
.infisical.json
```

## Environment Workflow

### Development

```bash
# Fetch dev secrets and run locally
infisical run --env=dev -- npm run dev
```

### Staging

```bash
# Test with staging secrets
infisical run --env=staging -- npm run test:integration
```

### Production

Production secrets require elevated access:

```bash
# Only available to admins
infisical run --env=prod -- node scripts/migrate.js
```

## CI/CD Integration

### GitHub Actions

Add the Infisical service token as a GitHub secret:

```yaml
# .github/workflows/deploy.yml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install Infisical CLI
        run: |
          curl -1sLf 'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.deb.sh' | sudo -E bash
          sudo apt-get install -y infisical

      - name: Deploy with secrets
        env:
          INFISICAL_TOKEN: ${{ secrets.INFISICAL_TOKEN }}
        run: |
          infisical run --env=prod -- ./deploy.sh
```

### Service Tokens

Create machine identity tokens for CI/CD:

1. Go to Project Settings → Machine Identities
2. Create new identity for the environment
3. Copy the token
4. Add to GitHub Secrets as `INFISICAL_TOKEN`

## Secret Organization

### Naming Conventions

| Pattern | Example | Usage |
|---------|---------|-------|
| `SERVICE_CREDENTIAL` | `STRIPE_SECRET_KEY` | Third-party API keys |
| `DATABASE_*` | `DATABASE_URL` | Database connections |
| `REDIS_*` | `REDIS_URL` | Cache connections |
| `*_WEBHOOK_SECRET` | `STRIPE_WEBHOOK_SECRET` | Webhook verification |
| `FEATURE_*` | `FEATURE_NEW_CHECKOUT` | Feature flags |

### Folder Structure

Organize secrets by category:

```
project-secrets/
├── database/
│   ├── DATABASE_URL
│   └── DATABASE_POOL_SIZE
├── redis/
│   └── REDIS_URL
├── stripe/
│   ├── STRIPE_SECRET_KEY
│   └── STRIPE_WEBHOOK_SECRET
├── easypost/
│   ├── EASYPOST_API_KEY
│   └── EASYPOST_WEBHOOK_SECRET
└── internal/
    ├── JWT_SECRET
    └── COOKIE_SECRET
```

## Secret Rotation

### Automatic Rotation

Some secrets are rotated automatically:

| Secret | Rotation Period | Method |
|--------|-----------------|--------|
| Database passwords | 90 days | Automatic |
| API keys | On-demand | Manual trigger |
| JWT secrets | 30 days | Automatic |

### Manual Rotation

For third-party services:

1. Generate new key in service dashboard (Stripe, EasyPost, etc.)
2. Update secret in Infisical (all environments)
3. Deploy changes
4. Revoke old key in service dashboard

## Access Audit

### Viewing Audit Logs

1. Go to Project → Audit Logs
2. Filter by user, secret, or date
3. Export for compliance if needed

### What's Logged

- Secret reads (who, when, which environment)
- Secret updates (old hash, new hash)
- Permission changes
- Login attempts

## Security Best Practices

### Do

- Use `infisical run` instead of exporting to `.env`
- Use environment-specific secrets
- Rotate secrets when team members leave
- Use service tokens for CI/CD (not personal tokens)
- Enable 2FA on your account

### Don't

- Commit `.env` files to git
- Share secrets via Slack/email
- Use production secrets locally
- Store secrets in code comments
- Use the same secret across environments

## Troubleshooting

### "Secret not found"

```bash
# Check you're in the right environment
infisical secrets --env=dev

# Verify project initialization
cat .infisical.json
```

### "Permission denied"

1. Verify your role in the project
2. Request access from project admin
3. Re-login: `infisical login`

### "Token expired"

```bash
# Re-authenticate
infisical login

# For CI/CD, generate new service token
```

### Syncing Issues

```bash
# Force refresh secrets
infisical secrets --force-refresh
```

## Emergency Procedures

### Compromised Secret

1. **Rotate immediately** in Infisical
2. **Deploy** affected services
3. **Revoke** old credential in third-party service
4. **Notify** #security channel
5. **Document** in incident log

### Lost Access

1. Contact Platform team in #platform
2. Provide your @optic.works email
3. Access will be restored within 1 hour

## Related Resources

- [Infisical Documentation](https://infisical.com/docs)
- [Infrastructure Overview](/it/infrastructure/)
- [Security Guidelines](/it/security/)
- [Development Setup](/development/setup/)
