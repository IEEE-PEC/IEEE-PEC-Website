# IEEE PEC Student Branch Website — Complete Developer Guide

Welcome to the official repository for the **IEEE Student Branch at Punjab Engineering College (PEC), Chandigarh** website.

This guide provides a comprehensive walkthrough of the website's architecture, technology stack, directory structure, component library, routing, backend integration, and local setup instructions.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | [Next.js 15 (Pages Router)](https://nextjs.org/) | React framework for static export and client-side page routing |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Type-safe application development |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com/) | Utility-first responsive CSS styling with dark mode support |
| **UI Components** | [Radix UI](https://www.radix-ui.com/) & [shadcn/ui](https://ui.shadcn.com/) | Accessible, unstyled UI primitives (Dialog, Popover, Sheet, Tabs, etc.) |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, consistent SVG icon set |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) | Smooth carousel transitions and interactive effects |
| **Notifications** | [Sonner](https://sonner.emilkowal.ski/) | Lightweight toast notification system |
| **Backend / Database** | [Supabase](https://supabase.com/) | PostgreSQL database, Authentication (Google OAuth), Storage, and Row-Level Security |
| **Deployment** | [Vercel](https://vercel.com/) | Global edge hosting with fast static delivery |

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
│   │   │   ├── Header.tsx      # Main site navigation, auth avatar & theme switch
│   │   │   ├── Footer.tsx      # Site footer with chapter and social links
│   │   │   └── PageHead.tsx    # Dynamic HTML title and SEO meta tags
│   │   ├── ui/                 # Atomic design components (button, dialog, input, etc.)
│   │   ├── ChaptersSection.tsx # Overview of CS, PES, and WIE chapters
│   │   ├── EditEventDialog.tsx # Admin dialog for editing/creating events & photo upload
│   │   ├── EventCard.tsx       # Interactive event display card with modal overview
│   │   ├── Hero.tsx            # Fullscreen dynamic image carousel with CTA
│   │   ├── InventoryCatalog.tsx# Society hardware component inventory tracker
│   │   ├── ProjectCard.tsx     # Student engineering project showcase card
│   │   ├── StatsSection.tsx    # Numerical impact counter (members, events, workshops)
│   │   └── TeamMemberCard.tsx  # Executive committee member card with socials
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
│   │   └── useAdmin.ts         # Hook to check if the current user has admin privileges
│   ├── lib/
│   │   ├── supabase/
│   │   │   └── supabase.ts     # Supabase client initialization
│   │   └── utils.ts            # Helper utilities (cn, getAssetPath, formatDate)
│   ├── pages/                  # Next.js Pages Router routes
│   │   ├── _app.tsx            # Global App wrapper (Theme, Toast providers)
│   │   ├── _document.tsx       # HTML structure and external font imports
│   │   ├── 404.tsx             # Custom 404 error page
│   │   ├── index.tsx           # Website homepage
│   │   ├── apply.tsx           # Auditions & membership application form
│   │   ├── chapters/           # Chapter exploration pages (CS, PES, WIE)
│   │   ├── contact.tsx         # Contact form and branch office location
│   │   ├── events/             # Events, workshops, and Techadroit symposiums
│   │   ├── interview.tsx       # Interview evaluation portal for seniors
│   │   ├── interview-admin.tsx # Admin management and member promotion dashboard
│   │   ├── interview-login.tsx # Google OAuth login portal for PEC accounts
│   │   ├── inventory/          # Component inventory catalog
│   │   ├── pending.tsx         # Account pending approval waiting screen
│   │   ├── project/            # Student hardware & software projects gallery
│   │   ├── resources/          # Technical guides, roadmaps, and cheat sheets
│   │   ├── team/               # Webdev & executive leadership page
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
└── README.md                   # Repository overview
```

---

## ⚡ Key Pages & Routes

| Route | Name | Description |
|---|---|---|
| `/` | **Homepage** | Hero carousel, branch overview, stats, chapters showcase, featured projects & events |
| `/chapters` | **Chapters** | Dedicated overview of Computer Society (CS), Power & Energy (PES), and Women in Engineering (WIE) |
| `/project` | **Projects** | Showcase of Robo-Soccer bots, IoT weather stations, RC hovercrafts, and web platforms |
| `/events` | **Events** | Comprehensive event archive with category filters and admin editing controls |
| `/resources` | **Resources** | Curated roadmaps for C++, ROS 2, Embedded Systems, Web Development, and PCB design |
| `/team` | **Webdev Team** | Executive committee and technical leads |
| `/contact` | **Contact Us** | Direct query submission form and branch office details |
| `/apply` | **Apply** | Auditions form with automatic Year detection from student SID |
| `/interview-login`| **Login** | Google OAuth login for PEC students and interviewers |
| `/interview` | **Interview Portal** | Scoring sheet and candidate pipeline for authorized interviewers |
| `/interview-admin`| **Admin Dashboard** | Member promotion panel and role-assignment controls |

---

## 🚀 Getting Started Locally

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [Supabase](https://supabase.com/) project (for authentication and database)

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
Open your Supabase project dashboard, navigate to the **SQL Editor**, and run the entire script found in:
[`supabase/schema.sql`](./supabase/schema.sql)

Also ensure you have created a public Storage bucket named `event-images`.

### 6. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Building for Production

This project uses Next.js Static HTML Export (`output: export` in `next.config.js`).

To create an optimized production build:
```bash
npm run build
```

This generates a static export in the `out/` directory, ready to be served from any CDN or static hosting platform like Vercel, GitHub Pages, or Netlify.

---

## 🎨 Theme Customization

The site features two themes configured in `src/styles/globals.css`:
- **Light Mode (`Clean Minimalist`):** Crisp white backgrounds, clean IEEE blue `#00629B` accents, and dark slate typography.
- **Dark Mode (`Midnight Cyber`):** Rich navy (`#0a1628`), electric cyan `#00A3E0` and `#06b6d4` highlights, subtle glassmorphism (`.glass-card`), and custom cyber scrollbars.

Tailwind activates dark mode via the `.dark` class toggled on the `<html>` element by `src/context/ThemeContext.tsx`.

---

## 🤝 Contributing

1. Create a feature branch from `main` or the active working branch (`git checkout -b feature/your-feature`).
2. Make your changes and test the build (`npm run build`).
3. Commit with clear, descriptive commit messages:
   ```bash
   git commit -m "feat(events): add filter for flagship workshops"
   ```
4. Push to your branch and open a Pull Request.
