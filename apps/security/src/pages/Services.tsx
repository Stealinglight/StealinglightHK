import { Nav, Footer, type NavLink } from '@stealinglight/ui';
import { ServiceCard } from '../components/ServiceCard';
import { Service } from '../types';
import servicesData from '../data/services.json';

const services = servicesData as Service[];

const navLinks: NavLink[] = [
  { label: 'Services', href: '/services' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function Services() {
  return (
    <div className="page-container">
      <Nav currentMode="security" links={navLinks} />

      <main className="main-content">
        <section className="services-hero">
          <h1>Security Services</h1>
          <p className="services-subtitle">
            Comprehensive cybersecurity solutions to protect your organization
          </p>
        </section>

        <section className="services-content">
          <div className="services-grid">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </section>

        <section className="services-process">
          <div className="container">
            <h2>Our Process</h2>
            <div className="process-steps">
              <div className="process-step">
                <div className="step-number">1</div>
                <h3>Discovery</h3>
                <p>We start by understanding your environment, assets, and security objectives.</p>
              </div>
              <div className="process-step">
                <div className="step-number">2</div>
                <h3>Assessment</h3>
                <p>Our team conducts thorough testing and analysis of your security posture.</p>
              </div>
              <div className="process-step">
                <div className="step-number">3</div>
                <h3>Reporting</h3>
                <p>You receive detailed findings with prioritized, actionable recommendations.</p>
              </div>
              <div className="process-step">
                <div className="step-number">4</div>
                <h3>Remediation</h3>
                <p>We support you through the remediation process and verify fixes.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer currentMode="security" />
    </div>
  );
}
