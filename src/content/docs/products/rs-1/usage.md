---
title: RS-1 Usage Notes
description: Daily operation and zone tuning workflows.
---

## Daily Operation (Verified)

From `rs-1/docs/PRD_RS1.md` and `rs-1/docs/REQUIREMENTS_RS1.md`:

- RS-1 is designed to be invisible in daily use.
- Automations trigger from per-zone occupancy.
- Presence detection works locally without cloud dependency.

## Zone Tuning (Verified)

From `rs-1/docs/PRD_RS1.md`:

1. Open the zone editor.
2. Watch live target positions.
3. Adjust zone boundaries or sensitivity.
4. Save and apply immediately.

Target adjustment time is designed to be under 30 seconds.

## Local-First Behavior (Verified)

From `rs-1/docs/REQUIREMENTS_RS1.md`:

- Core presence detection works offline.
- Cloud adds OTA, telemetry, and optional config sync.

## Sources

- `rs-1/docs/PRD_RS1.md`
- `rs-1/docs/REQUIREMENTS_RS1.md`
