import { SetStateAction } from "react";

export type InventoryCategory =
  | "Microcontroller"
  | "Sensor"
  | "Actuator"
  | "Power"
  | "Tool"
  | "Component"
  | "Communication"
  | "Other";

export interface InventoryItem {
  id: number;
  item_name: string;
  category: InventoryCategory;
  quantity: number;
  min_quantity: number;
  description: string;
  created_at?: string;
  status?: "available" | "low_stock" | "out_of_stock";
}

export interface InventoryTransaction {
  id: number;
  item_id: number;
  item_name?: string;
  borrowed_by: string;
  quantity: number;
  transaction_type: "Borrow" | "Return";
  purpose: string;
  transaction_date: string;
}

export interface TeamMemberDetails {
  role: string;
  domain?: string;
  chapter?: "IEEE Core" | "CS" | "WIE" | "PES";
  description: string;
  location?: string;
  year?: string;
  branch?: string;
  socials?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    email?: string;
    website?: string;
  };
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  category: "lead" | "executive" | "technical" | "web" | "hardware" | "design" | "pr";
  chapter?: "IEEE Core" | "CS" | "WIE" | "PES";
  image: string;
  description?: string;
  department?: string;
  year?: string;
  socials?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    email?: string;
    website?: string;
  };
}

export interface ChapterDetails {
  id: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  icon: string;
  color: string;
  logoImage?: string;
  lead?: string;
  leadRole?: string;
  leadImage?: string;
  bannerImage: string;
  stats: {
    members: string;
    workshops: string;
    projects: string;
  };
  focusAreas: string[];
  featuredProjects: string[];
}

export interface ProjectType {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: "IoT & Embedded" | "Robotics & AI" | "Power & Energy" | "Web & Cloud" | "VLSI & Hardware";
  technologies: string[];
  image: string;
  githubUrl?: string;
  demoUrl?: string;
  team?: string[];
  status: "Completed" | "In Progress" | "Research Phase";
  date?: string;
  featured?: boolean;
}

export interface EventType {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  category: "Workshop" | "Hackathon" | "Guest Lecture" | "Competition" | "Orientation" | "Flagship";
  date?: string;
  time?: string;
  location?: string;
  capacity?: number;
  registrationOpen?: boolean;
  registrationLink?: string;
  image?: string;
  speakers?: {
    name: string;
    role: string;
    company: string;
    image?: string;
  }[];
}

export interface ResourceType {
  id: string;
  title: string;
  category: "Roadmap" | "Documentation" | "Cheatsheet" | "Research" | "Tool";
  description: string;
  url: string;
  tags: string[];
  featured?: boolean;
}

export interface HeroType {
  heading: string;
  subheading?: string;
  description: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface ApplicantType {
  id: string;
  name: string;
  sid: string;
  email: string;
  phone: string;
  branch: string;
  year: "1st Year" | "2nd Year" | "3rd Year";
  chapters: string[];
  domains: string[];
  technicalSkills?: string;
  pastExperience?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  motivation: string;
  status: "pending" | "accepted" | "interviewed" | "rejected";
  rating?: number;
  remarks?: string;
  createdAt: string;
}

export interface PanelistType {
  id: string;
  name: string;
  email: string;
  panelNumber: number;
  isOccupied: boolean;
  lastUpdated: string;
}
