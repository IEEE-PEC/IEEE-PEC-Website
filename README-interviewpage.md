# IEEE PEC Website — Interview Portal & Admin Features Documentation

This document contains a comprehensive record of all features, enhancements, portal architecture, database integrations, and UI upgrades implemented in the IEEE PEC Student Branch website repository.

---

## 📌 Core Purpose & Objectives

1. **Streamline Student Auditions & Membership Intake:** Candidate logs in via official PEC Google Account (`@pec.edu.in`), pre-fills & locks verified email, and auto-detects Academic Year from SID.
2. **Dedicated Interview Evaluation Portal (`/interview`):** Allow authorized seniors/interviewers to evaluate candidates across multiple scoring criteria with live statistics and real-time status updates.
3. **Audition Results Release Control:** Admin panel toggle (`results_published`) to declare or hold results for a specific audition event cycle on `/apply`.
4. **Candidate Result Views & WhatsApp Community:**
   - **Selected:** Congratulatory banner with 1-click **Official WhatsApp Community Join Button** (link configured by Admin).
   - **Hold:** Waitlist notification.
   - **Not Selected:** Encouraging message highlighting future workshop participation.
5. **WebDev & Core Team Management Console:** Admin panel section to add new members (**`+ Add Member to WebDev Team`**), edit team member details, upload profile photos directly from a laptop, and manage roster categories.
6. **Member Promotion Engine:** Promote selected 1st-year candidates into interviewers for subsequent audition cycles directly from the admin panel.
7. **Dynamic Frontend Content & Photo Management:** Enable website administrators to create, update, and delete events with direct photo uploads to Supabase Storage without touching the codebase.
8. **Modernized UI & Theming:** Custom *Midnight Cyber* dark mode and *Clean Minimalist* light mode with localStorage persistence.

---

## 🏗️ Architecture & User Journeys

```
               [ 1st / 2nd Year Candidate ]
                            │
                            ▼
              [ Google Sign In (@pec.edu.in) ]
                            │
                            ▼
               [ Apply Page: /apply ] 
         (Auto-detects Year from SID prefix)
                            │
                            ▼
          [ Supabase `applications` Table ] (status: "Pending")
                            │
                            ▼
         [ Interview Portal: /interview ]
  (Interviewers log in via Google PEC OAuth)
                            │
          ┌─────────────────┴─────────────────┐
          ▼                                   ▼
[ Real-time Evaluation ]              [ Walk-in Registration ]
(Scored on Tech, Comm, Conf, Team)    (Adds candidate on spot)
          │
          ▼
[ Supabase `interviews` Table ]
          │
          ▼
[ Auto-Sync `applications.status` ]
  (Select ➔ "Selected" | Hold ➔ "Hold" | Reject ➔ "Rejected")
          │
          ▼
[ Admin Panel: /admin ]
  ├─ 1. Release Audition Results & Set WhatsApp Group Link
  ├─ 2. WebDev Team Management (+ Add Member, Edit, Laptop Photo Upload)
  ├─ 3. Promote Selected Members to Interviewer Role
  └─ 4. Manage Portal User Roles (Pending, Interviewer, Admin)
          │
          ▼
[ Candidate Checks /apply ]
  ├─ If Results OFF ➔ "Auditions in Progress / Under Review"
  ├─ If Selected    ➔ 🎉 Selected Banner + WhatsApp Join Button
  ├─ If Hold        ➔ ⏳ On Hold / Waitlist
  └─ If Not Selected➔ 🤝 Thank you message & workshop invite
```

---

## 🚀 Key Features Implemented

### 1. Dynamic Header with Supabase Auth (`src/components/layout/Header.tsx`)
- Auto-detects Supabase login session.
- Displays user profile avatar, name, and email dropdown.
- Shows dynamic role badge:
  - 🟣 **Admin** ➔ Direct shortcut to `/admin`
  - 🔵 **Interviewer** ➔ Direct shortcut to `/interview`
  - 🟡 **Pending** ➔ Direct shortcut to `/pending`
- Reordered navigation with quick access to Lab Inventory, Events, and Team.
- Integrated theme toggle in both desktop and mobile drawer views.

### 2. Dark/Light Theme Engine (`Midnight Cyber` + `Clean Minimalist`)
- **Provider:** `src/context/ThemeContext.tsx` with `localStorage` and system theme detection (`prefers-color-scheme`).
- **Toggle Component:** `src/components/ui/ThemeToggle.tsx` with smooth sun/moon animation and glowing cyan accents.
- **Midnight Cyber Theme:** Deep navy backgrounds (`hsl(222, 47%, 5%)`), neon cyan primary accents (`#06b6d4`), subtle glassmorphic card borders, custom dark scrollbars.
- **Complete Dark Variant Support:** Applied `dark:` Tailwind classes across all portal pages, cards, modals, and tables.

### 3. College SID Auto-Detection (`src/pages/apply.tsx`)
- Instant year detection from PEC SID prefix:
  - `25XXXXXX` ➔ Auto-selects **1st Year**
  - `24XXXXXX` ➔ Auto-selects **2nd Year**
  - `23XXXXXX` ➔ Auto-selects **3rd Year**

### 4. Full-Featured Interview Portal (`src/pages/interview.tsx`)
- **Parallel Data Fetching:** Loads applicants and existing evaluations concurrently via `Promise.all`.
- **Live Metric Cards:** Live counters for Total Applicants, Selected, On Hold, and Rejected.
- **Search & Multi-Filters:** Filter candidates by Academic Year (1st, 2nd, 3rd) and Evaluation Status (All, Unevaluated, Selected, Hold, Rejected).
- **Walk-in Modal:** Add on-the-spot walk-in candidates without leaving the portal.
- **Evaluation Form:**
  - 4 Criteria: Technical, Communication, Confidence, Teamwork (1–10).
  - Auto-calculated Overall Score.
  - Final Recommendation: `Select`, `Hold`, or `Reject`.
  - Comments / Observations.
  - Re-evaluation / Score update capability for already evaluated candidates.

### 5. WebDev & Core Team Management (`src/pages/admin/index.tsx`, `EditTeamMemberDialog.tsx`)
- **`+ Add Member to WebDev Team` Button:** Opens modal to register new web developers or executives.
- **`Edit Member` Button:** Allows editing full name, role/title, category (*Web & IT*, *Leadership*, *Executive*, *Technical*, *Hardware*), IEEE chapter, department, term, and bio.
- **Laptop Photo Upload:** File picker allowing admins to upload custom headshots directly from their laptop (with live image preview), or paste image URLs.
- **Social Links Integration:** Supports GitHub, LinkedIn, Email, and Website URLs.
- **Team Roster Delete:** Delete option with prompt verification.

### 6. Admin Panel with Member Promotion & Results Control (`src/pages/admin/index.tsx`)
- **Panel 0 — Audition Results & Selection Release:**
  - Toggle 1-Click "Release Results to Public" on `/apply`.
  - Set active audition cycle name and WhatsApp group link.
- **Panel 1 — WebDev & Core Team Management:**
  - Add, edit, and upload headshots for team members with category filters.
- **Panel 2 — Promote Members to Interviewer:**
  - Automatically lists all candidates marked as `Selected`.
  - Search by Name, College Email, or SID.
  - 1-Click **"Promote to Interviewer"** button upgrading member role in Supabase.
- **Panel 3 — Portal User Management:**
  - Search & role dropdowns to promote or demote users between `Pending`, `Interviewer`, and `Admin`.

### 7. Frontend Event & Laptop Photo Management (`src/components/EditEventDialog.tsx`, `/events`)
- When logged in as an administrator:
  - A **✏️ Pencil Edit Button** appears on event cards.
  - A **"+ Add New Event"** button appears at the top of `/events`.
  - Direct photo upload from laptop to Supabase Storage bucket `event-images`.

---

## 🗄️ Database Tables Reference

| Table Name | Description | Key Fields |
|---|---|---|
| `profiles` | User accounts & RBAC roles | `id`, `email`, `full_name`, `role` (`pending`/`interviewer`/`admin`) |
| `applications` | Student audition submissions | `id`, `full_name`, `sid`, `email`, `phone`, `branch`, `year`, `chapters`, `domains`, `status` |
| `interviews` | Candidate evaluation scores | `id`, `application_id`, `interviewer_name`, `technical_score`, `communication_score`, `confidence_score`, `teamwork_score`, `overall_score`, `recommendation`, `comments` |
| `team_members` | WebDev & Executive team roster | `id`, `name`, `role`, `category`, `chapter`, `department`, `year`, `image`, `description`, `socials` |
| `events` | Dynamic event posts & symposiums | `id`, `title`, `category`, `description`, `long_description`, `image_url`, `capacity`, `registration_open` |
| `portal_settings` | Audition cycle controls | `id`, `audition_event_name`, `results_published`, `whatsapp_group_link` |
| Storage Buckets | `event-images`, `team-images` | Storage for uploaded event banners and member headshots |

---

## 🚢 Deployment Details

- **Hosting Platform:** Vercel (Production)
- **Framework:** Next.js 15 (Pages Router)
- **Live Production URL:** [https://ieeepec.vercel.app](https://ieeepec.vercel.app)
