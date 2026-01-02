---
title: RS-1 Troubleshooting
description: Logging and diagnostics references for RS-1.
---

## Logging and Diagnostics (Verified)

`hardwareOS/docs/platform/LOGGING_AND_METRICS.md` documents the logging system (zerolog, subsystem loggers) and the live log stream endpoint:

```bash
curl http://<device-ip>/log-stream
```

It also describes how `dev_deploy.sh` configures trace scopes and how to set custom trace subsystems.

## Sources

- `hardwareOS/docs/platform/LOGGING_AND_METRICS.md`
