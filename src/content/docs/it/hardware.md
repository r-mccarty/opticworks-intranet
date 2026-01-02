---
title: Development Hardware
description: Verified hardware access notes from OpticWorks repos.
---

## Workspace Hardware Access

Coder workspaces run on the N100 host with USB passthrough enabled. Available tools include `adb`, `lsusb`, and serial utilities (`picocom`, `minicom`).

```bash
lsusb
picocom -b 115200 /dev/ttyUSB0
adb devices
```

See `agent-harness/AGENTS.md` and `agent-harness/docs/coder-workspace.md` for hardware tooling details.

## Luckfox Pico Max

The Luckfox device is reachable from workspaces and the N100 host.

```bash
ssh root@172.32.0.93
# or
adb shell
```

## Presence Engine Hardware (ESP32 + LD2410)

The presence-detection-engine repo documents the current wiring and calibration reference configuration. Hardware setup is captured in `presence-detection-engine/docs/HARDWARE_SETUP.md`, including:

- ESP32 (M5Stack Basic reference)
- LD2410 mmWave radar
- UART wiring (GPIO16/17, 256000 baud)
- Home Assistant integration details

## Sources

- `agent-harness/AGENTS.md`
- `agent-harness/docs/coder-workspace.md`
- `presence-detection-engine/docs/HARDWARE_SETUP.md`
