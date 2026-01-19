---
title: RS-1 Quick Start (Developer)
description: Developer quick start for RS-1 firmware work.
---

RS-1 firmware is in specification phase. The commands below are the current placeholders from the repo README and will evolve as firmware implementation lands.

## Prerequisites (Verified)

- ESP-IDF 5.x
- Python 3.9+
- USB-C cable (CH340N USB-UART bridge on-board)

## Build + Flash (Early)

From `rs-1/README.md`:

```bash
# Build firmware
idf.py build

# Flash to device
idf.py -p /dev/ttyUSB0 flash
```

## Recommended Reading

- `rs-1/docs/firmware/README.md` for HardwareOS architecture
- `rs-1/docs/contracts/PROTOCOL_MQTT.md` for device-cloud topics
- `rs-1/docs/testing/VALIDATION_PLAN_RS1.md` for validation metrics

## Sources

- `rs-1/README.md`
- `rs-1/docs/firmware/README.md`
- `rs-1/docs/contracts/PROTOCOL_MQTT.md`
- `rs-1/docs/testing/VALIDATION_PLAN_RS1.md`
