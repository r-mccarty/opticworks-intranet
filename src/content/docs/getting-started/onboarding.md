---
title: New Employee & Agent Onboarding
description: Sprites-first onboarding for OpticWorks team members and AI agents.
---

## What This Page Covers

This onboarding guide gets you running on **Sprites** — OpticWorks' hardware-isolated cloud VMs purpose-built for AI agent execution. Sprites are the primary development environment.

## 1) Verify Sprite Environment

Run `sprite-info` to see your environment:

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

Verify tooling manually:

```bash
# GitHub auth
gh auth status

# Secrets injected from Infisical
cat ~/.env.secrets | wc -l

# AI tools
claude --version
codex --version

# N100 access
ssh n100 "hostname"
```

If any of these fail, your sprite may need reprovisioning. See [Sprite Operations](/agent-control-plane/operations/).

## 2) Clone Primary Repos

Clone into `~/workspace/` for consistency. These are the main repos referenced in current workflows:

```bash
# Core repos
 gh repo clone r-mccarty/rs-1 ~/workspace/rs-1
 gh repo clone r-mccarty/presence-dectection-engine ~/workspace/presence-detection-engine
 gh repo clone r-mccarty/opticworks-store ~/workspace/opticworks-store
 gh repo clone r-mccarty/opticworks-intranet ~/workspace/opticworks-intranet
 gh repo clone r-mccarty/n8n-marketing-automation ~/workspace/n8n-marketing-automation
```

## 3) Understand the Two-Machine Pattern (Presence Engine)

The presence-detection-engine workflow uses **two environments**:

- **Codespaces / local**: edit, run tests, commit, push.
- **ubuntu-node**: USB-connected hardware flashing + Home Assistant access.

This is required because the ESP32 hardware is physically attached to ubuntu-node and is not reachable from Codespaces. Follow the dedicated workflow in `presence-detection-engine/docs/DEVELOPMENT_WORKFLOW.md`.

## 4) Project-Specific Quick Starts

### RS-1

From `rs-1/README.md`:

```bash
# Firmware build (early, implementation in progress)
idf.py build

# Flash to device (USB serial)
idf.py -p /dev/ttyUSB0 flash
```

### presence-detection-engine

From `presence-detection-engine/README.md`:

```bash
cd esphome
platformio test -e native
yamllint esphome/ homeassistant/
```

Use ubuntu-node for flashing and Home Assistant verification.

### opticworks-store

From `opticworks-store/README.md`:

```bash
pnpm install
pnpm run secrets:pull
pnpm run dev
```

### n8n-marketing-automation

Deployment runs on **N100** using Docker Compose (see `n8n-marketing-automation/SETUP.md` and `README.md`).

```bash
ssh n100
cd /opt/n8n
docker compose up -d
```

## 5) Operational Notes for New Agents

- **Sprites are primary**: Use Sprites for all development work. See [Agent Control Plane](/agent-control-plane/).
- **Secrets**: Pulled from Infisical and stored in `~/.env.secrets`. Auto-sourced in bash.
- **Checkpointing**: Save state before risky operations. See [Sprite Operations](/agent-control-plane/operations/).
- **Device access**: Hardware flashing requires ubuntu-node (documented in `presence-detection-engine/docs/DEVELOPMENT_WORKFLOW.md`).
- **Automated reviews**: Push to monitored repos triggers AI code review via hammer/anvil. See [Automated Code Review](/agent-control-plane/code-review/).

## Sources

- `agent-harness/CLAUDE.md`
- `agent-harness/sprites-manifest.json`
- `rs-1/README.md`
- `presence-detection-engine/README.md`
- `presence-detection-engine/docs/DEVELOPMENT_WORKFLOW.md`
- `opticworks-store/README.md`
