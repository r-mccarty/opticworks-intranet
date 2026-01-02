---
title: hardwareOS Overview
description: Embedded platform for the RS-1 sensor fusion device.
---

hardwareOS is OpticWorks' embedded platform for connected sensor devices. It powers the RS-1 and provides WebRTC streaming, sensor fusion, and OTA update capabilities.

## RS-1 Capabilities (Verified)

From `hardwareOS/README.md`:

- 24GHz radar + camera vision fusion
- 30Hz WorldState updates via WebRTC DataChannel
- Kalman filtering + Hungarian assignment
- RoomPlan-based calibration

## RS-1 Hardware (Verified)

From `hardwareOS/README.md` and `hardwareOS/docs/rs1/RS1_ARCHITECTURE.md`:

- **SoC**: Rockchip RV1106G3
- **Radar**: HLK-LD2450 (UART 256000 baud)
- **Camera**: SC3336 MIPI CSI-2
- **NPU**: RKNN (1.0 TOPS)

## Project Layout (Verified)

From `hardwareOS/README.md`:

```
hardwareOS/
├── products/rs1/
├── targets/rv1106/
├── platform/
├── internal/
├── ui/
└── docs/
```

## Sources

- `hardwareOS/README.md`
- `hardwareOS/docs/rs1/RS1_ARCHITECTURE.md`

## Diagrams

### System Stack (RS-1)

```
Browser / iPhone
      |
   WebRTC
      |
Go App (fusion + worldstate)
      |
   gRPC + UART
      |
Native C (camera/NPU) + LD2450 Radar
```

### Data Flow

```
Radar -----> Hungarian -> Kalman -> WorldState -> WebRTC
Camera ---> NPU ------->
```

### Dev Loop

```
Edit code -> dev_deploy.sh -> Device -> Verify logs
```
