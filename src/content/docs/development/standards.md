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

### hardwareOS

From `hardwareOS/docs/platform/DEVELOPMENT.md`:

- **Go**: follow standard Go conventions.
- **TypeScript**: use TypeScript for type safety.
- **React**: keep components small and reusable.
- **Localization**: ensure user-facing strings are localized where required by the platform docs.

## Logging Guidance (Verified)

`hardwareOS/docs/platform/LOGGING_AND_METRICS.md` explicitly warns against committing raw `print` or `log` statements and directs developers to use the logging package instead.

## Sources

- `presence-detection-engine/CONTRIBUTING.md`
- `hardwareOS/docs/platform/DEVELOPMENT.md`
- `hardwareOS/docs/platform/LOGGING_AND_METRICS.md`
