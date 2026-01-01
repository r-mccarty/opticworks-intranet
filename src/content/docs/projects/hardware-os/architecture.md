---
title: hardwareOS Architecture
description: Technical architecture and system design of the hardwareOS platform
---

This document covers the technical architecture of hardwareOS, including system components, data flow, and design decisions.

## System Overview

hardwareOS is structured as a layered system with clear separation between hardware abstraction, signal processing, and application layers.

```
┌─────────────────────────────────────────────────────────────────┐
│                      Application Layer                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   React UI  │  │  WebRTC     │  │  Configuration Service  │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                      Service Layer (Go)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   gRPC      │  │  State Mgr  │  │  OTA Update Service     │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│                   Signal Processing Layer (C)                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   Kalman    │  │  Hungarian  │  │  Coordinate Transform   │ │
│  │   Filter    │  │  Algorithm  │  └─────────────────────────┘ │
│  └─────────────┘  └─────────────┘                               │
├─────────────────────────────────────────────────────────────────┤
│                   Hardware Abstraction Layer                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │  LD2450     │  │  SC3336     │  │  RKNN NPU               │ │
│  │  Driver     │  │  Driver     │  └─────────────────────────┘ │
│  └─────────────┘  └─────────────┘                               │
├─────────────────────────────────────────────────────────────────┤
│                         Hardware                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │  mmWave     │  │  MIPI       │  │  RV1106G3 SoC           │ │
│  │  Radar      │  │  Camera     │  └─────────────────────────┘ │
│  └─────────────┘  └─────────────┘                               │
└─────────────────────────────────────────────────────────────────┘
```

## Core Components

### Radar Subsystem

The HLK-LD2450 mmWave radar provides the primary detection capability:

```c
// Radar configuration
typedef struct {
    float detection_range;    // 0.2m - 6.0m
    float azimuth_range;      // -60° to +60°
    uint8_t max_targets;      // Up to 3 simultaneous
    uint16_t update_rate;     // 10Hz native
} radar_config_t;
```

**Key characteristics:**
- 24GHz FMCW radar
- Range resolution: 0.75m
- Azimuth resolution: 15°
- Provides (x, y, velocity) for each detected target

### Camera Subsystem

The SC3336 MIPI camera provides visual confirmation and enhanced tracking:

| Parameter | Value |
|-----------|-------|
| Resolution | 2304 x 1296 (3MP) |
| Frame Rate | 30fps |
| Interface | 4-lane MIPI CSI |
| Features | LDCH distortion correction |

### Sensor Fusion Pipeline

The fusion pipeline combines radar and camera data:

```
┌─────────────┐     ┌─────────────┐
│   Radar     │     │   Camera    │
│ Detections  │     │   Frames    │
└──────┬──────┘     └──────┬──────┘
       │                   │
       │    ┌──────────────┘
       ▼    ▼
┌─────────────────┐
│   Time Sync     │
│   & Alignment   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  YOLOv8 NPU     │
│  Inference      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Hungarian     │
│   Association   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Kalman        │
│   Filter        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   WorldState    │
│   Publisher     │
└─────────────────┘
```

## Kalman Filter Design

The Kalman filter uses a constant-velocity model with 4 states:

```
State vector: [x, y, vx, vy]ᵀ

State transition:
┌ x  ┐   ┌ 1  0  dt  0 ┐ ┌ x  ┐
│ y  │ = │ 0  1  0  dt │ │ y  │
│ vx │   │ 0  0  1   0 │ │ vx │
└ vy ┘   └ 0  0  0   1 ┘ └ vy ┘

Measurement:
┌ x ┐   ┌ 1  0  0  0 ┐ ┌ x  ┐
└ y ┘ = └ 0  1  0  0 ┘ │ y  │
                       │ vx │
                       └ vy ┘
```

**Tuning parameters:**
- Process noise (Q): Models target acceleration uncertainty
- Measurement noise (R): Based on radar accuracy specifications
- Initial covariance (P₀): Conservative estimate for new tracks

## Hungarian Algorithm

The Hungarian algorithm solves the assignment problem between detections and existing tracks:

```c
// Cost matrix calculation
float cost_matrix[MAX_TRACKS][MAX_DETECTIONS];

for (int i = 0; i < num_tracks; i++) {
    for (int j = 0; j < num_detections; j++) {
        float dx = tracks[i].x - detections[j].x;
        float dy = tracks[i].y - detections[j].y;
        cost_matrix[i][j] = sqrt(dx*dx + dy*dy);
    }
}

// Apply Hungarian algorithm
hungarian_solve(cost_matrix, assignment);
```

**Assignment rules:**
- Maximum assignment distance: 1.0m (configurable)
- Unmatched detections become new tracks
- Unmatched tracks are marked as lost (deleted after N frames)

## WebRTC Integration

WorldState updates are streamed via WebRTC DataChannel for low-latency delivery:

```typescript
interface WorldState {
  timestamp: number;
  tracks: Track[];
  roomId: string;
}

interface Track {
  id: string;
  x: number;      // meters
  y: number;      // meters
  vx: number;     // m/s
  vy: number;     // m/s
  confidence: number;
}
```

**Performance targets:**
- Update rate: 30Hz
- End-to-end latency: <100ms
- DataChannel: Ordered, reliable delivery

## Memory Management

Given the constrained environment (256MB RAM), memory management is critical:

| Subsystem | Memory Budget |
|-----------|---------------|
| Linux kernel + drivers | 64MB |
| Camera buffers | 48MB |
| NPU inference | 32MB |
| Fusion pipeline | 16MB |
| Go services | 32MB |
| UI/WebRTC | 32MB |
| Headroom | 32MB |

## Thread Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Main Process                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │ Radar       │  │ Camera      │  │ Fusion                  │ │
│  │ Thread      │  │ Thread      │  │ Thread                  │ │
│  │ (10Hz)      │  │ (30fps)     │  │ (30Hz)                  │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
│         │               │                    │                  │
│         └───────────────┼────────────────────┘                  │
│                         ▼                                       │
│                  ┌─────────────┐                               │
│                  │ Ring Buffer │                               │
│                  └─────────────┘                               │
├─────────────────────────────────────────────────────────────────┤
│                        Go Services                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │ gRPC        │  │ WebRTC      │  │ Config                  │ │
│  │ Server      │  │ Server      │  │ Manager                 │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Configuration System

Configuration is stored in JSON and managed via gRPC:

```json
{
  "radar": {
    "detection_range": 6.0,
    "sensitivity": "high"
  },
  "fusion": {
    "kalman_process_noise": 0.1,
    "kalman_measurement_noise": 0.5,
    "max_assignment_distance": 1.0
  },
  "webrtc": {
    "update_rate_hz": 30,
    "stun_servers": ["stun:stun.l.google.com:19302"]
  }
}
```

## Security Considerations

- **No cloud dependency** - All processing is local
- **Encrypted storage** - Configuration and calibration data encrypted at rest
- **Secure boot** - Verified boot chain on RV1106
- **OTA signing** - Updates verified with Ed25519 signatures

## Performance Metrics

| Metric | Target | Typical |
|--------|--------|---------|
| Fusion latency | <50ms | 35ms |
| End-to-end latency | <100ms | 75ms |
| CPU utilization | <70% | 55% |
| Memory usage | <224MB | 180MB |
| Power consumption | <3W | 2.5W |
