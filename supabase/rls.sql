-- ============================================================
-- Portfolio Website — Row Level Security (RLS) & Permissions
-- Run AFTER schema.sql in the Supabase SQL Editor
-- ============================================================

-- 1. Helper function: check if authenticated user is the authorized admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT coalesce(lower(auth.jwt() ->> 'email') = '2400032678@kluniversity.in', false);
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO anon, authenticated;

-- 2. Schema USAGE grant
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- 3. Table privileges
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

-- 4. Enable RLS on all tables
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

-- 5. PROFILE Policies
DROP POLICY IF EXISTS "profile_public_read"  ON public.profile;
DROP POLICY IF EXISTS "profile: public read" ON public.profile;
DROP POLICY IF EXISTS "profile_auth_write"   ON public.profile;
DROP POLICY IF EXISTS "profile: auth write"  ON public.profile;
DROP POLICY IF EXISTS "profile_admin_write"  ON public.profile;

CREATE POLICY "profile_public_read"
  ON public.profile FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "profile_admin_write"
  ON public.profile FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 6. PROJECTS Policies
DROP POLICY IF EXISTS "projects_public_read"           ON public.projects;
DROP POLICY IF EXISTS "projects: public read published" ON public.projects;
DROP POLICY IF EXISTS "projects_auth_all"              ON public.projects;
DROP POLICY IF EXISTS "projects: auth all"             ON public.projects;
DROP POLICY IF EXISTS "projects_admin_all"             ON public.projects;

CREATE POLICY "projects_public_read"
  ON public.projects FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR public.is_admin());

CREATE POLICY "projects_admin_all"
  ON public.projects FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 7. SKILLS Policies
DROP POLICY IF EXISTS "skills_public_read"           ON public.skills;
DROP POLICY IF EXISTS "skills: public read published" ON public.skills;
DROP POLICY IF EXISTS "skills_auth_all"              ON public.skills;
DROP POLICY IF EXISTS "skills: auth all"             ON public.skills;
DROP POLICY IF EXISTS "skills_admin_all"             ON public.skills;

CREATE POLICY "skills_public_read"
  ON public.skills FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR public.is_admin());

CREATE POLICY "skills_admin_all"
  ON public.skills FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 8. EDUCATION Policies
DROP POLICY IF EXISTS "education_public_read"           ON public.education;
DROP POLICY IF EXISTS "education: public read published" ON public.education;
DROP POLICY IF EXISTS "education_auth_all"              ON public.education;
DROP POLICY IF EXISTS "education: auth all"             ON public.education;
DROP POLICY IF EXISTS "education_admin_all"             ON public.education;

CREATE POLICY "education_public_read"
  ON public.education FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR public.is_admin());

CREATE POLICY "education_admin_all"
  ON public.education FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 9. EXPERIENCE Policies
DROP POLICY IF EXISTS "experience_public_read"           ON public.experience;
DROP POLICY IF EXISTS "experience: public read published" ON public.experience;
DROP POLICY IF EXISTS "experience_auth_all"              ON public.experience;
DROP POLICY IF EXISTS "experience: auth all"             ON public.experience;
DROP POLICY IF EXISTS "experience_admin_all"             ON public.experience;

CREATE POLICY "experience_public_read"
  ON public.experience FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR public.is_admin());

CREATE POLICY "experience_admin_all"
  ON public.experience FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 10. CERTIFICATIONS Policies
DROP POLICY IF EXISTS "certifications_public_read"           ON public.certifications;
DROP POLICY IF EXISTS "certifications: public read published" ON public.certifications;
DROP POLICY IF EXISTS "certifications_auth_all"              ON public.certifications;
DROP POLICY IF EXISTS "certifications: auth all"             ON public.certifications;
DROP POLICY IF EXISTS "certifications_admin_all"             ON public.certifications;

CREATE POLICY "certifications_public_read"
  ON public.certifications FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR public.is_admin());

CREATE POLICY "certifications_admin_all"
  ON public.certifications FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 11. ACHIEVEMENTS Policies
DROP POLICY IF EXISTS "achievements_public_read"           ON public.achievements;
DROP POLICY IF EXISTS "achievements: public read published" ON public.achievements;
DROP POLICY IF EXISTS "achievements_auth_all"              ON public.achievements;
DROP POLICY IF EXISTS "achievements: auth all"             ON public.achievements;
DROP POLICY IF EXISTS "achievements_admin_all"             ON public.achievements;

CREATE POLICY "achievements_public_read"
  ON public.achievements FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR public.is_admin());

CREATE POLICY "achievements_admin_all"
  ON public.achievements FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 12. SERVICES Policies
DROP POLICY IF EXISTS "services_public_read"           ON public.services;
DROP POLICY IF EXISTS "services: public read published" ON public.services;
DROP POLICY IF EXISTS "services_auth_all"              ON public.services;
DROP POLICY IF EXISTS "services: auth all"             ON public.services;
DROP POLICY IF EXISTS "services_admin_all"             ON public.services;

CREATE POLICY "services_public_read"
  ON public.services FOR SELECT
  TO anon, authenticated
  USING (is_published = true OR public.is_admin());

CREATE POLICY "services_admin_all"
  ON public.services FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 13. SOCIAL LINKS Policies
DROP POLICY IF EXISTS "social_links_public_read"          ON public.social_links;
DROP POLICY IF EXISTS "social_links: public read visible" ON public.social_links;
DROP POLICY IF EXISTS "social_links_auth_all"             ON public.social_links;
DROP POLICY IF EXISTS "social_links: auth all"            ON public.social_links;
DROP POLICY IF EXISTS "social_links_admin_all"            ON public.social_links;

CREATE POLICY "social_links_public_read"
  ON public.social_links FOR SELECT
  TO anon, authenticated
  USING (is_visible = true OR public.is_admin());

CREATE POLICY "social_links_admin_all"
  ON public.social_links FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());





-- 14. CONTACT MESSAGES Policies
DROP POLICY IF EXISTS "contact_anon_insert"          ON public.contact_messages;
DROP POLICY IF EXISTS "contact_messages: public insert" ON public.contact_messages;
DROP POLICY IF EXISTS "contact_auth_all"             ON public.contact_messages;
DROP POLICY IF EXISTS "contact_messages: auth all"    ON public.contact_messages;
DROP POLICY IF EXISTS "contact_admin_all"            ON public.contact_messages;

CREATE POLICY "contact_anon_insert"
  ON public.contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "contact_admin_all"
  ON public.contact_messages FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 15. STORAGE BUCKETS
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
