---
title: RS-1 Specifications
description: Verified RS-1 specifications from rs-1 docs.
---

## Core Specs (Verified)

From `rs-1/README.md` and `rs-1/docs/hardware/HARDWARE_SPEC.md`:

| Component | Specification |
|----------|----------------|
| MCU | ESP32-WROOM-32E (8MB flash) + CH340N USB-UART |
| Radar | LD2410 (Lite) or LD2410 + LD2450 (Pro) |
| Detection range | Up to 6 meters |
| Field of view | LD2410: 120 deg x 120 deg; LD2450: 120 deg x 60 deg |
| Targets tracked | Lite: binary presence; Pro: up to 3 targets |
| Update rate | ~5 Hz (LD2410); 33 Hz (LD2450) |
| Connectivity | Wi-Fi 802.11 b/g/n; optional Ethernet (RMII) |
| Power | USB-C 5V; optional 802.3af PoE |
| Operating temperature | 0C to 50C |
| Storage temperature | -20C to 70C |
| Response time | < 1 second |

## Sources

- `rs-1/README.md`
- `rs-1/docs/hardware/HARDWARE_SPEC.md`
