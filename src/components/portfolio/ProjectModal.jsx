import { Modal } from '../ui/Modal';
import { parseJsonField } from '../../utils/formatters';
import './ProjectModal.css';

export function ProjectModal({ project, onClose }) {
  if (!project) return null;
  const tech     = parseJsonField(project.tech_stack);
  const features = parseJsonField(project.features);

  return (
    <Modal isOpen={!!project} onClose={onClose} title={project.title} size="lg">
      <div className="project-modal">
        {project.image_url && (
          <img
            src={project.image_url}
            alt={project.title}
            className="project-modal__img"
            loading="lazy"
          />
        )}

        {project.category && (
          <span className="project-modal__category">{project.category}</span>
        )}

        <p className="project-modal__desc">{project.description}</p>

        {project.problem && (
          <div className="project-modal__section">
            <h4 className="project-modal__section-title">Problem Solved</h4>
            <p className="project-modal__text">{project.problem}</p>
          </div>
        )}

        {features.length > 0 && (
          <div className="project-modal__section">
            <h4 className="project-modal__section-title">Key Features</h4>
            <ul className="project-modal__features">
              {features.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>
        )}

        {tech.length > 0 && (
          <div className="project-modal__section">
            <h4 className="project-modal__section-title">Technologies</h4>
            <div className="project-modal__tech">
              {tech.map(t => <span key={t} className="tech-tag">{t}</span>)}
            </div>
          </div>
        )}

        <div className="project-modal__actions">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              View Source ↗
            </a>
          )}
          {project.demo_url && (
            <a
              href={project.demo_url}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link project-link--primary"
            >
              Live Demo ↗
            </a>
          )}
        </div>
      </div>
    </Modal>
  );
}
