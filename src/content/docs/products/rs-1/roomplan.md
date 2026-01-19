---
title: RS-1 Provisioning & Setup
description: QR setup flow, device AP mode, and provisioning API.
---

RS-1 provisioning is defined in `rs-1/docs/contracts/PROTOCOL_PROVISIONING.md`. The flow covers QR setup, device AP mode, local provisioning APIs, and cloud registration via MQTT.

## Setup Flow (Verified)

1. Scan QR code on the device.
2. Connect to the device AP (`OpticWorks-XXXX`).
3. Open the captive portal at `http://192.168.4.1`.
4. Submit Wi-Fi credentials via the provisioning API.
5. Device connects to Wi-Fi and registers via MQTT.

## QR Code Format (Verified)

```
opticworks://setup?d={mac_suffix}&ap={ap_ssid}
```

- `d` is the MAC suffix (last 6 bytes, hex).
- `ap` is the AP SSID (`OpticWorks-` + last 4 of MAC suffix).

## Device AP Mode (Verified)

- **SSID**: `OpticWorks-{XXXX}`
- **Password**: none (open)
- **IP**: `192.168.4.1`
- **DHCP range**: `192.168.4.100` - `192.168.4.200`

## Provisioning API (Verified)

From `rs-1/docs/contracts/PROTOCOL_PROVISIONING.md`:

- `GET /api/device-info` returns device identity and firmware metadata.
- `POST /api/provision` accepts Wi-Fi credentials.

Example payload:

```json
{
  "ssid": "HomeWifi",
  "password": "secretpassword"
}
```

## MQTT Registration (Verified)

- Device publishes to `opticworks/{device_id}/provision`.
- Cloud responds on `opticworks/{device_id}/provision/response`.

## Sources

- `rs-1/docs/contracts/PROTOCOL_PROVISIONING.md`
- `rs-1/docs/contracts/PROTOCOL_MQTT.md`
