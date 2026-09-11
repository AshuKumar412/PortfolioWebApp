import { useScrollReveal } from '../../hooks/useScrollReveal';
import './Achievements.css';

export function Achievements({ achievements }) {
  const ref = useScrollReveal();

  if (!achievements || achievements.length === 0) {
    return (
      <section id="achievements" className="section achievements">
        <div className="container">
          <div className="section__header">
            <span className="section__label">Milestones</span>
            <h2 className="section__title">Achievements</h2>
          </div>
          <div className="achievements__empty">
            <p>Achievements will appear here once added from the admin dashboard.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="achievements" className="section achievements">
      <div className="container">
        <div className="section__header">
          <span className="section__label">Milestones</span>
          <h2 className="section__title">Achievements</h2>
        </div>
        <div className="achievements__grid reveal stagger-children" ref={ref}>
          {achievements.map(item => (
            <article key={item.id} className="achievement-card card">
              {item.icon && (
                <div className="achievement-card__icon" aria-hidden="true">{item.icon}</div>
              )}
              <h3 className="achievement-card__title">{item.title}</h3>
              {item.description && (
                <p className="achievement-card__desc">{item.description}</p>
              )}
              {item.date && (
                <time className="achievement-card__date">{item.date}</time>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
