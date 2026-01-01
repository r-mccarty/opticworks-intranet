---
title: Hardware Overview
description: Physical features, ports, LED indicators, and mounting options for the RS-1
---

This page covers the physical components of the RS-1, including ports, indicators, sensors, and mounting hardware.

## Device Overview

```
         ┌─────────────────────────────────────┐
         │                                     │
         │    ┌───────────────────────────┐   │
         │    │                           │   │
         │    │    ◉ Camera Lens          │   │
         │    │                           │   │
         │    │    ═══ Radar Array        │   │
         │    │                           │   │
         │    └───────────────────────────┘   │
         │                                     │
         │              ● LED                  │
         │                                     │
         │         OpticWorks RS-1             │
         │                                     │
         └─────────────────────────────────────┘
                          │
                    USB-C Port
                    (bottom edge)

         Dimensions: 72mm × 72mm × 28mm
         Weight: 95g
```

## Front Panel

### Sensor Window

The front panel contains a single integrated sensor window housing both sensing elements:

| Component | Description |
|-----------|-------------|
| **Camera Module** | 3MP SC3336 MIPI sensor with 120° FOV |
| **Radar Array** | HLK-LD2450 24GHz mmWave module |
| **IR Illuminator** | Near-infrared LEDs for low-light vision |

:::caution[Keep Clean]
The sensor window should be kept clean for optimal performance. Use a soft, dry microfiber cloth. Do not use liquids or abrasive materials.
:::

### Status LED

The multi-color LED indicates device status:

| Color | Pattern | Meaning |
|-------|---------|---------|
| 🔵 Blue | Slow breathing | Booting / Starting up |
| 🔵 Blue | Fast blinking | Firmware update in progress |
| 🟡 Yellow | Solid | Setup mode (waiting for app) |
| 🟡 Yellow | Blinking | Connecting to WiFi |
| 🟢 Green | Solid | Online, no presence detected |
| 🟢 Green | Pulsing | Presence detected |
| 🟢 Green | Double pulse | Multiple people detected |
| 🔴 Red | Solid | Error state |
| 🔴 Red | Fast blinking | Hardware error |
| 🟣 Purple | Solid | Calibration mode |
| ⚪ White | Breathing | Sensor pose capture active |

## Back Panel

```
    ┌─────────────────────────────────────┐
    │                                     │
    │    ┌─────────────────────────┐     │
    │    │   Mounting Bracket      │     │
    │    │   Attachment Point      │     │
    │    │   (twist-lock)          │     │
    │    └─────────────────────────┘     │
    │                                     │
    │    Model: RS-1                      │
    │    S/N: OW-RS1-XXXXXX              │
    │    FCC ID: 2AXXX-RS1               │
    │    IC: XXXXX-RS1                   │
    │                                     │
    │    ⚠ 5V ⎓ 3A                       │
    │                                     │
    └─────────────────────────────────────┘
```

### Label Information

| Field | Description |
|-------|-------------|
| Model | Product model number |
| S/N | Unique serial number (needed for support) |
| FCC ID | US regulatory certification |
| IC | Canadian regulatory certification |
| Power | Required power specifications |

### Mounting Interface

The back features a twist-lock mounting interface compatible with the included bracket:

1. Align RS-1 with bracket mounting posts
2. Press firmly and rotate clockwise 15°
3. Device clicks into locked position
4. Rotate counter-clockwise to remove

## Bottom Edge

```
    ┌─────────────────────────────────────┐
    │                                     │
    └──────────────┬───────┬──────────────┘
                   │ USB-C │
                   │ Port  │
                   └───────┘
```

### USB-C Port

| Function | Description |
|----------|-------------|
| **Power Input** | 5V 3A (15W) required |
| **Debug Console** | Serial console at 115200 baud (for developers) |
| **Firmware Update** | Manual update via USB (recovery mode) |

:::note[Power Requirements]
Always use the included power adapter or a certified 5V 3A USB-C power supply. Insufficient power may cause instability.
:::

## Internal Components

The RS-1 contains the following internal components (not user-serviceable):

### System on Chip

| Component | Specification |
|-----------|---------------|
| **SoC** | Rockchip RV1106G3 |
| **CPU** | ARM Cortex-A7 @ 1.2GHz |
| **RAM** | 256MB DDR3L |
| **Storage** | 256MB NAND Flash |
| **NPU** | RKNN 1.0 TOPS |

### Sensors

| Sensor | Model | Specifications |
|--------|-------|----------------|
| **Camera** | SC3336 | 3MP, 2304×1296, 30fps |
| **Radar** | HLK-LD2450 | 24GHz FMCW, 3 targets |

### Connectivity

| Interface | Specification |
|-----------|---------------|
| **WiFi** | 802.11 b/g/n/ac (2.4GHz & 5GHz) |
| **Bluetooth** | BT 5.0 LE (for setup) |

## Mounting Bracket

The included adjustable mounting bracket supports multiple installation scenarios.

### Bracket Features

```
    Side View:

           RS-1
          ┌────┐
          │    │
          └──┬─┘
             │    ← Tilt adjustment
           ┌─┴─┐     (0° to 45°)
           │   │
    ═══════╪═══╪═══════  Wall/Ceiling
           Bracket
```

| Feature | Specification |
|---------|---------------|
| **Material** | ABS plastic with steel insert |
| **Tilt Range** | 0° to 45° |
| **Pan Range** | 360° (before tightening) |
| **Wall Clearance** | 25mm from wall surface |

### Mounting Options

#### Wall Mount (Recommended)

Best for: Living rooms, bedrooms, offices

1. Mark holes at 2-3m height
2. Install drywall anchors (included)
3. Secure bracket with screws
4. Attach RS-1 and adjust angle

#### Ceiling Mount

Best for: Conference rooms, open spaces

1. Mark holes at desired location
2. Use appropriate anchors for ceiling type
3. Secure bracket facing down
4. Attach RS-1 pointing toward floor

#### Shelf Placement

Best for: Temporary or rental situations

1. Place RS-1 on stable, elevated surface
2. Use non-slip pad underneath
3. Ensure unobstructed view
4. Avoid vibrating surfaces

## Environmental Specifications

| Parameter | Specification |
|-----------|---------------|
| **Operating Temperature** | 0°C to 45°C (32°F to 113°F) |
| **Storage Temperature** | -20°C to 60°C (-4°F to 140°F) |
| **Humidity** | 10% to 85% RH (non-condensing) |
| **Ingress Protection** | IP20 (indoor use only) |
| **Altitude** | Up to 3000m (10,000 ft) |

:::caution[Indoor Use Only]
The RS-1 is designed for indoor use only. Do not expose to rain, moisture, or extreme temperatures.
:::

## Physical Dimensions

| Measurement | Value |
|-------------|-------|
| **Width** | 72mm (2.8") |
| **Height** | 72mm (2.8") |
| **Depth** | 28mm (1.1") |
| **Weight** | 95g (3.4oz) without cable |
| **Cable Length** | 2m (6.6ft) |

## Power Specifications

| Parameter | Specification |
|-----------|---------------|
| **Input Voltage** | 5V DC |
| **Input Current** | 3A maximum |
| **Power Consumption** | 2.5W typical, 3.5W peak |
| **Connector** | USB Type-C |

### Power Consumption by State

| State | Power |
|-------|-------|
| Idle (no detection) | 1.8W |
| Active detection | 2.5W |
| Peak (NPU active) | 3.5W |
| Sleep mode | 0.3W |

## Buttons and Reset

### Reset Procedure

The RS-1 has a recessed reset button accessible via the USB-C port area:

**Soft Reset (Restart)**:
1. Press and hold reset for 3 seconds
2. Release when LED turns blue
3. Device will reboot

**Factory Reset**:
1. Press and hold reset for 10 seconds
2. Continue holding until LED flashes red
3. Release - device will reset to factory defaults

:::warning[Factory Reset]
Factory reset erases all settings including WiFi credentials, RoomPlan data, and calibration. You will need to set up the device again.
:::

## Accessories

### Included

| Item | Part Number |
|------|-------------|
| USB-C Cable (2m) | OW-CBL-USB2 |
| Power Adapter (5V 3A) | OW-PWR-5V3A |
| Mounting Bracket | OW-MNT-STD |
| Screw Kit | OW-SCR-KIT |

### Optional (Sold Separately)

| Item | Part Number | Description |
|------|-------------|-------------|
| Extended Cable (5m) | OW-CBL-USB5 | For ceiling installations |
| Outdoor Enclosure | OW-ENC-OUT | IP65 rated (coming soon) |
| Multi-Pack Mount | OW-MNT-3PK | 3 brackets for multi-room |
| PoE Adapter | OW-POE-5V | Power over Ethernet adapter |

## Safety Information

### Warnings

⚠️ **Electrical Safety**
- Use only the included power adapter
- Do not modify the power cable
- Disconnect power before cleaning

⚠️ **Installation Safety**
- Ensure secure mounting to prevent falling
- Do not block ventilation openings
- Keep away from heat sources

⚠️ **Radar Safety**
- 24GHz radar is low-power and safe for continuous use
- Complies with FCC/IC RF exposure guidelines
- No known health risks at operating power levels

### Regulatory Compliance

| Certification | Status |
|---------------|--------|
| FCC Part 15 | ✅ Certified |
| IC RSS-247 | ✅ Certified |
| CE (EU) | ✅ Certified |
| RoHS | ✅ Compliant |
| WEEE | ✅ Registered |
