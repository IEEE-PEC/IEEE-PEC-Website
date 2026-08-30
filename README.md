# IEEE PEC Student Branch Website ⚡

Official website for the **IEEE Student Branch at Punjab Engineering College (PEC), Chandigarh**. Built with Next.js, React, TypeScript, and Tailwind CSS. Configured for automatic static export and deployment on **GitHub Pages (`github.io`)**.

---

## 🚀 Key Features

- **🏛️ Specialized Chapters Showcase:** Dedicated portals and focus areas for:
  - **IEEE Computer Society (CS)**
  - **IEEE Robotics & Automation Society (RAS)**
  - **IEEE Power & Energy Society (PES)**
  - **IEEE Women in Engineering (WIE)**
  - **IEEE Circuits & Systems Society (CAS)**
- **📦 Hardware Lab Inventory Management:** Real-time catalog of 94+ electronic components, microcontrollers (ESP32, Arduino, STM32, Raspberry Pi Pico), sensors, actuators, and power supplies with student check-out requests.
- **🛠️ Innovations & Projects Gallery:** Showcase of student research, autonomous rovers, IoT telemetry grids, and FPGA silicon designs.
- **📅 Events & TechSphere Symposium:** Interactive calendar, workshop schedules, and participant registration.
- **👥 Team & Executive Committee:** Dynamic member directory with branch counselor, chapter leads, and domain subheads.
- **📝 Membership & Auditions Portal:** Online recruitment application system with domain selection.
- **⚙️ Admin CMS Console:** Unified management dashboard for hardware stocks, projects, events, and auditions.
- **🌐 GitHub Pages Ready (`github.io`):** Configured with Next.js static export (`output: 'export'`) and automated GitHub Actions workflow (`.github/workflows/deploy.yml`).

---

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (Pages Router) + React 18
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Radix UI Primitives + Lucide React Icons + Framer Motion
- **Hosting:** GitHub Pages (`github.io`)
- **Backend / Database (Optional):** Supabase + Local structured dataset fallbacks

---

## 💻 Local Development

```bash
# 1. Navigate to the project directory
cd IEEE-PEC-Website

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Deploying to GitHub Pages (`github.io`)

This project includes a pre-configured GitHub Actions deployment workflow:

1. Create a repository on GitHub (e.g. `IEEE-PEC.github.io` or `ieee-pec-website`).
2. Push your code to the `main` or `master` branch.
3. In your GitHub repository settings:
   - Navigate to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. The workflow in `.github/workflows/deploy.yml` will automatically build the static website and deploy it to your `github.io` domain!

---

## 📁 Project Directory Structure

```plaintext
IEEE-PEC-Website/
├── .github/workflows/deploy.yml  # Automated GitHub Pages CI/CD workflow
├── public/                       # Static public assets
├── src/
│   ├── components/
│   │   ├── layout/               # Header, Footer, PageHead, PageLayout, Loader
│   │   ├── ui/                   # Radix & Tailwind UI component suite
│   │   ├── ChaptersSection.tsx   # CS, RAS, PES, WIE, CAS chapter showcase
│   │   ├── EventCard.tsx         # Event & Workshop card with register modal
│   │   ├── Hero.tsx              # Dynamic hero carousel & vision statement
│   │   ├── InventoryCatalog.tsx  # Searchable, filterable hardware inventory
│   │   ├── ProjectCard.tsx       # Project card with modal & technical specs
│   │   ├── StatsSection.tsx      # Live statistics counters
│   │   └── TeamMemberCard.tsx    # Member profile card with socials
│   ├── data/
│   │   ├── chapters_data.ts      # Detailed chapter data & leads
│   │   ├── events_data.ts        # Workshops, symposiums & hackathons
│   │   ├── inventory_data.ts     # Seeded from ieee_inventory.sql (94+ items)
│   │   ├── projects_data.ts      # Flagship student projects
│   │   ├── resources_data.ts     # Roadmaps, research paper guides, cheat sheets
│   │   └── team_details.ts       # Executive board & chapter leads
│   ├── lib/
│   │   ├── supabase/             # Supabase client helper
│   │   └── utils.ts              # Utility functions & formatting
│   ├── pages/
│   │   ├── index.tsx             # Landing Page
│   │   ├── chapters/index.tsx    # Chapters & Societies Directory
│   │   ├── team/index.tsx        # Executive Committee
│   │   ├── project/index.tsx     # Projects & Innovations Gallery
│   │   ├── events/index.tsx      # Events & Workshops
│   │   ├── inventory/index.tsx   # Hardware Inventory & Lab Checkout
│   │   ├── resources/index.tsx   # Learning Roadmaps & Toolkits
│   │   ├── apply.tsx             # Membership & Auditions Form
│   │   ├── contact.tsx           # Contact & Lab Office Info
│   │   ├── admin/index.tsx       # Unified Admin CMS Dashboard
│   │   ├── 404.tsx               # 404 Not Found Page
│   │   ├── _app.tsx              # Root Application Wrapper
│   │   └── _document.tsx         # HTML Document Shell
│   └── styles/
│       └── globals.css           # IEEE Blue theme variables & animations
├── next.config.ts                # Next.js static export configuration
├── tailwind.config.ts            # Tailwind IEEE theme configuration
├── tsconfig.json                 # TypeScript compiler options
└── package.json                  # Dependencies & build scripts
```

---

## 🤝 Contribution & License

Maintained with ❤️ by the **IEEE PEC Student Branch Web & Tech Team**.
Licensed under the [MIT License](LICENSE).
