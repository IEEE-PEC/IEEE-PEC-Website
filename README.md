# IEEE PEC Student Branch Official Website ⚡

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

The official web platform & audition portal for the **IEEE Student Branch at Punjab Engineering College (Deemed to be University), Chandigarh**. Built from the ground up as a blazing-fast, modern, mobile-responsive web application with Next.js, TypeScript, Tailwind CSS, and Supabase.

---

## 🌐 Live Website & Links

- **Live Production Website:** [https://ieeepec.vercel.app](https://ieeepec.vercel.app)
- **GitHub Repository:** [https://github.com/IEEE-PEC/IEEE-PEC-Website](https://github.com/IEEE-PEC/IEEE-PEC-Website)
- **Official PEC Portal:** [https://pec.ac.in/ieee](https://pec.ac.in/ieee)
- **LinkedIn:** [https://www.linkedin.com/company/ieee-pec/](https://www.linkedin.com/company/ieee-pec/)
- **Instagram Handle:** [@ieeepec](https://www.instagram.com/ieeepec)
- **Behind The Scenes:** [@ieee.bts](https://www.instagram.com/ieee.bts)
- **Official Emails:** [ieee.pecsb@gmail.com](mailto:ieee.pecsb@gmail.com) • [ieee@pec.edu.in](mailto:ieee@pec.edu.in)

---

## 🛠️ Complete Tech Stack

| Category | Technologies / Libraries |
|---|---|
| **Core Framework** | [Next.js 15](https://nextjs.org/) (Pages Router) with Static Export & Client-Side Runtime |
| **UI Library** | [React 18](https://react.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) for strict type safety |
| **Styling & Design System** | [Tailwind CSS 3.4](https://tailwindcss.com/), PostCSS, Autoprefixer |
| **UI Component Primitives** | [Radix UI](https://www.radix-ui.com/) & [shadcn/ui](https://ui.shadcn.com/) (Dialogs, Tabs, Accordions, Dropdown Menus, Popovers, Tooltips) |
| **Icons & Typography** | [Lucide React](https://lucide.dev/) + Plus Jakarta Sans / Inter fonts |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) for fluid cross-fading carousels & transitions |
| **Notifications & Toast** | [Sonner](https://sonner.emilkowal.ski/) |
| **Backend / Database** | [Supabase](https://supabase.com/) (PostgreSQL, Google OAuth, Storage Buckets & RLS) |
| **Hosting & CD** | [Vercel](https://vercel.com/) Auto-Deployment from `main` branch |

---

## 🚀 Key Features & Modules

### 1. 🏛️ Specialized Societies & Chapters ([/chapters](https://ieeepec.vercel.app/chapters))
Showcases IEEE PEC's 3 distinct technical chapters:
1. **IEEE Power & Energy Society (PES):** Hardware bot fabrication (1kg/3kg Robo-Soccer & Robo-Race), circuit troubleshooting, PCB layout (EasyEDA, TinkerCAD), and power electronics.
2. **IEEE Computer Society (CS):** Competitive programming, C++ OOPs fundamentals, AI/ML study bootcamps, Bug-Busters debugging contests, and web architecture.
3. **IEEE Women in Engineering (WIE):** Peer-to-peer mentorship networks, "Girls in Tech" school outreach, and diversity-in-STEM leadership initiatives.

### 2. 💻 WebDev & Core Team Directory ([/team](https://ieeepec.vercel.app/team))
- Showcases the WebDev team, Executive Board, and technical domain leads for 2026–2027.
- Supports photo uploads, avatar initials fallback, social links (GitHub, LinkedIn, Email, Website), and interactive category filtering (*All Members*, *Web & IT Team*, *Leadership*, *Executive Board*, *Technical Domain*, *Hardware & Bots*).

### 3. 🛡️ Staff Admin Dashboard ([/admin](https://ieeepec.vercel.app/admin))
Admin-only console for managing all website assets and candidate auditions:
- **Audition Results & Selection Release:** 1-click toggle to release or hold audition results, and update WhatsApp Community links.
- **WebDev & Core Team Management:** Add new team members via **`+ Add Member to WebDev Team`**, edit details, upload photos directly from your laptop, and manage roster categories.
- **Promote Members to Interviewer:** Search selected candidates from auditions and promote them to Interviewers with 1 click.
- **Portal User Management:** RBAC role controls (`pending`, `interviewer`, `admin`) with search & filter.

### 4. 📝 Auditions & Interview Portal ([/apply](https://ieeepec.vercel.app/apply) & [/interview](https://ieeepec.vercel.app/interview))
- **Student Applications (`/apply`):** Google OAuth sign-in (`@pec.edu.in`), SID auto-detection of academic year (1st, 2nd, 3rd), candidate status checking, and result announcement banners.
- **Interviewer Evaluation Console (`/interview`):** Scoring sheet across Technical, Communication, Confidence, and Teamwork criteria, recommendation system (`Select`, `Hold`, `Reject`), real-time evaluation sync, and walk-in candidate registration.

### 5. 🛠️ Lab Inventory Portal ([/inventory](https://ieeepec.vercel.app/inventory))
- Hardware catalog tracking microcontrollers, sensors, actuators, tools, and communication modules.
- Borrow/return logging system for student projects and bot fabrication.

### 6. 🤖 Innovations & Project Gallery ([/project](https://ieeepec.vercel.app/project))
- Interactive project showcase including **Mechanical Gripper Bot**, **Terrain Mapping Drone**, **Air-Cushion RC Hovercraft**, **Interactive Gaming Platform**, **Hack-O-Meme Generator**, and **Pneumatic Water Rocket System**.

### 7. 📅 Events & Workshop Management ([/events](https://ieeepec.vercel.app/events))
- Flagship symposiums (**Techadroit**), **PECFEST Robo-Soccer Championship**, C++ bootcamps, and guest lectures.
- Admin inline editing & photo upload directly on event cards.

---

## 📁 Repository Directory Structure

```plaintext
IEEE-PEC-Website/
├── public/
│   └── images/
│       ├── chapters/           # PES, CS, and WIE real banners & logos
│       ├── docs/               # Real assets from Annual Report
│       ├── events/             # Real event & Robo-Soccer match photos
│       ├── hero/               # Orientation crowd & bot-making photos
│       ├── logos/              # Real IEEE, PES, CS, and WIE logos
│       ├── projects/           # Bot and student innovation pictures
│       └── team/               # Executive committee portraits
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Footer.tsx      # Global footer with social links & credits
│   │   │   ├── Header.tsx      # Nav bar with Google Auth profile dropdown & dark mode toggle
│   │   │   ├── Loader.tsx      # Page loading spinner
│   │   │   ├── PageHead.tsx    # Dynamic SEO metadata & OpenGraph tags
│   │   │   └── PageLayout.tsx  # Wrapper layout component
│   │   ├── ui/                 # Accessible Radix UI + Tailwind components
│   │   ├── ChaptersSection.tsx # 3-Chapter home showcase with real logos
│   │   ├── EditEventDialog.tsx # Admin dialog for creating/editing events & photo uploads
│   │   ├── EditTeamMemberDialog.tsx # Admin dialog for WebDev team members & photo uploads
│   │   ├── EventCard.tsx       # Event card with category badges & admin edit trigger
│   │   ├── Hero.tsx            # Animated cross-fade hero carousel
│   │   ├── InventoryCatalog.tsx# Hardware inventory catalog component
│   │   ├── ProjectCard.tsx     # Clean project cards & detail modal
│   │   ├── StatsSection.tsx    # Live branch stats counters
│   │   └── TeamMemberCard.tsx  # Team member card with photos & social icons
│   ├── context/
│   │   └── ThemeContext.tsx    # Dark/Light theme state provider (localStorage backed)
│   ├── data/
│   │   ├── chapters_data.ts    # PES, CS, and WIE chapter details & logos
│   │   ├── events_data.ts      # Techadroit, PECFEST, and workshops
│   │   ├── inventory_data.ts   # Hardware lab components catalog
│   │   ├── projects_data.ts    # Student engineering innovations
│   │   ├── resources_data.ts   # Docify, Striver DSA sheet, roadmap.sh
│   │   └── team_details.ts     # 2026–2027 Executive Board roster
│   ├── hooks/
│   │   └── useAdmin.ts         # Hook to check if current user has admin role
│   ├── lib/
│   │   ├── supabase/
│   │   │   └── supabase.ts     # Supabase client helper
│   │   └── utils.ts            # Class merging & getAssetPath helpers
│   ├── pages/
│   │   ├── index.tsx           # Homepage
│   │   ├── admin/index.tsx     # Staff Admin Dashboard (Results, WebDev Team, Promotion, Roles)
│   │   ├── apply.tsx           # Audition Application Form & Candidate Results
│   │   ├── auth/callback.tsx   # Supabase OAuth redirect & auto-profile creation
│   │   ├── chapters/index.tsx  # Specialized Chapters (PES, CS, WIE)
│   │   ├── contact.tsx         # Contact Form & Official Channels
│   │   ├── events/index.tsx    # Events & Workshops Directory
│   │   ├── interview.tsx       # Senior Evaluation Console
│   │   ├── interview-login.tsx # Google OAuth Login Portal (@pec.edu.in)
│   │   ├── inventory/index.tsx # Lab Hardware Inventory Management
│   │   ├── pending.tsx         # Account Pending Approval Screen
│   │   ├── project/index.tsx   # Engineering Innovations Gallery
│   │   ├── resources/index.tsx # Learning Roadmaps & Toolkits
│   │   ├── team/index.tsx      # WebDev & Executive Leadership Page
│   │   ├── 404.tsx             # Custom 404 Error Page
│   │   ├── _app.tsx            # App Shell with Theme & Sonner Toast Providers
│   │   └── _document.tsx       # HTML Document Structure
│   ├── styles/
│   │   └── globals.css         # Tailwind directives & Midnight Cyber theme
│   └── types/
│       └── index.d.ts          # TypeScript interfaces (TeamMember, Event, etc.)
├── supabase/
│   └── schema.sql              # Supabase PostgreSQL schema with RLS policies
├── next.config.ts              # Next.js configuration (`output: 'export'`)
├── tailwind.config.ts          # Tailwind theme colors & extensions
├── tsconfig.json               # TypeScript compiler config
└── package.json                # Project dependencies & npm scripts
```

---

## 💻 Local Development Setup

### Prerequisites
- **Node.js**: `v18.17.0` or higher
- **npm** / **yarn** / **pnpm**
- **Supabase Account** with Google OAuth configured for `@pec.edu.in` domain.

### Step-by-Step Guide

```bash
# 1. Clone the repository
git clone https://github.com/IEEE-PEC/IEEE-PEC-Website.git

# 2. Navigate to the project directory
cd IEEE-PEC-Website

# 3. Install dependencies
npm install

# 4. Create .env.local file
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# 5. Start the local development server
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🏗️ Production Build & Vercel Deployment

To build the project for static hosting:

```bash
# Generate optimized production build
npm run build
```

Production commits pushed to `main` are automatically built and deployed by Vercel to **[https://ieeepec.vercel.app](https://ieeepec.vercel.app)**.

---

## 📄 License

This project is open-source and distributed under the [MIT License](LICENSE).
