---
title: New Employee & Agent Onboarding
description: Verified onboarding steps sourced from OpticWorks repos and workspace docs.
---

## What This Page Covers

This onboarding guide is compiled from the **actual repo docs** used in OpticWorks workspaces and projects. It focuses on getting access, validating tooling, and following the real development workflows used in production.

## 1) Verify Workspace Access (Coder + Agent Harness)

OpticWorks workspaces are bootstrapped by the **agent-harness** repo. Confirm the following in your workspace:

```bash
# GitHub auth
 gh auth status

# Secrets injected from Infisical
cat ~/.env.secrets | wc -l

# Coder tools
claude --version
codex --version

# N100 access
ssh n100 "hostname"
```

If any of these fail, refer to the workspace troubleshooting steps in `agent-harness/docs/coder-workspace.md` and `agent-harness/docs/n100-coder-access.md`.

## 2) Clone Primary Repos

Clone into `~/workspace/` for consistency. These are the main repos referenced in current workflows:

```bash
# Core repos
 gh repo clone r-mccarty/hardwareOS ~/workspace/hardwareOS
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

### hardwareOS (RS-1)

From `hardwareOS/docs/rs1/DEVELOPMENT.md` and `hardwareOS/README.md`:

```bash
# Device build + deploy
./dev_deploy.sh -r <DEVICE_IP>

# Local tests
make test
# or
go test ./...

# UI dev
cd ui && npm run dev
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

- **Secrets**: Pulled from Infisical and stored in `~/.env.secrets`. Project-specific secrets live in repo docs (see `hardwareOS/docs/platform/SECRETS.md` and `opticworks-store/docs/SECRETS.md`).
- **Device access**: Hardware flashing and Home Assistant access for the presence engine require ubuntu-node (documented in `presence-detection-engine/docs/DEVELOPMENT_WORKFLOW.md`).
- **Deployments**: Each repo has its own deploy flow (see `opticworks-store/docs/reference/DEPLOYMENT_GUIDE.md`, `hardwareOS/docs/rs1/DEVELOPMENT.md`).

## Sources

- `agent-harness/AGENTS.md`
- `agent-harness/docs/coder-workspace.md`
- `agent-harness/docs/n100-coder-access.md`
- `hardwareOS/README.md`
- `hardwareOS/docs/rs1/DEVELOPMENT.md`
- `presence-detection-engine/README.md`
- `presence-detection-engine/docs/DEVELOPMENT_WORKFLOW.md`
- `opticworks-store/README.md`
- `opticworks-store/docs/reference/DEPLOYMENT_GUIDE.md`
- `opticworks-store/docs/SECRETS.md`
- `n8n-marketing-automation/README.md`
- `n8n-marketing-automation/SETUP.md`
