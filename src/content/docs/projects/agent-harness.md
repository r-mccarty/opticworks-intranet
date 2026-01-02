---
title: Agent Harness
description: Workspace bootstrap and developer environment reference.
---

The `agent-harness` repo is the source of truth for OpticWorks Coder workspaces. It documents workspace capabilities, secrets injection, and N100 access.

## What It Provides (Verified)

From `agent-harness/AGENTS.md` and `agent-harness/docs/coder-workspace.md`:

- Pre-authenticated AI CLIs (`claude`, `codex`, `gemini`, `opencode`)
- Secrets injected from Infisical into `~/.env.secrets`
- GitHub CLI auth + git push configured
- N100 SSH access via `ssh n100`
- Hardware tooling (`adb`, `picocom`, `lsusb`)

## Where to Look

- `agent-harness/AGENTS.md` for quick workspace orientation
- `agent-harness/docs/coder-workspace.md` for the full bootstrap flow
- `agent-harness/docs/n100-coder-access.md` for N100 + Coder CLI operations

## Sources

- `agent-harness/AGENTS.md`
- `agent-harness/docs/coder-workspace.md`
- `agent-harness/docs/n100-coder-access.md`

## Diagrams

### Workspace Bootstrap

```
Coder Template -> startup script -> agent-harness clone
        |                |                 |
        |                |                 +--> ~/AGENTS.md symlink
        |                +--> ~/.env.secrets from Infisical
        +--> tools install
```

### Secrets Injection

```
Infisical
   |
   +--> ~/.env.secrets (auto-sourced)
           |
           +--> gh auth
           +--> CLAUDE/CODEX credentials
           +--> ssh n100 key
```

### N100 Access Path

```
Coder workspace
    |
    +--> ssh n100
            |
            +--> Docker services (N8N, HA, cloudflared)
            +--> USB / serial devices
```

## Intranet Sync (Source-of-Truth)

The intranet mirrors `agent-harness` docs into `src/content/docs/sources/agent-harness/` for browsing. To refresh the mirror:

```bash
./scripts/sync-agent-harness.sh
```

This copies `agent-harness/AGENTS.md` and `agent-harness/docs/` into the intranet repo. The synced files are listed at `/sources/agent-harness/`.
