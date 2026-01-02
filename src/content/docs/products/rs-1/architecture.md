---
title: RS-1 Architecture
description: RS-1 system architecture summary.
---

## System Architecture (Verified)

From `hardwareOS/docs/rs1/RS1_ARCHITECTURE.md`:

- Go application orchestrates WebRTC, fusion, JSON-RPC API, and configuration.
- Native C process handles camera/ISP/NPU inference and H.265 encoding via gRPC.
- Radar pipeline parses LD2450 UART frames and feeds fusion.
- WorldState output is streamed over WebRTC DataChannel at 30Hz.

## Sources

- `hardwareOS/docs/rs1/RS1_ARCHITECTURE.md`
