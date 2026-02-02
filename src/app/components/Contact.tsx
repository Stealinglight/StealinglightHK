import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Loader2 } from 'lucide-react';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import { toast } from 'sonner';

// API endpoint - will be set after CDK deployment
const CONTACT_API_URL = import.meta.env.VITE_CONTACT_API_URL || '';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const initialFormData: FormData = {
  name: '',
  email: '',
  subject: '',
  message: '',
};

export function Contact() {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    // Check if API is configured
    if (!CONTACT_API_URL) {
      toast.error('Contact form is not configured yet');
      console.warn('VITE_CONTACT_API_URL is not set');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(CONTACT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      toast.success('Message sent successfully!');
      setFormData(initialFormData);
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-cinematic-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-white mb-4">{"Let's"} Work Together</h2>
          <p className="text-white/50 max-w-2xl mx-auto">
            Have a project in mind? Whether {"it's"} a commercial shoot, documentary, or something that requires getting the camera somewhere impossible... {"let's"} talk.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          <div className="text-center p-6 group">
            <div className="w-12 h-12 rounded-full bg-cinematic-amber/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-cinematic-amber/20 transition-colors">
              <Mail className="w-5 h-5 text-cinematic-amber" />
            </div>
            <h3 className="text-sm tracking-wider text-white/40 mb-2">EMAIL</h3>
            <a
              href="mailto:chris@stealinglight.hk"
              className="text-white/70 hover:text-cinematic-amber transition-colors"
            >
              chris@stealinglight.hk
            </a>
          </div>

          <div className="text-center p-6 group">
            <div className="w-12 h-12 rounded-full bg-cinematic-amber/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-cinematic-amber/20 transition-colors">
              <Phone className="w-5 h-5 text-cinematic-amber" />
            </div>
            <h3 className="text-sm tracking-wider text-white/40 mb-2">PHONE</h3>
            <a
              href="tel:+12027098696"
              className="text-white/70 hover:text-cinematic-amber transition-colors"
            >
              +1 (202) 709-8696
            </a>
          </div>

          <div className="text-center p-6 group">
            <div className="w-12 h-12 rounded-full bg-cinematic-amber/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-cinematic-amber/20 transition-colors">
              <MapPin className="w-5 h-5 text-cinematic-amber" />
            </div>
            <h3 className="text-sm tracking-wider text-white/40 mb-2">LOCATION</h3>
            <p className="text-white/70">Seattle, Washington</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="bg-cinematic-dark border border-white/5 rounded-lg p-8 md:p-12"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm tracking-wider text-white/40 mb-2">
                  NAME
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-cinematic-black/50 border border-white/10 text-white placeholder-white/30 focus:border-cinematic-amber/50 focus:outline-none transition-colors rounded disabled:opacity-50"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm tracking-wider text-white/40 mb-2">
                  EMAIL
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 bg-cinematic-black/50 border border-white/10 text-white placeholder-white/30 focus:border-cinematic-amber/50 focus:outline-none transition-colors rounded disabled:opacity-50"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm tracking-wider text-white/40 mb-2">
                SUBJECT
              </label>
              <input
                type="text"
                id="subject"
                value={formData.subject}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-cinematic-black/50 border border-white/10 text-white placeholder-white/30 focus:border-cinematic-amber/50 focus:outline-none transition-colors rounded disabled:opacity-50"
                placeholder="Project inquiry"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm tracking-wider text-white/40 mb-2">
                MESSAGE
              </label>
              <textarea
                id="message"
                rows={6}
                value={formData.message}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-cinematic-black/50 border border-white/10 text-white placeholder-white/30 focus:border-cinematic-amber/50 focus:outline-none transition-colors resize-none rounded disabled:opacity-50"
                placeholder="Tell me about your project..."
              />
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              className="w-full bg-cinematic-amber text-cinematic-black py-4 font-semibold hover:bg-cinematic-amber-light transition-colors tracking-wider rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  SENDING...
                </>
              ) : (
                'SEND MESSAGE'
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
