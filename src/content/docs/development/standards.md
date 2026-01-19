---
title: Code Standards
description: Repo-verified standards and linting requirements.
---

## Repo-Specific Standards (Verified)

### presence-detection-engine

From `presence-detection-engine/CONTRIBUTING.md`:

- **C++**: follow ESPHome conventions, comment complex logic, update unit tests for algorithm changes.
- **Python**: format with Black, follow PEP 8, add docstrings and type hints.
- **YAML**: 2-space indentation, validate with `yamllint`.

### RS-1

From `rs-1/CLAUDE.md`:

- **Documentation first**: update module specs and contracts before implementation.
- **Firmware style**: follow ESP-IDF coding conventions.
- **Logging**: use ESP-IDF logging macros and HardwareOS logging interfaces.
- **Module prefixes**: use module-specific prefixes (e.g., `radar_`, `track_`, `zone_`).

## Logging Guidance (Verified)

From `rs-1/docs/firmware/HARDWAREOS_MODULE_LOGGING.md`:

- Log levels are standardized (Error, Warning, Info, Debug, Verbose).
- Telemetry is opt-in and uses MQTT with the schema in `docs/contracts/SCHEMA_TELEMETRY.json`.

## Sources

- `presence-detection-engine/CONTRIBUTING.md`
- `rs-1/CLAUDE.md`
- `rs-1/docs/firmware/HARDWAREOS_MODULE_LOGGING.md`
- `rs-1/docs/contracts/SCHEMA_TELEMETRY.json`
