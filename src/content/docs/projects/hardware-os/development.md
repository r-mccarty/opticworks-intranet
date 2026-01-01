---
title: hardwareOS Development Guide
description: Setting up your development environment and contributing to hardwareOS
---

This guide covers everything you need to start developing for hardwareOS, from environment setup to testing and debugging.

## Prerequisites

Before you begin, ensure you have:

- **Operating System**: Ubuntu 22.04+ or macOS 13+
- **Hardware** (for on-device testing): RS-1 development kit
- **GitHub Access**: Write access to the hardwareOS repository

## Environment Setup

### 1. Install System Dependencies

import { Tabs, TabItem } from '@astrojs/starlight/components';

<Tabs>
<TabItem label="Ubuntu">
```bash
# Install build essentials
sudo apt update
sudo apt install -y build-essential cmake ninja-build

# Install cross-compiler for ARM
sudo apt install -y gcc-arm-linux-gnueabihf

# Install Go 1.21+
wget https://go.dev/dl/go1.21.0.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.21.0.linux-amd64.tar.gz
export PATH=$PATH:/usr/local/go/bin

# Install Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Protocol Buffers
sudo apt install -y protobuf-compiler
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
```
</TabItem>
<TabItem label="macOS">
```bash
# Install Homebrew if needed
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install dependencies
brew install cmake ninja go node protobuf

# Install ARM cross-compiler
brew install arm-linux-gnueabihf-binutils

# Install gRPC tools
go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
```
</TabItem>
</Tabs>

### 2. Clone the Repository

```bash
git clone https://github.com/r-mccarty/hardwareOS.git
cd hardwareOS
```

### 3. Install Project Dependencies

```bash
# Install Go dependencies
go mod download

# Install Node.js dependencies for UI
cd ui
npm install
cd ..

# Initialize submodules
git submodule update --init --recursive
```

### 4. SDK Setup

Download and install the RV1106 SDK:

```bash
# Download SDK (requires VPN access)
wget https://files.optic.works/sdk/rv1106-sdk-v1.0.tar.gz

# Extract to home directory
tar -xzf rv1106-sdk-v1.0.tar.gz -C ~/

# Set environment variable
export RV1106_SDK=~/rv1106-sdk
echo 'export RV1106_SDK=~/rv1106-sdk' >> ~/.bashrc
```

## Building the Project

### Native Build (for development)

```bash
# Build all C components
mkdir build && cd build
cmake .. -DTARGET=native -DCMAKE_BUILD_TYPE=Debug
make -j$(nproc)
```

### Cross-Compile for RV1106

```bash
# Set up cross-compilation environment
source $RV1106_SDK/envsetup.sh

# Build for target
mkdir build-rv1106 && cd build-rv1106
cmake .. -DTARGET=rv1106 -DCMAKE_BUILD_TYPE=Release
make -j$(nproc)
```

### Build Go Services

```bash
# Build for native testing
go build -o bin/hardwareos-server ./cmd/server

# Cross-compile for ARM
GOOS=linux GOARCH=arm GOARM=7 go build -o bin/hardwareos-server-arm ./cmd/server
```

### Build UI

```bash
cd ui
npm run build
```

## Project Structure

```
hardwareOS/
├── cmd/
│   └── server/           # Main entry point for Go server
├── products/
│   └── rs1/
│       ├── fusion/       # Sensor fusion algorithms
│       │   ├── kalman.c  # Kalman filter implementation
│       │   ├── hungarian.c # Data association
│       │   └── transform.c # Coordinate transforms
│       └── radar/
│           └── ld2450.c  # Radar driver
├── targets/
│   └── rv1106/
│       └── native/       # Platform-specific code
├── pkg/
│   ├── grpc/            # gRPC service definitions
│   ├── webrtc/          # WebRTC infrastructure
│   └── config/          # Configuration management
├── ui/                  # React frontend
├── docs/                # Technical documentation
├── tests/               # Test suites
└── tools/               # Build and deployment tools
```

## Development Workflow

### 1. Create a Feature Branch

```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

### 2. Make Changes

Follow our [Code Standards](/development/standards/):
- C code: Use snake_case, 4-space indentation
- Go code: Follow standard Go conventions
- TypeScript: Use ESLint and Prettier configurations

### 3. Run Tests

```bash
# Run C tests
cd build
ctest --output-on-failure

# Run Go tests
go test ./...

# Run UI tests
cd ui
npm test
```

### 4. Commit and Push

```bash
git add .
git commit -m "feat: add new feature description"
git push origin feature/your-feature-name
```

### 5. Create Pull Request

Open a PR on GitHub targeting the `main` branch.

## Testing

### Unit Tests

```bash
# C unit tests (uses Unity framework)
cd build
make test

# Go unit tests
go test ./... -v

# UI unit tests
cd ui && npm test
```

### Integration Tests

```bash
# Run integration test suite
./tests/integration/run_all.sh

# Test with simulated hardware
./tools/simulator/run.sh &
go test ./tests/integration/... -tags=integration
```

### On-Device Testing

```bash
# Deploy to connected RS-1 device
./tools/deploy.sh --device 192.168.1.100

# Run on-device tests
ssh root@192.168.1.100 '/opt/hardwareos/tests/run.sh'
```

## Debugging

### Native Debugging

```bash
# Build with debug symbols
cmake .. -DCMAKE_BUILD_TYPE=Debug
make

# Debug with gdb
gdb ./bin/fusion_test
```

### Remote Debugging on RS-1

```bash
# Start gdbserver on device
ssh root@192.168.1.100 'gdbserver :1234 /opt/hardwareos/bin/fusion'

# Connect from development machine
arm-linux-gnueabihf-gdb ./build-rv1106/bin/fusion
(gdb) target remote 192.168.1.100:1234
```

### Logging

Set log levels via environment variable:

```bash
export HOS_LOG_LEVEL=debug  # Options: trace, debug, info, warn, error
./bin/hardwareos-server
```

## Common Tasks

### Adding a New Sensor Driver

1. Create driver file in `products/rs1/sensors/`
2. Implement the sensor interface:

```c
typedef struct {
    int (*init)(void);
    int (*read)(sensor_data_t *data);
    int (*cleanup)(void);
} sensor_driver_t;
```

3. Register in `products/rs1/sensors/registry.c`
4. Add tests in `tests/unit/sensors/`

### Modifying Fusion Algorithm

1. Update algorithm in `products/rs1/fusion/`
2. Run benchmark suite:

```bash
./tools/benchmark.sh fusion
```

3. Verify latency targets are met (<50ms)

### Adding gRPC Endpoint

1. Update proto definition in `proto/`
2. Regenerate code:

```bash
./tools/generate_proto.sh
```

3. Implement handler in `pkg/grpc/`

## Resources

| Resource | Location |
|----------|----------|
| API Documentation | `docs/api/` |
| Architecture Diagrams | `docs/architecture/` |
| Hardware Schematics | `docs/hardware/` (restricted access) |
| Debugging Guide | `docs/debugging.md` |

## Getting Help

- **Slack**: `#hardware-engineering`
- **GitHub Issues**: For bug reports and feature requests
- **Office Hours**: Wednesdays 2-3pm PT with Hardware Team
