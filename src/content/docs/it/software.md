---
title: Software & Tools
description: Tools available in OpticWorks workspaces and repo-specific tooling.
---

## Workspace Tooling (Coder)

From `agent-harness/docs/coder-workspace.md`, OpticWorks workspaces include:

- **Languages**: Go 1.23.4, Node.js 22.x, Python 3.x, Rust (latest)
- **AI CLIs**: `claude`, `codex`, `gemini`, `opencode`
- **Dev tools**: `gh`, `git`, `jq`, `curl`, `wget`, `tmux`
- **Hardware tools**: `adb`, `picocom`, `minicom`, `lsusb`

## Repo-Specific Tooling

- **RS-1**: ESP-IDF + Python; `idf.py build`, `idf.py -p /dev/ttyUSB0 flash` (see `rs-1/README.md`).
- **presence-detection-engine**: ESPHome + PlatformIO; `platformio test -e native`, `yamllint esphome/ homeassistant/` (see `presence-detection-engine/README.md`).
- **opticworks-store**: pnpm, Next.js, Medusa; `pnpm run dev`, `pnpm run secrets:pull` (see `opticworks-store/README.md`).
- **n8n-marketing-automation**: Docker Compose + Python shim; `docker compose up -d` on N100 (see `n8n-marketing-automation/README.md`).

## Sources

- `agent-harness/docs/coder-workspace.md`
- `rs-1/README.md`
- `presence-detection-engine/README.md`
- `opticworks-store/README.md`
- `n8n-marketing-automation/README.md`
