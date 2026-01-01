---
title: Projects Overview
description: Overview of all OpticWorks engineering projects, their purpose, and how they interconnect
---

OpticWorks develops and maintains several interconnected projects that form our complete product ecosystem. This section provides comprehensive documentation for each project, including architecture details, development guides, and operational procedures.

## Project Ecosystem

Our projects work together to deliver end-to-end mmWave presence sensing solutions:

```
┌─────────────────────────────────────────────────────────────────┐
│                     OpticWorks Ecosystem                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐                    │
│  │   hardwareOS    │    │ Presence Engine │                    │
│  │   (RS-1 Device) │    │ (DIY/Hobbyist)  │                    │
│  │                 │    │                 │                    │
│  │  • Sensor Fusion│    │  • ESP32-based  │                    │
│  │  • WebRTC       │    │  • Home Assist. │                    │
│  │  • Kalman Filter│    │  • Statistical  │                    │
│  └────────┬────────┘    └────────┬────────┘                    │
│           │                      │                              │
│           └──────────┬───────────┘                              │
│                      ▼                                          │
│           ┌─────────────────────┐                              │
│           │  OpticWorks Store   │                              │
│           │  (E-commerce)       │                              │
│           │                     │                              │
│           │  • Next.js 15       │                              │
│           │  • Medusa v2        │                              │
│           │  • Stripe/EasyPost  │                              │
│           └─────────────────────┘                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Projects at a Glance

| Project | Purpose | Tech Stack | Team Lead |
|---------|---------|------------|-----------|
| [hardwareOS](/projects/hardware-os/) | Embedded OS for RS-1 sensor device | C, Go, TypeScript | Hardware Team |
| [Presence Detection Engine](/projects/presence-engine/) | DIY presence sensing for Home Assistant | C++, Python, ESPHome | Open Source Team |
| [OpticWorks Store](/projects/store/) | E-commerce platform at optic.works | Next.js, Medusa, PostgreSQL | Web Team |

## Common Goals

All OpticWorks projects share these core objectives:

1. **Privacy-First Design** - All processing happens locally; no cloud dependency for core functionality
2. **Open Source Commitment** - Our projects are open source to foster community collaboration
3. **Real-Time Performance** - Sub-100ms latency for presence detection and state updates
4. **Developer Experience** - Comprehensive documentation, clear APIs, and straightforward setup

## Who Works on What

### Hardware Team
- **Focus**: hardwareOS, firmware, sensor integration
- **Skills**: Embedded C, Go, RTOS, signal processing
- **Slack Channel**: `#hardware-engineering`

### Open Source Team
- **Focus**: Presence Detection Engine, community engagement
- **Skills**: ESPHome, Home Assistant, ESP32, Python
- **Slack Channel**: `#open-source`

### Web Team
- **Focus**: OpticWorks Store, customer-facing applications
- **Skills**: Next.js, React, TypeScript, Medusa
- **Slack Channel**: `#web-engineering`

### Platform Team
- **Focus**: Shared infrastructure, CI/CD, DevOps
- **Skills**: GitHub Actions, Docker, Cloudflare, Hetzner
- **Slack Channel**: `#platform`

## Cross-Project Resources

- [Shared Resources](/projects/shared-resources/) - Common tools, libraries, and workflows
- [Git Workflow](/development/git-workflow/) - Branching strategy and PR process
- [Code Standards](/development/standards/) - Coding conventions across all projects

## Getting Started

New to OpticWorks? Here's how to get oriented:

1. **Read the overviews** - Start with each project's overview page to understand their purpose
2. **Set up your environment** - Follow the [Development Setup](/development/setup/) guide
3. **Join the channels** - Get added to the relevant Slack channels for your team
4. **Clone the repos** - All repositories are at [github.com/r-mccarty](https://github.com/r-mccarty)
5. **Review architecture** - Understand how components interact before diving into code

## Repository Links

| Project | Repository | Status |
|---------|------------|--------|
| hardwareOS | [r-mccarty/hardwareOS](https://github.com/r-mccarty/hardwareOS) | Active Development |
| Presence Detection Engine | [r-mccarty/presence-dectection-engine](https://github.com/r-mccarty/presence-dectection-engine) | Active Development |
| OpticWorks Store | [r-mccarty/opticworks-store](https://github.com/r-mccarty/opticworks-store) | Production |
