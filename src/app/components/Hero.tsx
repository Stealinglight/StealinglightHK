import { motion, useReducedMotion, type Variants } from 'motion/react';
import { ChevronDown, Play } from 'lucide-react';
import { useRef, useState } from 'react';

// Cinematic easing: smooth deceleration curve (D-01)
const EASE_CINEMATIC: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Variant definitions with explicit per-element delays (D-02 non-uniform timeline)

const trackingFade: Variants = {
  hidden: { opacity: 0, letterSpacing: '0.5em' },
  visible: {
    opacity: 1,
    letterSpacing: '0.3em',
    transition: { duration: 1.5, delay: 0.3, ease: EASE_CINEMATIC },
  },
};

const fadeUpBlur: (delay: number) => Variants = (delay) => ({
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, delay, ease: EASE_CINEMATIC },
  },
});

const fadeIn: (delay: number) => Variants = (delay) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1, delay, ease: EASE_CINEMATIC },
  },
});

const fadeUp: (delay: number) => Variants = (delay) => ({
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay, ease: EASE_CINEMATIC },
  },
});

interface HeroProps {
  videoSrc?: string;
  posterSrc?: string;
  onVideoReady?: () => void;
}

export function Hero({ videoSrc, posterSrc, onVideoReady }: HeroProps) {
  const shouldReduceMotion = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const scrollToWork = () => {
    document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-cinematic-black">
      {/* Video/Image Background */}
      <div className="absolute inset-0">
        {videoSrc ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              muted
              loop
              playsInline
              poster={posterSrc}
              onCanPlay={() => {
                setVideoLoaded(true);
                onVideoReady?.();
              }}
              className={`w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
            {/* Poster shown while video loads */}
            {!videoLoaded && (
              <img
                src={posterSrc}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </>
        ) : (
          <img src={posterSrc} alt="" className="w-full h-full object-cover" />
        )}

        {/* Cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-cinematic-black/60 via-cinematic-black/40 to-cinematic-black/80" />
        {/* Side vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,10,10,0.4)_100%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Name - 0.3s delay */}
        <motion.p
          variants={shouldReduceMotion ? undefined : trackingFade}
          initial={shouldReduceMotion ? undefined : 'hidden'}
          animate={shouldReduceMotion ? undefined : 'visible'}
          className="text-sm md:text-base font-semibold text-white/70 mb-6 tracking-[0.3em]"
        >
          CHRIS MCMILLON
        </motion.p>

        {/* Headline - 0.6s delay */}
        <motion.h1
          variants={shouldReduceMotion ? undefined : fadeUpBlur(0.6)}
          initial={shouldReduceMotion ? undefined : 'hidden'}
          animate={shouldReduceMotion ? undefined : 'visible'}
          className="text-white mb-8"
          style={{ willChange: 'filter' }}
        >
          <span className="block">Cinematographer</span>
          <span className="block text-cinematic-amber">&#183; Aerial Specialist</span>
        </motion.h1>

        {/* Subtitle - 0.9s delay */}
        <motion.p
          variants={shouldReduceMotion ? undefined : fadeUpBlur(0.9)}
          initial={shouldReduceMotion ? undefined : 'hidden'}
          animate={shouldReduceMotion ? undefined : 'visible'}
          className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed"
          style={{ willChange: 'filter' }}
        >
          Aerial photographer with more than 8 years of commercial cinematography across Asia.
          Specialized in aerial platforms, dynamic camera movement, and immersive formats for brands
          including Intel, Tencent, Toyota, and Volkswagen.
        </motion.p>

        {/* CTAs - 1.6s delay */}
        <motion.div
          variants={shouldReduceMotion ? undefined : fadeUp(1.6)}
          initial={shouldReduceMotion ? undefined : 'hidden'}
          animate={shouldReduceMotion ? undefined : 'visible'}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          {/* Watch Reel button - amber filled */}
          <motion.button
            onClick={scrollToWork}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-cinematic-amber text-cinematic-black font-semibold hover:bg-cinematic-amber-light transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Play className="w-5 h-5 transition-transform group-hover:scale-110" />
            Watch Reel
          </motion.button>

          {/* View Work button - outlined */}
          <motion.button
            onClick={scrollToWork}
            className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white hover:border-white/40 hover:bg-white/5 transition-all duration-300"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            View Work
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll indicator - 2.0s delay */}
      <motion.button
        onClick={scrollToWork}
        variants={shouldReduceMotion ? undefined : fadeIn(2.0)}
        initial={shouldReduceMotion ? undefined : 'hidden'}
        animate={shouldReduceMotion ? undefined : 'visible'}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 hover:text-white/80 transition-colors z-10"
        aria-label="Scroll to content"
      >
        <motion.div
          animate={shouldReduceMotion ? undefined : { y: [0, 8, 0] }}
          transition={shouldReduceMotion ? undefined : { duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-8 h-8" />
        </motion.div>
      </motion.button>
    </section>
  );
}
