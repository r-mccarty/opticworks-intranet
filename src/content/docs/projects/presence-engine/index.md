---
title: Presence Detection Engine Overview
description: ESPHome/ESP32 presence engine for Home Assistant.
---

The presence-detection-engine repo contains an ESP32/ESPHome-based presence engine with on-device z-score analytics, a debounced state machine, and Home Assistant tooling.

## Verified Highlights

From `presence-detection-engine/README.md`:

- On-device analytics (z-score based) with a 4-state machine
- Runtime tuning via Home Assistant entities
- Unit tests (PlatformIO) and Python E2E tests
- Two-machine workflow: edit in Codespaces/local, flash on ubuntu-node

## Where to Start

- Quickstart: `presence-detection-engine/docs/quickstart.md`
- Architecture: `presence-detection-engine/docs/ARCHITECTURE.md`
- Workflow: `presence-detection-engine/docs/DEVELOPMENT_WORKFLOW.md`
- Troubleshooting: `presence-detection-engine/docs/troubleshooting.md`

## Sources

- `presence-detection-engine/README.md`
- `presence-detection-engine/docs/ARCHITECTURE.md`
- `presence-detection-engine/docs/DEVELOPMENT_WORKFLOW.md`
- `presence-detection-engine/docs/quickstart.md`

## Diagrams

### Two-Machine Workflow

```
Codespace/local (edit + test)
          |
       git push
          |
ubuntu-node (USB flash + HA)
          |
       ESP32 + LD2410
```

### Engine Pipeline

```
LD2410 still energy
      |
   z-score
      |
4-state machine
      |
HA entities (binary + telemetry)
```

### Home Assistant Integration

```
ESPHome device -> HA auto-discovery -> dashboards/helpers
```
