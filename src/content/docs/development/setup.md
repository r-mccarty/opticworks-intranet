---
title: Development Setup
description: Verified setup steps from OpticWorks repos.
---

## Workspace Baseline

OpticWorks uses Coder workspaces bootstrapped by the agent-harness repo. See `agent-harness/docs/coder-workspace.md` for the installed toolchain and startup behaviors (Infisical secrets, GH auth, SSH keys).

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

- `agent-harness/docs/coder-workspace.md`
- `rs-1/README.md`
- `presence-detection-engine/README.md`
- `presence-detection-engine/docs/DEVELOPMENT_WORKFLOW.md`
- `opticworks-store/README.md`
- `n8n-marketing-automation/README.md`
- `n8n-marketing-automation/SETUP.md`
