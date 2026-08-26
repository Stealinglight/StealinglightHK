import { motion, useReducedMotion, useScroll, useTransform, type Variants } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { useRef, useState } from 'react';
import { EASE_CINEMATIC } from '../constants/motion';
import { CDN_BASE_URL } from '../config/videos';

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1.2, delay: 1.1, ease: EASE_CINEMATIC },
  },
};

const stillReveal: (index: number) => Variants = (index) => ({
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay: 0.9 + index * 0.14, ease: EASE_CINEMATIC },
  },
});

interface HeroProps {
  videoSrc?: string;
  posterSrc?: string;
  onVideoReady?: () => void;
}

// Stills are deterministic: a screenshot can land on any instant of the reel, but it can
// never catch these wrong. This exact set and order is the OWNER'S pick (Aug 2026):
// colour-key stage, rim-lit action, teal narrative profile.
const DESKTOP_STILLS = [
  {
    src: `${CDN_BASE_URL}/thumbnails/v2/03-bosch-b.jpg`,
    alt: 'Performer under green neon on a night stage — BOSCH television commercial',
  },
  {
    src: `${CDN_BASE_URL}/thumbnails/v3/05-fighter-punch.jpg`,
    alt: 'Boxer mid-punch, hard rim light against a near-black ring — The Fighter',
  },
  {
    src: `${CDN_BASE_URL}/thumbnails/v3/16-dpreel-profile.jpg`,
    alt: 'Profile close-up under teal key light with red practical detail — DP reel',
  },
];

// The 390px fold shows the first two of the same owner-picked set.
const MOBILE_STILLS = [DESKTOP_STILLS[0], DESKTOP_STILLS[1]];

// The frame is never cropped into a portrait. Mobile sizes the reel as a full-width 16:9
// block (a 25% trim off 2.39:1 that every segment was checked against); desktop fills.
const MEDIA_FIT = 'w-full h-full object-center object-cover';

export function Hero({ videoSrc, posterSrc, onVideoReady }: HeroProps) {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Slow push-in as the work rises. No opacity, no overlay — the frame is the page.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  const scrollToWork = () => {
    document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} className="relative w-full h-svh overflow-hidden bg-cinematic-black">
      {/* The evidence: one moving frame plus stills, on one grid at both widths. A single
          video fold is a gamble on whichever instant gets captured; stills cannot drift. */}
      <div className="absolute inset-x-0 top-16 z-10 md:top-20">
        <div className="w-full mx-auto max-w-7xl md:px-6 lg:px-8">
          {/* The reel — 16:9 on mobile, its native 2.39:1 uncropped on desktop */}
          <motion.div
            className="relative w-full aspect-video overflow-hidden md:aspect-[1920/804]"
            style={shouldReduceMotion ? undefined : { scale: mediaScale }}
          >
            {videoSrc ? (
              <>
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  aria-hidden="true"
                  onCanPlay={() => {
                    setVideoLoaded(true);
                    onVideoReady?.();
                  }}
                  className={`${MEDIA_FIT} transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
                >
                  <source src={videoSrc} type="video/mp4" />
                </video>
                {/* Poster shown while video loads */}
                {!videoLoaded && (
                  <img src={posterSrc} alt="" className={`absolute inset-0 ${MEDIA_FIT}`} />
                )}
              </>
            ) : (
              <img src={posterSrc} alt="" className={MEDIA_FIT} />
            )}
          </motion.div>

          {/* Mobile: two stills stacked under the reel — the sequence that won */}
          <div className="mt-2 space-y-2 md:hidden">
            {MOBILE_STILLS.map((still, index) => (
              <motion.img
                key={still.src}
                src={still.src}
                alt={still.alt}
                loading="lazy"
                decoding="async"
                variants={shouldReduceMotion ? undefined : stillReveal(index)}
                initial={shouldReduceMotion ? undefined : 'hidden'}
                animate={shouldReduceMotion ? undefined : 'visible'}
                className="w-full aspect-video object-cover"
              />
            ))}
          </div>

          {/* Desktop: three stills in a row complete the fold */}
          <div className="mt-3 hidden gap-3 md:grid md:grid-cols-3">
            {DESKTOP_STILLS.map((still, index) => (
              <motion.img
                key={still.src}
                src={still.src}
                alt={still.alt}
                loading="lazy"
                decoding="async"
                variants={shouldReduceMotion ? undefined : stillReveal(index)}
                initial={shouldReduceMotion ? undefined : 'hidden'}
                animate={shouldReduceMotion ? undefined : 'visible'}
                className="w-full aspect-video object-cover"
              />
            ))}
          </div>
        </div>
      </div>

      {/* The only overlay in the hero: a short gradient so the masthead stays legible */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-cinematic-black/70 to-transparent md:h-28" />

      {/* One affordance, keyed to the masthead's left edge. Desktop only — on mobile the
          work section's own label sits just below the fold, and two would read as a stutter. */}
      <motion.div
        variants={shouldReduceMotion ? undefined : fadeIn}
        initial={shouldReduceMotion ? undefined : 'hidden'}
        animate={shouldReduceMotion ? undefined : 'visible'}
        className="absolute inset-x-0 bottom-7 z-10 hidden md:block md:bottom-9"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={scrollToWork}
            className="group inline-flex items-center gap-3 uppercase text-white/80 text-[0.55rem] tracking-[0.28em] [text-shadow:0_1px_16px_rgba(10,10,10,0.9)] transition-colors duration-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cinematic-amber focus-visible:ring-offset-4 focus-visible:ring-offset-cinematic-black md:text-[0.62rem] md:tracking-[0.3em]"
          >
            <span className="relative">
              Selected Work
              <span className="absolute -bottom-1.5 left-0 w-0 h-px bg-cinematic-amber transition-all duration-500 group-hover:w-full group-focus-visible:w-full" />
            </span>
            <motion.span
              animate={shouldReduceMotion ? undefined : { y: [0, 5, 0] }}
              transition={
                shouldReduceMotion
                  ? undefined
                  : { duration: 2.6, repeat: Infinity, ease: 'easeInOut' }
              }
            >
              <ChevronDown className="w-4 h-4" strokeWidth={1.25} />
            </motion.span>
          </button>
        </div>
      </motion.div>
    </section>
  );
}
