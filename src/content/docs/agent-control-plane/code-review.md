---
title: Automated Code Review
description: AI-powered code review workflows with hammer (Claude) and anvil (Codex).
---

Git push to any configured repository triggers an automated review by dedicated sprite agents.

## How It Works

```
┌─────────────────────────────────────────────────────────────┐
│  Git Push → GitHub Action → Sprite (hammer/anvil)           │
│                    ↓                                        │
│              Analyze Diff → Generate RFD → Commit Back      │
└─────────────────────────────────────────────────────────────┘
```

### Review Flow

1. **Push triggers GitHub Action** — Configured per-repository
2. **Action sends diff to sprite** — hammer (Claude) or anvil (Codex)
3. **Agent analyzes changes** — Reviews code, identifies issues
4. **RFD written** — Request for Discussion document committed to `docs/rfds/`

## Review Agents

| Sprite | AI Backend | Specialty |
|--------|------------|-----------|
| **hammer** | Claude Code | Architectural review, documentation |
| **anvil** | Codex | Code correctness, edge cases |

Both agents review every push, providing complementary perspectives.

:::caution[Reserved Sprites]
**Do not use `hammer` or `anvil` for general tasks** — they're dedicated to automated code review workflows. Use `mallet` for ad-hoc work.
:::

## Configuring Reviews

Per-repository behavior is controlled via:

```
scripts/hammer/prompt_config.json
```

Configuration options:
- **Repositories** — Which repos trigger reviews
- **Review focus** — What aspects to prioritize
- **RFD template** — Output format for review documents

## RFD Output

Reviews generate Request for Discussion (RFD) documents:

```
docs/rfds/
  ├── 2025-01-15-feature-auth.md
  ├── 2025-01-16-fix-checkout.md
  └── ...
```

Each RFD contains:
- **Summary** of changes
- **Issues identified** (bugs, security, style)
- **Suggestions** for improvement
- **Questions** for the author

## Prompt Builder

The central prompt builder assembles review context:

```bash
python scripts/hammer/build_prompt.py \
  --repo rs-1 \
  --diff changes.diff \
  --output review-prompt.txt
```

## Monitoring Reviews

Check review status:

```bash
# View recent RFDs
ls -la docs/rfds/

# Check sprite activity
sprite exec -s hammer "ps aux | grep claude"
sprite exec -s anvil "ps aux | grep codex"
```

## Troubleshooting

### Reviews Not Triggering

1. Verify GitHub Action is enabled for the repository
2. Check Action logs for errors
3. Verify sprite is running: `sprite status -s hammer`

### RFD Not Committed

1. Check sprite has write access to repository
2. Verify `gh` CLI authentication
3. Review sprite logs for commit errors

---

**Source:** `agent-harness/docs/hammer-review.md`, `scripts/hammer/prompt_config.json`
