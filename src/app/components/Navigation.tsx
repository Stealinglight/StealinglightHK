import { useState, useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Menu, X } from 'lucide-react';
import { EASE_CINEMATIC } from '../constants/motion';

const NAV_ITEMS = [
  { id: 'portfolio', label: 'Work' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'contact', label: 'Contact' },
];

const FOCUS_RING =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cinematic-amber focus-visible:ring-offset-4 focus-visible:ring-offset-cinematic-black';

export function Navigation() {
  const shouldReduceMotion = useReducedMotion();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Overlay menu: lock the page behind it and honour Escape
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        aria-label="Main"
        initial={shouldReduceMotion ? undefined : { y: -100 }}
        animate={shouldReduceMotion ? undefined : { y: 0 }}
        transition={shouldReduceMotion ? undefined : { duration: 0.8, ease: EASE_CINEMATIC }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? // Fully opaque once scrolled: a translucent/blurred strip smears over the work below
              'bg-cinematic-black py-4 border-b border-white/10'
            : 'bg-transparent py-6 md:py-8'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Masthead: the identity lives here, not in a display headline over the frame */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              aria-label="Chris McMillon Director of Photography · Los Angeles — back to top"
              className={`group text-left [text-shadow:0_1px_14px_rgba(10,10,10,0.85)] ${FOCUS_RING}`}
            >
              <span className="block uppercase font-semibold text-white text-[0.72rem] tracking-[0.2em] md:text-[0.8rem]">
                Chris McMillon
              </span>
              <span className="mt-1 block uppercase text-white/50 text-[0.5rem] tracking-[0.18em] transition-colors duration-500 group-hover:text-white/70 md:text-[0.55rem]">
                Director of Photography
                <span className="mx-1.5 text-cinematic-amber/70" aria-hidden="true">
                  &#183;
                </span>
                Los Angeles
              </span>
            </button>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-10">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`relative group uppercase text-white/70 text-[0.62rem] tracking-[0.28em] transition-colors duration-500 hover:text-white ${FOCUS_RING}`}
                >
                  {item.label}
                  <span className="absolute -bottom-1.5 left-0 w-0 h-px bg-cinematic-amber transition-all duration-500 group-hover:w-full group-focus-visible:w-full" />
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden text-white/70 hover:text-white transition-colors duration-300 ${FOCUS_RING}`}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" strokeWidth={1.25} />
              ) : (
                <Menu className="w-5 h-5" strokeWidth={1.25} />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-menu"
            initial={shouldReduceMotion ? undefined : { opacity: 0 }}
            animate={shouldReduceMotion ? undefined : { opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={
              shouldReduceMotion ? { duration: 0 } : { duration: 0.4, ease: EASE_CINEMATIC }
            }
            className="fixed inset-0 z-40 bg-cinematic-black/98 backdrop-blur-lg md:hidden"
          >
            <div className="flex flex-col items-start justify-center h-full gap-9 px-10">
              {NAV_ITEMS.map((item, index) => (
                <motion.button
                  key={item.id}
                  initial={shouldReduceMotion ? undefined : { opacity: 0, y: 24 }}
                  animate={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                  transition={
                    shouldReduceMotion
                      ? undefined
                      : { duration: 0.6, delay: 0.1 + index * 0.08, ease: EASE_CINEMATIC }
                  }
                  onClick={() => scrollToSection(item.id)}
                  className={`group flex items-baseline gap-5 text-left ${FOCUS_RING}`}
                >
                  <span
                    className="text-[0.55rem] tracking-[0.3em] text-cinematic-amber/60"
                    aria-hidden="true"
                  >
                    0{index + 1}
                  </span>
                  <span className="font-light uppercase text-3xl tracking-[0.14em] text-white/85 transition-colors duration-300 group-hover:text-white">
                    {item.label}
                  </span>
                </motion.button>
              ))}
            </div>

            <p className="absolute bottom-10 left-10 uppercase text-white/30 text-[0.55rem] tracking-[0.3em]">
              Chris McMillon
              <span className="mx-2 text-cinematic-amber/50" aria-hidden="true">
                &#183;
              </span>
              Cinematographer
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
