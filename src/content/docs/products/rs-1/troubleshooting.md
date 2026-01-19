---
title: RS-1 Troubleshooting
description: Logging, diagnostics, and degraded mode behavior for RS-1.
---

## Logging and Diagnostics (Verified)

From `rs-1/docs/firmware/HARDWAREOS_MODULE_LOGGING.md`:

- Log levels: Error, Warning, Info, Debug, Verbose.
- Serial logging is always enabled; flash logging is optional.
- Diagnostics include free heap, uptime, Wi-Fi RSSI, radar frame counts, and watchdog resets.

## Degraded Modes (Verified)

From `rs-1/docs/firmware/DEGRADED_MODES.md`:

| Failure | Core Detection | Home Assistant | Cloud Features |
|---------|----------------|----------------|----------------|
| Wi-Fi down | Yes | No | No |
| MQTT down | Yes | Yes (local) | No |
| HA disconnected | Yes | No | Yes |
| Radar disconnected | No | Stale | Yes |

## Recovery Notes (Verified)

- Wi-Fi and MQTT reconnect automatically with backoff.
- Telemetry queues locally during outages and flushes on reconnect.

## Sources

- `rs-1/docs/firmware/HARDWAREOS_MODULE_LOGGING.md`
- `rs-1/docs/firmware/DEGRADED_MODES.md`
