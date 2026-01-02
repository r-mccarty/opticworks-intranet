---
title: Store Development
description: Local dev and testing for opticworks-store.
---

## Local Development

From `opticworks-store/README.md`:

```bash
pnpm install
pnpm run secrets:pull
pnpm run dev
```

## Testing

From `opticworks-store/README.md`:

```bash
pnpm run lint && pnpm run test
pnpm exec playwright test --project=chromium
```

## Sources

- `opticworks-store/README.md`
- `opticworks-store/docs/reference/E2E_TESTING.md`
