---
title: hardwareOS Deployment
description: Building, flashing, and deploying hardwareOS to RS-1 devices
---

This guide covers the complete deployment workflow for hardwareOS, from building firmware images to over-the-air updates.

## Deployment Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Deployment Pipeline                          │
│                                                                 │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────────┐ │
│  │  Build  │───▶│  Test   │───▶│  Sign   │───▶│   Deploy    │ │
│  └─────────┘    └─────────┘    └─────────┘    └─────────────┘ │
│       │              │              │               │          │
│       ▼              ▼              ▼               ▼          │
│   firmware.bin   Test Suite   signed.bin    OTA / Flash       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Build Types

| Build Type | Purpose | Signing | Target |
|------------|---------|---------|--------|
| `debug` | Development | None | Dev devices |
| `staging` | QA testing | Staging key | Test devices |
| `production` | Customer release | Production key | All devices |

## Building Firmware

### Prerequisites

Ensure you have completed the [Development Setup](/projects/hardware-os/development/).

### Build Commands

```bash
# Debug build
./tools/build.sh --type debug

# Staging build
./tools/build.sh --type staging

# Production build (requires signing key)
./tools/build.sh --type production --sign
```

### Build Output

```
dist/
├── firmware-debug-v1.2.3.bin      # Debug firmware
├── firmware-staging-v1.2.3.bin    # Staging firmware
├── firmware-v1.2.3.bin            # Production firmware
├── manifest.json                   # Update manifest
└── checksums.sha256               # File checksums
```

## Flashing Devices

### Initial Flash (New Devices)

For devices without existing firmware:

```bash
# Connect RS-1 via USB (hold BOOT button while powering on)
./tools/flash.sh --initial dist/firmware-v1.2.3.bin

# Verify successful flash
./tools/verify.sh --device /dev/ttyUSB0
```

### Recovery Flash

If a device is bricked:

```bash
# Enter recovery mode (hold BOOT + RESET)
./tools/flash.sh --recovery dist/firmware-v1.2.3.bin
```

## Over-the-Air Updates

### OTA Architecture

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Device    │         │  CDN/R2     │         │  Update     │
│   Fleet     │◀───────▶│  Storage    │◀───────▶│  Service    │
└─────────────┘         └─────────────┘         └─────────────┘
       │                                               │
       │           Check for updates                   │
       │──────────────────────────────────────────────▶│
       │                                               │
       │           Update manifest                     │
       │◀──────────────────────────────────────────────│
       │                                               │
       │           Download firmware                   │
       │◀─────────────────────┤                        │
       │                                               │
       │           Report status                       │
       │──────────────────────────────────────────────▶│
```

### Publishing an Update

```bash
# Upload to staging
./tools/publish.sh --env staging dist/firmware-staging-v1.2.3.bin

# Verify staging deployment
./tools/rollout.sh --env staging --check

# Promote to production (phased rollout)
./tools/publish.sh --env production \
  --firmware dist/firmware-v1.2.3.bin \
  --rollout 10%  # Start with 10% of devices
```

### Rollout Management

```bash
# Check rollout status
./tools/rollout.sh --status

# Increase rollout percentage
./tools/rollout.sh --increase 25%  # Now at 25%

# Complete rollout
./tools/rollout.sh --complete

# Emergency rollback
./tools/rollout.sh --rollback
```

## Update Manifest

The update manifest describes available firmware versions:

```json
{
  "version": "1.2.3",
  "channel": "stable",
  "firmware": {
    "url": "https://files.optic.works/firmware/v1.2.3/firmware.bin",
    "sha256": "abc123...",
    "size": 12345678
  },
  "signature": "ed25519:...",
  "releaseNotes": "Bug fixes and performance improvements",
  "minVersion": "1.0.0",
  "rolloutPercentage": 100
}
```

## Signing Process

### Key Management

| Key Type | Usage | Storage |
|----------|-------|---------|
| Development | Debug builds | Local `.keys/` directory |
| Staging | QA builds | GitHub Secrets |
| Production | Customer builds | Hardware Security Module (HSM) |

### Signing a Build

```bash
# Debug (local key)
./tools/sign.sh --key dev dist/firmware-debug.bin

# Production (requires HSM access)
./tools/sign.sh --key production --hsm dist/firmware.bin
```

### Verifying Signatures

```bash
# Verify firmware signature
./tools/verify-sig.sh dist/firmware-v1.2.3.bin

# Output:
# Signature: VALID
# Signed by: production-key-2024
# Timestamp: 2024-01-15T10:30:00Z
```

## Environment Configuration

### Staging Environment

```
Update Server: https://updates-staging.optic.works
CDN: https://files-staging.optic.works
```

### Production Environment

```
Update Server: https://updates.optic.works
CDN: https://files.optic.works
```

## Deployment Checklist

### Pre-Release

- [ ] All tests passing in CI
- [ ] Code review approved
- [ ] Version number updated in `VERSION`
- [ ] Release notes prepared
- [ ] QA sign-off on staging

### Release

- [ ] Build production firmware
- [ ] Sign with production key
- [ ] Upload to CDN
- [ ] Publish update manifest
- [ ] Start phased rollout (10%)

### Post-Release

- [ ] Monitor error rates
- [ ] Check device telemetry
- [ ] Verify update success rate >99%
- [ ] Complete rollout to 100%

## Monitoring Deployments

### Device Telemetry

Monitor device health during rollout:

```bash
# View real-time device status
./tools/monitor.sh --env production

# Check specific device
./tools/device-status.sh --id DEVICE123
```

### Metrics to Watch

| Metric | Threshold | Action if Exceeded |
|--------|-----------|-------------------|
| Update failure rate | >2% | Pause rollout |
| Device crash rate | >0.5% | Rollback immediately |
| CPU usage | >80% | Investigate |
| Memory usage | >90% | Investigate |

### Rollback Procedure

If issues are detected:

```bash
# Immediate rollback
./tools/rollout.sh --rollback

# Devices will revert to previous version
# Check status
./tools/rollout.sh --status
```

## CI/CD Pipeline

GitHub Actions handles automated builds:

```yaml
# .github/workflows/build.yml
name: Build Firmware

on:
  push:
    branches: [main]
  release:
    types: [published]

jobs:
  build:
    runs-on: ubuntu-22.04
    steps:
      - uses: actions/checkout@v4
      - name: Build
        run: ./tools/build.sh --type staging
      - name: Test
        run: ./tools/test.sh
      - name: Sign
        run: ./tools/sign.sh --key staging
        env:
          SIGNING_KEY: ${{ secrets.STAGING_SIGNING_KEY }}
      - name: Upload
        run: ./tools/publish.sh --env staging
```

## Troubleshooting

### Device Not Updating

1. Check device connectivity:
   ```bash
   ./tools/device-status.sh --id DEVICE123
   ```

2. Force update check:
   ```bash
   ssh root@device-ip '/opt/hardwareos/bin/update-check --force'
   ```

3. Review device logs:
   ```bash
   ssh root@device-ip 'journalctl -u hardwareos-updater'
   ```

### Update Stuck

```bash
# Reset update state
ssh root@device-ip '/opt/hardwareos/bin/update-reset'

# Retry update
ssh root@device-ip '/opt/hardwareos/bin/update-check'
```

## Resources

- **Runbook**: `docs/runbooks/deployment.md`
- **Incident Response**: `docs/runbooks/incident-response.md`
- **On-Call Schedule**: Check PagerDuty
