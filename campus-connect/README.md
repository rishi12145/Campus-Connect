# CAMPUS CONNECT
> **"Your Campus. Everything Connected."**

**Integrated Digital Campus Ecosystem for Student Information, Academic Coordination and Community Engagement**  
Developed for **Indian Institute of Information Technology Vadodara – International Campus Diu (IIITV-ICD)**.

---

## 👥 Project Team & Engineering Information
* **Institute:** Indian Institute of Information Technology Vadodara – International Campus Diu (Education Hub, Kevdi, Diu UT – 362520)
* **Degree & Batch:** B.Tech Computer Science & Engineering (2023–2027)
* **Core Engineering Team:**
  1. **Rishikesh Gopal** (Roll No: 202311072) — Project Controller & Full-Stack Architect
  2. **Sriya Reddy** (Roll No: 202311060) — Frontend Architect & UI/UX Designer
  3. **Shivangi Goutam** (Roll No: 202311079) — Backend & Data Persistence Engineer

---

## 🎯 Problem Statement & Purpose
Students currently rely on multiple fragmented WhatsApp groups, paper notice boards, personal phone contacts, and scattered online links to obtain essential campus information. Important updates regarding:
* Daily & weekly lecture schedules and classroom changes
* Official examination circulars and guest lectures
* Previous-year question papers (PYQs) and study notes
* Lost items and recovery coordination
* Bus schedules and driver contacts
* Student peer discussions and campus discovery

are scattered across incompatible channels.

**Campus Connect** provides **ONE centralized digital ecosystem** built specifically for the IIITV-ICD student community. It maintains strict student-centric focus without generic ERP bloat (no fee gateways, payroll, or biometric attendance).

---

## 🎨 Design System & Color Palette
* **90% Monochrome Base:**
  * Primary Black: `#111111`
  * Secondary Black: `#191919`
  * White: `#FFFFFF`
  * Off-White: `#F8F8F6`
  * Light Grey: `#EEEEEC`
  * Medium Grey: `#D8D8D5`
  * Text Grey: `#777777`
* **10% Lime Green Accent:**
  * Lime Green: `#B7F34A`
  * Dark Lime: `#91C932`
* **Aesthetic:** Editorial SaaS, rounded corners (`14–18px`), subtle drop shadows, and Framer Motion micro-interactions.

---

## 🏛️ Authentic IIITV-ICD Campus Photography
Organized in `public/images/campus/`:
* `campus-main.jpg` — Education Hub Diu Main Academic Complex
* `campus-building.jpg` — Academic Block & Lecture Theaters
* `campus-lab.jpg` — Central High-Performance Computing Laboratories
* `campus-library.jpg` — Central Institute Library & Reading Halls
* `campus-hostel.jpg` — Student Residential Hostels in Kevdi
* `campus-cafeteria.jpg` — Campus Dining Hall & Outdoor Lawns
* `campus-events.jpg` — Student Sports & Activities Grounds
* `campus-life.jpg` — Coastal Student Life & Nagoa Beach Walkway
* `iiitv-icd-logo.png` — Verified Institute Emblem

---

## 🚀 Key Modules & Capabilities

### 1. Academic Routines
* Dynamic Day & Weekly Matrix views
* Filter by Semester (Semester 4, Semester 6) and Batch
* Shows Subject Name, Code (e.g. CS401, CS402), Faculty, Room Number, Timings, and Session Type (Lecture, Lab, Tutorial)
* Prominently highlights the active day's classes

### 2. Notices & Announcements
* Categorized: `Academic`, `Examination`, `Events`, `General`, `Emergency`
* Target Semester & Batch audience filtering
* Priority badge for critical notices
* Detailed view modal and unread notification tracking

### 3. Lost & Found Community Network
* Student submission for lost or found items with genuine photo uploads (Base64)
* Filter by `Lost`, `Found`, `My Listings`, and `Open` vs `Resolved`
* One-click claim/resolve action for item owners

### 4. Campus Bus Transport
* Schedules connecting Diu City Stand, Ghoghla Circle, Education Hub Kevdi, Diu Airport, and Una Railway Junction
* Pickup/Drop locations, stops, departures, frequency, bus number, and driver phone contacts
* Clear distinction for demo routes

### 5. Shared Study Resources & PYQs
* Student-contributed repository of lecture notes, solved PYQ question papers, cheatsheets, and lab manuals
* **Real File Download Functionality:** Generates and downloads genuine `.txt`/`.pdf`/code files directly to the user's computer via browser Blob streaming!
* Filter by Course, Semester, and Category

### 6. Student Community Forum
* Discussion threads across `Academics`, `Campus Life`, `General Questions`, `Technical Discussions`, and `Events`
* Persistent Upvotes/Likes with duplicate-prevention
* Real-time comment threads with author badges and comment deletion

### 7. Explore Diu Campus
* Interactive landmark directory with verified vs demo status flags
* Opening hours, facilities list, descriptions, and direct Google Maps deep-links

### 8. Student Profile & Settings
* Student credential summary (Roll number, Email, Batch, Semester)
* Avatar photo upload, phone update, bio editing, password change, and notification preference toggles

### 9. Dedicated Administrator Console
* **Admin Overview:** Live KPI counters, Recharts bar chart for module distribution, Recharts pie chart for engagement split, and audit trail
* **User Management:** View all students, search, toggle account activation, and edit records
* **Announcement Management:** Create, edit, and broadcast high-priority notices
* **Academic Management:** Full CRUD operations for routines and classroom allocations
* **Moderation:** Review and delete inappropriate lost & found items, resources, and community threads
* **Reports:** Exportable platform audit reports (`.txt` download)

### 10. Global Search & Notifications
* Quick keyboard shortcut `Ctrl+K`
* Real-time indexed search across all 8 modules (Classes, Notices, Notes, Places, Lost items, Discussions)
* Notification bell dropdown with unread badge counter and mark-all-read action

---

## 🔑 Demo Credentials

| Role | Email / Identifier | Password | Quick Action |
|---|---|---|---|
| **Student** | `student@campus.com` | `student123` | Click **"Demo Student"** on login screen |
| **Administrator** | `admin@campus.com` | `admin123` | Click **"Demo Admin"** on login screen |

*You can also register a brand new student account with your own roll number from `/register`.*

---

## 🛠️ Quick Start Instructions

### Prerequisites
* **Node.js:** v18 or higher (tested on v22.14)
* **npm:** v9 or higher

### Running the Application
From the repository root or `campus-connect` folder:

```bash
# 1. Install dependencies
npm run install:all

# 2. Start Frontend Development Server (Port 5173)
npm run dev

# 3. (Optional) Start Backend Express Server (Port 5000)
npm run start:backend
```

Open your browser to:
👉 **`http://localhost:5173/`**

---

## 🧪 Automated QA Test Suite
A mandatory automated test suite verifying all 18 quality assurance steps is included:

```bash
node test_suite.js
```
**Results:** `22 PASSED, 0 FAILED`

---

## 📝 Engineering Project Notice
Campus Connect is an integrated digital ecosystem developed by B.Tech CSE undergraduate students at IIIT Vadodara – International Campus Diu. While authentic campus photographs, real timetables, and live transport routes are utilized, this platform is an independent student-led system demonstration.

