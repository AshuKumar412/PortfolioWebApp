import { useEffect, useState } from 'react';
import { profileService }        from '../../services/profileService';
import { projectsService }       from '../../services/projectsService';
import { skillsService }         from '../../services/skillsService';
import { educationService }      from '../../services/educationService';
import { experienceService }     from '../../services/experienceService';
import { certificationsService } from '../../services/certificationsService';
import { achievementsService }   from '../../services/achievementsService';
import { contactService }        from '../../services/contactService';
import { Spinner } from '../../components/ui/Spinner';
import '../admin.css';

export function AdminOverview() {
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [projects, skills, education, experience, certs, achievements, messages] = await Promise.all([
          projectsService.getAll(),
          skillsService.getAll(),
          educationService.getAll(),
          experienceService.getAll(),
          certificationsService.getAll(),
          achievementsService.getAll(),
          contactService.getAll({ limit: 1 }),
        ]);
        const unread = await contactService.getUnreadCount();
        setStats({
          projects:   projects.length,
          skills:     skills.length,
          education:  education.length,
          experience: experience.length,
          certs:      certs.length,
          achievements: achievements.length,
          messages:   messages.count || 0,
          unread,
        });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const statCards = stats ? [
    { label: 'Projects',        value: stats.projects,     icon: '🚀', href: '/admin/projects' },
    { label: 'Skills',          value: stats.skills,       icon: '💻', href: '/admin/skills' },
    { label: 'Education',       value: stats.education,    icon: '🎓', href: '/admin/education' },
    { label: 'Experience',      value: stats.experience,   icon: '💼', href: '/admin/experience' },
    { label: 'Certifications',  value: stats.certs,        icon: '🏅', href: '/admin/certifications' },
    { label: 'Achievements',    value: stats.achievements, icon: '🏆', href: '/admin/achievements' },
    { label: 'Messages',        value: stats.messages,     icon: '✉️', href: '/admin/messages' },
    { label: 'Unread Messages', value: stats.unread,       icon: '📬', href: '/admin/messages' },
  ] : [];

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Dashboard Overview</h1>
          <p className="admin-page-subtitle">Welcome back! Here&apos;s a summary of your portfolio.</p>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <div className="admin-stats-grid">
            {statCards.map(({ label, value, icon, href }) => (
              <a key={label} href={href} className="admin-stat-card admin-stat-card--link" style={{ textDecoration: 'none' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }} aria-hidden="true">{icon}</div>
                <div className="admin-stat-card__num">{value}</div>
                <div className="admin-stat-card__label">{label}</div>
              </a>
            ))}
          </div>

          <div className="admin-overview-tip">
            <h3>💡 Quick Tips</h3>
            <ul>
              <li>Use the sidebar to manage each section of your portfolio.</li>
              <li>Changes are <strong>reflected immediately</strong> on the public portfolio.</li>
              <li>Upload your profile photo and resume in <a href="/admin/profile">Profile</a>.</li>
              <li>Mark projects as <strong>Featured</strong> to highlight them in the hero section.</li>
              <li>Set items to <strong>Published</strong> to make them visible to visitors.</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
