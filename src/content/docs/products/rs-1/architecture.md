---
title: RS-1 Architecture
description: RS-1 system architecture summary.
---

## Firmware Stack (Verified)

From `rs-1/docs/firmware/README.md`:

- **Data path**: M01 Radar Ingest -> M02 Tracking -> M03 Zone Engine -> M04 Presence Smoothing -> M05 Native API.
- **Lite vs Pro**: RS-1 Lite skips M02/M03 and outputs binary presence. RS-1 Pro enables dual-radar fusion and zones.
- **Services**: M06 Config Store, M07 OTA, M08 Timebase, M09 Logging, M10 Security, M11 Zone Editor, M12 IAQ.

## Cloud Stack (Verified)

From `rs-1/docs/cloud/README.md`:

- Cloudflare Workers provide OTA management, device registry, and zone editor APIs.
- Cloudflare D1 stores device/zone data; R2 stores firmware binaries.
- EMQX is the MQTT broker for device communication.

## Data Flow

```
RS-1 Pro (dual radar)
LD2410 + LD2450 -> M01 -> M02 -> M03 -> M04 -> M05 -> Home Assistant
                         |        |           |
                         |        |           +-> Telemetry (M09)
                         |        +-> Zone config (M06/M11)
                         +-> OTA (M07)

Cloud
Workers -> D1/R2 -> EMQX MQTT -> Device
```

## Protocol Abstraction (Verified)

HardwareOS keeps a unified presence model that can drive ESPHome today and future Matter/webhook outputs.

## Sources

- `rs-1/docs/firmware/README.md`
- `rs-1/docs/cloud/README.md`
