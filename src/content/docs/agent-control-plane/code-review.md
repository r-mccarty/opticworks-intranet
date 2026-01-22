---
title: Automated Code Review
description: AI-powered code review with hammer (Claude), anvil (Codex), and forge (synthesis).
---

Git push to any configured repository triggers automated review by three dedicated sprite agents working in sequence.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│  Git Push → GitHub Action                                           │
│       ↓                                                             │
│  ┌─────────┐     ┌─────────┐                                        │
│  │ hammer  │     │  anvil  │    (parallel review)                   │
│  │ (Claude)│     │ (Codex) │                                        │
│  └────┬────┘     └────┬────┘                                        │
│       ↓               ↓                                             │
│       └───────┬───────┘                                             │
│               ↓                                                     │
│         ┌─────────┐                                                 │
│         │  forge  │    (synthesis)                                  │
│         │ (Claude)│                                                 │
│         └────┬────┘                                                 │
│              ↓                                                      │
│    Prioritized RFD + GitHub Issues                                  │
└─────────────────────────────────────────────────────────────────────┘
```

## Review Agents

| Component | Sprite | AI Backend | Purpose |
|-----------|--------|------------|---------|
| **hammer** | `hammer` | Claude Code | Architectural review, documentation |
| **anvil** | `anvil` | Codex | Code correctness, edge cases |
| **forge** | `forge` | Claude Code | Synthesis and prioritization |

:::caution[Reserved Sprites]
**Do not use `hammer`, `anvil`, or `forge` for general tasks** — they're dedicated to automated code review workflows. Use `mallet` for ad-hoc work.
:::

## Review Flow

1. **Push triggers GitHub Action** — On `main`, `dev`, or `feature/**` branches
2. **Parallel review** — hammer (Claude) and anvil (Codex) analyze the diff independently
3. **RFDs written** — Each writes a Request for Discussion to `docs/rfd/`
4. **Forge triggers** — After both complete, forge synthesizes findings
5. **Prioritized output** — Synthesis RFD with scored findings, optionally creates GitHub issues

## Deployed Repos

| Repo | hammer | anvil | forge |
|------|--------|-------|-------|
| rs-1 | ✓ | ✓ | ✓ |
| hardwareOS | ✓ | ✓ | ✓ |
| opticworks-store | ✓ | ✓ | ✓ |
| esphome-presence-engine | ✓ | ✓ | ✓ |
| rv1106-system | ✓ | ✓ | ✓ |
| n8n-marketing-automation | ✓ | ✓ | ✓ |

## RFD Output

Reviews generate three RFD documents per commit:

```
docs/rfd/
  ├── RFD-2025-01-22-abc123-hammer-review.md   (Claude)
  ├── RFD-2025-01-22-abc123-anvil-review.md    (Codex)
  └── RFD-2025-01-22-abc123-synthesis.md       (Forge)
```

## Forge Synthesis

Forge combines hammer and anvil findings into a prioritized, actionable summary.

### Multi-Factor Scoring

Each finding is scored using weighted factors:

| Factor | Weight | Description |
|--------|--------|-------------|
| **Severity** | 40% | Critical=1.0, High=0.8, Medium=0.5, Low=0.2, Info=0.1 |
| **Consensus** | 25% | Both reviewers agree=1.0, single reviewer=0.5 |
| **Critical Path** | 20% | Changes to critical files=1.0, other=0.3 |
| **Recurrence** | 15% | Same issue in multiple repos=0.5-1.0 |

### Thresholds

| Score | Action |
|-------|--------|
| >= 0.8 | Auto-create GitHub issue |
| >= 0.6 | Actionable finding (included in synthesis) |
| < 0.6 | Deferred (archived for reference) |

### Cross-Repo Pattern Detection

Forge scans RFDs across all app repos to detect:
- Same issue appearing in multiple repositories
- Recurring issues within a single repo over time
- Systemic patterns (e.g., "auth issues across 3 repos")

### Synthesis Structure

```markdown
## Executive Summary
Brief overview of changes and findings

## Actionable Findings (score >= 0.6)
Prioritized list with scores and recommended actions

## Deferred Findings (score < 0.6)
Lower-priority items for future consideration

## Cross-Repo Pattern Analysis
Patterns detected across multiple repositories

## Recommended Actions
Specific next steps ordered by priority
```

## Configuration

### Per-Repo Prompt Config

Each repo can customize review behavior via `scripts/hammer/prompt_config.json`:

```json
{
  "docs_candidates": ["README.md", "docs/overview.md"],
  "context_files": ["docs/architecture.md"],
  "prompt_append": "Focus on boot-time regressions.",
  "recent_commits": 30
}
```

| Field | Description |
|-------|-------------|
| `docs_candidates` | Files searched for docs excerpt |
| `context_files` | Additional context files |
| `prompt_append` | Notes appended to prompt |
| `recent_commits` | Commits to include (default: 20) |
| `recent_rfds` | Recent RFD filenames to include (default: 5) |

### Forge Config

Forge configuration: `agent-harness/scripts/forge/synthesis_config.json`

```json
{
  "app_repos": ["hardwareOS", "opticworks-store", ...],
  "critical_paths": {
    "hardwareOS": ["cmd/", "internal/auth/"],
    "rs-1": ["src/", "platformio.ini"]
  },
  "thresholds": {
    "actionable": 0.6,
    "create_issue": 0.8
  }
}
```

## Skipping Reviews

Add skip tokens to your commit message:

| Token | Skips |
|-------|-------|
| `[skip-hammer]` | Claude Code review |
| `[skip-anvil]` | Codex review |
| `[skip-forge]` | Synthesis |

```bash
git commit -m "chore: update deps [skip-hammer] [skip-anvil] [skip-forge]"
```

## Testing

### Trigger Manually

```bash
# Hammer (Claude)
gh workflow run hammer-review.yml -R r-mccarty/rs-1

# Anvil (Codex)
gh workflow run anvil-review.yml -R r-mccarty/rs-1

# Forge (synthesis)
gh workflow run forge-synthesis.yml -R r-mccarty/rs-1
```

### Check Status

```bash
gh run list -R r-mccarty/rs-1 --workflow hammer-review.yml --limit 5
gh run list -R r-mccarty/rs-1 --workflow anvil-review.yml --limit 5
gh run list -R r-mccarty/rs-1 --workflow forge-synthesis.yml --limit 5
```

## Troubleshooting

### Reviews Not Triggering

1. Verify GitHub Action is enabled for the repository
2. Check Action logs: `gh run view <id> --log`
3. Verify sprite is running: `sprite status -s hammer`

### No RFD Generated

1. Check workflow logs: `gh run view <id> --log`
2. Verify sprite is running: `sprite status -s <sprite>`
3. Check sprite logs: `sprite console -s <sprite>`

### Forge Synthesis Not Running

1. Verify both hammer and anvil RFDs exist for the commit
2. Check forge workflow was triggered: `gh run list --workflow forge-synthesis.yml`
3. Verify Claude credentials on forge sprite

### Codex Sandbox Error

**Symptom:** `error running landlock: Sandbox(LandlockRestrict)`

**Fix:** Sprites already have external sandboxing. Re-provision to set correct config:

```bash
./scripts/create-sprite.py --existing anvil
```

---

**Source:** `agent-harness/docs/code-review.md`, `agent-harness/scripts/forge/synthesis_config.json`
