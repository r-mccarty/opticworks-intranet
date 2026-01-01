---
title: iOS App & RoomPlan
description: Set up the OpticWorks app and create your room's 3D map using Apple RoomPlan
---

The OpticWorks iOS app uses Apple's RoomPlan technology to create a detailed 3D map of your space. This enables precise location tracking and intuitive visualization of presence data.

## App Overview

The OpticWorks app provides:

- **Device Setup** - Connect and configure RS-1 sensors
- **RoomPlan Scanning** - Create 3D room models using your iPhone's LiDAR
- **Sensor Pose Capture** - Precisely locate sensors in your room model
- **Live Dashboard** - Real-time presence visualization
- **Automation Setup** - Create presence-based rules
- **Multi-Room Support** - Manage multiple sensors and rooms

### App Requirements

| Requirement | Specification |
|-------------|---------------|
| iOS Version | iOS 17.0 or later |
| iPhone Model | iPhone 12 Pro or newer (LiDAR required) |
| Storage | 200MB for app, plus room data |
| Network | WiFi for sensor communication |

:::note[LiDAR Requirement]
RoomPlan requires a LiDAR-equipped iPhone (12 Pro, 13 Pro, 14 Pro, 15 Pro, or any Pro Max model). Without LiDAR, you can still use basic features but not RoomPlan scanning.
:::

## Installing the App

1. **Open the App Store** on your iPhone
2. **Search for "OpticWorks"**
3. **Tap "Get"** to download
4. **Open the app** once installed

### First Launch

When you first open the app:

1. **Allow Bluetooth** - Required for device setup
2. **Allow Local Network** - Required for sensor communication
3. **Allow Camera** - Required for RoomPlan and sensor pose
4. **Create Account** or **Sign In**

## App Home Screen

```
┌─────────────────────────────────────────┐
│  OpticWorks                    ⚙️ 👤   │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │        Living Room              │   │
│  │        ● 2 people detected      │   │
│  │        RS-1 • Online            │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │        Bedroom                  │   │
│  │        ○ Empty                  │   │
│  │        RS-1 • Online            │   │
│  └─────────────────────────────────┘   │
│                                         │
│                                         │
│           ┌─────────────┐              │
│           │  + Add Room │              │
│           └─────────────┘              │
│                                         │
├─────────────────────────────────────────┤
│   🏠        📊        ⚡        ⚙️    │
│  Home    Dashboard  Automations Settings│
└─────────────────────────────────────────┘
```

## Creating a RoomPlan

RoomPlan creates a 3D model of your room that enables precise presence mapping.

### Before You Start

- **Clear the floor** of obstacles that could trip you
- **Open doors** to rooms you want to include
- **Turn on lights** for best scanning results
- **Hold iPhone in portrait orientation**

### Scanning Process

1. **Tap "Add Room"** on the home screen
2. **Enter room name** (e.g., "Living Room")
3. **Tap "Start RoomPlan Scan"**
4. **Point iPhone at a wall** to begin

### Scanning Technique

```
       Start here
           ↓
    ┌──────────────────────────┐
    │                          │
    │   ↙ Scan this wall       │
    │  ↓                       │
    │  ↓    Walk slowly        │
    │  ↓    around the         │
    │  ↓    room perimeter     │
    │  ↓                       │
    │   ↘                      │
    │      ↓                   │
    │       → → → → → → → ↗   │
    │                    ↑     │
    └──────────────────────────┘
            End here
```

**Tips for best results:**

| Do | Don't |
|----|-------|
| Move slowly and steadily | Rush through the scan |
| Keep iPhone 2-3 feet from walls | Get too close to surfaces |
| Pause at corners | Skip areas or corners |
| Scan all walls, floor to ceiling | Move too fast |
| Include door frames | Ignore openings |

### What Gets Captured

RoomPlan automatically detects:

- ✅ Walls and corners
- ✅ Doors and windows
- ✅ Floor and ceiling
- ✅ Large furniture (sofas, tables, beds)
- ✅ Appliances (TV, refrigerator)
- ✅ Fixtures (counters, cabinets)

### Completing the Scan

1. **Walk the entire perimeter** of the room
2. **Blue overlay** shows scanned surfaces
3. **Tap "Done"** when room is fully covered
4. **Review the 3D model** that appears
5. **Tap "Save"** to keep the scan

### Editing RoomPlan

After scanning, you can refine the model:

- **Tap on furniture** to delete or adjust
- **Pinch to zoom** the 3D view
- **Rotate** to view from any angle
- **Tap "Rescan"** to capture missed areas

## Understanding the 3D Model

### Model Elements

| Element | Color | Description |
|---------|-------|-------------|
| Walls | Gray | Room boundaries |
| Floor | Light tan | Walking surface |
| Doors | Brown | Openings to other spaces |
| Windows | Light blue | Window openings |
| Furniture | Various | Detected objects |

### Coordinate System

```
         Y (up)
         │
         │
         │
         └────────── X (right)
        ╱
       ╱
      Z (toward you)
```

The room model uses a standard 3D coordinate system:
- **X-axis**: Left to right (red)
- **Y-axis**: Floor to ceiling (green)
- **Z-axis**: Back to front (blue)
- **Origin**: Typically near room center at floor level

## Sensor Pose Capture

After creating a RoomPlan, you need to tell the app exactly where your RS-1 is located.

### What is Sensor Pose?

"Pose" describes both **position** (where) and **orientation** (which way it's pointing):

```
    Sensor Pose = Position + Orientation

    Position: (X, Y, Z) in room coordinates
    Orientation: Pitch, Yaw, Roll angles
```

### Capture Process

1. **Navigate to your room** in the app
2. **Tap the RS-1 device** in the room
3. **Tap "Capture Sensor Pose"**
4. **Point iPhone camera** at the RS-1

### AR-Guided Capture

The app uses augmented reality to guide you:

```
┌─────────────────────────────────────────┐
│                                         │
│           Camera View                   │
│                                         │
│         ┌─────────────┐                │
│         │    RS-1     │ ← Look for     │
│         │   [    ]    │   green box    │
│         │             │   around       │
│         └─────────────┘   device       │
│                                         │
│    "Move closer to the sensor"          │
│                                         │
│         [ Capture Pose ]                │
│                                         │
└─────────────────────────────────────────┘
```

### Capture Steps

1. **Stand 1-2 meters** from the RS-1
2. **Center the device** in your camera view
3. **Hold steady** while the app detects it
4. **Green outline** appears around RS-1
5. **Tap "Capture Pose"** when prompted
6. **Confirm** the detected position

### Verifying Pose Accuracy

After capture, verify the pose is correct:

1. **View the 3D model** with sensor placed
2. **Sensor icon** should match real position
3. **Direction arrow** shows where sensor points
4. **If incorrect**, tap "Recapture Pose"

## Live Dashboard

The dashboard shows real-time presence data overlaid on your room model.

### Dashboard Views

**2D Floor Plan View**
```
┌─────────────────────────────────────────┐
│  Living Room                    2D │ 3D │
├─────────────────────────────────────────┤
│                                         │
│   ┌─────────────────────────────────┐  │
│   │     ◉ ← You                     │  │
│   │                                 │  │
│   │          ┌────────┐            │  │
│   │          │ Couch  │            │  │
│   │          └────────┘            │  │
│   │                                 │  │
│   │  📡 RS-1                        │  │
│   └─────────────────────────────────┘  │
│                                         │
│  Status: 1 person detected              │
│  Location: Near couch                   │
└─────────────────────────────────────────┘
```

**3D Perspective View**
- Rotate: Drag with one finger
- Zoom: Pinch with two fingers
- Pan: Drag with two fingers

### Presence Indicators

| Indicator | Meaning |
|-----------|---------|
| ● Solid dot | Person at rest |
| ◉ Pulsing dot | Person moving |
| ●→ Dot with trail | Movement direction |
| Multiple dots | Multiple people |

### Real-Time Data

| Metric | Update Rate |
|--------|-------------|
| Position | 30 Hz |
| Occupancy count | Instant |
| Zone status | Instant |
| Activity level | 1 Hz |

## App Settings

### Device Settings

Access per-sensor settings:

- **Name**: Friendly name for the sensor
- **Detection Sensitivity**: Low / Medium / High
- **Night Mode**: Reduce LED brightness
- **Update Rate**: Balance accuracy vs. battery (for integrations)

### Room Settings

- **Edit RoomPlan**: Modify the 3D model
- **Recapture Pose**: Update sensor position
- **Zones**: Create detection zones
- **Automations**: Presence-triggered actions

### Account Settings

- **Profile**: Name, email, avatar
- **Notifications**: Alert preferences
- **Data & Privacy**: Export/delete data
- **About**: App version, support

## Troubleshooting

### RoomPlan Issues

| Issue | Solution |
|-------|----------|
| Scan won't start | Ensure LiDAR is available; restart app |
| Walls missing | Rescan that area slowly |
| Furniture not detected | Large items only; manual edit available |
| Room looks distorted | Rescan entire room |

### Sensor Pose Issues

| Issue | Solution |
|-------|----------|
| Can't detect sensor | Ensure sensor is powered on; move closer |
| Position seems wrong | Verify room model is accurate first |
| Arrow points wrong way | Recapture pose from different angle |

### Connection Issues

| Issue | Solution |
|-------|----------|
| Sensor offline | Check WiFi; verify same network as phone |
| Can't add device | Enable Bluetooth and Local Network access |
| Data not updating | Force close and reopen app |

## Privacy & Data

### What's Stored Locally

- Room 3D models
- Sensor configurations
- Recent presence history (7 days)

### What's Stored in Cloud

- Account information
- Device registrations
- Backup of room models (optional)

### Data Not Collected

- Video or images from camera sensor
- Audio recordings
- Detailed movement patterns
- Personal identification

See our [Privacy Policy](https://optic.works/privacy) for complete details.
