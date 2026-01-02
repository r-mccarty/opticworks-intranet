---
title: RS-1 Usage Notes
description: Consuming RS-1 WorldState data.
---

RS-1 publishes real-time tracking data via the WebRTC `worldstate` DataChannel. The data is serialized using Protocol Buffers and includes positions, velocity, and confidence values per track.

See `hardwareOS/docs/rs1/WORLDSTATE_PROTOCOL.md` for schema details and integration examples.

## Sources

- `hardwareOS/docs/rs1/WORLDSTATE_PROTOCOL.md`
