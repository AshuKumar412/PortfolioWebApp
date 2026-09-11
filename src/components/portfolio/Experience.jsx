import { useScrollReveal } from '../../hooks/useScrollReveal';
import { formatDateRange, parseJsonField } from '../../utils/formatters';
import './Timeline.css';

export function Experience({ experience }) {
  const ref = useScrollReveal();

  return (
    <section id="experience" className="section experience">
      <div className="container">
        <div className="section__header">
          <span className="section__label">Where I&apos;ve Worked</span>
          <h2 className="section__title">Work Experience</h2>
        </div>
        {experience && experience.length > 0 ? (
          <div className="timeline reveal" ref={ref}>
            {experience.map(item => (
              <article key={item.id} className="timeline__item">
                <div className="timeline__marker" aria-hidden="true">
                  <div className="timeline__dot" />
                </div>
                <div className="timeline__card card">
                  <div className="timeline__header">
                    <div>
                      <h3 className="timeline__title">{item.role}</h3>
                      <p className="timeline__subtitle">{item.company}</p>
                    </div>
                    <div className="timeline__meta">
                      {item.is_current && (
                        <span className="timeline__current-badge">Current</span>
                      )}
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
            <p>Work experience will appear here once added from the admin dashboard.</p>
          </div>
        )}
      </div>
    </section>
  );
}
