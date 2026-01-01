---
title: Troubleshooting
description: Solutions for common RS-1 issues and frequently asked questions
---

This guide covers common issues and their solutions. If you can't find your answer here, contact support at support@optic.works.

## Quick Diagnostics

### LED Status Reference

| LED State | Meaning | Action |
|-----------|---------|--------|
| Solid Blue | Normal operation | None needed |
| Pulsing Blue | Processing/detecting | Normal |
| Solid Green | Connected, idle | None needed |
| Flashing Green | Connecting to WiFi | Wait for connection |
| Solid Yellow | Firmware updating | Do not unplug |
| Flashing Yellow | Needs attention | Check app for details |
| Solid Red | Error state | See error codes below |
| Flashing Red | Critical error | Power cycle, contact support |
| Off | No power | Check power connection |

### Error Codes

When LED shows solid red, check the app for error code:

| Code | Meaning | Solution |
|------|---------|----------|
| E001 | WiFi connection lost | Check router, reconnect |
| E002 | MQTT broker unreachable | Verify broker settings |
| E003 | Sensor calibration invalid | Recalibrate |
| E004 | Radar module error | Power cycle, contact support |
| E005 | Camera module error | Power cycle, contact support |
| E006 | Storage full | Clear history, update firmware |
| E007 | Overheating | Improve ventilation |
| E008 | Firmware corrupt | Factory reset, reflash |

## Setup Issues

### Can't Find RS-1 During Setup

**Symptoms:** App doesn't detect RS-1 during initial setup

**Solutions:**

1. **Verify power:**
   - Check USB-C cable is fully connected
   - Use included power adapter (5V 2A minimum)
   - LED should light up within 5 seconds

2. **Enable Bluetooth:**
   - Settings → Bluetooth → On
   - Allow OpticWorks app Bluetooth access

3. **Check proximity:**
   - Be within 3 meters of RS-1
   - No walls between phone and device

4. **Restart setup:**
   - Force close OpticWorks app
   - Power cycle RS-1
   - Reopen app and try again

5. **Factory reset RS-1:**
   - Hold reset button for 10 seconds
   - LED flashes rapidly, then solid blue
   - Retry setup

### WiFi Connection Fails

**Symptoms:** RS-1 can't connect to your WiFi network

**Solutions:**

| Issue | Check | Solution |
|-------|-------|----------|
| Wrong password | Caps lock, special characters | Re-enter carefully |
| 5GHz network | RS-1 is 2.4GHz only | Use 2.4GHz network |
| Hidden network | SSID not broadcast | Enable SSID or enter manually |
| Too far from router | Weak signal | Move closer or add extender |
| MAC filtering | Router blocks new devices | Add RS-1 MAC to allowed list |
| Network full | Too many devices | Remove unused devices |

**Finding RS-1 MAC address:**
1. During setup, MAC shown on connection screen
2. Or: Hold button for 5 sec → LED blinks MAC in morse (check serial with USB)

### App Won't Connect After Setup

**Symptoms:** Setup completed but app shows "Offline"

**Solutions:**

1. **Same network:**
   - Ensure phone and RS-1 on same WiFi
   - Corporate networks may isolate devices

2. **Local network permission:**
   - iOS: Settings → OpticWorks → Local Network → On

3. **Router settings:**
   - Enable mDNS/Bonjour
   - Disable AP isolation/client isolation

4. **Restart sequence:**
   - Power off RS-1 (30 sec)
   - Force close app
   - Power on RS-1
   - Open app

## Detection Issues

### Not Detecting Presence

**Symptoms:** Room shows empty when someone is there

**Troubleshooting steps:**

1. **Check sensor view:**
   - Ensure nothing is blocking the sensor
   - Clean lens with microfiber cloth
   - Verify mounting angle includes detection area

2. **Verify in test mode:**
   - Room → Test Mode
   - Walk around room
   - Check if radar dots appear

3. **Increase sensitivity:**
   - Room → Sensor Settings → Detection Sensitivity
   - Increase to 80-90%
   - Test again

4. **Check zones:**
   - Ensure person isn't in exclusion zone
   - Verify zone heights are correct

5. **Recalibrate:**
   - Room Settings → Calibration Wizard
   - Complete full calibration

**Still not working?**

| Situation | Cause | Solution |
|-----------|-------|----------|
| Never detects | Hardware issue | Contact support |
| Intermittent | Interference | Change WiFi channel |
| Only misses corners | Limited coverage | Adjust mounting or add sensor |
| Misses still people | Sensitivity too low | Increase sensitivity |

### False Positives (Ghost Detections)

**Symptoms:** Shows occupied when room is empty

**Common causes and solutions:**

1. **Reflective surfaces:**
   - Windows reflecting sunlight
   - Large mirrors
   - Metal surfaces

   *Solution:* Add exclusion zones

2. **Moving objects:**
   - Ceiling fans
   - Curtains in draft
   - Swinging plants

   *Solution:* Add exclusion zones, lower sensitivity

3. **HVAC:**
   - Air vents blowing
   - Heating elements

   *Solution:* Exclude vent areas

4. **Electronic interference:**
   - Other radar devices
   - Microwave ovens
   - WiFi routers very close

   *Solution:* Move RS-1 or interfering device

5. **Pets:**
   - Dogs, cats can trigger detection

   *Solution:* Add floor-level exclusion zone (0-0.5m height)

### Detecting Pets

**Symptoms:** Pets trigger presence detection

**Solutions:**

1. **Height-based exclusion:**
   - Create exclusion zone from floor to pet height
   - Usually 0m - 0.5m for cats/small dogs
   - 0m - 0.7m for larger dogs

2. **Lower sensitivity:**
   - Reduce to 50-60%
   - Trade-off: may miss very still humans

3. **Future:** Pet detection filter (coming in firmware update)

### Wrong Position Shown

**Symptoms:** Detected position doesn't match actual location

**Solutions:**

1. **Verify sensor pose:**
   - Check 3D model shows sensor in correct position
   - Recapture pose if wrong

2. **Room model accuracy:**
   - If walls/furniture are wrong, rescan room
   - Accurate room model = accurate positioning

3. **Recalibrate:**
   - Room Settings → Calibration Wizard
   - Walk test during calibration

### Delayed Detection

**Symptoms:** Takes too long to detect presence or absence

**Solutions:**

For slow presence detection:
- Lower movement threshold
- Increase sensitivity
- Check for obstructions

For slow absence detection:
- Reduce absence timeout (default 30 sec)
- Room → Sensor Settings → Absence Timeout

## Connectivity Issues

### Sensor Goes Offline Frequently

**Symptoms:** App shows offline, LED flashing

**Solutions:**

1. **WiFi signal strength:**
   - Check RSSI in app (should be > -70 dBm)
   - Move router closer or add extender
   - Change WiFi channel to reduce interference

2. **Router issues:**
   - Update router firmware
   - Restart router
   - Check DHCP lease time (increase if short)

3. **Power issues:**
   - Use quality USB-C cable
   - Use recommended power adapter
   - Avoid USB hubs or weak sources

4. **Network congestion:**
   - Too many devices
   - High bandwidth usage
   - Try prioritizing RS-1 in router QoS

### MQTT Connection Drops

**Symptoms:** Home Assistant entities become unavailable

**Solutions:**

1. **Broker stability:**
   - Check MQTT broker logs
   - Restart Mosquitto/broker
   - Verify broker has enough resources

2. **Keep-alive:**
   - Increase MQTT keep-alive interval
   - Sensor Settings → MQTT → Keep Alive → 60 seconds

3. **Credentials:**
   - Verify username/password still valid
   - Check for special characters causing issues

4. **Network:**
   - Ensure RS-1 can reach broker IP
   - Check firewall rules

### HomeKit Not Responding

**Symptoms:** "No Response" in Apple Home

**Solutions:**

1. **Same network:**
   - iPhone and RS-1 must be on same network
   - Turn off VPN on phone

2. **Home hub:**
   - Ensure Apple TV/HomePod is home hub
   - Check hub is online

3. **Reset HomeKit:**
   - RS-1 Settings → HomeKit → Reset
   - Remove from Apple Home
   - Re-pair

## RoomPlan Issues

### Scan Won't Start

**Symptoms:** "Start Scan" button doesn't work or app crashes

**Requirements check:**
- iPhone 12 Pro or newer (LiDAR required)
- iOS 17.0 or later
- Camera permission granted

**Solutions:**
1. Force close and reopen app
2. Restart iPhone
3. Update iOS if available
4. Reinstall OpticWorks app

### Poor Scan Quality

**Symptoms:** Walls missing, distorted room model

**Solutions:**

1. **Lighting:**
   - Turn on all lights
   - Open blinds for natural light
   - LiDAR works in dark but camera helps

2. **Scanning technique:**
   - Move slowly (walking speed)
   - Keep phone 2-3 feet from walls
   - Overlap scanned areas
   - Pause at corners

3. **Room complexity:**
   - Very large rooms need multiple scans
   - Glass walls are hard to detect
   - Mirrors cause issues - cover them

4. **Rescan:**
   - Delete current model
   - Start fresh with better technique

### Sensor Pose Capture Fails

**Symptoms:** Can't capture RS-1 position in room model

**Solutions:**

1. **Visibility:**
   - Ensure RS-1 is clearly visible
   - Good lighting on sensor
   - No obstructions

2. **Distance:**
   - Stand 1-2 meters from RS-1
   - Not too close, not too far

3. **Camera access:**
   - Verify camera permission granted
   - Clean phone camera lens

4. **Retry:**
   - Different angle
   - Different lighting
   - Restart app and try again

## App Issues

### App Crashes

**Solutions:**
1. Force close and reopen
2. Restart iPhone
3. Update to latest app version
4. Reinstall app (settings preserved in cloud)

### Data Not Syncing

**Symptoms:** Changes don't appear on other devices

**Solutions:**
1. Check internet connection
2. Pull down to refresh
3. Sign out and sign in
4. Check cloud sync is enabled

### Notifications Not Working

**Solutions:**
1. Settings → Notifications → OpticWorks → Allow
2. Check Do Not Disturb is off
3. Verify notifications enabled in app
4. Check Focus modes aren't blocking

## Firmware Issues

### Update Fails

**Symptoms:** Firmware update stuck or fails

**Solutions:**

1. **Don't unplug during update**
2. **Wait longer:** Large updates take up to 10 minutes
3. **Retry:**
   - Power cycle RS-1
   - Open app
   - Check for updates again

4. **Manual update:**
   - Download firmware from support site
   - Use USB-C to flash directly
   - See [hardwareOS documentation](/projects/hardware-os/)

### Stuck in Boot Loop

**Symptoms:** LED keeps cycling, never stable

**Solutions:**

1. **Power cycle:**
   - Unplug for 60 seconds
   - Replug
   - Wait 2 minutes

2. **Factory reset:**
   - Hold reset button 10 seconds
   - Wait for LED pattern

3. **Recovery mode:**
   - Hold reset while plugging in
   - LED goes solid yellow
   - Use recovery tool (see support site)

## Hardware Issues

### LED Not Working

**Symptoms:** No LED at all, device seems dead

**Check:**
1. Power cable connected?
2. Using correct power adapter?
3. Try different outlet
4. Try different USB-C cable

If still no LED, device may be defective. Contact support.

### Sensor Making Noise

**Symptoms:** Clicking, buzzing, or high-pitched sound

**Causes:**
- Normal: Quiet hum from radar is normal
- Abnormal: Loud clicking or buzzing

**Solutions:**
1. Check mounting is secure (no vibration)
2. Verify ventilation not blocked
3. If loud/persistent, contact support

### Overheating

**Symptoms:** Device very hot to touch, or E007 error

**Solutions:**
1. Ensure adequate ventilation
2. Don't mount in direct sunlight
3. Don't cover or enclose device
4. Ambient temp should be under 35°C (95°F)

## Performance Optimization

### Improve Detection Accuracy

1. Optimal mounting height: 2.0-2.5m
2. Angle slightly downward (15-30°)
3. Clear line of sight to detection areas
4. Run calibration wizard monthly

### Reduce False Positives

1. Add exclusion zones for problem areas
2. Lower sensitivity (start at 60%, increase if needed)
3. Exclude floor level for pets
4. Cover or exclude mirrors/reflective surfaces

### Improve Response Time

1. Lower absence timeout for quick off
2. Ensure strong WiFi signal
3. Use wired ethernet if available (via adapter)
4. Keep firmware updated

## Factory Reset

**When to factory reset:**
- Device won't connect
- Selling or giving away device
- Persistent unexplained issues

**How to factory reset:**

1. **Via app:**
   - Sensor Settings → Advanced → Factory Reset
   - Confirm

2. **Via button:**
   - Hold reset button for 10+ seconds
   - LED flashes rapidly
   - Release when LED goes solid blue

**After reset:**
- All settings cleared
- WiFi credentials removed
- Need to re-setup from scratch
- Room model preserved in cloud (if signed in)

## Getting Support

### Before Contacting Support

Gather this information:
- Device serial number (on bottom of RS-1)
- Firmware version (app → Sensor → About)
- App version (app → Settings → About)
- Description of issue
- Steps already tried

### Support Channels

| Channel | Response Time | Best For |
|---------|---------------|----------|
| **Email:** support@optic.works | 24-48 hours | Non-urgent issues |
| **Community:** community.optic.works | Variable | Tips, community help |
| **Knowledge Base:** help.optic.works | Instant | Self-service articles |

### Warranty Information

RS-1 includes a 2-year limited warranty covering:
- Manufacturing defects
- Hardware failures under normal use

Not covered:
- Physical damage
- Water damage
- Modified firmware
- Commercial/industrial use

For warranty claims, contact support with proof of purchase.

## FAQ

### General

**Q: Does RS-1 record video?**
A: No. While RS-1 has a camera for sensor fusion, it does not record or transmit video. All processing is done locally on-device.

**Q: Does RS-1 work without internet?**
A: Yes, core presence detection works locally. Internet required for: app remote access, firmware updates, cloud backup.

**Q: How many people can RS-1 track?**
A: Up to 5 people simultaneously, though accuracy is best with 3 or fewer.

**Q: What's the detection range?**
A: Up to 6 meters radius, depending on mounting height and room layout.

### Privacy

**Q: What data does RS-1 collect?**
A: Presence data (occupied/empty, positions). No personally identifiable information, no video, no audio.

**Q: Where is data stored?**
A: Locally on device and optionally in your private cloud account. We don't access your data.

**Q: Can I disable cloud sync?**
A: Yes. Settings → Privacy → Local Only Mode.

### Compatibility

**Q: Does RS-1 work with Android?**
A: Currently iOS only. Android app planned for future release.

**Q: What smart home systems work with RS-1?**
A: Home Assistant, Apple HomeKit, Google Home, Amazon Alexa (via Matter), and any MQTT-compatible system.

**Q: Can I use multiple RS-1 sensors?**
A: Yes. Each sensor covers one room. The app supports unlimited sensors.

## Next Steps

- [Specifications](/products/rs-1/specifications/) - Technical details
- [Integrations](/products/rs-1/integrations/) - Smart home setup
- [Quick Start Guide](/products/rs-1/quick-start/) - Initial setup
