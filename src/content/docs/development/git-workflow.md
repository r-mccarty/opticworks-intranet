---
title: Git Workflow
description: Verified contribution and commit guidance from OpticWorks repos.
---

## Common Contribution Pattern

From `presence-detection-engine/CONTRIBUTING.md` and `rs-1/CLAUDE.md`:

1. Create a feature branch
2. Update specs/docs when behavior changes
3. Make code changes and run tests
4. Commit with clear messages
5. Open a PR

## Commit Style

The presence-detection-engine repo explicitly requires **conventional commit** style with short subjects:

```
<type>: <subject>
```

Examples appear in `presence-detection-engine/README.md` and `docs/DEVELOPMENT_WORKFLOW.md`.

## Testing Before PR

- Presence engine contribution guidance requires `platformio test -e native` and `yamllint`.
- RS-1 test scenarios and validation criteria are defined in `docs/testing/INTEGRATION_TESTS.md` and `docs/testing/VALIDATION_PLAN_RS1.md`.

## Sources

- `presence-detection-engine/README.md`
- `presence-detection-engine/CONTRIBUTING.md`
- `presence-detection-engine/docs/DEVELOPMENT_WORKFLOW.md`
- `rs-1/CLAUDE.md`
- `rs-1/docs/testing/INTEGRATION_TESTS.md`
- `rs-1/docs/testing/VALIDATION_PLAN_RS1.md`
