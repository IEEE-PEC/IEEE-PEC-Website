# Contributing to IEEE PEC Student Branch Website ⚡

Thank you for your interest in contributing to the **IEEE PEC Student Branch official website**! This guide provides formal instructions for students, maintainers, and web team contributors to maintain code quality and streamline updates.

---

## 📋 Table of Contents
1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Project Architecture](#project-architecture)
4. [How to Update Content](#how-to-update-content)
   - [Adding / Updating Events](#adding--updating-events)
   - [Adding / Updating Projects](#adding--updating-projects)
   - [Updating Learning Resources](#updating-learning-resources)
   - [Updating Executive Team](#updating-executive-team)
5. [Development Workflow & Git Guidelines](#development-workflow--git-guidelines)
6. [CI/CD & Deployment](#cicd--deployment)

---

## 🤝 Code of Conduct
We are committed to providing a welcoming, inclusive, and collaborative environment for all engineering students and contributors. Please remain respectful, constructive, and helpful across all discussions and pull requests.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: `v18.17.0` or higher (Node 20 LTS recommended)
- **npm**: `v9.0.0` or higher
- **Git**

### 2. Local Setup
```bash
# Clone the repository
git clone git@github.com:IEEE-PEC/IEEE-PEC-Website.git
cd IEEE-PEC-Website

# Install all dependencies
npm install

# Start the local development server
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🏛️ Project Architecture

This application is built with **Next.js (Pages Router)** and configured for static export (`output: 'export'`):
- **`src/pages/`**: Next.js route pages (`index.tsx`, `chapters/`, `team/`, `project/`, `events/`, `resources/`, `contact/`, `apply.tsx`, `admin/`).
- **`src/components/`**: Reusable modular UI components (Hero, Cards, Headers, Footers, Modals).
- **`src/data/`**: Centralized, strongly-typed JSON/TypeScript data models powering all pages without requiring a live backend.
- **`src/types/`**: TypeScript interfaces and type definitions (`index.d.ts`).
- **`public/images/`**: Static images, real event photos, and chapter logos.

---

## 📝 How to Update Content

All website content is managed through structured TypeScript files in `src/data/`. To add or edit information, update the relevant file below:

### 1. Adding / Updating Events (`src/data/events_data.ts`)
Add a new object to `eventsData`:
```typescript
{
  id: "unique-event-id",
  title: "Event Title",
  category: "Workshop" | "Competition" | "Flagship" | "Guest Lecture" | "Orientation",
  description: "Short 1-2 sentence summary displayed on the card.",
  longDescription: "Detailed markdown description shown inside the modal dialog.",
  capacity: 150,
  registrationOpen: true,
  registrationLink: "/apply", // or external Google Form link
  image: "/images/events/your-photo.jpeg", // Place image in public/images/events/
}
```

### 2. Adding / Updating Projects (`src/data/projects_data.ts`)
Add a new object to `projectsData`:
```typescript
{
  id: "project-slug",
  title: "Project Name",
  description: "Brief summary of what the system does.",
  longDescription: "In-depth overview covering mechanical design, firmware, and impact.",
  category: "Robotics & AI" | "Web & Cloud" | "IoT & Embedded" | "Power & Energy",
  technologies: ["ESP32", "ROS 2", "Python", "EasyEDA"],
  image: "/images/projects/your-photo.jpeg",
  githubUrl: "https://github.com/IEEE-PEC/repo-name",
  demoUrl: "https://demo-link.com", // optional
  status: "Completed" | "In Progress",
  featured: true,
}
```

### 3. Updating Learning Resources (`src/data/resources_data.ts`)
Add new toolkits, cheat sheets, or roadmaps:
```typescript
{
  id: "resource-id",
  title: "Resource Title",
  category: "Roadmap" | "Documentation" | "Cheatsheet" | "Research" | "Tool",
  description: "What students will learn from this resource.",
  url: "https://external-resource-link.com",
  tags: ["ROS 2", "Robotics", "Navigation"],
  featured: false,
}
```

### 4. Updating Executive Team (`src/data/team_details.ts`)
Update the annual executive committee roster:
```typescript
{
  id: "exec-role-name",
  name: "Full Name",
  role: "Secretary" | "Assistant Secretary" | "Web & IT Mentor" | ...,
  category: "lead" | "technical" | "hardware" | "executive",
  chapter: "IEEE Core" | "CS" | "PES" | "WIE",
  image: "/images/team/member.jpeg",
  description: "Domain responsibilities and initiatives.",
  department: "Branch / Discipline",
  year: "2026–2027 Executive Board",
}
```

---

## 🌿 Development Workflow & Git Guidelines

1. **Create a Feature Branch:**
   ```bash
   git checkout -b feature/add-new-workshop
   # or
   git checkout -b fix/footer-link-typo
   ```

2. **Test Locally Before Committing:**
   ```bash
   # Run TypeScript type check
   npx tsc --noEmit

   # Verify static production build
   npm run build
   ```

3. **Commit with Clear Conventional Commit Messages:**
   - `feat: add AI/ML hackathon to events calendar`
   - `fix: correct typo in PES chapter description`
   - `docs: update resources with new KiCad roadmap`

4. **Submit a Pull Request:**
   - Push your branch to GitHub and open a Pull Request against `main`.
   - Ensure the automated GitHub Actions CI build passes.

---

## 🚢 CI/CD & Deployment

- The repository uses **GitHub Actions (`.github/workflows/deploy.yml`)** to automatically build and deploy static pages to **GitHub Pages**.
- Every push to `main` triggers a build that outputs pre-rendered HTML/CSS/JS to `./out` and publishes it without requiring any live backend server.

---

## 💙 Questions or Support?
For any queries, please reach out to the **Web & IT Team** via [ieee.pecsb@gmail.com](mailto:ieee.pecsb@gmail.com) or open a GitHub Issue.
