# Campus Connect — System Architecture & Technical Specification

> **Integrated Digital Campus Ecosystem for Student Information, Academic Coordination and Community Engagement**  
> Indian Institute of Information Technology Vadodara – International Campus Diu (IIITV-ICD)  
> **Core Engineering Team**: Rishikesh Gopal (`202311072`), Sriya Reddy (`202311060`), Shivangi Goutam (`202311079`) — *B.Tech CSE (2023–2027)*

---

## 1. High-Resolution Architecture Diagram

Below is the complete 5-tier system architecture diagram generated for **Campus Connect**, illustrating all layers from the React presentation layer down to the Supabase PostgreSQL cloud infrastructure and external compression/communication bridges:

![Campus Connect Architecture](./Campus_Connect_Architecture_Diagram.png)

---

## 2. Architectural Overview & Design Philosophy

Campus Connect is built as an **offline-first, student-centric progressive digital ecosystem** tailored exclusively for the student body and administration of IIIT Vadodara – International Campus Diu (Education Hub, Kevdi).

### Core Architectural Principles:
1. **Zero Bloat & Zero Academic Friction**: Unlike institutional ERPs with payroll, fee collection, or HR modules, Campus Connect is 100% focused on daily student workflows: lecture hall allocations, municipal bus timetables, authentic lost & found recovery, verified announcements, peer discussions, and crowdsourced study resources.
2. **Dual-Engine Resilience (Offline-First + Cloud Synchronization)**:
   - **Local Storage Engine**: Versioned local storage keys (`cc_*_v2`) guarantee that all timetables, saved resources, bus schedules, and tourist information remain accessible even in poor connectivity areas around Kevdi or Diu island.
   - **Supabase Cloud Engine**: PostgreSQL 15 database + S3-compatible storage buckets ensure data persistence, multi-device synchronization, and strict Row Level Security (RLS).
3. **Strict Domain Identity & Security**:
   - Only official institute email addresses ending with `@diu.iiitvadodara.ac.in` or `@iiitvadodara.ac.in` are permitted to create student accounts.
   - Admin access is protected via stealth identifier authentication (`rishiadmin`), keeping public student interfaces clean.
4. **Strict Resource Constraints**:
   - Academic resource uploads are restricted to a **1 MB maximum file size**.
   - Direct online compression tool bridges ([iLovePDF](https://www.ilovepdf.com/compress_pdf) and [iLoveIMG](https://www.iloveimg.com/compress-image)) are surfaced immediately upon oversized file detection so users can compress files without leaving the ecosystem.

---

## 3. Tier-by-Tier System Breakdown

```mermaid
flowchart TD
    subgraph Tier1["1. Client Presentation Tier (React 19 + Vite 6)"]
        Landing["Landing Page (Hero, Campus Sky)"]
        About["About Us & Controller CMS (/about)"]
        Auth["Strict Auth Gate (@diu.iiitvadodara.ac.in)"]
        
        subgraph Modules["8 Integrated Student Workspaces"]
            M1["[1] Academic Timetables (Sem 1-8, CSE/AI/Cyber/ECE)"]
            M2["[2] Notices & Announcements (Targeted Circulars)"]
            M3["[3] Lost & Found Network (Photos, WhatsApp/Call)"]
            M4["[4] Diu Transport Hub (₹10 Bus, ±10 Min Rule)"]
            M5["[5] Academic Resources (PYQs 2021-2026, <= 1MB)"]
            M6["[6] Student Community Forum (Verified Threads)"]
            M7["[7] Explore Diu (20 Spots, Kevdi Distances)"]
            M8["[8] Student Profile (Auto Initials, Roll No)"]
        end

        Admin["Admin Management Console (/admin)"]
    end

    subgraph Tier2["2. Client-Side Resilience & Adapter Tier"]
        StorageSvc["storageService.js (Master Data Orchestrator)"]
        ResourceSvc["academicResourceService.js (1MB Gatekeeper)"]
        SyncSvc["supabaseSyncService.js (Cloud Sync Adapter)"]
        LocalCache[("localStorage (cc_*_v2 Keys)")]
    end

    subgraph Tier3["3. Backend Microservices Tier (Node.js / Express - Port 5000)"]
        AuthMW["authMiddleware.js (JWT Bearer & RBAC)"]
        APIs["REST API Endpoints (/api/*)"]
        Multer["File Upload Engine & MIME Validator"]
    end

    subgraph Tier4["4. Cloud Database & Storage (Supabase PostgreSQL 15)"]
        Tables[("12 Relational Tables (public.*)")]
        Buckets[("3 S3 Storage Buckets (academic-resources, lost-found-images, campus-media)")]
        RLS["Row Level Security (auth.uid() = uploaded_by)"]
    end

    subgraph Tier5["5. External Ecosystem & Protocol Bridges"]
        CompressPDF["iLovePDF Micro-Service (/compress_pdf)"]
        CompressIMG["iLoveIMG Micro-Service (/compress-image)"]
        WhatsApp["WhatsApp Deep Link (wa.me/91...)"]
        Maps["Google Maps Navigation API"]
    end

    Tier1 --> Tier2
    Tier2 --> LocalCache
    Tier2 --> Tier3
    Tier2 --> Tier4
    Tier3 --> Tier4
    M5 -.-> CompressPDF
    M5 -.-> CompressIMG
    M3 -.-> WhatsApp
    About -.-> WhatsApp
    M7 -.-> Maps
```

---

## 4. Detailed Component Architecture

### Tier 1: Client Presentation Layer
* **Framework**: React 19 SPA bundled with Vite 6.
* **Styling & Theming**: Tailwind CSS with custom high-contrast dark theme:
  * Primary Accent: Neon Lime (`#B7F34A`)
  * Secondary Accent: Warm Orange (`#FF9F43`)
  * Deep Background: Obsidian Dark (`#0A0A0A`, `#121212`, `#161616`)
  * Typography: Clean sans-serif with monospace font for course codes (`CS401`), roll numbers (`202311072`), and room allocations (`Room 2118`).
* **Animation & Motion**: Framer Motion for subtle entry transitions, hover lifts, and glowing ambient halos.
* **Navigation Architecture**:
  * Public Layout: Top navigation bar, dynamic footer, landing page, and `/about`.
  * Dashboard Layout: Left sidebar (desktop + responsive mobile slide-out), sticky top nav with global search (`Ctrl+K`), and unread circular notifications.
  * Admin Console Layout: Dedicated management sidebar with 11 admin modules.

### Tier 2: Offline-First Client Adapter Layer
* **`storageService.js`**:
  * Unified CRUD repository handling 12 distinct entities.
  * Broadcasts reactive custom DOM events (`campus_connect_update`) whenever any entity changes, ensuring instant UI re-renders across split views.
* **`academicResourceService.js`**:
  * Validates file size (strictly $\le 1\text{ MB}$ or $1,048,576\text{ bytes}$).
  * Validates allowed MIME types: `application/pdf`, `image/jpeg`, `image/png`.
  * Returns structured error payloads containing dynamic 1-click links to `iLovePDF` or `iLoveIMG` if a file is rejected.
* **`supabaseSyncService.js`**:
  * Dual-mode environment detection (browser `import.meta.env` + Node.js `process.env`).
  * Cloud table query executor, upsert handlers, and multi-file storage upload engine.

### Tier 3: Backend API & Microservices Layer
* **Server**: Node.js 20+ runtime with Express 4.
* **Port**: `5000` (runs concurrently with frontend on `5173`).
* **Security & Auth**:
  * `authMiddleware.js` verifies JWT bearer tokens.
  * Role-Based Access Control (RBAC): enforces `role === 'admin'` on administrative endpoints.
* **API Endpoints**:
  * `/api/auth`: Login, registration, token refresh, roll number validation.
  * `/api/routines`: Academic routine CRUD, branch/semester filters.
  * `/api/announcements`: Circulars, targeted audience dispatch.
  * `/api/resources`: Study materials upload, download counters.
  * `/api/lost-found`: Lost/found listings, claim status updates.
  * `/api/transport`: ₹10 municipal bus stops, student speed-dials.
  * `/api/developers`: Team roster management.

---

## 5. Cloud Database Schema (Supabase PostgreSQL 15)

The database schema is defined in [supabase_schema.sql](./campus-connect/supabase_schema.sql) and contains **12 relational tables** and **3 storage buckets**:

```mermaid
erDiagram
    profiles ||--o{ academic_resources : "uploads"
    profiles ||--o{ lost_found_items : "reports"
    profiles ||--o{ discussions : "creates"
    discussions ||--o{ discussion_comments : "has"
    profiles ||--o{ discussion_comments : "authors"

    profiles {
        text id PK
        text full_name
        text roll_number UK
        text college_email UK
        text phone_number
        text stream
        text branch
        text batch_year
        text batch
        text semester
        text role
        text status
    }

    academic_routines {
        text id PK
        text subject
        text code
        text faculty
        text room
        text day
        text start_time
        text end_time
        text type
        text semester
        text stream
        text branch
        text batch_year
        text batch
    }

    academic_resources {
        text id PK
        text title
        text description
        text category
        text semester
        text subject
        text academic_year
        text file_name
        text file_path
        text file_type
        bigint file_size
        text uploaded_by FK
        int downloads_count
    }

    announcements {
        text id PK
        text title
        text description
        text category
        text target_branch
        text target_semester
        text target_batch
        boolean is_important
        text author_name
    }

    lost_found_items {
        text id PK
        text title
        text description
        text category
        text location
        text date
        text contact_name
        text contact_phone
        text image_url
        boolean is_resolved
        text reported_by FK
    }

    developers {
        text id PK
        text name
        text role
        text year
        text batch
        text roll_number
        text quote
        text contact_phone
        text email
        boolean is_lead
        text bio
        text avatar
    }

    about_content {
        text id PK
        jsonb controller
        jsonb hero
        jsonb vision
        jsonb scope
        jsonb showcase_images
        jsonb benefits
    }
```

### Storage Buckets & Policies:
1. **`academic-resources`**:
   - Max file size: $1\text{ MB}$ ($1,048,576\text{ bytes}$).
   - Allowed MIME types: `application/pdf`, `image/jpeg`, `image/png`.
   - Access: Public read; authenticated student write; owner-only delete (`auth.uid() = (storage.foldername(name))[1]` or table owner).
2. **`lost-found-images`**:
   - Max file size: $2\text{ MB}$.
   - Allowed MIME types: Images only (`image/*`).
3. **`campus-media`**:
   - Max file size: $5\text{ MB}$.
   - Institutional campus photography and showcase gallery assets.

---

## 6. End-to-End Data Flow Sequence

The sequence diagram below illustrates how an academic resource is validated, uploaded, and synchronized:

```mermaid
sequenceDiagram
    autonumber
    actor Student
    participant UI as ResourcesPage.jsx
    participant Val as academicResourceService.js
    participant Store as storageService.js
    participant SupaStorage as Supabase Storage Bucket
    participant PG as PostgreSQL (academic_resources)

    Student->>UI: Select file (e.g. CS401_PYQ_2024.pdf)
    UI->>Val: validateResourceFile(file)
    
    alt File Size > 1 MB
        Val-->>UI: Reject: "File size exceeds 1 MB limit (Selected: 2.4 MB)"
        Val-->>UI: Return compressUrl: "https://www.ilovepdf.com/compress_pdf"
        UI-->>Student: Display error with 1-click "Compress PDF via iLovePDF" button
    else File Size <= 1 MB and Valid MIME Type
        Val-->>UI: Validation Passed
        Student->>UI: Click "Upload Resource"
        UI->>Store: createResource(metadata, fileBlob)
        Store->>SupaStorage: uploadFile('academic-resources', path, file)
        SupaStorage-->>Store: Returns storage path
        Store->>PG: INSERT INTO academic_resources (metadata, path, owner_uid)
        PG-->>Store: Confirmation & Record ID
        Store->>Store: Save to localStorage (cc_resources_v2)
        Store-->>UI: Dispatch 'campus_connect_update'
        UI-->>Student: Show Success Toast ("Resource uploaded successfully!")
    end
```

---

## 7. Technology Stack Summary

| Layer | Technologies / Packages | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19, Vite 6 | Lightning-fast component rendering & HMR |
| **Styling & Design** | Tailwind CSS 3.4, Lucide React, Framer Motion | High-contrast dark theme, micro-interactions, responsive mobile views |
| **State & Local Persistence** | React Context API, Web LocalStorage (`cc_*_v2`) | Offline-first zero latency data operations |
| **Backend Runtime** | Node.js 20+, Express 4 | REST API services & authentication routing |
| **Cloud Database** | Supabase Cloud, PostgreSQL 15 | Relational data integrity, foreign keys, triggers |
| **Security & Authorization** | Row Level Security (RLS), JWT Tokens | Tenant isolation, ownership protection, admin elevation |
| **Cloud Storage** | Supabase Storage (S3-compatible) | Binary asset hosting with strict size & MIME gatekeeping |
| **Compression Utilities** | iLovePDF, iLoveIMG | External micro-service bridges for file size optimization |
| **Communication Bridges** | WhatsApp Deep Linking (`wa.me`), Mailto Protocol | Instant 1-click student contact with Website Controller |
