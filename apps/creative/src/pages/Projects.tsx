import { useState, useMemo } from 'react';
import { ProjectCard } from '../components/ProjectCard';
import { Project } from '../types';
import projectsData from '../data/projects.json';

const projects = projectsData as Project[];

/**
 * Projects Page - Grid of all creative projects with filtering
 */
export function Projects() {
    const [selectedTag, setSelectedTag] = useState<string | null>(null);

    // Get unique tags from all projects
    const allTags = useMemo(() => {
        const tags = new Set<string>();
        projects.forEach((p) => p.tags.forEach((t) => tags.add(t)));
        return Array.from(tags).sort();
    }, []);

    // Filter projects by selected tag
    const filteredProjects = useMemo(() => {
        if (!selectedTag) return projects;
        return projects.filter((p) => p.tags.includes(selectedTag));
    }, [selectedTag]);

    return (
        <div className="projects-page">
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <h1 className="section-title">Work</h1>
                        <p className="section-subtitle">
                            A collection of video production and creative projects
                        </p>
                    </div>

                    {/* Tag Filter */}
                    <div className="filter-bar">
                        <button
                            className={`filter-btn ${!selectedTag ? 'filter-btn--active' : ''}`}
                            onClick={() => setSelectedTag(null)}
                        >
                            All
                        </button>
                        {allTags.map((tag) => (
                            <button
                                key={tag}
                                className={`filter-btn ${selectedTag === tag ? 'filter-btn--active' : ''}`}
                                onClick={() => setSelectedTag(tag)}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>

                    {/* Projects Grid */}
                    <div className="grid grid--2">
                        {filteredProjects.map((project) => (
                            <ProjectCard key={project.slug} project={project} />
                        ))}
                    </div>

                    {filteredProjects.length === 0 && (
                        <p className="no-results">No projects found for this filter.</p>
                    )}
                </div>
            </section>
        </div>
    );
}
