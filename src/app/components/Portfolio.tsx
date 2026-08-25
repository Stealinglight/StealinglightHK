import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { featuredVideo, gridVideos } from '../config/videos';
import { useInView } from '../../hooks/useInView';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { cn } from '../../lib/utils';
import { EASE_CINEMATIC } from '../constants/motion';

// D-05: Derive categories from video data, "All" first
const CATEGORIES = ['All', ...new Set(gridVideos.map((v) => v.category))] as const;

// D-10: Detect hover capability via CSS media query.
// true = device has hover (desktop/laptop with mouse)
// false = touch-only device (phone, tablet without mouse)
const IS_HOVER_DEVICE =
  typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;

type GridProject = (typeof gridVideos)[number];

// Bottom-weighted scrim. Kept off the frame entirely until revealed so the
// still reads at full contrast in its resting state.
const SCRIM =
  'bg-[linear-gradient(to_top,rgba(10,10,10,0.94)_0%,rgba(10,10,10,0.5)_26%,rgba(10,10,10,0)_58%)]';

// ONE alignment system, page-wide: this is the exact container Navigation, Clients,
// About, Services and Footer use, so the grid's content edge lands on the same line as
// every other section instead of on its own.
const GUTTER = 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8';

// Film-strip seam, not a card border. Gutters are zero and the seam IS the gutter, but it
// is a SINGLE hairline: each tile draws only its bottom (plus its right from sm up) while
// the grid draws only its top (plus its left from sm up). No seam is ever drawn twice, so
// every internal seam and the full perimeter measure exactly 1px. Two borders meeting -- the
// previous scheme -- read as a 2px rule, which frames each tile as a card. Brightened to 24%
// warm white so one pixel still reads against a near-black frame.
//
// On mobile the vertical edges are omitted entirely: the stack is full-bleed, so a hairline
// there would sit on the screen edge. Horizontal seams alone read as a vertical film strip.
//
// Deliberately a border and not a background on the grid: a background would paint any
// empty cell in a filtered state as a bright block instead of letting absence read as
// absence.
const SEAM = 'border-[rgba(240,234,222,0.24)]';

// Mobile is full-bleed -- frames run edge to edge with no inset, which is what makes a
// phone read as a strip of cinema frames rather than a list of cards. From sm upwards the
// grid rejoins the page-wide alignment system above.
const GRID_FRAME = 'mx-auto max-w-7xl sm:px-6 lg:px-8';

// Most of these films open on black or a logo card, so a hover preview starting at 0
// shows a void tile. Seek to the project's vetted in-point instead. preload="none" means
// metadata often isn't there yet and a bare currentTime assignment would be dropped, so
// wait for it when necessary.
function seekToInPoint(video: HTMLVideoElement, inPoint: number) {
  if (inPoint <= 0) return;
  if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
    video.currentTime = inPoint;
    return;
  }
  video.addEventListener(
    'loadedmetadata',
    () => {
      video.currentTime = inPoint;
    },
    { once: true }
  );
}

function WorkTile({
  project,
  index,
  isHovered,
  isTapped,
  onHover,
  onLeave,
  onTap,
  onClick,
}: {
  project: GridProject;
  index: number;
  isHovered: boolean;
  isTapped: boolean;
  onHover: () => void;
  onLeave: () => void;
  onTap: () => void;
  onClick: () => void;
}) {
  const { ref, isInView } = useInView('200px');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isPosterLoaded, setIsPosterLoaded] = useState(false);

  // Pointer/tap state drives the tile's whole visual response -- lift, scrim, caption,
  // play affordance. Kept separate from playback capability below: a tile that cannot
  // preview must still answer the cursor, or a third of the grid reads as dead.
  const isActive = isHovered || isTapped;

  // No preview for films that carry burned-in subtitles/supers -- playback would put
  // export text on the tile. The still and the click-through modal are unaffected.
  const canPreview = !project.disableHoverPreview;
  const isPreviewActive = canPreview && isActive;
  const inPoint = project.previewStart ?? 0;

  // Touch devices get no hover affordance, so the caption stays legible there.
  // Pointer devices reveal it on hover or keyboard focus.
  const showMeta = !IS_HOVER_DEVICE || isActive || isFocused;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isPreviewActive) {
      // never open a preview on the film's black/logo intro
      if (video.currentTime < inPoint) seekToInPoint(video, inPoint);
      video.play().catch(() => {});
    } else {
      video.pause();
      seekToInPoint(video, inPoint);
    }
  }, [isPreviewActive, inPoint]);

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
      role="button"
      tabIndex={0}
      aria-label={
        IS_HOVER_DEVICE || isTapped
          ? `Watch ${project.title} — ${project.category}`
          : `Preview ${project.title} — ${project.category}`
      }
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
      className={cn(
        // fills the cell; the 16:9 box is set by the grid child that wraps this
        'group relative block h-full w-full cursor-pointer overflow-hidden',
        // non-black base: belt-and-braces against a void tile if onLoad never fires
        'border-b bg-cinematic-gray sm:border-r',
        SEAM,
        'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-cinematic-amber'
      )}
    >
      <div ref={ref} className="absolute inset-0">
        {/* Placeholder: a lazily-loaded tile must never render as a black void while it
            fetches. Sits under the image, so the image simply paints over it. */}
        {!isPosterLoaded && (
          <div aria-hidden="true" className="absolute inset-0 animate-pulse bg-cinematic-gray" />
        )}
        {/* The graded frame is the resting state -- no chrome, no tint */}
        <img
          src={project.posterUrl}
          alt={`${project.title} — ${project.category} still`}
          width={1280}
          height={720}
          loading={index < 4 ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setIsPosterLoaded(true)}
          onError={() => setIsPosterLoaded(true)}
          className={cn(
            'h-full w-full object-cover transition-transform duration-[1200ms] ease-out',
            isActive ? 'scale-[1.04]' : 'scale-100'
          )}
        />
        {/* Video mounts only when scrolled into view, and never for films whose
            export carries burned-in text */}
        {isInView && canPreview && (
          <video
            ref={videoRef}
            src={project.videoUrl}
            poster={project.posterUrl}
            muted
            loop
            playsInline
            preload="none"
            tabIndex={-1}
            aria-hidden="true"
            className={cn(
              'absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out',
              isPreviewActive ? 'scale-[1.04]' : 'scale-100'
            )}
          />
        )}
      </div>

      {/* Scrim -- only present behind visible metadata */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 transition-opacity duration-500',
          SCRIM,
          showMeta ? 'opacity-100' : 'opacity-0'
        )}
      />

      {/* Play affordance, restrained */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-0 flex items-center justify-center',
          'transition-all duration-500',
          // On isActive, not isPreviewActive: every tile opens a playable film on click,
          // so the affordance is honest even where the inline preview is suppressed.
          isActive ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        )}
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-cinematic-black/30 backdrop-blur-sm">
          <Play className="ml-0.5 h-4 w-4 text-white" fill="currentColor" />
        </span>
      </div>

      {/* Tap to watch overlay - touch-only devices per D-10 */}
      {!IS_HOVER_DEVICE && isTapped && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <span className="rounded-full bg-cinematic-black/70 px-4 py-2 text-xs uppercase tracking-[0.15em] text-white">
            Tap to watch
          </span>
        </motion.div>
      )}

      {/* Caption */}
      <div
        className={cn(
          'pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3',
          'p-3 transition-all duration-500 sm:p-4 md:p-5',
          showMeta ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
        )}
      >
        <div className="min-w-0">
          <span className="block text-[10px] uppercase tracking-[0.22em] text-cinematic-amber">
            {project.category}
          </span>
          <h4 className="mt-1 line-clamp-2 text-sm text-white sm:text-base">{project.title}</h4>
        </div>
        <span className="shrink-0 text-[11px] tabular-nums text-white/45">{project.duration}</span>
      </div>
    </div>
  );
}

export function Portfolio() {
  const shouldReduceMotion = useReducedMotion();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  // Keyed by tile, not project: one project can contribute several tiles to the mosaic.
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [tappedKey, setTappedKey] = useState<string | null>(null);
  const [activeVideo, setActiveVideo] = useState<GridProject | typeof featuredVideo | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  useFocusTrap(modalRef, activeVideo !== null);

  // Ensure body scroll is restored if component unmounts while modal is open
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const filteredVideos = useMemo(
    () =>
      activeCategory === 'All'
        ? gridVideos
        : gridVideos.filter((v) => v.category === activeCategory),
    [activeCategory]
  );

  const openVideo = (video: typeof featuredVideo | GridProject) => {
    triggerRef.current = document.activeElement as HTMLElement;
    setActiveVideo(video);
    document.body.style.overflow = 'hidden';
  };

  const closeVideo = () => {
    setActiveVideo(null);
    setTappedKey(null);
    document.body.style.overflow = '';
    // D-08: Return focus to the element that opened the modal
    requestAnimationFrame(() => {
      triggerRef.current?.focus();
      triggerRef.current = null;
    });
  };

  const handleTap = (project: GridProject) => {
    setTappedKey(project.tileKey);
  };

  // Clear tapped state when clicking outside (deselect touch preview)
  useEffect(() => {
    if (tappedKey === null) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-video-card]')) {
        setTappedKey(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [tappedKey]);

  // VIDO-04: Keyboard navigation in modal
  // The featured project has no tileKey, so it is never part of mosaic navigation.
  const activeTileKey = activeVideo && 'tileKey' in activeVideo ? activeVideo.tileKey : null;

  const navigateVideo = useCallback(
    (direction: number) => {
      if (!activeTileKey) return;
      const currentIndex = filteredVideos.findIndex((v) => v.tileKey === activeTileKey);
      // If current video is featured (not in filtered list), don't navigate
      if (currentIndex === -1) return;
      const nextIndex = (currentIndex + direction + filteredVideos.length) % filteredVideos.length;
      const nextVideo = filteredVideos.at(nextIndex);
      if (nextVideo) setActiveVideo(nextVideo);
    },
    [activeTileKey, filteredVideos]
  );

  const togglePlayPause = useCallback(() => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
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

  const openFeatured = () => openVideo(featuredVideo);
  const featuredInPoint = featuredVideo.previewStart ?? 0;

  return (
    <section
      id="portfolio"
      className="overflow-hidden bg-cinematic-dark pb-4 pt-12 md:pb-6 md:pt-16"
    >
      {/* Header -- a hairline label bar, not a title card. Costs ~1/8 viewport so the
          stills are on screen immediately rather than below a full screen of type. */}
      <motion.div
        initial={shouldReduceMotion ? undefined : { opacity: 0 }}
        whileInView={shouldReduceMotion ? undefined : { opacity: 1 }}
        viewport={{ once: true }}
        transition={shouldReduceMotion ? undefined : { duration: 0.7, ease: EASE_CINEMATIC }}
        className={cn(GUTTER, 'mb-3 md:mb-4')}
      >
        <div className="flex items-baseline justify-between gap-6 border-b border-white/10 pb-3">
          <h2 className="text-[13px] uppercase tracking-[0.3em] text-white md:text-sm">
            Selected Work
          </h2>
          <p className="hidden text-[11px] text-white/35 sm:block">
            Commercial · Documentary · Film — Asia, Europe, South America
          </p>
        </div>
      </motion.div>

      {/* Category Filter - D-03. Text-led, aligned to the grid's left edge. */}
      <div className={cn(GUTTER, 'mb-3 md:mb-4')}>
        <div
          className="flex gap-7 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: 'none' }}
        >
          {CATEGORIES.map((category) => {
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  'inline-flex min-h-[44px] items-center whitespace-nowrap',
                  'text-[11px] uppercase tracking-[0.18em] transition-colors duration-300',
                  'focus-visible:outline-2 focus-visible:outline-offset-2',
                  'focus-visible:outline-cinematic-amber',
                  isActive ? 'text-cinematic-amber' : 'text-white/60 hover:text-white/85'
                )}
              >
                <span className="relative">
                  {category}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'absolute -bottom-1.5 left-0 right-0 h-px origin-left bg-cinematic-amber',
                      'transition-transform duration-300',
                      isActive ? 'scale-x-100' : 'scale-x-0'
                    )}
                  />
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* One grid for the whole section. Full-bleed on mobile; from sm up it sits on the
          same gutter as the header and filters. 3 columns at desktop with zero gap -- the
          1px light seam between tiles is the only separation, so the mosaic reads as a strip
          of film frames. 8 tiles + the featured 2x2 span = 12 cells, and 12 divides by 1, 2
          and 3, so every row is exactly full at all three column counts - D-04 */}
      <div className={GRID_FRAME}>
        <div
          className={cn(
            // top and left only: each tile supplies its own bottom and right, so no seam
            // is ever drawn twice and every hairline measures 1px
            'grid grid-cols-1 gap-0 border-t sm:grid-cols-2 sm:border-l lg:grid-cols-3',
            SEAM
          )}
        >
          {/* Featured project -- a 2x2 span in the same mosaic, always visible
              regardless of the active filter */}
          <motion.div
            initial={shouldReduceMotion ? undefined : { opacity: 0 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1 }}
            viewport={{ once: true }}
            transition={shouldReduceMotion ? undefined : { duration: 1, ease: EASE_CINEMATIC }}
            className={cn(
              'relative aspect-video border-b sm:col-span-2 sm:row-span-2 sm:border-r',
              SEAM
            )}
          >
            <div
              role="button"
              tabIndex={0}
              aria-label={`Watch featured project: ${featuredVideo.title}`}
              onClick={openFeatured}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openFeatured();
                }
              }}
              className={cn(
                'group absolute inset-0 block cursor-pointer overflow-hidden',
                // non-black base so the tile is never a void while the poster fetches
                'bg-cinematic-gray',
                'focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-cinematic-amber'
              )}
            >
              <video
                src={featuredVideo.videoUrl}
                poster={featuredVideo.posterUrl}
                muted
                loop
                playsInline
                preload="none"
                tabIndex={-1}
                aria-hidden="true"
                onMouseEnter={(e) => {
                  // the reel opens on ~2s of black + a magenta wordmark; never show that
                  const video = e.currentTarget;
                  if (video.currentTime < featuredInPoint) {
                    seekToInPoint(video, featuredInPoint);
                  }
                  video.play().catch(() => {});
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.pause();
                  seekToInPoint(e.currentTarget, featuredInPoint);
                }}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-[1.03]"
              />
              <div
                aria-hidden="true"
                className={cn('pointer-events-none absolute inset-0', SCRIM)}
              />

              <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 sm:p-5 md:p-6">
                <div className="flex items-end justify-between gap-5">
                  <div className="min-w-0">
                    <span className="block text-[10px] uppercase tracking-[0.28em] text-cinematic-amber">
                      Featured — {featuredVideo.category}
                    </span>
                    <h3 className="mt-2 text-white md:text-2xl">{featuredVideo.title}</h3>
                    <p className="mt-2 hidden max-w-xl text-sm text-white/55 sm:block">
                      {featuredVideo.description}
                    </p>
                  </div>
                  <div className="hidden shrink-0 items-center gap-4 sm:flex">
                    <span className="text-[11px] tabular-nums text-white/45">
                      {featuredVideo.duration}
                    </span>
                    <span className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-cinematic-black/30 backdrop-blur-sm transition-colors duration-500 group-hover:border-cinematic-amber group-hover:bg-cinematic-amber/90">
                      <Play
                        className="ml-0.5 h-4 w-4 text-white transition-colors duration-500 group-hover:text-cinematic-black"
                        fill="currentColor"
                      />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <AnimatePresence mode="popLayout">
            {filteredVideos.map((project, index) => (
              <motion.div
                key={project.tileKey}
                layout
                // The 16:9 box lives on the grid CHILD, not inside the tile, so a row's
                // height is fixed by the cell and cannot be nudged by anything the tile
                // renders. Every tile in a column is then guaranteed the same height --
                // on mobile, one column means every tile in the stack is identical.
                className="aspect-video"
                initial={shouldReduceMotion ? undefined : { opacity: 0, y: 24 }}
                whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.97 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={
                  shouldReduceMotion
                    ? undefined
                    : {
                        layout: { duration: 0.45, ease: EASE_CINEMATIC },
                        duration: 0.7,
                        ease: EASE_CINEMATIC,
                        delay: (index % 3) * 0.07,
                      }
                }
              >
                <WorkTile
                  project={project}
                  index={index}
                  isHovered={hoveredKey === project.tileKey}
                  isTapped={tappedKey === project.tileKey}
                  onHover={() => setHoveredKey(project.tileKey)}
                  onLeave={() => setHoveredKey(null)}
                  onTap={() => handleTap(project)}
                  onClick={() => openVideo(project)}
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
              className="absolute right-6 top-6 z-10 text-white/60 transition-colors hover:text-white"
              aria-label="Close video"
            >
              <X className="h-8 w-8" />
            </button>

            {/* Previous/Next buttons — hidden when active video is not in filtered list (e.g., featured or category changed) */}
            {filteredVideos.some((v) => v.tileKey === activeTileKey) && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateVideo(-1);
                  }}
                  className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-white/40 transition-colors hover:text-white"
                  aria-label="Previous video"
                >
                  <ChevronLeft className="h-10 w-10" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateVideo(1);
                  }}
                  className="absolute right-4 top-1/2 z-10 -translate-y-1/2 text-white/40 transition-colors hover:text-white"
                  aria-label="Next video"
                >
                  <ChevronRight className="h-10 w-10" />
                </button>
              </>
            )}

            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3, ease: EASE_CINEMATIC }}
              className="w-full max-w-6xl"
              onClick={(e) => e.stopPropagation()}
            >
              <video
                ref={videoRef}
                key={activeVideo.id}
                src={activeVideo.videoUrl}
                poster={activeVideo.posterUrl}
                controls
                autoPlay
                className="aspect-video w-full bg-cinematic-black"
              />
              <div className="mt-5 flex items-start justify-between gap-6">
                <div className="min-w-0">
                  <span className="block text-[10px] uppercase tracking-[0.22em] text-cinematic-amber">
                    {activeVideo.category}
                  </span>
                  <h3 id="modal-video-title" className="mt-1 text-white">
                    {activeVideo.title}
                  </h3>
                  <p className="mt-2 text-sm text-white/55">{activeVideo.description}</p>
                </div>
                <span className="shrink-0 text-[11px] tabular-nums text-white/40">
                  {activeVideo.duration}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
