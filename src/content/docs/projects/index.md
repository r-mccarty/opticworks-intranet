---
title: Projects Overview
description: Canonical overview of OpticWorks repos and their purpose.
---

## Core Repositories

| Repo | Purpose | Primary Stack | Status |
|------|---------|----------------|--------|
| `agent-harness` | Sprite provisioning & orchestration | Python + Infisical | <span class="badge badge-active">Active</span> |
| `rs-1` | RS-1 presence sensor platform | ESP-IDF (C/C++), Cloudflare Workers | <span class="badge badge-active">Active</span> |
| `hardwareOS` | Embedded firmware platform | Go + React | <span class="badge badge-spec-phase">Spec Phase</span> |
| `rv1106-system` | RV1106 Linux system images | Buildroot | <span class="badge badge-spec-phase">Spec Phase</span> |
| `presence-detection-engine` | ESP32 presence engine + HA tooling | C++, Python, YAML | <span class="badge badge-active">Active</span> |
| `opticworks-store` | Storefront + Medusa backend | Next.js, Medusa | <span class="badge badge-active">Active</span> |
| `opticworks-intranet` | Internal docs site | Astro/Starlight | <span class="badge badge-active">Active</span> |
| `n8n-marketing-automation` | Marketing automation | Docker + Python | <span class="badge badge-dormant">Dormant</span> |

## Where to Start

- [Agent Control Plane](/agent-control-plane/) for Sprites and AI orchestration
- [Hardware Platform](/hardware-platform/) for hardwareOS and rv1106-system
- `rs-1/README.md` for RS-1 overview and docs map
- `presence-detection-engine/docs/quickstart.md` for ESP32 + HA setup
- `opticworks-store/docs/reference/README.md` for store architecture

## Sources

- `agent-harness/CLAUDE.md`
- `rs-1/README.md`
- `hardwareOS/README.md`
- `rv1106-system/README.md`
- `presence-detection-engine/README.md`
- `opticworks-store/README.md`
- `n8n-marketing-automation/README.md`

## Meta Diagrams

### Org Repo Map

```
                           OpticWorks
                                |
    +---------------------------+---------------------------+
    |                           |                           |
agent-harness               Hardware                    Applications
 (Sprites)                      |                           |
    |               +-----------+-----------+       +-------+-------+
    |               |           |           |       |               |
    |         hardwareOS    rv1106      rs-1    opticworks    presence-
    |          (Go+React)   (Linux)  (sensor)    store        engine
    |                                               |
    +-----------------------------------------------+
                            |
                     opticworks-intranet
                      (this docs site)
```

### Runtime Surfaces

```
Developer --> Sprite VM --> N100 Host --> Hardware / Services
   |              |              |
   |              |              +--> Docker services
   |              +--> Infisical secrets
   |              +--> GitHub access
   +--> Repo edits+--> ssh n100
```

### Secrets Flow

```
Infisical --> ~/.env.secrets --> Sprite shell
     |            |                 |
     |            +--> gh auth       +--> repo-specific tools
     +--> service tokens             +--> deploy scripts
```
