import { useScrollReveal } from '../../hooks/useScrollReveal';
import './About.css';

export function About({ profile }) {
  const ref = useScrollReveal();
  const p = profile || {};

  return (
    <section id="about" className="section about">
      <div className="container">
        <div className="section__header">
          <span className="section__label">Who I Am</span>
          <h2 className="section__title">About Me</h2>
        </div>
        <div className="about__grid reveal" ref={ref}>
          <div className="about__text">
            <p className="about__bio">
              {p.bio || 'Passionate developer with a love for clean code and thoughtful design. I specialize in building performant, accessible web applications that deliver real value to users.'}
            </p>
            {p.bio_extended && <p className="about__bio about__bio--secondary">{p.bio_extended}</p>}

            <div className="about__details">
              {p.location && (
                <div className="about__detail">
                  <span className="about__detail-icon" aria-hidden="true">📍</span>
                  <span>{p.location}</span>
                </div>
              )}
              {p.email && (
                <div className="about__detail">
                  <span className="about__detail-icon" aria-hidden="true">📧</span>
                  <a href={`mailto:${p.email}`} className="about__detail-link">{p.email}</a>
                </div>
              )}
              <div className="about__detail">
                <span className="about__detail-icon" aria-hidden="true">🟢</span>
                <span className={p.is_available !== false ? 'about__available' : 'about__unavailable'}>
                  {p.is_available !== false ? 'Open to opportunities' : 'Not currently available'}
                </span>
              </div>
            </div>
          </div>

          <div className="about__stats stagger-children">
            {[
              { num: p.years_experience ?? '3', label: 'Years Experience', suffix: '+' },
              { num: p.projects_count    ?? '20', label: 'Projects Built',  suffix: '+' },
              { num: p.clients_count     ?? '10', label: 'Happy Clients',   suffix: '+' },
              { num: p.coffee_count      ?? '∞',  label: 'Cups of Coffee',  suffix: ''  },
            ].map(({ num, label, suffix }) => (
              <div key={label} className="about__stat card">
                <span className="about__stat-num gradient-text">{num}{suffix}</span>
                <span className="about__stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
