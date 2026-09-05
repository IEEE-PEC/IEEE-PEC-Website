# IEEE PEC Website — `interview-page` Branch Documentation

This document contains a comprehensive record of all features, enhancements, portal architecture, database integrations, and UI upgrades implemented in the `interview-page` branch of the IEEE PEC Student Branch website repository.

---

## 📌 Branch Purpose & Objectives

1. **Streamline Student Auditions & Membership Intake:** Candidate logs in via official PEC Google Account (`@pec.edu.in`), pre-fills & locks verified email, and auto-detects Academic Year from SID.
2. **Dedicated Interview Evaluation Portal:** Allow authorized seniors/interviewers to evaluate candidates across multiple scoring criteria with live statistics and real-time status updates.
3. **Audition Results Release Control:** Admin panel toggle (`results_published`) to declare or hold results for a specific audition event cycle.
4. **Candidate Result Views & WhatsApp Community:**
   - **Selected:** Congratulatory banner with 1-click **Official WhatsApp Community Join Button** (link configured by Admin).
   - **Hold:** Waitlist notification.
   - **Not Selected:** Encouraging message highlighting future workshop participation.
5. **Member Promotion Engine:** Promote selected 1st-year candidates into interviewers for subsequent audition cycles directly from the admin panel.
6. **Dynamic Frontend Content & Photo Management:** Enable website administrators to create, update, and delete events with direct photo uploads from their laptop to Supabase Storage without touching the codebase.
7. **Modernized UI & Theming:** Custom *Midnight Cyber* dark mode and *Clean Minimalist* light mode with localStorage persistence.

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
  (1. Set WhatsApp Group Link & Audition Cycle Name)
  (2. Toggle 1-Click "Release Results" ON/OFF)
  (3. Search Selected members ➔ 1-Click "Promote to Interviewer")
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
- Reordered navigation: `Webdev Team` moved to last.
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
- Removed placeholder example text for cleaner form aesthetics.

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

### 5. Automatic Status Synchronization
- Submitting an evaluation automatically updates `applications.status` in Supabase:
  - `Select` ➔ `Selected`
  - `Hold` ➔ `Hold`
  - `Reject` ➔ `Rejected`
- Instant local state update ensures zero-latency UI updates without requiring a manual browser refresh.

### 6. Admin Panel with Member Promotion & Results Control (`src/pages/admin/index.tsx`)
- **Panel 1 — Promote Members to Interviewer:**
  - Automatically lists all candidates marked as `Selected`.
  - Live search by Name, College Email, or SID.
  - 1-Click **"Promote to Interviewer"** button that upgrades the member's profile role in Supabase.
  - Smart status indicators (shows green `Interviewer`/`Admin` badge if already promoted, or warns if the user hasn't logged into the portal yet).
- **Panel 2 — Portal User Management:**
  - View all authenticated users.
  - Role dropdowns to promote or demote users between `Pending`, `Interviewer`, and `Admin`.

### 7. Frontend Event & Laptop Photo Management (`src/components/EditEventDialog.tsx`, `/events`)
- When logged in as an administrator:
  - A **✏️ Pencil Edit Button** appears on every event card on the homepage and `/events` page.
  - A **"+ Add New Event"** button appears at the top of the `/events` page.
  - Admins can edit Title, Category, Short Description, Detailed Overview, and Capacity.
  - **Direct Photo Upload from Laptop:** Image files selected via the dialog are automatically uploaded to the Supabase Storage bucket `event-images` with unique filenames, and the public URL is saved to the database.
  - Delete event functionality with confirmation.
- Dynamic data fetching with fallback to static data if the Supabase database is empty.

### 8. Cleanup & Simplification
- Removed the bottom "Apply for Membership" CTA block from the homepage.
- Removed "Participate" and "Apply / Register" buttons from past events.
- Removed sample names and dummy phone numbers from `contact.tsx` and `apply.tsx`.

---

## 🗄️ Database Tables Reference

| Table Name | Description | Key Fields |
|---|---|---|
| `profiles` | User accounts & RBAC roles | `id`, `email`, `full_name`, `role` (`pending`/`interviewer`/`admin`) |
| `applications` | Student audition submissions | `id`, `full_name`, `sid`, `email`, `phone`, `branch`, `year`, `chapters`, `domains`, `status` |
| `interviews` | Candidate evaluation scores | `id`, `application_id`, `interviewer_name`, `technical_score`, `communication_score`, `confidence_score`, `teamwork_score`, `overall_score`, `recommendation`, `comments` |
| `events` | Dynamic event posts & symposiums | `id`, `title`, `category`, `description`, `long_description`, `image_url`, `capacity`, `registration_open` |
| Storage Bucket: `event-images` | Storage for uploaded event banners | Public image assets uploaded by administrators |

*(Complete SQL definitions available in [`supabase/schema.sql`](./supabase/schema.sql))*

---

## 🚢 Deployment Details

- **Hosting Platform:** Vercel (Production)
- **Framework:** Next.js (Static HTML Export with client-side Supabase runtime)
- **Live Production URL:** [https://ieee-pec-interview-portal.vercel.app](https://ieee-pec-interview-portal.vercel.app)
