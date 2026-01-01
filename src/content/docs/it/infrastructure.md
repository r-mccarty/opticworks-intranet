---
title: Infrastructure Overview
description: Overview of OpticWorks cloud infrastructure, hosting, and services
---

OpticWorks uses a multi-cloud infrastructure strategy optimized for performance, cost, and reliability. This page provides an overview of our infrastructure components and how they work together.

## Infrastructure Map

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          OpticWorks Infrastructure                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│    ┌─────────────────────────────────────────────────────────────────┐     │
│    │                     Cloudflare (Edge Layer)                      │     │
│    │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────────────┐│     │
│    │  │  Workers  │ │    R2     │ │  Images   │ │      Access       ││     │
│    │  │Storefront │ │  Storage  │ │   CDN     │ │   (Zero Trust)    ││     │
│    │  └───────────┘ └───────────┘ └───────────┘ └───────────────────┘│     │
│    └─────────────────────────────────────────────────────────────────┘     │
│                                    │                                        │
│                                    ▼                                        │
│    ┌─────────────────────────────────────────────────────────────────┐     │
│    │                   Hetzner Cloud (Compute Layer)                  │     │
│    │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────────────┐│     │
│    │  │  Medusa   │ │PostgreSQL │ │   Redis   │ │    Staging        ││     │
│    │  │   API     │ │    17     │ │     7     │ │   Instances       ││     │
│    │  │ (CX21)    │ │  (CX31)   │ │  (CX11)   │ │                   ││     │
│    │  └───────────┘ └───────────┘ └───────────┘ └───────────────────┘│     │
│    └─────────────────────────────────────────────────────────────────┘     │
│                                                                             │
│    ┌─────────────────────────────────────────────────────────────────┐     │
│    │                    Third-Party Services                          │     │
│    │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────────────┐│     │
│    │  │  Stripe   │ │ EasyPost  │ │  Resend   │ │    Hookdeck       ││     │
│    │  │ Payments  │ │ Shipping  │ │  Email    │ │    Webhooks       ││     │
│    │  └───────────┘ └───────────┘ └───────────┘ └───────────────────┘│     │
│    └─────────────────────────────────────────────────────────────────┘     │
│                                                                             │
│    ┌─────────────────────────────────────────────────────────────────┐     │
│    │                   Internal Services                              │     │
│    │  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────────────┐│     │
│    │  │ Infisical │ │  GitHub   │ │ PagerDuty │ │    Grafana        ││     │
│    │  │  Secrets  │ │  Actions  │ │  Alerts   │ │   Monitoring      ││     │
│    │  └───────────┘ └───────────┘ └───────────┘ └───────────────────┘│     │
│    └─────────────────────────────────────────────────────────────────┘     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Cloudflare Services

We use Cloudflare as our edge layer for CDN, compute, and security.

### Cloudflare Workers

| Application | Purpose | URL |
|-------------|---------|-----|
| Storefront | Next.js e-commerce frontend | optic.works |
| Intranet | Internal documentation | intranet.optic.works |
| API Gateway | Rate limiting & routing | api-edge.optic.works |

**Why Workers?**
- Global edge deployment (sub-50ms latency worldwide)
- Zero cold starts
- Integrated with other Cloudflare services
- Cost-effective for our traffic patterns

### Cloudflare R2 (Object Storage)

| Bucket | Purpose | Access |
|--------|---------|--------|
| `opticworks-assets` | Product images, static assets | Public (CDN) |
| `opticworks-backups` | Database backups | Private |
| `opticworks-firmware` | Firmware binaries | Private (signed URLs) |
| `opticworks-intranet` | Intranet static site | Cloudflare Access |

**R2 vs S3:**
- No egress fees (major cost savings)
- S3-compatible API
- Integrated with Workers

### Cloudflare Access (Zero Trust)

Protects internal applications without VPN:

| Application | Auth Method | Access |
|-------------|-------------|--------|
| Intranet | Google Workspace | @optic.works emails |
| Admin Dashboard | Google Workspace + MFA | Engineering team |
| Grafana | Google Workspace | Platform team |

**Setup:**
1. Access is enforced at Cloudflare edge
2. Users authenticate via Google Workspace
3. Session tokens are validated on each request

### Cloudflare Images

- Automatic image optimization
- WebP/AVIF conversion
- Responsive variants
- Used for product images on optic.works

## Hetzner Cloud

Our primary compute provider for backend services.

### Why Hetzner?

| Factor | Hetzner | AWS/GCP |
|--------|---------|---------|
| Cost | ~70% cheaper | Baseline |
| Performance | Excellent (AMD EPYC) | Excellent |
| EU Data Residency | Yes (Germany) | Complex |
| Simplicity | Very simple | Complex |

### Server Inventory

| Server | Spec | Purpose | Location |
|--------|------|---------|----------|
| `medusa-prod-1` | CX21 (2 vCPU, 4GB) | Medusa API | Falkenstein |
| `db-prod-1` | CX31 (4 vCPU, 8GB) | PostgreSQL 17 | Falkenstein |
| `redis-prod-1` | CX11 (1 vCPU, 2GB) | Redis 7 | Falkenstein |
| `medusa-staging` | CX11 (1 vCPU, 2GB) | Staging environment | Falkenstein |

### Access

```bash
# SSH access (requires VPN or Cloudflare WARP)
ssh deploy@medusa-prod-1.optic.works

# SSH config (~/.ssh/config)
Host *.optic.works
    User deploy
    IdentityFile ~/.ssh/opticworks
    ProxyJump bastion.optic.works
```

### Networking

- Private network between all servers (`10.0.0.0/24`)
- Firewall rules managed via Hetzner Cloud Console
- External access only via bastion or Cloudflare Tunnel

## Database Infrastructure

### PostgreSQL 17

**Production:**
- Server: `db-prod-1` (CX31)
- Daily automated backups to R2
- Point-in-time recovery enabled
- Connection pooling via PgBouncer

**Connection:**
```bash
# Via bastion (production)
psql -h db-prod-1.internal -U medusa -d medusa_production

# Direct (staging only)
psql -h db-staging.optic.works -U medusa -d medusa_staging
```

### Redis 7

**Used for:**
- Session storage
- API rate limiting
- Background job queues
- Cache layer

**Connection:**
```bash
redis-cli -h redis-prod-1.internal -p 6379
```

## Secret Management (Infisical)

All secrets are stored and managed in Infisical. See [Infisical Guide](/it/infisical/) for detailed usage.

**Key Points:**
- No secrets in git repositories
- Environment-specific secret sets
- Automatic rotation for critical credentials
- Audit logging for compliance

## CI/CD Infrastructure

### GitHub Actions

All repositories use GitHub Actions for CI/CD:

| Workflow | Trigger | Actions |
|----------|---------|---------|
| `ci.yml` | PR opened | Lint, test, build |
| `deploy-staging.yml` | Push to develop | Deploy to staging |
| `deploy-production.yml` | Push to main | Deploy to production |
| `backup.yml` | Daily schedule | Database backup |

**Self-Hosted Runners:**
- Located on N100 nodes in the office
- Used for hardware testing (RS-1, ESP32)
- Faster builds for large projects

### Deployment Flow

```
Developer Push
      │
      ▼
GitHub Actions
      │
      ├─── Lint & Test
      │
      ├─── Build Artifacts
      │
      ├─── Deploy to Staging
      │         │
      │         ▼
      │    Staging Tests
      │
      └─── Deploy to Production
                │
                ▼
          Health Checks
```

## Monitoring & Alerting

### Grafana

- **URL:** grafana.optic.works
- **Access:** Platform team via Cloudflare Access
- **Dashboards:** API performance, database metrics, infrastructure

### PagerDuty

- **Critical alerts:** API errors, database issues, payment failures
- **Warning alerts:** High latency, disk usage
- **On-call rotation:** Weekly, see #ops-oncall channel

### Uptime Monitoring

- Cloudflare health checks for all public endpoints
- Internal health endpoints at `/health` on each service
- Slack notifications for status changes

## Network Architecture

```
                    Internet
                        │
                        ▼
              ┌─────────────────┐
              │   Cloudflare    │
              │   (WAF + CDN)   │
              └────────┬────────┘
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
┌─────────────────┐       ┌─────────────────┐
│  Cloudflare     │       │    Hetzner      │
│  Workers        │       │  (via Tunnel)   │
│  (Storefront)   │       │                 │
└─────────────────┘       └────────┬────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
                    ▼              ▼              ▼
              ┌──────────┐  ┌──────────┐  ┌──────────┐
              │  Medusa  │  │PostgreSQL│  │  Redis   │
              │   API    │  │          │  │          │
              └──────────┘  └──────────┘  └──────────┘
                    │
                    │ Private Network
                    │ (10.0.0.0/24)
```

## Cost Overview

| Service | Monthly Cost | Purpose |
|---------|--------------|---------|
| Hetzner Cloud | ~$50 | Compute, databases |
| Cloudflare | ~$25 | Workers, R2, Access |
| GitHub | $21/user | Repository hosting |
| Infisical | $18/user | Secret management |
| PagerDuty | ~$30 | Alerting |
| **Total** | ~$150 + per-user | |

## Access Requests

| Need Access To | Request Via | Approver |
|----------------|-------------|----------|
| Hetzner Cloud Console | IT Ticket | Platform Lead |
| Cloudflare Dashboard | IT Ticket | Platform Lead |
| Production SSH | IT Ticket | Engineering Lead |
| Grafana | Automatic | (Cloudflare Access) |

## Related Documentation

- [Infisical Secret Management](/it/infisical/)
- [Development Hardware](/it/hardware/)
- [Store Operations](/projects/store/operations/)
- [hardwareOS Deployment](/projects/hardware-os/deployment/)
