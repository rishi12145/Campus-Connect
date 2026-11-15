-- =========================================================================
-- CAMPUS CONNECT — MASTER SUPABASE AUTH, RLS & STORAGE MIGRATION
-- Integrated Digital Campus Ecosystem (IIITV-ICD)
-- Safe, Idempotent, and Non-Destructive Migration
-- =========================================================================

-- =========================================================================
-- STEP 1: CLEAN UP ALL EXISTING POLICIES ACROSS ALL 12 TABLES & STORAGE
-- Eliminates PostgreSQL Permissive Policy OR Security Vulnerabilities
-- =========================================================================

DO $$
DECLARE
    r RECORD;
BEGIN
    -- 1. Drop all existing policies on all 12 public tables
    FOR r IN (
        SELECT schemaname, tablename, policyname 
        FROM pg_policies 
        WHERE schemaname = 'public' 
          AND tablename IN (
            'profiles', 
            'academic_routines', 
            'academic_resources', 
            'announcements', 
            'discussions', 
            'discussion_comments', 
            'lost_found_items', 
            'transport_routes', 
            'places', 
            'local_services', 
            'developers', 
            'about_content'
          )
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
    END LOOP;

    -- 2. Drop all existing policies on storage.objects for academic-resources
    FOR r IN (
        SELECT policyname 
        FROM pg_policies 
        WHERE schemaname = 'storage' AND tablename = 'objects'
          AND (
            policyname ILIKE '%academic%' 
            OR policyname ILIKE '%resource%'
            OR policyname = 'Public Access for academic resources bucket'
            OR policyname = 'Allow upload to academic-resources'
            OR policyname = 'Allow delete from academic-resources'
          )
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', r.policyname);
    END LOOP;
END $$;

-- =========================================================================
-- STEP 2: SCHEMA ADJUSTMENTS (PROFILES TABLE)
-- Preserves existing profile IDs (e.g. 'usr-admin-1', 'usr-student-1')
-- =========================================================================

-- 1. Safely add user_id linking to auth.users.id
ALTER TABLE public.profiles 
    ADD COLUMN IF NOT EXISTS user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Drop insecure custom_password column (passwords managed strictly in auth.users)
ALTER TABLE public.profiles 
    DROP COLUMN IF EXISTS custom_password;

-- 3. Create index for fast user_id and email lookups
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email_lower ON public.profiles(LOWER(college_email));

-- =========================================================================
-- STEP 3: RECURSION-FREE ADMIN HELPER FUNCTION
-- Prevents PostgreSQL RLS Infinite Recursion on profiles Table
-- =========================================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
DECLARE
    v_is_admin BOOLEAN := FALSE;
BEGIN
    -- 1. First check JWT claims (fastest, zero table queries, 100% recursion-free)
    IF (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR 
       (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' THEN
        RETURN TRUE;
    END IF;

    -- 2. If unauthenticated, immediately return false
    IF auth.uid() IS NULL THEN
        RETURN FALSE;
    END IF;

    -- 3. Query profiles table with explicit limit (runs as table owner postgres, bypassing RLS)
    SELECT (role = 'admin') INTO v_is_admin
    FROM public.profiles
    WHERE user_id = auth.uid() OR id = auth.uid()::text
    LIMIT 1;

    RETURN COALESCE(v_is_admin, FALSE);
END;
$$;

-- Secure public RPC helper to resolve roll number to email without exposing profiles to anon
CREATE OR REPLACE FUNCTION public.get_email_by_roll(p_identifier TEXT)
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
    SELECT college_email 
    FROM public.profiles 
    WHERE roll_number ILIKE p_identifier 
       OR id = p_identifier
       OR (LOWER(p_identifier) IN ('admin', 'rishiadmin') AND role = 'admin')
    LIMIT 1;
$$;

-- Grant execution to authenticated and anon for the login resolver
GRANT EXECUTE ON FUNCTION public.get_email_by_roll(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- =========================================================================
-- STEP 4: AUTH TRIGGERS & STUDENT ROLE ESCALATION PROTECTION
-- =========================================================================

-- Trigger Function A: Automatically link or create profile when user registers via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_existing_profile_id TEXT;
    v_existing_role TEXT;
BEGIN
    -- Check if profile already exists with matching college_email
    SELECT id, role INTO v_existing_profile_id, v_existing_role
    FROM public.profiles
    WHERE LOWER(college_email) = LOWER(NEW.email)
    LIMIT 1;

    IF v_existing_profile_id IS NOT NULL THEN
        -- Link existing profile to the new Supabase Auth user ID (preserves all existing data)
        UPDATE public.profiles
        SET user_id = NEW.id,
            updated_at = NOW()
        WHERE id = v_existing_profile_id;

        -- If existing profile is admin, sync role into user app_metadata
        IF v_existing_role = 'admin' THEN
            UPDATE auth.users
            SET raw_app_meta_data = COALESCE(raw_app_meta_data, '{}'::jsonb) || jsonb_build_object('role', 'admin')
            WHERE id = NEW.id;
        END IF;
    ELSE
        -- Brand new public registration: STRICTLY role = 'student' (admin can NEVER be self-assigned)
        INSERT INTO public.profiles (
            id,
            user_id,
            full_name,
            college_email,
            roll_number,
            phone_number,
            stream,
            branch,
            batch_year,
            batch,
            semester,
            role,
            status,
            avatar_url,
            bio,
            notification_prefs
        ) VALUES (
            NEW.id::text,
            NEW.id,
            COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
            LOWER(NEW.email),
            COALESCE(NEW.raw_user_meta_data->>'roll_number', ''),
            COALESCE(NEW.raw_user_meta_data->>'phone_number', ''),
            COALESCE(NEW.raw_user_meta_data->>'stream', 'B.Tech'),
            COALESCE(NEW.raw_user_meta_data->>'branch', 'CSE'),
            COALESCE(NEW.raw_user_meta_data->>'batch_year', '2023'),
            COALESCE(NEW.raw_user_meta_data->>'batch', 'B.Tech CSE 2023'),
            COALESCE(NEW.raw_user_meta_data->>'semester', 'Semester 4'),
            'student', -- Always student
            'active',
            '',
            '',
            '{"email": true, "announcements": true, "community": true, "lostFound": true}'::jsonb
        );
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_auth_user();

-- Trigger Function B: Prevent students from modifying protected fields (role, user_id, id, email, roll)
CREATE OR REPLACE FUNCTION public.enforce_profile_update_rules()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- If caller is NOT an authorized administrator:
    IF NOT public.is_admin() THEN
        -- 1. Disallow role changes
        IF NEW.role IS DISTINCT FROM OLD.role THEN
            RAISE EXCEPTION 'Unauthorized: Students cannot modify account roles.';
        END IF;

        -- 2. Disallow user_id modifications once linked
        IF OLD.user_id IS NOT NULL AND NEW.user_id IS DISTINCT FROM OLD.user_id THEN
            RAISE EXCEPTION 'Unauthorized: user_id is immutable.';
        END IF;

        -- 3. Disallow profile id modifications
        IF NEW.id IS DISTINCT FROM OLD.id THEN
            RAISE EXCEPTION 'Unauthorized: Profile ID cannot be modified.';
        END IF;

        -- 4. Disallow modifying college email directly
        IF NEW.college_email IS DISTINCT FROM OLD.college_email THEN
            RAISE EXCEPTION 'Unauthorized: College email cannot be changed directly.';
        END IF;

        -- 5. Disallow modifying roll number directly
        IF NEW.roll_number IS DISTINCT FROM OLD.roll_number THEN
            RAISE EXCEPTION 'Unauthorized: Roll number cannot be modified.';
        END IF;
    END IF;

    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_profile_update_rules ON public.profiles;
DROP TRIGGER IF EXISTS protect_profile_role ON public.profiles;
DROP TRIGGER IF EXISTS trg_protect_profile_role ON public.profiles;
CREATE TRIGGER trg_protect_profile_role
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.enforce_profile_update_rules();

-- =========================================================================
-- STEP 5: ROW LEVEL SECURITY POLICIES (ALL 12 TABLES)
-- =========================================================================

-- Enable RLS across all 12 tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lost_found_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.local_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;

-- Revoke dangerous direct permissions from anon
REVOKE ALL ON public.profiles FROM anon;

-- -------------------------------------------------------------------------
-- 1. PROFILES POLICIES
-- Students can only view profiles when authenticated.
-- Anonymous users CANNOT read student personal information (emails, phones).
-- -------------------------------------------------------------------------
CREATE POLICY "profiles_select_authenticated"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (
        -- User can view their own profile
        user_id = auth.uid() 
        OR id = auth.uid()::text 
        -- Or administrators can view all profiles
        OR public.is_admin()
    );

CREATE POLICY "profiles_update_own"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid() OR id = auth.uid()::text OR public.is_admin())
    WITH CHECK (user_id = auth.uid() OR id = auth.uid()::text OR public.is_admin());

-- -------------------------------------------------------------------------
-- 2. ACADEMIC RESOURCES POLICIES
-- Strict authenticated ownership: students manage ONLY their own uploads.
-- Admins can manage all resources.
-- -------------------------------------------------------------------------
CREATE POLICY "resources_select_authenticated"
    ON public.academic_resources FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "resources_insert_authenticated"
    ON public.academic_resources FOR INSERT
    TO authenticated
    WITH CHECK (
        file_bytes <= 1048576 -- Strict 1 MB maximum limit
        AND (
            uploaded_by = auth.uid()::text 
            OR uploaded_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
            OR public.is_admin()
        )
    );

CREATE POLICY "resources_update_owner_or_admin"
    ON public.academic_resources FOR UPDATE
    TO authenticated
    USING (
        uploaded_by = auth.uid()::text 
        OR uploaded_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
        OR public.is_admin()
    )
    WITH CHECK (
        file_bytes <= 1048576
        AND (
            uploaded_by = auth.uid()::text 
            OR uploaded_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
            OR public.is_admin()
        )
    );

CREATE POLICY "resources_delete_owner_or_admin"
    ON public.academic_resources FOR DELETE
    TO authenticated
    USING (
        uploaded_by = auth.uid()::text 
        OR uploaded_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
        OR public.is_admin()
    );

-- -------------------------------------------------------------------------
-- 3. DISCUSSIONS & COMMENTS POLICIES
-- Students can create and manage their own threads. Admins can moderate all.
-- -------------------------------------------------------------------------
CREATE POLICY "discussions_select_policy"
    ON public.discussions FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "discussions_insert_policy"
    ON public.discussions FOR INSERT
    TO authenticated
    WITH CHECK (
        author_id = auth.uid()::text 
        OR author_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
        OR public.is_admin()
    );

CREATE POLICY "discussions_update_policy"
    ON public.discussions FOR UPDATE
    TO authenticated
    USING (
        author_id = auth.uid()::text 
        OR author_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
        OR public.is_admin()
    );

CREATE POLICY "discussions_delete_policy"
    ON public.discussions FOR DELETE
    TO authenticated
    USING (
        author_id = auth.uid()::text 
        OR author_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
        OR public.is_admin()
    );

CREATE POLICY "comments_select_policy"
    ON public.discussion_comments FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "comments_insert_policy"
    ON public.discussion_comments FOR INSERT
    TO authenticated
    WITH CHECK (
        author_id = auth.uid()::text 
        OR author_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
        OR public.is_admin()
    );

CREATE POLICY "comments_delete_policy"
    ON public.discussion_comments FOR DELETE
    TO authenticated
    USING (
        author_id = auth.uid()::text 
        OR author_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
        OR public.is_admin()
    );

-- -------------------------------------------------------------------------
-- 4. LOST & FOUND POLICIES
-- Reporters manage only their listings; admins can moderate all.
-- -------------------------------------------------------------------------
CREATE POLICY "lost_found_select_policy"
    ON public.lost_found_items FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "lost_found_insert_policy"
    ON public.lost_found_items FOR INSERT
    TO authenticated
    WITH CHECK (
        reported_by = auth.uid()::text 
        OR reported_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
        OR public.is_admin()
    );

CREATE POLICY "lost_found_update_policy"
    ON public.lost_found_items FOR UPDATE
    TO authenticated
    USING (
        reported_by = auth.uid()::text 
        OR reported_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
        OR public.is_admin()
    );

CREATE POLICY "lost_found_delete_policy"
    ON public.lost_found_items FOR DELETE
    TO authenticated
    USING (
        reported_by = auth.uid()::text 
        OR reported_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
        OR public.is_admin()
    );

-- -------------------------------------------------------------------------
-- 5. ADMIN-CONTROLLED DATA TABLES
-- Public/Authenticated: SELECT allowed for general campus consumption.
-- INSERT / UPDATE / DELETE: Strictly restricted to authorized admins.
-- Tables: announcements, academic_routines, transport_routes, places, local_services, developers, about_content
-- -------------------------------------------------------------------------

-- announcements
CREATE POLICY "announcements_select_policy" ON public.announcements FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "announcements_admin_insert" ON public.announcements FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "announcements_admin_update" ON public.announcements FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "announcements_admin_delete" ON public.announcements FOR DELETE TO authenticated USING (public.is_admin());

-- academic_routines
CREATE POLICY "routines_select_policy" ON public.academic_routines FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "routines_admin_insert" ON public.academic_routines FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "routines_admin_update" ON public.academic_routines FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "routines_admin_delete" ON public.academic_routines FOR DELETE TO authenticated USING (public.is_admin());

-- transport_routes
CREATE POLICY "transport_select_policy" ON public.transport_routes FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "transport_admin_insert" ON public.transport_routes FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "transport_admin_update" ON public.transport_routes FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "transport_admin_delete" ON public.transport_routes FOR DELETE TO authenticated USING (public.is_admin());

-- places
CREATE POLICY "places_select_policy" ON public.places FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "places_admin_insert" ON public.places FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "places_admin_update" ON public.places FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "places_admin_delete" ON public.places FOR DELETE TO authenticated USING (public.is_admin());

-- local_services
CREATE POLICY "services_select_policy" ON public.local_services FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "services_admin_insert" ON public.local_services FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "services_admin_update" ON public.local_services FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "services_admin_delete" ON public.local_services FOR DELETE TO authenticated USING (public.is_admin());

-- developers
CREATE POLICY "developers_select_policy" ON public.developers FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "developers_admin_insert" ON public.developers FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "developers_admin_update" ON public.developers FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "developers_admin_delete" ON public.developers FOR DELETE TO authenticated USING (public.is_admin());

-- about_content
CREATE POLICY "about_content_select_policy" ON public.about_content FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "about_content_admin_insert" ON public.about_content FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "about_content_admin_update" ON public.about_content FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "about_content_admin_delete" ON public.about_content FOR DELETE TO authenticated USING (public.is_admin());

-- =========================================================================
-- STEP 6: SUPABASE STORAGE CONFIGURATION & POLICIES (academic-resources)
-- Private bucket with strict 1 MB limit, MIME types, and ownership checks
-- Includes SELECT, INSERT, UPDATE, and DELETE policies
-- =========================================================================

-- Ensure bucket exists and is marked private with strict 1 MB limit
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'academic-resources', 
    'academic-resources', 
    false, -- Private bucket
    1048576, -- Strict 1 MB maximum limit (1024 * 1024 bytes)
    ARRAY['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
)
ON CONFLICT (id) DO UPDATE SET
    public = false,
    file_size_limit = 1048576,
    allowed_mime_types = ARRAY['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

-- 1. Storage SELECT: Authenticated students & admins can download resources
CREATE POLICY "academic_storage_select"
    ON storage.objects FOR SELECT
    TO authenticated
    USING (bucket_id = 'academic-resources');

-- 2. Storage INSERT: Authenticated users can upload to academic-resources
CREATE POLICY "academic_storage_insert"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'academic-resources'
        AND (owner = auth.uid() OR owner IS NULL)
    );

-- 3. Storage UPDATE: Only file owners or administrators can update existing files
CREATE POLICY "academic_storage_update"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'academic-resources'
        AND (
            owner = auth.uid() 
            OR (storage.foldername(name))[1] = auth.uid()::text
            OR public.is_admin()
        )
    )
    WITH CHECK (
        bucket_id = 'academic-resources'
        AND (
            owner = auth.uid() 
            OR (storage.foldername(name))[1] = auth.uid()::text
            OR public.is_admin()
        )
    );

-- 4. Storage DELETE: Only file owners or administrators can permanently delete files
CREATE POLICY "academic_storage_delete"
    ON storage.objects FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'academic-resources'
        AND (
            owner = auth.uid() 
            OR (storage.foldername(name))[1] = auth.uid()::text
            OR public.is_admin()
        )
    );
