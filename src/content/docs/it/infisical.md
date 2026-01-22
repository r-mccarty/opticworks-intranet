---
title: Infisical (Secrets)
description: How OpticWorks manages secrets in Infisical, with repo-specific usage.
---

## How Secrets Arrive in Sprites

Sprites auto-inject secrets from Infisical into `~/.env.secrets` and source them in shell startup during provisioning.

```bash
# Inspect secrets loaded in the workspace
cat ~/.env.secrets

# Example: access tokens already exported
echo $GITHUB_TOKEN
```

## RS-1 Cloud Secrets

RS-1 cloud services use Cloudflare Worker secrets documented in `rs-1/docs/cloud/INFRASTRUCTURE.md`.

```bash
wrangler secret put EMQX_API_KEY --env production
wrangler secret put SIGNING_KEY --env production
wrangler secret put WEBHOOK_SECRET --env production
```

## opticworks-store Secrets

The store repo uses a `pnpm run secrets:pull` workflow to populate `.env.local` and `.dev.vars` (for Next.js + Wrangler) and warns against committing local env files.

```bash
pnpm run secrets:pull
```

See `opticworks-store/docs/SECRETS.md` for the full variable list and usage.

## n8n-marketing-automation Secrets

The N8N deployment uses environment variables in `.env` on the N100 host. The required keys (including X API credentials) are documented in `n8n-marketing-automation/README.md` and `docs/x-api-setup.md`.

## Sources

- `agent-harness/CLAUDE.md`
- `rs-1/docs/cloud/INFRASTRUCTURE.md`
- `opticworks-store/docs/SECRETS.md`
