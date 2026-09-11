import { useScrollReveal } from '../../hooks/useScrollReveal';
import { formatDateRange, parseJsonField } from '../../utils/formatters';
import './Timeline.css';

export function Education({ education }) {
  const ref = useScrollReveal();

  return (
    <section id="education" className="section education">
      <div className="container">
        <div className="section__header">
          <span className="section__label">My Background</span>
          <h2 className="section__title">Education</h2>
        </div>
        {education && education.length > 0 ? (
          <div className="timeline reveal" ref={ref}>
            {education.map(item => (
              <article key={item.id} className="timeline__item">
                <div className="timeline__marker" aria-hidden="true">
                  <div className="timeline__dot" />
                </div>
                <div className="timeline__card card">
                  <div className="timeline__header">
                    <div>
                      <h3 className="timeline__title">{item.institution}</h3>
                      <p className="timeline__subtitle">
                        {item.degree}{item.field ? ` — ${item.field}` : ''}
                      </p>
                    </div>
                    <div className="timeline__meta">
                      <time className="timeline__date">
                        {formatDateRange(item.start_date, item.end_date, item.is_current)}
                      </time>
                      {item.location && (
                        <span className="timeline__location">📍 {item.location}</span>
                      )}
                    </div>
                  </div>
                  {item.description && (
                    <p className="timeline__description">{item.description}</p>
                  )}
                  {parseJsonField(item.achievements).length > 0 && (
                    <ul className="timeline__achievements">
                      {parseJsonField(item.achievements).map((a, i) => (
                        <li key={i}>{a}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="timeline__empty">
            <p>Education history will appear here once added from the admin dashboard.</p>
          </div>
        )}
      </div>
    </section>
  );
}
