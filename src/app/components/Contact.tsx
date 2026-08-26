import { motion, useReducedMotion } from 'motion/react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useState, useRef, useEffect, useCallback, type ChangeEvent, type FormEvent } from 'react';
import { toast } from 'sonner';
import { EASE_CINEMATIC } from '../constants/motion';

// API endpoint - will be set after CDK deployment
const CONTACT_API_URL = import.meta.env.VITE_CONTACT_API_URL || '';
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';

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

// Understated underline fields — amber on focus, no chrome (presentation only)
const FIELD_CLASS =
  'w-full bg-transparent border-b border-white/15 px-0 py-3 text-white ' +
  'placeholder:text-white/25 hover:border-white/30 focus:border-cinematic-amber ' +
  'focus:border-b-2 focus:pb-[11px] focus:outline-none transition-colors duration-300 ' +
  'disabled:opacity-40 disabled:cursor-not-allowed';

const LABEL_CLASS =
  'block text-[10px] tracking-[0.25em] uppercase text-white/40 mb-3 ' +
  'transition-colors duration-300 group-focus-within:text-cinematic-amber/80';

const META_TERM_CLASS = 'text-[10px] tracking-[0.25em] uppercase text-white/40 pt-0.5';

// Lazy-load Turnstile script when needed (D-02)
function loadTurnstileScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.turnstile) {
      resolve();
      return;
    }
    const existing = document.querySelector('script[src*="turnstile"]');
    if (existing) {
      // Script already loaded — window.turnstile check above missed, re-check
      if (window.turnstile) {
        resolve();
      } else {
        existing.addEventListener('load', () => resolve());
      }
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Turnstile'));
    document.head.appendChild(script);
  });
}

export function Contact() {
  const shouldReduceMotion = useReducedMotion();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileWidgetId = useRef<string | null>(null);
  const turnstileContainerRef = useRef<HTMLDivElement>(null);
  const turnstileLoaded = useRef(false);

  const resetTurnstile = useCallback(() => {
    setTurnstileToken('');
    if (turnstileWidgetId.current) {
      window.turnstile?.reset(turnstileWidgetId.current);
    }
  }, []);

  // D-02: Lazy-load Turnstile when contact section enters viewport
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY || turnstileLoaded.current) return;

    const container = turnstileContainerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          turnstileLoaded.current = true;

          loadTurnstileScript()
            .then(() => {
              if (!window.turnstile || !turnstileContainerRef.current) return;
              turnstileWidgetId.current = window.turnstile.render(
                turnstileContainerRef.current,
                {
                  sitekey: TURNSTILE_SITE_KEY,
                  callback: (token: string) => setTurnstileToken(token),
                  'error-callback': () => {
                    toast.error('Verification failed, please try again');
                    resetTurnstile();
                  },
                  'expired-callback': () => {
                    resetTurnstile();
                  },
                  theme: 'dark',
                  appearance: 'interaction-only',
                }
              );
            })
            .catch(() => {
              console.warn('Turnstile script failed to load');
            });
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [resetTurnstile]);

  // Cleanup Turnstile widget on unmount
  useEffect(() => {
    return () => {
      if (turnstileWidgetId.current && window.turnstile) {
        window.turnstile.remove(turnstileWidgetId.current);
      }
    };
  }, []);

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

    // Check Turnstile token (skip if site key not configured -- development)
    if (TURNSTILE_SITE_KEY) {
      // Pitfall 1: Check for expired token before submitting
      if (turnstileWidgetId.current && window.turnstile?.isExpired(turnstileWidgetId.current)) {
        resetTurnstile();
        toast.error('Verification expired, please wait a moment and try again');
        return;
      }
      if (!turnstileToken) {
        toast.error('Please wait for verification to complete');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(CONTACT_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          'cf-turnstile-response': turnstileToken,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      toast.success('Message sent successfully!');
      setFormData(initialFormData);
      resetTurnstile();
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send message');
      resetTurnstile();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-cinematic-black border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-16 lg:gap-x-16">
          {/* Statement + standing details */}
          <motion.div
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 24 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={shouldReduceMotion ? undefined : { duration: 0.9, ease: EASE_CINEMATIC }}
            className="lg:col-span-5"
          >
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-cinematic-amber/60" aria-hidden="true" />
              <span className="text-[11px] tracking-[0.3em] uppercase text-white/40">Contact</span>
            </div>

            <h2 className="mt-8 text-3xl md:text-4xl lg:text-[2.75rem] font-normal leading-[1.12] text-white">
              Not every project.
              <span className="block text-white/40">The right ones.</span>
            </h2>

            <p className="mt-8 max-w-md text-white/55 leading-relaxed">
              I shoot a short list of jobs a year now — commercial, documentary, aerial unit. If
              you&rsquo;ve got dates, a location that fights back, and a shot that has to work, tell
              me about it.
            </p>

            <dl className="mt-12 border-t border-white/10">
              <div className="grid grid-cols-[5.5rem_1fr] gap-4 border-b border-white/10 py-5 sm:grid-cols-[7rem_1fr]">
                <dt className={META_TERM_CLASS}>Phone</dt>
                <dd className="text-sm text-white/70">
                  {showPhone ? (
                    <a
                      href="tel:+12027098696"
                      className="border-b border-white/20 pb-0.5 transition-colors hover:border-cinematic-amber/60 hover:text-cinematic-amber"
                    >
                      +1 (202) 709-8696
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowPhone(true)}
                      className="border-b border-white/20 pb-0.5 text-white/45 transition-colors hover:border-cinematic-amber/60 hover:text-cinematic-amber"
                      aria-label="Reveal phone number"
                    >
                      Reveal number
                    </button>
                  )}
                </dd>
              </div>

              <div className="grid grid-cols-[5.5rem_1fr] gap-4 border-b border-white/10 py-5 sm:grid-cols-[7rem_1fr]">
                <dt className={META_TERM_CLASS}>Location</dt>
                <dd className="text-sm text-white/70">Los Angeles, California</dd>
              </div>

              <div className="grid grid-cols-[5.5rem_1fr] gap-4 border-b border-white/10 py-5 sm:grid-cols-[7rem_1fr]">
                <dt className={META_TERM_CLASS}>Scope</dt>
                <dd className="text-sm text-white/70">
                  Commercial, documentary, adventure — worldwide
                </dd>
              </div>
            </dl>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={shouldReduceMotion ? undefined : { opacity: 0, y: 24 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={
              shouldReduceMotion ? undefined : { duration: 0.9, delay: 0.15, ease: EASE_CINEMATIC }
            }
            className="lg:col-span-7 lg:border-l lg:border-white/10 lg:pl-16"
          >
            <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-10">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                <div className="group">
                  <label htmlFor="name" className={LABEL_CLASS}>
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    autoComplete="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={FIELD_CLASS}
                    placeholder="Your name"
                  />
                </div>
                <div className="group">
                  <label htmlFor="email" className={LABEL_CLASS}>
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className={FIELD_CLASS}
                    placeholder="name@studio.com"
                  />
                </div>
              </div>

              <div className="group">
                <label htmlFor="subject" className={LABEL_CLASS}>
                  Project
                </label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={FIELD_CLASS}
                  placeholder="Commercial · Documentary · Aerial unit"
                />
              </div>

              <div className="group">
                <label htmlFor="message" className={LABEL_CLASS}>
                  Details
                </label>
                <textarea
                  id="message"
                  rows={3}
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className={`${FIELD_CLASS} resize-none`}
                  placeholder="Dates, location, format — and what the shot needs to do."
                />
              </div>

              {/* Turnstile invisible widget container (D-01) */}
              {TURNSTILE_SITE_KEY && <div ref={turnstileContainerRef} id="turnstile-container" />}

              <div className="flex flex-col-reverse gap-8 pt-2 sm:flex-row-reverse sm:items-center sm:justify-between">
                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileTap={shouldReduceMotion || isSubmitting ? undefined : { scale: 0.99 }}
                  className="group inline-flex w-full shrink-0 items-center justify-center gap-2.5 whitespace-nowrap border border-cinematic-amber/50 px-8 py-4 sm:px-10 text-[11px] tracking-[0.25em] text-cinematic-amber transition-colors duration-300 hover:bg-cinematic-amber hover:text-cinematic-black focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cinematic-amber disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-cinematic-amber sm:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      SENDING...
                    </>
                  ) : (
                    <>
                      SEND MESSAGE
                      <ArrowRight
                        className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none"
                        aria-hidden="true"
                      />
                    </>
                  )}
                </motion.button>

                <p className="max-w-xs text-[11px] leading-relaxed text-white/45">
                  Messages come straight to me — no agency, no list. If it&rsquo;s a fit,
                  you&rsquo;ll hear back inside a day or two.
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
