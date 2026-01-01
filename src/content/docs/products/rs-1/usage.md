---
title: Daily Usage Guide
description: Get the most out of your RS-1 sensor with automations, zones, and smart home integration
---

Once your RS-1 is set up and calibrated, it works automatically in the background. This guide covers how to use and interact with your sensor day-to-day.

## Dashboard Overview

The OpticWorks app dashboard shows real-time presence data for all your rooms.

### Home Screen

```
┌─────────────────────────────────────────┐
│  OpticWorks                    ⚙️ 👤   │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  🟢 Living Room                 │   │
│  │     ● ● 2 people               │   │
│  │     Last motion: Just now       │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  ⚪ Bedroom                     │   │
│  │     Empty                       │   │
│  │     Last motion: 2 hours ago    │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  🟢 Office                      │   │
│  │     ● 1 person (still)         │   │
│  │     Last motion: 5 min ago      │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

### Room Status Indicators

| Indicator | Meaning |
|-----------|---------|
| 🟢 Green circle | Occupied |
| ⚪ White/Gray circle | Empty |
| 🟡 Yellow circle | Motion detected |
| 🔴 Red circle | Sensor offline |

### Presence States

| State | Description | Visual |
|-------|-------------|--------|
| **Empty** | No one detected | Gray dot |
| **Occupied (Moving)** | Active movement | Pulsing dot |
| **Occupied (Still)** | Person present, minimal movement | Solid dot |
| **Just Left** | Recently vacated (within timeout) | Fading dot |

## Room Detail View

Tap any room to see detailed presence information.

### 2D Floor Plan

```
┌─────────────────────────────────────────┐
│  Living Room                   2D  [3D] │
├─────────────────────────────────────────┤
│                                         │
│   ┌─────────────────────────────────┐  │
│   │           Window                │  │
│   │                                 │  │
│   │   ●                             │  │
│   │   Person 1        ┌────────┐   │  │
│   │   (at couch)      │   TV   │   │  │
│   │                   └────────┘   │  │
│   │         ●                       │  │
│   │         Person 2                │  │
│   │         (moving →)              │  │
│   │  📡                             │  │
│   └─────────────────────────────────┘  │
│                                         │
│  Zones:                                 │
│  ● Couch: Occupied (1)                  │
│  ○ Reading Area: Empty                  │
│                                         │
└─────────────────────────────────────────┘
```

### 3D Perspective View

Tap "3D" to see your RoomPlan model with live presence:

- **Rotate**: Drag with one finger
- **Zoom**: Pinch with two fingers
- **Pan**: Drag with two fingers
- **Reset View**: Double-tap

### Real-Time Stats

| Metric | Update Rate | Description |
|--------|-------------|-------------|
| Position | 30 Hz | XYZ coordinates |
| Occupancy | Instant | Number of people |
| Activity | 1 Hz | Movement level |
| Zone Status | Instant | Per-zone occupancy |

## Automations

Create presence-based automations to control lights, climate, and more.

### Built-in Automations

The app includes pre-configured automation templates:

| Template | Trigger | Action |
|----------|---------|--------|
| **Lights On/Off** | Presence/Absence | Toggle lights |
| **Away Mode** | All rooms empty | Set thermostat, lock doors |
| **Night Mode** | Bedroom occupied at night | Dim lights, quiet hours |
| **Welcome Home** | First person arrives | Lights, music, climate |

### Creating an Automation

1. **Tap "Automations"** in bottom nav
2. **Tap "+ New Automation"**
3. **Choose trigger type**
4. **Configure conditions**
5. **Select actions**
6. **Save**

### Automation Builder

```
┌─────────────────────────────────────────┐
│  New Automation                   [Save] │
├─────────────────────────────────────────┤
│                                         │
│  Name: Office Lights                    │
│                                         │
│  WHEN                                   │
│  ┌─────────────────────────────────┐   │
│  │ 📍 Office becomes occupied       │   │
│  └─────────────────────────────────┘   │
│                                         │
│  AND (optional conditions)              │
│  ┌─────────────────────────────────┐   │
│  │ 🌙 Time is between 6am-10pm      │   │
│  └─────────────────────────────────┘   │
│  [+ Add condition]                      │
│                                         │
│  THEN                                   │
│  ┌─────────────────────────────────┐   │
│  │ 💡 Turn on "Office Lights"       │   │
│  │ 🔆 Set brightness to 80%         │   │
│  └─────────────────────────────────┘   │
│  [+ Add action]                         │
│                                         │
└─────────────────────────────────────────┘
```

### Trigger Types

| Trigger | Description |
|---------|-------------|
| **Room Occupied** | Anyone enters room |
| **Room Empty** | Everyone leaves room |
| **Zone Enter** | Someone enters specific zone |
| **Zone Exit** | Someone leaves specific zone |
| **Person Count Change** | Occupancy number changes |
| **Activity Level** | Movement above/below threshold |
| **Still Presence** | Person detected but not moving |

### Conditions

| Condition | Options |
|-----------|---------|
| **Time of Day** | Between specific hours |
| **Day of Week** | Specific days |
| **Zone Status** | Another zone occupied/empty |
| **Device State** | Light on/off, etc. |
| **Person Count** | More/less than N people |

### Actions

| Action Type | Examples |
|-------------|----------|
| **Lights** | On, off, dim, color |
| **Climate** | Temperature, fan, mode |
| **Scenes** | Activate HomeKit/HA scene |
| **Notifications** | Push alert, sound |
| **Delay** | Wait before next action |

### Automation Examples

**Living Room Movie Mode**
```yaml
Trigger: Living Room still presence > 5 minutes
Condition: Time after 7pm
Actions:
  - Dim lights to 20%
  - Close blinds
  - Set TV input to streaming
```

**Bathroom Exhaust Fan**
```yaml
Trigger: Bathroom becomes occupied
Actions:
  - Turn on exhaust fan
  - When empty for 10 minutes: Turn off fan
```

**Office Focus Time**
```yaml
Trigger: Office zone "Desk" occupied
Condition: Between 9am-5pm on weekdays
Actions:
  - Set Do Not Disturb
  - Turn on desk lamp
  - Start focus playlist
```

## Zone Usage

Zones you created during calibration drive automations and insights.

### Viewing Zone Status

```
┌─────────────────────────────────────────┐
│  Living Room Zones                      │
├─────────────────────────────────────────┤
│                                         │
│  ● Couch Zone                           │
│    Status: Occupied (1 person)          │
│    Time: 45 minutes                     │
│                                         │
│  ○ Reading Chair                        │
│    Status: Empty                        │
│    Last occupied: 2 hours ago           │
│                                         │
│  ○ Entry Area                           │
│    Status: Empty                        │
│    Last trigger: 45 minutes ago         │
│                                         │
└─────────────────────────────────────────┘
```

### Zone Insights

The app tracks zone usage over time:

- **Daily time per zone** - Where you spend time
- **Peak usage hours** - When zones are busiest
- **Patterns** - Recurring behaviors

Access via **Dashboard → Insights**.

## Smart Home Integration

RS-1 connects to popular smart home platforms.

### HomeKit (Apple Home)

Your RS-1 appears as:
- **Occupancy Sensor** - Per-room presence
- **Motion Sensor** - Movement detection

#### Setting Up HomeKit

1. **Open Apple Home app**
2. **Tap "+" → Add Accessory**
3. **Scan QR code** on RS-1 or in OpticWorks app
4. **Assign to room**

#### HomeKit Automations

Create automations in Apple Home:

```
When: Living Room Occupancy Detected
Do: Turn on Living Room lights

When: No Activity in Living Room for 10 min
Do: Turn off Living Room lights
```

### Home Assistant

See [Home Assistant Integration](/products/rs-1/integrations/) for detailed setup.

Quick overview:
- MQTT discovery for automatic setup
- Entities for presence, zones, and targets
- Full parameter control

### Matter

RS-1 supports Matter over Thread:

1. **Enable Matter** in RS-1 settings
2. **Open Matter controller** (Apple Home, Google Home, etc.)
3. **Add device with pairing code**

## Notifications

Get alerts for important presence events.

### Notification Types

| Type | Description |
|------|-------------|
| **Arrival** | Someone arrives home |
| **Departure** | Everyone leaves |
| **Extended Absence** | Room empty too long |
| **Unexpected Presence** | Motion during away mode |

### Configuring Notifications

1. **Settings → Notifications**
2. **Enable desired alerts**
3. **Set quiet hours** (optional)

```
┌─────────────────────────────────────────┐
│  Notifications                          │
├─────────────────────────────────────────┤
│                                         │
│  Arrival Alerts              [ON]       │
│  └── Family members only     [ON]       │
│                                         │
│  Departure Alerts            [ON]       │
│  └── All rooms empty only    [ON]       │
│                                         │
│  Extended Absence            [OFF]      │
│                                         │
│  Security Alerts             [ON]       │
│  └── Motion during Away mode            │
│                                         │
│  Quiet Hours                            │
│  └── 10:00 PM - 7:00 AM     [ON]       │
│                                         │
└─────────────────────────────────────────┘
```

## History & Analytics

View presence history and patterns.

### Activity Timeline

```
┌─────────────────────────────────────────┐
│  Living Room - Today                    │
├─────────────────────────────────────────┤
│                                         │
│  7:00 AM  ━━━━━░░░░░░░░░░░░░░░░━━━━━   │
│  8:00 AM  ━━━━━━━━━━━░░░░░░░░░░░░░░░   │
│  9:00 AM  ░░░░░░░░░░░░░░░░░░░░░░░░░░   │
│  10:00 AM ░░░░░░░░░░░░░░░░░░░░░░░░░░   │
│  ...                                    │
│  6:00 PM  ━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│  7:00 PM  ━━━━━━━━━━━━━━━━━━━━━━━━━━   │
│                                         │
│  ━━━ Occupied   ░░░ Empty               │
│                                         │
│  Total: 6h 30m occupied today           │
│                                         │
└─────────────────────────────────────────┘
```

### Weekly Summary

- **Most used room**: Living Room (32 hours)
- **Most active time**: 6-9 PM
- **Automation runs**: 156
- **Average occupancy**: 2.3 people

### Exporting Data

1. **Settings → Data & Privacy**
2. **Tap "Export History"**
3. **Choose format** (CSV, JSON)
4. **Select date range**
5. **Download or share**

## Widget Support

Add presence widgets to your iPhone home screen.

### Available Widgets

| Widget | Size | Shows |
|--------|------|-------|
| **Room Status** | Small | Single room occupancy |
| **Home Overview** | Medium | All rooms at a glance |
| **Activity Graph** | Large | 24-hour timeline |

### Adding Widgets

1. **Long-press** iPhone home screen
2. **Tap "+"** in corner
3. **Search "OpticWorks"**
4. **Select widget size**
5. **Configure room** (if applicable)

## Maintenance

Keep your RS-1 running optimally.

### Daily (Automatic)

- Presence detection ✓
- Data sync to app ✓
- Firmware update checks ✓

### Weekly

- [ ] Check sensor LED status (solid blue = good)
- [ ] Review any missed detections
- [ ] Verify automations working

### Monthly

- [ ] Clean sensor lens with microfiber cloth
- [ ] Check for firmware updates
- [ ] Review and adjust zones if needed
- [ ] Check analytics for anomalies

### Firmware Updates

Updates are downloaded automatically and applied during low-usage periods.

To manually check:

1. **Room → Sensor → Settings**
2. **Tap "About RS-1"**
3. **View current version**
4. **Tap "Check for Updates"**

## Power Management

### Power Consumption

| State | Power Draw |
|-------|------------|
| Active detection | ~5W |
| Idle (no presence) | ~3W |
| Night mode | ~2.5W |

### Night Mode

Reduce power and LED brightness at night:

1. **Room → Sensor → Settings**
2. **Enable "Night Mode"**
3. **Set schedule** or automatic (based on presence)

## Troubleshooting Quick Reference

| Issue | Quick Fix |
|-------|-----------|
| Sensor offline | Check power and WiFi |
| Not detecting | Run calibration wizard |
| False positives | Add exclusion zones |
| Delayed updates | Check app connection |
| Automation not working | Verify conditions met |

For detailed troubleshooting, see [Troubleshooting Guide](/products/rs-1/troubleshooting/).

## Tips & Best Practices

### Optimize Detection

- Mount sensor with clear view of room
- Avoid pointing directly at windows
- Keep lens clean
- Update firmware regularly

### Improve Automations

- Start simple, add complexity later
- Use conditions to avoid unwanted triggers
- Test automations before relying on them
- Set appropriate timeouts

### Preserve Privacy

- Use local processing (enabled by default)
- Disable cloud sync if not needed
- Review and delete old history data
- Share access only with trusted users

## Next Steps

- [Integrations](/products/rs-1/integrations/) - Connect to Home Assistant, HomeKit
- [Troubleshooting](/products/rs-1/troubleshooting/) - Solve common issues
- [Specifications](/products/rs-1/specifications/) - Technical details
