import { motion, useReducedMotion } from 'motion/react';
import { EASE_CINEMATIC } from '../constants/motion';

const clients = [
  { name: 'Tencent', logo: '/logos/tencent.svg' },
  { name: 'Intel', logo: '/logos/intel.svg' },
  { name: 'Lenovo', logo: '/logos/lenovo.svg' },
  { name: 'Burton', logo: '/logos/burton.svg' },
  { name: 'Toyota', logo: '/logos/toyota.svg' },
  { name: 'Volkswagen', logo: '/logos/volkswagen.svg' },
  { name: 'Audi', logo: '/logos/audi.svg' },
  { name: 'Aperture', logo: '/logos/aperture.svg' },
  { name: 'Calvin Klein', logo: '/logos/calvin-klein.svg' },
  { name: 'Coach', logo: '/logos/coach.svg' },
  { name: 'Converse', logo: '/logos/converse.svg' },
  { name: 'DJI', logo: '/logos/dji.svg' },
  { name: 'Netflix', logo: '/logos/netflix.svg' },
  { name: 'Puma', logo: '/logos/puma.svg' },
  { name: 'Vogue', logo: '/logos/vogue.svg' },
];

const marqueeLogos = [...clients, ...clients];

export function Clients() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-16 md:py-24 bg-cinematic-black border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading with cinematic easing */}
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={shouldReduceMotion ? undefined : { duration: 0.6, ease: EASE_CINEMATIC }}
          className="text-center mb-12"
        >
          <h3 className="text-sm tracking-widest text-white/40">TRUSTED BY</h3>
        </motion.div>

        {/* Marquee container */}
        <motion.div
          initial={shouldReduceMotion ? undefined : { opacity: 0 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={shouldReduceMotion ? undefined : { duration: 0.8, delay: 0.2, ease: EASE_CINEMATIC }}
          className="overflow-hidden"
        >
          <div
            className="flex gap-12 animate-marquee hover:[animation-play-state:paused]"
            role="marquee"
            aria-label="Client logos"
          >
            {marqueeLogos.map((client, i) => (
              <img
                key={`${client.name}-${i}`}
                src={client.logo}
                alt={i < clients.length ? client.name : ''}
                aria-hidden={i >= clients.length}
                className="h-8 md:h-10 w-auto opacity-30 hover:opacity-60 transition-opacity duration-300 shrink-0"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
