---
title: Development Setup
description: Verified setup steps from OpticWorks repos.
---

## Workspace Baseline

OpticWorks development runs on **Sprites** — hardware-isolated cloud VMs purpose-built for AI agent execution.

### Quick Start with Sprites

```bash
# Check your sprite environment
sprite-info

# Verify tooling
gh auth status
claude --version
cat ~/.env.secrets | wc -l
```

See [Agent Control Plane](/agent-control-plane/) for full Sprite documentation.

### Alternative: Coder Workspaces

Coder workspaces are available as an alternative. See [Coder Workspaces](/agent-control-plane/coder/) for setup.

## Repo-Specific Setup

### RS-1

From `rs-1/README.md`:

```bash
# Firmware build (early, implementation in progress)
idf.py build

# Flash to device
idf.py -p /dev/ttyUSB0 flash
```

### presence-detection-engine

From `presence-detection-engine/README.md` and `docs/DEVELOPMENT_WORKFLOW.md`:

```bash
cd esphome
platformio test -e native
yamllint esphome/ homeassistant/
```

Flashing and Home Assistant integration happen on ubuntu-node (two-machine workflow).

### opticworks-store

From `opticworks-store/README.md`:

```bash
pnpm install
pnpm run secrets:pull
pnpm run dev
```

### n8n-marketing-automation

From `n8n-marketing-automation/README.md` and `SETUP.md`:

```bash
ssh n100
cd /opt/n8n
docker compose up -d
```

## Sources

- `agent-harness/CLAUDE.md`
- `rs-1/README.md`
- `presence-detection-engine/README.md`
- `presence-detection-engine/docs/DEVELOPMENT_WORKFLOW.md`
- `opticworks-store/README.md`
