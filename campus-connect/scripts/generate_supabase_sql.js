import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const initialDataPath = path.resolve(__dirname, '../frontend/src/data/initialData.js');
  const initialData = await import('file:///' + initialDataPath.replace(/\\/g, '/'));

  const {
    INITIAL_USERS,
    INITIAL_DEVELOPERS,
    INITIAL_ROUTINES,
    INITIAL_PLACES,
    INITIAL_TRANSPORT,
    LOCAL_SERVICES_CONTACTS,
    INITIAL_ABOUT_CONTENT
  } = initialData;

  function esc(val) {
    if (val === null || val === undefined) return 'NULL';
    if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
    if (typeof val === 'number') return val.toString();
    if (typeof val === 'object') return "'" + JSON.stringify(val).replace(/'/g, "''") + "'::jsonb";
    return "'" + val.toString().replace(/'/g, "''") + "'";
  }

  let out = `-- =========================================================================
-- CAMPUS CONNECT (IIITV-ICD) — COMPLETE SUPABASE MASTER DATABASE SCHEMA
-- Integrated Digital Campus Ecosystem for Student Information, Academic Coordination
-- and Community Engagement
-- Generated: ${new Date().toISOString()}
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
`;

  // Users Seed
  const userRows = INITIAL_USERS.map(u => {
    return `(${esc(u.id)}, ${esc(u.fullName)}, ${esc(u.rollNumber)}, ${esc(u.collegeEmail)}, ${esc(u.phoneNumber)}, ${esc(u.stream)}, ${esc(u.branch)}, ${esc(u.batchYear)}, ${esc(u.batch)}, ${esc(u.semester)}, ${esc(u.role)}, ${esc(u.status || 'active')}, ${esc(u.avatarUrl || '')}, ${esc(u.bio || '')}, ${esc(u.notificationPrefs)})`;
  }).join(',\n');

  out += `INSERT INTO public.profiles (id, full_name, roll_number, college_email, phone_number, stream, branch, batch_year, batch, semester, role, status, avatar_url, bio, notification_prefs)
VALUES
${userRows}
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    roll_number = EXCLUDED.roll_number,
    college_email = EXCLUDED.college_email,
    phone_number = EXCLUDED.phone_number,
    role = EXCLUDED.role;

-- Seed Developers
`;

  // Developers Seed
  const devRows = INITIAL_DEVELOPERS.map(d => {
    return `(${esc(d.id)}, ${esc(d.name)}, ${esc(d.role)}, ${esc(d.year)}, ${esc(d.batch || 'B.Tech CSE 2023-2027')}, ${esc(d.rollNumber || '')}, ${esc(d.quote || '')}, ${esc(d.contactPhone)}, ${esc(d.email)}, ${esc(d.isLead)}, ${esc(d.bio)}, ${esc(d.avatar)})`;
  }).join(',\n');

  out += `INSERT INTO public.developers (id, name, role, year, batch, roll_number, quote, contact_phone, email, is_lead, bio, avatar)
VALUES
${devRows}
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    batch = EXCLUDED.batch,
    roll_number = EXCLUDED.roll_number,
    quote = EXCLUDED.quote,
    contact_phone = EXCLUDED.contact_phone,
    email = EXCLUDED.email;

-- Seed Academic Routines (${INITIAL_ROUTINES.length} entries across Semesters 1 to 8)
`;

  // Routines Seed
  const routineRows = INITIAL_ROUTINES.map(r => {
    const stream = r.stream || 'B.Tech';
    const branch = r.branch || (r.batch?.includes('AI') ? 'AI' : r.batch?.includes('Cyber') ? 'Cyber Security' : 'CSE');
    const batchYear = r.batchYear || '2023';
    const batch = r.batch || `${stream} ${branch} ${batchYear}`;
    return `(${esc(r.id)}, ${esc(r.subject)}, ${esc(r.code)}, ${esc(r.faculty)}, ${esc(r.room)}, ${esc(r.day)}, ${esc(r.startTime)}, ${esc(r.endTime)}, ${esc(r.type || 'Lecture')}, ${esc(r.semester)}, ${esc(stream)}, ${esc(branch)}, ${esc(batchYear)}, ${esc(batch)})`;
  }).join(',\n');

  out += `INSERT INTO public.academic_routines (id, subject, code, faculty, room, day, start_time, end_time, type, semester, stream, branch, batch_year, batch)
VALUES
${routineRows}
ON CONFLICT (id) DO UPDATE SET
    subject = EXCLUDED.subject,
    code = EXCLUDED.code,
    faculty = EXCLUDED.faculty,
    room = EXCLUDED.room,
    day = EXCLUDED.day,
    start_time = EXCLUDED.start_time,
    end_time = EXCLUDED.end_time;

-- Seed 20 Curated Diu Places
`;

  // Places Seed
  const placeRows = INITIAL_PLACES.map(p => {
    return `(${esc(p.id)}, ${esc(p.name)}, ${esc(p.category)}, ${p.rating || 4.5}, ${esc(p.reviews || '1K')}, ${esc(p.description)}, ${esc(p.location)}, ${esc(p.distanceFromKevdi || '')}, ${esc(p.openingHours || '')}, ${esc(p.imageUrl)}, ${esc(p.mapUrl || '')}, ${esc(p.websiteUrl || '')}, ${esc(p.isVerified ?? true)}, ${esc(p.features || [])})`;
  }).join(',\n');

  out += `INSERT INTO public.places (id, name, category, rating, reviews, description, location, distance_from_kevdi, opening_hours, image_url, map_url, website_url, is_verified, features)
VALUES
${placeRows}
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
`;

  // Transport Seed
  const transportRows = INITIAL_TRANSPORT.map(t => {
    return `(${esc(t.id)}, ${esc(t.routeName)}, ${esc(t.source)}, ${esc(t.destination)}, ${esc(t.stops || [])}, ${esc(t.departureTime)}, ${esc(t.frequency || '')}, ${esc(t.busNumber || '')}, ${esc(t.driverName || '')}, ${esc(t.driverContact || '')}, ${esc(t.daysOfOperation || 'All 7 Days')}, ${esc(t.notes || '')})`;
  }).join(',\n');

  out += `INSERT INTO public.transport_routes (id, route_name, source, destination, stops, departure_time, frequency, bus_number, driver_name, driver_contact, days_of_operation, notes)
VALUES
${transportRows}
ON CONFLICT (id) DO UPDATE SET
    route_name = EXCLUDED.route_name,
    source = EXCLUDED.source,
    destination = EXCLUDED.destination,
    departure_time = EXCLUDED.departure_time;

-- Seed Local Speed-Dial Contacts (Saddam delivery, cakes, Chagda autos)
`;

  // Services Seed
  const serviceRows = LOCAL_SERVICES_CONTACTS.map(s => {
    return `(${esc(s.id)}, ${esc(s.category)}, ${esc(s.name)}, ${esc(s.phone)}, ${esc(s.type)}, ${esc(s.coverage)}, ${esc(s.badge || '')}, ${esc(s.notes || '')})`;
  }).join(',\n');

  out += `INSERT INTO public.local_services (id, category, name, phone, type, coverage, badge, notes)
VALUES
${serviceRows}
ON CONFLICT (id) DO UPDATE SET
    category = EXCLUDED.category,
    name = EXCLUDED.name,
    phone = EXCLUDED.phone,
    type = EXCLUDED.type,
    coverage = EXCLUDED.coverage;

-- Seed About Us & Website Controller Content
INSERT INTO public.about_content (id, controller, hero, vision, scope, showcase_images, benefits)
VALUES (
    ${esc(INITIAL_ABOUT_CONTENT.id)},
    ${esc(INITIAL_ABOUT_CONTENT.controller)},
    ${esc(INITIAL_ABOUT_CONTENT.hero)},
    ${esc(INITIAL_ABOUT_CONTENT.vision)},
    ${esc(INITIAL_ABOUT_CONTENT.scope)},
    ${esc(INITIAL_ABOUT_CONTENT.showcaseImages)},
    ${esc(INITIAL_ABOUT_CONTENT.benefits)}
)
ON CONFLICT (id) DO UPDATE SET
    controller = EXCLUDED.controller,
    hero = EXCLUDED.hero,
    vision = EXCLUDED.vision,
    scope = EXCLUDED.scope,
    showcase_images = EXCLUDED.showcase_images,
    benefits = EXCLUDED.benefits;
`;

  const targetPath = path.resolve(__dirname, '../supabase_schema.sql');
  fs.writeFileSync(targetPath, out, 'utf-8');
  console.log(`Successfully generated master Supabase schema at ${targetPath}`);
  console.log(`Total File Size: ${(Buffer.byteLength(out, 'utf8') / 1024).toFixed(1)} KB`);
}

main().catch(err => {
  console.error('Error generating schema:', err);
  process.exit(1);
});

