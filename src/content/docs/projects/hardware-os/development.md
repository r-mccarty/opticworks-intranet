---
title: hardwareOS Development
description: Build, test, and UI workflows for RS-1.
---

## Build & Deploy (Device)

From `hardwareOS/docs/rs1/DEVELOPMENT.md`:

```bash
./dev_deploy.sh -r <DEVICE_IP>
./dev_deploy.sh -r <DEVICE_IP> --skip-ui-build
./dev_deploy.sh -r <DEVICE_IP> --run-go-tests
```

## Local Builds

```bash
make build_dev
make build_release
make frontend
```

## Tests

```bash
make test
# or
go test ./...
```

UI E2E tests require a device:

```bash
make test_e2e
# or
cd ui && JETKVM_URL=http://<DEVICE_IP> npm run test:e2e
```

## UI Development

```bash
cd ui && npm run dev
cd ui && npm run dev:cloud
```

## Sources

- `hardwareOS/docs/rs1/DEVELOPMENT.md`
- `hardwareOS/README.md`
