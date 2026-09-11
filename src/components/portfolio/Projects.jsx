import { useState } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { parseJsonField } from '../../utils/formatters';
import { ProjectModal } from './ProjectModal';
import './Projects.css';

export function Projects({ projects }) {
  const ref = useScrollReveal();
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  const categories = ['All', ...new Set((projects || []).map(p => p.category).filter(Boolean))];
  const featured = (projects || []).filter(p => p.is_featured);
  const filtered = activeFilter === 'All'
    ? (projects || [])
    : (projects || []).filter(p => p.category === activeFilter);

  return (
    <section id="projects" className="section projects">
      <div className="container">
        <div className="section__header">
          <span className="section__label">What I&apos;ve Built</span>
          <h2 className="section__title">Projects</h2>
          <p className="section__subtitle">A selection of my most impactful work.</p>
        </div>

        {/* Featured */}
        {featured.length > 0 && (
          <div className="projects__featured reveal" ref={ref}>
            <h3 className="projects__featured-label">⭐ Featured</h3>
            <div className="projects__featured-grid">
              {featured.slice(0, 2).map(project => (
                <FeaturedCard
                  key={project.id}
                  project={project}
                  onClick={() => setSelectedProject(project)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        {categories.length > 1 && (
          <div className="projects__filters" role="group" aria-label="Filter projects by category">
            {categories.map(cat => (
              <button
                key={cat}
                className={`projects__filter-btn ${activeFilter === cat ? 'projects__filter-btn--active' : ''}`}
                onClick={() => setActiveFilter(cat)}
                aria-pressed={activeFilter === cat}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="projects__grid">
            {filtered.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
        ) : (
          <div className="projects__empty">
            <p>Projects will appear here once added from the admin dashboard.</p>
          </div>
        )}
      </div>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}

function FeaturedCard({ project, onClick }) {
  const tech = parseJsonField(project.tech_stack);
  return (
    <article className="project-featured-card card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()} aria-label={`View ${project.title} details`}>
      {project.image_url && (
        <div className="project-featured-card__img-wrap">
          <img src={project.image_url} alt={project.title} className="project-featured-card__img" loading="lazy" />
        </div>
      )}
      <div className="project-featured-card__body">
        <h3 className="project-featured-card__title">{project.title}</h3>
        <p className="project-featured-card__desc">{project.description}</p>
        {tech.length > 0 && (
          <div className="project-featured-card__tech">
            {tech.slice(0, 5).map(t => <span key={t} className="tech-tag">{t}</span>)}
          </div>
        )}
        <div className="project-featured-card__links" onClick={e => e.stopPropagation()}>
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="project-link" aria-label="View source on GitHub">
              GitHub ↗
            </a>
          )}
          {project.demo_url && (
            <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="project-link project-link--primary" aria-label="View live demo">
              Live Demo ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

function ProjectCard({ project, onClick }) {
  const tech = parseJsonField(project.tech_stack);
  return (
    <article className="project-card card" onClick={onClick} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onClick()} aria-label={`View ${project.title} details`}>
      {project.image_url && (
        <div className="project-card__img-wrap">
          <img src={project.image_url} alt={project.title} className="project-card__img" loading="lazy" />
        </div>
      )}
      <div className="project-card__body">
        {project.category && <span className="project-card__category">{project.category}</span>}
        <h3 className="project-card__title">{project.title}</h3>
        <p className="project-card__desc">{project.description}</p>
        {tech.length > 0 && (
          <div className="project-card__tech">
            {tech.slice(0, 4).map(t => <span key={t} className="tech-tag">{t}</span>)}
            {tech.length > 4 && <span className="tech-tag tech-tag--more">+{tech.length - 4}</span>}
          </div>
        )}
        <div className="project-card__footer" onClick={e => e.stopPropagation()}>
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="project-link" aria-label="Source code">
              GitHub ↗
            </a>
          )}
          {project.demo_url && (
            <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="project-link project-link--primary" aria-label="Live demo">
              Demo ↗
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
