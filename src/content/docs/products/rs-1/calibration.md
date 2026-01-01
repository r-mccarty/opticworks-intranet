---
title: Calibration & Tuning
description: Fine-tune your RS-1 sensor for optimal presence detection in your space
---

After completing the initial setup and RoomPlan scan, calibrating your RS-1 ensures accurate presence detection tailored to your specific environment.

## Understanding Calibration

### Why Calibrate?

Every room is different. Calibration accounts for:

- **Room size and shape** - Open spaces vs. corridors
- **Furniture layout** - Blocking and reflection patterns
- **Materials** - Glass, metal, and other reflective surfaces
- **Intended use** - Detection zones and sensitivity needs

### Calibration Components

| Component | Purpose | When to Adjust |
|-----------|---------|----------------|
| **Sensor Pose** | Physical position/orientation | After moving sensor |
| **Detection Zones** | Areas to monitor | Initial setup, layout changes |
| **Sensitivity** | Detection threshold | False positives/negatives |
| **Tracking Parameters** | Movement tracking | Multi-person scenarios |

## Sensor Pose Calibration

The sensor pose (position + orientation) was captured during RoomPlan setup. Verify and refine it here.

### Verifying Pose Accuracy

1. **Open the OpticWorks app**
2. **Select your room**
3. **Tap "View 3D Model"**
4. **Check sensor placement**

The sensor icon should match its real-world position:

```
✓ Correct Pose              ✗ Incorrect Pose
┌─────────────────┐        ┌─────────────────┐
│                 │        │                 │
│    📡 ← Sensor  │        │         📡      │
│    ↓ points     │        │         ↑       │
│    this way     │        │    (Wrong       │
│                 │        │     position)   │
│    ●            │        │    ●            │
│    Person       │        │    Person       │
└─────────────────┘        └─────────────────┘
```

### Recapturing Pose

If the pose is incorrect:

1. **Tap the sensor** in the 3D model
2. **Tap "Recapture Pose"**
3. **Point your iPhone** at the RS-1
4. **Hold steady** until detected
5. **Confirm** the new position

:::tip[Best Results]
Recapture pose from 1-2 meters away, with the sensor clearly visible and well-lit.
:::

## Detection Zone Setup

Zones let you define specific areas for presence detection and automation triggers.

### Zone Types

| Zone Type | Purpose | Example Use |
|-----------|---------|-------------|
| **Inclusion Zone** | Areas to monitor | Living area, desk |
| **Exclusion Zone** | Areas to ignore | Windows, pets' area |
| **Trigger Zone** | Automation triggers | Entryway, bed |

### Creating Zones

1. **Navigate to room settings**
2. **Tap "Detection Zones"**
3. **Tap "+ Add Zone"**
4. **Select zone type**

### Drawing a Zone

Use the 3D model to draw zone boundaries:

```
┌─────────────────────────────────────────┐
│  Zone Editor                            │
├─────────────────────────────────────────┤
│                                         │
│   ┌─ ─ ─ ─ ─ ─ ─ ─┐                    │
│   │  Living Area  │   ← Inclusion      │
│   │    Zone       │     Zone           │
│   └─ ─ ─ ─ ─ ─ ─ ─┘                    │
│                                         │
│   ┌───────────┐                        │
│   │  Window   │   ← Exclusion          │
│   │  (ignore) │     Zone               │
│   └───────────┘                        │
│                                         │
│   [  ] Show grid    [Save] [Cancel]    │
│                                         │
└─────────────────────────────────────────┘
```

**Drawing steps:**

1. **Tap to place corners** (minimum 3 points)
2. **Drag points** to adjust shape
3. **Set zone height** (floor level or elevated)
4. **Name the zone**
5. **Tap "Save"**

### Zone Examples

**Desk Presence Zone**
```
Height: 0.6m - 1.5m (seated height)
Purpose: Detect when someone is at desk
Automation: Turn on desk lamp
```

**Bed Occupied Zone**
```
Height: 0.3m - 1.0m (lying down)
Purpose: Detect bed occupancy
Automation: Night mode, turn off TV
```

**Entryway Trigger Zone**
```
Height: 0m - 2m (full height)
Purpose: Detect entering/leaving
Automation: Welcome lighting
```

## Sensitivity Tuning

### Detection Sensitivity

Adjust how easily the sensor detects presence:

| Level | Best For | Trade-off |
|-------|----------|-----------|
| **Low** | Large movements only | May miss still persons |
| **Medium** | Normal use | Balanced |
| **High** | Detecting very still persons | More false positives |

### Accessing Sensitivity Settings

1. **Open room in app**
2. **Tap RS-1 device**
3. **Tap "Detection Settings"**
4. **Adjust sliders**

### Sensitivity Parameters

```
Detection Sensitivity    ████████░░ 80%
Movement Threshold      ██████░░░░ 60%
Still Presence Time     5 seconds
Absence Timeout         30 seconds
```

| Parameter | Description | Default |
|-----------|-------------|---------|
| **Detection Sensitivity** | Overall sensitivity | 70% |
| **Movement Threshold** | Motion detection level | 50% |
| **Still Presence Time** | Time before "still" state | 5 sec |
| **Absence Timeout** | Time before "absent" state | 30 sec |

### Tuning for Your Environment

**Too many false positives?**
- Lower detection sensitivity
- Add exclusion zones for problem areas
- Check for reflective surfaces, fans, or curtains

**Missing detections?**
- Increase detection sensitivity
- Verify sensor has clear view
- Check that people aren't in exclusion zones

## Multi-Person Tracking

RS-1 can track multiple people simultaneously.

### Tracking Parameters

| Parameter | Description | Range |
|-----------|-------------|-------|
| **Max Targets** | Maximum people to track | 1-5 |
| **Merge Distance** | Distance to merge close targets | 0.3-1.0m |
| **Track Persistence** | How long to maintain lost track | 1-10 sec |

### Configuring Multi-Person

1. **Room Settings → Detection Settings**
2. **Enable "Multi-Person Tracking"**
3. **Set maximum targets**
4. **Adjust merge distance**

:::note[Accuracy Note]
Tracking accuracy decreases with more targets. For best results, limit to 3-4 people per sensor.
:::

## Room-Specific Calibration

### Living Room

```
Recommended Settings:
├── Sensitivity: 70%
├── Max Targets: 4
├── Include: Seating areas
├── Exclude: Windows, TV screen
└── Zones: Couch, Reading chair
```

### Bedroom

```
Recommended Settings:
├── Sensitivity: 80%
├── Max Targets: 2
├── Include: Bed, desk
├── Exclude: Windows
└── Zones: Bed (low height), Desk
```

### Office/Study

```
Recommended Settings:
├── Sensitivity: 75%
├── Max Targets: 1
├── Include: Desk area
├── Exclude: Door swing area
└── Zones: Desk presence trigger
```

### Bathroom

```
Recommended Settings:
├── Sensitivity: 85%
├── Max Targets: 1
├── Include: Entire room
├── Exclude: None
└── Zones: Shower (if separate)
```

## Calibration Wizard

The app includes a guided calibration wizard for optimal setup.

### Running the Wizard

1. **Open room settings**
2. **Tap "Calibration Wizard"**
3. **Follow on-screen prompts**

### Wizard Steps

```
Step 1/5: Empty Room
─────────────────────
Please ensure the room is empty,
then tap Continue.

        [Continue]
```

```
Step 2/5: Movement Test
─────────────────────
Walk around the room normally
for 30 seconds.

   ◉ ← You (detected)

Progress: ██████████░░ 75%
```

```
Step 3/5: Still Presence
─────────────────────
Sit or stand still in different
locations for 10 seconds each.

Location 1: ✓ Detected
Location 2: ✓ Detected
Location 3: Testing...
```

```
Step 4/5: Zone Review
─────────────────────
Review and adjust detection zones
based on calibration data.

        [Adjust Zones]
```

```
Step 5/5: Complete
─────────────────────
Calibration complete!

Detection Accuracy: 98%
Recommended sensitivity: 72%

        [Apply Settings]
```

## Advanced Calibration

### Manual Parameter Tuning

For advanced users, access raw parameters:

1. **Settings → Advanced**
2. **Enable "Developer Mode"**
3. **Return to room → Advanced Settings**

### Available Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `radar_gain` | Radar amplification | 45 |
| `cfar_threshold` | Detection threshold | 12 |
| `point_cloud_min` | Minimum points for target | 5 |
| `velocity_filter` | Movement velocity filter | 0.1 m/s |
| `height_filter_min` | Minimum detection height | 0.3m |
| `height_filter_max` | Maximum detection height | 2.2m |

:::caution[Advanced Users Only]
Modifying advanced parameters can significantly impact detection performance. Use the calibration wizard first.
:::

### Exporting Calibration

Save your calibration for backup or sharing:

1. **Room Settings → Export Calibration**
2. **Choose export format** (JSON or QR code)
3. **Save or share**

### Importing Calibration

Apply saved calibration:

1. **Room Settings → Import Calibration**
2. **Select file or scan QR**
3. **Review settings**
4. **Tap "Apply"**

## Validating Calibration

### Detection Test Mode

Verify calibration with real-time feedback:

1. **Room → Test Mode**
2. **Move around the room**
3. **Observe detection indicators**

```
┌─────────────────────────────────────────┐
│  Test Mode                      [Exit]  │
├─────────────────────────────────────────┤
│                                         │
│    ● You (detected)                     │
│      Position: (2.3, 0.9, 1.5)         │
│      Velocity: 0.2 m/s                  │
│      Confidence: 98%                    │
│                                         │
│    Zone Status:                         │
│    ✓ Living Area: Occupied              │
│    ○ Reading Chair: Empty               │
│                                         │
│    Radar Stats:                         │
│    Points: 127  |  SNR: 23 dB           │
│                                         │
└─────────────────────────────────────────┘
```

### Calibration Checklist

Before finishing calibration, verify:

- [ ] Sensor pose matches physical position
- [ ] All desired areas have coverage
- [ ] Exclusion zones hide problem areas
- [ ] Detection works when sitting still
- [ ] No false positives in empty room
- [ ] Multi-person tracking works (if needed)
- [ ] Zones trigger correctly

## Recalibration

### When to Recalibrate

- Moving furniture significantly
- Relocating the sensor
- Seasonal changes (heating/cooling)
- Adding/removing reflective surfaces
- Persistent detection issues

### Quick Recalibration

For minor adjustments:

1. **Room Settings → Quick Calibrate**
2. **30-second room scan**
3. **Settings auto-adjusted**

### Full Recalibration

For major changes:

1. **Room Settings → Full Calibration**
2. **Clear existing calibration**
3. **Run Calibration Wizard**
4. **Verify all zones**

## Troubleshooting Calibration

| Issue | Possible Cause | Solution |
|-------|----------------|----------|
| Detecting pets | Sensitivity too high | Lower sensitivity, add floor exclusion zone |
| Missing still person | Sensitivity too low | Increase sensitivity, run calibration wizard |
| Ghost detections | Reflective surfaces | Add exclusion zones, check for fans/curtains |
| Delayed detection | High threshold | Lower movement threshold |
| Wrong position shown | Pose error | Recapture sensor pose |
| Zone not triggering | Zone height wrong | Adjust zone height range |

## Next Steps

- [Daily Usage Guide](/products/rs-1/usage/) - Using your calibrated sensor
- [Integrations](/products/rs-1/integrations/) - Connect to Home Assistant
- [Troubleshooting](/products/rs-1/troubleshooting/) - Solve common issues
