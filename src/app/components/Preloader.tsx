import { motion, useReducedMotion } from 'motion/react';

export function Preloader() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      key="preloader"
      className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-cinematic-black"
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.5 }}
    >
      {/* Brand text with amber pulse */}
      <motion.p
        animate={shouldReduceMotion ? undefined : { opacity: [0.5, 1, 0.5] }}
        transition={
          shouldReduceMotion
            ? undefined
            : { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
        }
        className="text-2xl md:text-4xl font-semibold tracking-[0.3em] uppercase text-cinematic-amber"
        style={{ fontFamily: 'Space Grotesk Variable, sans-serif' }}
      >
        STEALINGLIGHT
      </motion.p>

      {/* Progress bar */}
      <div className="mt-8 w-48 md:w-64 h-0.5 bg-white/10 overflow-hidden rounded-full">
        <motion.div
          className="h-full bg-cinematic-amber"
          initial={shouldReduceMotion ? undefined : { scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={shouldReduceMotion ? undefined : { duration: 0.8, ease: 'easeOut' }}
          style={{ transformOrigin: 'left' }}
        />
      </div>
    </motion.div>
  );
}
