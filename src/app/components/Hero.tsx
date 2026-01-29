import { motion } from 'motion/react';
import { ChevronDown, Play } from 'lucide-react';
import { useRef, useState } from 'react';

interface HeroProps {
  videoSrc?: string;
  posterSrc?: string;
}

export function Hero({ videoSrc, posterSrc }: HeroProps) {
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
              onLoadedData={() => setVideoLoaded(true)}
              className={`w-full h-full object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-100' : 'opacity-0'
                }`}
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
          <img
            src={posterSrc}
            alt=""
            className="w-full h-full object-cover"
          />
        )}

        {/* Cinematic gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-cinematic-black/60 via-cinematic-black/40 to-cinematic-black/80" />
        {/* Side vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,10,10,0.4)_100%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Name */}
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.5em' }}
            animate={{ opacity: 1, letterSpacing: '0.3em' }}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="text-sm md:text-base font-medium text-white/70 mb-6 tracking-[0.3em]"
          >
            CHRIS MCMILLON
          </motion.p>

          {/* Main headline */}
          <h1 className="text-white mb-8">
            <span className="block">Cinematographer</span>
            <span className="block text-cinematic-amber">· Aerial Specialist</span>
          </h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed"
          >
            Aerial photographer with more than 8 years of commercial cinematography across Asia. Specialized in aerial platforms, dynamic camera movement, and immersive formats for brands including Intel, Tencent, Toyota, and Volkswagen.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              onClick={scrollToWork}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-cinematic-amber text-cinematic-black font-semibold hover:bg-cinematic-amber-light transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Play className="w-5 h-5 transition-transform group-hover:scale-110" />
              Watch Reel
            </motion.button>

            <motion.button
              onClick={scrollToWork}
              className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white hover:border-white/40 hover:bg-white/5 transition-all duration-300"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View Work
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToWork}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 hover:text-white/80 transition-colors z-10"
        aria-label="Scroll to content"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-8 h-8" />
        </motion.div>
      </motion.button>
    </section>
  );
}
