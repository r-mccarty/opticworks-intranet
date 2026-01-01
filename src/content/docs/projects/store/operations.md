---
title: Store Deployment & Operations
description: Deployment procedures and operational runbooks for the OpticWorks Store
---

This guide covers deployment procedures, monitoring, and operational tasks for the OpticWorks Store.

## Infrastructure Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      Production Infrastructure                   │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                    Cloudflare                              │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │ │
│  │  │   Workers   │  │   Images    │  │   R2 Storage    │   │ │
│  │  │ (Storefront)│  │  (Assets)   │  │   (Backups)     │   │ │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘   │ │
│  └───────────────────────────────────────────────────────────┘ │
│                            │                                    │
│                            ▼                                    │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │                     Hetzner Cloud                          │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │ │
│  │  │   Medusa    │  │ PostgreSQL  │  │     Redis       │   │ │
│  │  │    API      │  │    17       │  │      7          │   │ │
│  │  │  (2 vCPU)   │  │  (4 vCPU)   │  │   (2 vCPU)      │   │ │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘   │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Deployment Procedures

### Storefront Deployment

The storefront deploys automatically on push to `main`:

```yaml
# .github/workflows/deploy-storefront.yml
name: Deploy Storefront

on:
  push:
    branches: [main]
    paths:
      - 'apps/storefront/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm build:frontend
        env:
          NEXT_PUBLIC_MEDUSA_BACKEND_URL: ${{ secrets.MEDUSA_URL }}

      - name: Deploy to Cloudflare
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CF_API_TOKEN }}
          workingDirectory: apps/storefront
```

### Backend Deployment

Backend deployments use Ansible:

```bash
# Deploy to staging
cd infra/ansible
ansible-playbook deploy.yml -i inventory/staging.yml

# Deploy to production
ansible-playbook deploy.yml -i inventory/production.yml --ask-vault-pass
```

**Deployment Playbook:**

```yaml
# infra/ansible/deploy.yml
- hosts: medusa
  become: yes
  vars:
    app_dir: /opt/medusa

  tasks:
    - name: Pull latest code
      git:
        repo: 'https://github.com/r-mccarty/opticworks-store.git'
        dest: '{{ app_dir }}'
        version: 'main'

    - name: Install dependencies
      command: pnpm install --frozen-lockfile
      args:
        chdir: '{{ app_dir }}/packages/medusa-backend'

    - name: Run migrations
      command: pnpm medusa migrations run
      args:
        chdir: '{{ app_dir }}/packages/medusa-backend'

    - name: Build
      command: pnpm build
      args:
        chdir: '{{ app_dir }}/packages/medusa-backend'

    - name: Restart service
      systemd:
        name: medusa
        state: restarted
```

## Environment Configuration

### Staging

| Component | Value |
|-----------|-------|
| Storefront | staging.optic.works |
| API | api-staging.optic.works |
| Database | medusa-staging |
| Stripe | Test mode |

### Production

| Component | Value |
|-----------|-------|
| Storefront | optic.works |
| API | api.optic.works |
| Database | medusa-production |
| Stripe | Live mode |

## Monitoring

### Health Checks

```bash
# API health check
curl https://api.optic.works/health

# Expected response:
{
  "status": "ok",
  "database": "connected",
  "redis": "connected"
}
```

### Metrics Dashboard

Access Grafana at: https://metrics.optic.works

**Key Dashboards:**
- API Performance
- Database Metrics
- Order Funnel
- Error Rates

### Alerts

| Alert | Threshold | Action |
|-------|-----------|--------|
| API Error Rate | >1% | Page on-call |
| Response Time | >2s (p95) | Investigate |
| Database Connections | >80% | Scale up |
| Disk Usage | >80% | Clean up / expand |
| Payment Failures | >5% | Investigate immediately |

## Database Operations

### Backups

Automated daily backups to Cloudflare R2:

```bash
# Manual backup
ssh medusa-prod 'pg_dump -Fc medusa > /tmp/backup.dump'
scp medusa-prod:/tmp/backup.dump ./backups/

# List backups
aws s3 ls s3://opticworks-backups/medusa/ --endpoint-url https://xxx.r2.cloudflarestorage.com
```

### Restore from Backup

```bash
# Download backup
aws s3 cp s3://opticworks-backups/medusa/2024-01-15.dump ./backup.dump \
  --endpoint-url https://xxx.r2.cloudflarestorage.com

# Restore (CAUTION: destructive)
ssh medusa-prod 'pg_restore -d medusa -c backup.dump'
```

### Migrations

```bash
# Check migration status
ssh medusa-prod 'cd /opt/medusa && pnpm medusa migrations show'

# Run pending migrations
ssh medusa-prod 'cd /opt/medusa && pnpm medusa migrations run'

# Rollback (if needed)
ssh medusa-prod 'cd /opt/medusa && pnpm medusa migrations revert'
```

## Incident Response

### Severity Levels

| Level | Description | Response Time |
|-------|-------------|---------------|
| SEV1 | Site down, payments failing | Immediate |
| SEV2 | Major feature broken | 1 hour |
| SEV3 | Minor issue, workaround exists | 4 hours |
| SEV4 | Cosmetic / low impact | Next business day |

### SEV1 Runbook

1. **Acknowledge** - Respond in #incidents Slack channel
2. **Assess** - Check monitoring dashboards
3. **Communicate** - Update status page
4. **Mitigate** - Apply quick fix or rollback
5. **Resolve** - Permanent fix
6. **Post-mortem** - Document and learn

### Common Issues

#### Payments Failing

1. Check Stripe dashboard for errors
2. Verify webhook secret is correct
3. Check Hookdeck for failed deliveries
4. Review Medusa logs: `journalctl -u medusa -f`

#### Slow Response Times

1. Check database connections: `SELECT count(*) FROM pg_stat_activity`
2. Check Redis memory: `redis-cli INFO memory`
3. Review slow query log
4. Check for background job backlog

#### 500 Errors

1. Check Medusa logs: `journalctl -u medusa -f`
2. Check recent deployments
3. Verify environment variables
4. Check database connectivity

## Common Operations

### Add New Product

1. Log into Admin: https://api.optic.works/admin
2. Navigate to Products → Add Product
3. Fill in details, add images
4. Set pricing and inventory
5. Publish

### Process Refund

1. Find order in Admin
2. Click "Refund" button
3. Select items and amount
4. Add internal note
5. Confirm refund

### Generate Shipping Label

1. Find order in Admin
2. Click "Create Fulfillment"
3. Select shipping rate
4. Buy label
5. Print label

### Update Inventory

```bash
# Via Admin UI
# Products → [Product] → Variants → Edit Inventory

# Via API
curl -X POST https://api.optic.works/admin/inventory-items/inv_123 \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{"quantity": 100}'
```

## Scaling

### Horizontal Scaling

```bash
# Add more Medusa instances
ansible-playbook scale.yml -e "medusa_instances=3"

# Update load balancer
ansible-playbook update-lb.yml
```

### Database Scaling

For high load:
1. Enable read replicas
2. Configure connection pooling (PgBouncer)
3. Add more memory to primary

### Cache Optimization

```bash
# Clear Redis cache
redis-cli -h redis.optic.works FLUSHDB

# Check cache hit rate
redis-cli -h redis.optic.works INFO stats | grep keyspace
```

## Maintenance Windows

### Scheduled Maintenance

1. Post notice on status page (24h advance)
2. Enable maintenance mode:
   ```bash
   ssh storefront 'echo "maintenance" > /opt/storefront/.maintenance'
   ```
3. Perform maintenance
4. Disable maintenance mode:
   ```bash
   ssh storefront 'rm /opt/storefront/.maintenance'
   ```
5. Update status page

### Zero-Downtime Deploys

1. Deploy to canary instance first
2. Run health checks
3. Gradually shift traffic (10% → 50% → 100%)
4. Monitor error rates
5. Rollback if issues detected

## Access Management

### SSH Access

```bash
# Add to ~/.ssh/config
Host medusa-prod
  HostName 1.2.3.4
  User deploy
  IdentityFile ~/.ssh/opticworks

# Connect
ssh medusa-prod
```

### Admin Access

Request via IT ticket. Access levels:
- **Viewer**: Can view orders and products
- **Editor**: Can modify products and fulfill orders
- **Admin**: Full access including settings

## Contacts

| Role | Contact | Escalation |
|------|---------|------------|
| On-Call Engineer | PagerDuty | Automatic |
| Engineering Lead | @ryan | For SEV1/2 |
| Product | @product | Order issues |
| Finance | @finance | Payment issues |
