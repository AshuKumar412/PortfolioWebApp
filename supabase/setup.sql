-- ============================================================
-- COMPLETE SETUP — Run this ONE file in Supabase SQL Editor
-- Includes: all tables + auto-update triggers + grants + RLS + storage
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── 1. Helper function: is_admin ──────────────────────────────
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT coalesce(lower(auth.jwt() ->> 'email') = '2400032678@kluniversity.in', false);
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- ── 2. Tables ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.profile (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name              text,
  title             text,
  tagline           text,
  bio               text,
  bio_extended      text,
  email             text,
  location          text,
  github_url        text,
  linkedin_url      text,
  avatar_url        text,
  resume_url        text,
  years_experience  integer,
  projects_count    integer,
  clients_count     integer,
  coffee_count      text,
  is_available      boolean DEFAULT true,
  updated_at        timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.projects (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  description   text,
  problem       text,
  features      jsonb   DEFAULT '[]',
  tech_stack    jsonb   DEFAULT '[]',
  category      text,
  github_url    text,
  demo_url      text,
  image_url     text,
  is_featured   boolean DEFAULT false,
  is_published  boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.skills (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text NOT NULL,
  category      text NOT NULL DEFAULT 'Other',
  icon_name     text,
  proficiency   integer DEFAULT 80,
  display_order integer DEFAULT 0,
  is_published  boolean DEFAULT true,
  created_at    timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.education (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution   text NOT NULL,
  degree        text,
  field         text,
  start_date    date,
  end_date      date,
  location      text,
  description   text,
  achievements  jsonb   DEFAULT '[]',
  is_current    boolean DEFAULT false,
  display_order integer DEFAULT 0,
  is_published  boolean DEFAULT true,
  created_at    timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.experience (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company       text NOT NULL,
  role          text NOT NULL,
  start_date    date,
  end_date      date,
  location      text,
  description   text,
  achievements  jsonb   DEFAULT '[]',
  is_current    boolean DEFAULT false,
  display_order integer DEFAULT 0,
  is_published  boolean DEFAULT true,
  created_at    timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.certifications (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  issuer          text NOT NULL,
  issue_date      date,
  expiry_date     date,
  credential_url  text,
  image_url       text,
  display_order   integer DEFAULT 0,
  is_published    boolean DEFAULT true,
  created_at      timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.achievements (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  description   text,
  date          text,
  icon          text DEFAULT '🏆',
  display_order integer DEFAULT 0,
  is_published  boolean DEFAULT true,
  created_at    timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.services (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text NOT NULL,
  description   text,
  icon          text DEFAULT '⚡',
  display_order integer DEFAULT 0,
  is_published  boolean DEFAULT true,
  created_at    timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.social_links (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform      text NOT NULL,
  url           text NOT NULL,
  display_order integer DEFAULT 0,
  is_visible    boolean DEFAULT true,
  created_at    timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name       text NOT NULL,
  email      text NOT NULL,
  subject    text NOT NULL,
  message    text NOT NULL,
  is_read    boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Seed one profile row if none exists
INSERT INTO public.profile (name, title, tagline, bio, is_available)
SELECT 'Your Name', 'Full-Stack Developer', 'Building elegant solutions to complex problems', 'Welcome to my portfolio.', true
WHERE NOT EXISTS (SELECT 1 FROM public.profile);

-- ── 3. Triggers for updated_at ────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS trg_projects_updated_at ON public.projects;
CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS trg_profile_updated_at ON public.profile;
CREATE TRIGGER trg_profile_updated_at
  BEFORE UPDATE ON public.profile
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- ── 4. Grants & Permissions ───────────────────────────────────
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

-- ── 5. Enable RLS on all tables ───────────────────────────────
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

-- ── 6. RLS Policies ───────────────────────────────────────────

-- PROFILE
DROP POLICY IF EXISTS "profile_public_read"  ON public.profile;
DROP POLICY IF EXISTS "profile_admin_write"  ON public.profile;
CREATE POLICY "profile_public_read"  ON public.profile FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "profile_admin_write"  ON public.profile FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- PROJECTS
DROP POLICY IF EXISTS "projects_public_read" ON public.projects;
DROP POLICY IF EXISTS "projects_admin_all"   ON public.projects;
CREATE POLICY "projects_public_read" ON public.projects FOR SELECT TO anon, authenticated
  USING (is_published = true OR public.is_admin());
CREATE POLICY "projects_admin_all"   ON public.projects FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- SKILLS
DROP POLICY IF EXISTS "skills_public_read" ON public.skills;
DROP POLICY IF EXISTS "skills_admin_all"   ON public.skills;
CREATE POLICY "skills_public_read" ON public.skills FOR SELECT TO anon, authenticated
  USING (is_published = true OR public.is_admin());
CREATE POLICY "skills_admin_all"   ON public.skills FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- EDUCATION
DROP POLICY IF EXISTS "education_public_read" ON public.education;
DROP POLICY IF EXISTS "education_admin_all"   ON public.education;
CREATE POLICY "education_public_read" ON public.education FOR SELECT TO anon, authenticated
  USING (is_published = true OR public.is_admin());
CREATE POLICY "education_admin_all"   ON public.education FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- EXPERIENCE
DROP POLICY IF EXISTS "experience_public_read" ON public.experience;
DROP POLICY IF EXISTS "experience_admin_all"   ON public.experience;
CREATE POLICY "experience_public_read" ON public.experience FOR SELECT TO anon, authenticated
  USING (is_published = true OR public.is_admin());
CREATE POLICY "experience_admin_all"   ON public.experience FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- CERTIFICATIONS
DROP POLICY IF EXISTS "certifications_public_read" ON public.certifications;
DROP POLICY IF EXISTS "certifications_admin_all"   ON public.certifications;
CREATE POLICY "certifications_public_read" ON public.certifications FOR SELECT TO anon, authenticated
  USING (is_published = true OR public.is_admin());
CREATE POLICY "certifications_admin_all"   ON public.certifications FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ACHIEVEMENTS
DROP POLICY IF EXISTS "achievements_public_read" ON public.achievements;
DROP POLICY IF EXISTS "achievements_admin_all"   ON public.achievements;
CREATE POLICY "achievements_public_read" ON public.achievements FOR SELECT TO anon, authenticated
  USING (is_published = true OR public.is_admin());
CREATE POLICY "achievements_admin_all"   ON public.achievements FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- SERVICES
DROP POLICY IF EXISTS "services_public_read" ON public.services;
DROP POLICY IF EXISTS "services_admin_all"   ON public.services;
CREATE POLICY "services_public_read" ON public.services FOR SELECT TO anon, authenticated
  USING (is_published = true OR public.is_admin());
CREATE POLICY "services_admin_all"   ON public.services FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- SOCIAL LINKS
DROP POLICY IF EXISTS "social_links_public_read" ON public.social_links;
DROP POLICY IF EXISTS "social_links_admin_all"   ON public.social_links;
CREATE POLICY "social_links_public_read" ON public.social_links FOR SELECT TO anon, authenticated
  USING (is_visible = true OR public.is_admin());
CREATE POLICY "social_links_admin_all"   ON public.social_links FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- CONTACT MESSAGES
DROP POLICY IF EXISTS "contact_anon_insert" ON public.contact_messages;
DROP POLICY IF EXISTS "contact_admin_all"   ON public.contact_messages;
CREATE POLICY "contact_anon_insert" ON public.contact_messages FOR INSERT TO anon, authenticated
  WITH CHECK (true);
CREATE POLICY "contact_admin_all"   ON public.contact_messages FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- ── 7. Storage Buckets & Policies ─────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('avatars', 'avatars', true),
  ('projects', 'projects', true),
  ('certifications', 'certifications', true),
  ('resumes', 'resumes', true)
ON CONFLICT (id) DO UPDATE SET public = true;

GRANT ALL ON TABLE storage.objects TO authenticated;
GRANT SELECT ON TABLE storage.objects TO anon;
GRANT ALL ON TABLE storage.buckets TO authenticated;
GRANT SELECT ON TABLE storage.buckets TO anon;

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_avatars" ON storage.objects;
CREATE POLICY "public_read_avatars" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "public_read_projects" ON storage.objects;
CREATE POLICY "public_read_projects" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'projects');

DROP POLICY IF EXISTS "public_read_certifications" ON storage.objects;
CREATE POLICY "public_read_certifications" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'certifications');

DROP POLICY IF EXISTS "public_read_resumes" ON storage.objects;
CREATE POLICY "public_read_resumes" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'resumes');

DROP POLICY IF EXISTS "admin_manage_avatars" ON storage.objects;
CREATE POLICY "admin_manage_avatars" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'avatars' AND public.is_admin())
  WITH CHECK (bucket_id = 'avatars' AND public.is_admin());

DROP POLICY IF EXISTS "admin_manage_projects" ON storage.objects;
CREATE POLICY "admin_manage_projects" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'projects' AND public.is_admin())
  WITH CHECK (bucket_id = 'projects' AND public.is_admin());

DROP POLICY IF EXISTS "admin_manage_certifications" ON storage.objects;
CREATE POLICY "admin_manage_certifications" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'certifications' AND public.is_admin())
  WITH CHECK (bucket_id = 'certifications' AND public.is_admin());

DROP POLICY IF EXISTS "admin_manage_resumes" ON storage.objects;
CREATE POLICY "admin_manage_resumes" ON storage.objects FOR ALL TO authenticated
  USING (bucket_id = 'resumes' AND public.is_admin())
  WITH CHECK (bucket_id = 'resumes' AND public.is_admin());
