---
title: RS-1 Zones & Tuning
description: Zone modeling, coordinate system, and presence smoothing.
---

RS-1 Pro uses polygon zones to compute occupancy. RS-1 Lite outputs binary presence only (no zones).

## Zone Model (Verified)

From `rs-1/docs/firmware/HARDWAREOS_MODULE_ZONE_ENGINE.md`:

- Zones are 2D polygons with up to 8 vertices.
- Max zones: 16 (resource constrained).
- Include zones take precedence over exclude zones.
- Points on a boundary count as inside to avoid flicker.

## Coordinate System (Verified)

From `rs-1/docs/firmware/COORDINATE_SYSTEM.md`:

- Internal units are **millimeters (mm)**.
- +X is observer right, +Y is into the room.
- Zone editor uses meters and converts at the firmware boundary.

## Sensitivity and Smoothing (Verified)

From `rs-1/docs/firmware/HARDWAREOS_MODULE_PRESENCE_SMOOTHING.md`:

- Sensitivity is 0-100 per zone (Pro).
- Lower values increase hold time to reduce flicker.

| Sensitivity | Hold Time | Enter Delay |
|-------------|-----------|-------------|
| 0 | 5000ms | 500ms |
| 50 (default) | 1500ms | 200ms |
| 100 | 0ms | 0ms |

## Sources

- `rs-1/docs/firmware/HARDWAREOS_MODULE_ZONE_ENGINE.md`
- `rs-1/docs/firmware/COORDINATE_SYSTEM.md`
- `rs-1/docs/firmware/HARDWAREOS_MODULE_PRESENCE_SMOOTHING.md`
- `rs-1/docs/firmware/HARDWAREOS_MODULE_ZONE_EDITOR.md`
