---
title: New Employee Onboarding
description: Welcome to OpticWorks! Your complete guide to getting started.
---

## Welcome to OpticWorks!

Congratulations on joining the team! OpticWorks is building the future of presence sensing with mmWave radar technology. We're a small team working on hardware, firmware, open source, and e-commerce - and we're excited to have you on board.

This guide will walk you through everything you need to get productive in your first few weeks.

## Your First Day

### 1. Account Setup

You should have received invites to:

| Service | Check Your Email For | Action |
|---------|---------------------|--------|
| **Google Workspace** | Welcome email | Set up @optic.works email |
| **Slack** | Workspace invite | Join and introduce yourself in #general |
| **GitHub** | Organization invite | Accept and enable 2FA |
| **Infisical** | Account invite | Create account, enable 2FA |
| **1Password** | Vault invite | Create account, enable 2FA |

:::caution[Enable 2FA Everywhere]
Two-factor authentication is **required** for all OpticWorks accounts. We recommend using 1Password's built-in authenticator.
:::

### 2. Essential Slack Channels

Join these channels on your first day:

| Channel | Purpose |
|---------|---------|
| `#general` | Company-wide announcements |
| `#engineering` | Technical discussions |
| `#random` | Non-work chat and fun |
| `#standup` | Daily async standups |
| Your team channel | Team-specific discussions |

### 3. Meet Your Manager

Your manager will schedule a 1:1 to:
- Welcome you and answer questions
- Set initial goals and expectations
- Assign your onboarding buddy
- Plan your first week's meetings

## First Week Checklist

### Day 1-2: Setup

- [ ] Complete all account setups (above)
- [ ] Read this entire onboarding guide
- [ ] Review [Company Culture](/handbook/culture/)
- [ ] Set up your [development environment](/development/setup/)
- [ ] Clone the repositories for your team

### Day 3-4: Learn

- [ ] Read documentation for your team's projects
- [ ] Shadow team members in meetings
- [ ] Review recent PRs and issues
- [ ] Set up [Infisical CLI](/it/infisical/) for secret access

### Day 5: Contribute

- [ ] Pick up a "good first issue" from your team's backlog
- [ ] Submit your first PR (documentation update is fine!)
- [ ] Schedule 1:1s with key teammates

## Understanding OpticWorks

### What We Do

OpticWorks develops mmWave radar-based presence sensing technology:

1. **RS-1 Hardware Device** - Our flagship sensor fusion device combining radar and vision
2. **Open Source Presence Engine** - ESP32-based presence detection for Home Assistant
3. **OpticWorks Store** - E-commerce at optic.works selling our sensors

### Our Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Hardware** | RV1106 SoC, ESP32, mmWave radar (LD2410/LD2450) |
| **Firmware** | C, Go, ESPHome, RTOS |
| **Backend** | Node.js, Medusa, PostgreSQL, Redis |
| **Frontend** | Next.js 15, React, TypeScript, Tailwind |
| **Infrastructure** | Hetzner, Cloudflare Workers/R2, GitHub Actions |
| **Secrets** | Infisical |

### Team Structure

| Team | Focus Areas | Slack Channel |
|------|-------------|---------------|
| **Hardware** | RS-1, firmware, sensor fusion | #hardware-engineering |
| **Web** | Store, customer experience | #web-engineering |
| **Open Source** | Presence Engine, community | #open-source |
| **Platform** | Infrastructure, CI/CD, DevOps | #platform |

## Key Resources

### Documentation

| Resource | What You'll Find |
|----------|------------------|
| [Projects Overview](/projects/) | All engineering projects |
| [Infrastructure](/it/infrastructure/) | Hetzner, Cloudflare, architecture |
| [Infisical Guide](/it/infisical/) | Secret management |
| [Development Hardware](/it/hardware/) | N100 nodes, RS-1 kits, ESP32 |
| [Code Standards](/development/standards/) | Coding conventions |
| [Git Workflow](/development/git-workflow/) | Branching and PR process |

### Tools You'll Use Daily

| Tool | Purpose | Setup |
|------|---------|-------|
| **Slack** | Communication | [slack.com/downloads](https://slack.com/downloads) |
| **VS Code** | Code editor | [code.visualstudio.com](https://code.visualstudio.com) |
| **GitHub** | Code & issues | github.com/r-mccarty |
| **Infisical** | Secrets | `brew install infisical` |
| **Docker** | Local services | [docker.com](https://docker.com) |

### External Services

| Service | Purpose | Access |
|---------|---------|--------|
| **Stripe** | Payments | Request from Finance |
| **EasyPost** | Shipping | Request from Web team |
| **Hetzner** | Servers | Request from Platform team |
| **Cloudflare** | CDN/Edge | Request from Platform team |

## Team-Specific Onboarding

### Hardware Team

After completing general onboarding:

1. Request RS-1 dev kit from hardware lab
2. Read [hardwareOS documentation](/projects/hardware-os/)
3. Set up cross-compiler toolchain
4. Run your first firmware build
5. Shadow a firmware debugging session

**First project ideas:**
- Add a small feature to the fusion algorithm
- Improve documentation for a component
- Write unit tests for existing code

### Web Team

After completing general onboarding:

1. Read [OpticWorks Store documentation](/projects/store/)
2. Set up local Medusa backend
3. Run the storefront locally
4. Create a Stripe test account
5. Process a test order end-to-end

**First project ideas:**
- Fix a UI bug on the storefront
- Improve checkout validation
- Add a new admin dashboard feature

### Open Source Team

After completing general onboarding:

1. Build an ESP32 + LD2410 test device
2. Read [Presence Engine documentation](/projects/presence-engine/)
3. Set up Home Assistant test instance
4. Flash and test the presence sensor
5. Review community issues and PRs

**First project ideas:**
- Respond to community questions
- Fix a reported bug
- Improve calibration documentation

### Platform Team

After completing general onboarding:

1. Get SSH access to staging servers
2. Read [Infrastructure documentation](/it/infrastructure/)
3. Review GitHub Actions workflows
4. Set up Grafana access
5. Shadow an on-call shift

**First project ideas:**
- Improve a deployment script
- Add monitoring for a new metric
- Document a runbook

## Development Environment

### Quick Setup

```bash
# 1. Install Homebrew (macOS) or apt packages (Linux)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 2. Install core tools
brew install git node docker infisical/get-cli/infisical

# 3. Configure git
git config --global user.name "Your Name"
git config --global user.email "you@optic.works"

# 4. Clone repositories
mkdir -p ~/workspace/opticworks && cd ~/workspace/opticworks
git clone git@github.com:r-mccarty/opticworks-store.git
git clone git@github.com:r-mccarty/hardwareOS.git
git clone git@github.com:r-mccarty/presence-dectection-engine.git

# 5. Login to Infisical
infisical login
```

For detailed setup: [Development Setup Guide](/development/setup/)

## Your First 30 Days

### Week 1: Orientation

- Complete account and environment setup
- Read all documentation for your team's projects
- Attend team meetings and standup
- Meet with manager and teammates
- Submit first PR (even if small)

### Week 2: Integration

- Take on your first "good first issue"
- Participate in code reviews
- Ask questions in Slack (no question is too basic!)
- Start building context on codebase

### Week 3: Contribution

- Work on larger tasks
- Pair program with teammates
- Contribute to documentation
- Share feedback on onboarding experience

### Week 4: Ownership

- Complete first significant feature/fix
- Present work in team demo
- Have 30-day check-in with manager
- Set goals for next quarter

## Getting Help

### Who to Ask

| Question Type | Who to Ask |
|---------------|------------|
| HR/Benefits | hr@optic.works |
| IT/Access issues | #it-support or IT ticket |
| Code questions | Your team channel or buddy |
| Architecture decisions | Team lead |
| Product questions | Product team |

### Support Resources

- **IT Tickets:** [Submit an IT ticket](/it/support/)
- **Slack:** Ask in relevant channel
- **1:1s:** Schedule time with teammates
- **Pair Programming:** Request via Slack

## Feedback

Your fresh perspective is valuable! Let us know:

- What's confusing in the documentation?
- What tools could work better?
- What would have helped during onboarding?

Share feedback in #general or directly with your manager.

---

Welcome to the team! We're glad you're here. 🎉
