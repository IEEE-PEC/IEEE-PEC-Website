import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAssetPath(path: string): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${basePath}${normalizedPath}`;
}

export const teamCategoryOptions = [
  { value: "lead", label: "Executive Board" },
  { value: "technical", label: "Technical & CS" },
  { value: "hardware", label: "Hardware & PES" },
  { value: "executive", label: "WIE & Mentors" },
  { value: "pr", label: "Event Operations" },
];

export const chapterOptions = [
  { value: "all", label: "All Chapters" },
  { value: "PES", label: "IEEE Power & Energy Society (PES)" },
  { value: "CS", label: "IEEE Computer Society (CS)" },
  { value: "WIE", label: "IEEE Women in Engineering (WIE)" },
];

export const projectCategoryOptions = [
  { value: "all", label: "All Categories" },
  { value: "Robotics & AI", label: "Robotics & Hardware Bots" },
  { value: "Web & Cloud", label: "Web & Software Tools" },
  { value: "IoT & Embedded", label: "Aerodynamics & Systems" },
];

export const inventoryCategoryOptions = [
  { value: "all", label: "All Components" },
  { value: "Microcontroller", label: "Microcontrollers & Dev Boards" },
  { value: "Sensor", label: "Sensors & Detectors" },
  { value: "Actuator", label: "Motors & Actuators" },
  { value: "Power", label: "Power & Batteries" },
  { value: "Communication", label: "Wireless & Communication" },
  { value: "Tool", label: "Tools & Equipment" },
  { value: "Component", label: "Passives & ICs" },
  { value: "Other", label: "Mechanical & Accessories" },
];

export const eventCategoryOptions = [
  { value: "all", label: "All Events" },
  { value: "Flagship", label: "Techadroit Flagship" },
  { value: "Competition", label: "PECFEST & Robo-Soccer" },
  { value: "Workshop", label: "Hands-On Workshops" },
  { value: "Guest Lecture", label: "Speaker Sessions" },
  { value: "Orientation", label: "Orientation & Awards" },
];

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateString;
  }
}
