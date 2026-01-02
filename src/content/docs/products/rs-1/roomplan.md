---
title: RS-1 RoomPlan API
description: RoomPlan endpoints and payloads for RS-1.
---

RS-1 accepts room configuration data from iPhone RoomPlan exports to map sensor coordinates to room space.

## API Endpoints (Verified)

From `hardwareOS/docs/rs1/ROOMPLAN_API.md`:

- `POST /api/setup/roomplan` uploads room dimensions + sensor pose.
- `GET /api/setup/roomplan` returns the current configuration.

Example request:

```http
POST /api/setup/roomplan
Content-Type: application/json
Authorization: Bearer <token>

{
  "room_width": 5.2,
  "room_height": 4.8,
  "sensor_pose": {
    "m": [
      0.866, 0.0, -0.5, 0.0,
      0.0, 1.0, 0.0, 0.0,
      0.5, 0.0, 0.866, 0.0,
      2.6, 0.0, 2.4, 1.0
    ]
  }
}
```

## Sources

- `hardwareOS/docs/rs1/ROOMPLAN_API.md`
