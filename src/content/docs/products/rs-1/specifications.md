---
title: Technical Specifications
description: Complete technical specifications for the RS-1 presence sensor
---

Complete technical specifications for the OpticWorks RS-1 Presence Sensor.

## Physical Specifications

### Dimensions & Weight

| Specification | Value |
|---------------|-------|
| **Dimensions** | 85mm × 85mm × 32mm (3.3" × 3.3" × 1.3") |
| **Weight** | 145g (5.1 oz) |
| **Mounting** | Magnetic, adhesive, or screw mount |
| **Enclosure** | ABS plastic with soft-touch finish |
| **Color** | Matte white |

### Physical Features

```
         ┌──────────────────────┐
         │     ◯ Status LED     │
         │                      │
    ┌────│   ┌──────────────┐   │────┐
    │    │   │ Radar Window │   │    │
    │    │   └──────────────┘   │    │
    │    │                      │    │
    │    │   ┌──────────────┐   │    │
    │    │   │Camera Window │   │    │
    │    │   └──────────────┘   │    │
    └────│                      │────┘
         │      OpticWorks      │
         └──────────────────────┘
                   Front

         ┌──────────────────────┐
         │                      │
         │   ┌──────────────┐   │
         │   │ Magnetic     │   │
         │   │ Mount Plate  │   │
         │   └──────────────┘   │
         │                      │
         │  ○ Reset  ─┬─ USB-C  │
         └────────────┴─────────┘
                   Back
```

### Connectors & Ports

| Port | Type | Purpose |
|------|------|---------|
| **Power/Data** | USB-C | Power input, optional wired data |
| **Reset** | Recessed button | Factory reset, recovery mode |
| **Debug** | Internal pads | Firmware development only |

## Sensor Specifications

### Radar Module

| Specification | Value |
|---------------|-------|
| **Type** | FMCW mmWave Radar |
| **Module** | HLK-LD2450 (or equivalent) |
| **Frequency** | 24 GHz ISM band |
| **Bandwidth** | 250 MHz |
| **Max Range** | 6 meters (20 feet) |
| **Range Resolution** | 0.75m |
| **Angular Resolution** | 15° |
| **Field of View** | 120° horizontal × 60° vertical |
| **Update Rate** | 30 Hz |
| **Multi-Target** | Up to 5 simultaneous targets |

### Camera Module

| Specification | Value |
|---------------|-------|
| **Sensor** | 2MP CMOS |
| **Resolution** | 1920 × 1080 (used at 640×480 for processing) |
| **Frame Rate** | 15 fps (processing) |
| **Field of View** | 90° diagonal |
| **Focus** | Fixed, 0.5m to infinity |
| **Night Vision** | IR-enhanced low-light |
| **Purpose** | Sensor fusion, not recording |

:::note[Privacy Note]
The camera is used solely for on-device sensor fusion to improve position accuracy. No images or video are recorded, stored, or transmitted. Processing occurs entirely on the local NPU.
:::

## Processing Unit

### System-on-Chip

| Specification | Value |
|---------------|-------|
| **SoC** | Rockchip RV1106G3 |
| **CPU** | ARM Cortex-A7 @ 1.2 GHz |
| **NPU** | 0.5 TOPS neural processing unit |
| **RAM** | 256MB DDR3L |
| **Storage** | 512MB NAND flash |
| **OS** | Linux 5.10 (hardwareOS) |

### Processing Capabilities

| Capability | Specification |
|------------|---------------|
| **Detection Latency** | < 50ms |
| **Tracking Update Rate** | 30 Hz |
| **Position Accuracy** | ±15cm (with fusion) |
| **Fusion Algorithm** | Extended Kalman Filter |
| **On-Device ML** | Position refinement, target classification |

## Wireless Specifications

### WiFi

| Specification | Value |
|---------------|-------|
| **Standard** | IEEE 802.11 b/g/n |
| **Frequency** | 2.4 GHz only |
| **Security** | WPA2-PSK, WPA3-Personal |
| **Antenna** | Internal PCB antenna |
| **Range** | Up to 30m (indoor, line of sight) |
| **IPv4** | DHCP, Static IP supported |
| **IPv6** | Supported |

### Bluetooth

| Specification | Value |
|---------------|-------|
| **Version** | Bluetooth 5.0 LE |
| **Purpose** | Initial setup, local control |
| **Range** | Up to 10m |
| **Pairing** | Secure bonding |

### Thread/Matter

| Specification | Value |
|---------------|-------|
| **Thread** | IEEE 802.15.4 |
| **Matter** | Version 1.2 |
| **Device Types** | Occupancy Sensor, Motion Sensor |
| **Multi-Admin** | Supported |

## Power Specifications

### Electrical

| Specification | Value |
|---------------|-------|
| **Input Voltage** | 5V DC |
| **Input Current** | 2A maximum |
| **Connector** | USB Type-C |
| **Power Consumption** | 3-5W typical |

### Power States

| State | Power Draw | Description |
|-------|------------|-------------|
| **Active** | 4.5-5W | Detection in progress |
| **Idle** | 3W | No presence, monitoring |
| **Night Mode** | 2.5W | Reduced processing |
| **OTA Update** | 5W | Firmware updating |

### Power Adapter Requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| **Voltage** | 5V | 5V |
| **Current** | 2A | 2.4A |
| **Standard** | USB-A | USB-C PD |

:::caution[Power Warning]
Using adapters with less than 2A output may cause instability or failure to boot. Always use the included adapter or equivalent.
:::

## Environmental

### Operating Conditions

| Condition | Range |
|-----------|-------|
| **Temperature** | 0°C to 40°C (32°F to 104°F) |
| **Humidity** | 10% to 90% RH, non-condensing |
| **Altitude** | Up to 3000m (10,000 ft) |

### Storage Conditions

| Condition | Range |
|-----------|-------|
| **Temperature** | -20°C to 60°C (-4°F to 140°F) |
| **Humidity** | 5% to 95% RH, non-condensing |

### Protection

| Rating | Value |
|--------|-------|
| **IP Rating** | IP20 (indoor use only) |
| **Drop** | Survives 1m drop to hard floor |

## Detection Performance

### Coverage Area

| Mounting Height | Coverage Radius | Coverage Area |
|-----------------|-----------------|---------------|
| 2.0m | 4.5m | 64 m² |
| 2.5m | 5.5m | 95 m² |
| 3.0m | 6.0m | 113 m² |

### Detection Capabilities

| Capability | Performance |
|------------|-------------|
| **Moving Person** | 99% detection rate |
| **Still Person (sitting)** | 97% detection rate |
| **Still Person (lying)** | 95% detection rate |
| **Through Glass** | Limited (not recommended) |
| **Through Walls** | No |
| **Multi-Room** | No (use multiple sensors) |

### Accuracy

| Metric | Typical | Best Case |
|--------|---------|-----------|
| **Position (horizontal)** | ±20cm | ±10cm |
| **Position (vertical)** | ±30cm | ±15cm |
| **Occupancy Count** | 95% accurate | 99% (≤3 people) |
| **Zone Detection** | 98% | 99% |

### Response Time

| Event | Latency |
|-------|---------|
| **Presence Detection** | < 200ms |
| **Absence Detection** | Configurable (5-300s) |
| **Motion Detection** | < 50ms |
| **Zone Enter/Exit** | < 100ms |

## Connectivity & Protocols

### Supported Protocols

| Protocol | Version | Purpose |
|----------|---------|---------|
| **MQTT** | 3.1.1 / 5.0 | Primary integration |
| **HTTP/REST** | 1.1 | Local API |
| **WebSocket** | RFC 6455 | Real-time streaming |
| **HomeKit** | HAP over IP | Apple Home |
| **Matter** | 1.2 | Universal smart home |
| **mDNS** | RFC 6762 | Local discovery |

### MQTT Topics

```
opticworks/rs1/{device_id}/state          # State (JSON)
opticworks/rs1/{device_id}/availability   # online/offline
opticworks/rs1/{device_id}/command        # Commands
opticworks/rs1/{device_id}/config         # Configuration
```

### REST API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/status` | GET | Current state |
| `/api/config` | GET/PUT | Configuration |
| `/api/zones` | GET/POST/DELETE | Zone management |
| `/api/targets` | GET | Target positions |
| `/api/calibrate` | POST | Trigger calibration |
| `/api/ota` | POST | Firmware upload |

## Software

### Firmware

| Specification | Value |
|---------------|-------|
| **OS** | hardwareOS (Linux 5.10) |
| **Update Method** | OTA (automatic) or USB |
| **Update Channel** | Stable, Beta |
| **Rollback** | Automatic on boot failure |

### App Requirements

| Platform | Minimum | Recommended |
|----------|---------|-------------|
| **iOS** | 17.0 | Latest |
| **iPhone** | 12 Pro (LiDAR) | 14 Pro or newer |
| **Storage** | 200MB | 500MB |

### Browser Support (Local Web UI)

| Browser | Minimum Version |
|---------|-----------------|
| Chrome | 100+ |
| Firefox | 100+ |
| Safari | 15+ |
| Edge | 100+ |

## Regulatory Compliance

### Certifications

| Region | Certification |
|--------|---------------|
| **USA** | FCC Part 15 |
| **Canada** | ISED |
| **Europe** | CE, RED |
| **UK** | UKCA |
| **Australia** | RCM |

### Standards

| Standard | Scope |
|----------|-------|
| **FCC Part 15.249** | 24 GHz radar emissions |
| **EN 300 440** | Short range devices |
| **EN 62311** | EMF exposure |
| **EN 55032** | Multimedia equipment EMC |
| **EN 55035** | Immunity |

### Radar Safety

The 24 GHz radar operates at very low power (< 10 mW EIRP) and poses no known health risks. The emission levels are orders of magnitude below safety limits set by FCC and ICNIRP.

## Package Contents

### What's in the Box

| Item | Quantity |
|------|----------|
| RS-1 Sensor Unit | 1 |
| USB-C Power Adapter (5V 2A) | 1 |
| USB-C Cable (1.5m) | 1 |
| Magnetic Mount Plate | 1 |
| 3M Adhesive Pads | 2 |
| Mounting Screws | 2 |
| Quick Start Guide | 1 |
| Warranty Card | 1 |

## Model Variants

| Model | Description | Availability |
|-------|-------------|--------------|
| **RS-1** | Standard (white) | Now |
| **RS-1-B** | Black housing | Q2 2024 |
| **RS-1-P** | PoE powered | Q3 2024 |

## Warranty & Support

| Item | Duration |
|------|----------|
| **Limited Warranty** | 2 years |
| **Firmware Updates** | 5 years minimum |
| **Customer Support** | Lifetime |

## Dimensions Diagram

```
                    85mm
         ◄──────────────────────►
         ┌──────────────────────┐   ▲
         │                      │   │
         │                      │   │
         │                      │   │  85mm
         │                      │   │
         │                      │   │
         │                      │   │
         └──────────────────────┘   ▼
                   Front View

         ┌──────────────────────┐   ▲
         │▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓│   │ 32mm
         └──────────────────────┘   ▼
         ◄──────────────────────►
                    85mm
                   Side View
```

## Comparison: RS-1 vs. Traditional PIR

| Feature | RS-1 | PIR Sensor |
|---------|------|------------|
| Stationary detection | ✓ Yes | ✗ No |
| Position tracking | ✓ Yes | ✗ No |
| Multi-person | ✓ Up to 5 | ✗ No |
| Zone detection | ✓ Yes | ✗ No |
| Through obstructions | ✓ Furniture | ✗ No |
| Pet immunity | ✓ Configurable | ✗ Limited |
| False positives | Low | Medium |
| Power consumption | 3-5W | 0.1W |
| Cost | Higher | Lower |

## Next Steps

- [Quick Start Guide](/products/rs-1/quick-start/) - Get set up
- [Hardware Overview](/products/rs-1/hardware/) - Physical features
- [Troubleshooting](/products/rs-1/troubleshooting/) - Solve issues
