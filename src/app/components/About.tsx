import { motion, useReducedMotion } from 'motion/react';
import { CDN_BASE_URL } from '../config/videos';
import { EASE_CINEMATIC } from '../constants/motion';

const FACTS = [
  { label: 'Based', value: 'Los Angeles' },
  { label: 'Available', value: 'Commercial, documentary & adventure — worldwide' },
  { label: 'Certified', value: 'CAAC registered pilot · FAA Part 107' },
  { label: 'Safety', value: 'Red Cross First Aid instructor · CPR/AED · crisis management' },
];

const CRAFT = [
  { label: 'Aerial', value: 'Cinema drone · FPV · ShotOver' },
  { label: 'Movement', value: 'Gimbal · Steadycam · Vehicle rigs' },
  { label: 'Immersive', value: 'Bullet time · 360° video · VR · Insta360' },
  { label: 'Post', value: 'DaVinci Resolve · After Effects · Nuke · Unreal Engine' },
  { label: 'Live', value: 'Broadcast · Livestream' },
];

const LINK_CLASS =
  'text-white underline decoration-cinematic-amber/40 underline-offset-4 transition-colors duration-300 hover:decoration-cinematic-amber focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cinematic-amber focus-visible:ring-offset-4 focus-visible:ring-offset-cinematic-gray';

export function About() {
  const shouldReduceMotion = useReducedMotion();

  const reveal = (delay = 0) => ({
    initial: shouldReduceMotion ? undefined : { opacity: 0, y: 24 },
    whileInView: shouldReduceMotion ? undefined : { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: shouldReduceMotion ? undefined : { duration: 0.9, delay, ease: EASE_CINEMATIC },
  });

  return (
    <section id="about" className="py-24 md:py-32 bg-cinematic-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Default stretch alignment gives the sticky portrait room to travel on desktop */}
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Portrait — hard-edged, lightly desaturated, captioned like a print plate */}
          <div className="lg:col-span-5">
            <motion.figure {...reveal()} className="group lg:sticky lg:top-28">
              <div className="relative aspect-[4/5] overflow-hidden bg-cinematic-black lg:aspect-[3/4]">
                <motion.img
                  src={`${CDN_BASE_URL}/images/chris-mcmillon-profile.jpg`}
                  alt="Chris McMillon, cinematographer and aerial camera operator"
                  loading="lazy"
                  decoding="async"
                  initial={shouldReduceMotion ? undefined : { scale: 1.08 }}
                  whileInView={shouldReduceMotion ? undefined : { scale: 1 }}
                  viewport={{ once: true }}
                  transition={
                    shouldReduceMotion ? undefined : { duration: 1.6, ease: EASE_CINEMATIC }
                  }
                  className="h-full w-full object-cover grayscale-[35%] contrast-[105%] transition-[filter] duration-[1200ms] ease-out group-hover:grayscale-0"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-cinematic-black/70 via-cinematic-black/5 to-transparent" />
                <div className="pointer-events-none absolute inset-0 border border-white/10" />
              </div>
              <figcaption className="mt-5 border-t border-white/10 pt-4">
                <span className="block text-[0.7rem] uppercase tracking-[0.25em] text-white/60">
                  Chris McMillon
                </span>
                <span className="mt-1.5 block text-[0.65rem] uppercase tracking-[0.2em] text-white/30">
                  Director of Photography · Los Angeles
                </span>
              </figcaption>
            </motion.figure>
          </div>

          {/* Editorial column */}
          <div className="lg:col-span-6 lg:col-start-7">
            <motion.div {...reveal()}>
              <div className="flex items-center gap-4">
                <span className="h-px w-10 bg-cinematic-amber/70" />
                <span className="text-[0.7rem] uppercase tracking-[0.3em] text-white/40">
                  About
                </span>
              </div>

              <h2 className="mt-8 max-w-2xl text-2xl font-light leading-[1.25] tracking-[-0.01em] text-white/95 sm:text-3xl lg:text-4xl lg:leading-[1.2]">
                Third-generation aerial photographer. Eight years across Asia on the camera
                platforms that move — aerial systems, gimbals, dynamic rigs.
              </h2>

              <div className="mt-8 max-w-xl space-y-5 text-[0.95rem] leading-relaxed text-white/55">
                <p>
                  Freelance cinematographer and camera operator for Tencent, Intel, Lenovo, Burton,
                  Toyota, Volkswagen and Audi — movement traditional setups can&rsquo;t reach, from
                  remote mountain locations to high-pressure studio shoots.
                </p>
                <p>
                  Co-founded{' '}
                  <a
                    href="https://www.blnk.media/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={LINK_CLASS}
                  >
                    BLNK Media
                  </a>{' '}
                  in Shanghai as Producer / Director of Photography, and operated bullet time with{' '}
                  <a
                    href="http://spliceboys.tv/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={LINK_CLASS}
                  >
                    Splice Boys
                  </a>
                  .
                </p>
              </div>
            </motion.div>

            <motion.dl {...reveal(0.12)} className="mt-12 grid grid-cols-1 gap-x-10 sm:grid-cols-2">
              {FACTS.map((fact) => (
                <div key={fact.label} className="border-t border-white/10 py-4">
                  <dt className="text-[0.65rem] uppercase tracking-[0.25em] text-white/30">
                    {fact.label}
                  </dt>
                  <dd className="mt-2 text-sm leading-relaxed text-white/65">{fact.value}</dd>
                </div>
              ))}
            </motion.dl>

            <motion.div {...reveal(0.2)} className="mt-12">
              <span className="text-[0.7rem] uppercase tracking-[0.3em] text-white/40">
                Specialties
              </span>
              <dl className="mt-6">
                {CRAFT.map((item) => (
                  <div
                    key={item.label}
                    className="grid grid-cols-1 gap-x-6 border-t border-white/[0.07] py-4 sm:grid-cols-[7rem_1fr]"
                  >
                    <dt className="text-[0.65rem] uppercase tracking-[0.25em] text-white/30 sm:pt-0.5">
                      {item.label}
                    </dt>
                    <dd className="mt-2 text-sm leading-relaxed text-white/60 sm:mt-0">
                      {item.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
