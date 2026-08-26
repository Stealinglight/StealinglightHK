import { motion, useReducedMotion } from 'motion/react';
import { EASE_CINEMATIC } from '../constants/motion';

// Written as what lands on screen, not as a gear or software inventory
const SERVICES = [
  {
    title: 'Aerial & Drone',
    outcome:
      'Altitude, scale and moves no ground rig can reach — cleared to fly commercially in both the US and China.',
  },
  {
    title: 'Camera Movement',
    outcome:
      'Shots that travel: fluid tracking, sustained handheld, and movement that stays invisible at speed.',
  },
  {
    title: 'Specialty Capture',
    outcome:
      'Bullet time, full-sphere 360°, projection-mapped environments and immersive VR pieces.',
  },
  {
    title: 'Post & Finishing',
    outcome: 'Look development, color grade and effects work that never announces itself.',
  },
];

export function Services() {
  const shouldReduceMotion = useReducedMotion();

  const reveal = (delay = 0) => ({
    initial: shouldReduceMotion ? undefined : { opacity: 0, y: 24 },
    whileInView: shouldReduceMotion ? undefined : { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: shouldReduceMotion ? undefined : { duration: 0.9, delay, ease: EASE_CINEMATIC },
  });

  return (
    <section
      id="services"
      aria-labelledby="services-label"
      className="py-24 md:py-32 bg-cinematic-dark"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div {...reveal()} className="flex items-center gap-4">
          <span className="h-px w-10 bg-cinematic-amber/70" aria-hidden="true" />
          <h2
            id="services-label"
            className="text-[0.7rem] font-normal uppercase tracking-[0.3em] text-white/40"
          >
            Services
          </h2>
        </motion.div>

        {/* Numbered index rather than cards — hairlines carry the structure */}
        <ul className="mt-10 md:mt-16">
          {SERVICES.map((service, index) => (
            <motion.li
              key={service.title}
              {...reveal(index * 0.08)}
              className="group grid grid-cols-1 items-baseline gap-x-8 gap-y-3 border-t border-white/10 py-8 md:grid-cols-12 md:py-10"
            >
              <span
                aria-hidden="true"
                className="text-[0.55rem] tracking-[0.3em] text-cinematic-amber/60 md:col-span-1"
              >
                0{index + 1}
              </span>
              {/* h3 inherits --font-display (Space Grotesk) from fonts.css, keeping the
                  title in the same tracked-uppercase system as the eyebrow and numerals */}
              <h3 className="text-sm font-normal uppercase tracking-[0.2em] text-white/90 transition-colors duration-500 group-hover:text-white md:col-span-5 md:text-base">
                {service.title}
              </h3>
              <p className="max-w-xl text-sm leading-relaxed text-white/50 md:col-span-6">
                {service.outcome}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
