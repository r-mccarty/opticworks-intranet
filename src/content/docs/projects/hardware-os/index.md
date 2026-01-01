---
title: hardwareOS Overview
description: Embedded operating system for the OpticWorks RS-1 sensor fusion device
---

hardwareOS is an open-source embedded platform for building connected sensor devices. It powers the OpticWorks RS-1, combining mmWave radar with camera vision for real-time occupancy tracking.

## What is hardwareOS?

hardwareOS provides the complete software stack for the RS-1 device, emphasizing:

- **Low-latency streaming** via WebRTC DataChannel
- **Sensor fusion** combining radar and vision data
- **Over-the-air updates** for field deployments
- **Spatial awareness** through room calibration

## The RS-1 Device

The RS-1 is OpticWorks' flagship sensor fusion device:

| Component | Specification |
|-----------|--------------|
| **SoC** | Rockchip RV1106G3 (ARM Cortex-A7, 1.2GHz, 256MB RAM) |
| **Camera** | SC3336 MIPI (3MP, LDCH correction, 4-lane CSI) |
| **NPU** | RKNN (1.0 TOPS for YOLOv8 inference) |
| **Radar** | HLK-LD2450 (24GHz mmWave, 3 targets, 6m range) |
| **Connectivity** | WiFi 6, Bluetooth 5.0 |

## Key Features

### Sensor Fusion
Integrates 24GHz mmWave radar with camera vision to provide robust presence detection that works in any lighting condition.

### Real-Time Performance
- **30Hz WorldState updates** via WebRTC DataChannel
- **Sub-100ms end-to-end latency** from detection to client
- **Hardware-accelerated inference** on the RKNN NPU

### Advanced Tracking
- **Kalman filtering** with 4-state tracking and velocity estimation
- **Hungarian algorithm** for optimal detection-to-track matching
- **Multi-target support** tracking up to 3 simultaneous targets

### Room Calibration
Integration with iPhone RoomPlan for easy spatial calibration and coordinate mapping.

## Repository Structure

```
hardwareOS/
├── products/rs1/
│   ├── fusion/           # Kalman filter, Hungarian algorithm
│   └── radar/            # LD2450 driver
├── targets/rv1106/
│   └── native/           # Native C code, gRPC integration
├── ui/                   # React frontend
├── docs/                 # Technical documentation
└── tools/                # Build and deployment utilities
```

## Technology Stack

| Layer | Technology |
|-------|------------|
| **Languages** | C (41.9%), TypeScript (34.4%), Go (20.7%) |
| **Build System** | CMake, Makefiles |
| **Streaming** | WebRTC (DataChannel) |
| **Inference** | RKNN, YOLOv8 |
| **Communication** | gRPC, Protocol Buffers |

## Data Flow

```
                    ┌─────────────┐
                    │  LD2450     │
                    │   Radar     │
                    └──────┬──────┘
                           │ Raw detections
                           ▼
                    ┌─────────────┐
                    │  Hungarian  │
                    │  Algorithm  │
                    └──────┬──────┘
                           │ Associated tracks
                           ▼
                    ┌─────────────┐
                    │   Kalman    │
                    │   Filter    │
                    └──────┬──────┘
                           │ Smoothed states
                           ▼
                    ┌─────────────┐
                    │ WorldState  │
                    │  (30Hz)     │
                    └──────┬──────┘
                           │ WebRTC DataChannel
                           ▼
                    ┌─────────────┐
                    │  Browser/   │
                    │    App      │
                    └─────────────┘
```

## Who Works on This

| Role | Responsibility |
|------|----------------|
| **Hardware Engineers** | Board bring-up, driver development, sensor integration |
| **Firmware Engineers** | Core C code, RTOS integration, performance optimization |
| **Backend Engineers** | Go services, gRPC, WebRTC infrastructure |
| **Frontend Engineers** | React UI, visualization, user configuration |

## Getting Started

1. Review the [Architecture](/projects/hardware-os/architecture/) documentation
2. Set up your [Development Environment](/projects/hardware-os/development/)
3. Understand the [Deployment](/projects/hardware-os/deployment/) process

## Resources

- **Repository**: [github.com/r-mccarty/hardwareOS](https://github.com/r-mccarty/hardwareOS)
- **License**: GPL v2.0
- **Slack Channel**: `#hardware-engineering`
- **Documentation**: See `/docs` folder in repository
