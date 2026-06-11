// Mock data for TriModeCar showcase

export const heroData = {
  title: "TriModeCar",
  subtitle: "Arduino-Powered Intelligence on Wheels",
  description: "A versatile autonomous vehicle with three intelligent modes: Manual Control, Obstacle Avoidance, and Line Following. Built with Arduino and engineered for adaptability.",
  ctaText: "Explore Features",
  stats: [
    { value: "3", label: "Operating Modes" },
    { value: "99%", label: "Accuracy" },
    { value: "5+", label: "Sensors" }
  ]
};

export const modesData = [
  {
    id: 1,
    name: "Manual Mode",
    description: "Full remote control via Bluetooth or RF module. Navigate with precision using directional commands for testing and entertainment.",
    icon: "gamepad",
    features: [
      "Real-time wireless control",
      "Variable speed control",
      "Instant response time",
      "Multi-direction movement"
    ]
  },
  {
    id: 2,
    name: "Obstacle Avoiding",
    description: "Autonomous navigation using ultrasonic sensors. The car detects obstacles and intelligently plots alternative paths in real-time.",
    icon: "radar",
    features: [
      "Ultrasonic distance detection",
      "Smart path planning",
      "360° awareness",
      "Collision prevention"
    ]
  },
  {
    id: 3,
    name: "Line Following",
    description: "Precise path tracking using IR sensors. Perfect for automated delivery routes and predefined navigation patterns.",
    icon: "route",
    features: [
      "IR sensor array",
      "PID control algorithm",
      "High-speed tracking",
      "Sharp turn handling"
    ]
  }
];

export const technicalSpecs = {
  microcontroller: {
    name: "Arduino Uno R3",
    specs: "ATmega328P, 16MHz, 32KB Flash"
  },
  sensors: [
    { name: "Ultrasonic Sensor", model: "HC-SR04", purpose: "Distance measurement" },
    { name: "IR Sensors", model: "TCRT5000", purpose: "Line detection" },
    { name: "Bluetooth Module", model: "HC-05", purpose: "Wireless control" }
  ],
  motors: {
    type: "DC Gear Motors",
    driver: "L298N Motor Driver",
    voltage: "6-12V"
  },
  power: {
    battery: "Li-ion 7.4V 2200mAh",
    runtime: "45-60 minutes"
  },
  dimensions: {
    length: "25cm",
    width: "18cm",
    weight: "450g"
  }
};

export const galleryImages = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800",
    title: "Front View",
    description: "Complete assembly with sensors mounted"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800",
    title: "Circuit Board",
    description: "Arduino and motor driver integration"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800",
    title: "Obstacle Avoidance Test",
    description: "Autonomous navigation in action"
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800",
    title: "Line Following Demo",
    description: "Precision path tracking"
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800",
    title: "Side Profile",
    description: "Compact design overview"
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800",
    title: "Control Interface",
    description: "Mobile app control demonstration"
  }
];

export const projectInfo = {
  developer: "Your Name",
  github: "https://github.com/yourusername/trimode-car",