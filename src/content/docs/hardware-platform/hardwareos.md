---
title: hardwareOS
description: Go + React embedded firmware for RS-1 devices.
---

<div class="notice-spec-phase">
<strong>Spec Phase:</strong> hardwareOS is in active development. Documentation reflects current design and implementation progress.
</div>

**hardwareOS** is the embedded firmware platform for RS-1 devices, built with Go for backend logic and React for the web-based configuration UI.

## Architecture

```
┌─────────────────────────────────────────────────┐
│              hardwareOS Application             │
├─────────────────────────────────────────────────┤
│  React Web UI                                   │
│    ├── Device configuration                     │
│    ├── Zone management                          │
│    ├── Real-time status                         │
│    └── OTA update interface                     │
├─────────────────────────────────────────────────┤
│  Go Backend                                     │
│    ├── HTTP API server                          │
│    ├── Sensor data processing                   │
│    ├── Home Assistant MQTT                      │
│    └── System management                        │
├─────────────────────────────────────────────────┤
│  rv1106-system (Linux)                          │
└─────────────────────────────────────────────────┘
```

## Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Backend** | Go | API server, sensor processing |
| **Frontend** | React | Configuration web UI |
| **Protocol** | MQTT | Home Assistant integration |
| **Build** | Cross-compilation | ARM target from x86 |

## Development

### Prerequisites

```bash
# Go toolchain
go version  # 1.21+

# Node.js for React build
node --version  # 18+

# Cross-compilation tools
apt install gcc-arm-linux-gnueabihf
```

### Building

```bash
cd hardwareOS

# Build Go backend
GOOS=linux GOARCH=arm GOARM=7 go build -o hardwareos ./cmd/main.go

# Build React frontend
cd web && npm run build
```

### Development Server

```bash
# Run locally for development
go run ./cmd/main.go --dev

# Frontend dev server
cd web && npm run dev
```

## Features

### Web Configuration UI

- **Device setup** — Network, name, location
- **Zone management** — Define presence detection zones
- **Sensor tuning** — Sensitivity, range, thresholds
- **Status dashboard** — Real-time sensor data

### Home Assistant Integration

hardwareOS publishes presence data via MQTT:

```yaml
# Example MQTT topic structure
homeassistant/binary_sensor/rs1_living_room/presence/state
homeassistant/sensor/rs1_living_room/target_count/state
```

### OTA Updates

Firmware updates delivered via:
- Web UI upload
- Automatic update check (configurable)
- Rollback support on failure

## API Reference

### Status Endpoint

```bash
GET /api/status
```

Returns device health, sensor readings, and system info.

### Configuration Endpoint

```bash
GET /api/config
PUT /api/config
```

Read and update device configuration.

## Deployment

Built artifacts are deployed to RS-1 devices via:

1. **OTA** — Push through web UI or scheduled update
2. **Flash** — Direct write to device storage
3. **SD Card** — Manual update for recovery

---

**Source:** `hardwareOS/README.md`, `rs-1/docs/firmware/README.md`
