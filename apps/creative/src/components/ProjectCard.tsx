import { Link } from 'react-router-dom';
import { Project } from '../types';

interface ProjectCardProps {
    project: Project;
}

/**
 * Project card component for displaying project thumbnails
 */
export function ProjectCard({ project }: ProjectCardProps) {
    return (
        <Link to={`/projects/${project.slug}`} className="project-card">
            <div className="project-card-image-wrapper">
                <img
                    src={project.thumbnailUrl}
                    alt={project.title}
                    className="project-card-image"
                    loading="lazy"
                />
                {project.featured && <span className="project-card-badge">Featured</span>}
            </div>
            <div className="project-card-content">
                <h3 className="project-card-title">{project.title}</h3>
                <p className="project-card-description">{project.description}</p>
                <div className="project-card-tags">
                    {project.tags.map((tag) => (
                        <span key={tag} className="tag tag--creative">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </Link>
    );
}
