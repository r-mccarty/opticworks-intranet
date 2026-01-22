---
title: Hardware Platform
description: RS-1 hardware stack overview - firmware, system infrastructure, and embedded development.
---

The **Hardware Platform** encompasses the embedded systems stack for RS-1 presence sensors. This includes firmware development (hardwareOS), system infrastructure (rv1106-system), and the complete hardware development workflow.

## Stack Overview

| Layer | Repository | Description |
|-------|------------|-------------|
| **Firmware** | `hardwareOS` | Go + React embedded application |
| **System** | `rv1106-system` | RV1106 Linux system images |
| **Hardware** | `rs-1` | ESP32 + LD2450 sensor specs |

## Hardware Platform Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        RS-1 Device                          │
├─────────────────────────────────────────────────────────────┤
│  hardwareOS (Go + React)                                    │
│    ├── Web UI for configuration                             │
│    ├── Sensor data processing                               │
│    └── Home Assistant integration                           │
├─────────────────────────────────────────────────────────────┤
│  rv1106-system (Linux)                                      │
│    ├── Buildroot-based system                               │
│    ├── Kernel + drivers                                     │
│    └── OTA update infrastructure                            │
├─────────────────────────────────────────────────────────────┤
│  ESP32 + LD2450 (Hardware)                                  │
│    ├── mmWave radar sensing                                 │
│    └── BLE/WiFi connectivity                                │
└─────────────────────────────────────────────────────────────┘
```

## Development Status

<div class="notice-spec-phase">
<strong>Spec Phase:</strong> The RV1106-based hardware platform is in active specification and early development. Documentation reflects current design intent and may change.
</div>

## Quick Links

- [hardwareOS (Firmware)](/hardware-platform/hardwareos/) — Go + React embedded firmware
- [rv1106-system (Infrastructure)](/hardware-platform/rv1106/) — RV1106 build system
- [RS-1 Platform](/projects/rs-1/) — Hardware project documentation

## Key Technologies

| Technology | Purpose |
|------------|---------|
| **Go** | Backend firmware logic |
| **React** | Embedded web UI |
| **Buildroot** | Linux system generation |
| **RV1106** | Main application processor |
| **ESP32** | Wireless connectivity |
| **LD2450** | mmWave presence detection |

---

**Source:** `rs-1/README.md`, `hardwareOS/README.md`, `rv1106-system/README.md`
