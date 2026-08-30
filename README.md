# IEEE PEC Student Branch Official Website ⚡

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![GitHub Actions](https://img.shields.io/badge/CI%2FCD-GitHub_Pages-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)](https://github.com/IEEE-PEC/IEEE-PEC-Website/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

The official web platform for the **IEEE Student Branch at Punjab Engineering College (Deemed to be University), Chandigarh**. Built from the ground up as a blazing-fast, modern, mobile-responsive static web application with Next.js, TypeScript, and Tailwind CSS.

---

## 🌐 Live Website & Links

- **Repository:** [https://github.com/IEEE-PEC/IEEE-PEC-Website](https://github.com/IEEE-PEC/IEEE-PEC-Website)
- **Official PEC Portal:** [https://pec.ac.in/ieee](https://pec.ac.in/ieee)
- **LinkedIn:** [https://www.linkedin.com/company/ieee-pec/](https://www.linkedin.com/company/ieee-pec/)
- **Instagram Handle:** [@ieeepec](https://www.instagram.com/ieeepec)
- **Behind The Scenes:** [@ieee.bts](https://www.instagram.com/ieee.bts)
- **Official Emails:** [ieee.pecsb@gmail.com](mailto:ieee.pecsb@gmail.com) • [ieee@pec.edu.in](mailto:ieee@pec.edu.in)

---

## 🛠️ Complete Tech Stack

| Category | Technologies / Libraries |
|---|---|
| **Core Framework** | [Next.js](https://nextjs.org/) (Pages Router) with Full Static Site Generation (`output: 'export'`) |
| **UI Library** | [React 18](https://react.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) for strict type safety |
| **Styling & Design System** | [Tailwind CSS](https://tailwindcss.com/), PostCSS, Autoprefixer |
| **UI Component Primitives** | [Radix UI](https://www.radix-ui.com/) (Dialogs, Tabs, Accordions, Dropdown Menus, Popovers, Tooltips) |
| **Icons & Typography** | [Lucide React](https://lucide.dev/) + Plus Jakarta Sans / Inter fonts |
| **Motion & Animations** | [Framer Motion](https://www.framer.com/motion/) for fluid cross-fading carousels & entrance transitions |
| **Notifications & Toast** | [Sonner](https://sonner.emilkowal.ski/) |
| **Utilities** | `clsx`, `tailwind-merge` for class composition |
| **CI / CD & Deployment** | GitHub Actions (`.github/workflows/deploy.yml`) deploying to GitHub Pages |

---

## 🚀 Key Features & Modules

### 1. 🏛️ Specialized Societies & Chapters
Showcases IEEE PEC's 3 distinct technical chapters in ordered structure:
1. **IEEE Power & Energy Society (PES):** Hardware bot making (1kg/3kg Robo-Soccer & Robo-Race), circuit troubleshooting, PCB layout (EasyEDA, TinkerCAD), and power electronics.
2. **IEEE Computer Society (CS):** Competitive programming, C++ OOPs fundamentals, AI/ML study bootcamps, Bug-Busters debugging contests, and web architecture.
3. **IEEE Women in Engineering (WIE):** Peer-to-peer mentorship networks, "Girls in Tech" school outreach, and diversity-in-STEM leadership initiatives.

### 2. 🤖 Innovations & Project Gallery ([/project](http://localhost:3000/project))
- Interactive project showcase including the **Mechanical Gripper Bot**, **Terrain Mapping Drone**, **Air-Cushion RC Hovercraft**, **Interactive Gaming Platform**, **Hack-O-Meme Generator**, and **Pneumatic Water Rocket System**.
- Clean presentation with category filters, technology badges, and architecture modal overviews.

### 3. 📅 Flagship Events & Competitions ([/events](http://localhost:3000/events))
- **Techadroit:** Flagship 3-day multi-track technical symposium.
- **PECFEST Robo-Soccer Championship:** Knockout robotics arena tournament across 1kg lightweight and 3kg heavyweight divisions.
- **Bootcamps & Workshops:** Hands-On Hardware & PCB Design, Intro to C++ Programming, and Bot-Making sprints.
- **Guest Lectures:** Special mindfulness & science sessions like *"Buddha: The Super Scientist"*.
- **Outstanding Student Branch Award Celebration:** Conferred by IEEE Chandigarh Subsection.

### 4. 📚 Curated Learning Resources & Roadmaps ([/resources](http://localhost:3000/resources))
- **Docify Knowledge Base:** Official multidisciplinary engineering docs covering CAD, electronics, firmware, ROS 2, and software.
- **Striver's A2Z DSA Sheet:** Comprehensive Data Structures & Algorithms curriculum from beginner to advanced graphs and dynamic programming.
- **roadmap.sh Interactive Paths:** Computer Science, Frontend, Backend, AI/Data Science, and DevOps roadmaps.
- **Hardware Guides:** ROS 2 Humble Navigation, KiCad 8 PCB design cheatsheet, and IEEE Xplore LaTeX research paper publishing manuals.

### 5. 👥 2026–2027 Executive Committee ([/team](http://localhost:3000/team))
- Dedicated leadership directory for the 2026–2027 executive board featuring **Shashwat Mishra** (Secretary), **Pratyush Kumar** (Web & IT Mentor), **Aryan Mahendru** (Assistant Secretary), and **Ansh Agnihotry** (Assistant Joint Secretary).
- Uniform, stylized gradient initials avatar placeholders with crisp typography.

### 6. 📝 Recruitment & Membership Portal ([/apply](http://localhost:3000/apply))
- Comprehensive student membership application system with chapter preferences (PES, CS, WIE), domain tracks, and portfolio submissions.

### 7. 🔒 Secure Staff Portal & Admin Console ([/admin](http://localhost:3000/admin))
- Passcode-authenticated management console to track hardware catalog components, project entries, event schedules, and branch activities.

---

## 📁 Repository Directory Structure

```plaintext
IEEE-PEC-Website/
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated GitHub Pages CI/CD workflow
├── public/
│   └── images/
│       ├── chapters/           # PES, CS, and WIE real banners
│       ├── docs/               # Real assets from Annual Report
│       ├── events/             # Real event & Robo-Soccer match photos
│       ├── hero/               # Orientation crowd, bot making & arena photos
│       ├── logos/              # Real IEEE, PES, CS, and WIE logos
│       └── ppt/                # Extracted media from orientation deck
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Footer.tsx      # Global footer with social links & credits
│   │   │   ├── Header.tsx      # Navigation bar with real brand emblem
│   │   │   ├── Loader.tsx      # Page loading spinner
│   │   │   ├── PageHead.tsx    # Dynamic SEO metadata & OpenGraph tags
│   │   │   └── PageLayout.tsx  # Wrapper layout component
│   │   ├── ui/                 # Accessible Radix UI + Tailwind components
│   │   ├── ChaptersSection.tsx # 3-Chapter home showcase with real logos
│   │   ├── EventCard.tsx       # Event card with category badges
│   │   ├── Hero.tsx            # Animated cross-fade hero carousel
│   │   ├── InventoryCatalog.tsx# Hardware inventory catalog
│   │   ├── ProjectCard.tsx     # Clean project cards & detail modal
│   │   ├── StatsSection.tsx    # Live branch stats counters
│   │   └── TeamMemberCard.tsx  # Executive team card with avatar initials
│   ├── data/
│   │   ├── chapters_data.ts    # PES, CS, and WIE chapter details & logos
│   │   ├── events_data.ts      # Techadroit, PECFEST, and workshops
│   │   ├── inventory_data.ts   # Hardware lab components catalog
│   │   ├── projects_data.ts    # Student engineering innovations
│   │   ├── resources_data.ts   # Docify, Striver DSA sheet, roadmap.sh
│   │   └── team_details.ts     # 2026–2027 Executive Board roster
│   ├── lib/
│   │   ├── supabase/           # Supabase client helper
│   │   └── utils.ts            # Class merging & utility constants
│   ├── pages/
│   │   ├── index.tsx           # Home Landing Page
│   │   ├── chapters/index.tsx  # Specialized Chapters (PES, CS, WIE)
│   │   ├── team/index.tsx      # 2026–2027 Executive Committee
│   │   ├── project/index.tsx   # Engineering Innovations Gallery
│   │   ├── events/index.tsx    # Events & Workshops Directory
│   │   ├── resources/index.tsx # Roadmaps, Docify & Learning Toolkits
│   │   ├── apply.tsx           # Student Auditions & Application Form
│   │   ├── contact.tsx         # Contact Form & Official Channels
│   │   ├── inventory/index.tsx # Hardware Lab Portal (Admin Restricted)
│   │   ├── admin/index.tsx     # Unified Staff Console
│   │   ├── 404.tsx             # 404 Custom Error Page
│   │   ├── _app.tsx            # Global App Shell & Font Config
│   │   └── _document.tsx       # HTML Document Structure
│   ├── styles/
│   │   └── globals.css         # IEEE Blue theme tokens & CSS animations
│   └── types/
│       └── index.d.ts          # TypeScript type declarations
├── next.config.ts              # Next.js static export configuration (`output: 'export'`)
├── tailwind.config.ts          # Tailwind theme colors & extensions
├── tsconfig.json               # TypeScript compiler config
└── package.json                # Project dependencies & scripts
```

---

## 💻 Local Development Setup

### Prerequisites
- **Node.js**: `v18.17.0` or higher
- **npm** / **yarn** / **pnpm**

### Step-by-Step Guide

```bash
# 1. Clone the repository
git clone git@github.com:IEEE-PEC/IEEE-PEC-Website.git

# 2. Navigate to the project directory
cd IEEE-PEC-Website

# 3. Install dependencies
npm install

# 4. Start the local development server
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🏗️ Production Build & Static Export

To build the project for static hosting (e.g. GitHub Pages, Vercel, Netlify, or Apache/Nginx):

```bash
# Generate the optimized static production export in the `out/` directory
npm run build
```

The output will be generated in the `out/` folder, ready for instant static delivery.

---

## 🚢 Continuous Deployment (GitHub Pages)

This repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically builds and deploys the website on every push to the `main` branch:

1. Push your changes to the `main` branch.
2. In your GitHub repository, go to **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. The deployment pipeline will automatically run and publish the website live!

---

## 💙 Author & Maintainer

Designed & Developed with 💙 by **[Pratyush Kumar](https://github.com/pratstick)** (Web & IT Mentor, IEEE PEC Student Branch).

Maintained by the **IEEE PEC Student Branch Web & Tech Team**.

---

## 📄 License

This project is open-source and distributed under the [MIT License](LICENSE).
