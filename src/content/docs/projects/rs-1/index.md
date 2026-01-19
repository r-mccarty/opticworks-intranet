---
title: RS-1 Overview
description: Presence sensor platform specs and docs for RS-1.
---

RS-1 is OpticWorks' presence sensor family built on a single PCBA with selective population. Firmware is the HardwareOS ESP-IDF stack, with cloud services running on Cloudflare and MQTT via EMQX.

## Product Variants (Verified)

From `rs-1/README.md` and `rs-1/CLAUDE.md`:

- **RS-1 Lite**: LD2410 radar, binary presence, utility rooms.
- **RS-1 Pro**: LD2410 + LD2450, dual-radar fusion, zone tracking.
- **Add-ons**: PoE module and IAQ daughterboard.

## System Stack (Verified)

From `rs-1/README.md` and `rs-1/docs/firmware/README.md`:

- Radar ingest -> tracking -> zones -> presence smoothing -> Home Assistant (ESPHome Native API).
- Cloud services handle OTA orchestration, device registry, telemetry, and zone editor sync.

## Repo Layout (Verified)

From `rs-1/README.md`:

```
rs-1/
  docs/
    firmware/
    cloud/
    contracts/
    hardware/
    testing/
    reviews/
    references/
```

## Sources

- `rs-1/README.md`
- `rs-1/CLAUDE.md`
- `rs-1/docs/firmware/README.md`
- `rs-1/docs/cloud/README.md`

## Diagram

```
LD2410 (+LD2450) -> HardwareOS -> Home Assistant
           |              |
           |              +-> Zone Editor (web/app)
           +-> OpticWorks Cloud (OTA, registry, telemetry, MQTT)
```
