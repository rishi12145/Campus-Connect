# Campus Connect — Project Contribution & Engineering Work Breakdown Report
**Integrated Digital Campus Ecosystem • IIIT Vadodara – International Campus Diu**  
**Department of Computer Science & Engineering • B.Tech (2023–2027)**  
*Document Reference: CC-CR-2026-01 • November 2026*

---

## 1. Executive Summary & Platform Overview

**Campus Connect** is an integrated, cloud-native digital campus operating system engineered to serve students, faculty, and administrative staff at the **Indian Institute of Information Technology Vadodara – International Campus Diu (IIITV-ICD)**. The platform consolidates campus communications, real-time academic timetables, study materials repository, lost-and-found registry, campus transit tracking, regional exploration guides, and administrative governance into a unified, high-performance web application.

To overcome intermittent coastal connectivity and guarantee uninterrupted academic workflows, the system implements a proprietary **Dual-Engine Client-Server Persistence Architecture**. This layer dynamically reconciles state between a remote **Supabase PostgreSQL 15** database and an offline browser-backed storage cache with seamless synchronization upon reconnection.

### Key Platform Metrics
| Metric | Quantified Value | Description |
| :--- | :---: | :--- |
| **Functional Modules** | **12** | Complete coverage of academic and campus life operations |
| **Supabase Relational Tables** | **12** | Normalized PostgreSQL schema with foreign keys and cascade rules |
| **Row Level Security (RLS) Rules** | **Active** | Strict role-based isolation; anonymous reads blocked on private data |
| **Verified Test Suites** | **65 / 65** | 42 Master functional tests + 23 Supabase Auth/RLS security tests |
| **Asset Limit Compliance** | **100%** | Zero assets over 5 MB; total public bundle < 15 MB (Cloudflare compliant) |
| **Deployment Status** | **Production** | Live on Cloudflare Pages Edge network |

---

## 2. Engineering Contribution & Effort Distribution

The project was executed by a collaborative engineering triad comprising three B.Tech Computer Science & Engineering undergraduates. Effort, technical ownership, and codebase authorship were divided as follows:

```
[==================== 45% ====================][============= 30% =============][========== 25% ==========]
             Rishikesh Gopal (45%)                       Sriya Reddy (30%)              Shivangi Goutam (25%)
             Lead Full-Stack Architect                   Frontend Architect & UI/UX     Backend Persistence Eng.
```

| Member Name | Student ID | Academic Program | Assigned Role | Contribution Weight |
| :--- | :---: | :---: | :--- | :---: |
| **Rishikesh Gopal** | `202311072` | B.Tech CSE (2023–2027) | **Lead Full-Stack Architect & Controller** | **45% (Highest)** |
| **Sriya Reddy** | `202311060` | B.Tech CSE (2023–2027) | **Frontend Architect & UI/UX Designer** | **30% (Second Highest)** |
| **Shivangi Goutam** | `202311079` | B.Tech CSE (2023–2027) | **Backend & Data Persistence Engineer** | **25% (Supporting)** |

---

## 3. Individual Engineering Dossiers

### 3.1 Rishikesh Gopal — Lead Full-Stack Architect & Controller (45% Effort)
- **Role:** Lead Platform Developer, Full-Stack Architect & System Controller
- **Email:** `202311072@iiitvadodara.ac.in` | **Contact:** `+91 8340574363`

#### Key Technical Contributions:
1. **End-to-End System Topology:** Designed and orchestrated the monorepo architecture connecting the React 18 client, Node.js Express API, and Supabase PostgreSQL 15 cloud engine.
2. **Supabase Authentication Lifecycle:** Engineered email/password authentication in `AuthContext.jsx` with GoTrue session management, password reset recovery routing, and token refreshing.
3. **Enterprise Database Migration & RLS Security:** Authored `supabase_auth_migration.sql`, establishing 12 relational tables, non-destructive `user_id UUID` links, recursion-free `public.is_admin()` helper function, and `trg_protect_profile_role` escalation prevention trigger.
4. **Dual-Engine Persistence Sync:** Authored `offlineSyncEngine.js` and `apiClient.js` enabling optimistic updates, offline queueing, and bi-directional cloud synchronization.
5. **Admin Control Center (CMS):** Developed full administrative suite (`AdminOverview`, `AdminUsers`, `AdminReports`) featuring live platform telemetry, circular broadcasts, and user status toggles.
6. **DevOps & Production CI/CD:** Structured monorepo workspaces, resolved Vite build scripts, implemented Cloudflare Pages deployment rules (`_redirects`), and eliminated build bottlenecks.
7. **Automated Testing & QA Lead:** Wrote and maintained `test_suite.js` (42 functional tests) and `test_supabase_auth.js` (23 security tests), achieving 100% test passage.

#### Primary Code Assets Authored:
- `supabase_auth_migration.sql` (Comprehensive production database migration)
- `supabase_schema.sql` (Master schema and constraint definitions)
- `campus-connect/frontend/src/context/AuthContext.jsx` (Core authentication provider)
- `campus-connect/frontend/src/services/offlineSyncEngine.js` (Dual-engine synchronization)
- `campus-connect/frontend/src/services/apiClient.js` (Resilient network transport)
- `campus-connect/frontend/src/pages/LoginPage.jsx` & `RegisterPage.jsx`
- `campus-connect/frontend/src/modules/admin/*` (All administrative console views)
- `test_suite.js` & `campus-connect/frontend/test_supabase_auth.js`

---

### 3.2 Sriya Reddy — Frontend Architect & UI/UX Designer (30% Effort)
- **Role:** Frontend Systems Architect & UI/UX Lead
- **Email:** `202311060@iiitvadodara.ac.in`

#### Key Technical Contributions:
1. **Editorial Design System:** Crafted the modern dark-mode aesthetic utilizing deep obsidian backgrounds (`#0A0A0A`), high-contrast slate surfaces (`#141414`), and Electric Lime (`#B7F34A`) accents.
2. **Responsive Mobile-First Navigation:** Implemented cross-device responsiveness with collapsible mobile drawer menus, persistent top navigation, and bottom action bars.
3. **Micro-Interactions & Animation Design:** Built smooth UI transitions using **Framer Motion**, including modal transitions, animated tab switches, skeleton loading states, and toast notifications.
4. **Academic Resources Hub UI:** Built faceted filtering controls allowing multi-criteria queries across 8 semesters, 4 engineering branches, and document types.
5. **Community Discussion Forum Interface:** Designed discussion thread feeds, nested reply trees, category filtering tags, and interactive upvote counters.
6. **Lost & Found Portal Interface:** Built card grid with status tags (Lost, Found, Resolved), thumbnail previews, contact reveal modals, and date-range filters.
7. **Accessibility & Ergonomics:** Enforced WCAG AA compliant contrast ratios, accessible form controls, and keyboard navigation.

#### Primary Code Assets Authored:
- `campus-connect/frontend/src/modules/resources/ResourcesPage.jsx`
- `campus-connect/frontend/src/modules/community/CommunityPage.jsx`
- `campus-connect/frontend/src/modules/lostfound/LostFoundPage.jsx`
- `campus-connect/frontend/src/modules/academic/AcademicPage.jsx`
- `campus-connect/frontend/src/components/Sidebar.jsx` & `Navbar.jsx`
- `campus-connect/frontend/src/components/TopNav.jsx`
- `campus-connect/frontend/tailwind.config.js` & `index.css`

---

### 3.3 Shivangi Goutam — Backend & Data Persistence Engineer (25% Effort)
- **Role:** Data Persistence Engineer & Cloud Storage Specialist
- **Email:** `202311079@iiitvadodara.ac.in`

#### Key Technical Contributions:
1. **Supabase Cloud Storage Integration:** Configured the private `academic-resources` storage bucket, implemented signed URL generation for secure file downloads, and co-authored storage RLS policies.
2. **Client-Side File Validation & Compression Bridge:** Developed strict 1 MB file upload size validation for PDF, JPG, and PNG files, with automated user alerts linking to **iLovePDF** and **iLoveIMG**.
3. **Database Seeding & Domain Mock Pipelines:** Built `initialData.js`, compiling mock records across all 12 platform tables (academic routines, bus schedules, Diu places, and local service directories).
4. **Local Exploration & Transportation Data:** Structured route timetables for the ₹10 Diu Municipal Bus system and curated 20 regional landmark profiles with verified metadata.
5. **Quality Assurance & Parity Testing:** Validated column parity between client fallback storage and Supabase PostgreSQL schema, testing file streaming and fallback behavior.

#### Primary Code Assets Authored:
- `campus-connect/frontend/src/data/initialData.js` (Master seed dataset across 12 tables)
- `campus-connect/frontend/src/services/storageService.js` (Data persistence & `setCurrentUser`)
- `campus-connect/frontend/src/services/supabaseStorage.js` (Object storage operations)
- `campus-connect/frontend/src/modules/transport/TransportPage.jsx`
- `download_diu_places_images.js` (Automated asset pipeline)

---

## 4. Module-by-Module Work Breakdown Structure (WBS)

| Functional Module | Primary Lead | Supporting Contributor(s) | Effort Split (R / S / Sh) | Status |
| :--- | :--- | :--- | :---: | :---: |
| **System Architecture & Monorepo** | Rishikesh Gopal | Sriya Reddy, Shivangi Goutam | 60% / 20% / 20% | **Complete** |
| **Supabase Auth, RLS & Schema** | Rishikesh Gopal | Shivangi Goutam | 75% / 05% / 20% | **Complete** |
| **Dual-Engine Persistence Sync** | Rishikesh Gopal | Shivangi Goutam | 70% / 10% / 20% | **Complete** |
| **Editorial Dark UI Design System** | Sriya Reddy | Rishikesh Gopal | 15% / 75% / 10% | **Complete** |
| **Academic Resources Hub** | Sriya Reddy | Shivangi Goutam | 20% / 45% / 35% | **Complete** |
| **Supabase Storage & 1MB Validation** | Shivangi Goutam | Rishikesh Gopal | 25% / 10% / 65% | **Complete** |
| **Community Discussion Forum** | Sriya Reddy | Rishikesh Gopal | 35% / 50% / 15% | **Complete** |
| **Lost & Found Portal** | Sriya Reddy | Shivangi Goutam | 25% / 55% / 20% | **Complete** |
| **Academic Timetable & Routines** | Shivangi Goutam | Sriya Reddy | 20% / 40% / 40% | **Complete** |
| **Campus Transport & Bus Schedules** | Shivangi Goutam | Sriya Reddy | 20% / 40% / 40% | **Complete** |
| **Admin Control Center (CMS)** | Rishikesh Gopal | Sriya Reddy | 80% / 15% / 05% | **Complete** |
| **DevOps, CI/CD & Cloudflare Edge** | Rishikesh Gopal | Shivangi Goutam | 75% / 10% / 15% | **Complete** |
| **Automated Test Suites (65 Tests)** | Rishikesh Gopal | Shivangi Goutam | 70% / 10% / 20% | **Complete** |

---

## 5. Technology Stack & Quality Assurance

### Technology Stack Summary
- **Frontend SPA:** React 18.3.1, Vite 5.4.14, Tailwind CSS 3.4, Framer Motion 11, Lucide React
- **Backend API:** Node.js 20+ LTS, Express 4.19, Helmet, CORS
- **Database & Auth:** Supabase PostgreSQL 15, GoTrue Auth, Row Level Security, S3 Object Storage
- **Edge Deployment:** Cloudflare Pages (Automated git-push CI/CD)

### Automated QA Test Results
1. **Master Functional Test Suite (`test_suite.js`):** **42 / 42 Tests Passed (100%)**
2. **Supabase Auth & RLS Security Harness (`test_supabase_auth.js`):** **23 / 23 Tests Passed (100%)**
3. **Asset Optimization Scan:** Zero assets exceeding 5 MB; total public assets < 15 MB.

---

## 6. Verification & Team Sign-Off

We hereby certify that the engineering contributions documented in this report accurately reflect the individual and collaborative development conducted for the **Campus Connect** ecosystem.

- **Rishikesh Gopal** (`202311072`) — Lead Full-Stack Architect & Controller (45%)
- **Sriya Reddy** (`202311060`) — Frontend Architect & UI/UX Designer (30%)
- **Shivangi Goutam** (`202311079`) — Backend & Data Persistence Engineer (25%)

**Department of Computer Science & Engineering**  
**Indian Institute of Information Technology Vadodara – International Campus Diu (IIITV-ICD)**
