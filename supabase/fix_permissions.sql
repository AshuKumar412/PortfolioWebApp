-- ============================================================
-- SUPABASE PERMISSIONS & RLS POLICIES (CLEAN & SAFE)
-- Run this in Supabase Dashboard -> SQL Editor -> New query -> Run
-- Fixes:
--   1. "permission denied for table profile" (GRANTs on public tables)
--   2. Storage upload RLS violations (storage.objects policies)
--   3. Avoids "must be owner of table objects" (no ALTER/GRANT on storage)
--   4. Avoids "function is_admin() does not exist" (uses native auth.jwt())
-- ============================================================

-- ── 1. Schema & Table Grants ──────────────────────────────────
GRANT USAGE ON SCHEMA public TO anon, authenticated;

GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO authenticated;

GRANT SELECT ON public.profile TO anon;
GRANT SELECT ON public.projects TO anon;
GRANT SELECT ON public.skills TO anon;
GRANT SELECT ON public.education TO anon;
GRANT SELECT ON public.experience TO anon;
GRANT SELECT ON public.certifications TO anon;
GRANT SELECT ON public.achievements TO anon;
GRANT SELECT ON public.services TO anon;
GRANT SELECT ON public.social_links TO anon;
GRANT INSERT ON public.contact_messages TO anon;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon;

-- ── 2. Enable RLS on Public Tables ───────────────────────────
ALTER TABLE public.profile           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages  ENABLE ROW LEVEL SECURITY;

-- ── 3. Table RLS Policies (Admin: 2400032678@kluniversity.in) ──

-- PROFILE
DROP POLICY IF EXISTS "profile_public_read"  ON public.profile;
DROP POLICY IF EXISTS "profile: public read" ON public.profile;
DROP POLICY IF EXISTS "profile_auth_write"   ON public.profile;
DROP POLICY IF EXISTS "profile: auth write"  ON public.profile;
DROP POLICY IF EXISTS "profile_admin_write"  ON public.profile;
DROP POLICY IF EXISTS "profile_admin_all"    ON public.profile;

CREATE POLICY "profile_public_read"
  ON public.profile FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "profile_admin_all"
  ON public.profile FOR ALL
  TO authenticated
  USING (lower(auth.jwt() ->> 'email') = '2400032678@kluniversity.in')
  WITH CHECK (lower(auth.jwt() ->> 'email') = '2400032678@kluniversity.in');

-- PROJECTS
DROP POLICY IF EXISTS "projects_public_read"           ON public.projects;
DROP POLICY IF EXISTS "projects: public read published" ON public.projects;
DROP POLICY IF EXISTS "projects_auth_all"              ON public.projects;
DROP POLICY IF EXISTS "projects: auth all"             ON public.projects;
DROP POLICY IF EXISTS "projects_admin_all"             ON public.projects;

CREATE POLICY "projects_public_read"
  ON public.projects FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR lower(auth.jwt() ->> 'email') = '2400032678@kluniversity.in');

CREATE POLICY "projects_admin_all"
  ON public.projects FOR ALL
  TO authenticated
  USING (lower(auth.jwt() ->> 'email') = '2400032678@kluniversity.in')
  WITH CHECK (lower(auth.jwt() ->> 'email') = '2400032678@kluniversity.in');

-- SKILLS
DROP POLICY IF EXISTS "skills_public_read"           ON public.skills;
DROP POLICY IF EXISTS "skills: public read published" ON public.skills;
DROP POLICY IF EXISTS "skills_auth_all"              ON public.skills;
DROP POLICY IF EXISTS "skills: auth all"             ON public.skills;
DROP POLICY IF EXISTS "skills_admin_all"             ON public.skills;

CREATE POLICY "skills_public_read"
  ON public.skills FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR lower(auth.jwt() ->> 'email') = '2400032678@kluniversity.in');

CREATE POLICY "skills_admin_all"
  ON public.skills FOR ALL
  TO authenticated
  USING (lower(auth.jwt() ->> 'email') = '2400032678@kluniversity.in')
  WITH CHECK (lower(auth.jwt() ->> 'email') = '2400032678@kluniversity.in');

-- EDUCATION
DROP POLICY IF EXISTS "education_public_read"           ON public.education;
DROP POLICY IF EXISTS "education: public read published" ON public.education;
DROP POLICY IF EXISTS "education_auth_all"              ON public.education;
DROP POLICY IF EXISTS "education: auth all"             ON public.education;
DROP POLICY IF EXISTS "education_admin_all"             ON public.education;

CREATE POLICY "education_public_read"
  ON public.education FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR lower(auth.jwt() ->> 'email') = '2400032678@kluniversity.in');

CREATE POLICY "education_admin_all"
  ON public.education FOR ALL
  TO authenticated
  USING (lower(auth.jwt() ->> 'email') = '2400032678@kluniversity.in')
  WITH CHECK (lower(auth.jwt() ->> 'email') = '2400032678@kluniversity.in');

-- EXPERIENCE
DROP POLICY IF EXISTS "experience_public_read"           ON public.experience;
DROP POLICY IF EXISTS "experience: public read published" ON public.experience;
DROP POLICY IF EXISTS "experience_auth_all"              ON public.experience;
DROP POLICY IF EXISTS "experience: auth all"             ON public.experience;
DROP POLICY IF EXISTS "experience_admin_all"             ON public.experience;

CREATE POLICY "experience_public_read"
  ON public.experience FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR lower(auth.jwt() ->> 'email') = '2400032678@kluniversity.in');

CREATE POLICY "experience_admin_all"
  ON public.experience FOR ALL
  TO authenticated
  USING (lower(auth.jwt() ->> 'email') = '2400032678@kluniversity.in')
  WITH CHECK (lower(auth.jwt() ->> 'email') = '2400032678@kluniversity.in');

-- CERTIFICATIONS
DROP POLICY IF EXISTS "certifications_public_read"           ON public.certifications;
DROP POLICY IF EXISTS "certifications: public read published" ON public.certifications;
DROP POLICY IF EXISTS "certifications_auth_all"              ON public.certifications;
DROP POLICY IF EXISTS "certifications: auth all"             ON public.certifications;
DROP POLICY IF EXISTS "certifications_admin_all"             ON public.certifications;

CREATE POLICY "certifications_public_read"
  ON public.certifications FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR lower(auth.jwt() ->> 'email') = '2400032678@kluniversity.in');

CREATE POLICY "certifications_admin_all"
  ON public.certifications FOR ALL
  TO authenticated
  USING (lower(auth.jwt() ->> 'email') = '2400032678@kluniversity.in')
  WITH CHECK (lower(auth.jwt() ->> 'email') = '2400032678@kluniversity.in');

-- ACHIEVEMENTS
DROP POLICY IF EXISTS "achievements_public_read"           ON public.achievements;
DROP POLICY IF EXISTS "achievements: public read published" ON public.achievements;
DROP POLICY IF EXISTS "achievements_auth_all"              ON public.achievements;
DROP POLICY IF EXISTS "achievements: auth all"             ON public.achievements;
DROP POLICY IF EXISTS "achievements_admin_all"             ON public.achievements;

CREATE POLICY "achievements_public_read"
  ON public.achievements FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR lower(auth.jwt() ->> 'email') = '2400032678@kluniversity.in');

CREATE POLICY "achievements_admin_all"
  ON public.achievements FOR ALL
  TO authenticated
  USING (lower(auth.jwt() ->> 'email') = '2400032678@kluniversity.in')
  WITH CHECK (lower(auth.jwt() ->> 'email') = '2400032678@kluniversity.in');

-- SERVICES
DROP POLICY IF EXISTS "services_public_read"           ON public.services;
DROP POLICY IF EXISTS "services: public read published" ON public.services;
DROP POLICY IF EXISTS "services_auth_all"              ON public.services;
DROP POLICY IF EXISTS "services: auth all"             ON public.services;
DROP POLICY IF EXISTS "services_admin_all"             ON public.services;

CREATE POLICY "services_public_read"
  ON public.services FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR lower(auth.jwt() ->> 'email') = '2400032678@kluniversity.in');

CREATE POLICY "services_admin_all"
  ON public.services FOR ALL
  TO authenticated
  USING (lower(auth.jwt() ->> 'email') = '2400032678@kluniversity.in')
  WITH CHECK (lower(auth.jwt() ->> 'email') = '2400032678@kluniversity.in');

-- SOCIAL LINKS
DROP POLICY IF EXISTS "social_links_public_read"          ON public.social_links;
DROP POLICY IF EXISTS "social_links: public read visible" ON public.social_links;
DROP POLICY IF EXISTS "social_links_auth_all"             ON public.social_links;
DROP POLICY IF EXISTS "social_links: auth all"            ON public.social_links;
DROP POLICY IF EXISTS "social_links_admin_all"            ON public.social_links;

CREATE POLICY "social_links_public_read"
  ON public.social_links FOR SELECT
  TO anon, authenticated
  USING (is_visible = true OR lower(auth.jwt() ->> 'email') = '2400032678@kluniversity.in');

CREATE POLICY "social_links_admin_all"
  ON public.social_links FOR ALL
  TO authenticated
  USING (lower(auth.jwt() ->> 'email') = '2400032678@kluniversity.in')
  WITH CHECK (lower(auth.jwt() ->> 'email') = '2400032678@kluniversity.in');

-- CONTACT MESSAGES
DROP POLICY IF EXISTS "contact_anon_insert"             ON public.contact_messages;
DROP POLICY IF EXISTS "contact_messages: public insert" ON public.contact_messages;
DROP POLICY IF EXISTS "contact_auth_all"                ON public.contact_messages;
DROP POLICY IF EXISTS "contact_messages: auth all"      ON public.contact_messages;
DROP POLICY IF EXISTS "contact_admin_all"               ON public.contact_messages;

CREATE POLICY "contact_anon_insert"
  ON public.contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "contact_admin_all"
  ON public.contact_messages FOR ALL
  TO authenticated
  USING (lower(auth.jwt() ->> 'email') = '2400032678@kluniversity.in')
  WITH CHECK (lower(auth.jwt() ->> 'email') = '2400032678@kluniversity.in');

-- ── 4. Storage Policies on storage.objects ────────────────────
-- Note: Does NOT modify table ownership, grants, or call custom functions.
-- Uses standard Supabase RLS on storage.objects.

DROP POLICY IF EXISTS "portfolio_storage_public_select" ON storage.objects;
DROP POLICY IF EXISTS "public_read_avatars"        ON storage.objects;
DROP POLICY IF EXISTS "public_read_projects"       ON storage.objects;
DROP POLICY IF EXISTS "public_read_certifications" ON storage.objects;
DROP POLICY IF EXISTS "public_read_resumes"        ON storage.objects;
DROP POLICY IF EXISTS "admin_manage_avatars"       ON storage.objects;
DROP POLICY IF EXISTS "admin_manage_projects"      ON storage.objects;
DROP POLICY IF EXISTS "admin_manage_certifications" ON storage.objects;
DROP POLICY IF EXISTS "admin_manage_resumes"       ON storage.objects;

-- Allow public read of objects in portfolio buckets
CREATE POLICY "portfolio_storage_public_select"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id IN ('avatars', 'projects', 'certifications', 'resumes'));

-- Allow only the admin to insert/upload objects into portfolio buckets
CREATE POLICY "portfolio_storage_admin_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id IN ('avatars', 'projects', 'certifications', 'resumes') AND
    lower(auth.jwt() ->> 'email') = '2400032678@kluniversity.in'
  );

-- Allow only the admin to update objects in portfolio buckets
CREATE POLICY "portfolio_storage_admin_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id IN ('avatars', 'projects', 'certifications', 'resumes') AND
    lower(auth.jwt() ->> 'email') = '2400032678@kluniversity.in'
  );

-- Allow only the admin to delete objects in portfolio buckets
CREATE POLICY "portfolio_storage_admin_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id IN ('avatars', 'projects', 'certifications', 'resumes') AND
    lower(auth.jwt() ->> 'email') = '2400032678@kluniversity.in'
  );

-- ── 5. Default Profile Seed Row ───────────────────────────────
INSERT INTO public.profile (name, title, tagline, bio, is_available)
SELECT 'Your Name', 'Full-Stack Developer', 'Building elegant solutions to complex problems', 'Welcome to my portfolio. Customize this in the Admin Dashboard.', true
WHERE NOT EXISTS (SELECT 1 FROM public.profile);
