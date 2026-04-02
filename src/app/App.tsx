import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence } from 'motion/react';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { Portfolio } from './components/Portfolio';
import { Clients } from './components/Clients';
import { About } from './components/About';
import { Services } from './components/Services';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { SectionErrorBoundary } from './components/SectionErrorBoundary';
import { Preloader } from './components/Preloader';
import { ScrollProgress } from './components/ScrollProgress';
import { Toaster } from 'sonner';
import { heroVideo } from './config/videos';

function SkipLink() {
  return (
    <a
      href="#portfolio"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-cinematic-amber focus:text-cinematic-black focus:font-semibold focus:rounded focus:outline-none"
    >
      Skip to content
    </a>
  );
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const videoReadyRef = useRef(false);
  const minTimeRef = useRef(false);

  const checkDismiss = useCallback(() => {
    if (videoReadyRef.current && minTimeRef.current) {
      setIsLoading(false);
    }
  }, []);

  // Minimum display time: 0.8s (D-08)
  useEffect(() => {
    const timer = setTimeout(() => {
      minTimeRef.current = true;
      checkDismiss();
    }, 800);
    return () => clearTimeout(timer);
  }, [checkDismiss]);

  // Safety timeout: 4s max to prevent infinite preloader (RESEARCH.md Pitfall 3)
  useEffect(() => {
    const safetyTimer = setTimeout(() => setIsLoading(false), 4000);
    return () => clearTimeout(safetyTimer);
  }, []);

  const handleVideoReady = useCallback(() => {
    videoReadyRef.current = true;
    checkDismiss();
  }, [checkDismiss]);

  return (
    <div className="size-full bg-cinematic-black">
      <SkipLink />
      <AnimatePresence>
        {isLoading && <Preloader key="preloader" />}
      </AnimatePresence>
      <ScrollProgress />
      <Navigation />
      <SectionErrorBoundary>
        <Hero
          videoSrc={heroVideo.src}
          posterSrc={heroVideo.poster}
          onVideoReady={handleVideoReady}
        />
      </SectionErrorBoundary>
      <SectionErrorBoundary>
        <Portfolio />
      </SectionErrorBoundary>
      <SectionErrorBoundary>
        <Clients />
      </SectionErrorBoundary>
      <SectionErrorBoundary>
        <About />
      </SectionErrorBoundary>
      <SectionErrorBoundary>
        <Services />
      </SectionErrorBoundary>
      <SectionErrorBoundary>
        <Contact />
      </SectionErrorBoundary>
      <SectionErrorBoundary>
        <Footer />
      </SectionErrorBoundary>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#141414',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#fafafa',
          },
        }}
      />
    </div>
  );
}
