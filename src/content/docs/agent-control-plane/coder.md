---
title: Coder Workspaces (Alternative)
description: Traditional Coder-based development workspaces as an alternative to Sprites.
---

<div class="notice-dormant">
<strong>Alternative Option:</strong> Coder workspaces are available as a fallback for scenarios where Sprites are not suitable. For most development work, <a href="/agent-control-plane/">Sprites are the preferred environment</a>.
</div>

## When to Use Coder

Consider Coder workspaces when:

- Running long-duration processes that exceed sprite timeout limits
- Needing persistent GUI applications (VS Code, etc.)
- Working with legacy toolchains not yet ported to sprites
- Debugging hardware issues requiring direct N100 access

## Access

- **Coder UI**: `https://coder.hardwareos.com`
- **N100 SSH**: `ssh n100`

## Workspace Setup

OpticWorks uses Coder workspaces bootstrapped by the agent-harness repo:

```bash
# Verify workspace access
gh auth status

# Check Infisical secrets
cat ~/.env.secrets | wc -l

# Verify AI tools
claude --version
codex --version

# Test N100 access
ssh n100 "hostname"
```

## Environment

Coder workspaces include:

| Component | Details |
|-----------|---------|
| **Secrets** | Injected from Infisical to `~/.env.secrets` |
| **GitHub** | Pre-authenticated via `gh` CLI |
| **AI CLIs** | Claude and Codex pre-configured |
| **N100 Access** | SSH via Cloudflare tunnel |
| **Docker** | Available for container workloads |

## Comparison: Sprites vs Coder

| Feature | Sprites | Coder |
|---------|---------|-------|
| **Startup** | ~1s | ~30s |
| **Checkpointing** | Native | Manual |
| **Isolation** | Hardware VM | Container |
| **Persistence** | Survives sessions | Persistent |
| **AI Integration** | Purpose-built | Add-on |
| **Cost** | Per-execution | Always-on |

## Troubleshooting

If workspace access fails, refer to:
- `agent-harness/docs/coder-workspace.md`
- `agent-harness/docs/n100-coder-access.md`

---

**Source:** `agent-harness/docs/coder-workspace.md`, `agent-harness/docs/n100-coder-access.md`
