import { useScrollReveal } from '../../hooks/useScrollReveal';
import { formatDate } from '../../utils/formatters';
import './Certifications.css';

export function Certifications({ certifications }) {
  const ref = useScrollReveal();

  if (!certifications || certifications.length === 0) {
    return (
      <section id="certifications" className="section certifications">
        <div className="container">
          <div className="section__header">
            <span className="section__label">My Credentials</span>
            <h2 className="section__title">Certifications</h2>
          </div>
          <div className="certs__empty">
            <p>Certifications will appear here once added from the admin dashboard.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="certifications" className="section certifications">
      <div className="container">
        <div className="section__header">
          <span className="section__label">My Credentials</span>
          <h2 className="section__title">Certifications</h2>
        </div>
        <div className="certs__grid reveal stagger-children" ref={ref}>
          {certifications.map(cert => (
            <article key={cert.id} className="cert-card card">
              {cert.image_url && (
                <img
                  src={cert.image_url}
                  alt={cert.name}
                  className="cert-card__img"
                  loading="lazy"
                />
              )}
              <div className="cert-card__body">
                <h3 className="cert-card__name">{cert.name}</h3>
                <p className="cert-card__issuer">{cert.issuer}</p>
                {cert.issue_date && (
                  <time className="cert-card__date">
                    Issued {formatDate(cert.issue_date)}
                    {cert.expiry_date ? ` · Expires ${formatDate(cert.expiry_date)}` : ''}
                  </time>
                )}
                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cert-card__link"
                    aria-label={`View ${cert.name} credential`}
                  >
                    View Credential ↗
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
