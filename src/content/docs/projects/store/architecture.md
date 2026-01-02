---
title: Store Architecture
description: Architecture summary from opticworks-store docs.
---

## System Diagram (Verified)

`opticworks-store/docs/reference/ARCHITECTURE.md` documents the Cloudflare Workers + Medusa + Hookdeck topology, including:

- Storefront on **Cloudflare Workers** (`optic.works`)
- Medusa backend on **Hetzner** (`api.optic.works`)
- Webhooks via **Hookdeck** (Stripe + EasyPost)

## Key Hostnames

From the same doc:

- `optic.works` (storefront)
- `api.optic.works` (client API)
- `medusa.optic.works` (SSR API)

## Sources

- `opticworks-store/docs/reference/ARCHITECTURE.md`
- `opticworks-store/README.md`
