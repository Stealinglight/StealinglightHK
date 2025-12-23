import { useState, type FormEvent } from 'react';
import { Nav, Footer, Button, type NavLink, type ContactFormData } from '@stealinglight/ui';

const navLinks: NavLink[] = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function Contact() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
  });
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Spam check - honeypot field should be empty
    if (honeypot) {
      setStatus('success'); // Fake success for bots
      return;
    }

    setStatus('submitting');

    try {
      const response = await fetch(import.meta.env.VITE_CONTACT_API_URL || '/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, mode: 'creative' }),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="page-container">
      <Nav currentMode="creative" links={navLinks} />

      <main className="main-content">
        <section className="contact-hero">
          <h1>Get in Touch</h1>
          <p className="contact-subtitle">
            Have a project in mind? Let&apos;s discuss how we can bring your vision to life.
          </p>
        </section>

        <section className="contact-content">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>Let&apos;s Connect</h2>
              <p>
                I&apos;m always interested in hearing about new projects, creative collaborations, 
                and opportunities to help tell your story.
              </p>
              
              <div className="contact-methods">
                <div className="contact-method">
                  <h3>Email</h3>
                  <a href="mailto:hello@stealinglight.hk">hello@stealinglight.hk</a>
                </div>
                
                <div className="contact-method">
                  <h3>Social</h3>
                  <div className="social-links">
                    <a href="https://twitter.com/stealinglight" target="_blank" rel="noopener noreferrer">
                      Twitter
                    </a>
                    <a href="https://linkedin.com/in/stealinglight" target="_blank" rel="noopener noreferrer">
                      LinkedIn
                    </a>
                    <a href="https://github.com/stealinglight" target="_blank" rel="noopener noreferrer">
                      GitHub
                    </a>
                  </div>
                </div>

                <div className="contact-method">
                  <h3>Response Time</h3>
                  <p>I typically respond within 24-48 hours.</p>
                </div>
              </div>
            </div>

            <div className="contact-form-container">
              {status === 'success' ? (
                <div className="form-success">
                  <h3>Message Sent!</h3>
                  <p>Thank you for reaching out. I&apos;ll get back to you soon.</p>
                  <Button variant="secondary" onClick={() => setStatus('idle')}>
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Your name"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your@email.com"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell me about your project..."
                    />
                  </div>

                  {/* Honeypot field for spam prevention */}
                  <div className="form-group" style={{ display: 'none' }}>
                    <label htmlFor="website">Website</label>
                    <input
                      type="text"
                      id="website"
                      name="website"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {status === 'error' && (
                    <div className="form-error">
                      Something went wrong. Please try again or email directly.
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    variant="primary" 
                    disabled={status === 'submitting'}
                  >
                    {status === 'submitting' ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer currentMode="creative" />
    </div>
  );
}
