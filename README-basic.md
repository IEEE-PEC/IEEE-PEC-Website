# IEEE PEC Student Branch Website — Complete Developer Guide

Welcome to the official repository for the **IEEE Student Branch at Punjab Engineering College (PEC), Chandigarh** website and audition portal.

This guide provides a comprehensive technical reference for the website's architecture, technology stack, directory structure, component library, routing, backend integration, and local setup instructions.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | [Next.js 15 (Pages Router)](https://nextjs.org/) | React framework with static export and client-side page routing |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Type-safe application development |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com/) | Utility-first responsive CSS styling with dark mode support |
| **UI Components** | [Radix UI](https://www.radix-ui.com/) & [shadcn/ui](https://ui.shadcn.com/) | Accessible UI primitives (Dialog, Popover, Sheet, Tabs, Accordion, etc.) |
| **Icons** | [Lucide React](https://lucide.dev/) | SVG icon set for navigation, buttons, and badges |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) | Carousel transitions and interactive entrance effects |
| **Notifications** | [Sonner](https://sonner.emilkowal.ski/) | Lightweight toast notification system |
| **Backend / Database** | [Supabase](https://supabase.com/) | PostgreSQL database, Authentication (Google OAuth), Storage, and Row-Level Security |
| **Deployment** | [Vercel](https://vercel.com/) | Global edge hosting with fast static delivery and auto-deploy from `main` |

---

## ⚡ Key Pages & Routes

| Route | Name | Description |
|---|---|---|
| `/` | **Homepage** | Hero carousel, branch overview, live stats counter, chapters showcase, featured projects & events |
| `/chapters` | **Chapters** | Dedicated overview of Computer Society (CS), Power & Energy (PES), and Women in Engineering (WIE) |
| `/project` | **Projects** | Showcase of Robo-Soccer bots, IoT weather stations, RC hovercrafts, and web platforms |
| `/events` | **Events** | Comprehensive event archive with category filters and inline admin editing controls |
| `/resources` | **Resources** | Curated roadmaps for C++, ROS 2, Embedded Systems, Web Development, and PCB design |
| `/team` | **WebDev & Core Team** | Executive committee and technical leads with photo gallery, social links, and category filters |
| `/contact` | **Contact Us** | Direct query submission form and branch office location |
| `/apply` | **Apply & Audition Portal** | Candidate application form, PEC SID year detection, audition status, and published results |
| `/interview-login`| **Login** | Google OAuth login portal restricted to official PEC accounts (`@pec.edu.in`) |
| `/interview` | **Interview Evaluation** | Candidate evaluation scoring sheet and recruitment pipeline for authorized interviewers |
| `/admin` | **Admin Dashboard** | Results release toggle, WebDev team management & photo uploads, member promotion, and user role controls |
| `/inventory` | **Lab Inventory** | Hardware catalog & electronic component borrowing management |

---

## 📂 Project Directory Structure

```
IEEE-PEC-Website/
├── public/                     # Static assets (images, icons, logos)
│   └── images/
│       ├── chapters/           # CS, WIE, PES chapter logos and banners
│       ├── events/             # Workshop and competition photographs
│       ├── hero/               # Carousel background photographs
│       ├── projects/           # Bot and student innovation pictures
│       └── team/               # Executive committee portraits
├── src/
│   ├── components/             # Reusable UI & section components
│   │   ├── layout/
│   │   │   ├── Header.tsx      # Main navigation, auth profile dropdown & dark mode switch
│   │   │   ├── Footer.tsx      # Site footer with chapter and social links
│   │   │   └── PageHead.tsx    # Dynamic HTML title and SEO meta tags
│   │   ├── ui/                 # Atomic design components (button, dialog, input, etc.)
│   │   ├── ChaptersSection.tsx # Overview of CS, PES, and WIE chapters
│   │   ├── EditEventDialog.tsx # Admin dialog for editing/creating events & photo uploads
│   │   ├── EditTeamMemberDialog.tsx # Admin dialog for adding/editing WebDev team members & photo uploads
│   │   ├── EventCard.tsx       # Interactive event display card with admin edit trigger
│   │   ├── Hero.tsx            # Fullscreen dynamic image carousel with CTA
│   │   ├── InventoryCatalog.tsx# Hardware inventory tracker component
│   │   ├── ProjectCard.tsx     # Student engineering project showcase card
│   │   ├── StatsSection.tsx    # Numerical impact counter (members, events, workshops)
│   │   └── TeamMemberCard.tsx  # Team member card with photos & social icons
│   ├── context/
│   │   └── ThemeContext.tsx    # Dark/Light theme state provider (localStorage backed)
│   ├── data/                   # Static fallback data files
│   │   ├── chapters_data.ts    # Descriptions, leads, and focus areas for chapters
│   │   ├── events_data.ts      # Static list of past events and workshops
│   │   ├── inventory_data.ts   # Hardware components and borrowing logs
│   │   ├── projects_data.ts    # Bot, robotics, and software project catalog
│   │   ├── resources_data.ts   # Roadmaps, study guides, and cheatsheets
│   │   └── team_details.ts     # Executive leadership details and social handles
│   ├── hooks/
│   │   └── useAdmin.ts         # Hook to check if current user has admin privileges
│   ├── lib/
│   │   ├── supabase/
│   │   │   └── supabase.ts     # Supabase client initialization
│   │   └── utils.ts            # Helper utilities (cn, getAssetPath, formatDate)
│   ├── pages/                  # Next.js Pages Router routes
│   │   ├── _app.tsx            # Global App wrapper (Theme, Toast providers)
│   │   ├── _document.tsx       # HTML structure and font imports
│   │   ├── 404.tsx             # Custom 404 error page
│   │   ├── index.tsx           # Website homepage
│   │   ├── apply.tsx           # Auditions & membership application form
│   │   ├── chapters/           # Chapter exploration pages (CS, PES, WIE)
│   │   ├── contact.tsx         # Contact form and branch office location
│   │   ├── events/             # Events, workshops, and Techadroit symposiums
│   │   ├── admin/              # Admin dashboard (src/pages/admin/index.tsx)
│   │   ├── interview.tsx       # Evaluation portal for interviewers
│   │   ├── interview-login.tsx # Google OAuth login portal for PEC accounts
│   │   ├── inventory/          # Lab hardware inventory catalog (src/pages/inventory/index.tsx)
│   │   ├── pending.tsx         # Account pending approval waiting screen
│   │   ├── project/            # Student projects gallery
│   │   ├── resources/          # Technical guides and roadmaps
│   │   ├── team/               # WebDev & executive leadership page
│   │   └── auth/
│   │       └── callback.tsx    # Supabase OAuth redirect and auto-provisioning
│   ├── styles/
│   │   └── globals.css         # Tailwind directives, CSS variables & Midnight Cyber styles
│   └── types/
│       └── index.d.ts          # Global TypeScript interfaces and type definitions
├── supabase/
│   └── schema.sql              # Complete Supabase PostgreSQL schema with RLS policies
├── package.json                # Project dependencies and npm scripts
├── tailwind.config.ts          # Tailwind configuration (colors, dark mode: 'class')
├── tsconfig.json               # TypeScript compiler options
└── README.md                   # Main repository overview
```

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [Supabase](https://supabase.com/) project (for authentication, PostgreSQL database, and Storage)

### 2. Clone the Repository
```bash
git clone https://github.com/IEEE-PEC/IEEE-PEC-Website.git
cd IEEE-PEC-Website
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 5. Setup Database Schema
Open your Supabase project dashboard, navigate to the **SQL Editor**, and run the script found in:
[`supabase/schema.sql`](./supabase/schema.sql)

Also ensure public Storage buckets `event-images` and `team-images` are created.

### 6. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Building for Production

To create an optimized production build:
```bash
npm run build
```

This compiles all pages and exports static assets ready for deployment on Vercel or any static host.

---

## 🎨 Theme Customization

The site features two themes configured in `src/styles/globals.css`:
- **Light Mode (`Clean Minimalist`):** Crisp white backgrounds, clean IEEE blue `#00629B` accents, and dark slate typography.
- **Dark Mode (`Midnight Cyber`):** Rich navy (`#0a1628`), electric cyan `#00A3E0` highlights, glassmorphic card styling, and dark scrollbars.

Tailwind activates dark mode via the `.dark` class toggled on the `<html>` element by `src/context/ThemeContext.tsx`.
