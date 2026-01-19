---
title: RS-1 Deployment
description: OTA and cloud deployment flow for RS-1.
---

## OTA Flow (Verified)

From `rs-1/docs/firmware/HARDWAREOS_MODULE_OTA.md` and `rs-1/docs/contracts/PROTOCOL_MQTT.md`:

- OTA is triggered via MQTT on `opticworks/{device_id}/ota/trigger`.
- Firmware is delivered over HTTPS and validated by SHA-256 before reboot.
- Devices report status on `opticworks/{device_id}/ota/status`.

## Cloud Services (Verified)

From `rs-1/docs/cloud/README.md` and `rs-1/docs/cloud/INFRASTRUCTURE.md`:

- Cloudflare Workers handle OTA orchestration, device registry, and zone editor APIs.
- Cloudflare D1 stores device and zone data; R2 stores firmware binaries.
- EMQX provides MQTT transport with TLS.
- Secrets like `EMQX_API_KEY`, `SIGNING_KEY`, and `WEBHOOK_SECRET` are set via `wrangler secret put`.
- Deploys are documented with `wrangler deploy --env staging/production`.

## Manual Recovery (Verified)

From `rs-1/README.md` and `rs-1/docs/firmware/HARDWAREOS_MODULE_OTA.md`:

- Serial flashing over USB is the fallback when OTA is unavailable.

```bash
idf.py -p /dev/ttyUSB0 flash
```

## Sources

- `rs-1/docs/firmware/HARDWAREOS_MODULE_OTA.md`
- `rs-1/docs/contracts/PROTOCOL_MQTT.md`
- `rs-1/docs/cloud/README.md`
- `rs-1/docs/cloud/INFRASTRUCTURE.md`
- `rs-1/README.md`
