import { Nav, Footer, type NavLink } from '@stealinglight/ui';

const navLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function About() {
  return (
    <div className="page-container">
      <Nav currentMode="creative" links={navLinks} />

      <main className="main-content">
        <section className="about-hero">
          <h1>About</h1>
          <p className="about-subtitle">Creative technologist & visual storyteller</p>
        </section>

        <section className="about-bio">
          <div className="bio-content">
            <div className="bio-image">
              <div className="image-placeholder">
                <span>Photo</span>
              </div>
            </div>
            <div className="bio-text">
              <h2>Hello, I&apos;m the creative behind stealinglight</h2>
              <p>
                With over a decade of experience in visual production and creative technology, 
                I specialize in bringing ideas to life through compelling visual narratives. 
                My work spans commercial productions, documentary filmmaking, and interactive 
                digital experiences.
              </p>
              <p>
                I believe in the power of storytelling to connect, inspire, and transform. 
                Every project is an opportunity to craft something meaningful that resonates 
                with audiences and achieves tangible results.
              </p>
              <p>
                When I&apos;m not behind a camera or editing timeline, you&apos;ll find me exploring 
                new technologies, contributing to open-source projects, and mentoring the next 
                generation of creative professionals.
              </p>
            </div>
          </div>
        </section>

        <section className="about-skills">
          <h2>Expertise</h2>
          <div className="skills-grid">
            <div className="skill-category">
              <h3>Production</h3>
              <ul>
                <li>Commercial Video</li>
                <li>Documentary</li>
                <li>Live Events</li>
                <li>Aerial Cinematography</li>
              </ul>
            </div>
            <div className="skill-category">
              <h3>Post-Production</h3>
              <ul>
                <li>Editing & Color</li>
                <li>Motion Graphics</li>
                <li>Sound Design</li>
                <li>VFX Compositing</li>
              </ul>
            </div>
            <div className="skill-category">
              <h3>Technology</h3>
              <ul>
                <li>Web Development</li>
                <li>Interactive Media</li>
                <li>Cloud Infrastructure</li>
                <li>Automation</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="about-clients">
          <h2>Clients & Collaborations</h2>
          <p className="clients-intro">
            I&apos;ve had the privilege of working with organizations across industries, 
            from startups to Fortune 500 companies.
          </p>
          <div className="clients-logos">
            <div className="client-placeholder">Client Logo</div>
            <div className="client-placeholder">Client Logo</div>
            <div className="client-placeholder">Client Logo</div>
            <div className="client-placeholder">Client Logo</div>
          </div>
        </section>
      </main>

      <Footer currentMode="creative" />
    </div>
  );
}
