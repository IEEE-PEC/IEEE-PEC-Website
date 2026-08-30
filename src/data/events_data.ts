import { EventType } from "@/types";

export const eventsData: EventType[] = [
  {
    id: "techadroit-flagship",
    title: "Techadroit: Flagship Technical Symposium",
    category: "Flagship",
    description: "The 3-day annual flagship technical festival of IEEE PEC Student Branch featuring multi-track software hackathons, competitive programming, and emerging technology webinars.",
    longDescription: `
**Techadroit** is the hallmark annual technical symposium organized by the IEEE PEC Student Branch.
- A 3-day amalgamation of competitive coding challenges, webinars, and hands-on workshops covering emerging domains such as Artificial Intelligence, Web3, VR, and the Metaverse.
- Engages students across the entire northern region to transition theoretical engineering principles into competitive, real-world solutions.
    `,
    capacity: 800,
    registrationOpen: true,
    registrationLink: "/apply",
    image: "/images/events/lecture-session.jpeg",
  },
  {
    id: "pecfest-robosoccer",
    title: "PECFEST Robo-Soccer Championship",
    category: "Competition",
    description: "High-voltage inter-college robot soccer arena tournament with 19 competing teams in 1kg (Speed & Agility) and 3kg (High Torque & Robust Control) knockout brackets.",
    longDescription: `
Organized by **IEEE PEC Student Branch** during PECFEST:
- **Participation:** 19 teams from leading universities (PEC, LPU, SLIET).
- **Categories:** 1 kg lightweight division focusing on speed and agile striking, and 3 kg heavyweight division emphasizing robust mechanical design and advanced motor control.
    `,
    capacity: 500,
    registrationOpen: false,
    image: "/images/events/robosoccer-match.jpeg",
  },
  {
    id: "hands-on-hardware-workshop",
    title: "Hands-On Hardware & PCB Design Workshop",
    category: "Workshop",
    description: "Practical electronics session by PES Chapter on circuit building, troubleshooting, EasyEDA, TinkerCAD, and multimeter diagnostics for 100+ students.",
    longDescription: `
Conducted by the **PES Chapter**:
- Practical circuit building, breadboard prototyping, resistor color coding, and capacitor types.
- Schematic capture and layout simulation in **EasyEDA** and **TinkerCAD**.
- Hands-on multimeter diagnostics and hardware debugging.
    `,
    capacity: 120,
    registrationOpen: false,
    image: "/images/events/hardware-workshop.jpg",
  },
  {
    id: "intro-programming-cs",
    title: "Introduction to Programming & Algorithm Design",
    category: "Workshop",
    description: "CS Chapter workshop training 120+ students on C++, Object-Oriented Programming (OOPS), pointers, and competitive programming techniques.",
    longDescription: `
Led by the **CS Chapter**:
- Comprehensive coverage of C++ syntax, Functions, Classes, Arrays, Pointers, and OOP principles.
- Competitive programming strategies on platforms like HackerRank.
- Attended by over 120 enthusiastic engineering students.
    `,
    capacity: 150,
    registrationOpen: false,
    image: "/images/chapters/cs-banner.png",
  },
  {
    id: "bot-making-workshop",
    title: "Hands-on Bot-Making Workshop: Robo-Race & Robo-Soccer",
    category: "Workshop",
    description: "Intensive robotics sprint where participants assembled, wired, and operated speed bots and combat soccer robots for inter-college events.",
    longDescription: `
A comprehensive hands-on workshop:
- Students assembled mechanical chassis, connected motor drivers, and implemented RF teleoperation.
- Promoted teamwork and problem-solving through real-time test matches on the Robo-Race track and Robo-Soccer turf.
    `,
    capacity: 140,
    registrationOpen: false,
    image: "/images/events/bot-making.jpeg",
  },
  {
    id: "pecfest-bug-busters",
    title: "PECFEST: Bug-Busters & The Silicon Social",
    category: "Competition",
    description: "Analytical debugging sprint fixing complex code errors paired with 'The Silicon Social' student networking mixer and 'Hack-O-Meme'.",
    longDescription: `
Organized as part of PECFEST:
- **Bug-Busters:** Tested participants' analytical and logical abilities to trace and rectify tricky software bugs under time pressure.
- **The Silicon Social:** An interactive informal networking gathering fostering connections among tech enthusiasts.
- **Hack-O-Meme:** Combining coding culture with creative developer humor.
    `,
    capacity: 300,
    registrationOpen: false,
    image: "/images/hero/hero-bots.jpeg",
  },
  {
    id: "aiml-workshop",
    title: "Introduction to Artificial Intelligence & Machine Learning (AI/ML)",
    category: "Workshop",
    description: "Foundational AI/ML bootcamp covering supervised and unsupervised learning, neural network architectures, and real-world deployment frameworks.",
    longDescription: `
Bridged theoretical concepts with hands-on practice:
- Supervised/unsupervised algorithms, neural network design, and popular Python frameworks.
- Interactive demonstrations of AI model training and deployment.
    `,
    capacity: 180,
    registrationOpen: false,
    image: "/images/hero/hero-crowd.jpeg",
  },
  {
    id: "buddha-super-scientist",
    title: "Speaker Session: 'Buddha: The Super Scientist'",
    category: "Guest Lecture",
    description: "Invited lecture by Shri Jasbir Singh, Vipassana meditator & former Executive Director (Ministry of Housing & Urban Affairs) on mindfulness and the science of the human mind.",
    longDescription: `
Delivered at Dhyan Kendra:
- Explored the scientific and logical aspects of self-observation, mindfulness, and mental clarity.
- Included a guided Vipassana meditation session for students to improve focus and academic well-being.
    `,
    capacity: 200,
    registrationOpen: false,
    image: "/images/events/lecture-session.jpeg",
  },
  {
    id: "outstanding-branch-award",
    title: "Outstanding Student Branch Award Celebration",
    category: "Orientation",
    description: "Honored with the Outstanding Student Branch Award at the Annual General Meeting (AGM) of the IEEE Chandigarh Subsection.",
    longDescription: `
IEEE PEC Student Branch was officially conferred the prestigious **Outstanding Student Branch Award** in recognition of its exemplary performance, technical workshops, and community leadership throughout the academic year.
    `,
    capacity: 100,
    registrationOpen: false,
    image: "/images/events/award-ceremony.jpg",
  },
];
