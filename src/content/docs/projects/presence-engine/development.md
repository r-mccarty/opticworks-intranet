---
title: Presence Engine Development Guide
description: Setting up your development environment and contributing to the Presence Detection Engine
---

This guide covers the complete development workflow for the Presence Detection Engine, from environment setup to testing and contributing.

## Prerequisites

- **Operating System**: Windows, macOS, or Linux
- **Python**: 3.10 or higher
- **Node.js**: 18+ (for ESPHome dashboard)
- **Hardware**: ESP32 + LD2410 for testing
- **Home Assistant**: Local instance for integration testing

## Development Environment Options

### Option 1: GitHub Codespaces (Recommended)

The repository includes a devcontainer configuration for one-click setup:

1. Open [the repository](https://github.com/r-mccarty/presence-dectection-engine)
2. Click **Code** → **Codespaces** → **Create codespace**
3. Wait for environment to build (~3 minutes)

The Codespace includes:
- ESPHome with all dependencies
- Python test environment
- VS Code extensions for YAML and C++

:::note[Hardware Flashing]
Codespaces cannot flash ESP32 directly. Use the companion `ubuntu-node` for hardware operations.
:::

### Option 2: Local Development

#### Install Dependencies

```bash
# Clone repository
git clone https://github.com/r-mccarty/presence-dectection-engine.git
cd presence-dectection-engine

# Create Python virtual environment
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows

# Install dependencies
pip install -r requirements.txt
pip install esphome platformio

# Install PlatformIO for C++ testing
pip install platformio
pio platform install espressif32
```

#### Install ESPHome

```bash
pip install esphome

# Verify installation
esphome version
```

## Project Structure

```
presence-detection-engine/
├── .devcontainer/          # GitHub Codespaces config
├── docs/
│   ├── architecture/       # System design documentation
│   ├── workflows/          # Development guides
│   └── troubleshooting/    # Common issues and solutions
├── esphome/
│   ├── base.yaml          # Base ESPHome configuration
│   ├── secrets.yaml.example
│   └── components/
│       └── presence_engine/
│           ├── __init__.py
│           ├── presence_engine.h
│           ├── presence_engine.cpp
│           ├── state_machine.h
│           ├── statistics.h
│           └── calibration.h
├── homeassistant/
│   ├── dashboards/        # Lovelace YAML
│   ├── blueprints/        # Automation blueprints
│   └── helpers/           # Input number/boolean configs
├── tests/
│   ├── unit/              # PlatformIO C++ tests
│   └── e2e/               # Python integration tests
├── hardware/              # 3D printable mounts
├── platformio.ini         # PlatformIO configuration
└── requirements.txt       # Python dependencies
```

## Configuration

### ESPHome Secrets

Create `esphome/secrets.yaml`:

```yaml
wifi_ssid: "YourNetworkName"
wifi_password: "YourWiFiPassword"

# Optional: Home Assistant API
ha_api_password: "your-api-password"

# Optional: OTA updates
ota_password: "your-ota-password"
```

### Base Configuration

The `esphome/base.yaml` provides the foundation:

```yaml
esphome:
  name: presence-sensor
  platform: ESP32
  board: esp32dev

wifi:
  ssid: !secret wifi_ssid
  password: !secret wifi_password

api:
  password: !secret ha_api_password

ota:
  password: !secret ota_password

logger:
  level: DEBUG

# Include the presence engine component
external_components:
  - source:
      type: local
      path: components

presence_engine:
  # LD2410 UART configuration
  uart_id: uart_ld2410
  tx_pin: GPIO17
  rx_pin: GPIO16

  # Detection parameters
  enter_threshold: 2.0
  exit_threshold: 1.0
  enter_debounce: 500ms
  exit_debounce: 2000ms

  # Distance window (optional)
  min_distance: 0.2m
  max_distance: 2.0m
```

## Building and Flashing

### Compile Firmware

```bash
cd esphome
esphome compile base.yaml
```

### Flash to Device

```bash
# Via USB
esphome run base.yaml

# Via OTA (after initial flash)
esphome run base.yaml --device presence-sensor.local
```

### View Logs

```bash
esphome logs base.yaml
```

## Testing

### Unit Tests (C++)

The C++ components are tested with PlatformIO:

```bash
# Run all unit tests
pio test -e native

# Run specific test
pio test -e native -f test_state_machine

# Run with verbose output
pio test -e native -v
```

**Test Structure:**

```
tests/unit/
├── test_state_machine/
│   └── test_transitions.cpp
├── test_statistics/
│   └── test_rolling_stats.cpp
├── test_calibration/
│   └── test_mad.cpp
└── test_main.cpp
```

**Example Test:**

```cpp
// tests/unit/test_state_machine/test_transitions.cpp
#include <unity.h>
#include "state_machine.h"

void test_clear_to_entering() {
    StateMachine sm;
    sm.set_thresholds(2.0, 1.0);

    TEST_ASSERT_EQUAL(STATE_CLEAR, sm.current_state());

    sm.update(2.5);  // Above enter threshold
    TEST_ASSERT_EQUAL(STATE_ENTERING, sm.current_state());
}

void test_entering_requires_debounce() {
    StateMachine sm;
    sm.set_thresholds(2.0, 1.0);
    sm.set_debounce(500, 2000);

    sm.update(2.5);  // Enter ENTERING state
    TEST_ASSERT_EQUAL(STATE_ENTERING, sm.current_state());

    // Not enough time passed
    sm.advance_time(400);
    sm.update(2.5);
    TEST_ASSERT_EQUAL(STATE_ENTERING, sm.current_state());

    // Now enough time
    sm.advance_time(200);
    sm.update(2.5);
    TEST_ASSERT_EQUAL(STATE_PRESENT, sm.current_state());
}
```

### Integration Tests (Python)

```bash
# Install test dependencies
pip install pytest pytest-asyncio aiohttp

# Run E2E tests (requires Home Assistant)
pytest tests/e2e/ -v

# Run with specific Home Assistant URL
HA_URL=http://192.168.1.100:8123 pytest tests/e2e/ -v
```

**Example E2E Test:**

```python
# tests/e2e/test_presence_detection.py
import pytest
from homeassistant_api import Client

@pytest.fixture
async def ha_client():
    client = Client(
        os.environ.get('HA_URL', 'http://localhost:8123'),
        os.environ.get('HA_TOKEN')
    )
    return client

@pytest.mark.asyncio
async def test_presence_detected(ha_client):
    # Simulate presence by adjusting threshold
    await ha_client.set_state(
        'number.presence_sensor_enter_threshold',
        state='0.5'
    )

    # Wait for state change
    await asyncio.sleep(2)

    state = await ha_client.get_state('binary_sensor.presence_sensor')
    assert state.state == 'on'
```

## Development Workflow

### 1. Create Feature Branch

```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature
```

### 2. Make Changes

- **C++ code**: Follow the existing style (4-space indent, snake_case)
- **Python code**: Use Black formatter and isort
- **YAML**: 2-space indent, follow ESPHome conventions

### 3. Test Locally

```bash
# Run unit tests
pio test -e native

# Compile and flash
cd esphome && esphome run base.yaml

# Run E2E tests
pytest tests/e2e/
```

### 4. Commit

```bash
git add .
git commit -m "feat: add new feature"
```

Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `test:` Tests
- `refactor:` Code refactoring

### 5. Create Pull Request

Push to GitHub and create a PR against `main`.

## Debugging

### Serial Monitor

```bash
# View ESP32 serial output
esphome logs base.yaml --device /dev/ttyUSB0
```

### Debug Logging

Enable verbose logging in `base.yaml`:

```yaml
logger:
  level: VERBOSE
  logs:
    presence_engine: DEBUG
    sensor: INFO
```

### Home Assistant Debugging

Check Developer Tools → States for entity values.

Enable debug logging in HA:

```yaml
# configuration.yaml
logger:
  default: info
  logs:
    homeassistant.components.esphome: debug
```

## Common Issues

### "LD2410 not responding"

1. Check wiring (TX→RX, RX→TX)
2. Verify baud rate (256000)
3. Ensure 3.3V power (not 5V)

### "State stuck in ENTERING"

1. Check `enter_debounce` isn't too long
2. Verify z-score is actually above threshold
3. Check sensor readings in logs

### "Calibration fails"

1. Ensure room is empty during calibration
2. Collect at least 300 samples
3. Check for interference sources

## Resources

| Resource | Location |
|----------|----------|
| ESPHome Docs | https://esphome.io |
| LD2410 Datasheet | `docs/hardware/ld2410.pdf` |
| Component API | `docs/api/` |
| Troubleshooting | `docs/troubleshooting/` |

## Getting Help

- **GitHub Issues**: Bug reports and feature requests
- **Discord**: OpticWorks community server
- **Home Assistant Forum**: Tag with "opticworks"
