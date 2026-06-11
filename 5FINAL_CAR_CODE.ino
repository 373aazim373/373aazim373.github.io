/*
 * BLUETOOTH CONTROLLED ROBOT 
 * Arduino Nano with 3 Operating Modes 
 * 
 * Modes:
 * 1. Manual Mode (M)
 * 2. Obstacle Avoiding Mode (O)
 * 3. Line Following Mode (I)
 * 
 * IMPROVEMENTS:
 * ✓ Non-blocking timing with millis()
 * ✓ Responsive Bluetooth during autonomous modes
 * ✓ Better for real-time systems
 * ✓ Can handle multiple simultaneous operations
 * 
 * Author: Aazim Zihan
 * Date: 2026
 */

#include <Servo.h>
#include <SoftwareSerial.h>

// ==================== PIN DEFINITIONS ====================
// Motor Driver Pins (L293D)
#define MOTOR_LEFT_PIN1 2      // Left motor forward
#define MOTOR_LEFT_PIN2 3      // Left motor backward
#define MOTOR_RIGHT_PIN1 4     // Right motor forward
#define MOTOR_RIGHT_PIN2 A2     // Right motor backward
#define MOTOR_LEFT_PWM 5       // PWM for left motor speed
#define MOTOR_RIGHT_PWM 11     // PWM for right motor speed

// Servo Motor Pin (SG-90 for Ultrasonic sensor)
#define SERVO_PIN 6

// Ultrasonic Sensor Pins (HC-SR04)
#define ULTRA_TRIG 7
#define ULTRA_ECHO 8

// IR Sensor Pins (FC-51)
#define IR_LEFT A0
#define IR_RIGHT A1

// Bluetooth Pins (HC-06)
#define BT_RX 0                // RX pin (Arduino RX)
#define BT_TX 1                // TX pin (Arduino TX)

// ==================== TIMING CONSTANTS ====================
const unsigned long OBSTACLE_SCAN_INTERVAL = 300;    // Scan every 300ms
const unsigned long IR_READ_INTERVAL = 50;           // Read IR every 50ms
const unsigned long SERVO_MOVE_TIME = 300;           // Time for servo to move
const unsigned long DISTANCE_TIMEOUT = 30000;        // Ultrasonic timeout (microseconds)
const unsigned long BLUETOOTH_CHECK_INTERVAL = 10;   // Check BT every 10ms

// ==================== GLOBAL VARIABLES ====================
Servo sensorServo;
SoftwareSerial bluetooth(BT_RX, BT_TX);  // RX, TX for HC-06

// Motor speed variables
int motorSpeed = 200;         // Default motor speed (0-255)
int maxSpeed = 255;

// Mode variables
char currentMode = 'M';       // M = Manual, O = Obstacle, I = Line Following
char previousMode = 'M';

// Obstacle avoidance parameters
int minDistanceCM = 30;
int avoidanceDistance = 35;
int scanLeft = 180;
int scanCenter = 90;
int scanRight = 0;

// Line following parameters
int irThreshold = 500;
int lineFollowSpeed = 250;

// ==================== TIMING VARIABLES ====================
unsigned long lastObstacleScanTime = 0;
unsigned long lastIRReadTime = 0;
unsigned long lastBluetoothCheckTime = 0;
unsigned long lastUltrasonicTriggerTime = 0;
unsigned long lastServoMoveTime = 0;

// ==================== STATE VARIABLES ====================
enum ObstacleState {
  OBS_MOVING,
  OBS_SCANNING,
  OBS_DECIDING,
  OBS_TURNING
};

ObstacleState obstacleState = OBS_MOVING;
int lastLeftDistance = 0;
int lastRightDistance = 0;
int lastCenterDistance = 0;
int servoTargetAngle = 90;
int currentServoAngle = 90;

enum UltrasonicState {
  ULTRA_IDLE,
  ULTRA_TRIGGERED,
  ULTRA_WAITING
};

UltrasonicState ultrasonicState = ULTRA_IDLE;
unsigned long ultrasonicTriggerTime = 0;

bool isReversing = false;  // Track if robot is backing up

// ==================== SETUP ====================
void setup() {
  // Initialize serial communication
  Serial.begin(9600);         // Debug serial
  bluetooth.begin(9600);      // HC-06 baud rate
  
  // Configure motor pins
  pinMode(MOTOR_LEFT_PIN1, OUTPUT);
  pinMode(MOTOR_LEFT_PIN2, OUTPUT);
  pinMode(MOTOR_RIGHT_PIN1, OUTPUT);
  pinMode(MOTOR_RIGHT_PIN2, OUTPUT);
  pinMode(MOTOR_LEFT_PWM, OUTPUT);
  pinMode(MOTOR_RIGHT_PWM, OUTPUT);
  
  // Configure ultrasonic pins
  pinMode(ULTRA_TRIG, OUTPUT);
  pinMode(ULTRA_ECHO, INPUT);
  
  // Configure IR sensor pins
  pinMode(IR_LEFT, INPUT);
  pinMode(IR_RIGHT, INPUT);
  
  // Initialize servo
 sensorServo.attach(SERVO_PIN);
 sensorServo.write(scanCenter);
  currentServoAngle = scanCenter;
 servoTargetAngle = scanCenter;
  
  // Stop all motors at startup
  stopMotors();
  
  // Welcome message
  Serial.println("=== BLUETOOTH ROBOT INITIALIZED (Non-Blocking) ===");
  Serial.println("Mode: M(Manual) O(Obstacle) I(Line Following)");
  Serial.println("Direction: F(Forward) B(Back) L(Left) R(Right) S(Stop)");
  Serial.println("Speed: 1-9");
  
  delay(1000);  // OK to use delay in setup()

  
}

// ==================== MAIN LOOP ====================
void loop() {
  unsigned long currentTime = millis();
  
  // Check for Bluetooth commands (non-blocking)
  if (currentTime - lastBluetoothCheckTime >= BLUETOOTH_CHECK_INTERVAL) {
    lastBluetoothCheckTime = currentTime;
    checkBluetoothCommands();
  }
  
  // Execute mode-specific logic
  switch (currentMode) {
    case 'M':
      manualMode(currentTime);
      break;
    case 'O':
      obstacleAvoidingMode(currentTime);
      break;
    case 'I':
      lineFollowingMode(currentTime);
      break;
    default:
      stopMotors();
      break;
  }
  
  // Update servo position if moving
  updateServoPosition(currentTime);
}

// ==================== BLUETOOTH COMMAND PROCESSING ====================
void checkBluetoothCommands() {
  if (bluetooth.available()) {
    char cmd = bluetooth.read();
    processBluetoothCommand(cmd);
  }
}

void processBluetoothCommand(char cmd) {
  cmd = toupper(cmd);  // Convert to uppercase
  
  // Mode selection commands
  if (cmd == 'M' || cmd == 'O' || cmd == 'I') {
    previousMode = currentMode;
    currentMode = cmd;
    stopMotors();
    servoTargetAngle = scanCenter;
    
    String modeNames[] = {"Manual", "Obstacle", "Line Following"};
    int modeIndex = (cmd == 'M') ? 0 : (cmd == 'O') ? 1 : 2;
    
    Serial.print("Mode changed to: ");
    Serial.println(modeNames[modeIndex]);
    bluetoothSend("MODE: " + String(modeNames[modeIndex]));
    
    // Reset timing variables for new mode
    lastObstacleScanTime = millis();
    lastIRReadTime = millis();
    lastUltrasonicTriggerTime = millis();
    obstacleState = OBS_MOVING;
    ultrasonicState = ULTRA_IDLE;
    
    return;
  }
  
  // Movement commands (only in Manual mode)
  if (currentMode == 'M') {
    switch (cmd) {
      case 'F':
        moveForward(motorSpeed);
        break;
      case 'B':
        moveBackward(motorSpeed);
        break;
      case 'L':
        turnLeft(motorSpeed);
        break;
      case 'R':
        turnRight(motorSpeed);
        break;
      case 'S':
        stopMotors();
        break;
      default:
        break;
    }
  }
  
  // Speed control (1-9)
  if (cmd >= '1' && cmd <= '9') {
    motorSpeed = map(cmd - '0', 1, 9, 100, 255);
    Serial.print("Speed: ");
    Serial.println(motorSpeed);
    bluetoothSend("SPEED: " + String(motorSpeed));
  }
}

// ==================== MANUAL MODE ====================
void manualMode(unsigned long currentTime) {
  // Manual mode is controlled entirely by Bluetooth commands
  // No autonomous behavior
  (void)currentTime;  // Suppress unused parameter warning
}

// ==================== OBSTACLE AVOIDING MODE ====================
void obstacleAvoidingMode(unsigned long currentTime) {
  
  switch (obstacleState) {
    
    case OBS_MOVING:
  moveForward(motorSpeed);
  
  if (currentTime - lastObstacleScanTime >= OBSTACLE_SCAN_INTERVAL) {
    lastObstacleScanTime = currentTime;
    lastCenterDistance = getDistance();
    
    if (lastCenterDistance <= avoidanceDistance) {
      obstacleState = OBS_SCANNING;
      stopMotors();
      servoTargetAngle = scanLeft;  // Set target, let state machine move it
      lastServoMoveTime = currentTime;
      
      Serial.print("Obstacle detected at: ");
      Serial.print(lastCenterDistance);
      Serial.println(" cm - Starting scan");
    }
  }
  break;

    case OBS_SCANNING:
      // Servo is moving to scan positions
      if (currentServoAngle == scanLeft && currentTime - lastServoMoveTime >= SERVO_MOVE_TIME) {
        // Read left distance
        lastLeftDistance = getDistance();
        Serial.print("Left distance: ");
        Serial.println(lastLeftDistance);
        
        // Move to right
        servoTargetAngle = scanRight;
        lastServoMoveTime = currentTime;
      } 
      else if (currentServoAngle == scanRight && currentTime - lastServoMoveTime >= SERVO_MOVE_TIME) {
        // Read right distance
        lastRightDistance = getDistance();
        Serial.print("Right distance: ");
        Serial.println(lastRightDistance);
        
        // Transition to decision
        obstacleState = OBS_DECIDING;
        lastServoMoveTime = currentTime;
      }
      break;
    
    case OBS_DECIDING:
      // Make decision and turn
      servoTargetAngle = scanCenter;
      
      if (lastLeftDistance > lastRightDistance && lastLeftDistance > minDistanceCM) {
        // Turn left
        turnLeft(lineFollowSpeed);
        isReversing = false;
        Serial.println("Turning LEFT");
      } 
      else if (lastRightDistance > minDistanceCM) {
        // Turn right
        turnRight(lineFollowSpeed);
        isReversing = false;
        Serial.println("Turning RIGHT");
      } 
      else {
        // Blocked - reverse and turn
        moveBackward(lineFollowSpeed);
        isReversing = true;
        Serial.println("Reversing - Path blocked");
      }
      
      obstacleState = OBS_TURNING;
      lastServoMoveTime = currentTime;
      break;
    
    case OBS_TURNING:
      int turnDuration = isReversing ? 1500 : 600;
      // Turn for set time, then resume moving
      if (currentTime - lastServoMoveTime >= turnDuration) {
        obstacleState = OBS_MOVING;
        lastObstacleScanTime = currentTime;
      }
      break;
  }
}

// ==================== LINE FOLLOWING MODE ====================
void lineFollowingMode(unsigned long currentTime) {
  
  if (currentTime - lastIRReadTime >= IR_READ_INTERVAL) {
    lastIRReadTime = currentTime;
    
    int leftValue = analogRead(IR_LEFT);
    int rightValue = analogRead(IR_RIGHT);
    
    // Debug output (less frequent)
    static unsigned long lastDebugTime = 0;
    if (currentTime - lastDebugTime >= 500) {
      Serial.print("Left: ");
      Serial.print(leftValue);
      Serial.print(" | Right: ");
      Serial.println(rightValue);
      lastDebugTime = currentTime;
    }
    
    // Line following logic
    if (leftValue < irThreshold && rightValue < irThreshold) {
      // Both sensors on line - move forward
      moveForward(lineFollowSpeed);
    }
    else if (leftValue < irThreshold && rightValue >= irThreshold) {
      // Left sensor on line, right off - turn right
      turnRight(lineFollowSpeed);
    }
    else if (leftValue >= irThreshold && rightValue < irThreshold) {
      // Right sensor on line, left off - turn left
      turnLeft(lineFollowSpeed);
    }
    else {
      // Line lost - stop
      stopMotors();
    }
  }
}

// ==================== MOTOR CONTROL FUNCTIONS ====================
void moveForward(int speed) {
  setMotor(MOTOR_LEFT_PIN1, MOTOR_LEFT_PIN2, MOTOR_LEFT_PWM, speed);
  setMotor(MOTOR_RIGHT_PIN1, MOTOR_RIGHT_PIN2, MOTOR_RIGHT_PWM, speed);
}


void moveBackward(int speed) {
  setMotor(MOTOR_LEFT_PIN2, MOTOR_LEFT_PIN1, MOTOR_LEFT_PWM, speed);
  setMotor(MOTOR_RIGHT_PIN2, MOTOR_RIGHT_PIN1, MOTOR_RIGHT_PWM, speed);
}

void turnLeft(int speed) {
  setMotor(MOTOR_LEFT_PIN2, MOTOR_LEFT_PIN1, MOTOR_LEFT_PWM, speed);
  setMotor(MOTOR_RIGHT_PIN1, MOTOR_RIGHT_PIN2, MOTOR_RIGHT_PWM, speed);
}

void turnRight(int speed) {
  setMotor(MOTOR_LEFT_PIN1, MOTOR_LEFT_PIN2, MOTOR_LEFT_PWM, speed);
  setMotor(MOTOR_RIGHT_PIN2, MOTOR_RIGHT_PIN1, MOTOR_RIGHT_PWM, speed);
}

void stopMotors() {
  digitalWrite(MOTOR_LEFT_PIN1, LOW);
  digitalWrite(MOTOR_LEFT_PIN2, LOW);
  digitalWrite(MOTOR_RIGHT_PIN1, LOW);
  digitalWrite(MOTOR_RIGHT_PIN2, LOW);
  analogWrite(MOTOR_LEFT_PWM, 0);
  analogWrite(MOTOR_RIGHT_PWM, 0);
}

// Helper function to set motor direction and speed
void setMotor(int pin1, int pin2, int pwmPin, int speed) {
  digitalWrite(pin1, HIGH);
  digitalWrite(pin2, LOW);
  analogWrite(pwmPin, constrain(speed, 0, 255));
}

// ==================== SERVO CONTROL ====================
void updateServoPosition(unsigned long currentTime) {
  (void)currentTime;  // Suppress unused parameter warning
  if (currentMode != 'O'){
    sensorServo.detach();
    return;
  }

  if (!sensorServo.attached()) {
    sensorServo.attach(SERVO_PIN);
  }
  // Smoothly move servo to target angle
  if (currentServoAngle < servoTargetAngle) {
    currentServoAngle++;
    sensorServo.write(currentServoAngle);
  } 
  else if (currentServoAngle > servoTargetAngle) {
    currentServoAngle--;
    sensorServo.write(currentServoAngle);
  }
}

// ==================== SENSOR FUNCTIONS ====================
// Non-blocking distance measurement using state machine
int getDistance() {
  // This is a simplified blocking version for accuracy
  // For fully non-blocking, implement state machine below
  
  // Send trigger pulse
  digitalWrite(ULTRA_TRIG, LOW);
  delayMicroseconds(2);
  digitalWrite(ULTRA_TRIG, HIGH);
  delayMicroseconds(10);
  digitalWrite(ULTRA_TRIG, LOW);
  
  // Measure echo time with timeout
  unsigned long duration = pulseIn(ULTRA_ECHO, HIGH, DISTANCE_TIMEOUT);
  
  // Calculate distance (speed of sound = 343 m/s)
  int distance = duration * 0.034 / 2;
  
  // Constraint distance to realistic values
  if (distance < 2 || distance > 400) {
    distance = 400;  // Return max if out of range
  }
  
  return distance;
}

// Read IR sensors
int readLeftIR() {
  return analogRead(IR_LEFT);
}

int readRightIR() {
  return analogRead(IR_RIGHT);
}

// ==================== BLUETOOTH COMMUNICATION ====================
void bluetoothSend(String message) {
  bluetooth.println(message);
  Serial.println(message);
}

void bluetoothSendDistance(int distance) {
  String msg = "DISTANCE: " + String(distance) + "cm";
  bluetoothSend(msg);
}

// ==================== UTILITY FUNCTIONS ====================
// Calibration function - call from setup if needed
void calibrateIRSensors() {
  Serial.println("=== IR SENSOR CALIBRATION ===");
  Serial.println("Place left sensor on white surface...");
  delay(2000);  // OK in setup context
  
  int leftWhite = analogRead(IR_LEFT);
  
  Serial.println("Place left sensor on black line...");
  delay(2000);  // OK in setup context
  
  int leftBlack = analogRead(IR_LEFT);
  irThreshold = (leftWhite + leftBlack) / 2;
  
  Serial.print("Calibration complete. Threshold set to: ");
  Serial.println(irThreshold);
}

// Debug function - prints all sensor values
void debugSensors() {
  Serial.println("=== SENSOR DEBUG ===");
  Serial.print("Distance: ");
  Serial.print(getDistance());
  Serial.println(" cm");
  
  Serial.print("Left IR: ");
  Serial.print(readLeftIR());
  Serial.print(" | Right IR: ");
  Serial.println(readRightIR());
  
  Serial.print("Current Mode: ");
  Serial.println(currentMode);
  Serial.print("Servo Angle: ");
  Serial.println(currentServoAngle);
  
  Serial.println();
}