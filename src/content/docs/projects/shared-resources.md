---
title: Shared Resources & Workflows
description: Common tools, libraries, and workflows shared across OpticWorks projects
---

This document covers the shared resources, common workflows, and cross-project standards used across all OpticWorks engineering projects.

## Shared Infrastructure

### GitHub Organization

All repositories are hosted under the [r-mccarty](https://github.com/r-mccarty) GitHub account:

| Repository | Description | Primary Language |
|------------|-------------|------------------|
| [hardwareOS](https://github.com/r-mccarty/hardwareOS) | RS-1 embedded OS | C, Go, TypeScript |
| [presence-dectection-engine](https://github.com/r-mccarty/presence-dectection-engine) | ESP32 presence sensing | C++, Python |
| [opticworks-store](https://github.com/r-mccarty/opticworks-store) | E-commerce platform | TypeScript |
| [opticworks-intranet](https://github.com/r-mccarty/opticworks-intranet) | This intranet site | TypeScript |

### Cloud Services

| Service | Provider | Purpose | Projects |
|---------|----------|---------|----------|
| Cloudflare Workers | Cloudflare | Edge compute | Store |
| Cloudflare R2 | Cloudflare | Object storage | All |
| Cloudflare Access | Cloudflare | Zero-trust auth | Intranet |
| Hetzner Cloud | Hetzner | VPS hosting | Store backend |
| GitHub Actions | GitHub | CI/CD | All |

### Common Third-Party Services

| Service | Purpose | Projects |
|---------|---------|----------|
| Stripe | Payments | Store |
| EasyPost | Shipping | Store |
| Resend | Email | Store |
| Hookdeck | Webhooks | Store |
| PagerDuty | Alerting | All production |

## Development Standards

### Git Workflow

All projects follow the same branching strategy:

```
main (production)
  │
  ├── develop (staging)
  │     │
  │     ├── feature/new-feature
  │     ├── fix/bug-description
  │     └── chore/cleanup-task
  │
  └── hotfix/critical-fix (emergency only)
```

**Branch Naming:**
- `feature/` - New features
- `fix/` - Bug fixes
- `chore/` - Maintenance tasks
- `docs/` - Documentation updates
- `hotfix/` - Emergency production fixes

### Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting
- `refactor` - Code restructuring
- `test` - Tests
- `chore` - Build/tooling

**Examples:**
```
feat(fusion): add Kalman filter velocity estimation
fix(cart): resolve race condition in quantity update
docs(readme): update installation instructions
```

### Pull Request Process

1. **Create PR** from feature branch to `develop`
2. **Fill template** with description, testing steps, screenshots
3. **Request review** from appropriate team member
4. **Address feedback** and update code
5. **Squash merge** after approval
6. **Delete branch** after merge

**PR Template:**
```markdown
## Summary
Brief description of changes

## Type of Change
- [ ] Feature
- [ ] Bug fix
- [ ] Documentation
- [ ] Refactoring

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] E2E tests pass

## Screenshots
(if applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-reviewed code
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

### Code Review Guidelines

**Reviewers should check:**
- [ ] Code correctness and logic
- [ ] Test coverage
- [ ] Performance implications
- [ ] Security considerations
- [ ] Documentation
- [ ] Style consistency

**Authors should:**
- Keep PRs small (<400 lines)
- Respond to feedback within 24 hours
- Don't merge your own PRs (unless trivial)

## Shared Libraries

### @opticworks/math

Common mathematical utilities:

```typescript
import { KalmanFilter, HungarianAlgorithm } from '@opticworks/math';

// Kalman filtering
const kf = new KalmanFilter({ processNoise: 0.1 });
kf.predict(dt);
kf.update(measurement);

// Hungarian algorithm
const assignment = HungarianAlgorithm.solve(costMatrix);
```

**Used by:** hardwareOS, presence-detection-engine

### @opticworks/config

Configuration management:

```typescript
import { loadConfig, getEnvVar } from '@opticworks/config';

const config = loadConfig({
  apiUrl: getEnvVar('API_URL', 'http://localhost:3000'),
  debug: getEnvVar('DEBUG', 'false') === 'true',
});
```

**Used by:** All projects

## CI/CD Patterns

### Standard GitHub Actions

**Lint and Test:**
```yaml
name: CI

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm run test
```

**Deploy on Tag:**
```yaml
name: Deploy

on:
  push:
    tags: ['v*']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run build
      - run: npm run deploy
        env:
          DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
```

### Secrets Management

| Secret | Projects | Purpose |
|--------|----------|---------|
| `CLOUDFLARE_API_TOKEN` | All | Cloudflare deployments |
| `STRIPE_SECRET_KEY` | Store | Payment processing |
| `EASYPOST_API_KEY` | Store | Shipping |
| `SIGNING_KEY` | hardwareOS | Firmware signing |

## Testing Standards

### Test Coverage Requirements

| Project | Unit Tests | Integration | E2E |
|---------|------------|-------------|-----|
| hardwareOS | 80% | Required | Optional |
| presence-engine | 70% | Required | Optional |
| opticworks-store | 70% | Required | Required |

### Test Naming

```typescript
describe('ComponentName', () => {
  describe('methodName', () => {
    it('should do expected behavior when condition', () => {
      // test
    });

    it('should throw error when invalid input', () => {
      // test
    });
  });
});
```

## Documentation Standards

### Code Documentation

**TypeScript/JavaScript:**
```typescript
/**
 * Calculate the optimal assignment between tracks and detections.
 *
 * @param costMatrix - NxM matrix of assignment costs
 * @returns Array of [trackIndex, detectionIndex] pairs
 * @throws {Error} If cost matrix is empty
 */
function hungarianSolve(costMatrix: number[][]): [number, number][] {
  // implementation
}
```

**C:**
```c
/**
 * @brief Update the Kalman filter with a new measurement.
 *
 * @param kf Pointer to the Kalman filter state
 * @param measurement The new measurement value
 * @return 0 on success, -1 on error
 */
int kalman_update(kalman_filter_t *kf, float measurement);
```

### README Requirements

Every repository should have:
- Project description
- Installation instructions
- Quick start guide
- Contributing guidelines
- License information

## Cross-Project Communication

### Slack Channels

| Channel | Purpose | Members |
|---------|---------|---------|
| `#engineering` | General engineering | All engineers |
| `#hardware-engineering` | hardwareOS, firmware | Hardware team |
| `#web-engineering` | Store, frontend | Web team |
| `#open-source` | Presence engine, community | OSS team |
| `#platform` | Infrastructure, CI/CD | Platform team |
| `#incidents` | Production issues | All on-call |

### Meetings

| Meeting | Frequency | Attendees |
|---------|-----------|-----------|
| Engineering Standup | Daily, 9:30 AM PT | All engineers |
| Sprint Planning | Bi-weekly, Monday | Team leads |
| Architecture Review | Monthly | Senior engineers |
| Demo Day | Bi-weekly, Friday | All company |

### Knowledge Sharing

- **Tech Talks**: Monthly presentations on new tech
- **Code Reviews**: Learning through PR reviews
- **Documentation**: This intranet!
- **Pair Programming**: Encouraged for complex tasks

## Release Process

### Versioning

All projects use [Semantic Versioning](https://semver.org/):

```
MAJOR.MINOR.PATCH

- MAJOR: Breaking changes
- MINOR: New features (backwards compatible)
- PATCH: Bug fixes (backwards compatible)
```

### Release Checklist

1. **Prepare**
   - [ ] All tests passing
   - [ ] CHANGELOG updated
   - [ ] Version bumped
   - [ ] Documentation updated

2. **Release**
   - [ ] Create git tag
   - [ ] Push tag to trigger deployment
   - [ ] Monitor deployment

3. **Verify**
   - [ ] Production health checks pass
   - [ ] Smoke tests complete
   - [ ] No error rate increase

4. **Communicate**
   - [ ] Announce in Slack
   - [ ] Update status page if needed
   - [ ] Notify stakeholders

## Security Practices

### Secrets Handling

- Never commit secrets to git
- Use environment variables
- Rotate secrets regularly
- Use GitHub Secrets for CI/CD

### Dependency Management

- Keep dependencies updated
- Review security advisories
- Use `npm audit` / `cargo audit`
- Pin versions in production

### Code Security

- Input validation on all boundaries
- Parameterized queries (no SQL injection)
- Output encoding (no XSS)
- Authentication on all sensitive endpoints

## Getting Help

### Documentation

1. Check this intranet first
2. Search repository READMEs
3. Check `/docs` folders in repos

### People

1. Ask in relevant Slack channel
2. Reach out to project owner
3. Schedule a pairing session

### Escalation

1. Technical issues → Engineering Lead
2. Access issues → IT Support
3. Security concerns → Security Lead

## Onboarding Checklist

New engineers should:

- [ ] Complete [general onboarding](/getting-started/onboarding/)
- [ ] Set up [development environment](/development/setup/)
- [ ] Clone relevant repositories
- [ ] Join appropriate Slack channels
- [ ] Meet with team lead
- [ ] Complete first PR (documentation or small fix)
- [ ] Shadow an on-call rotation
