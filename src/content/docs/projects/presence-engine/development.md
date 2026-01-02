---
title: Presence Engine Development
description: Two-machine workflow and tests for the presence engine.
---

## Two-Machine Workflow (Verified)

From `presence-detection-engine/docs/DEVELOPMENT_WORKFLOW.md`:

- **Codespaces/local**: edit code, run tests, commit, push.
- **ubuntu-node**: USB-connected device flashing + Home Assistant access.

## Tests

From `presence-detection-engine/README.md`:

```bash
cd esphome
platformio test -e native
yamllint esphome/ homeassistant/
```

Python E2E tests run in `tests/e2e/` on ubuntu-node.

## Flash + Verify (ubuntu-node)

`docs/DEVELOPMENT_WORKFLOW.md` documents the flashing step:

```bash
ssh ubuntu-node
cd ~/presence-dectection-engine
esphome run esphome/bed-presence-detector.yaml
esphome logs esphome/bed-presence-detector.yaml
```

## Sources

- `presence-detection-engine/README.md`
- `presence-detection-engine/docs/DEVELOPMENT_WORKFLOW.md`
- `presence-detection-engine/CONTRIBUTING.md`
