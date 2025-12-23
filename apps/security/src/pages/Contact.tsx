import { useState, type FormEvent } from 'react';
import { Nav, Footer, Button, type NavLink, type ContactFormData } from '@stealinglight/ui';

const navLinks: NavLink[] = [
  { label: 'Services', href: '/services' },
  { label: 'Blog', href: '/blog' },
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

    if (honeypot) {
      setStatus('success');
      return;
    }

    setStatus('submitting');

    try {
      const response = await fetch(import.meta.env.VITE_CONTACT_API_URL || '/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, mode: 'security' }),
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
      <Nav currentMode="security" links={navLinks} />

      <main className="main-content">
        <section className="contact-hero">
          <h1>Contact</h1>
          <p className="contact-subtitle">
            Ready to discuss your security needs? Let&apos;s talk.
          </p>
        </section>

        <section className="contact-content">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>Get in Touch</h2>
              <p>
                Whether you need a penetration test, security consultation, or 
                emergency incident response, I&apos;m here to help.
              </p>

              <div className="contact-methods">
                <div className="contact-method">
                  <h3>Email</h3>
                  <a href="mailto:security@stealinglight.hk">security@stealinglight.hk</a>
                </div>

                <div className="contact-method">
                  <h3>PGP Key</h3>
                  <code className="pgp-fingerprint">0x1234 ABCD 5678 EFGH</code>
                </div>

                <div className="contact-method">
                  <h3>Response Time</h3>
                  <p>Usually within 24 hours. Emergency response available.</p>
                </div>

                <div className="contact-method">
                  <h3>Secure Communication</h3>
                  <p>For sensitive matters, please use encrypted email or request a secure channel.</p>
                </div>
              </div>
            </div>

            <div className="contact-form-container">
              {status === 'success' ? (
                <div className="form-success">
                  <h3>Message Received</h3>
                  <p>Thank you for reaching out. I&apos;ll respond shortly.</p>
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
                      placeholder="Describe your security needs..."
                    />
                  </div>

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
                    variant="security"
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

      <Footer currentMode="security" />
    </div>
  );
}
