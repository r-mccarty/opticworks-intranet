---
title: Infisical (Secrets)
description: How OpticWorks manages secrets in Infisical, with repo-specific usage.
---

## How Secrets Arrive in Coder Workspaces

Coder workspaces auto-inject secrets from Infisical into `~/.env.secrets` and source them in shell startup. This behavior is defined in the agent-harness workspace docs.

```bash
# Inspect secrets loaded in the workspace
cat ~/.env.secrets

# Example: access tokens already exported
echo $GITHUB_TOKEN
```

## hardwareOS Secrets

HardwareOS secrets are stored in Infisical and accessed via the CLI. Examples from `hardwareOS/docs/platform/SECRETS.md`:

```bash
infisical secrets get DATABASE_URL --env=prod \
  --projectId=42e9e77c-88fa-4cbb-925b-5064c8e3b18c \
  --token="$INFISICAL_SERVICE_TOKEN" --plain
```

That same doc also lists the expected vault structure and device-side secret locations.

## opticworks-store Secrets

The store repo uses a `pnpm run secrets:pull` workflow to populate `.env.local` and `.dev.vars` (for Next.js + Wrangler) and warns against committing local env files.

```bash
pnpm run secrets:pull
```

See `opticworks-store/docs/SECRETS.md` for the full variable list and usage.

## n8n-marketing-automation Secrets

The N8N deployment uses environment variables in `.env` on the N100 host. The required keys (including X API credentials) are documented in `n8n-marketing-automation/README.md` and `docs/x-api-setup.md`.

## Sources

- `agent-harness/AGENTS.md`
- `agent-harness/docs/coder-workspace.md`
- `hardwareOS/docs/platform/SECRETS.md`
- `opticworks-store/docs/SECRETS.md`
- `n8n-marketing-automation/README.md`
- `n8n-marketing-automation/docs/x-api-setup.md`
