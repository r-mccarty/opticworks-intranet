---
title: Shared Resources & Workflows
description: Cross-project workflows validated from repo docs.
---

## Shared Foundations

From `agent-harness/AGENTS.md` and `docs/coder-workspace.md`:

- Coder workspaces are provisioned on the N100 host.
- Secrets are injected from Infisical into `~/.env.secrets`.
- GitHub CLI is authenticated automatically.
- N100 SSH is preconfigured as `ssh n100`.

## Common Patterns (Verified)

### Conventional Commits

The presence-detection-engine repo requires conventional commit messages and short subjects.

### Documentation First (RS-1)

RS-1 work starts in specs: update module docs and contracts before implementation changes.

### Do Not Commit Secrets

- `opticworks-store/docs/SECRETS.md` forbids committing `.env.local`, `.dev.vars`, or `backend/.env`.
- `presence-detection-engine/CONTRIBUTING.md` forbids committing `esphome/secrets.yaml` and `.env.local`.

### Two-Machine Workflow (Presence Engine)

The presence engine uses Codespaces/local for editing and ubuntu-node for flashing/HA access.

## Sources

- `agent-harness/AGENTS.md`
- `agent-harness/docs/coder-workspace.md`
- `presence-detection-engine/README.md`
- `presence-detection-engine/CONTRIBUTING.md`
- `presence-detection-engine/docs/DEVELOPMENT_WORKFLOW.md`
- `opticworks-store/docs/SECRETS.md`
- `rs-1/CLAUDE.md`

## Diagrams

### Repo-to-Workflow Mapping

```
agent-harness -> workspace bootstrap
rs-1 -> RS-1 device platform
presence-engine -> ESP32 + HA
opticworks-store -> storefront + Medusa
n8n-marketing-automation -> N100 automation
```

### Deployment Surfaces

```
Cloudflare: storefront + intranet
Hetzner: Medusa backend
N100: Coder + N8N + Home Assistant
```
