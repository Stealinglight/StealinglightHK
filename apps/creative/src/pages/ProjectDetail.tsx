import { useParams, Link } from 'react-router-dom';
import { Button } from '@stealinglight/ui';
import { VideoPlayer } from '../components/VideoPlayer';
import { Project } from '../types';
import projectsData from '../data/projects.json';

const projects = projectsData as Project[];

/**
 * Project Detail Page - Individual project showcase with video
 */
export function ProjectDetail() {
    const { slug } = useParams<{ slug: string }>();
    const project = projects.find((p) => p.slug === slug);

    if (!project) {
        return (
            <div className="project-detail not-found">
                <div className="container">
                    <h1>Project Not Found</h1>
                    <p>The project you're looking for doesn't exist.</p>
                    <Button variant="creative" as="a" href="/projects">
                        View All Projects
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="project-detail">
            <section className="section">
                <div className="container container--narrow">
                    {/* Back Link */}
                    <Link to="/projects" className="back-link">
                        ← Back to Projects
                    </Link>

                    {/* Project Header */}
                    <header className="project-header">
                        <h1 className="project-title">{project.title}</h1>
                        <p className="project-date">
                            {new Date(project.date).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                            })}
                        </p>
                    </header>

                    {/* Video Player */}
                    {project.videoUrl && (
                        <div className="project-video">
                            <VideoPlayer
                                videoUrl={project.videoUrl}
                                posterUrl={project.thumbnailUrl}
                                title={project.title}
                            />
                        </div>
                    )}

                    {/* Project Content */}
                    <div className="project-content">
                        <p className="project-description">{project.description}</p>

                        <div className="project-tags">
                            {project.tags.map((tag) => (
                                <span key={tag} className="tag tag--creative">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="project-cta">
                        <p>Interested in working together?</p>
                        <Button variant="creative" as="a" href="/contact">
                            Get in Touch
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
