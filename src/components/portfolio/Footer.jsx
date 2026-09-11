import './Footer.css';

export function Footer({ profile, socialLinks }) {
  const year = new Date().getFullYear();
  const name = profile?.name || 'Developer';

  return (
    <footer className="footer" role="contentinfo">
      <div className="container footer__inner">
        <div className="footer__brand">
          <a href="#hero" className="footer__logo" aria-label="Back to top">
            <span className="footer__logo-bracket" aria-hidden="true">&lt;</span>
            <span>{name}</span>
            <span className="footer__logo-bracket" aria-hidden="true">/&gt;</span>
          </a>
          <p className="footer__tagline">
            {profile?.tagline || 'Building things that matter.'}
          </p>
        </div>

        <nav className="footer__nav" aria-label="Footer navigation">
          <ul>
            {['About','Skills','Education','Experience','Projects','Certifications','Achievements','Contact'].map(s => (
              <li key={s}>
                <a href={`#${s.toLowerCase()}`} className="footer__nav-link">{s}</a>
              </li>
            ))}
          </ul>
        </nav>

        {socialLinks && socialLinks.length > 0 && (
          <div className="footer__socials">
            {socialLinks.map(link => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social-link"
                aria-label={link.platform}
              >
                {link.platform}
              </a>
            ))}
          </div>
        )}
      </div>

      <div className="footer__bottom">
        <p>© {year} {name}. Built with React & Supabase.</p>
        <a href="/admin" className="footer__admin-link">Admin</a>
      </div>
    </footer>
  );
}
