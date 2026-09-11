import { useEffect, useState } from 'react';
import { Navbar }          from '../components/portfolio/Navbar';
import { Hero }            from '../components/portfolio/Hero';
import { About }           from '../components/portfolio/About';
import { Skills }          from '../components/portfolio/Skills';
import { Education }       from '../components/portfolio/Education';
import { Experience }      from '../components/portfolio/Experience';
import { Projects }        from '../components/portfolio/Projects';
import { Certifications }  from '../components/portfolio/Certifications';
import { Achievements }    from '../components/portfolio/Achievements';
import { Contact }         from '../components/portfolio/Contact';
import { Footer }          from '../components/portfolio/Footer';
import { BackToTop }       from '../components/portfolio/BackToTop';
import { PageSpinner }     from '../components/ui/Spinner';
import { isSupabaseConfigured } from '../lib/supabase';

import { profileService }        from '../services/profileService';
import { projectsService }       from '../services/projectsService';
import { skillsService }         from '../services/skillsService';
import { educationService }      from '../services/educationService';
import { experienceService }     from '../services/experienceService';
import { certificationsService } from '../services/certificationsService';
import { achievementsService }   from '../services/achievementsService';
import { socialLinksService }    from '../services/socialLinksService';

// Placeholder data shown before Supabase is configured
const PLACEHOLDER = {
  profile: {
    name: 'Your Name',
    title: 'Full-Stack Developer',
    tagline: 'Building elegant solutions to complex problems',
    bio: 'A passionate developer who creates high-performance, user-centric web applications. Configure Supabase to manage all content from the admin dashboard.',
    bio_extended: 'Update your profile in the Admin Dashboard → Profile section to replace this placeholder content with your real information.',
    email: 'hello@example.com',
    location: 'Your City, Country',
    github_url: 'https://github.com',
    linkedin_url: 'https://linkedin.com',
    avatar_url: '',
    resume_url: '',
    years_experience: 3,
    projects_count: 20,
    clients_count: 10,
    is_available: true,
  },
  projects:       [],
  skills:         [],
  education:      [],
  experience:     [],
  certifications: [],
  achievements:   [],
  socialLinks:    [],
};

export function Portfolio() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [configError, setConfigError] = useState(!isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setData(PLACEHOLDER);
      setLoading(false);
      return;
    }

    async function fetchAll() {
      const results = await Promise.allSettled([
        profileService.get(),
        projectsService.getPublished(),
        skillsService.getPublished(),
        educationService.getPublished(),
        experienceService.getPublished(),
        certificationsService.getPublished(),
        achievementsService.getPublished(),
        socialLinksService.getVisible(),
      ]);

      const [
        profile, projects, skills,
        education, experience,
        certifications, achievements, socialLinks,
      ] = results.map(r => r.status === 'fulfilled' ? r.value : null);

      setData({
        profile:        profile        || PLACEHOLDER.profile,
        projects:       projects       || [],
        skills:         skills         || [],
        education:      education      || [],
        experience:     experience     || [],
        certifications: certifications || [],
        achievements:   achievements   || [],
        socialLinks:    socialLinks    || [],
      });
      setLoading(false);
    }

    fetchAll();
  }, []);

  if (loading) return <PageSpinner />;

  const { profile, projects, skills, education, experience, certifications, achievements, socialLinks } = data;

  return (
    <>
      <Navbar profileName={profile?.name} />

      {/* Setup notice — only shown when Supabase is not configured */}
      {configError && (
        <div
          role="alert"
          style={{
            position: 'fixed',
            bottom: 'var(--space-6)',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 'var(--z-toast)',
            background: 'rgba(251,191,36,0.12)',
            border: '1px solid rgba(251,191,36,0.5)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-4) var(--space-6)',
            color: '#fbbf24',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--weight-medium)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            maxWidth: 'min(520px, 90vw)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
          }}
        >
          <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>⚙️</span>
          <div>
            <strong>Demo mode:</strong> Add your real Supabase credentials to <code style={{ background: 'rgba(0,0,0,0.3)', padding: '1px 5px', borderRadius: 4 }}>.env</code> to load live content.{' '}
            <a href="/admin/login" style={{ color: '#fbbf24', textDecoration: 'underline' }}>Go to Admin →</a>
          </div>
          <button
            onClick={() => setConfigError(false)}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#fbbf24', cursor: 'pointer', fontSize: '1rem', flexShrink: 0 }}
            aria-label="Dismiss notice"
          >✕</button>
        </div>
      )}

      <main id="main-content">
        <Hero         profile={profile}          socialLinks={socialLinks} />
        <About        profile={profile} />
        <Skills       skills={skills} />
        <Education    education={education} />
        <Experience   experience={experience} />
        <Projects     projects={projects} />
        <Certifications certifications={certifications} />
        <Achievements achievements={achievements} />
        <Contact      profile={profile} />
      </main>
      <Footer profile={profile} socialLinks={socialLinks} />
      <BackToTop />
    </>
  );
}
