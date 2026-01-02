---
title: Store Deployment & Operations
description: Deployment and ops notes from opticworks-store docs.
---

## Deployment (Medusa Backend)

From `opticworks-store/docs/reference/DEPLOYMENT_GUIDE.md`:

```bash
cd infrastructure/ansible
ansible-playbook -i inventory/production.ini playbooks/medusa-deploy.yml
```

Full provisioning and teardown workflows are documented in the same file.

## Storefront Deployment

From `opticworks-store/README.md`:

```bash
pnpm run cf:build
pnpm exec wrangler deploy --env production
```

## Logs

Deployment guide documents Medusa log paths and PM2 behavior:

```bash
ssh hetzner-node "tail -f /opt/opticworks/medusa-backend/logs/medusa-app.log"
```

## Sources

- `opticworks-store/docs/reference/DEPLOYMENT_GUIDE.md`
- `opticworks-store/README.md`
