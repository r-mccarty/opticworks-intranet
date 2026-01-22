---
title: N8N Marketing Automation
description: N100-hosted N8N deployment and Tweet API shim.
---

<div class="notice-dormant">
<strong>Dormant Project:</strong> N8N marketing automation is not actively maintained. The infrastructure remains available but is not a current priority. Contact the team before making changes.
</div>

The `n8n-marketing-automation` repo contains the Docker Compose deployment for OpticWorks marketing automation on the N100 host.

## Deployment (Verified)

From `n8n-marketing-automation/README.md` and `SETUP.md`:

```bash
ssh n100
sudo mkdir -p /opt/n8n
cd /opt/n8n

git clone https://github.com/r-mccarty/n8n-marketing-automation.git .
cp .env.example .env

docker compose up -d
```

## Tweet API Shim (Verified)

The Tweet API shim runs as a systemd service on N100 and listens on `127.0.0.1:5680`.

```bash
ssh n100 "sudo systemctl status tweet-api"
```

## Sources

- `n8n-marketing-automation/README.md`
- `n8n-marketing-automation/SETUP.md`
- `n8n-marketing-automation/docs/tweet-api-shim.md`

## Diagrams

### N8N Deployment (N100)

```
GitHub repo -> /opt/n8n -> docker compose up
        |
   Cloudflared tunnel
        |
   https://n8n.optic.works
```

### Tweet API Shim

```
N8N workflow -> HTTP -> tweet-api (localhost:5680) -> X API
```

### Ops Loop

```
Update repo -> docker compose pull -> docker compose up -d
```
