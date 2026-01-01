---
title: Development Hardware
description: Hardware resources available for OpticWorks development including N100 nodes, RS-1 dev kits, and ESP32 setups
---

OpticWorks provides various hardware resources for development, testing, and CI/CD purposes. This guide covers how to access and use our development hardware.

## Hardware Inventory Overview

| Category | Hardware | Purpose | Location |
|----------|----------|---------|----------|
| Dev Nodes | Intel N100 Mini PCs | Local CI, Home Assistant, testing | Office / Remote |
| Sensors | RS-1 Dev Kits | hardwareOS development | Office Lab |
| IoT | ESP32 + LD2410 | Presence Engine development | Personal / Lab |
| Accessories | Various | Cables, power supplies, mounts | Office Lab |

## N100 Development Nodes

### What are N100 Nodes?

Intel N100-based mini PCs that serve as local development servers, CI runners, and Home Assistant test hosts. These low-power (~15W) machines run 24/7 and provide:

- Local GitHub Actions runners for hardware testing
- Home Assistant instances for integration testing
- Development databases and caches
- Firmware flashing stations

### Node Inventory

| Node | Specs | Purpose | Owner |
|------|-------|---------|-------|
| `n100-lab-1` | N100, 16GB, 512GB NVMe | Primary CI runner | Shared |
| `n100-lab-2` | N100, 16GB, 256GB NVMe | Home Assistant host | OSS Team |
| `n100-remote-ryan` | N100, 8GB, 256GB NVMe | Remote dev/flash | Ryan |
| `n100-remote-[name]` | Varies | Remote development | Individual |

### Accessing Lab Nodes

```bash
# SSH access (requires VPN or office network)
ssh developer@n100-lab-1.local

# Alternative via Tailscale
ssh developer@n100-lab-1.ts.optic.works
```

### Common Services on N100 Nodes

```
n100-lab-1
├── GitHub Actions Runner (hardware tests)
├── Docker (local registry)
└── USB passthrough for RS-1 flashing

n100-lab-2
├── Home Assistant (test instance)
├── MQTT Broker (Mosquitto)
├── ESPHome Dashboard
└── PostgreSQL (test database)
```

### Home Assistant on N100

Access the test Home Assistant instance:

- **URL:** http://n100-lab-2.local:8123
- **Access:** See Infisical for credentials
- **Purpose:** Integration testing for Presence Engine

### GitHub Actions on N100

The lab nodes run self-hosted GitHub Actions runners:

```yaml
# Use self-hosted runner for hardware tests
jobs:
  hardware-test:
    runs-on: [self-hosted, hardware]
    steps:
      - name: Flash ESP32
        run: esphome run test-device.yaml
```

### Requesting a Remote N100

For remote work with hardware testing needs:

1. Submit IT ticket with justification
2. Specify your home network setup
3. IT will ship pre-configured N100
4. Connect to Tailscale network
5. Access via `n100-remote-[yourname].ts.optic.works`

## RS-1 Development Kits

### What's Included

Each RS-1 dev kit contains:

| Item | Description |
|------|-------------|
| RS-1 Device | RV1106-based sensor fusion unit |
| USB-C Debug Cable | For serial console and flashing |
| Power Adapter | 5V 3A USB-C power |
| Mounting Bracket | 3D printed desk mount |
| Quick Start Guide | Setup instructions |

### Getting a Dev Kit

**In Office:**
- Check out from the hardware lab
- Sign the equipment log
- Return when done

**Remote:**
1. Submit IT ticket for dev kit loan
2. Provide shipping address
3. Kit ships within 2 business days
4. Return when project completes

### Connecting to RS-1

```bash
# Connect USB-C debug cable
# Find serial device
ls /dev/ttyUSB* # Linux
ls /dev/cu.usbserial* # macOS

# Connect via serial console
screen /dev/ttyUSB0 115200

# Or use minicom
minicom -D /dev/ttyUSB0 -b 115200
```

### Flashing RS-1 Firmware

```bash
# Navigate to hardwareOS directory
cd ~/workspace/hardwareOS

# Build firmware
./tools/build.sh --type debug

# Flash via USB (device in boot mode)
./tools/flash.sh dist/firmware-debug.bin
```

### RS-1 Boot Mode

To enter boot mode for flashing:

1. Disconnect power
2. Hold BOOT button
3. Connect power
4. Release BOOT button after 2 seconds
5. Device is now in flash mode

### Debugging RS-1

```bash
# View live logs
ssh root@192.168.1.x 'journalctl -f'

# Debug fusion algorithm
./tools/debug.sh --component fusion

# Remote GDB session
./tools/gdb-remote.sh 192.168.1.x
```

## ESP32 Development Kits

### Bill of Materials

Standard ESP32 development setup for Presence Engine:

| Component | Model | Quantity | Source |
|-----------|-------|----------|--------|
| Microcontroller | ESP32-WROOM-32 DevKit | 1 | Amazon/AliExpress |
| Radar Sensor | HLK-LD2410 | 1 | AliExpress |
| Jumper Wires | Female-to-Female | 4 | Amazon |
| USB Cable | USB-A to Micro-USB | 1 | Any |
| Breadboard | Half-size (optional) | 1 | Amazon |

**Approximate Cost:** $15-20 per kit

### Wiring Diagram

```
ESP32                   LD2410
┌─────────────┐        ┌─────────────┐
│         3V3 │────────│ VCC         │
│         GND │────────│ GND         │
│      GPIO17 │────────│ RX          │
│      GPIO16 │────────│ TX          │
└─────────────┘        └─────────────┘
```

### Flashing ESP32

```bash
# Install ESPHome
pip install esphome

# Navigate to presence engine repo
cd ~/workspace/presence-detection-engine/esphome

# Create secrets file
cp secrets.yaml.example secrets.yaml
# Edit with your WiFi credentials

# Compile and flash
esphome run base.yaml
```

### Viewing Logs

```bash
# Serial logs (USB connected)
esphome logs base.yaml --device /dev/ttyUSB0

# OTA logs (WiFi)
esphome logs base.yaml
```

### Common ESP32 Issues

**"Failed to connect to ESP32"**
- Hold BOOT button while flashing begins
- Check USB cable (some are power-only)
- Try different USB port

**"LD2410 not responding"**
- Verify wiring (TX→RX, RX→TX)
- Check 3.3V power (not 5V)
- Baud rate should be 256000

## Hardware Lab

### Location

The hardware lab is located at [Office Address]. Access requires badge.

### Lab Resources

| Resource | Description |
|----------|-------------|
| Oscilloscope | Rigol DS1054Z for signal debugging |
| Logic Analyzer | Saleae for UART/SPI analysis |
| Soldering Station | Hakko FX-888D |
| 3D Printer | Prusa MK3S+ for enclosures |
| Power Supplies | Bench PSUs for testing |
| Component Storage | Resistors, capacitors, connectors |

### Lab Rules

1. Sign in/out on the lab log
2. Return equipment to designated locations
3. Report any broken equipment immediately
4. Clean up your workspace
5. No food or drinks at workbenches

### Booking Lab Time

For dedicated lab sessions:

1. Check the Lab Calendar in Google Calendar
2. Book 2-4 hour slots
3. Include project name in booking
4. Cancel if plans change

## Remote Development Setup

### Minimum Hardware for Remote Work

| Project | Required Hardware |
|---------|-------------------|
| Store | None (software only) |
| Presence Engine | ESP32 + LD2410 kit |
| hardwareOS | RS-1 dev kit + N100 node |

### USB Passthrough for VMs

If developing in a VM:

```bash
# VirtualBox - pass USB device to guest
VBoxManage modifyvm "VM Name" --usb on
VBoxManage modifyvm "VM Name" --usbehci on

# Add USB filter for ESP32
VBoxManage usbfilter add 0 --target "VM Name" \
  --name "ESP32" --vendorid 10c4 --productid ea60
```

### WSL2 USB Access

Windows users with WSL2:

```powershell
# Install usbipd
winget install usbipd

# List USB devices
usbipd list

# Attach ESP32 to WSL
usbipd attach --wsl --busid 1-4
```

## Requesting Hardware

### How to Request

1. Submit IT ticket with:
   - Hardware type needed
   - Project/justification
   - Duration of loan
   - Shipping address (if remote)

2. Approval from:
   - Team lead (standard equipment)
   - Engineering lead (expensive items)

### Turnaround Time

| Request Type | Turnaround |
|--------------|------------|
| Check out from lab | Same day |
| Ship to remote | 2-3 business days |
| Purchase new equipment | 1-2 weeks |

### Returning Equipment

- Clean and test before return
- Include all cables and accessories
- Note any issues on return form
- Ship back via prepaid label (provided)

## Purchasing Guidelines

### Pre-Approved Items

These can be expensed directly:

- USB cables and adapters (<$30)
- ESP32 dev boards (<$20)
- Common sensors and components (<$50)

### Requires Approval

Submit purchase request for:

- N100 mini PCs
- Oscilloscopes and test equipment
- 3D printing filament (bulk)
- Anything over $100

## Related Resources

- [hardwareOS Development](/projects/hardware-os/development/)
- [Presence Engine Development](/projects/presence-engine/development/)
- [Infrastructure Overview](/it/infrastructure/)
- [Development Setup](/development/setup/)
