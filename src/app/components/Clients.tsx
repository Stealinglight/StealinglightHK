import { motion, useReducedMotion } from 'motion/react';
import { EASE_CINEMATIC } from '../constants/motion';

// 15 names divide evenly into both 3 and 5 columns, so no row ever ends in a stub rule
const CLIENTS = [
  'Tencent',
  'Intel',
  'Lenovo',
  'Burton',
  'Toyota',
  'Volkswagen',
  'Audi',
  'Aperture',
  'Calvin Klein',
  'Coach',
  'Converse',
  'DJI',
  'Netflix',
  'Puma',
  'Vogue',
];

export function Clients() {
  const shouldReduceMotion = useReducedMotion();

  const reveal = (delay = 0) => ({
    initial: shouldReduceMotion ? undefined : { opacity: 0, y: 24 },
    whileInView: shouldReduceMotion ? undefined : { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: shouldReduceMotion ? undefined : { duration: 0.9, delay, ease: EASE_CINEMATIC },
  });

  return (
    <section aria-labelledby="clients-label" className="bg-cinematic-black py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...reveal()} className="flex items-center gap-4">
          <span className="h-px w-10 bg-cinematic-amber/70" aria-hidden="true" />
          <h2
            id="clients-label"
            className="text-[0.7rem] font-normal uppercase tracking-[0.3em] text-white/40"
          >
            Selected Clients
          </h2>
        </motion.div>

        {/*
          Set as one uniform typographic index rather than logo marks: the repo's
          /logos/*.svg files are placeholder <text> elements in mismatched faces
          (Arial / Georgia / bold), so rendering them reads as unfinished artwork.
          One face, one weight, one tracking, one tone reads as an intentional
          client index. Cells are centre-set so ink insets symmetrically at both
          container edges instead of stranding a dead lane on the right.
        */}
        <motion.ul {...reveal(0.12)} className="mt-10 grid grid-cols-3 md:mt-14 md:grid-cols-5">
          {CLIENTS.map((name) => (
            <li
              key={name}
              className="flex items-center justify-center border-t border-white/[0.07] px-2 py-6 text-center md:py-7"
            >
              <span className="text-[0.62rem] font-normal uppercase tracking-[0.14em] text-white/45 [font-family:var(--font-display)] md:text-[0.72rem] md:tracking-[0.2em]">
                {name}
              </span>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
