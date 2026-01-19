---
title: RS-1 Integrations
description: Home Assistant, MQTT, and zone editor integration surfaces.
---

## Home Assistant (Verified)

From `rs-1/docs/firmware/HARDWAREOS_MODULE_NATIVE_API.md`:

- **Protocol**: ESPHome Native API (TCP port 6053).
- **Discovery**: mDNS `_esphomelib._tcp.local`.
- **Entities**: per-zone occupancy (`binary_sensor`), per-zone target count (`sensor`), plus RSSI and uptime.

## MQTT (Verified)

From `rs-1/docs/contracts/PROTOCOL_MQTT.md`:

Topic namespace:

```
opticworks/{device_id}/{category}/{action}
```

Key topics include:

- `.../ota/trigger`, `.../ota/status`
- `.../telemetry`
- `.../config/update`, `.../config/status`
- `.../targets/stream`
- `.../state`

## Zone Editor (Verified)

From `rs-1/docs/firmware/HARDWAREOS_MODULE_ZONE_EDITOR.md`:

- Local REST: `GET /api/zones`, `POST /api/zones`, `GET /api/targets`.
- Local WebSocket: `/api/targets/stream` for live positions.
- Cloud mode syncs configs via Workers + MQTT.

## Sources

- `rs-1/docs/firmware/HARDWAREOS_MODULE_NATIVE_API.md`
- `rs-1/docs/contracts/PROTOCOL_MQTT.md`
- `rs-1/docs/firmware/HARDWAREOS_MODULE_ZONE_EDITOR.md`
- `rs-1/docs/cloud/README.md`
