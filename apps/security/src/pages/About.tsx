import { Nav, Footer, type NavLink } from '@stealinglight/ui';

const navLinks: NavLink[] = [
  { label: 'Services', href: '/services' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function About() {
  return (
    <div className="page-container">
      <Nav currentMode="security" links={navLinks} />

      <main className="main-content">
        <section className="about-hero">
          <h1>About</h1>
          <p className="about-subtitle">Security researcher & consultant</p>
        </section>

        <section className="about-bio">
          <div className="bio-content">
            <div className="bio-image">
              <div className="image-placeholder">
                <span>Photo</span>
              </div>
            </div>
            <div className="bio-text">
              <h2>Securing the Digital World</h2>
              <p>
                With deep expertise in offensive security, cloud infrastructure, and 
                incident response, I help organizations identify and address vulnerabilities 
                before they become breaches.
              </p>
              <p>
                My approach combines technical depth with practical business understanding, 
                ensuring security recommendations are actionable and aligned with your 
                organizational goals.
              </p>
              <p>
                I&apos;ve helped organizations across finance, healthcare, technology, and 
                government sectors strengthen their security posture through comprehensive 
                assessments and strategic consulting.
              </p>
            </div>
          </div>
        </section>

        <section className="about-credentials">
          <div className="container">
            <h2>Credentials & Certifications</h2>
            <div className="credentials-grid">
              <div className="credential-item">
                <span className="credential-name">OSCP</span>
                <span className="credential-full">Offensive Security Certified Professional</span>
              </div>
              <div className="credential-item">
                <span className="credential-name">CISSP</span>
                <span className="credential-full">Certified Information Systems Security Professional</span>
              </div>
              <div className="credential-item">
                <span className="credential-name">AWS SAP</span>
                <span className="credential-full">AWS Solutions Architect Professional</span>
              </div>
              <div className="credential-item">
                <span className="credential-name">GPEN</span>
                <span className="credential-full">GIAC Penetration Tester</span>
              </div>
            </div>
          </div>
        </section>

        <section className="about-expertise">
          <div className="container">
            <h2>Areas of Expertise</h2>
            <div className="expertise-grid">
              <div className="expertise-item">
                <h3>Offensive Security</h3>
                <ul>
                  <li>Penetration Testing</li>
                  <li>Red Team Operations</li>
                  <li>Vulnerability Research</li>
                  <li>Social Engineering</li>
                </ul>
              </div>
              <div className="expertise-item">
                <h3>Cloud Security</h3>
                <ul>
                  <li>AWS/Azure/GCP Security</li>
                  <li>Container Security</li>
                  <li>Infrastructure as Code</li>
                  <li>Cloud Architecture Review</li>
                </ul>
              </div>
              <div className="expertise-item">
                <h3>Security Operations</h3>
                <ul>
                  <li>Incident Response</li>
                  <li>Digital Forensics</li>
                  <li>Threat Hunting</li>
                  <li>Security Monitoring</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer currentMode="security" />
    </div>
  );
}
