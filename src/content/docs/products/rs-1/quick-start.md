---
title: RS-1 Quick Start (Developer)
description: Developer quick start for RS-1 workflows.
---

This page documents developer-oriented setup steps for RS-1 based on the hardwareOS repo.

## Build + Deploy

From `hardwareOS/docs/rs1/DEVELOPMENT.md`:

```bash
./dev_deploy.sh -r <DEVICE_IP>
./dev_deploy.sh -r <DEVICE_IP> --skip-ui-build
./dev_deploy.sh -r <DEVICE_IP> --run-go-tests
```

## Local Tests

```bash
make test
# or
go test ./...
```

## Sources

- `hardwareOS/docs/rs1/DEVELOPMENT.md`
- `hardwareOS/README.md`
