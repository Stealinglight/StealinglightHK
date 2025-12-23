import { Link } from 'react-router-dom';
import { Nav, Footer, Button, type NavLink } from '@stealinglight/ui';
import { PostCard } from '../components/PostCard';
import { ServiceCard } from '../components/ServiceCard';
import { BlogPost, Service } from '../types';
import postsData from '../data/posts.json';
import servicesData from '../data/services.json';

const posts = postsData as BlogPost[];
const services = servicesData as Service[];
const featuredPosts = posts.filter((p) => p.featured).slice(0, 2);
const featuredServices = services.slice(0, 3);

const navLinks: NavLink[] = [
  { label: 'Services', href: '/services' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function Home() {
  return (
    <div className="page-container">
      <Nav currentMode="security" links={navLinks} />

      <main className="main-content">
        {/* Hero Section */}
        <section className="hero hero--security">
          <div className="hero-content">
            <h1 className="hero-title">Cybersecurity Excellence</h1>
            <p className="hero-subtitle">
              Protecting your digital assets with expert penetration testing, 
              security consulting, and incident response services.
            </p>
            <div className="hero-actions">
              <Button variant="security" size="lg" as="a" href="/services">
                Our Services
              </Button>
              <Button variant="ghost" size="lg" as="a" href="/contact">
                Get Started
              </Button>
            </div>
          </div>
        </section>

        {/* Services Preview */}
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Security Services</h2>
              <p className="section-subtitle">
                Comprehensive security solutions tailored to your organization
              </p>
            </div>

            <div className="services-preview-grid">
              {featuredServices.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>

            <div className="section-footer">
              <Link to="/services" className="view-all-link">
                View All Services →
              </Link>
            </div>
          </div>
        </section>

        {/* Latest Posts */}
        <section className="section section--alt">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Security Insights</h2>
              <p className="section-subtitle">
                Latest research, guides, and analysis from our security experts
              </p>
            </div>

            <div className="posts-grid">
              {featuredPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>

            <div className="section-footer">
              <Link to="/blog" className="view-all-link">
                Read More Articles →
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section cta-section">
          <div className="container">
            <div className="cta-content">
              <h2>Ready to Strengthen Your Security?</h2>
              <p>
                Let&apos;s discuss how we can help protect your organization from cyber threats.
              </p>
              <Button variant="security" size="lg" as="a" href="/contact">
                Schedule a Consultation
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer currentMode="security" />
    </div>
  );
}
