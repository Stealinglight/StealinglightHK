import { Link } from 'react-router-dom';
import { Button } from '@stealinglight/ui';
import { ProjectCard } from '../components/ProjectCard';
import { Project } from '../types';
import projectsData from '../data/projects.json';

const projects = projectsData as Project[];
const featuredProjects = projects.filter((p) => p.featured);

/**
 * Creative Home Page - Featured reel and projects showcase
 */
export function Home() {
    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero hero--creative">
                <div className="hero-content">
                    <h1 className="hero-title">Visual Storytelling</h1>
                    <p className="hero-subtitle">
                        Crafting compelling narratives through video production,
                        motion graphics, and creative direction.
                    </p>
                    <div className="hero-actions">
                        <Button variant="creative" size="lg" as="a" href="/projects">
                            View Work
                        </Button>
                        <Button variant="ghost" size="lg" as="a" href="/contact">
                            Get in Touch
                        </Button>
                    </div>
                </div>
            </section>

            {/* Featured Projects Section */}
            <section className="section">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Featured Work</h2>
                        <p className="section-subtitle">
                            Selected projects showcasing creative vision and technical excellence
                        </p>
                    </div>

                    <div className="grid grid--2">
                        {featuredProjects.map((project) => (
                            <ProjectCard key={project.slug} project={project} />
                        ))}
                    </div>

                    <div className="section-footer">
                        <Link to="/projects" className="view-all-link">
                            View All Projects →
                        </Link>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <section className="section section--alt">
                <div className="container">
                    <div className="section-header">
                        <h2 className="section-title">Services</h2>
                    </div>

                    <div className="services-grid">
                        <div className="service-card">
                            <div className="service-icon">🎬</div>
                            <h3 className="service-title">Video Production</h3>
                            <p className="service-description">
                                End-to-end video production from concept to delivery,
                                including directing, cinematography, and post-production.
                            </p>
                        </div>

                        <div className="service-card">
                            <div className="service-icon">✨</div>
                            <h3 className="service-title">Motion Graphics</h3>
                            <p className="service-description">
                                Dynamic animations and visual effects that bring
                                stories to life with movement and style.
                            </p>
                        </div>

                        <div className="service-card">
                            <div className="service-icon">🎨</div>
                            <h3 className="service-title">Creative Direction</h3>
                            <p className="service-description">
                                Strategic creative guidance to ensure cohesive
                                visual storytelling across all deliverables.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
