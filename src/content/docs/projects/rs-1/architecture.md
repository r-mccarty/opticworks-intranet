---
title: RS-1 Architecture
description: Firmware and cloud architecture summary for RS-1.
---

## Firmware Architecture (Verified)

From `rs-1/docs/firmware/README.md`:

- **Data path**: M01 Radar Ingest -> M02 Tracking -> M03 Zone Engine -> M04 Presence Smoothing -> M05 Native API.
- **Variant behavior**: RS-1 Lite uses M01 -> M04 -> M05 (LD2410 only). RS-1 Pro enables M02/M03 with LD2450 tracking.
- **Services**: M06 Config Store, M07 OTA, M08 Timebase, M09 Logging, M10 Security, M11 Zone Editor, M12 IAQ.

## Cloud Architecture (Verified)

From `rs-1/docs/cloud/README.md`:

- **Workers**: Zone Editor, OTA Manager, Device API.
- **Data stores**: Cloudflare D1 for registry/configs, R2 for firmware and telemetry archives.
- **MQTT**: EMQX broker for device communication (TLS required).

## Coordinate System (Verified)

From `rs-1/docs/firmware/COORDINATE_SYSTEM.md`:

- **Units**: millimeters (mm) internally, meters at the zone editor boundary.
- **Axes**: +X is observer right, +Y is into the room.
- **Variants**: RS-1 Lite has no coordinate system (binary presence only).

## Data Flow

```
RS-1 Pro (dual radar)
LD2410 + LD2450 -> M01 -> M02 -> M03 -> M04 -> M05 -> Home Assistant
                        |        |           |
                        |        |           +-> MQTT telemetry (M09)
                        |        +-> Zone config (M06/M11)
                        +-> OTA (M07) and security (M10)

Cloud
Workers -> D1/R2 -> EMQX MQTT -> Device
```

## Sources

- `rs-1/docs/firmware/README.md`
- `rs-1/docs/firmware/COORDINATE_SYSTEM.md`
- `rs-1/docs/cloud/README.md`
