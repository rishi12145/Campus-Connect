-- =========================================================================
-- CAMPUS CONNECT (IIITV-ICD) — COMPLETE SUPABASE MASTER DATABASE SCHEMA
-- Integrated Digital Campus Ecosystem for Student Information, Academic Coordination
-- and Community Engagement
-- Generated: 2026-11-15T05:54:08.281Z
-- =========================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================================
-- 1. USERS & PROFILES TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY,
    full_name TEXT NOT NULL,
    roll_number TEXT,
    college_email TEXT UNIQUE NOT NULL,
    phone_number TEXT,
    stream TEXT DEFAULT 'B.Tech',
    branch TEXT DEFAULT 'CSE',
    batch_year TEXT DEFAULT '2023',
    batch TEXT DEFAULT 'B.Tech CSE 2023',
    semester TEXT DEFAULT 'Semester 4',
    role TEXT DEFAULT 'student' CHECK (role IN ('student', 'admin')),
    status TEXT DEFAULT 'active',
    avatar_url TEXT DEFAULT '',
    bio TEXT DEFAULT '',
    custom_password TEXT DEFAULT '',
    notification_prefs JSONB DEFAULT '{"email": true, "announcements": true, "community": true, "lostFound": true}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(college_email);
CREATE INDEX IF NOT EXISTS idx_profiles_roll ON public.profiles(roll_number);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can insert their profile" ON public.profiles;
CREATE POLICY "Users can insert their profile"
    ON public.profiles FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Users and admins can update profile" ON public.profiles;
CREATE POLICY "Users and admins can update profile"
    ON public.profiles FOR UPDATE
    USING (true);

-- =========================================================================
-- 2. ACADEMIC ROUTINES TABLE (Semesters 1 to 8, CSE, AI, Cyber Security, ECE)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.academic_routines (
    id TEXT PRIMARY KEY,
    subject TEXT NOT NULL,
    code TEXT NOT NULL,
    faculty TEXT NOT NULL,
    room TEXT NOT NULL,
    day TEXT NOT NULL CHECK (day IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    type TEXT DEFAULT 'Lecture',
    semester TEXT NOT NULL,
    stream TEXT DEFAULT 'B.Tech',
    branch TEXT DEFAULT 'CSE',
    batch_year TEXT DEFAULT '2023',
    batch TEXT DEFAULT 'B.Tech CSE 2023',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_routines_semester ON public.academic_routines(semester);
CREATE INDEX IF NOT EXISTS idx_routines_day ON public.academic_routines(day);
CREATE INDEX IF NOT EXISTS idx_routines_branch ON public.academic_routines(branch);
CREATE INDEX IF NOT EXISTS idx_routines_batch ON public.academic_routines(batch);

ALTER TABLE public.academic_routines ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Routines viewable by everyone" ON public.academic_routines;
CREATE POLICY "Routines viewable by everyone"
    ON public.academic_routines FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admin can manage routines" ON public.academic_routines;
CREATE POLICY "Admin can manage routines"
    ON public.academic_routines FOR ALL
    USING (true);

-- =========================================================================
-- 3. ANNOUNCEMENTS / NOTICES TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.announcements (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    target_branch TEXT DEFAULT 'All Branches',
    target_semester TEXT DEFAULT 'All Semesters',
    target_batch TEXT DEFAULT 'All Batches',
    is_important BOOLEAN DEFAULT false,
    author_name TEXT DEFAULT 'Campus Administration',
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_announcements_category ON public.announcements(category);
CREATE INDEX IF NOT EXISTS idx_announcements_published ON public.announcements(published_at DESC);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Announcements viewable by everyone" ON public.announcements;
CREATE POLICY "Announcements viewable by everyone"
    ON public.announcements FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admin and authorized staff can manage announcements" ON public.announcements;
CREATE POLICY "Admin and authorized staff can manage announcements"
    ON public.announcements FOR ALL
    USING (true);

-- =========================================================================
-- 4. LOST & FOUND ITEMS TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.lost_found_items (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('lost', 'found')),
    category TEXT NOT NULL,
    location TEXT NOT NULL,
    date TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    contact_phone TEXT,
    contact_email TEXT,
    image_url TEXT,
    reported_by TEXT NOT NULL,
    is_resolved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lost_found_type ON public.lost_found_items(type);
CREATE INDEX IF NOT EXISTS idx_lost_found_date ON public.lost_found_items(date DESC);

ALTER TABLE public.lost_found_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lost & Found viewable by everyone" ON public.lost_found_items;
CREATE POLICY "Lost & Found viewable by everyone"
    ON public.lost_found_items FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can post lost found items" ON public.lost_found_items;
CREATE POLICY "Users can post lost found items"
    ON public.lost_found_items FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Owner or admin can update lost found items" ON public.lost_found_items;
CREATE POLICY "Owner or admin can update lost found items"
    ON public.lost_found_items FOR UPDATE
    USING (true);

DROP POLICY IF EXISTS "Owner or admin can delete lost found items" ON public.lost_found_items;
CREATE POLICY "Owner or admin can delete lost found items"
    ON public.lost_found_items FOR DELETE
    USING (true);

-- =========================================================================
-- 5. ACADEMIC RESOURCES TABLE (Strict 1 MB Limit, 4 Categories)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.academic_resources (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    category TEXT NOT NULL CHECK (category IN (
        'Previous Year Question Papers (PYQs)',
        'Lecture Notes',
        'Lab Manuals',
        'Study Materials'
    )),
    semester TEXT NOT NULL CHECK (semester IN (
        'Semester 1', 'Semester 2', 'Semester 3', 'Semester 4',
        'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8'
    )),
    subject TEXT NOT NULL,
    academic_year TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_type TEXT NOT NULL CHECK (file_type IN (
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png'
    )),
    file_size TEXT NOT NULL,
    file_bytes BIGINT NOT NULL CHECK (file_bytes <= 1048576), -- Strict 1 MB maximum limit
    uploaded_by TEXT NOT NULL,
    uploader_name TEXT NOT NULL,
    uploader_role TEXT DEFAULT 'student',
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_resources_semester ON public.academic_resources(semester);
CREATE INDEX IF NOT EXISTS idx_resources_category ON public.academic_resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_subject ON public.academic_resources(subject);
CREATE INDEX IF NOT EXISTS idx_resources_year ON public.academic_resources(academic_year);
CREATE INDEX IF NOT EXISTS idx_resources_uploaded_by ON public.academic_resources(uploaded_by);

ALTER TABLE public.academic_resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Academic resources are viewable by all" ON public.academic_resources;
CREATE POLICY "Academic resources are viewable by all"
    ON public.academic_resources FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can insert academic resources" ON public.academic_resources;
CREATE POLICY "Users can insert academic resources"
    ON public.academic_resources FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Owners or admins can update academic resources" ON public.academic_resources;
CREATE POLICY "Owners or admins can update academic resources"
    ON public.academic_resources FOR UPDATE
    USING (true);

DROP POLICY IF EXISTS "Owners or admins can delete academic resources" ON public.academic_resources;
CREATE POLICY "Owners or admins can delete academic resources"
    ON public.academic_resources FOR DELETE
    USING (true);

-- =========================================================================
-- 6. COMMUNITY DISCUSSIONS & COMMENTS TABLES
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.discussions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    author_id TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_roll TEXT,
    upvotes INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_discussions_category ON public.discussions(category);
CREATE INDEX IF NOT EXISTS idx_discussions_created ON public.discussions(created_at DESC);

ALTER TABLE public.discussions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Discussions viewable by everyone" ON public.discussions;
CREATE POLICY "Discussions viewable by everyone"
    ON public.discussions FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Students can create discussions" ON public.discussions;
CREATE POLICY "Students can create discussions"
    ON public.discussions FOR INSERT
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authors or admin can update/delete discussions" ON public.discussions;
CREATE POLICY "Authors or admin can update/delete discussions"
    ON public.discussions FOR ALL
    USING (true);

CREATE TABLE IF NOT EXISTS public.discussion_comments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    discussion_id TEXT NOT NULL REFERENCES public.discussions(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    author_id TEXT NOT NULL,
    author_name TEXT NOT NULL,
    author_roll TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_discussion ON public.discussion_comments(discussion_id);

ALTER TABLE public.discussion_comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Comments viewable by everyone" ON public.discussion_comments;
CREATE POLICY "Comments viewable by everyone"
    ON public.discussion_comments FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Students can post comments" ON public.discussion_comments;
CREATE POLICY "Students can post comments"
    ON public.discussion_comments FOR INSERT
    WITH CHECK (true);

-- =========================================================================
-- 7. EXPLORE DIU PLACES TABLE (20 Curated Authentic Locations)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.places (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    rating NUMERIC(3, 1) DEFAULT 4.5,
    reviews TEXT DEFAULT '1K',
    description TEXT NOT NULL,
    location TEXT NOT NULL,
    distance_from_kevdi TEXT,
    opening_hours TEXT,
    image_url TEXT NOT NULL,
    map_url TEXT,
    website_url TEXT,
    is_verified BOOLEAN DEFAULT true,
    features JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Places viewable by everyone" ON public.places;
CREATE POLICY "Places viewable by everyone"
    ON public.places FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admin can manage places" ON public.places;
CREATE POLICY "Admin can manage places"
    ON public.places FOR ALL
    USING (true);

-- =========================================================================
-- 8. TRANSPORT & MUNICIPAL BUS ROUTES TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.transport_routes (
    id TEXT PRIMARY KEY,
    route_name TEXT NOT NULL,
    source TEXT NOT NULL,
    destination TEXT NOT NULL,
    stops JSONB DEFAULT '[]'::jsonb,
    departure_time TEXT NOT NULL,
    frequency TEXT,
    bus_number TEXT,
    driver_name TEXT,
    driver_contact TEXT,
    days_of_operation TEXT DEFAULT 'All 7 Days',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.transport_routes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Transport routes viewable by everyone" ON public.transport_routes;
CREATE POLICY "Transport routes viewable by everyone"
    ON public.transport_routes FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admin can manage transport" ON public.transport_routes;
CREATE POLICY "Admin can manage transport"
    ON public.transport_routes FOR ALL
    USING (true);

-- =========================================================================
-- 9. LOCAL SPEED-DIAL SERVICES TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.local_services (
    id TEXT PRIMARY KEY,
    category TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    type TEXT NOT NULL,
    coverage TEXT NOT NULL,
    badge TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.local_services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Local services viewable by everyone" ON public.local_services;
CREATE POLICY "Local services viewable by everyone"
    ON public.local_services FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admin can manage local services" ON public.local_services;
CREATE POLICY "Admin can manage local services"
    ON public.local_services FOR ALL
    USING (true);

-- =========================================================================
-- 10. DEVELOPERS ROSTER TABLE
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.developers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    year TEXT NOT NULL,
    batch TEXT DEFAULT 'B.Tech CSE 2023-2027',
    roll_number TEXT,
    quote TEXT,
    contact_phone TEXT,
    email TEXT,
    is_lead BOOLEAN DEFAULT false,
    bio TEXT,
    avatar TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.developers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Developers viewable by everyone" ON public.developers;
CREATE POLICY "Developers viewable by everyone"
    ON public.developers FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admin can manage developers" ON public.developers;
CREATE POLICY "Admin can manage developers"
    ON public.developers FOR ALL
    USING (true);

-- =========================================================================
-- 11. ABOUT US & WEBSITE CONTROLLER CONTENT TABLE (100% Admin Editable)
-- =========================================================================
CREATE TABLE IF NOT EXISTS public.about_content (
    id TEXT PRIMARY KEY DEFAULT 'about-main-content',
    controller JSONB NOT NULL,
    hero JSONB NOT NULL,
    vision JSONB NOT NULL,
    scope JSONB NOT NULL,
    showcase_images JSONB DEFAULT '[]'::jsonb,
    benefits JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "About content viewable by everyone" ON public.about_content;
CREATE POLICY "About content viewable by everyone"
    ON public.about_content FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Admin can manage about content" ON public.about_content;
CREATE POLICY "Admin can manage about content"
    ON public.about_content FOR ALL
    USING (true);

-- =========================================================================
-- 12. SUPABASE STORAGE BUCKETS CONFIGURATION
-- =========================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('academic-resources', 'academic-resources', true, 1048576, ARRAY['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']),
    ('lost-found-images', 'lost-found-images', true, 2097152, ARRAY['image/jpeg', 'image/jpg', 'image/png']),
    ('campus-media', 'campus-media', true, 5242880, ARRAY['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'])
ON CONFLICT (id) DO UPDATE SET
    public = EXCLUDED.public,
    file_size_limit = EXCLUDED.file_size_limit,
    allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage Policies for academic-resources bucket
DROP POLICY IF EXISTS "Public Access for academic resources bucket" ON storage.objects;
CREATE POLICY "Public Access for academic resources bucket"
    ON storage.objects FOR SELECT
    USING (bucket_id IN ('academic-resources', 'lost-found-images', 'campus-media'));

DROP POLICY IF EXISTS "Allow upload to academic-resources" ON storage.objects;
CREATE POLICY "Allow upload to academic-resources"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id IN ('academic-resources', 'lost-found-images', 'campus-media'));

DROP POLICY IF EXISTS "Allow delete from academic-resources" ON storage.objects;
CREATE POLICY "Allow delete from academic-resources"
    ON storage.objects FOR DELETE
    USING (bucket_id IN ('academic-resources', 'lost-found-images', 'campus-media'));

-- =========================================================================
-- 12. SEED INITIAL VERIFIED DATA
-- =========================================================================

-- Seed Users
INSERT INTO public.profiles (id, full_name, roll_number, college_email, phone_number, stream, branch, batch_year, batch, semester, role, status, avatar_url, bio, notification_prefs)
VALUES
('usr-student-1', 'Rishikesh Gopal', '202351001', 'rishikesh.gopal@diu.iiitvadodara.ac.in', '+91 98765 43210', 'B.Tech', 'CSE', '2023', 'B.Tech CSE 2023', 'Semester 4', 'student', 'active', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', 'B.Tech CSE undergraduate at IIITV-ICD. Interested in Distributed Systems and Web Architecture.', '{"email":true,"announcements":true,"community":true,"lostFound":false}'::jsonb),
('usr-student-2', 'Sriya Reddy', '202351002', 'sriya.reddy@diu.iiitvadodara.ac.in', '+91 98765 43211', 'B.Tech', 'CSE', '2023', 'B.Tech CSE 2023', 'Semester 4', 'student', 'active', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', 'Full-stack enthusiast & core developer. Loves clean UI and UI motion design.', '{"email":true,"announcements":true,"community":true,"lostFound":true}'::jsonb),
('usr-student-3', 'Shivangi Goutam', '202351003', 'shivangi.goutam@diu.iiitvadodara.ac.in', '+91 98765 43212', 'B.Tech', 'CSE', '2023', 'B.Tech CSE 2023', 'Semester 4', 'student', 'active', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80', 'Algorithms and Data Structures enthusiast. Member of IIITV-ICD Programming Club.', '{"email":true,"announcements":true,"community":true,"lostFound":true}'::jsonb),
('usr-admin-1', 'Rishikesh Gopal (Administrator)', 'rishiadmin', 'rishiadmin@diu.iiitvadodara.ac.in', '+91 2875 252011', 'Admin', 'Administration', '2023', 'Academic Office & Admin Control', 'Administration', 'admin', 'active', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', 'Lead Platform Administrator & System Moderator, IIIT Vadodara International Campus Diu.', '{"email":true,"announcements":true,"community":true,"lostFound":true}'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    roll_number = EXCLUDED.roll_number,
    college_email = EXCLUDED.college_email,
    phone_number = EXCLUDED.phone_number,
    role = EXCLUDED.role;

-- Seed Developers
INSERT INTO public.developers (id, name, role, year, batch, roll_number, quote, contact_phone, email, is_lead, bio, avatar)
VALUES
('dev-1', 'Rishikesh Gopal', 'Lead Full-Stack Architect & Website Controller', 'B.Tech CSE (2023-2027)', 'B.Tech CSE 2023-2027', '202311072', 'Building resilient digital ecosystems that transform daily campus life and empower student innovation.', '8340574363', '202311072@iiitvadodara.ac.in', TRUE, 'Lead Platform Developer & System Architect. Oversees end-to-end full-stack development, database architecture, and campus deployment.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'),
('dev-2', 'Sriya Reddy', 'Frontend Architect & UI/UX Designer', 'B.Tech CSE (2023-2027)', 'B.Tech CSE 2023-2027', '202311060', 'Design isn''t just aesthetic; it''s crafting effortless workflows that make campus technology intuitive for everyone.', '+91 98765 43211', '202311060@iiitvadodara.ac.in', FALSE, 'Engineered the modern dark aesthetic, high-contrast visual hierarchy, responsive layouts, and fluid micro-interactions across all eight modules.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80'),
('dev-3', 'Shivangi Goutam', 'Backend & Platform Systems Engineer', 'B.Tech CSE (2023-2027)', 'B.Tech CSE 2023-2027', '202311079', 'Reliable backends, robust schemas, and zero-compromise security turn ambitious ideas into sustainable platforms.', '+91 98765 43212', '202311079@iiitvadodara.ac.in', FALSE, 'Architected the persistent data store, offline resilience, real file storage, and data validation services powering student services.', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    batch = EXCLUDED.batch,
    roll_number = EXCLUDED.roll_number,
    quote = EXCLUDED.quote,
    contact_phone = EXCLUDED.contact_phone,
    email = EXCLUDED.email;

-- Seed Academic Routines (108 entries across Semesters 1 to 8)
INSERT INTO public.academic_routines (id, subject, code, faculty, room, day, start_time, end_time, type, semester, stream, branch, batch_year, batch)
VALUES
('rt-s1-mon-1', 'Introduction to Computer Programming', 'CS101', 'CS Faculty', 'Room 2118', 'Monday', '08:00 AM', '09:15 AM', 'Lecture', 'Semester 1', 'B.Tech', 'CSE', '2024', 'B.Tech CSE 2024'),
('rt-s1-mon-2', 'Mathematics I (Calculus & Linear Algebra)', 'MA101', 'Maths Faculty', 'Room 2118', 'Monday', '09:30 AM', '10:45 AM', 'Lecture', 'Semester 1', 'B.Tech', 'CSE', '2024', 'B.Tech CSE 2024'),
('rt-s1-mon-3', 'Engineering Physics Lab (Batch LD1)', 'PH161', 'Physics Faculty / Lab Staff', 'PHY LAB - LD1', 'Monday', '02:00 PM', '04:00 PM', 'Lab', 'Semester 1', 'B.Tech', 'CSE', '2024', 'B.Tech CSE 2024'),
('rt-s1-tue-1', 'Engineering Physics', 'PH101', 'Physics Faculty', 'Room 2113', 'Tuesday', '08:00 AM', '09:15 AM', 'Lecture', 'Semester 1', 'B.Tech', 'CSE', '2024', 'B.Tech CSE 2024'),
('rt-s1-tue-2', 'English & Professional Communication', 'HS101', 'Humanities Faculty', 'Room 2113', 'Tuesday', '09:30 AM', '11:15 AM', 'Lecture', 'Semester 1', 'B.Tech', 'CSE', '2024', 'B.Tech CSE 2024'),
('rt-s1-tue-3', 'Basic Electronics Lab (Batch LD1)', 'EC161', 'EC Instructors', 'Room 2221 - 2224 - LD1', 'Tuesday', '11:30 AM', '02:30 PM', 'Lab', 'Semester 1', 'B.Tech', 'CSE', '2024', 'B.Tech CSE 2024'),
('rt-s1-tue-4', 'Basic Electronics Lab (Batch LD2)', 'EC161', 'EC Instructors', 'Room 2221 - 2224 - LD2', 'Tuesday', '03:00 PM', '06:00 PM', 'Lab', 'Semester 1', 'B.Tech', 'CSE', '2024', 'B.Tech CSE 2024'),
('rt-s1-wed-1', 'Introduction to Computer Programming', 'CS101', 'CS Faculty', 'Room 2118', 'Wednesday', '08:00 AM', '09:15 AM', 'Lecture', 'Semester 1', 'B.Tech', 'CSE', '2024', 'B.Tech CSE 2024'),
('rt-s1-wed-2', 'Basic Electronics', 'EC101', 'EC Faculty', 'Room 2118', 'Wednesday', '09:30 AM', '10:45 AM', 'Lecture', 'Semester 1', 'B.Tech', 'CSE', '2024', 'B.Tech CSE 2024'),
('rt-s1-wed-3', 'Computer Programming Lab (Batches LD1 + LD2)', 'CS161', 'CS Lab Staff', 'Room 2104 - 2105 - LD1+LD2', 'Wednesday', '11:00 AM', '02:00 PM', 'Lab', 'Semester 1', 'B.Tech', 'CSE', '2024', 'B.Tech CSE 2024'),
('rt-s1-thu-1', 'Engineering Physics', 'PH101', 'Physics Faculty', 'Room 2118', 'Thursday', '09:30 AM', '10:45 AM', 'Lecture', 'Semester 1', 'B.Tech', 'CSE', '2024', 'B.Tech CSE 2024'),
('rt-s1-thu-2', 'Communication Skills Language Lab (LD1 + LD2)', 'HS101', 'Humanities Faculty', 'Room 2118 - LD1+LD2', 'Thursday', '01:15 PM', '03:15 PM', 'Lab', 'Semester 1', 'B.Tech', 'CSE', '2024', 'B.Tech CSE 2024'),
('rt-s1-thu-3', 'Engineering Physics Lab (Batch LD2)', 'PH161', 'Physics Faculty', 'PHY LAB - LD2', 'Thursday', '04:00 PM', '06:00 PM', 'Lab', 'Semester 1', 'B.Tech', 'CSE', '2024', 'B.Tech CSE 2024'),
('rt-s1-fri-1', 'Basic Electronics', 'EC101', 'EC Faculty', 'Room 2118', 'Friday', '08:00 AM', '09:15 AM', 'Lecture', 'Semester 1', 'B.Tech', 'CSE', '2024', 'B.Tech CSE 2024'),
('rt-s1-fri-2', 'Mathematics I (Calculus & Linear Algebra)', 'MA101', 'Maths Faculty', 'Room 2118', 'Friday', '09:30 AM', '10:45 AM', 'Lecture', 'Semester 1', 'B.Tech', 'CSE', '2024', 'B.Tech CSE 2024'),
('rt-s1-fri-3', 'Engineering Physics Tutorial', 'PH101', 'Physics Faculty', 'Room 2113', 'Friday', '12:00 PM', '01:00 PM', 'Tutorial', 'Semester 1', 'B.Tech', 'CSE', '2024', 'B.Tech CSE 2024'),
('rt-s1-fri-4', 'Basic Electronics Tutorial', 'EC101', 'EC Faculty', 'Room 2113', 'Friday', '02:00 PM', '03:00 PM', 'Tutorial', 'Semester 1', 'B.Tech', 'CSE', '2024', 'B.Tech CSE 2024'),
('rt-s1-fri-5', 'Mathematics I Tutorial', 'MA101', 'Maths Faculty', 'Room 2118', 'Friday', '03:00 PM', '04:00 PM', 'Tutorial', 'Semester 1', 'B.Tech', 'CSE', '2024', 'B.Tech CSE 2024'),
('rt-s3-mon-1', 'Digital Logic & Microprocessors (Tutorial)', 'EC201', 'EC Faculty', 'Room 2118', 'Monday', '11:15 AM', '12:30 PM', 'Tutorial', 'Semester 3', 'B.Tech', 'CSE', '2023', 'B.Tech CSE 2023'),
('rt-s3-mon-2', 'Digital Logic & Microprocessors', 'EC201', 'EC Faculty', 'Room 2118', 'Monday', '01:45 PM', '03:00 PM', 'Lecture', 'Semester 3', 'B.Tech', 'CSE', '2023', 'B.Tech CSE 2023'),
('rt-s3-tue-1', 'Data Structures & Algorithms Lab', 'CS203L', 'CS Faculty / TAs', 'Computing Lab 1 (Ground Floor)', 'Tuesday', '09:00 AM', '11:00 AM', 'Lab', 'Semester 3', 'B.Tech', 'CSE', '2023', 'B.Tech CSE 2023'),
('rt-s3-tue-2', 'Mathematics III (Discrete Mathematics)', 'MA201', 'Dr. P. Trivedi', 'Room 2118', 'Tuesday', '11:15 AM', '12:30 PM', 'Lecture', 'Semester 3', 'B.Tech', 'CSE', '2023', 'B.Tech CSE 2023'),
('rt-s3-tue-3', 'Data Structures & Algorithms', 'CS203', 'Dr. S. K. Patel', 'Room 2118', 'Tuesday', '01:45 PM', '03:00 PM', 'Lecture', 'Semester 3', 'B.Tech', 'CSE', '2023', 'B.Tech CSE 2023'),
('rt-s3-wed-1', 'Object Oriented Programming Lab', 'CS201L', 'CS Faculty / TAs', 'Computing Lab 2', 'Wednesday', '08:00 AM', '10:00 AM', 'Lab', 'Semester 3', 'B.Tech', 'CSE', '2023', 'B.Tech CSE 2023'),
('rt-s3-wed-2', 'Principles of Economics', 'HS201', 'Humanities Faculty', 'Room 2118', 'Wednesday', '11:15 AM', '12:30 PM', 'Lecture', 'Semester 3', 'B.Tech', 'CSE', '2023', 'B.Tech CSE 2023'),
('rt-s3-wed-3', 'Object Oriented Programming', 'CS201', 'CS Faculty', 'Room 2118', 'Wednesday', '01:45 PM', '03:00 PM', 'Lecture', 'Semester 3', 'B.Tech', 'CSE', '2023', 'B.Tech CSE 2023'),
('rt-s3-wed-4', 'Object Oriented Programming (Tutorial)', 'CS201', 'CS Faculty', 'Room 2118', 'Wednesday', '03:15 PM', '04:30 PM', 'Tutorial', 'Semester 3', 'B.Tech', 'CSE', '2023', 'B.Tech CSE 2023'),
('rt-s3-thu-1', 'Digital Logic & Microprocessors', 'EC201', 'EC Faculty', 'Room 2118', 'Thursday', '11:15 AM', '12:30 PM', 'Lecture', 'Semester 3', 'B.Tech', 'CSE', '2023', 'B.Tech CSE 2023'),
('rt-s3-thu-2', 'Mathematics III (Discrete Mathematics)', 'MA201', 'Dr. P. Trivedi', 'Room 2118', 'Thursday', '01:45 PM', '03:00 PM', 'Lecture', 'Semester 3', 'B.Tech', 'CSE', '2023', 'B.Tech CSE 2023'),
('rt-s3-fri-1', 'Digital Electronics Lab', 'EC201L', 'EC Instructors', 'Hardware Lab (Room 2221)', 'Friday', '09:00 AM', '11:00 AM', 'Lab', 'Semester 3', 'B.Tech', 'CSE', '2023', 'B.Tech CSE 2023'),
('rt-s3-fri-2', 'Data Structures & Algorithms', 'CS203', 'Dr. S. K. Patel', 'Room 2118', 'Friday', '11:15 AM', '12:30 PM', 'Lecture', 'Semester 3', 'B.Tech', 'CSE', '2023', 'B.Tech CSE 2023'),
('rt-1', 'Software Engineering', 'CS401', 'Prof. R. Mehta', 'Room 204 (Edu Hub)', 'Monday', '09:00 AM', '10:00 AM', 'Lecture', 'Semester 4', 'B.Tech', 'CSE', '2023', 'B.Tech CSE 2023'),
('rt-2', 'Database Management Systems', 'CS402', 'Dr. S. K. Patel', 'Room 204 (Edu Hub)', 'Monday', '10:15 AM', '11:15 AM', 'Lecture', 'Semester 4', 'B.Tech', 'CSE', '2023', 'B.Tech CSE 2023'),
('rt-3', 'Operating Systems Lab', 'CS403L', 'Dr. V. Joshi / TAs', 'Computing Lab 2 (Ground Floor)', 'Monday', '02:00 PM', '04:00 PM', 'Lab', 'Semester 4', 'B.Tech', 'CSE', '2023', 'B.Tech CSE 2023'),
('rt-4', 'Design & Analysis of Algorithms', 'CS404', 'Dr. N. Dave', 'Room 205 (Edu Hub)', 'Tuesday', '09:00 AM', '10:00 AM', 'Lecture', 'Semester 4', 'B.Tech', 'CSE', '2023', 'B.Tech CSE 2023'),
('rt-5', 'Computer Networks', 'CS405', 'Prof. A. Shah', 'Room 205 (Edu Hub)', 'Tuesday', '10:15 AM', '11:15 AM', 'Lecture', 'Semester 4', 'B.Tech', 'CSE', '2023', 'B.Tech CSE 2023'),
('rt-6', 'DBMS Lab Session', 'CS402L', 'Dr. S. K. Patel', 'Computing Lab 1', 'Tuesday', '02:00 PM', '04:00 PM', 'Lab', 'Semester 4', 'B.Tech', 'CSE', '2023', 'B.Tech CSE 2023'),
('rt-7', 'Discrete Mathematics', 'MA401', 'Dr. P. Trivedi', 'Room 204 (Edu Hub)', 'Wednesday', '10:15 AM', '11:15 AM', 'Lecture', 'Semester 4', 'B.Tech', 'CSE', '2023', 'B.Tech CSE 2023'),
('rt-8', 'Software Engineering', 'CS401', 'Prof. R. Mehta', 'Room 204 (Edu Hub)', 'Thursday', '09:00 AM', '10:00 AM', 'Lecture', 'Semester 4', 'B.Tech', 'CSE', '2023', 'B.Tech CSE 2023'),
('rt-9', 'Computer Networks Lab', 'CS405L', 'Prof. A. Shah', 'Computing Lab 1', 'Friday', '02:00 PM', '04:00 PM', 'Lab', 'Semester 4', 'B.Tech', 'CSE', '2023', 'B.Tech CSE 2023'),
('rt-s5-mon-1', 'Formal Language & Automata Theory (FLAT Tutorial)', 'CS301', 'CS Faculty', 'Room 2109', 'Monday', '11:00 AM', '12:00 PM', 'Tutorial', 'Semester 5', 'B.Tech', 'CSE', '2022', 'B.Tech CSE 2022'),
('rt-s5-mon-2', 'Computer Networks (CN)', 'CS302', 'Prof. A. Shah', 'Room 2109', 'Monday', '03:15 PM', '04:45 PM', 'Lecture', 'Semester 5', 'B.Tech', 'CSE', '2022', 'B.Tech CSE 2022'),
('rt-s5-mon-3', 'Cryptography & Network Security (CRYPTO)', 'CS303', 'Dr. V. Joshi', 'Room 2109', 'Monday', '04:45 PM', '06:15 PM', 'Lecture', 'Semester 5', 'B.Tech', 'CSE', '2022', 'B.Tech CSE 2022'),
('rt-s5-tue-1', 'Operating Systems (OS)', 'CS304', 'Dr. V. Joshi', 'Room 2109', 'Tuesday', '03:15 PM', '04:45 PM', 'Lecture', 'Semester 5', 'B.Tech', 'CSE', '2022', 'B.Tech CSE 2022'),
('rt-s5-tue-2', 'Formal Language & Automata Theory (FLAT)', 'CS301', 'CS Faculty', 'Room 2109', 'Tuesday', '04:45 PM', '06:15 PM', 'Lecture', 'Semester 5', 'B.Tech', 'CSE', '2022', 'B.Tech CSE 2022'),
('rt-s5-wed-1', 'Computer Networks Lab (CN Lab)', 'CS302L', 'Prof. A. Shah / Lab Staff', 'Computing Lab 1 (Ground Floor)', 'Wednesday', '11:15 AM', '01:00 PM', 'Lab', 'Semester 5', 'B.Tech', 'CSE', '2022', 'B.Tech CSE 2022'),
('rt-s5-wed-2', 'Artificial Intelligence (AI)', 'CS305', 'Dr. AI Specialist', 'Room 2109', 'Wednesday', '03:15 PM', '04:45 PM', 'Lecture', 'Semester 5', 'B.Tech', 'CSE', '2022', 'B.Tech CSE 2022'),
('rt-s5-wed-3', 'Computer Networks (CN)', 'CS302', 'Prof. A. Shah', 'Room 2109', 'Wednesday', '04:45 PM', '06:15 PM', 'Lecture', 'Semester 5', 'B.Tech', 'CSE', '2022', 'B.Tech CSE 2022'),
('rt-s5-thu-1', 'Cryptography & Network Security Lab (CRYPTO Lab)', 'CS303L', 'Dr. V. Joshi / Staff', 'Computing Lab 2', 'Thursday', '09:00 AM', '11:15 AM', 'Lab', 'Semester 5', 'B.Tech', 'CSE', '2022', 'B.Tech CSE 2022'),
('rt-s5-thu-2', 'Operating Systems Lab (OS Lab)', 'CS304L', 'OS Lab Staff', 'Computing Lab 2', 'Thursday', '11:15 AM', '01:00 PM', 'Lab', 'Semester 5', 'B.Tech', 'CSE', '2022', 'B.Tech CSE 2022'),
('rt-s5-thu-3', 'Cryptography & Network Security (CRYPTO)', 'CS303', 'Dr. V. Joshi', 'Room 2109', 'Thursday', '03:15 PM', '04:45 PM', 'Lecture', 'Semester 5', 'B.Tech', 'CSE', '2022', 'B.Tech CSE 2022'),
('rt-s5-thu-4', 'Operating Systems (OS)', 'CS304', 'Dr. V. Joshi', 'Room 2109', 'Thursday', '04:45 PM', '06:15 PM', 'Lecture', 'Semester 5', 'B.Tech', 'CSE', '2022', 'B.Tech CSE 2022'),
('rt-s5-fri-1', 'Artificial Intelligence Lab (AI Lab)', 'CS305L', 'AI Lab Staff', 'Computing Lab 1', 'Friday', '11:15 AM', '01:00 PM', 'Lab', 'Semester 5', 'B.Tech', 'CSE', '2022', 'B.Tech CSE 2022'),
('rt-s5-fri-2', 'Formal Language & Automata Theory (FLAT)', 'CS301', 'CS Faculty', 'Room 2109', 'Friday', '03:15 PM', '04:45 PM', 'Lecture', 'Semester 5', 'B.Tech', 'CSE', '2022', 'B.Tech CSE 2022'),
('rt-s5-fri-3', 'Artificial Intelligence (AI)', 'CS305', 'Dr. AI Specialist', 'Room 2109', 'Friday', '04:45 PM', '06:15 PM', 'Lecture', 'Semester 5', 'B.Tech', 'CSE', '2022', 'B.Tech CSE 2022'),
('rt-s7-mon-1', 'Cloud Computing Lab', 'CS447', 'Prof. R. Mehta', 'Room 2108 / 2109', 'Monday', '01:00 PM', '02:45 PM', 'Lab', 'Semester 7', 'B.Tech', 'CSE', '2021', 'B.Tech CSE 2021'),
('rt-s7-mon-2', 'Topics in Deep Learning / Software & Cyber Security', 'CS433/CS445', 'Dr. Deep Learning / Security Faculty', 'Room 2127 / Room 2229', 'Monday', '03:15 PM', '04:30 PM', 'Lecture', 'Semester 7', 'B.Tech', 'CSE', '2021', 'B.Tech CSE 2021'),
('rt-s7-mon-3', 'Cloud System Management', 'IT403', 'Cloud Faculty', 'Room 2127', 'Monday', '04:45 PM', '06:00 PM', 'Lecture', 'Semester 7', 'B.Tech', 'CSE', '2021', 'B.Tech CSE 2021'),
('rt-s7-tue-1', 'Topics in Deep Learning Lab / Cyber Security Lab', 'CS433L/CS445L', 'Lab Instructors', 'Room 2102 / Room 2109', 'Tuesday', '11:15 AM', '01:15 PM', 'Lab', 'Semester 7', 'B.Tech', 'CSE', '2021', 'B.Tech CSE 2021'),
('rt-s7-tue-2', 'Introduction to Remote Sensing', 'CS449', 'Remote Sensing Faculty', 'Room 2109', 'Tuesday', '04:45 PM', '06:00 PM', 'Lecture', 'Semester 7', 'B.Tech', 'CSE', '2021', 'B.Tech CSE 2021'),
('rt-s7-wed-1', 'Computer Graphics and Multimedia', 'EC425', 'Multimedia Faculty', 'Room 2127', 'Wednesday', '01:45 PM', '03:15 PM', 'Lecture', 'Semester 7', 'B.Tech', 'CSE', '2021', 'B.Tech CSE 2021'),
('rt-s7-wed-2', 'Cloud Computing & Virtualization', 'CS447', 'Prof. R. Mehta', 'Room 2109', 'Wednesday', '03:15 PM', '04:30 PM', 'Lecture', 'Semester 7', 'B.Tech', 'CSE', '2021', 'B.Tech CSE 2021'),
('rt-s7-wed-3', 'Topics in Deep Learning / Software & Cyber Security', 'CS433/CS445', 'Dr. Deep Learning / Security Faculty', 'Room 2127 / Room 2109', 'Wednesday', '04:45 PM', '06:00 PM', 'Lecture', 'Semester 7', 'B.Tech', 'CSE', '2021', 'B.Tech CSE 2021'),
('rt-s7-thu-1', 'Cloud Computing & Virtualization', 'CS447', 'Prof. R. Mehta', 'Room 2109', 'Thursday', '03:15 PM', '04:30 PM', 'Lecture', 'Semester 7', 'B.Tech', 'CSE', '2021', 'B.Tech CSE 2021'),
('rt-s7-thu-2', 'Introduction to Remote Sensing', 'CS449', 'Remote Sensing Faculty', 'Room 2109', 'Thursday', '04:45 PM', '06:00 PM', 'Lecture', 'Semester 7', 'B.Tech', 'CSE', '2021', 'B.Tech CSE 2021'),
('rt-s7-fri-1', 'Computer Graphics and Multimedia', 'EC425', 'Multimedia Faculty', 'Room 2229', 'Friday', '01:00 PM', '02:45 PM', 'Lecture', 'Semester 7', 'B.Tech', 'CSE', '2021', 'B.Tech CSE 2021'),
('rt-s7-fri-2', 'Cloud System Management', 'IT403', 'Cloud Faculty', 'Room 2109', 'Friday', '03:15 PM', '04:30 PM', 'Lecture', 'Semester 7', 'B.Tech', 'CSE', '2021', 'B.Tech CSE 2021'),
('rt-s2-mon-1', 'Data Structures & Algorithms', 'CS102', 'CS Faculty', 'Room 2118', 'Monday', '09:00 AM', '10:15 AM', 'Lecture', 'Semester 2', 'B.Tech', 'CSE', '2024', 'B.Tech CSE 2024'),
('rt-s2-mon-2', 'Digital Logic Design', 'EC101', 'ECE Faculty', 'Room 2118', 'Monday', '10:30 AM', '11:45 AM', 'Lecture', 'Semester 2', 'B.Tech', 'CSE', '2024', 'B.Tech CSE 2024'),
('rt-s2-mon-3', 'Data Structures Lab', 'CS102L', 'CS Faculty & Lab Staff', 'Computing Lab 1', 'Monday', '02:00 PM', '04:00 PM', 'Lab', 'Semester 2', 'B.Tech', 'CSE', '2024', 'B.Tech CSE 2024'),
('rt-s2-tue-1', 'Discrete Mathematics', 'MA102', 'Maths Faculty', 'Room 2118', 'Tuesday', '09:00 AM', '10:15 AM', 'Lecture', 'Semester 2', 'B.Tech', 'CSE', '2024', 'B.Tech CSE 2024'),
('rt-s2-tue-2', 'Physics II (Electromagnetism & Optics)', 'SC102', 'Physics Faculty', 'Room 2118', 'Tuesday', '10:30 AM', '11:45 AM', 'Lecture', 'Semester 2', 'B.Tech', 'CSE', '2024', 'B.Tech CSE 2024'),
('rt-s2-wed-1', 'Data Structures & Algorithms', 'CS102', 'CS Faculty', 'Room 2118', 'Wednesday', '09:00 AM', '10:15 AM', 'Lecture', 'Semester 2', 'B.Tech', 'CSE', '2024', 'B.Tech CSE 2024'),
('rt-s2-wed-2', 'Web Development Fundamentals', 'IT102', 'IT Faculty', 'Room 2118', 'Wednesday', '10:30 AM', '11:45 AM', 'Lecture', 'Semester 2', 'B.Tech', 'CSE', '2024', 'B.Tech CSE 2024'),
('rt-s2-wed-3', 'Digital Electronics Lab', 'EC101L', 'ECE Faculty & Lab Staff', 'HARDWARE LAB', 'Wednesday', '02:00 PM', '04:00 PM', 'Lab', 'Semester 2', 'B.Tech', 'CSE', '2024', 'B.Tech CSE 2024'),
('rt-s2-thu-1', 'Discrete Mathematics', 'MA102', 'Maths Faculty', 'Room 2118', 'Thursday', '09:00 AM', '10:15 AM', 'Lecture', 'Semester 2', 'B.Tech', 'CSE', '2024', 'B.Tech CSE 2024'),
('rt-s2-thu-2', 'Digital Logic Design', 'EC101', 'ECE Faculty', 'Room 2118', 'Thursday', '10:30 AM', '11:45 AM', 'Lecture', 'Semester 2', 'B.Tech', 'CSE', '2024', 'B.Tech CSE 2024'),
('rt-s2-fri-1', 'Physics II (Electromagnetism & Optics)', 'SC102', 'Physics Faculty', 'Room 2118', 'Friday', '09:00 AM', '10:15 AM', 'Lecture', 'Semester 2', 'B.Tech', 'CSE', '2024', 'B.Tech CSE 2024'),
('rt-s2-fri-2', 'Web Development Lab', 'IT102L', 'IT Faculty', 'Computing Lab 2', 'Friday', '10:30 AM', '12:30 PM', 'Lab', 'Semester 2', 'B.Tech', 'CSE', '2024', 'B.Tech CSE 2024'),
('rt-s6-mon-1', 'Computer Networks', 'CS302', 'Prof. A. Shah', 'Room 2115', 'Monday', '09:00 AM', '10:15 AM', 'Lecture', 'Semester 6', 'B.Tech', 'CSE', '2022', 'B.Tech CSE 2022'),
('rt-s6-mon-2', 'Compiler Design', 'CS304', 'Dr. V. Trivedi', 'Room 2115', 'Monday', '10:30 AM', '11:45 AM', 'Lecture', 'Semester 6', 'B.Tech', 'CSE', '2022', 'B.Tech CSE 2022'),
('rt-s6-mon-3', 'Network Socket Programming Lab', 'CS302L', 'Prof. A. Shah', 'Computing Lab 3', 'Monday', '02:00 PM', '04:00 PM', 'Lab', 'Semester 6', 'B.Tech', 'CSE', '2022', 'B.Tech CSE 2022'),
('rt-s6-tue-1', 'Software Engineering & Agile Lifecycle', 'CS306', 'Prof. P. Patel', 'Room 2115', 'Tuesday', '09:00 AM', '10:15 AM', 'Lecture', 'Semester 6', 'B.Tech', 'CSE', '2022', 'B.Tech CSE 2022'),
('rt-s6-tue-2', 'Machine Learning & Pattern Recognition', 'CS308', 'Dr. S. Kulkarni', 'Room 2115', 'Tuesday', '10:30 AM', '11:45 AM', 'Lecture', 'Semester 6', 'B.Tech', 'CSE', '2022', 'B.Tech CSE 2022'),
('rt-s6-wed-1', 'Computer Networks', 'CS302', 'Prof. A. Shah', 'Room 2115', 'Wednesday', '09:00 AM', '10:15 AM', 'Lecture', 'Semester 6', 'B.Tech', 'CSE', '2022', 'B.Tech CSE 2022'),
('rt-s6-wed-2', 'Compiler Design', 'CS304', 'Dr. V. Trivedi', 'Room 2115', 'Wednesday', '10:30 AM', '11:45 AM', 'Lecture', 'Semester 6', 'B.Tech', 'CSE', '2022', 'B.Tech CSE 2022'),
('rt-s6-wed-3', 'Machine Learning & AI Lab', 'CS308L', 'Dr. S. Kulkarni', 'Computing Lab 3', 'Wednesday', '02:00 PM', '04:00 PM', 'Lab', 'Semester 6', 'B.Tech', 'CSE', '2022', 'B.Tech CSE 2022'),
('rt-s6-thu-1', 'Software Engineering & Architecture', 'CS306', 'Prof. P. Patel', 'Room 2115', 'Thursday', '09:00 AM', '10:15 AM', 'Lecture', 'Semester 6', 'B.Tech', 'CSE', '2022', 'B.Tech CSE 2022'),
('rt-s6-thu-2', 'Distributed Systems & Cloud Platforms', 'CS310', 'Prof. R. Mehta', 'Room 2115', 'Thursday', '10:30 AM', '11:45 AM', 'Lecture', 'Semester 6', 'B.Tech', 'CSE', '2022', 'B.Tech CSE 2022'),
('rt-s6-fri-1', 'Compiler Lex/Yacc Implementation Lab', 'CS304L', 'Dr. V. Trivedi', 'Computing Lab 1', 'Friday', '09:00 AM', '11:00 AM', 'Lab', 'Semester 6', 'B.Tech', 'CSE', '2022', 'B.Tech CSE 2022'),
('rt-s6-fri-2', 'Technical Seminar & Capstone Prep', 'CS312', 'Department Committee', 'Seminar Hall', 'Friday', '02:00 PM', '04:00 PM', 'Tutorial', 'Semester 6', 'B.Tech', 'CSE', '2022', 'B.Tech CSE 2022'),
('rt-s8-mon-1', 'Cloud Computing & Virtualization', 'CS402', 'Cloud Faculty', 'Room 2109', 'Monday', '09:00 AM', '10:15 AM', 'Lecture', 'Semester 8', 'B.Tech', 'CSE', '2021', 'B.Tech CSE 2021'),
('rt-s8-mon-2', 'B.Tech Major Capstone Mentorship', 'CS499', 'Project Review Board', 'Project Lab 4', 'Monday', '10:30 AM', '01:00 PM', 'Lab', 'Semester 8', 'B.Tech', 'CSE', '2021', 'B.Tech CSE 2021'),
('rt-s8-tue-1', 'Cyber Security & Digital Forensics', 'CS404', 'Security Faculty', 'Room 2109', 'Tuesday', '09:00 AM', '10:15 AM', 'Lecture', 'Semester 8', 'B.Tech', 'CSE', '2021', 'B.Tech CSE 2021'),
('rt-s8-tue-2', 'High Performance & GPU Computing', 'CS406', 'Systems Faculty', 'Room 2109', 'Tuesday', '10:30 AM', '11:45 AM', 'Lecture', 'Semester 8', 'B.Tech', 'CSE', '2021', 'B.Tech CSE 2021'),
('rt-s8-wed-1', 'B.Tech Capstone Project Progress Reviews', 'CS499', 'Project Review Board', 'Project Lab 4', 'Wednesday', '09:00 AM', '01:00 PM', 'Lab', 'Semester 8', 'B.Tech', 'CSE', '2021', 'B.Tech CSE 2021'),
('rt-s8-thu-1', 'Cloud Computing & Virtualization', 'CS402', 'Cloud Faculty', 'Room 2109', 'Thursday', '09:00 AM', '10:15 AM', 'Lecture', 'Semester 8', 'B.Tech', 'CSE', '2021', 'B.Tech CSE 2021'),
('rt-s8-thu-2', 'Cyber Security & Digital Forensics', 'CS404', 'Security Faculty', 'Room 2109', 'Thursday', '10:30 AM', '11:45 AM', 'Lecture', 'Semester 8', 'B.Tech', 'CSE', '2021', 'B.Tech CSE 2021'),
('rt-s8-fri-1', 'Industry Internship / Research Colloquium', 'CS408', 'Training & Placement Cell', 'Auditorium', 'Friday', '10:00 AM', '12:00 PM', 'Lecture', 'Semester 8', 'B.Tech', 'CSE', '2021', 'B.Tech CSE 2021'),
('rt-ai-mon-1', 'Artificial Intelligence & Search Strategies', 'AI201', 'Dr. AI Specialist', 'Room 2110', 'Monday', '09:00 AM', '10:15 AM', 'Lecture', 'Semester 1', 'B.Tech', 'AI', '2025', 'B.Tech AI 2025'),
('rt-ai-tue-1', 'Foundations of Data Science & Probabilistic Models', 'DS201', 'Data Science Faculty', 'Room 2110', 'Tuesday', '10:30 AM', '11:45 AM', 'Lecture', 'Semester 1', 'B.Tech', 'AI', '2025', 'B.Tech AI 2025'),
('rt-ai-wed-1', 'Python AI & Deep Learning Lab', 'AI201L', 'AI Lab Staff', 'AI & GPU Lab', 'Wednesday', '02:00 PM', '04:00 PM', 'Lab', 'Semester 1', 'B.Tech', 'AI', '2025', 'B.Tech AI 2025'),
('rt-cyber-mon-1', 'Introduction to Cyber Defense & Security Principles', 'CY201', 'Cyber Security Lead', 'Room 2112', 'Monday', '10:30 AM', '11:45 AM', 'Lecture', 'Semester 1', 'B.Tech', 'Cyber Security', '2025', 'B.Tech Cyber Security 2025'),
('rt-cyber-thu-1', 'Network Security Protocols & Cryptography', 'CY202', 'Security Faculty', 'Room 2112', 'Thursday', '09:00 AM', '10:15 AM', 'Lecture', 'Semester 1', 'B.Tech', 'Cyber Security', '2025', 'B.Tech Cyber Security 2025'),
('rt-cyber-fri-1', 'Ethical Hacking & Network Defense Lab', 'CY201L', 'Cyber Lab Staff', 'Cyber Security Lab', 'Friday', '02:00 PM', '04:00 PM', 'Lab', 'Semester 1', 'B.Tech', 'Cyber Security', '2025', 'B.Tech Cyber Security 2025'),
('rt-ece-tue-1', 'Signals & Linear Systems', 'EC201', 'ECE Faculty', 'Room 2114', 'Tuesday', '09:00 AM', '10:15 AM', 'Lecture', 'Semester 1', 'B.Tech', 'ECE', '2025', 'B.Tech ECE 2025'),
('rt-ece-wed-1', 'Analog & Digital Communication Engineering', 'EC202', 'ECE Faculty', 'Room 2114', 'Wednesday', '10:30 AM', '11:45 AM', 'Lecture', 'Semester 1', 'B.Tech', 'ECE', '2025', 'B.Tech ECE 2025'),
('rt-ece-thu-1', 'DSP & Communication Hardware Lab', 'EC201L', 'ECE Lab Staff', 'DSP & Circuits Lab', 'Thursday', '02:00 PM', '04:00 PM', 'Lab', 'Semester 1', 'B.Tech', 'ECE', '2025', 'B.Tech ECE 2025')
ON CONFLICT (id) DO UPDATE SET
    subject = EXCLUDED.subject,
    code = EXCLUDED.code,
    faculty = EXCLUDED.faculty,
    room = EXCLUDED.room,
    day = EXCLUDED.day,
    start_time = EXCLUDED.start_time,
    end_time = EXCLUDED.end_time;

-- Seed 20 Curated Diu Places
INSERT INTO public.places (id, name, category, rating, reviews, description, location, distance_from_kevdi, opening_hours, image_url, map_url, website_url, is_verified, features)
VALUES
('plc-diu-fort', 'Diu Fort', 'Historic & Architectural Landmarks', 4.4, '23.2K', 'A massive 16th-century Portuguese fortress surrounded by the Arabian Sea on three sides, featuring old cannons, a lighthouse, and panoramic coastal views.', 'Fort Rd, near to PWD Office, Diu, Dadra and Nagar Haveli and Daman and Diu 362520', '6.2 km (~12 mins from Kevdi Campus)', 'Open daily • Sunrise to Sunset', '/images/explore/diu-fort.jpg', 'https://www.google.com/maps/dir//Fort+Rd,+near+to+PWD+Office,+Diu,+Dadra+and+Nagar+Haveli+and+Daman+and+Diu+362520/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x3be31cd1886d1e11:0x9f89a81e685e4cb0', 'http://diu.gov.in/', TRUE, '["Portuguese Architecture","Lighthouse Viewpoint","Ancient Canons","Sea Ramparts"]'::jsonb),
('plc-st-pauls', 'Saint Paul''s Church', 'Historic & Architectural Landmarks', 4.3, '3.0K', 'Built in 1610, this is an active and elaborately carved Portuguese-Gothic church dedicated to Our Lady of Immaculate Conception with intricate wood relief work.', 'PX7R+W6X, Diu, Dadra and Nagar Haveli and Daman and Diu 362520', '5.8 km (~12 mins from Kevdi Campus)', 'Open daily • 08:00 AM – 06:00 PM', '/images/explore/st-pauls-church.jpg', 'https://www.google.com/maps/dir//PX7R%2BW6X,+Diu,+Dadra+and+Nagar+Haveli+and+Daman+and+Diu+362520/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x3be31cd080c4399f:0x8f935013268c3a7a', 'https://ddd.gov.in/centers/st-pauls-church/', TRUE, '["Active Catholic Church","Portuguese-Gothic Carvings","Historic 1610 Altar","Peaceful Ambience"]'::jsonb),
('plc-naida-caves', 'Naida Caves', 'Historic & Architectural Landmarks', 4.4, '8.6K', 'A network of interlocking rock tunnels and sunlit chasms believed to have been formed by quarrying stones for the Diu Fort. Spectacular natural light rays.', 'Near Jalandhar Beach, Diu 362520', '5.2 km (~10 mins from Kevdi Campus)', 'Open daily • 07:00 AM – 06:30 PM', '/images/explore/naida-caves.jpg', 'https://www.google.com/maps/search/Naida+Caves+Diu', 'https://diu.gov.in/tourist-places/', TRUE, '["Rock Chasm Tunnels","Sunbeam Photography","Portuguese Quarry History","Free Entry"]'::jsonb),
('plc-pani-kotha', 'Pani Kotha (Fortim do Mar)', 'Historic & Architectural Landmarks', 4.3, '482', 'A stone-built fortress situated right in the middle of the sea, near the channel of Diu creek, featuring an ancient lighthouse and small chapel.', 'PX9W+M79, Fort Rd, Diu Creek, Dadra and Nagar Haveli and Daman and Diu 362540', '6.5 km to Diu Jetty (~15 mins)', 'Open daily • Accessible by boat from Fort Jetty', '/images/explore/pani-kotha.jpg', 'https://www.google.com/maps/dir//PX9W%2BM79,+Fort+Rd,+Diu,+Dadra+and+Nagar+Haveli+and+Daman+and+Diu+362540/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x3be31cd6a4f794ad:0x77d644cb9344c7', 'https://diu.gov.in/tourist-places/', TRUE, '["Sea Fortress","Boat Ride Access","Night Illumination","Creek Panorama"]'::jsonb),
('plc-zampa-gateway', 'Zampa Gateway', 'Historic & Architectural Landmarks', 4.5, '19', 'A historic, red-painted fortification gate featuring intricate carvings, lions, angels, and a perpetual artificial waterfall nearby.', 'PX7J+RH6, Zampa Rd, Diu, Dadra and Nagar Haveli and Daman and Diu 362520', '4.8 km (~10 mins)', 'Open 24 Hours • Public Heritage Landmark', '/images/explore/zampa-gateway.jpg', 'https://www.google.com/maps/dir//PX7J%2BRH6,+Zampa+Rd,+Diu,+Dadra+and+Nagar+Haveli+and+Daman+and+Diu+362520/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x3be31de912ae9cdd:0x6672e42a599bfc49', 'https://diu.gov.in/', TRUE, '["Red Fortification Wall","Perpetual Waterfall","Historical Town Gateway","Street Food Nearby"]'::jsonb),
('plc-st-francis', 'Church of St. Francis of Assisi', 'Historic & Architectural Landmarks', 4, '49', 'Constructed in 1593, this former Franciscan monastery overlooking the Arabian Sea now showcases historic religious architecture.', 'PX6Q+XMG, Unnamed Road, Diu, Dadra and Nagar Haveli and Daman and Diu 362520', '5.9 km (~12 mins)', 'Open daily • 08:30 AM – 06:00 PM', '/images/explore/st-francis-church.jpg', 'https://www.google.com/maps/dir//PX6Q%2BXMG,+Unnamed+Road,+Diu,+Dadra+and+Nagar+Haveli+and+Daman+and+Diu+362520/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x3be31cda6bdeea15:0x71d82f0038e4fdd4', 'https://diu.gov.in/tourist-places/', TRUE, '["1593 Franciscan Heritage","Ocean Overlook","Historic Bell Tower","Restored Sanctuary"]'::jsonb),
('plc-st-thomas-museum', 'St. Thomas Church Museum', 'Historic & Architectural Landmarks', 4.1, '21', 'Housed in a 1598 church, the Diu Museum displays ancient stone inscriptions, 400-year-old wooden carvings, and local historical artifacts.', 'PX8Q+6P6, Fort Approach Road, Diu, Dadra and Nagar Haveli and Daman and Diu 362520', '5.6 km (~11 mins)', 'Open daily • 09:00 AM – 06:00 PM', '/images/explore/st-thomas-museum.jpg', 'https://www.google.com/maps/dir//PX8Q%2B6P6,+Unnamed+Road,+Diu,+Dadra+and+Nagar+Haveli+and+Daman+and+Diu+362520/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x3be31dd753036f7f:0x57b2dcfce8a811a2', 'https://diu.gov.in/tourist-places/', TRUE, '["Artifacts & Sculptures","Stone Inscriptions","Gothic Ceiling","Audio-Visual Shows"]'::jsonb),
('plc-ins-khukri', 'INS Khukri Memorial', 'Historic & Architectural Landmarks', 4.6, '7.5K', 'A scenic, ship-shaped landscaped hill memorial honoring the brave Indian Navy sailors lost during the 1971 Indo-Pakistani War under Captain M.N. Mulla.', 'PX3G+4P7, Chakratirth Hill, Diu, Daman and Diu 362520', '5.0 km (~10 mins)', 'Open daily • Sunrise to Sunset', '/images/explore/ins-khukri.jpg', 'https://www.google.com/maps/dir//PX3G%2B4P7,+Diu,+Daman+and+Diu+362520/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x3be31cea42b3dde9:0x743bc7fffcc75fdf', 'https://diu.gov.in/tourist-places/', TRUE, '["Full-Scale Frigate Replica","1971 War Memorial","Amphitheater Seating","Panoramic Sunset View"]'::jsonb),
('plc-nagoa-beach', 'Nagoa Beach', 'Beaches & Coastal Spots', 4.3, '18.5K', 'Diu''s most famous horseshoe-shaped white-sand beach, popular for swimming, parasailing, jet-skiing, and unique African Hoka palm trees.', 'PW48+67F, Nagoa Beach Road, Diu 362520', '5.4 km (~10 mins via Nagoa Rd / Direct Govt Bus)', 'Open 24 Hours • Water Sports 09:00 AM – 06:00 PM', '/images/explore/nagoa-beach.jpg', 'https://www.google.com/maps/dir//PW48%2B67F,+Nagoa+Beach+Road,+362520/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x3be31d327d33fb75:0x16e3d4d4e5308b31', 'https://diu.gov.in/tourist-places/', TRUE, '["Water Sports (Jet Ski, Parasailing)","Safe Swimming Bay","Hoka Palm Trees","Beachside Cafes"]'::jsonb),
('plc-ghoghla-beach', 'Ghoghla Beach', 'Beaches & Coastal Spots', 4.6, '1.6K', 'An expansive, golden-sand Blue Flag certified beach offering water sports, a clean promenade, and a tranquil atmosphere.', 'Ghoghla Golden Promenade, Diu 362540', '8.5 km (~16 mins via Diu Bridge)', 'Open daily • 24 Hours', '/images/explore/ghoghla-beach.jpg', 'https://www.google.com/maps/dir//Ghoghla+Beach/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x3be302d357d90a37:0x2da328c3926bfc3a', 'https://diu.gov.in/tourist-places/', TRUE, '["Blue Flag Certified","Golden Sand Promenade","Surfing & Boating","Clean Facilities"]'::jsonb),
('plc-jalandhar-beach', 'Jalandhar Beach', 'Beaches & Coastal Spots', 4.4, '455', 'A peaceful, less-crowded beach near the town, known for a small hilltop shrine dedicated to the mythological demon Jalandhar.', 'Jalandhar Coastal Trail, Diu 362520', '5.3 km (~11 mins)', 'Open daily • 24 Hours', '/images/explore/jalandhar-beach.jpg', 'https://www.google.com/maps/dir//Dadra+and+Nagar+Haveli+and+Daman+and+Diu+362520/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x3be31cc48f7a07d9:0x2aad905bba0756d4', 'https://diu.gov.in/tourist-places/', TRUE, '["Jalandhar Shrine","Quiet Rocky Shore","Close to Naida Caves","Sunrise Spot"]'::jsonb),
('plc-chakratirth-beach', 'Chakratirth Beach', 'Beaches & Coastal Spots', 4.4, '705', 'A centrally located beach that blends scenic rocky paths with an open-air amphitheater and landscaped gardens right on the Arabian Sea.', 'Khukhari, Diu 362520', '5.1 km (~10 mins)', 'Open daily • 24 Hours', '/images/explore/chakratirth-beach.jpg', 'https://www.google.com/maps/dir//Khukhari,+Diu,+362520/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x3be31cea2fcb6ae1:0x3e657e5557ad88cc', 'https://diu.gov.in/tourist-places/', TRUE, '["Open-air Amphitheater","Landscaped Gardens","Lord Krishna Footprints Legend","Rocky Tidal Pools"]'::jsonb),
('plc-gomtimata-beach', 'Gomtimata Beach', 'Beaches & Coastal Spots', 4.6, '70', 'Located near Vanakbara, this quiet and remote stretch of sand is ideal for a serene sunset experience away from tourist crowds.', 'PV5F+JX9, Gomtimata, Saudwadi, Vanakbara, Diu 362570', '7.2 km (~14 mins west on Vanakbara route)', 'Open daily • 24 Hours', '/images/explore/gomtimata-beach.jpg', 'https://www.google.com/maps/dir//PV5F%2BJX9,+Gomtimata,+Saudwadi,+Vanakbara,+Dadra+and+Nagar+Haveli+and+Daman+and+Diu+362570/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x3be31f8438557aaf:0xf8ac962d2a0489f', 'https://diu.gov.in/tourist-places/', TRUE, '["Untouched Natural Beach","Gomtimata Temple","Vanakbara Harbor Vicinity","Serene Sunsets"]'::jsonb),
('plc-khukri-beach', 'Khukri Beach', 'Beaches & Coastal Spots', 4.5, '279', 'A neat coastal strip right next to the INS Khukri memorial area, famous for quiet evening walks and sunset views.', 'PX3G+CV4, Diu, Dadra and Nagar Haveli and Daman and Diu 362520', '5.0 km (~10 mins)', 'Open daily • 24 Hours', '/images/explore/khukri-beach.jpg', 'https://www.google.com/maps/dir//PX3G%2BCV4,+Diu,+Dadra+and+Nagar+Haveli+and+Daman+and+Diu+362520/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x3be31df939d6d3d5:0x1baa08892e6a4ddc', 'https://diu.gov.in/tourist-places/', TRUE, '["Adjacent to Naval Memorial","Elevated Walking Promenade","Cool Sea Breeze","Photography"]'::jsonb),
('plc-fort-beach', 'Fort Beach', 'Beaches & Coastal Spots', 4.5, '42', 'Stretching right along the perimeter of the main Diu Fort, offering a mix of historic rampart views and ocean air.', 'PX8W+8C7, Fort Rd, Diu, Dadra and Nagar Haveli and Daman and Diu 362540', '6.3 km (~13 mins)', 'Open daily • 24 Hours', '/images/explore/fort-beach.jpg', 'https://www.google.com/maps/dir//PX8W%2B8C7,+Fort+Rd,+Diu,+Dadra+and+Nagar+Haveli+and+Daman+and+Diu+362540/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x3be31d1382bcdd31:0x5c556716dde5bc0', 'https://diu.gov.in/tourist-places/', TRUE, '["Fort Sea Wall Backdrop","Historic Moat View","Fishermen Boats","Sea Breezes"]'::jsonb),
('plc-sunset-point', 'Ultimate Sunset Point', 'Beaches & Coastal Spots', 4.7, '53', 'A scenic hillock area near the western coast offering elevated views of the sun dipping into the Arabian Sea.', 'PX3G+MJ, Diu, Dadra and Nagar Haveli and Daman and Diu 362520', '4.9 km (~10 mins)', 'Open daily • Best during 05:30 PM – 06:45 PM', '/images/explore/sunset-point.jpg', 'https://www.google.com/maps/dir//PX3G%2BMJ,+Diu,+Dadra+and+Nagar+Haveli+and+Daman+and+Diu+362520/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x3be31d9b989e81b7:0xabd07f7f096e48d0', 'https://diu.gov.in/tourist-places/', TRUE, '["360° Arabian Sea Horizon","Highest Sunset Viewpoint","Photography Hotspot","Evening Breeze"]'::jsonb),
('plc-gangeshwar', 'Sri Gangeshwar Mahadev Temple', 'Temples, Nature & Family Attractions', 4.7, '10.4K', 'Located in Fudam village, this unique temple features five natural Shiva Lingas washed continuously by the waves of the Arabian Sea.', 'Fudam Seashore, Diu, Dadra and Nagar Haveli and Daman and Diu 362520', '3.8 km (~7 mins from Kevdi Campus)', 'Open daily • 06:00 AM – 08:00 PM (High Tide view recommended)', '/images/explore/gangeshwar-temple.jpg', 'https://www.google.com/maps/dir//Diu,+Dadra+and+Nagar+Haveli+and+Daman+and+Diu+362520/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x3be31cf7b6ab6db1:0x67ee1dd0565db52b', 'https://diu.gov.in/tourist-places/', TRUE, '["5 Tidal Shiva Lingas","Pandava Legend","Sea Wave Abhishekam","Close to College"]'::jsonb),
('plc-fudam-sanctuary', 'Fudam Bird Sanctuary', 'Temples, Nature & Family Attractions', 4.1, '765', 'A sprawling marshland and wetland ecosystem that serves as a haven for local and migratory bird species including flamingos and storks.', 'PX86+R4J, Diu, Fudam, Dadra and Nagar Haveli and Daman and Diu 362520', '3.2 km (~6 mins from Kevdi Campus)', 'Open daily • Sunrise to Sunset', '/images/explore/fudam-sanctuary.jpg', 'https://www.google.com/maps/dir//PX86%2BR4J,+Diu,+Fudam,+Dadra+and+Nagar+Haveli+and+Daman+and+Diu+362520/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x3be31cfea04ff9f3:0x310b36e2da1c13e8', 'http://fudam.in/?Id=1', TRUE, '["Migratory Flamingos","Watchtower Deck","Mangrove Ecosystem","Bird Photography"]'::jsonb),
('plc-dinosaur-park', 'Dinosaur Park', 'Temples, Nature & Family Attractions', 4.1, '2.1K', 'A family-friendly landscaped coastal park featuring giant dinosaur replicas, play areas, and walking promenades overlooking the ocean.', 'PW6M+PJR, Nagoa Beach Road, Diu 362520', '4.5 km (~9 mins)', 'Open daily • 10:00 AM – 07:00 PM', '/images/explore/dinosaur-park.jpg', 'https://www.google.com/maps/dir//PW6M%2BPJR,+Diu,+Dadra+and+Nagar+Haveli+and+Daman+and+Diu+362520/data=!4m6!4m5!1m1!4e2!1m2!1m1!1s0x3be31c4bd5f0c30f:0xe5a993b68128e1ed', 'https://diu.gov.in/tourist-places/', TRUE, '["Life-Size Dino Sculptures","Sound Effects","Children Play Zone","Seafront Lawns"]'::jsonb),
('plc-shell-museum', 'Shell Museum', 'Temples, Nature & Family Attractions', 3.7, '1.6K', 'Founded by Captain Devjibhai Fulbaria, exhibiting over 2,500 varieties of rare sea shells, mollusks, and marine specimens collected globally.', 'Nagoa Road, Diu 362520', '4.7 km (~9 mins)', 'Open daily • 09:30 AM – 06:30 PM', '/images/explore/shell-museum.jpg', 'https://www.google.com/maps/search/Shell+Museum+Diu', 'https://diu.gov.in/tourist-places/', TRUE, '["2,500+ Rare Sea Shells","Magnifying Glass Stations","Marine Education","Curio Gift Shop"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    rating = EXCLUDED.rating,
    reviews = EXCLUDED.reviews,
    description = EXCLUDED.description,
    location = EXCLUDED.location,
    image_url = EXCLUDED.image_url,
    map_url = EXCLUDED.map_url;

-- Seed Municipal Transport & Bus Routes
INSERT INTO public.transport_routes (id, route_name, source, destination, stops, departure_time, frequency, bus_number, driver_name, driver_contact, days_of_operation, notes)
VALUES
('tr-govt-1', 'Official Diu Govt Bus: Diu ⇄ Kevdi College ⇄ Vanakbara', 'Diu Main Bus Stand', 'Vanakbara Terminus (via Kevdi IIITV-ICD)', '["Diu Stand","Fudam","Kevdi (IIITV-ICD Gate)","Malala","Nagoa Crossing","Saudwadi","Vanakbara"]'::jsonb, '6:15 AM, 8:00 AM, 9:40 AM, 11:30 AM, 1:20 PM, 3:15 PM, 5:10 PM, 6:30 PM', 'Regular Municipal Schedule (Cost: Flat ₹10)', 'Diu Govt Municipal Shuttle', 'Asvinbhai (Mob. 9426402875)', '9426402875', 'All 7 Days', 'CAMPUS IS MIDWAY: Reaches IIITV-ICD Kevdi at ±10 minutes from departure from both ends. Cost ₹10 anywhere in Diu!'),
('tr-govt-2', 'Official Diu Govt Bus: Vanakbara ⇄ Kevdi College ⇄ Diu', 'Vanakbara Terminus', 'Diu Main Bus Stand (via Kevdi IIITV-ICD)', '["Vanakbara","Saudwadi","Nagoa Crossing","Kevdi (IIITV-ICD Gate)","Fudam","Diu Stand"]'::jsonb, '7:00 AM, 8:40 AM, 10:30 AM, 12:20 PM, 2:20 PM, 4:10 PM, 6:00 PM', 'Regular Municipal Schedule (Cost: Flat ₹10)', 'Diu Govt Municipal Shuttle', 'Asvinbhai (Mob. 9426402875)', '9426402875', 'All 7 Days', 'Reaches Kevdi IIITV-ICD gate at ±10 minutes after departure. Government flat rate: ₹10.'),
('tr-private-1', 'Ikbal Bhai Chagda Diu (Iconic 3-Wheeler Carrier)', 'Anywhere in Diu / Kevdi College Gate', 'Any Destination in Diu Island & Vanakbara', '["College Gate","Diu Town","Market","Hostel Block","Vanakbara Harbor"]'::jsonb, 'On Call / Available Full Day', 'Instant Phone Call Booking', 'Iconic Chagda Special', 'Ikbal Bhai Chagda', '+91 90162 70139', 'Daily', 'Large 3-wheeler Chagda. Perfect for luggage transport, grocery hauls, and group travel.'),
('tr-private-2', 'Jadega Van Diu (Somnath Temple, Gir & Outstation)', 'IIITV-ICD Kevdi Campus', 'Somnath, Veraval, Gir Forest, Junagadh, Rajkot', '["Kevdi College","Una","Kodinar","Veraval","Somnath Jyotirlinga"]'::jsonb, 'Custom Student Booking / Weekend Tours', 'Pre-book via Call', 'Private Van / Cab Fleet', 'Jadega Travel Desk', '97233 51488', 'All 7 Days', 'Dedicated outstation private van service. Best for Somnath Jyotirlinga and Gir Safari weekend student trips.'),
('tr-private-3', 'Diu Auto to Una Railway Station & Town', 'IIITV-ICD College Gate, Kevdi', 'Una Railway Junction & Una ST Stand', '["Kevdi Campus","Ghoghla Checkpost","Tad Bypass","Delwada","Una Station"]'::jsonb, 'On Call / Coordinated with Train Arrivals', 'Full Day Service', 'Una Direct Auto', 'Diu-Una Auto Desk', '+91 63530 01331', 'All 7 Days', 'Direct connection from college to Una Railway Junction for Western Railway trains.')
ON CONFLICT (id) DO UPDATE SET
    route_name = EXCLUDED.route_name,
    source = EXCLUDED.source,
    destination = EXCLUDED.destination,
    departure_time = EXCLUDED.departure_time;

-- Seed Local Speed-Dial Contacts (Saddam delivery, cakes, Chagda autos)
INSERT INTO public.local_services (id, category, name, phone, type, coverage, badge, notes)
VALUES
('srv-1', 'Local Autos & Chagdas', 'Ikbal Bhai Chagda Diu', '+91 90162 70139', 'Iconic Chagda 3-Wheeler Carrier', 'Diu City, Kevdi Campus, Vanakbara & Luggage Shifting', 'Group & Luggage Friendly', 'Classic Saurashtra-style 3-wheeler shared vehicle. Best for moving multiple students or hostel luggage from bus stand.'),
('srv-2', 'Local Autos & Chagdas', 'Diu Auto (Main Stand)', '+91 96646 21669', 'Local Auto Rickshaw', 'Diu Town ⇄ Kevdi IIITV-ICD College ⇄ Nagoa Beach', 'Local Auto', 'Fast response for student campus drop-offs and town trips.'),
('srv-3', 'Local Autos & Chagdas', 'Anil Diu Auto', '87993 04300', 'Local Auto Rickshaw', 'Diu Island, Kevdi, Jalandhar & Fort Rd', 'On-Call', 'Available on phone call for urgent pick-ups at college gate.'),
('srv-4', 'Outstation Vans & Cabs', 'Jadega Van Diu (Somnath & Outstation)', '97233 51488', 'Private Tourist Van / Cab (Omni/Eeco/Innova)', 'Outstation trips: Somnath Temple, Veraval, Gir National Park, Junagadh, Rajkot & Ahmedabad', 'Outstation Specialist', 'Dedicated out-of-Diu van service. Preferred by students for weekend pilgrimage to Somnath Temple and Gir Safaris.'),
('srv-5', 'Outstation Vans & Cabs', 'Diu Autooo To Una', '+91 63530 01331', 'Long Distance Auto Service', 'IIITV-ICD Kevdi ⇄ Una Railway Station & Una Bus Stand', 'Una Station Feeder', 'Direct connection from college to Una Railway Junction for Western Railway trains.'),
('srv-6', 'Bike Taxi & Mobile App', 'Rapido Bike Taxi (Mobile App)', 'Book via Rapido App', 'Two-Wheeler On-Demand Ride', 'Across Diu Island & Kevdi Campus', 'Check App Availability First', 'Rapido operates in Diu! Check driver availability on the mobile app before scheduling late night trips.'),
('srv-7', 'Food Delivery & Restaurants', 'Saddam (Market to College Delivery Boy)', '8200106584', 'Dedicated Student Delivery Courier', 'Diu Main Market ⇄ IIITV-ICD College & Hostels', 'College Delivery Boy', 'Delivers groceries, parcels, food packages, and medical items straight from Diu town market to college gate.'),
('srv-8', 'Food Delivery & Restaurants', 'Ambica Restaurant (Famous in College)', '9523020304', 'Top Rated Student Dine-in & Takeaway', 'North Indian, South Indian, Thalis & Student Meals', 'College Famous', 'The most popular restaurant among IIITV-ICD students for dinners, team celebrations, and regular meals.'),
('srv-9', 'Food Delivery & Restaurants', 'Shardha Restaurant', '9016746390', 'Family Restaurant & Student Tiffins', 'Gujarati, Punjabi & Chinese cuisine in Diu', 'Local Favorite', 'Delicious homestyle thalis and evening food parcels.'),
('srv-10', 'Food Delivery & Restaurants', 'Salim Briyani Diu', '+91 81400 45611', 'Dum Biryani & Non-Veg Special', 'Diu Town to Kevdi Campus Delivery', 'Student Biryani Choice', 'Hot Dum Biryani and chicken dishes delivered directly to campus on call.'),
('srv-11', 'Bakery & Celebrations', 'Shankar Cake (100% College Delivery)', '9426601832', 'Fresh Custom Cake & Bakery Shop', 'Guaranteed 100% delivery inside IIITV-ICD hostel gate', '100% College Delivery', 'Best custom cakes, midnight birthday cakes, pastries, and snacks with guaranteed doorstep college delivery!'),
('srv-12', 'Printing & Xerox', 'RK Print Hub Diu (Posters & Documents)', '74002 47495', 'Printing, Plotting, Posters & Thesis Binding', 'Diu Town Market (Order online/WhatsApp)', 'Printing & Project Reports', 'All academic printing: Project posters, lab manual prints, color documentation, and thesis spiral binding.'),
('srv-13', 'Entertainment & Daily Life', 'Diu Cinema', '98242 22578', 'Movie Theater & Multiplex', 'Latest Bollywood & Hollywood releases', 'Entertainment', 'Call for ticket booking, showtimes, and group discounts for college students.'),
('srv-14', 'Entertainment & Daily Life', 'Harsh Diu Salon', '+91 63562 31659', 'Men & Women Hair Grooming Salon', 'Diu Town (Near Market)', 'Student Grooming', 'Haircuts, beard trimming, and personal care for students.'),
('srv-15', 'Entertainment & Daily Life', 'Joy Hub Diu', '87996 68007', 'Recreation & Gaming Center', 'Indoor Games & Entertainment', 'Fun & Hangout', 'Student hangout zone for indoor arcade gaming and leisure.'),
('srv-16', 'College Coordination', 'Maargie Ma''am (IIITV-ICD Administration)', '+91 79905 73335', 'Official Institute Campus Coordination', 'Administrative Office, Education Hub Kevdi', 'College Office', 'Official campus administrative contact for academic records, hostel inquiries, and official permissions.')
ON CONFLICT (id) DO UPDATE SET
    category = EXCLUDED.category,
    name = EXCLUDED.name,
    phone = EXCLUDED.phone,
    type = EXCLUDED.type,
    coverage = EXCLUDED.coverage;

-- Seed About Us & Website Controller Content
INSERT INTO public.about_content (id, controller, hero, vision, scope, showcase_images, benefits)
VALUES (
    'about-main-content',
    '{"name":"Rishikesh Gopal","title":"Website Controller & Platform Administrator","year":"4th Year (B.Tech CSE)","email":"202311072@iiitvadodara.ac.in","phone":"8340574363","whatsappNumber":"8340574363","whatsappLink":"https://wa.me/918340574363?text=Hi%20Rishikesh,%20regarding%20Campus%20Connect","avatar":"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80","badge":"Website Controller & Lead Administrator","message":"Notice any outdated bus timing, incorrect classroom room number, missing subject syllabus, or need to add/remove misinformation? Reach out directly via WhatsApp chat or email anytime."}'::jsonb,
    '{"badge":"IIITV-ICD Student Digital Ecosystem","title":"About Campus Connect","subtitle":"Integrated Digital Campus Ecosystem for Student Information, Academic Coordination and Community Engagement at Indian Institute of Information Technology Vadodara – International Campus Diu (IIITV-ICD)."}'::jsonb,
    '{"title":"Platform Vision & Purpose","description1":"Students previously had to navigate multiple unverified WhatsApp groups, messy chat threads, and physical notice boards to find daily timetables, bus schedules, or study materials.","description2":"Campus Connect consolidates every critical campus workflow into ONE streamlined digital hub for the students and administration of IIIT Vadodara – International Campus Diu.","tagline":"Your Campus. Everything Connected."}'::jsonb,
    '{"title":"Student-Centric Scope","description1":"Unlike bloated institutional ERPs loaded with payroll or fee payment gateways, Campus Connect focuses 100% on day-to-day student life, academic success, and campus connectivity.","description2":"Every feature is designed to reduce student stress, save time travelling between Diu and Kevdi, and ensure quick access to verified resources.","campusNote":"Dedicated exclusively to IIITV-ICD Education Hub, Kevdi"}'::jsonb,
    '[{"url":"/images/campus/campus-main.jpg","caption":"Education Hub Main Complex, Kevdi Diu"},{"url":"/images/campus/campus-building.jpg","caption":"Modern Academic Lecture Blocks & Smart Classrooms"},{"url":"/images/campus/campus-library.jpg","caption":"Central Library & Reading Terminals"}]'::jsonb,
    '[{"title":"Branch-Wise Dynamic Schedules","description":"Accurate lecture and lab timetables across Semesters 1 through 8 for CSE, AI, Cyber Security, and ECE with live room allocations."},{"title":"Verified Campus Transport & Speed-Dials","description":"Complete flat ₹10 municipal bus schedule with ±10 min Kevdi Education Hub midpoint arrivals, plus trusted local autos, Chagdas, and delivery services."},{"title":"Academic Archive & PYQs (≤ 1 MB)","description":"Centralized semester-wise repository for previous-year question papers (2021–2026), lecture slides, and lab guides with direct compression links."},{"title":"Fast Lost & Found with Direct Contact","description":"One-click reporting with photos and direct call/WhatsApp contact so students can coordinate recovery right away."},{"title":"Official Circulars & Targeted Alerts","description":"Filtered announcements directly from campus administration, targeted to your specific branch and semester."},{"title":"Curated 20 Diu Exploration Spots","description":"Comprehensive travel guide with Google Maps navigation, Portuguese heritage spots, serene beaches, and Kevdi distance calculations."},{"title":"Student Community Forum","description":"Safe peer discussions for coding, hackathons, sports, campus clubs, and hostel tips without cluttering official groups."},{"title":"Modern High-Contrast UI & Performance","description":"Engineered with a responsive dark interface, animated dashboard cards, and lightning-fast client-side caching."}]'::jsonb
)
ON CONFLICT (id) DO UPDATE SET
    controller = EXCLUDED.controller,
    hero = EXCLUDED.hero,
    vision = EXCLUDED.vision,
    scope = EXCLUDED.scope,
    showcase_images = EXCLUDED.showcase_images,
    benefits = EXCLUDED.benefits;
