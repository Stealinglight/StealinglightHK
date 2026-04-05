import { motion, useReducedMotion } from 'motion/react';
import { Instagram, Film, Facebook, ExternalLink } from 'lucide-react';
import { EASE_CINEMATIC } from '../constants/motion';

export function Footer() {
  const shouldReduceMotion = useReducedMotion();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-cinematic-dark py-16 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={shouldReduceMotion ? undefined : { duration: 0.6, ease: EASE_CINEMATIC }}
          className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12"
        >
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="text-white font-semibold tracking-wider mb-4">STEALINGLIGHT PRODUCTIONS</h3>
            <p className="text-white/40 text-sm leading-relaxed">
              Cinematographer & Aerial Specialist based in Seattle, Washington.
            </p>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-sm tracking-widest mb-6 text-white/40">FOLLOW</h4>
            <div className="flex gap-4">
              <a
                href="https://vimeo.com/stealinglight"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-cinematic-amber transition-colors"
                aria-label="Vimeo"
              >
                <Film className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com/stealinglight_productions/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-cinematic-amber transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com/stealinglightpro/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-cinematic-amber transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Partner Links */}
          <div>
            <h4 className="text-sm tracking-widest mb-6 text-white/40">PARTNERS</h4>
            <div className="space-y-3">
              <a
                href="https://blnkmedia.wixsite.com/blnk2020"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/40 hover:text-cinematic-amber transition-colors text-sm"
              >
                BLNK Media (Milan)
                <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="http://spliceboys.tv/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/40 hover:text-cinematic-amber transition-colors text-sm"
              >
                Splice Boys
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Also */}
          <div>
            <h4 className="text-sm tracking-widest mb-6 text-white/40">ALSO</h4>
            <div className="space-y-3">
              <a
                href="https://cm-sec.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-white/40 hover:text-cinematic-amber transition-colors text-sm"
              >
                AI & Security Engineering
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={shouldReduceMotion ? undefined : { duration: 0.6, delay: 0.2, ease: EASE_CINEMATIC }}
          className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="text-white/30 text-sm">
            &copy; {currentYear} Stealinglight Productions. All Rights Reserved.
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
