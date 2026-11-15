-- =========================================================================
-- CAMPUS CONNECT — SUPABASE AUTH & RLS INTEGRATION MIGRATION
-- Project: Integrated Digital Campus Ecosystem (IIITV-ICD)
-- =========================================================================

-- 1. Safely add user_id column linking to auth.users without touching existing IDs
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Drop insecure custom_password column (passwords managed strictly by Supabase Auth)
ALTER TABLE public.profiles 
  DROP COLUMN IF EXISTS custom_password;

-- 3. Create index for fast user_id lookups
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);

-- 4. Security Definer Helper: Checks if the currently authenticated user is an Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE (user_id = auth.uid() OR id = auth.uid()::text)
      AND role = 'admin'
  );
$$;

-- 5. Trigger Function: Automatically link or create profile when a user signs up in Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_existing_profile_id TEXT;
BEGIN
  -- Check if profile already exists by matching email
  SELECT id INTO v_existing_profile_id
  FROM public.profiles
  WHERE LOWER(college_email) = LOWER(NEW.email)
  LIMIT 1;

  IF v_existing_profile_id IS NOT NULL THEN
    -- Link existing profile to the new Supabase Auth user ID (preserves all existing student/admin details)
    UPDATE public.profiles
    SET user_id = NEW.id,
        updated_at = NOW()
    WHERE id = v_existing_profile_id;
  ELSE
    -- Brand new registration: Insert new student profile (STRICTLY role = 'student')
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
      'student', -- Public signup can NEVER grant admin role
      'active',
      '',
      '',
      '{"email": true, "announcements": true, "community": true, "lostFound": true}'::jsonb
    );
  END IF;

  RETURN NEW;
END;
$$;

-- Attach trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_auth_user();

-- 6. Trigger: Prevent students from escalating their own role to 'admin'
CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- If role is being changed, ensure caller is an admin
  IF NEW.role <> OLD.role AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Unauthorized: Only administrators can modify account roles.';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_protect_profile_role ON public.profiles;
CREATE TRIGGER trg_protect_profile_role
  BEFORE UPDATE OF role ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_role();

-- =========================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================================

-- Enable RLS across all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_routines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discussion_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lost_found_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transport_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.local_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
DROP POLICY IF EXISTS "Profiles are readable by authenticated users" ON public.profiles;
CREATE POLICY "Profiles are readable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated, anon
  USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() OR id = auth.uid()::text OR public.is_admin())
  WITH CHECK (user_id = auth.uid() OR id = auth.uid()::text OR public.is_admin());

-- ACADEMIC RESOURCES POLICIES
DROP POLICY IF EXISTS "Resources are readable by everyone" ON public.academic_resources;
CREATE POLICY "Resources are readable by everyone"
  ON public.academic_resources FOR SELECT
  TO authenticated, anon
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can upload resources" ON public.academic_resources;
CREATE POLICY "Authenticated users can upload resources"
  ON public.academic_resources FOR INSERT
  TO authenticated
  WITH CHECK (
    uploaded_by = auth.uid()::text 
    OR uploaded_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Owners and admins can update resources" ON public.academic_resources;
CREATE POLICY "Owners and admins can update resources"
  ON public.academic_resources FOR UPDATE
  TO authenticated
  USING (
    uploaded_by = auth.uid()::text 
    OR uploaded_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Owners and admins can delete resources" ON public.academic_resources;
CREATE POLICY "Owners and admins can delete resources"
  ON public.academic_resources FOR DELETE
  TO authenticated
  USING (
    uploaded_by = auth.uid()::text 
    OR uploaded_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    OR public.is_admin()
  );

-- DISCUSSIONS & COMMENTS POLICIES
DROP POLICY IF EXISTS "Discussions readable by all" ON public.discussions;
CREATE POLICY "Discussions readable by all"
  ON public.discussions FOR SELECT
  TO authenticated, anon
  USING (true);

DROP POLICY IF EXISTS "Students can create discussions" ON public.discussions;
CREATE POLICY "Students can create discussions"
  ON public.discussions FOR INSERT
  TO authenticated
  WITH CHECK (
    author_id = auth.uid()::text 
    OR author_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Authors and admins can update/delete discussions" ON public.discussions;
CREATE POLICY "Authors and admins can update/delete discussions"
  ON public.discussions FOR ALL
  TO authenticated
  USING (
    author_id = auth.uid()::text 
    OR author_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Comments readable by all" ON public.discussion_comments;
CREATE POLICY "Comments readable by all"
  ON public.discussion_comments FOR SELECT
  TO authenticated, anon
  USING (true);

DROP POLICY IF EXISTS "Students can post comments" ON public.discussion_comments;
CREATE POLICY "Students can post comments"
  ON public.discussion_comments FOR INSERT
  TO authenticated
  WITH CHECK (
    author_id = auth.uid()::text 
    OR author_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Authors and admins can delete comments" ON public.discussion_comments;
CREATE POLICY "Authors and admins can delete comments"
  ON public.discussion_comments FOR DELETE
  TO authenticated
  USING (
    author_id = auth.uid()::text 
    OR author_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    OR public.is_admin()
  );

-- ADMIN-MANAGED TABLES (Read: All, Write: Admin Only)
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN SELECT unnest(ARRAY[
    'announcements', 'academic_routines', 'transport_routes', 
    'places', 'local_services', 'developers', 'about_content'
  ]) LOOP
    EXECUTE format('DROP POLICY IF EXISTS "%s_read_policy" ON public.%I', tbl, tbl);
    EXECUTE format('CREATE POLICY "%s_read_policy" ON public.%I FOR SELECT TO authenticated, anon USING (true)', tbl, tbl);
    
    EXECUTE format('DROP POLICY IF EXISTS "%s_admin_write_policy" ON public.%I', tbl, tbl);
    EXECUTE format('CREATE POLICY "%s_admin_write_policy" ON public.%I FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin())', tbl, tbl);
  END LOOP;
END $$;

-- LOST & FOUND POLICIES
DROP POLICY IF EXISTS "Lost found readable by all" ON public.lost_found_items;
CREATE POLICY "Lost found readable by all"
  ON public.lost_found_items FOR SELECT
  TO authenticated, anon
  USING (true);

DROP POLICY IF EXISTS "Authenticated users can post lost found items" ON public.lost_found_items;
CREATE POLICY "Authenticated users can post lost found items"
  ON public.lost_found_items FOR INSERT
  TO authenticated
  WITH CHECK (
    reported_by = auth.uid()::text 
    OR reported_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Reporters and admins can update lost found items" ON public.lost_found_items;
CREATE POLICY "Reporters and admins can update lost found items"
  ON public.lost_found_items FOR UPDATE
  TO authenticated
  USING (
    reported_by = auth.uid()::text 
    OR reported_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Reporters and admins can delete lost found items" ON public.lost_found_items;
CREATE POLICY "Reporters and admins can delete lost found items"
  ON public.lost_found_items FOR DELETE
  TO authenticated
  USING (
    reported_by = auth.uid()::text 
    OR reported_by = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    OR public.is_admin()
  );

-- =========================================================================
-- 8. STORAGE CONFIGURATION & POLICIES (academic-resources)
-- =========================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'academic-resources', 
  'academic-resources', 
  false, -- Private bucket
  1048576, -- Strict 1 MB maximum limit (1024 * 1024)
  ARRAY['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 1048576,
  allowed_mime_types = ARRAY['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];

DROP POLICY IF EXISTS "Authenticated users can download academic resources" ON storage.objects;
CREATE POLICY "Authenticated users can download academic resources"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'academic-resources');

DROP POLICY IF EXISTS "Authenticated users can upload to academic-resources" ON storage.objects;
CREATE POLICY "Authenticated users can upload to academic-resources"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'academic-resources');

DROP POLICY IF EXISTS "Owners and admins can delete from academic-resources" ON storage.objects;
CREATE POLICY "Owners and admins can delete from academic-resources"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'academic-resources' AND (
      owner = auth.uid() 
      OR (storage.foldername(name))[1] = auth.uid()::text
      OR public.is_admin()
    )
  );
