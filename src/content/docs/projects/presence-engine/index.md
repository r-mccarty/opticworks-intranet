---
title: Presence Detection Engine Overview
description: Open-source mmWave presence sensing for Home Assistant with advanced statistical signal processing
---

The Presence Detection Engine is an open-source ESPHome/ESP32 presence detection system that combines mmWave radar telemetry with statistical signal processing for Home Assistant integration.

## What is the Presence Detection Engine?

This project provides a DIY solution for accurate presence detection using affordable mmWave radar sensors. The reference implementation targets bed occupancy detection using an LD2410 sensor, but the architecture supports various presence sensing applications.

## Key Differentiators

| Feature | Traditional PIR | Our Engine |
|---------|----------------|------------|
| Stationary detection | No | Yes |
| Sub-second response | No | Yes |
| Privacy | Yes | Yes |
| Works in darkness | No | Yes |
| Calibration | Manual | Automatic |
| On-device processing | N/A | Yes |

## Core Capabilities

### On-Device Intelligence

All processing happens locally on the ESP32:
- Mean (μ) and standard deviation (σ) maintenance
- Z-score calculation and threshold comparison
- State machine transitions and debouncing
- No cloud dependency for core functionality

### Transparent Diagnostics

The engine exposes its decision rationale through Home Assistant sensors:
- `Presence State Reason` - Current detection explanation
- `Presence Change Reason` - Why state transitions occurred
- Real-time z-scores and timer states

### Runtime Tuning

All parameters are adjustable via Home Assistant without reflashing:
- Detection thresholds
- Debounce durations
- Distance windows
- Calibration settings

### Guided Calibration

MAD-based automatic baseline calibration:
- Triggered via Home Assistant service calls
- Visual wizard interface in HA dashboard
- Persistent calibration storage

## Detection Phases

The engine has evolved through several phases of development:

| Phase | Features |
|-------|----------|
| **Phase 1** | Z-score detection, hysteresis, runtime thresholds |
| **Phase 2** | 4-state machine, debouncing, absolute-clear guards |
| **Phase 3** | MAD calibration, distance windowing, change-reason telemetry |
| **Phase 3.1+** | Calibration persistence, analytics (in progress) |

## Hardware Requirements

### Reference Build

| Component | Model | Purpose |
|-----------|-------|---------|
| Microcontroller | ESP32-WROOM-32 | Main processing |
| Radar Sensor | LD2410 | mmWave detection |
| Power | 5V USB or 5V adapter | Power supply |

### Wiring Diagram

```
ESP32                   LD2410
┌─────────┐            ┌─────────┐
│  3.3V   │────────────│  VCC    │
│  GND    │────────────│  GND    │
│  TX (17)│────────────│  RX     │
│  RX (16)│────────────│  TX     │
└─────────┘            └─────────┘
```

## Technology Stack

| Component | Technology |
|-----------|------------|
| **Languages** | Python (55.1%), C++ (25.1%), Shell (19.8%) |
| **Platform** | ESP32 with ESPHome |
| **Radar** | LD2410 mmWave (24GHz) |
| **Integration** | Home Assistant |
| **Testing** | PlatformIO (C++), Python (E2E) |

## Repository Structure

```
presence-detection-engine/
├── docs/               # Specifications and guides
│   ├── architecture/   # System design docs
│   ├── workflows/      # Development workflows
│   └── troubleshooting/ # Common issues
├── esphome/           # Firmware and components
│   ├── base.yaml      # Base configuration
│   └── components/    # Custom components
├── homeassistant/     # HA integration
│   ├── dashboards/    # Lovelace cards
│   ├── blueprints/    # Automation blueprints
│   └── helpers/       # Input helpers
├── tests/
│   ├── unit/          # C++ unit tests
│   └── e2e/           # Integration tests
└── hardware/          # CAD mounting references
```

## Who Uses This

- **Home Assistant enthusiasts** looking for reliable presence detection
- **Smart home developers** building automation systems
- **OpticWorks community** evaluating our presence technology

## Relationship to hardwareOS

The Presence Detection Engine is a simplified, ESP32-based version of the sensing algorithms used in hardwareOS. Key differences:

| Aspect | Presence Engine | hardwareOS |
|--------|-----------------|------------|
| Platform | ESP32 | RV1106 |
| Sensor | LD2410 | LD2450 + Camera |
| Fusion | Radar only | Radar + Vision |
| Tracking | Single target | Multi-target |
| Interface | Home Assistant | WebRTC |

## Getting Started

1. Review the [Architecture](/projects/presence-engine/architecture/) to understand the system
2. Follow the [Development Guide](/projects/presence-engine/development/) to set up your environment
3. Set up the [Home Assistant Integration](/projects/presence-engine/home-assistant/)

## Resources

- **Repository**: [github.com/r-mccarty/presence-dectection-engine](https://github.com/r-mccarty/presence-dectection-engine)
- **License**: Apache 2.0
- **Home Assistant Forum**: Search "OpticWorks Presence"
- **Discord**: OpticWorks Community Server
