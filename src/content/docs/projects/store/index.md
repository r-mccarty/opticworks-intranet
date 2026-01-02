---
title: OpticWorks Store Overview
description: Storefront + Medusa backend overview.
---

The OpticWorks store repo powers the e-commerce site and backend APIs.

## Verified Summary

From `opticworks-store/README.md`:

- **Storefront**: Next.js 15 + React 19 + Tailwind 4
- **Backend**: Medusa v2 on PostgreSQL + Redis
- **Payments**: Stripe (deferred intent pattern)
- **Fulfillment**: EasyPost
- **Hosting**: Cloudflare Workers + Hetzner

## Quick Start

```bash
pnpm install
pnpm run secrets:pull
pnpm run dev
```

## Sources

- `opticworks-store/README.md`
- `opticworks-store/docs/SECRETS.md`
