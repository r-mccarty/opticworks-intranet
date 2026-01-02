---
title: Infrastructure Overview
description: Verified infrastructure notes sourced from OpticWorks repos and workspace docs.
---

## Core Infrastructure (Coder + N100)

OpticWorks development workspaces run on an N100 host with Coder, privileged device access, and host networking. Key facts:

- **Coder UI**: `https://coder.hardwareos.com`
- **N100 SSH**: `ssh n100`
- **Home Assistant**: `https://ha.hardwareos.com`
- **N100 LAN IP**: `192.168.0.148`

These details are maintained in `agent-harness/docs/n100-coder-access.md`.

## Services on the N100 Host

From `agent-harness/AGENTS.md`:

| Service | Purpose | Notes |
|---------|---------|-------|
| Coder | Workspace orchestration | Runs on N100 | 
| Home Assistant | Smart home automation | Tunnelled via ha.hardwareos.com |
| N8N | Marketing automation | https://n8n.optic.works |
| Tweet API shim | X OAuth shim for N8N | localhost-only on N100 |
| Cloudflared | Tunnel management | N100 host | 
| Docker | Container runtime | N100 host |

## N8N Deployment (Marketing Automation)

N8N is deployed on N100 using Docker Compose. See `n8n-marketing-automation/SETUP.md` for full details. Key operations:

```bash
ssh n100
cd /opt/n8n
docker compose up -d

docker compose logs -f
```

The Tweet API shim service runs as a systemd unit and listens on `127.0.0.1:5680` (documented in `n8n-marketing-automation/README.md`).

## Cloudflare Infrastructure (Store + Intranet)

The OpticWorks store uses Cloudflare Workers and a Medusa backend on Hetzner. The store's deployment and architecture are documented in `opticworks-store/README.md` and `opticworks-store/docs/reference/DEPLOYMENT_GUIDE.md`.

## Sources

- `agent-harness/AGENTS.md`
- `agent-harness/docs/n100-coder-access.md`
- `n8n-marketing-automation/README.md`
- `n8n-marketing-automation/SETUP.md`
- `opticworks-store/README.md`
- `opticworks-store/docs/reference/DEPLOYMENT_GUIDE.md`
