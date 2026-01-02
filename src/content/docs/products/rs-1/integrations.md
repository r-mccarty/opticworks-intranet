---
title: RS-1 Integrations
description: Integration surfaces for RS-1.
---

## WebRTC DataChannel (WorldState)

RS-1 streams fused tracking data over a WebRTC DataChannel named `worldstate` using Protocol Buffers. The schema and streaming setup are documented in `hardwareOS/docs/rs1/WORLDSTATE_PROTOCOL.md`.

## JSON-RPC + WebRTC Signaling

The Go backend exposes WebRTC signaling endpoints and JSON-RPC control channels as part of the RS-1 stack (see `hardwareOS/docs/rs1/RS1_ARCHITECTURE.md`).

## Sources

- `hardwareOS/docs/rs1/WORLDSTATE_PROTOCOL.md`
- `hardwareOS/docs/rs1/RS1_ARCHITECTURE.md`
