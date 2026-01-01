---
title: Quick Start Guide
description: Get your RS-1 up and running in under 10 minutes
---

This guide will walk you through unboxing, mounting, and connecting your RS-1 presence sensor. By the end, you'll have a fully functional presence detection system.

## What's in the Box

Before you begin, verify your package contains:

| Item | Quantity | Description |
|------|----------|-------------|
| RS-1 Sensor | 1 | Main presence sensing unit |
| USB-C Power Cable | 1 | 2 meter braided cable |
| Power Adapter | 1 | 5V 3A USB-C wall adapter |
| Mounting Bracket | 1 | Adjustable wall/ceiling mount |
| Mounting Screws | 4 | Phillips head, with drywall anchors |
| Quick Start Card | 1 | QR code for app download |
| Safety Guide | 1 | Regulatory information |

:::note[Missing Items?]
If any items are missing, contact support@optic.works with your order number.
:::

## Step 1: Download the App

The OpticWorks iOS app is required for initial setup.

1. **Scan the QR code** on the Quick Start Card, or
2. **Search "OpticWorks"** in the App Store
3. **Download and install** the app
4. **Create an account** or sign in

:::caution[iOS Requirement]
The app requires iOS 17.0 or later and an iPhone with LiDAR (iPhone 12 Pro or newer) for RoomPlan features.
:::

## Step 2: Choose Your Location

The RS-1 works best when positioned correctly. Consider these factors:

### Ideal Placement

```
        ┌─────────────────────────────────────┐
        │              ROOM                   │
        │                                     │
        │     ┌───────────────────────┐      │
        │     │    Detection Zone     │      │
        │     │    (up to 6 meters)   │      │
   ▲    │     │         ◉            │      │
   │    │     │      Person          │      │
Height  │     │                       │      │
2-3m    │     └───────────────────────┘      │
   │    │                                     │
   ▼    │  ┌──────┐                          │
        │  │ RS-1 │ ← Mount in corner        │
        └──┴──────┴───────────────────────────┘
            Wall or Ceiling Mount
```

### Placement Guidelines

| ✅ Do | ❌ Don't |
|-------|----------|
| Mount 2-3 meters high | Mount behind furniture |
| Point toward main activity area | Point directly at windows |
| Keep line of sight clear | Mount near heat sources |
| Corner placement for max coverage | Place in direct sunlight |

### Coverage Patterns

| Mount Position | Best For |
|----------------|----------|
| **Corner, high** | Living rooms, open spaces |
| **Ceiling center** | Conference rooms, small offices |
| **Wall, eye level** | Hallways, entryways |
| **Above door frame** | Room entry detection |

## Step 3: Mount the Sensor

### Wall Mounting

1. **Position the bracket** at your chosen location (2-3m height recommended)
2. **Mark screw holes** using the bracket as a template
3. **Install anchors** if mounting on drywall
4. **Secure bracket** with provided screws
5. **Attach RS-1** to bracket and adjust angle

### Temporary Placement

For testing before permanent installation:
- Place on a high shelf
- Use painter's tape to temporarily secure
- Ensure stable positioning

:::tip[Adjusting Angle]
The mounting bracket allows 45° tilt adjustment. Point the sensor toward the center of your detection zone.
:::

## Step 4: Power On

1. **Connect the USB-C cable** to the RS-1
2. **Plug in the power adapter**
3. **Wait for boot sequence** (approximately 30 seconds)

### LED Status Indicators

| LED Color | Pattern | Meaning |
|-----------|---------|---------|
| 🔵 Blue | Breathing | Booting up |
| 🟡 Yellow | Solid | Ready for setup |
| 🟢 Green | Solid | Connected and working |
| 🟢 Green | Pulsing | Presence detected |
| 🔴 Red | Flashing | Error (see troubleshooting) |

## Step 5: Connect via App

1. **Open the OpticWorks app**
2. **Tap "Add Device"** on the home screen
3. **Select "RS-1"** from the device list
4. **Follow on-screen instructions** to connect to WiFi:
   - RS-1 creates a temporary hotspot
   - App connects and transfers WiFi credentials
   - RS-1 joins your home network
5. **Name your sensor** (e.g., "Living Room Sensor")

### WiFi Requirements

| Requirement | Specification |
|-------------|---------------|
| Network | 2.4GHz or 5GHz WiFi |
| Security | WPA2 or WPA3 |
| Internet | Required for initial setup |

:::note[No Internet After Setup]
After initial setup, RS-1 operates entirely offline. Internet is only needed for firmware updates and remote access.
:::

## Step 6: Create RoomPlan (Optional but Recommended)

For the best experience, create a 3D map of your room:

1. **Tap "Create RoomPlan"** in the app
2. **Slowly walk around the room** with your iPhone
3. **The app will scan** walls, furniture, and openings
4. **Save the room scan** when complete

This enables:
- Accurate location tracking
- Zone-based automations
- Better visualization in the app

See [RoomPlan Guide](/products/rs-1/roomplan/) for detailed instructions.

## Step 7: Capture Sensor Pose

Tell the app exactly where your sensor is mounted:

1. **Tap "Capture Sensor Pose"** in device settings
2. **Point your iPhone camera** at the RS-1
3. **The app will detect** the sensor's position and angle
4. **Confirm the pose** matches reality

This calibrates the coordinate system so presence data maps correctly to your room.

See [Calibration Guide](/products/rs-1/calibration/) for details.

## Step 8: Verify Detection

Test that everything is working:

1. **Open the app** and view your sensor
2. **Walk into the detection zone**
3. **Verify the app shows** your presence
4. **Stand still** for 10 seconds
5. **Confirm stationary detection** works

### What You Should See

- Your position shown as a dot on the room map
- Presence status: "Occupied"
- Real-time updates as you move

## You're Done!

Your RS-1 is now set up and detecting presence. Next steps:

### Recommended

1. **[Complete calibration](/products/rs-1/calibration/)** for optimal accuracy
2. **[Set up automations](/products/rs-1/usage/)** (lights, HVAC, etc.)
3. **[Connect integrations](/products/rs-1/integrations/)** (Home Assistant, HomeKit)

### Optional

- Adjust detection sensitivity in settings
- Create zones for room-specific automations
- Enable multi-sensor coordination (if you have multiple RS-1s)

## Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| LED stays blue | Wait 60 seconds; if persists, check power cable |
| App can't find sensor | Ensure phone is on same network; restart app |
| Sensor not detecting | Check for obstructions; verify mounting angle |
| WiFi won't connect | Confirm 2.4GHz is enabled; check password |

For more help, see the [Troubleshooting Guide](/products/rs-1/troubleshooting/).
