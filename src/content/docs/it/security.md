---
title: Security Guidelines
description: Verified security practices captured in repo documentation.
---

## Secret Handling (Verified)

Multiple repos explicitly warn against committing sources of secrets:

- `opticworks-store/docs/SECRETS.md` warns against committing `.env.local`, `.dev.vars`, or `backend/.env`.
- `presence-detection-engine/CONTRIBUTING.md` warns against committing `esphome/secrets.yaml` and `.env.local`.

## What Is Not Documented Yet

This intranet page currently only documents **repo-verified** security guidance. If you need broader security policies (2FA requirements, device policy, etc.), provide the authoritative policy source and we will add it with citations.

## Sources

- `opticworks-store/docs/SECRETS.md`
- `presence-detection-engine/CONTRIBUTING.md`
