# Bluetooth-Controlled Arduino Robot

A feature-rich autonomous robot built with Arduino Nano, capable of obstacle avoidance, line-following, and Bluetooth remote control via a custom mobile app.

🌐 **[Visit Project Website](https://373aazim373.github.io/)** – Full documentation, guides, and project showcase

## Features

- **🎮 Bluetooth Remote Control**: Wireless control mobile application
- **🤖 Autonomous Modes**:
  - Obstacle avoidance with ultrasonic sensor
  - Line-following with IR sensors
  - Manual control with auto-stop timeout
- **⚙️ Motor Control**: Dual motor PWM control with variable speed (0-255)
- **📡 Wireless Communication**: HC-06 Bluetooth module (9600 baud)
- **🛡️ Safety Features**: Automatic timeout and state management

## Hardware Components

| Component | Specification | Purpose |
|-----------|---------------|---------|
| **Microcontroller** | Arduino Nano (ATmega328P) | Main control unit |
| **Motor Driver** | L293D | Dual motor H-bridge control |
| **Bluetooth Module** | HC-06 | Wireless serial communication |
| **Ultrasonic Sensor** | HC-SR04 | Obstacle detection |
| **IR Sensors** | 2x Infrared line sensors | Line-following detection |
| **Servo Motor** | Standard 9g servo | Sensor pan mechanism |
| **Power** | 7.4V LiPo / USB Micro | Power supply |
| **Motors** | 2x DC gear motors | Drive wheels |

## Pin Configuration

```
See Guide
```

## Bluetooth Protocol

Commands sent from mobile app (text-based, 9600 baud):

| Command | Action |
|---------|--------|
| `M` | Manual mode |
| `O` | Start obstacle avoidance mode |
| `I` | Start line-following mode |
| `S` | Stop all motors |
| `SPEED:[1-9]` | Set motor speed (1=very slow, 255=fast) |
| `F` | Move forward (manual mode) |
| `B` | Move backward (manual mode) |
| `L` | Turn left (manual mode) |
| `R` | Turn right (manual mode) |

### Key Modules

- **Motor Control**: Non-blocking PWM speed management with direction control
- **Obstacle Detection**: Ultrasonic sensor with configurable threshold (20cm default)
- **Line Following**: Dual IR sensor logic with threshold-based steering
- **Serial Parser**: Robust Bluetooth command parsing with timeout handling

## Installation & Setup

### Hardware Assembly

See Guide.pdf for Visual guide

1. Connect motors to L293D outputs
2. Wire ultrasonic sensor (HC-SR04) to pins D7 (trigger) and D8 (echo)
3. Connect IR sensors to analog pins A0 (left) and A1 (right)
4. Attach servo to pin D6
5. Connect HC-06 Bluetooth module:
   - VCC → 5V
   - GND → GND
   - TX → RX 
   - RX → TX (With voltage divider)

### Software Upload

1. Download the Arduino IDE
2. Install required libraries:
   - `Servo` (built-in)
   - `SoftwareSerial` (built-in)
3. Upload sketch to Arduino Nano via USB

### Mobile App Setup (Recommended - Bluetooth Electronics)

1. Connect via Bluetooth to "HC-06" module
2. Send commands using the app interface

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| **Motors don't move** | PWM pin conflict (Timer1) | Check Servo library compatibility; reassign pins if needed |
| **USB power fails** | Failed AMS1117 regulator | Use external 5V power supply; consider regulator replacement |
| **Bluetooth not connecting** | Wrong baud rate | Verify HC-06 set to 9600 baud |
| **Sensor readings erratic** | Electrical noise | Add capacitors (10-100µF) near sensor power pins |
| **Line following drifts** | Misaligned IR sensors | Calibrate sensor thresholds via Serial monitor |

## Known Issues & Fixes

- **Timer1 Conflict**: Servo library uses Timer1, conflicting with Motor2 PWM on D9. **Fixed** by reassigning Motor2 to A2 or using alternative PWM pins.
- **Blocking Code**: Previous obstacle avoidance state machine used blocking delays. **Fixed** with non-blocking state updates.
- **Manual Mode Timeout**: Implements auto-stop after 5 seconds inactivity to prevent runaway motors.

## Performance Specifications

| Metric | Value |
|--------|-------|
| Max Speed | ~0.5 m/s (speed setting 255) |
| Min Detectable Distance | ~2 cm (ultrasonic) |
| Bluetooth Range | ~10 m (line-of-sight) |
| Battery Life | ~2-3 hours (2200mAh Based on your battery) |
| Response Latency | <50ms (Real Time) |

## Future Enhancements

- [ ] PID controller for smoother line-following
- [ ] LCD display for status feedback
- [ ] Web dashboard for remote monitoring
- [ ] GPS navigation (outdoors)

## Contributing

Found a bug or have a suggestion? Open an issue or submit a pull request!

## Acknowledgments

- Arduino community for excellent libraries and documentation
- Online robotics forums for troubleshooting guidance

## Contact & Support

For questions or technical assistance, reach out via:
- **Website**: [https://373aazim373.github.io/](https://373aazim373.github.io/)
- **GitHub Issues**: [Report bugs or request features](../../issues)
- **Email**: [373aazim373@gmail.com]
- **Documentation**: See [project website](https://373aazim373.github.io/) or `Guide.pdf` file for detailed guides

---

**Last Updated**: June 2026  
**Status**: Active Development
