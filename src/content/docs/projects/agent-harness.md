---
title: Agent Control Plane
description: Cloud environments for AI agents - sprite provisioning, orchestration, and automated code review.
---

The **Agent Control Plane** (formerly agent-harness) is the orchestration system for AI agent cloud environments called **Sprites**. It handles provisioning, secrets injection, code review automation, and agent execution.

## What is a Sprite?

A Sprite is a hardware-isolated execution environment for AI agents:

- **Hardware isolation** — True VM-level separation, not containers
- **Persistent** — State survives across sessions, can be checkpointed and restored
- **Fast startup** — ~1s cold start, instant when warm
- **Pre-configured** — Secrets, GitHub access, and AI tooling ready to go

## Sprite Inventory

| Sprite | Purpose | Status | Repos |
|--------|---------|--------|-------|
| **hammer** | Git push reviewer (Claude Code). Writes RFDs on push. | Reserved | 6 repos |
| **anvil** | Git push reviewer (Codex). Writes RFDs on push. | Reserved | 6 repos |
| **mallet** | General purpose agent workspace | Available | On-demand |
| **test-sprite** | Bootstrapper with Infisical credentials | Reserved | — |

:::caution[Reserved Sprites]
**Do not use `hammer` or `anvil` for general tasks** — they're dedicated to automated code review workflows triggered by git push.
:::

## Environment

Every sprite comes pre-configured with:

| Resource | Location | Description |
|----------|----------|-------------|
| **Secrets** | `~/.env.secrets` | 47+ variables, auto-sourced in bash |
| **AI CLIs** | `claude`, `codex` | Pre-authenticated, ready to use |
| **GitHub** | `gh` CLI | Authenticated, git push works |
| **Repos** | `~/workspace/<repo>` | Cloned during provisioning |
| **Hardware** | `ssh n100` | Via Cloudflare tunnel |

### Key Environment Variables

```bash
$GITHUB_TOKEN        # GitHub API access
$ANTHROPIC_API_KEY   # Claude API
$OPENAI_API_KEY      # OpenAI/Codex API
```

## Quick Start

Run `sprite-info` inside any sprite to see your environment:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sprite Environment
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Sprite:      mallet
  GitHub:      r-mccarty
  Secrets:     47 loaded (~/.env.secrets)
  Claude:      available
  Repos:       rs-1, hardwareOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## Sprite Operations

### Creating a Sprite

From the bootstrapper or with Infisical credentials:

```bash
# Create with specific repos
./scripts/create-sprite.py --repo rs-1 --repo hardwareOS my-agent

# Refresh existing sprite (update secrets/context)
./scripts/create-sprite.py --existing my-agent
```

### Checkpointing

Sprites support point-in-time snapshots:

```bash
sprite checkpoint create -s mallet --comment "Working state"
sprite checkpoint list -s mallet
sprite restore -s mallet <checkpoint-id>
```

### Executing Commands

```bash
# Quick command
sprite exec -s mallet echo "hello"

# Interactive console
sprite console -s mallet
```

## Automated Code Review

Git push to any configured repository triggers an automated review:

```
┌─────────────────────────────────────────────────────────────┐
│  Git Push → GitHub Action → Sprite (hammer/anvil)           │
│                    ↓                                        │
│              Analyze Diff → Generate RFD → Commit Back      │
└─────────────────────────────────────────────────────────────┘
```

### How It Works

1. **Push triggers GitHub Action** — Configured per-repository
2. **Action sends diff to sprite** — hammer (Claude) or anvil (Codex)
3. **Agent analyzes changes** — Reviews code, identifies issues
4. **RFD written** — Request for Discussion document committed to `docs/rfds/`

### Configuring Reviews

Per-repository behavior is controlled via:

```
scripts/hammer/prompt_config.json
```

## AI Orchestration

Run Claude/Codex programmatically for long-running tasks:

```bash
python scripts/orchestrate-experiment.py \
  --sprite mallet \
  --prompt-file task.txt \
  --workdir /home/sprite/workspace/rs-1 \
  --timeout 600
```

Uses HTTP POST execution path (more reliable than WebSocket for long runs).

## Monitored Repositories

The following repos are cloned to sprites and monitored for automated review:

| Repository | Stack | Description |
|------------|-------|-------------|
| **rs-1** | ESP32 + LD2450 | Presence sensor hardware |
| **hardwareOS** | Go + React | Embedded platform |
| **opticworks-store** | Next.js + Medusa | E-commerce |
| **esphome-presence-engine** | ESPHome | Presence detection |
| **rv1106-system** | Linux | RV1106 system images |
| **n8n-marketing-automation** | N8N | Marketing workflows |

## Known Issues

### Codex Sandbox Failure

**Symptom:** `error running landlock: Sandbox(LandlockRestrict)`

**Cause:** Codex's landlock sandbox conflicts with sprite isolation.

**Fix:** Provisioning sets `sandbox_mode = "danger-full-access"` in `~/.codex/config.toml`. This is safe because sprites are already externally sandboxed.

### Codex Auth Missing

**Symptom:** `401 Unauthorized: Missing bearer or basic authentication`

**Fix:** Re-provision to inject `CODEX_AUTH_JSON`:

```bash
./scripts/create-sprite.py --existing <sprite-name>
```

## Documentation

| Document | Purpose |
|----------|---------|
| `sprites-manifest.md` | Human-readable sprite inventory |
| `docs/sprites-operations.md` | Provisioning, checkpointing |
| `docs/orchestration-experiment.md` | Running agents programmatically |
| `docs/hammer-review.md` | Automated code review setup |

## Scripts Reference

| Script | Purpose |
|--------|---------|
| `create-sprite.py` | Create and provision sprites |
| `orchestrate-experiment.py` | Run Claude on sprites |
| `hammer/build_prompt.py` | Central prompt builder for reviews |
| `render-sprites-manifest.py` | Regenerate manifest markdown |

---

**Source:** `agent-harness/CLAUDE.md`, `agent-harness/sprites-manifest.json`
