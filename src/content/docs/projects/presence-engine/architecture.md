---
title: Presence Engine Architecture
description: Technical architecture of the Presence Detection Engine including state machines and signal processing
---

This document covers the technical architecture of the Presence Detection Engine, including the detection pipeline, state machine design, and calibration system.

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     ESP32 Microcontroller                       │
│                                                                 │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────┐ │
│  │   LD2410    │───▶│   Signal    │───▶│   State Machine    │ │
│  │   Driver    │    │  Processing │    │                    │ │
│  └─────────────┘    └─────────────┘    └──────────┬──────────┘ │
│                                                   │             │
│  ┌─────────────────────────────────────────────────┐           │
│  │                   ESPHome API                    │           │
│  └─────────────────────────────────────────────────┘           │
│                           │                                     │
└───────────────────────────┼─────────────────────────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │     Home Assistant      │
              │  ┌───────────────────┐  │
              │  │ Binary Sensors    │  │
              │  │ Input Numbers     │  │
              │  │ Automations       │  │
              │  └───────────────────┘  │
              └─────────────────────────┘
```

## Detection Pipeline

### Stage 1: Raw Data Acquisition

The LD2410 provides target data at approximately 10Hz:

```cpp
struct LD2410Reading {
    bool motion_detected;           // Coarse motion flag
    bool presence_detected;         // Coarse presence flag
    uint16_t motion_energy;         // 0-100 motion energy
    uint16_t presence_energy;       // 0-100 static presence energy
    uint16_t motion_distance_cm;    // Distance to motion target
    uint16_t presence_distance_cm;  // Distance to static target
};
```

### Stage 2: Statistical Processing

Raw readings are processed through statistical filters:

```
              ┌──────────────┐
Raw Energy ──▶│ Rolling Stats│──▶ μ, σ
              └──────────────┘
                     │
                     ▼
              ┌──────────────┐
              │   Z-Score    │──▶ z = (x - μ) / σ
              │  Calculator  │
              └──────────────┘
                     │
                     ▼
              ┌──────────────┐
              │  Threshold   │──▶ Detection Event
              │  Comparator  │
              └──────────────┘
```

**Rolling Statistics (μ, σ)**

We maintain running statistics using Welford's online algorithm:

```cpp
class RollingStats {
    float mean = 0.0;
    float m2 = 0.0;
    int count = 0;
    int window_size = 300;  // ~30 seconds at 10Hz

    void update(float value) {
        count++;
        float delta = value - mean;
        mean += delta / count;
        float delta2 = value - mean;
        m2 += delta * delta2;
    }

    float variance() { return m2 / (count - 1); }
    float stddev() { return sqrt(variance()); }
};
```

**Z-Score Calculation**

```cpp
float z_score = (current_energy - baseline_mean) / baseline_stddev;
```

### Stage 3: State Machine

The detection uses a 4-state machine with debouncing:

```
                    ┌─────────────┐
         ┌─────────▶│    CLEAR    │◀─────────┐
         │          └──────┬──────┘          │
         │                 │                 │
    clear_timer     z > enter_thresh    absolute_clear
    expires              │                   │
         │               ▼                   │
         │          ┌─────────────┐          │
         │          │  ENTERING   │          │
         │          └──────┬──────┘          │
         │                 │                 │
         │          enter_timer              │
         │          expires                  │
         │               │                   │
         │               ▼                   │
         │          ┌─────────────┐          │
         └──────────│   PRESENT   │──────────┘
         │          └──────┬──────┘          │
         │                 │                 │
    z > enter_thresh  z < exit_thresh       │
         │               │                   │
         │               ▼                   │
         │          ┌─────────────┐          │
         └──────────│   EXITING   │──────────┘
                    └─────────────┘
```

**State Definitions**

| State | Description | Sensor Output |
|-------|-------------|---------------|
| `CLEAR` | No presence detected | `off` |
| `ENTERING` | Possible presence, debouncing | `off` |
| `PRESENT` | Confirmed presence | `on` |
| `EXITING` | Possible exit, debouncing | `on` |

**State Transitions**

```cpp
void update_state(float z_score) {
    switch (current_state) {
        case CLEAR:
            if (z_score > enter_threshold) {
                transition_to(ENTERING);
                start_enter_timer();
            }
            break;

        case ENTERING:
            if (z_score < exit_threshold) {
                transition_to(CLEAR);
            } else if (enter_timer_expired()) {
                transition_to(PRESENT);
            }
            break;

        case PRESENT:
            if (z_score < exit_threshold) {
                transition_to(EXITING);
                start_exit_timer();
            }
            break;

        case EXITING:
            if (z_score > enter_threshold) {
                transition_to(PRESENT);
            } else if (exit_timer_expired()) {
                transition_to(CLEAR);
            }
            break;
    }
}
```

## Calibration System

### MAD-Based Baseline

The calibration uses Median Absolute Deviation (MAD) for robust baseline estimation:

```
        ┌──────────────────────────────────────────┐
        │          Calibration Process             │
        │                                          │
        │  1. Collect N samples (room empty)       │
        │  2. Calculate median of samples          │
        │  3. Calculate |sample - median| for all  │
        │  4. MAD = median of absolute deviations  │
        │  5. σ_robust = 1.4826 × MAD             │
        │                                          │
        └──────────────────────────────────────────┘
```

### Calibration Storage

```yaml
# Stored in ESPHome preferences
calibration:
  baseline_mean: 15.2
  baseline_stddev: 3.7
  timestamp: "2024-01-15T10:30:00Z"
  sample_count: 300
```

### Distance Windowing

Detection can be limited to specific distance ranges:

```cpp
struct DistanceWindow {
    uint16_t min_cm = 0;
    uint16_t max_cm = 400;  // 4 meters

    bool in_window(uint16_t distance) {
        return distance >= min_cm && distance <= max_cm;
    }
};
```

## ESPHome Component Structure

```
esphome/components/
├── presence_engine/
│   ├── __init__.py          # Component registration
│   ├── presence_engine.h    # Main header
│   ├── presence_engine.cpp  # Core implementation
│   ├── state_machine.h      # State machine logic
│   ├── statistics.h         # Rolling stats
│   └── calibration.h        # Calibration logic
```

### Component Interface

```cpp
class PresenceEngine : public Component {
public:
    void setup() override;
    void loop() override;

    // Sensors
    sensor::Sensor *z_score_sensor;
    binary_sensor::BinarySensor *presence_sensor;
    text_sensor::TextSensor *state_reason_sensor;

    // Configuration (runtime-adjustable)
    number::Number *enter_threshold;
    number::Number *exit_threshold;
    number::Number *enter_debounce_ms;
    number::Number *exit_debounce_ms;

    // Services
    void start_calibration();
    void clear_calibration();
    void force_state(PresenceState state);
};
```

## Data Flow

```
LD2410 (10Hz)
     │
     ▼
┌────────────────────┐
│ Read energy values │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Distance filtering │──▶ Ignore if outside window
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Calculate z-score  │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Update state       │
│ machine            │
└─────────┬──────────┘
          │
          ▼
┌────────────────────┐
│ Publish to         │
│ Home Assistant     │
└────────────────────┘
```

## Memory Usage

| Component | RAM Usage |
|-----------|-----------|
| Rolling stats buffer | 2.4 KB |
| State machine | 64 bytes |
| Calibration data | 128 bytes |
| ESPHome overhead | ~40 KB |
| **Total** | ~45 KB |

ESP32-WROOM-32 has 520KB SRAM, leaving plenty of headroom.

## Timing Requirements

| Operation | Target | Actual |
|-----------|--------|--------|
| Sensor read | 100ms | 100ms |
| Z-score calc | <1ms | ~0.1ms |
| State update | <1ms | ~0.05ms |
| HA publish | 100ms | 50-150ms |

## Error Handling

### Sensor Disconnection

```cpp
void loop() {
    if (!ld2410.is_connected()) {
        sensor_failures++;
        if (sensor_failures > MAX_FAILURES) {
            set_state(ERROR);
            log_error("LD2410 disconnected");
        }
        return;
    }
    sensor_failures = 0;
    // ... normal processing
}
```

### Invalid Readings

```cpp
bool is_valid_reading(const LD2410Reading& r) {
    return r.presence_energy <= 100 &&
           r.motion_energy <= 100 &&
           r.presence_distance_cm <= 600;
}
```

## Performance Optimization

1. **Avoid floating-point where possible** - Use fixed-point for simple comparisons
2. **Minimize allocations** - Pre-allocated buffers for rolling stats
3. **Batch HA updates** - Don't publish every sensor read
4. **Use ESP32 dual cores** - Sensor reading on Core 0, processing on Core 1
