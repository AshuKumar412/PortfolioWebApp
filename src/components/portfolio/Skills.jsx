import { useScrollReveal } from '../../hooks/useScrollReveal';
import './Skills.css';

const CATEGORY_ICONS = {
  'Programming Languages': '💻',
  'Frontend': '🎨',
  'Backend': '⚡',
  'Database': '🗄',
  'DevOps': '⚙️',
  'Tools': '🛠',
  'Other': '🔮',
};

export function Skills({ skills }) {
  const ref = useScrollReveal();

  const grouped = (skills || []).reduce((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  if (!skills || skills.length === 0) {
    return (
      <section id="skills" className="section skills">
        <div className="container">
          <div className="section__header">
            <span className="section__label">What I Know</span>
            <h2 className="section__title">Skills & Technologies</h2>
          </div>
          <div className="skills__empty">
            <p>Skills will appear here once added from the admin dashboard.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="section skills">
      <div className="container">
        <div className="section__header">
          <span className="section__label">What I Know</span>
          <h2 className="section__title">Skills & Technologies</h2>
          <p className="section__subtitle">The tools and technologies I use to bring ideas to life.</p>
        </div>

        <div className="skills__categories reveal stagger-children" ref={ref}>
          {Object.entries(grouped).map(([category, categorySkills]) => (
            <article key={category} className="skills__category">
              <h3 className="skills__category-title">
                <span aria-hidden="true">{CATEGORY_ICONS[category] || '🔮'}</span>
                {category}
              </h3>
              <div className="skills__list">
                {categorySkills.map(skill => (
                  <div key={skill.id} className="skill-tag" title={skill.name}>
                    {skill.icon_name && (
                      <span className="skill-tag__icon" aria-hidden="true">{skill.icon_name}</span>
                    )}
                    <span className="skill-tag__name">{skill.name}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
