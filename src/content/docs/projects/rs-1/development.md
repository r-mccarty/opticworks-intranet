---
title: RS-1 Development
description: Spec-first workflow for RS-1 firmware and cloud.
---

## Firmware Build (Early)

From `rs-1/README.md`:

```bash
# Prerequisites: ESP-IDF 5.x, Python 3.9+, USB-C cable
idf.py build
idf.py -p /dev/ttyUSB0 flash
```

**Note:** Firmware implementation is not started yet. These commands are placeholders until builds are available.

## Documentation-First Workflow (Verified)

From `rs-1/CLAUDE.md`:

- Update module specs before implementing firmware changes.
- Update contracts in `docs/contracts/` when interfaces change.
- Keep architecture diagrams and assumptions in sync with behavior.

## Testing and Validation (Verified)

From `rs-1/CLAUDE.md`, `rs-1/docs/testing/INTEGRATION_TESTS.md`, and `rs-1/docs/testing/VALIDATION_PLAN_RS1.md`:

- Integration scenarios cover pipeline, OTA, config, recovery, and cloud sync.
- Validation metrics include setup time, false occupancy rate, and OTA success rate.

## Sources

- `rs-1/README.md`
- `rs-1/CLAUDE.md`
- `rs-1/docs/testing/INTEGRATION_TESTS.md`
- `rs-1/docs/testing/VALIDATION_PLAN_RS1.md`
