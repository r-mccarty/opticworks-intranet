---
title: Git Workflow
description: Verified contribution and commit guidance from OpticWorks repos.
---

## Common Contribution Pattern

The presence-detection-engine and hardwareOS docs describe a conventional flow:

1. Create a feature branch
2. Make changes and run tests
3. Update documentation when behavior changes
4. Commit with clear messages
5. Open a PR

See `presence-detection-engine/CONTRIBUTING.md` and `hardwareOS/docs/platform/DEVELOPMENT.md`.

## Commit Style

The presence-detection-engine repo explicitly requires **conventional commit** style with short subjects:

```
<type>: <subject>
```

Examples appear in `presence-detection-engine/README.md` and `docs/DEVELOPMENT_WORKFLOW.md`.

## Testing Before PR

Presence-engine contribution guidance requires:

- `platformio test -e native`
- `yamllint esphome/ homeassistant/`
- Python E2E tests where applicable

See `presence-detection-engine/CONTRIBUTING.md` for the full list.

## Sources

- `presence-detection-engine/README.md`
- `presence-detection-engine/CONTRIBUTING.md`
- `presence-detection-engine/docs/DEVELOPMENT_WORKFLOW.md`
- `hardwareOS/docs/platform/DEVELOPMENT.md`
