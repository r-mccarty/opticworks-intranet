---
title: Presence Engine Home Assistant Integration
description: Home Assistant integration notes for the presence engine.
---

## Home Assistant Integration (Verified)

From `presence-detection-engine/README.md` and `docs/DEVELOPMENT_WORKFLOW.md`:

- ESPHome auto-discovery adds the device (API key from `esphome/secrets.yaml`).
- Dashboards and helpers live in `homeassistant/` and should be copied into HA config.
- Home Assistant runs in Docker on ubuntu-node, config in `/opt/homeassistant/config`.

Example helper import:

```bash
scp homeassistant/configuration_helpers.yaml ubuntu-node:/opt/homeassistant/config/
ssh ubuntu-node "sudo docker restart homeassistant"
```

## Sources

- `presence-detection-engine/README.md`
- `presence-detection-engine/docs/DEVELOPMENT_WORKFLOW.md`
- `presence-detection-engine/CONTRIBUTING.md`
