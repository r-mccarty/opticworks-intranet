---
title: Infrastructure Overview
description: Verified infrastructure notes sourced from OpticWorks repos and workspace docs.
---

## Core Infrastructure (Sprites + N100)

OpticWorks development runs on **Sprites** — hardware-isolated cloud VMs purpose-built for AI agent execution. The N100 host provides supplementary services.

### Primary: Sprites

Sprites are the standard development environment. See [Agent Control Plane](/agent-control-plane/) for full documentation.

- **Fast startup** — ~1s cold start
- **Pre-configured** — Secrets, GitHub, AI tooling ready
- **Checkpointable** — Save and restore state

### Alternative: Coder Workspaces

Coder workspaces are available as an alternative for specific use cases. See [Coder Workspaces](/agent-control-plane/coder/).

- **Coder UI**: `https://coder.hardwareos.com`

### N100 Host Access

- **N100 SSH**: `ssh n100`
- **Home Assistant**: `https://ha.hardwareos.com`
- **N100 LAN IP**: `192.168.0.148`

## Services on the N100 Host

| Service | Purpose | Notes |
|---------|---------|-------|
| Coder | Workspace orchestration (Alternative) | Runs on N100 |
| Home Assistant | Smart home automation | Tunnelled via ha.hardwareos.com |
| Cloudflared | Tunnel management | N100 host |
| Docker | Container runtime | N100 host |

## N8N Deployment (Dormant)

<div class="notice-dormant">
<strong>Dormant:</strong> N8N marketing automation is not actively maintained.
</div>

N8N was deployed on N100 using Docker Compose. See [N8N Marketing Automation](/projects/n8n-marketing-automation/) for archived documentation.

## Cloudflare Infrastructure (Store + Intranet)

The OpticWorks store uses Cloudflare Workers and a Medusa backend on Hetzner. The store's deployment and architecture are documented in `opticworks-store/README.md` and `opticworks-store/docs/reference/DEPLOYMENT_GUIDE.md`.

## Sources

- `agent-harness/CLAUDE.md`
- `agent-harness/docs/n100-coder-access.md`
- `opticworks-store/docs/reference/DEPLOYMENT_GUIDE.md`
