import { ProjectType } from "@/types";

export const projectsData: ProjectType[] = [
  {
    id: "gripper-bot",
    title: "Mechanical Gripper Bot",
    description: "Precision object manipulation robot utilizing custom motorized claw linkages and multi-axis articulation showcased at the Global Alumni Meet.",
    longDescription: `
Developed by the **IEEE PEC Hardware Team**, the Gripper Bot is designed for accurate pick-and-place industrial operations.
- **Mechanism:** Dual-jaw servo-driven mechanical gripper with feedback sensors for delicate object handling.
- **Control:** Microcontroller-driven PWM servo sequencing with joystick teleoperation.
- **Showcase:** Displayed during the Global Alumni Meet Technical Exhibition, receiving enthusiastic acclaim from industry alumni.
    `,
    category: "Robotics & AI",
    technologies: ["Servo SG90 / MG996R", "Arduino", "PWM Control", "Mechanical Linkages", "EasyEDA"],
    image: "/images/events/bot-making.jpeg",
    githubUrl: "https://github.com/IEEE-PEC",
    team: [],
    status: "Completed",
    featured: true,
  },
  {
    id: "terrain-mapping-drone",
    title: "Terrain Mapping & Surveying Drone",
    description: "Quad-rotor UAV equipped with telemetry sensors and aerial imaging to capture, process, and map geographical terrain data for agriculture and survey analysis.",
    longDescription: `
The **Terrain Mapping Drone** was built for aerial surveying and spatial analysis.
- **Features:** High-resolution camera payload, onboard barometer/altitude sensors, and GPS waypoint navigation.
- **Applications:** Precision agriculture, campus terrain modeling, and disaster management data collection.
- **Exhibition:** Featured in the Tech-Display for visiting alumni and freshers orientation.
    `,
    category: "Robotics & AI",
    technologies: ["UAV Avionics", "Flight Controllers", "GPS Telemetry", "Computer Vision", "Python"],
    image: "/images/projects/drone-system.jpeg",
    githubUrl: "https://github.com/IEEE-PEC",
    team: [],
    status: "Completed",
    featured: true,
  },
  {
    id: "rc-hovercraft",
    title: "Air-Cushion RC Hovercraft",
    description: "Multi-surface amphibious vehicle utilizing twin brushless motors for aerostatic lift and vectored thrust propulsion.",
    longDescription: `
Designed for the Freshers Technical Display and hands-on demonstrations.
- **Lift System:** High-RPM ducted brushless fan generating an air-cushion beneath the skirt.
- **Thrust & Steering:** Rear propeller with aerodynamic rudder vanes controlled via 2.4GHz transmitter.
    `,
    category: "Robotics & AI",
    technologies: ["Brushless Motors", "ESC", "2.4GHz RF", "LiPo Power", "Aerodynamics"],
    image: "/images/events/drone-competition.jpeg",
    githubUrl: "https://github.com/IEEE-PEC",
    team: [],
    status: "Completed",
    featured: false,
  },
  {
    id: "gaming-video-website",
    title: "Interactive Gaming Web Platform (Video Integration)",
    description: "Full-stack web application featuring multiplayer game mechanics, live video interactions, and responsive UI developed by the CS Chapter.",
    longDescription: `
Built by the **IEEE Computer Society (CS) Chapter**, this platform provides interactive gaming rooms with real-time video streaming overlays for player engagement during online events and hackathons.
    `,
    category: "Web & Cloud",
    technologies: ["React", "JavaScript", "WebRTC", "CSS3", "Node.js"],
    image: "/images/chapters/cs-banner.png",
    githubUrl: "https://github.com/IEEE-PEC",
    team: [],
    status: "Completed",
    featured: false,
  },
  {
    id: "hack-o-meme-platform",
    title: "Hack-O-Meme Generator & Software Suite",
    description: "Creative developer tool and web software suite combining coding culture, humorous templates, and tech trivia built for PECFEST.",
    longDescription: `
Developed for the **Hack-O-Meme** event at PECFEST, enabling participants to create, caption, and vote on coding memes, logical debugging jokes, and campus engineering life.
    `,
    category: "Web & Cloud",
    technologies: ["JavaScript", "HTML5 Canvas", "Tailwind CSS", "Next.js"],
    image: "/images/hero/hero-bots.jpeg",
    githubUrl: "https://github.com/IEEE-PEC",
    team: [],
    status: "Completed",
    featured: false,
  },
  {
    id: "water-rocket-system",
    title: "Pneumatic Water Rocket Launch System",
    description: "Pressurized aerodynamic water rocket system demonstrating fluid dynamics, nozzle design, and parabolic trajectory physics.",
    longDescription: `
A practical mechanics demonstration project built for freshers orientation to exhibit propellant physics and pressure release valves.
    `,
    category: "IoT & Embedded",
    technologies: ["Fluid Mechanics", "Pressure Regulators", "Aerodynamics"],
    image: "/images/events/hardware-workshop.jpg",
    githubUrl: "https://github.com/IEEE-PEC",
    team: [],
    status: "Completed",
    featured: false,
  },
];
