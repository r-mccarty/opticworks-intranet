---
title: Fleet Manager
description: Pull-based fleet monitoring from N100 hardware - independent oversight of all sprites.
---

The **Fleet Manager** is a pull-based fleet monitoring system that runs on the N100 server (user-controlled hardware) via Cloudflare tunnel. It provides reliable sprite fleet oversight independent of sprites.dev availability.

## Why Fleet Manager?

Sprites are beta infrastructure. We've encountered issues where:
- A sprite vanished without warning
- An agent became unresponsive and couldn't be diagnosed remotely
- Using sprites to manage sprites creates a single point of failure

**Solution**: Run fleet oversight from N100 hardware we control. This provides:

| Benefit | Description |
|---------|-------------|
| **Independent monitoring** | Doesn't rely on sprites.dev being up |
| **User-controlled hardware** | We own the N100 |
| **Reliable cron checks** | Every 15 minutes, automatically |
| **Fleet-wide operations** | Execute commands across all sprites at once |

## Naming Convention

Sprites use semantic naming: `{team}-{role}-{id}`

| Semantic Name | Legacy API Name | Team |
|---------------|-----------------|------|
| `agents-review-claude-01` | hammer | agents |
| `agents-review-codex-01` | anvil | agents |
| `agents-synth-01` | forge | agents |
| `dev-workspace-01` | mallet | dev |
| `infra-bootstrap-01` | test-sprite | infra |
| `mobile-conductor-01` | sprite-mobile-conductor | mobile |
| `mobile-worker-01` | sprite-mobile-worker-1 | mobile |
| `mobile-worker-02` | sprite-mobile-worker-2 | mobile |

## Commands

### Check Fleet Status

```bash
$ fleet status
Fleet Status (8 sprites)
==========================================================================================
Sprite                     (API Name)      Status   Resp   ms       Claude
------------------------------------------------------------------------------------------
agents-review-claude-01    (hammer)        warm     yes    169      yes
agents-review-codex-01     (anvil)         warm     yes    223      yes
agents-synth-01            (forge)         warm     yes    150      yes
dev-workspace-01           (mallet)        warm     yes    184      yes
infra-bootstrap-01         (test-sprite)   warm     yes    160      yes
mobile-conductor-01        (sprite-mobile-conductor) warm yes 123   yes
mobile-worker-01           (sprite-mobile-worker-1) warm  yes 115   yes
mobile-worker-02           (sprite-mobile-worker-2) warm  yes 190   yes
------------------------------------------------------------------------------------------
Total: 8 | Healthy: 8 | Unhealthy: 0
```

**Filter by team:**
```bash
$ fleet status --team agents
Fleet Status (3 sprites (team: agents))
...
```

**Columns explained:**
- **Sprite**: Semantic name
- **(API Name)**: Legacy name used by sprites.dev API
- **Status**: API-reported state (warm, cold, running, not_found, error)
- **Resp**: Whether a command executed successfully inside the sprite
- **ms**: Latency to the Sprites API
- **Claude**: Whether Claude CLI is available

### Execute Fleet-Wide Commands

```bash
# Check hostnames
$ fleet exec "hostname"
Executing on 8 sprites: hostname...
============================================================
[hammer] OK
  hammer
[anvil] OK
  anvil
...
Complete: 8/8 succeeded

# Check disk usage
$ fleet exec "df -h /"

# Verify secrets loaded
$ fleet exec "wc -l ~/.env.secrets"
```

### Update Packages Fleet-Wide

```bash
# Update Infisical CLI on all sprites
$ fleet update infisical
Updating 'infisical' on all sprites...
Complete: 8/8 succeeded

# Update Cloudflared
$ fleet update cloudflared
```

### Health Check (Cron)

```bash
# All healthy
$ fleet health
OK: All 8 sprites healthy
$ echo $?
0

# Issues detected
$ fleet health
UNHEALTHY sprites:
  sprite-mobile-conductor: api:not_found
  mallet: unresponsive
$ echo $?
1
```

### Generate Inventory Report

```bash
$ fleet report
{
  "timestamp": "2026-02-02T06:20:36.098000+00:00",
  "total": 8,
  "healthy": 8,
  "unhealthy": 0,
  "sprites": [...],
  "errors": []
}

# Save to file
$ fleet report -o /var/log/fleet-report.json
```

## Architecture

```
N100 Server (/opt/fleet-manager/)
    │
    ├── fleet.py (Python CLI)
    │     ├── httpx.AsyncClient → Sprites API (async status)
    │     └── sprites-py → sprite.command() (parallel exec)
    │
    ├── config.yaml (sprite list, timeouts, webhooks)
    │
    └── Cron: */15 * * * * fleet health --quiet
              └── Logs to /var/log/fleet-healthcheck.log
```

**Design principles:**
- **Pull-based**: Query sprites on demand, don't rely on push
- **Parallel execution**: asyncio + ThreadPoolExecutor
- **Aggressive timeouts**: 10s API, 15s probe, 60s commands
- **Graceful degradation**: Works without sprites-py (status-only mode)

## Installation on N100

SSH to N100 and run the installer:

```bash
ssh n100
cd /path/to/agent-harness/scripts/fleet
sudo ./install.sh
```

The installer:
1. Creates `/opt/fleet-manager/` with Python venv
2. Installs dependencies (httpx, pyyaml, sprites-py)
3. Creates `/usr/local/bin/fleet` wrapper
4. Prompts for `SPRITES_API_TOKEN`
5. Sets up cron job (every 15 minutes)

## Configuration

Edit `/opt/fleet-manager/config.yaml`:

```yaml
# Sprites to manage
sprites:
  - hammer
  - anvil
  - forge
  - mallet
  - test-sprite
  - sprite-mobile-conductor
  - sprite-mobile-worker-1
  - sprite-mobile-worker-2

# Timeouts in seconds
timeouts:
  api_status: 10
  health_probe: 15
  command_exec: 60

# Optional Discord/Slack alerting
alerts:
  webhook_url: ""
```

## Alerting

Configure webhook alerts for unhealthy sprites:

```yaml
alerts:
  webhook_url: "https://discord.com/api/webhooks/..."
```

When issues are detected, an alert is sent with details about which sprites are unhealthy.

## Logs

Health check logs are stored at:
```
/var/log/fleet-healthcheck.log
```

Example log entries:
```
[2026-02-02 06:15:00] OK - All sprites healthy
[2026-02-02 06:30:00] ALERT - UNHEALTHY: mallet (unresponsive)
[2026-02-02 06:45:00] OK - All sprites healthy
```

## Integration with Sprite Inventory

Fleet Manager complements the push-based sprite inventory system:

| System | Direction | Purpose |
|--------|-----------|---------|
| **Sprite Inventory** | Push (sprite → repo) | Detailed per-sprite state, repo staleness |
| **Fleet Manager** | Pull (N100 → sprites) | Fleet-wide health, command execution |

Use both for comprehensive monitoring:
- Inventory for detailed diagnostics and historical tracking
- Fleet Manager for real-time health and fleet-wide operations

## Troubleshooting

### "sprites-py not available"

Fleet works in status-only mode without sprites-py. To enable exec:

```bash
source /opt/fleet-manager/venv/bin/activate
pip install sprites-py
```

### Sprite shows "unresponsive" but API says "warm"

The sprite is running but commands aren't executing. Debug:

```bash
# Try with longer timeout
fleet exec -t 120 "hostname"

# Connect directly
sprite console -s <sprite-name>
```

### Cron not running

```bash
# Check cron
crontab -l

# Test manually
/opt/fleet-manager/fleet-healthcheck
```

---

**Source:** `agent-harness/scripts/fleet/`, `agent-harness/docs/fleet-manager.md`
