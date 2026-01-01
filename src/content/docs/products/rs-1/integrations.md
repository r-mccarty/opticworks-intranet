---
title: Smart Home Integrations
description: Connect your RS-1 to Home Assistant, HomeKit, Matter, and other smart home platforms
---

RS-1 integrates with major smart home platforms for seamless automation. This guide covers setup and configuration for each platform.

## Integration Overview

| Platform | Connection | Features |
|----------|------------|----------|
| **Home Assistant** | MQTT / Native | Full control, all entities |
| **Apple HomeKit** | Direct / Matter | Occupancy, motion sensors |
| **Google Home** | Matter | Occupancy, presence |
| **Amazon Alexa** | Matter | Occupancy, routines |
| **SmartThings** | Matter | Occupancy, automations |

## Home Assistant Integration

Home Assistant provides the deepest integration with RS-1.

### Connection Methods

| Method | Setup | Best For |
|--------|-------|----------|
| **MQTT** | Auto-discovery | Most users |
| **Native Integration** | HACS install | Advanced features |
| **ESPHome Proxy** | Manual config | Custom setups |

### MQTT Setup

RS-1 supports MQTT auto-discovery for easy Home Assistant integration.

#### Prerequisites

- Home Assistant with MQTT broker (Mosquitto)
- RS-1 on same network
- MQTT credentials

#### Configuration

1. **In OpticWorks App:**
   - Open room → Sensor settings
   - Tap "Integrations"
   - Enable "MQTT"
   - Enter broker details:

```yaml
MQTT Broker: 192.168.1.100
Port: 1883
Username: homeassistant
Password: ********
Discovery Prefix: homeassistant
```

2. **Verify Connection:**
   - Sensor LED flashes green twice
   - Check Home Assistant → Devices

#### Discovered Entities

RS-1 creates these entities automatically:

```yaml
# Binary Sensors
binary_sensor.rs1_living_room_occupancy      # Room occupied
binary_sensor.rs1_living_room_motion         # Motion detected

# Sensors
sensor.rs1_living_room_occupancy_count       # Number of people
sensor.rs1_living_room_target_1_x            # Person 1 X position
sensor.rs1_living_room_target_1_y            # Person 1 Y position
sensor.rs1_living_room_target_1_z            # Person 1 Z position
sensor.rs1_living_room_target_1_speed        # Person 1 velocity
sensor.rs1_living_room_activity_level        # Overall activity

# Per-Zone Sensors (if configured)
binary_sensor.rs1_living_room_zone_couch     # Couch zone occupied
binary_sensor.rs1_living_room_zone_desk      # Desk zone occupied

# Diagnostic
sensor.rs1_living_room_wifi_signal           # WiFi RSSI
sensor.rs1_living_room_uptime                # Uptime seconds
```

### Native Integration (HACS)

For advanced features, install the OpticWorks integration via HACS.

#### Installation

1. **Open HACS** in Home Assistant
2. **Search "OpticWorks"**
3. **Install**
4. **Restart Home Assistant**
5. **Add Integration:**
   - Settings → Devices & Services
   - Add Integration → OpticWorks
   - Devices are auto-discovered

#### Additional Entities

The native integration provides:

```yaml
# Camera Entity (optional)
camera.rs1_living_room_presence_map     # Real-time presence visualization

# Number Controls
number.rs1_living_room_sensitivity      # Detection sensitivity
number.rs1_living_room_timeout          # Absence timeout

# Select Controls
select.rs1_living_room_mode             # Detection mode

# Buttons
button.rs1_living_room_recalibrate      # Trigger recalibration
```

### Home Assistant Automations

Example automations using RS-1:

#### Lights Based on Presence

```yaml
automation:
  - alias: "Living Room Lights - Presence"
    trigger:
      - platform: state
        entity_id: binary_sensor.rs1_living_room_occupancy
        to: "on"
    condition:
      - condition: sun
        after: sunset
    action:
      - service: light.turn_on
        target:
          entity_id: light.living_room
        data:
          brightness_pct: 80

  - alias: "Living Room Lights - Empty"
    trigger:
      - platform: state
        entity_id: binary_sensor.rs1_living_room_occupancy
        to: "off"
        for: "00:05:00"
    action:
      - service: light.turn_off
        target:
          entity_id: light.living_room
```

#### Zone-Based Automation

```yaml
automation:
  - alias: "Desk Lamp - Working"
    trigger:
      - platform: state
        entity_id: binary_sensor.rs1_office_zone_desk
        to: "on"
    condition:
      - condition: time
        after: "08:00:00"
        before: "18:00:00"
    action:
      - service: light.turn_on
        target:
          entity_id: light.desk_lamp

  - alias: "Desk Lamp - Away"
    trigger:
      - platform: state
        entity_id: binary_sensor.rs1_office_zone_desk
        to: "off"
        for: "00:02:00"
    action:
      - service: light.turn_off
        target:
          entity_id: light.desk_lamp
```

#### Room-Based HVAC

```yaml
automation:
  - alias: "Office HVAC - Presence"
    trigger:
      - platform: state
        entity_id: binary_sensor.rs1_office_occupancy
    action:
      - choose:
          - conditions:
              - condition: state
                entity_id: binary_sensor.rs1_office_occupancy
                state: "on"
            sequence:
              - service: climate.set_hvac_mode
                target:
                  entity_id: climate.office
                data:
                  hvac_mode: heat_cool
          - conditions:
              - condition: state
                entity_id: binary_sensor.rs1_office_occupancy
                state: "off"
            sequence:
              - service: climate.set_hvac_mode
                target:
                  entity_id: climate.office
                data:
                  hvac_mode: "off"
```

#### Multi-Person Notification

```yaml
automation:
  - alias: "Party Mode Detected"
    trigger:
      - platform: numeric_state
        entity_id: sensor.rs1_living_room_occupancy_count
        above: 4
    action:
      - service: notify.mobile_app
        data:
          message: "Party detected! {{ states('sensor.rs1_living_room_occupancy_count') }} people in living room"
```

### Lovelace Cards

#### Simple Status Card

```yaml
type: entities
title: Living Room Presence
entities:
  - entity: binary_sensor.rs1_living_room_occupancy
    name: Occupied
  - entity: sensor.rs1_living_room_occupancy_count
    name: People
  - entity: sensor.rs1_living_room_activity_level
    name: Activity
```

#### Presence Map Card

Using the custom Floorplan card:

```yaml
type: picture-elements
image: /local/floorplan.png
elements:
  - type: state-icon
    entity: binary_sensor.rs1_living_room_occupancy
    style:
      left: 30%
      top: 40%
  - type: state-label
    entity: sensor.rs1_living_room_occupancy_count
    style:
      left: 30%
      top: 45%
```

## Apple HomeKit

RS-1 integrates with Apple Home for Siri control and automations.

### Direct Connection

RS-1 supports HomeKit natively.

#### Setup Steps

1. **Open Apple Home app** on iPhone
2. **Tap "+" → Add Accessory**
3. **Scan HomeKit QR code:**
   - Find in OpticWorks app: Room → Sensor → Settings → HomeKit
   - Or on the Quick Start Guide card
4. **Assign to room**
5. **Done!**

#### HomeKit Entities

RS-1 appears as:

| Accessory | Type | Description |
|-----------|------|-------------|
| RS-1 Occupancy | Occupancy Sensor | Binary occupied/empty |
| RS-1 Motion | Motion Sensor | Movement detected |

### HomeKit Automations

Create automations in Apple Home:

**Lights When Occupied:**
1. Home app → Automation → "+"
2. "An Accessory is Controlled"
3. Select RS-1 Occupancy → "Detects Occupancy"
4. Add lights → Turn On
5. Done

**Turn Off When Empty:**
1. Home app → Automation → "+"
2. "An Accessory is Controlled"
3. Select RS-1 Occupancy → "Stops Detecting Occupancy"
4. Wait 5 minutes
5. Add lights → Turn Off

### HomeKit Limitations

- Only occupancy and motion (no zones)
- No position data
- No sensitivity control
- For full features, use Home Assistant

## Matter Integration

RS-1 supports Matter over WiFi for universal smart home compatibility.

### Matter Setup

1. **Enable Matter** in RS-1:
   - OpticWorks app → Room → Sensor → Settings
   - Enable "Matter"
   - Note the pairing code

2. **Add to Controller:**

   **Apple Home:**
   - Home app → "+" → Add Accessory
   - Enter pairing code or scan QR

   **Google Home:**
   - Google Home app → "+" → Set up device
   - Matter-enabled device
   - Enter pairing code

   **Amazon Alexa:**
   - Alexa app → More → Add Device
   - Matter → Enter pairing code

### Matter Capabilities

| Feature | Supported |
|---------|-----------|
| Occupancy Sensing | ✓ |
| Motion Detection | ✓ |
| Multi-Admin | ✓ |
| OTA Updates | ✓ |

### Multi-Admin

RS-1 can be added to multiple Matter controllers simultaneously:

1. After initial pairing, open OpticWorks app
2. Go to Sensor → Settings → Matter
3. Tap "Add Another Controller"
4. Generate new pairing code
5. Pair with additional controller

## MQTT Direct

For custom integrations or non-Home Assistant MQTT systems.

### MQTT Topics

```
opticworks/rs1/<device_id>/state           # JSON state object
opticworks/rs1/<device_id>/availability    # online/offline
opticworks/rs1/<device_id>/command         # Command input
```

### State Payload

```json
{
  "occupancy": true,
  "motion": true,
  "count": 2,
  "targets": [
    {
      "id": 1,
      "x": 2.3,
      "y": 0.9,
      "z": 1.5,
      "speed": 0.2
    },
    {
      "id": 2,
      "x": 1.1,
      "y": 0.8,
      "z": 3.2,
      "speed": 0.0
    }
  ],
  "zones": {
    "couch": true,
    "desk": false
  },
  "activity_level": 45,
  "wifi_rssi": -52
}
```

### Commands

Send JSON to command topic:

```json
// Set sensitivity
{"command": "set_sensitivity", "value": 75}

// Trigger recalibration
{"command": "recalibrate"}

// Set night mode
{"command": "night_mode", "enabled": true}
```

## Node-RED

Integrate RS-1 with Node-RED for advanced automation flows.

### MQTT Node Setup

```json
{
  "server": "192.168.1.100",
  "port": 1883,
  "topic": "opticworks/rs1/+/state"
}
```

### Example Flow

**Presence → Lighting Control:**

```
[MQTT In] → [JSON Parse] → [Switch] → [Function] → [MQTT Out]
   |                          |
   RS-1 state              occupancy
                           true/false
```

Function node:
```javascript
if (msg.payload.occupancy && msg.payload.count > 0) {
    msg.payload = {
        "brightness": Math.min(100, msg.payload.count * 30),
        "state": "on"
    };
} else {
    msg.payload = {"state": "off"};
}
return msg;
```

## API Access

RS-1 provides a local REST API for custom integrations.

### Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/status` | GET | Current state |
| `/api/config` | GET/POST | Configuration |
| `/api/zones` | GET | Zone status |
| `/api/targets` | GET | Target positions |
| `/api/calibrate` | POST | Trigger calibration |

### Example: Get Status

```bash
curl http://192.168.1.50/api/status
```

Response:
```json
{
  "device_id": "rs1-a1b2c3",
  "firmware": "1.2.3",
  "occupancy": true,
  "count": 2,
  "last_motion": "2024-01-15T10:30:00Z",
  "uptime": 86400
}
```

### Authentication

Enable API authentication in settings:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     http://192.168.1.50/api/status
```

## Webhooks

Configure RS-1 to send webhooks on presence events.

### Setup

1. **Sensor Settings → Integrations → Webhooks**
2. **Add webhook URL**
3. **Select events**

### Webhook Payload

```json
{
  "event": "occupancy_changed",
  "device_id": "rs1-a1b2c3",
  "room": "Living Room",
  "data": {
    "occupancy": true,
    "count": 1,
    "timestamp": "2024-01-15T10:30:00Z"
  }
}
```

### Event Types

- `occupancy_changed`
- `motion_detected`
- `zone_entered`
- `zone_exited`
- `count_changed`

## Troubleshooting Integrations

### MQTT Not Connecting

| Issue | Solution |
|-------|----------|
| Connection refused | Check broker IP and port |
| Auth failed | Verify username/password |
| No entities appear | Check discovery prefix matches HA |
| Entities unavailable | Verify RS-1 is online |

### HomeKit Issues

| Issue | Solution |
|-------|----------|
| Can't find accessory | Ensure on same network |
| Pairing fails | Reset HomeKit in RS-1 settings |
| No response | Restart RS-1 |
| Automations don't run | Check Home app automation settings |

### Matter Issues

| Issue | Solution |
|-------|----------|
| Pairing timeout | Move phone closer to RS-1 |
| Code rejected | Verify code, try regenerating |
| Device offline | Check WiFi connection |
| Multi-admin fails | Ensure first controller allows it |

## Integration Comparison

| Feature | Home Assistant | HomeKit | Matter | MQTT |
|---------|---------------|---------|--------|------|
| Occupancy | ✓ | ✓ | ✓ | ✓ |
| Motion | ✓ | ✓ | ✓ | ✓ |
| Person Count | ✓ | ✗ | ✗ | ✓ |
| Position Data | ✓ | ✗ | ✗ | ✓ |
| Zones | ✓ | ✗ | ✗ | ✓ |
| Sensitivity Control | ✓ | ✗ | ✗ | ✓ |
| Calibration | ✓ | ✗ | ✗ | ✓ |

**Recommendation:** Use Home Assistant with MQTT for full functionality, or HomeKit/Matter for simple presence-based automations.

## Next Steps

- [Daily Usage Guide](/products/rs-1/usage/) - Day-to-day operations
- [Troubleshooting](/products/rs-1/troubleshooting/) - Solve common issues
- [Specifications](/products/rs-1/specifications/) - Technical details
