---
title: Sprite Operations
description: Creating, provisioning, checkpointing, and executing commands on Sprites.
---

## Creating a Sprite

From the bootstrapper or with Infisical credentials:

```bash
# Create with specific repos
./scripts/create-sprite.py --repo rs-1 --repo hardwareOS my-agent

# Refresh existing sprite (update secrets/context)
./scripts/create-sprite.py --existing my-agent
```

## Checkpointing

Sprites support point-in-time snapshots for state preservation:

```bash
# Create a checkpoint (using legacy name - API still uses these)
sprite checkpoint create -s mallet --comment "Working state"

# List checkpoints
sprite checkpoint list -s mallet

# Restore from checkpoint
sprite restore -s mallet <checkpoint-id>
```

> **Note:** The sprites CLI still uses legacy names (mallet, hammer, etc.) when interacting with the API. Semantic names (dev-workspace-01) are used in fleet management and documentation.

Use checkpointing to:
- Save state before risky operations
- Create restore points during long tasks
- Share working configurations between sprites

## Executing Commands

```bash
# Quick command execution
sprite exec -s mallet echo "hello"

# Interactive console
sprite console -s mallet

# Run with timeout
sprite exec -s mallet --timeout 600 "npm run build"
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

## Provisioning Details

When a sprite is created or refreshed, the provisioner:

1. **Injects secrets** from Infisical to `~/.env.secrets`
2. **Configures GitHub auth** via `gh` CLI
3. **Clones requested repos** to `~/workspace/`
4. **Sets up AI tooling** (Claude, Codex CLIs)
5. **Configures SSH** for N100 access

### Codex Configuration

Provisioning sets `sandbox_mode = "danger-full-access"` in `~/.codex/config.toml`. This is safe because sprites are already externally sandboxed.

## Troubleshooting

### Codex Sandbox Failure

**Symptom:** `error running landlock: Sandbox(LandlockRestrict)`

**Cause:** Codex's landlock sandbox conflicts with sprite isolation.

**Fix:** Re-provision to set correct sandbox config:

```bash
./scripts/create-sprite.py --existing <sprite-name>
```

### Codex Auth Missing

**Symptom:** `401 Unauthorized: Missing bearer or basic authentication`

**Fix:** Re-provision to inject `CODEX_AUTH_JSON`:

```bash
./scripts/create-sprite.py --existing <sprite-name>
```

### Stale Secrets

**Symptom:** API calls failing with auth errors.

**Fix:** Refresh secrets from Infisical:

```bash
./scripts/create-sprite.py --existing <sprite-name>
```

## Scripts Reference

| Script | Purpose |
|--------|---------|
| `create-sprite.py` | Create and provision sprites |
| `orchestrate-experiment.py` | Run Claude on sprites |
| `render-sprites-manifest.py` | Regenerate manifest markdown |

---

**Source:** `agent-harness/docs/sprites-operations.md`, `agent-harness/docs/orchestration-experiment.md`
