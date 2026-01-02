---
title: hardwareOS Deployment
description: Deployment and OTA update flow for RS-1.
---

## Device Deploy (Developer Workflow)

The supported developer deploy path is `./dev_deploy.sh` from `hardwareOS/docs/rs1/DEVELOPMENT.md`:

```bash
./dev_deploy.sh -r <DEVICE_IP>
./dev_deploy.sh -r <DEVICE_IP> --skip-ui-build
```

## OTA Update Flow (Production)

`hardwareOS/docs/platform/OTA_FLOW.md` documents the OTA pipeline implemented in `internal/ota`:

- Update metadata fetched from the release API.
- App and system components downloaded to `/userdata/jetkvm/` paths.
- SHA256 verification before applying updates.
- System updates applied via `rk_ota`.
- Device reboot after successful update.

## Sources

- `hardwareOS/docs/rs1/DEVELOPMENT.md`
- `hardwareOS/docs/platform/OTA_FLOW.md`
