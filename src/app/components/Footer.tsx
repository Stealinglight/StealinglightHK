import { motion, useReducedMotion } from 'motion/react';
import { Instagram, Film, Facebook } from 'lucide-react';
import type { ReactNode } from 'react';
import { EASE_CINEMATIC } from '../constants/motion';

// Quiet text link with an amber hairline that draws in on hover/focus
function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative inline-block text-sm text-white/50 transition-colors duration-300 hover:text-white focus-visible:text-white"
    >
      {children}
      <span
        className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-cinematic-amber/70 transition-transform duration-500 group-hover:scale-x-100 group-focus-visible:scale-x-100 motion-reduce:transition-none"
        aria-hidden="true"
      />
    </a>
  );
}

export function Footer() {
  const shouldReduceMotion = useReducedMotion();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-cinematic-dark py-20 md:py-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 16 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={shouldReduceMotion ? undefined : { duration: 0.8, ease: EASE_CINEMATIC }}
          className="grid grid-cols-1 gap-y-12 md:grid-cols-12 md:gap-8"
        >
          {/* Brand */}
          <div className="md:col-span-6">
            <h3 className="text-[11px] font-normal tracking-[0.3em] text-white/75">
              STEALINGLIGHT PRODUCTIONS
            </h3>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/45">
              Cinematographer and aerial specialist, based in Los Angeles, California.
            </p>
          </div>

          {/* Elsewhere */}
          <div className="flex flex-col gap-3 md:col-span-6 md:items-end">
            <h4 className="mb-1 text-[10px] tracking-[0.25em] uppercase text-white/40">
              Elsewhere
            </h4>
            <FooterLink href="https://blnkmedia.wixsite.com/blnk2020">
              BLNK Media (Milan)
            </FooterLink>
            <FooterLink href="http://spliceboys.tv/">Splice Boys</FooterLink>
            <FooterLink href="https://cm-sec.ai">AI &amp; Security Engineering</FooterLink>
          </div>
        </motion.div>

        {/* End credit */}
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={
            shouldReduceMotion ? undefined : { duration: 0.8, delay: 0.2, ease: EASE_CINEMATIC }
          }
          className="mt-16 flex flex-col-reverse items-center gap-8 border-t border-white/5 pt-8 sm:flex-row sm:justify-between"
        >
          <p className="text-[11px] tracking-[0.08em] text-white/30">
            &copy; {currentYear} Stealinglight Productions. All Rights Reserved.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="https://vimeo.com/stealinglight"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 transition-colors duration-300 hover:text-cinematic-amber"
              aria-label="Vimeo"
            >
              <Film className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com/stealinglight_productions/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 transition-colors duration-300 hover:text-cinematic-amber"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://facebook.com/stealinglightpro/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 transition-colors duration-300 hover:text-cinematic-amber"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
