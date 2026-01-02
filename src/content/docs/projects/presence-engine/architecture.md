---
title: Presence Engine Architecture
description: Architecture summary from the presence-detection-engine docs.
---

## Engine Architecture (Verified)

From `presence-detection-engine/docs/ARCHITECTURE.md`:

- **On-device processing** on ESP32 (no cloud dependency).
- **Z-score normalization** for still-energy readings.
- **4-state machine** with debouncing to reduce false positives.
- **Runtime tuning** through Home Assistant entities.

## Roadmap Phases (Verified)

`docs/ARCHITECTURE.md` and `docs/presence-engine-spec.md` describe:

- Phase 1: Z-score detection + hysteresis
- Phase 2: Debounced 4-state machine
- Phase 3: Automated calibration + change-reason telemetry

## Sources

- `presence-detection-engine/docs/ARCHITECTURE.md`
- `presence-detection-engine/docs/presence-engine-spec.md`
