---
title: hardwareOS Architecture
description: RS-1 architecture summary sourced from hardwareOS docs.
---

## High-Level Architecture (RS-1)

From `hardwareOS/docs/rs1/RS1_ARCHITECTURE.md`:

- **Go application** manages WebRTC, fusion engine, JSON-RPC API, and configuration.
- **Native C process** handles camera/ISP/NPU inference and H.265 encoding via gRPC to the Go layer.
- **Radar pipeline** parses LD2450 UART frames and feeds the fusion engine.
- **WorldState output** is sent via WebRTC DataChannel at 30Hz.

## Data Flow (Verified)

1. **Vision pipeline**: SC3336 MIPI → ISP → NPU (YOLOv8) → VisionFrame
2. **Radar pipeline**: LD2450 UART → RadarFrame
3. **Fusion pipeline**: Hungarian association → Kalman update → WorldState
4. **Output**: WebRTC video track + WorldState DataChannel

## API Surface (Verified)

- WebRTC signaling endpoints: `POST /webrtc/session` and `POST /webrtc/session/{id}/ice`
- RoomPlan API: `GET/POST /api/setup/roomplan`
- DataChannels: `worldstate` (tracking), `rpc` (JSON-RPC)

## Sources

- `hardwareOS/docs/rs1/RS1_ARCHITECTURE.md`
