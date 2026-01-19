---
title: RS-1 Hardware Overview
description: Verified RS-1 hardware components and variants.
---

## Core Components (Verified)

From `rs-1/docs/hardware/HARDWARE_SPEC.md`, `rs-1/docs/hardware/RS-1_Unified_BOM.md`, and `rs-1/README.md`:

- **MCU**: ESP32-WROOM-32E + CH340N USB-UART bridge
- **Radars**: LD2410 (Lite), LD2410 + LD2450 (Pro)
- **Sensors**: AHT20 temperature/humidity, LTR-303 ambient light
- **Status LED**: WS2812-style RGB LED
- **Connectivity**: Wi-Fi 802.11 b/g/n; optional Ethernet via RMII (PoE variants)
- **Power**: USB-C 5V; optional 802.3af PoE

## Variant Matrix (Verified)

| Component | RS-1 Lite | RS-1 Pro |
|-----------|:---------:|:--------:|
| ESP32-WROOM-32E + CH340N | Required | Required |
| LD2410 (static radar) | Required | Required |
| LD2450 (tracking radar) | - | Required |
| PoE components | Optional | Optional |
| IAQ daughtercard | Optional | Optional |

## Add-ons (Verified)

- **PoE module**: RMII PHY + PD power stage for power/data over Ethernet.
- **IAQ module**: ENS160-based daughterboard that snaps on via pogo pins.

## Key Hardware Targets (Verified)

From `rs-1/docs/hardware/HARDWARE_SPEC.md`:

- **Detection range**: up to 6 meters
- **Field of view**: 120 deg horizontal x 60 deg vertical (LD2450)
- **Max tracked targets**: 3 (Pro)
- **Operating temperature**: 0C to 50C

## Sources

- `rs-1/README.md`
- `rs-1/docs/hardware/HARDWARE_SPEC.md`
- `rs-1/docs/hardware/RS-1_Unified_BOM.md`
- `rs-1/docs/hardware/POE_IMPLEMENTATION.md`
- `rs-1/docs/hardware/IAQ_MODULE_SPEC.md`
