---
title: Home Assistant Integration
description: Setting up and configuring the Presence Detection Engine with Home Assistant
---

This guide covers the complete Home Assistant integration for the Presence Detection Engine, including dashboard setup, automations, and advanced configuration.

## Prerequisites

- Home Assistant 2024.1 or later
- ESPHome add-on installed
- Presence sensor flashed and connected to WiFi

## Adding the Device

### Via ESPHome Add-on

1. Open **Settings** → **Add-ons** → **ESPHome**
2. Click **Open Web UI**
3. The device should appear automatically if on the same network
4. Click **Adopt** to add it to your ESPHome dashboard

### Manual Integration

1. Go to **Settings** → **Devices & Services**
2. Click **Add Integration**
3. Search for "ESPHome"
4. Enter the device IP address (e.g., `192.168.1.100`)

## Exposed Entities

The Presence Engine exposes these entities to Home Assistant:

### Binary Sensors

| Entity | Description |
|--------|-------------|
| `binary_sensor.presence_sensor_presence` | Main presence state (on/off) |
| `binary_sensor.presence_sensor_motion` | Raw LD2410 motion flag |

### Sensors

| Entity | Description |
|--------|-------------|
| `sensor.presence_sensor_z_score` | Current z-score value |
| `sensor.presence_sensor_energy` | Current energy reading |
| `sensor.presence_sensor_distance` | Distance to detected target |
| `sensor.presence_sensor_state` | Current state machine state |
| `sensor.presence_sensor_state_reason` | Why current state was entered |
| `sensor.presence_sensor_change_reason` | Why last transition occurred |

### Input Numbers (Runtime Tuning)

| Entity | Default | Range |
|--------|---------|-------|
| `number.presence_sensor_enter_threshold` | 2.0 | 0.5 - 5.0 |
| `number.presence_sensor_exit_threshold` | 1.0 | 0.1 - 3.0 |
| `number.presence_sensor_enter_debounce` | 500 | 100 - 5000 ms |
| `number.presence_sensor_exit_debounce` | 2000 | 500 - 30000 ms |
| `number.presence_sensor_min_distance` | 0.2 | 0 - 6.0 m |
| `number.presence_sensor_max_distance` | 4.0 | 0.5 - 6.0 m |

### Services

| Service | Description |
|---------|-------------|
| `esphome.presence_sensor_start_calibration` | Begin calibration |
| `esphome.presence_sensor_clear_calibration` | Reset to defaults |
| `esphome.presence_sensor_force_clear` | Force state to CLEAR |

## Dashboard Setup

### Basic Card

```yaml
type: entities
title: Presence Sensor
entities:
  - entity: binary_sensor.presence_sensor_presence
    name: Presence Detected
  - entity: sensor.presence_sensor_z_score
    name: Z-Score
  - entity: sensor.presence_sensor_state
    name: State
  - entity: sensor.presence_sensor_state_reason
    name: State Reason
```

### Comprehensive Dashboard

Create a new dashboard view with this YAML:

```yaml
title: Presence Engine
views:
  - title: Overview
    cards:
      # Status Card
      - type: vertical-stack
        cards:
          - type: entity
            entity: binary_sensor.presence_sensor_presence
            name: Presence Status
            state_color: true

          - type: gauge
            entity: sensor.presence_sensor_z_score
            name: Z-Score
            min: -3
            max: 6
            severity:
              green: 0
              yellow: 2
              red: 3

          - type: entity
            entity: sensor.presence_sensor_state
            name: State Machine
            icon: mdi:state-machine

      # Tuning Card
      - type: entities
        title: Detection Parameters
        entities:
          - entity: number.presence_sensor_enter_threshold
            name: Enter Threshold
          - entity: number.presence_sensor_exit_threshold
            name: Exit Threshold
          - type: divider
          - entity: number.presence_sensor_enter_debounce
            name: Enter Debounce (ms)
          - entity: number.presence_sensor_exit_debounce
            name: Exit Debounce (ms)
          - type: divider
          - entity: number.presence_sensor_min_distance
            name: Min Distance (m)
          - entity: number.presence_sensor_max_distance
            name: Max Distance (m)

      # Diagnostics Card
      - type: entities
        title: Diagnostics
        entities:
          - entity: sensor.presence_sensor_energy
            name: Energy Level
          - entity: sensor.presence_sensor_distance
            name: Target Distance
          - entity: sensor.presence_sensor_state_reason
            name: Current State Reason
          - entity: sensor.presence_sensor_change_reason
            name: Last Change Reason

      # History Graph
      - type: history-graph
        title: Detection History
        hours_to_show: 24
        entities:
          - entity: binary_sensor.presence_sensor_presence
          - entity: sensor.presence_sensor_z_score

      # Calibration Controls
      - type: entities
        title: Calibration
        entities:
          - type: button
            name: Start Calibration
            tap_action:
              action: call-service
              service: esphome.presence_sensor_start_calibration
          - type: button
            name: Clear Calibration
            tap_action:
              action: call-service
              service: esphome.presence_sensor_clear_calibration
              confirmation:
                text: Are you sure you want to reset calibration?
```

### Calibration Wizard Dashboard

```yaml
type: vertical-stack
cards:
  - type: markdown
    content: |
      ## Calibration Wizard

      Follow these steps to calibrate your presence sensor:

      1. **Ensure the room is completely empty**
      2. Click "Start Calibration" below
      3. Wait 30 seconds (don't enter the room!)
      4. Calibration will complete automatically

  - type: conditional
    conditions:
      - entity: sensor.presence_sensor_state
        state: CALIBRATING
    card:
      type: markdown
      content: |
        ### Calibrating...
        Please wait. Do not enter the detection area.

        Progress: Collecting samples...

  - type: conditional
    conditions:
      - entity: sensor.presence_sensor_state
        state_not: CALIBRATING
    card:
      type: button
      name: Start Calibration
      icon: mdi:tune
      tap_action:
        action: call-service
        service: esphome.presence_sensor_start_calibration
```

## Automations

### Bedroom Blueprint

Import this blueprint for bedroom occupancy automation:

```yaml
blueprint:
  name: Bed Occupancy Automation
  description: Automate lights and climate based on bed presence
  domain: automation
  input:
    presence_sensor:
      name: Presence Sensor
      selector:
        entity:
          domain: binary_sensor
    light_entity:
      name: Bedroom Light
      selector:
        entity:
          domain: light
    delay_off:
      name: Delay before turning off
      default: 30
      selector:
        number:
          min: 0
          max: 300
          unit_of_measurement: seconds

trigger:
  - platform: state
    entity_id: !input presence_sensor

action:
  - choose:
      - conditions:
          - condition: state
            entity_id: !input presence_sensor
            state: "on"
        sequence:
          - service: light.turn_off
            target:
              entity_id: !input light_entity
      - conditions:
          - condition: state
            entity_id: !input presence_sensor
            state: "off"
        sequence:
          - delay:
              seconds: !input delay_off
          - condition: state
            entity_id: !input presence_sensor
            state: "off"
          - service: light.turn_on
            target:
              entity_id: !input light_entity
```

### Example Automation: Room Occupied

```yaml
alias: Bedroom - Occupied Notification
description: Notify when someone is in bed
trigger:
  - platform: state
    entity_id: binary_sensor.presence_sensor_presence
    to: "on"
    for:
      minutes: 5
condition:
  - condition: time
    after: "22:00:00"
    before: "06:00:00"
action:
  - service: notify.mobile_app
    data:
      title: "Bedroom"
      message: "Someone is in bed"
mode: single
```

### Example Automation: Away Mode

```yaml
alias: Bedroom - Away Mode
description: Adjust thermostat when room is empty
trigger:
  - platform: state
    entity_id: binary_sensor.presence_sensor_presence
    to: "off"
    for:
      minutes: 30
action:
  - service: climate.set_temperature
    target:
      entity_id: climate.bedroom
    data:
      temperature: 65
mode: single
```

## Helper Entities

Create these helper entities for advanced use:

### Input Boolean: Calibration Mode

```yaml
# configuration.yaml
input_boolean:
  presence_calibration_mode:
    name: Calibration Mode
    icon: mdi:tune
```

### Template Sensor: Occupancy Duration

```yaml
# configuration.yaml
template:
  - sensor:
      - name: "Bedroom Occupancy Duration"
        unit_of_measurement: "minutes"
        state: >
          {% if is_state('binary_sensor.presence_sensor_presence', 'on') %}
            {{ ((now() - states.binary_sensor.presence_sensor_presence.last_changed).total_seconds() / 60) | round(1) }}
          {% else %}
            0
          {% endif %}
```

## Troubleshooting

### Sensor Shows "Unavailable"

1. Check device is powered and connected to WiFi
2. Verify ESPHome add-on can reach the device
3. Check logs: **Settings** → **Add-ons** → **ESPHome** → **Logs**

### False Positives

1. Lower the `enter_threshold` (try 2.5 or 3.0)
2. Increase `enter_debounce` (try 1000ms)
3. Check for moving objects in detection area (fans, curtains)

### Slow Response

1. Reduce `exit_debounce` (try 1000ms)
2. Adjust distance window to exclude far objects
3. Check WiFi signal strength

### Z-Score Always High

1. Run calibration with empty room
2. Ensure no objects moved during calibration
3. Check for interference (other radars, electronics)

## Advanced Configuration

### Multiple Sensors

For multiple presence sensors, use unique names:

```yaml
# bedroom-sensor.yaml
esphome:
  name: bedroom-presence

# office-sensor.yaml
esphome:
  name: office-presence
```

### Zones

Create different detection zones with distance windowing:

```yaml
# Near bed (0-1.5m)
presence_engine:
  min_distance: 0m
  max_distance: 1.5m

# Far side (1.5-3m)
presence_engine:
  min_distance: 1.5m
  max_distance: 3m
```

### MQTT Alternative

If not using native ESPHome API:

```yaml
mqtt:
  broker: 192.168.1.50
  username: !secret mqtt_user
  password: !secret mqtt_password

binary_sensor:
  - platform: presence_engine
    name: "Presence"
    on_state:
      - mqtt.publish:
          topic: "home/bedroom/presence"
          payload: !lambda 'return x ? "on" : "off";'
```
