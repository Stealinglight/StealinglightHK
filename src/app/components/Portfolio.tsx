import { motion, AnimatePresence } from 'motion/react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { featuredVideo, gridVideos } from '../config/videos';
import { useInView } from '../../hooks/useInView';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { cn } from '../../lib/utils';

// D-01: Smooth deceleration easing for all cinematic animations
const EASE_CINEMATIC: [number, number, number, number] = [0.16, 1, 0.3, 1];

// D-05: Derive categories from video data, "All" first
const CATEGORIES = ['All', ...new Set(gridVideos.map((v) => v.category))] as const;

// D-10: Detect hover capability via CSS media query.
// true = device has hover (desktop/laptop with mouse)
// false = touch-only device (phone, tablet without mouse)
const IS_HOVER_DEVICE =
  typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;

function LazyVideo({
  project,
  isHovered,
  isTapped,
  onHover,
  onLeave,
  onTap,
  onClick,
  index: _index,
}: {
  project: (typeof gridVideos)[number];
  isHovered: boolean;
  isTapped: boolean;
  onHover: () => void;
  onLeave: () => void;
  onTap: () => void;
  onClick: () => void;
  index: number;
}) {
  const { ref, isInView } = useInView({ rootMargin: '200px' });
  const videoRef = useRef<HTMLVideoElement>(null);

  const isPreviewActive = isHovered || isTapped;

  useEffect(() => {
    if (isPreviewActive && videoRef.current) {
      videoRef.current.play();
    } else if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isPreviewActive]);

  const handleCardClick = () => {
    if (IS_HOVER_DEVICE) {
      // D-10: Hover-capable device -- hover already handles preview,
      // so any click means "open the video modal"
      onClick();
    } else {
      // D-10: Touch-only device (hover: none) -- use two-tap flow
      if (isTapped) {
        // Second tap: already previewing -> open video modal
        onClick();
      } else {
        // First tap: start preview + show TAP TO WATCH overlay
        onTap();
      }
    }
  };

  return (
    <div
      data-video-card
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={handleCardClick}
      className="group relative overflow-hidden cursor-pointer aspect-video rounded-lg"
    >
      <div ref={ref} className="absolute inset-0">
        {/* Thumbnail always visible as base layer */}
        <img
          src={project.posterUrl}
          alt={project.title}
          className={cn(
            'w-full h-full object-cover transition-transform duration-700',
            isPreviewActive && 'scale-110'
          )}
        />
        {/* Video mounts only when scrolled into view */}
        {isInView && (
          <video
            ref={videoRef}
            src={project.videoUrl}
            poster={project.posterUrl}
            muted
            loop
            playsInline
            preload="none"
            className={cn(
              'absolute inset-0 w-full h-full object-cover transition-transform duration-700',
              isPreviewActive && 'scale-110'
            )}
          />
        )}
      </div>

      {/* Default overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-cinematic-black/80 via-cinematic-black/20 to-transparent" />

      {/* Play button on hover/tap */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: isPreviewActive ? 1 : 0,
          scale: isPreviewActive ? 1 : 0.8,
        }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="w-16 h-16 rounded-full bg-cinematic-amber/90 flex items-center justify-center">
          <Play className="w-6 h-6 ml-1 text-cinematic-black" fill="currentColor" />
        </div>
      </motion.div>

      {/* Tap to watch overlay - touch-only devices per D-10 */}
      {!IS_HOVER_DEVICE && isTapped && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <span className="bg-cinematic-black/70 px-4 py-2 rounded-full text-sm text-white tracking-[0.05em] uppercase">
            TAP TO WATCH
          </span>
        </motion.div>
      )}

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-cinematic-amber text-xs tracking-widest">
              {project.category}
            </span>
            <h4 className="text-white text-lg mt-1">{project.title}</h4>
          </div>
          <span className="text-white/50 text-sm">{project.duration}</span>
        </div>
      </div>
    </div>
  );
}

export function Portfolio() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [tappedId, setTappedId] = useState<number | null>(null);
  const [activeVideo, setActiveVideo] = useState<
    (typeof gridVideos)[number] | typeof featuredVideo | null
  >(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useFocusTrap(modalRef, activeVideo !== null);

  const filteredVideos =
    activeCategory === 'All'
      ? gridVideos
      : gridVideos.filter((v) => v.category === activeCategory);

  const openVideo = (video: typeof featuredVideo | (typeof gridVideos)[number]) => {
    triggerRef.current = document.activeElement as HTMLElement;
    setActiveVideo(video);
    document.body.style.overflow = 'hidden';
  };

  const closeVideo = () => {
    setActiveVideo(null);
    setTappedId(null);
    document.body.style.overflow = '';
    // D-08: Return focus to the element that opened the modal
    requestAnimationFrame(() => {
      triggerRef.current?.focus();
      triggerRef.current = null;
    });
  };

  const handleTap = (project: (typeof gridVideos)[number]) => {
    setTappedId(project.id);
  };

  // Clear tapped state when clicking outside (deselect touch preview)
  useEffect(() => {
    if (tappedId === null) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-video-card]')) {
        setTappedId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [tappedId]);

  // VIDO-04: Keyboard navigation in modal
  const navigateVideo = useCallback(
    (direction: number) => {
      if (!activeVideo) return;
      const currentIndex = filteredVideos.findIndex((v) => v.id === activeVideo.id);
      // If current video is featured (not in filtered list), don't navigate
      if (currentIndex === -1) return;
      const nextIndex = (currentIndex + direction + filteredVideos.length) % filteredVideos.length;
      const nextVideo = filteredVideos.at(nextIndex);
      if (nextVideo) setActiveVideo(nextVideo);
    },
    [activeVideo, filteredVideos]
  );

  const togglePlayPause = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }, []);

  useEffect(() => {
    if (!activeVideo) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          closeVideo();
          break;
        case 'ArrowLeft':
          navigateVideo(-1);
          break;
        case 'ArrowRight':
          navigateVideo(1);
          break;
        case ' ':
          e.preventDefault(); // Prevent page scroll (RESEARCH.md Pitfall 7)
          togglePlayPause();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    modalRef.current?.focus();

    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeVideo, navigateVideo, togglePlayPause]);

  return (
    <section id="portfolio" className="py-24 md:py-32 bg-cinematic-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE_CINEMATIC }}
          className="mb-16 text-center"
        >
          <h2 className="text-white mb-4">Selected Work</h2>
          <p className="text-white/50 max-w-2xl mx-auto">
            A curated collection of projects showcasing visual storytelling across various mediums
          </p>
        </motion.div>

        {/* Featured Video - always visible regardless of filter */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE_CINEMATIC }}
          onClick={() => openVideo(featuredVideo)}
          className="mb-16 relative overflow-hidden aspect-video group cursor-pointer rounded-lg"
        >
          <video
            src={featuredVideo.videoUrl}
            poster={featuredVideo.posterUrl}
            muted
            loop
            playsInline
            preload="none"
            onMouseEnter={(e) => e.currentTarget.play()}
            onMouseLeave={(e) => {
              e.currentTarget.pause();
              e.currentTarget.currentTime = 0;
            }}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-cinematic-black/50 group-hover:bg-cinematic-black/40 transition-all duration-300" />

          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-8">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-20 h-20 rounded-full bg-cinematic-amber/90 flex items-center justify-center mb-6 group-hover:bg-cinematic-amber transition-all duration-300"
            >
              <Play className="w-8 h-8 ml-1 text-cinematic-black" fill="currentColor" />
            </motion.div>
            <span className="text-white/60 text-sm tracking-widest mb-3">FEATURED PROJECT</span>
            <h3 className="text-white mb-3 text-2xl md:text-3xl">{featuredVideo.title}</h3>
            <p className="text-white/60 max-w-2xl text-sm md:text-base">
              {featuredVideo.description}
            </p>
            <span className="text-cinematic-amber text-sm mt-4">{featuredVideo.duration}</span>
          </div>
        </motion.div>

        {/* Category Filter Pills - D-03 */}
        <div
          className="flex gap-2 mb-12 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' }}
        >
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                'px-4 py-2 text-sm tracking-normal whitespace-nowrap rounded-full border transition-all duration-300 min-h-[44px]',
                activeCategory === category
                  ? 'bg-cinematic-amber text-cinematic-black border-cinematic-amber font-semibold'
                  : 'bg-transparent text-white/60 border-white/20 hover:border-white/40 hover:text-white/80'
              )}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Project Grid with layout animation - D-04 */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredVideos.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  layout: { duration: 0.3, ease: EASE_CINEMATIC },
                  opacity: { duration: 0.2 },
                  scale: { duration: 0.2 },
                }}
              >
                <LazyVideo
                  project={project}
                  isHovered={hoveredId === project.id}
                  isTapped={tappedId === project.id}
                  onHover={() => setHoveredId(project.id)}
                  onLeave={() => setHoveredId(null)}
                  onTap={() => handleTap(project)}
                  onClick={() => openVideo(project)}
                  index={index}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Video Modal with keyboard navigation - VIDO-04 */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            ref={modalRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-video-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-cinematic-black/95 p-4 outline-none"
            onClick={closeVideo}
          >
            {/* Close button */}
            <button
              onClick={closeVideo}
              className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors z-10"
              aria-label="Close video"
            >
              <X className="w-8 h-8" />
            </button>

            {/* Previous button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateVideo(-1);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors z-10"
              aria-label="Previous video"
            >
              <ChevronLeft className="w-10 h-10" />
            </button>

            {/* Next button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateVideo(1);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors z-10"
              aria-label="Next video"
            >
              <ChevronRight className="w-10 h-10" />
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-6xl"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                ref={videoRef}
                key={activeVideo.id}
                src={activeVideo.videoUrl}
                controls
                autoPlay
                className="w-full aspect-video rounded-lg"
              />
              <div className="mt-4 text-center">
                <h3 id="modal-video-title" className="text-white text-xl">
                  {activeVideo.title}
                </h3>
                <p className="text-white/60 mt-2">{activeVideo.description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
