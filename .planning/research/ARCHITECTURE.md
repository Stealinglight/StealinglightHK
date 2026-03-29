# Architecture Research

**Domain:** Video-heavy cinematography portfolio SPA (revamp of existing site)
**Researched:** 2026-03-27
**Confidence:** HIGH

## Current Architecture Assessment

The existing site is a flat React SPA where all section components live in a single `src/app/components/` directory. Every component manages its own state with `useState`, every component applies its own Motion `whileInView` animation directly in JSX, and every video element handles its own `onMouseEnter`/`onMouseLeave` play/pause logic inline. This works but creates three problems for a revamp:

1. **Video performance is unmanaged.** 19 video elements all use `preload="none"` but load full video files on hover with no bitrate awareness, no mobile detection, and no limit on concurrent downloads. The hero video autoplays at full resolution regardless of connection speed.

2. **Animation is repetitive, not choreographed.** Every section repeats the same `initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}` pattern. There is no coordinated reveal choreography, no scroll-linked parallax, and no shared element transitions between portfolio grid and video modal.

3. **Components are monolithic.** `Portfolio.tsx` (178 lines) handles grid rendering, hover state, video playback, modal state, and modal UI all in one component. There is no separation between data concerns, video playback logic, and presentation.

## Recommended Architecture

### System Overview

```
┌────────────────────────────────────────────────────────────────────┐
│                        App Shell                                    │
│  ┌──────────┐  ┌──────────────────────────────────────────────┐    │
│  │Navigation│  │              Section Composition              │    │
│  └──────────┘  │  ┌──────┐ ┌─────────┐ ┌─────┐ ┌───────┐    │    │
│                │  │ Hero │ │Portfolio│ │About│ │Contact│    │    │
│                │  └──┬───┘ └────┬────┘ └──┬──┘ └───┬───┘    │    │
│                └─────┼──────────┼─────────┼────────┼─────────┘    │
├──────────────────────┼──────────┼─────────┼────────┼──────────────┤
│                  Shared Systems │         │        │               │
│  ┌────────────────┐  ┌─────────┴────┐  ┌─┴────────┴──────────┐   │
│  │ Video Manager  │  │ Animation    │  │ Contact Form        │   │
│  │ (loading,      │  │ Orchestrator │  │ (validation,        │   │
│  │  playback,     │  │ (variants,   │  │  submission,        │   │
│  │  quality)      │  │  scroll)     │  │  API integration)   │   │
│  └───────┬────────┘  └──────────────┘  └─────────────────────┘   │
├──────────┼────────────────────────────────────────────────────────┤
│          │            Hooks & Utilities                            │
│  ┌───────┴────────┐  ┌───────────────┐  ┌──────────────────┐     │
│  │useVideoPlayer  │  │useScrollReveal│  │useMediaQuery     │     │
│  │useVideoPreload │  │useParallax    │  │useReducedMotion  │     │
│  │useVideoModal   │  │useStagger     │  │useNetworkQuality │     │
│  └────────────────┘  └───────────────┘  └──────────────────┘     │
├───────────────────────────────────────────────────────────────────┤
│                    Config & Data                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐    │
│  │ videos.ts    │  │ animations.ts│  │ theme (CSS vars)     │    │
│  │ (metadata,   │  │ (variants,   │  │ (cinematic tokens)   │    │
│  │  CDN URLs)   │  │  transitions)│  │                      │    │
│  └──────────────┘  └──────────────┘  └──────────────────────┘    │
└───────────────────────────────────────────────────────────────────┘
         │
         ▼
┌───────────────────────────────────────────────────────────────────┐
│                    External Services                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐    │
│  │ CloudFront   │  │ API Gateway  │  │ Google Analytics     │    │
│  │ Media CDN    │  │ + Lambda     │  │                      │    │
│  └──────────────┘  └──────────────┘  └──────────────────────┘    │
└───────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component       | Responsibility                                           | Typical Implementation                                                                       |
| --------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| **App Shell**   | Global layout, error boundary, toast provider            | Thin wrapper, composes sections in order                                                     |
| **Navigation**  | Fixed nav, scroll tracking, active section indicator     | `useScroll` + `useTransform` for background opacity, IntersectionObserver for active section |
| **Hero**        | Full-viewport video background, headline choreography    | Poster-first loading, progressive video fade-in, staggered text animation via variants       |
| **Portfolio**   | Video grid display, category filtering (future)          | Renders `VideoCard` components from config data, delegates playback to hooks                 |
| **VideoCard**   | Single video thumbnail with hover preview                | Uses `useVideoPlayer` hook, IntersectionObserver for lazy loading                            |
| **VideoModal**  | Full-screen video playback overlay                       | `AnimatePresence` + `layoutId` for shared element transition from grid card                  |
| **VideoPlayer** | Custom video controls (play, mute, progress, fullscreen) | Extracted from current `Reel.tsx`, used inside modal                                         |
| **About**       | Bio, credentials, skills                                 | Scroll-reveal with parallax image                                                            |
| **Contact**     | Form with validation and API submission                  | Uses `useContactForm` hook for state management                                              |
| **Clients**     | Logo showcase with staggered reveal                      | Variant-based stagger animation                                                              |
| **Footer**      | Social links, copyright                                  | Static content                                                                               |

## Recommended Project Structure

```
src/
├── main.tsx                    # React entry point
├── styles/
│   ├── index.css               # CSS entry (imports order)
│   ├── fonts.css               # Font declarations
│   ├── tailwind.css            # Tailwind v4 import
│   └── theme.css               # CSS custom properties, cinematic tokens
├── app/
│   ├── App.tsx                 # Root component, section composition
│   ├── config/
│   │   ├── videos.ts           # Video metadata + CDN URLs
│   │   ├── animations.ts       # Shared animation variants + transitions
│   │   ├── navigation.ts       # Nav items config
│   │   └── site.ts             # Site metadata (name, tagline, social links)
│   ├── hooks/
│   │   ├── use-video-player.ts     # Play/pause/seek/mute/fullscreen controls
│   │   ├── use-video-preload.ts    # IntersectionObserver lazy loading for videos
│   │   ├── use-video-modal.ts      # Modal open/close state + body scroll lock
│   │   ├── use-scroll-reveal.ts    # Reusable whileInView wrapper with variants
│   │   ├── use-parallax.ts         # useScroll + useTransform for parallax layers
│   │   ├── use-media-query.ts      # Responsive breakpoint detection (keep existing)
│   │   ├── use-reduced-motion.ts   # prefers-reduced-motion detection
│   │   └── use-contact-form.ts     # Form state, validation, API submission
│   ├── components/
│   │   ├── sections/               # Full-page section components
│   │   │   ├── Hero.tsx
│   │   │   ├── Portfolio.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── Clients.tsx
│   │   │   └── Footer.tsx
│   │   ├── video/                  # Video-specific components
│   │   │   ├── VideoCard.tsx       # Thumbnail + hover preview
│   │   │   ├── VideoModal.tsx      # Fullscreen playback overlay
│   │   │   ├── VideoPlayer.tsx     # Custom controls (from Reel.tsx)
│   │   │   └── HeroVideo.tsx       # Background autoplay with poster fallback
│   │   ├── layout/                 # Layout components
│   │   │   ├── Navigation.tsx
│   │   │   ├── SectionHeader.tsx   # Reusable section title + subtitle pattern
│   │   │   └── ErrorBoundary.tsx   # React error boundary
│   │   └── ui/                     # Keep only used primitives
│   │       ├── utils.ts            # cn() helper
│   │       └── button.tsx          # If needed post-cleanup
│   └── lib/
│       └── api.ts                  # Contact form API client
```

### Structure Rationale

- **`sections/`:** Separates the 5-6 full-page scroll sections from smaller components. Each section is a composition of smaller parts, not a monolith. This makes the revamp manageable: redesign one section at a time.

- **`video/`:** Video handling is this site's core complexity. Isolating video components creates clear boundaries: `VideoCard` handles presentation, `VideoPlayer` handles controls, `VideoModal` handles the overlay. The heavy lifting (loading, playback, quality) lives in hooks.

- **`hooks/`:** Every reusable behavior gets a hook. This prevents the current pattern where `Portfolio.tsx` handles hover state, modal state, and video playback all inline. Hooks are testable, composable, and shareable across sections.

- **`config/`:** All hardcoded data (video metadata, nav items, animation variants) lives in config files, not component code. This is already partially done with `videos.ts`; extend the pattern to animations and site metadata.

- **`layout/`:** Navigation and error boundary are structural concerns, not content sections. `SectionHeader` extracts the repeated title+subtitle pattern that currently appears identically in Portfolio, Services, Contact, and About.

## Architectural Patterns

### Pattern 1: Video Loading Pipeline

**What:** A three-stage loading strategy: poster image first, then low-quality preview on viewport entry, then full video on interaction.

**When to use:** Every video element on the site (19 portfolio videos + 1 hero video).

**Trade-offs:** More complex than current "load nothing, then load everything on hover" approach, but prevents the current problem where hovering loads a full multi-MB video file with no visual feedback until it buffers.

**Implementation:**

```typescript
// hooks/use-video-preload.ts
import { useEffect, useRef, useState } from 'react';

type LoadStage = 'poster' | 'metadata' | 'ready';

interface UseVideoPreloadOptions {
  src: string;
  poster: string;
  rootMargin?: string; // Start loading before visible (default: '200px')
  disabled?: boolean; // Skip for above-fold content
}

export function useVideoPreload({
  src,
  poster,
  rootMargin = '200px',
  disabled = false,
}: UseVideoPreloadOptions) {
  const ref = useRef<HTMLVideoElement>(null);
  const [stage, setStage] = useState<LoadStage>('poster');

  useEffect(() => {
    if (disabled || !ref.current) return;

    const video = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Stage 2: Load metadata (dimensions, duration) when near viewport
          video.preload = 'metadata';
          video.src = src;
          video.load();
          setStage('metadata');
          observer.unobserve(video);
        }
      },
      { rootMargin }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [src, rootMargin, disabled]);

  const promoteToReady = () => {
    // Stage 3: Allow full buffering on user intent (hover/click)
    if (ref.current && stage === 'metadata') {
      ref.current.preload = 'auto';
      setStage('ready');
    }
  };

  return { ref, stage, promoteToReady };
}
```

**Key decisions:**

- `rootMargin: '200px'` starts metadata loading 200px before the video scrolls into view, so dimensions and the first frame are available by the time the user sees it.
- Full video data only loads on hover intent (`promoteToReady`), preventing the site from downloading all 19 videos simultaneously.
- Hero video skips this pipeline (`disabled: true`) and loads eagerly with `autoplay muted`.

### Pattern 2: Animation Variants System

**What:** Centralized animation definitions using Motion variants instead of inline `initial`/`whileInView` props on every element.

**When to use:** All scroll-triggered reveals and choreographed sequences.

**Trade-offs:** Small upfront cost to define variants, but eliminates the current copy-paste animation code across every section component (currently repeated 20+ times).

**Implementation:**

```typescript
// config/animations.ts
import type { Variants, Transition } from 'motion/react';

// Base transition curves
export const transitions = {
  smooth: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } satisfies Transition,
  snappy: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } satisfies Transition,
  slow: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] } satisfies Transition,
} as const;

// Section-level reveal (parent container)
export const sectionReveal: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

// Child element fade-up (used inside staggered parent)
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.smooth,
  },
};

// Slide from left (About image)
export const slideFromLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.smooth,
  },
};

// Slide from right (About text)
export const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions.smooth,
  },
};

// Scale in (modal, play buttons)
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.snappy,
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.2 },
  },
};

// Hero-specific stagger (slower, more dramatic)
export const heroStagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.5,
    },
  },
};

export const heroChild: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.slow,
  },
};
```

**Usage in components (replaces inline animation props):**

```tsx
// sections/Portfolio.tsx — before (current)
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.8 }}
>

// sections/Portfolio.tsx — after (variant system)
<motion.div
  variants={sectionReveal}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true }}
>
  <motion.h2 variants={fadeUp}>Selected Work</motion.h2>
  <motion.p variants={fadeUp}>A curated collection...</motion.p>
</motion.div>
```

### Pattern 3: Shared Element Modal Transition

**What:** Use Motion's `layoutId` to create a visual connection between the portfolio grid thumbnail and the full-screen video modal, so the modal appears to expand from the clicked card.

**When to use:** Portfolio grid to video modal transition.

**Trade-offs:** Requires `AnimatePresence` wrapping the modal and stable `layoutId` keys. More visually impressive than the current instant-appear modal. Small added complexity but high cinematic impact.

**Implementation:**

```tsx
// video/VideoCard.tsx
export function VideoCard({ video }: { video: VideoProject }) {
  const { openModal } = useVideoModal();

  return (
    <motion.div
      layoutId={`video-${video.id}`}
      onClick={() => openModal(video)}
      className="aspect-video rounded-lg overflow-hidden cursor-pointer"
    >
      {/* Thumbnail + hover preview */}
    </motion.div>
  );
}

// video/VideoModal.tsx
export function VideoModal({ video, onClose }: Props) {
  return (
    <motion.div className="fixed inset-0 z-50 bg-cinematic-black/95">
      <motion.div layoutId={`video-${video.id}`} className="w-full max-w-6xl mx-auto">
        <VideoPlayer src={video.videoUrl} poster={video.posterUrl} />
      </motion.div>
    </motion.div>
  );
}

// sections/Portfolio.tsx
<AnimatePresence>
  {activeVideo && <VideoModal video={activeVideo} onClose={closeModal} />}
</AnimatePresence>;
```

### Pattern 4: Responsive Video Quality

**What:** Serve different video approaches on mobile vs desktop. On mobile, show poster images with a tap-to-play pattern instead of hover-to-preview (which does not exist on touch devices). On slow connections, skip autoplay previews entirely.

**When to use:** All portfolio video cards and the hero video.

**Trade-offs:** Requires the `use-media-query` hook and optional Network Information API check. Prevents the current problem where mobile users download video data for hover previews they can never trigger.

**Implementation:**

```typescript
// hooks/use-video-player.ts
import { useRef, useState, useCallback } from 'react';

interface UseVideoPlayerOptions {
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
}

export function useVideoPlayer(options: UseVideoPlayerOptions = {}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(options.muted ?? true);
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const play = useCallback(async () => {
    if (!ref.current) return;
    try {
      await ref.current.play();
      setIsPlaying(true);
    } catch {
      // Autoplay blocked — degrade gracefully, show play button
      setIsPlaying(false);
    }
  }, []);

  const pause = useCallback(() => {
    ref.current?.pause();
    setIsPlaying(false);
  }, []);

  const toggleMute = useCallback(() => {
    if (!ref.current) return;
    ref.current.muted = !ref.current.muted;
    setIsMuted(ref.current.muted);
  }, []);

  const seek = useCallback((fraction: number) => {
    if (!ref.current) return;
    ref.current.currentTime = fraction * ref.current.duration;
  }, []);

  const onTimeUpdate = useCallback(() => {
    if (!ref.current) return;
    setProgress(ref.current.currentTime / ref.current.duration);
  }, []);

  const onLoadedData = useCallback(() => setIsLoaded(true), []);

  return {
    ref,
    isPlaying,
    isMuted,
    progress,
    isLoaded,
    play,
    pause,
    toggleMute,
    seek,
    onTimeUpdate,
    onLoadedData,
  };
}
```

## Data Flow

### Page Load Flow

```
Browser requests index.html
    ↓
Vite bundle loads (JS + CSS)
    ↓
React mounts <App />
    ↓
Hero section renders immediately
    ├── Poster image displays instantly (LCP candidate)
    ├── Hero video begins loading (autoplay muted)
    └── Hero text animates in (staggered variants)
    ↓
Below-fold sections render with IntersectionObserver
    ├── Video cards: poster only (preload="none")
    ├── On viewport proximity (200px margin): load metadata
    └── On hover (desktop) / tap (mobile): begin playback
```

### Video Playback Flow

```
User hovers on VideoCard (desktop)
    ↓
useVideoPreload.promoteToReady() → preload="auto"
    ↓
Video buffers, begins muted autoplay as preview
    ↓
User clicks VideoCard
    ↓
useVideoModal.open(video)
    ↓
AnimatePresence mounts VideoModal
    ↓
layoutId transition animates card → modal
    ↓
VideoPlayer loads full video with controls
    ├── Play/Pause, Mute/Unmute, Progress seek, Fullscreen
    └── Keyboard: Space (play/pause), M (mute), F (fullscreen), Esc (close)
    ↓
User closes modal (X button, Esc, backdrop click)
    ↓
AnimatePresence exit animation → unmount
    ↓
body scroll lock released
```

### Contact Form Flow

```
User fills form fields
    ↓
Client-side validation (required fields, email format)
    ↓
fetch() POST to API Gateway (VITE_CONTACT_API_URL)
    ↓
API Gateway → Lambda handler
    ├── CORS validation
    ├── Input sanitization (strip HTML tags)
    ├── Field length enforcement
    └── SES SendEmailCommand
    ↓
Response → toast notification (success/error)
```

### State Management

```
Component-local state (no global store needed):

Navigation: scrollY position, active section, mobile menu open
Hero:       video loaded flag
Portfolio:  hovered card ID, active modal video
VideoCard:  preload stage (poster → metadata → ready)
VideoModal: video player state (playing, muted, progress)
Contact:    form data, submission state, validation errors
```

No global state management library is needed. This is a portfolio site with no shared application state. Each concern is self-contained. The video modal is the only cross-component communication, handled by a hook that manages a single piece of state (which video is active).

### Key Data Flows

1. **Video metadata:** `config/videos.ts` exports typed arrays consumed by Portfolio and Hero sections. CDN base URL is defined once. All video URLs derive from it.

2. **Animation variants:** `config/animations.ts` exports named variant objects. Section components import and apply them via `variants` prop. No runtime computation needed.

3. **Scroll position:** Navigation consumes `window.scrollY` via event listener to toggle its background. In the revamp, replace with `useScroll` from Motion for smoother scroll-linked opacity and active section tracking.

4. **Contact submission:** Form data flows from Contact component through `useContactForm` hook to the API client in `lib/api.ts`, which handles the fetch call and error transformation.

## Scaling Considerations

| Scale                    | Architecture Adjustments                                                                                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Current (portfolio site) | Static SPA is perfect. No server rendering needed. CloudFront CDN handles media delivery.                                                                                |
| 50+ videos               | Add category filtering/pagination to Portfolio. Consider virtual scrolling for the grid. Move video metadata to a JSON file fetched at runtime instead of bundled in JS. |
| Multiple pages           | Only if scope expands beyond single-page. Would add React Router, code-split by route. Currently out of scope.                                                           |

### Scaling Priorities

1. **First bottleneck: Initial page weight.** With 19 videos, the current approach of rendering all `<video>` elements in the DOM (even with `preload="none"`) creates 19 DOM nodes that the browser must manage. The IntersectionObserver-based lazy loading fixes this by only setting `src` attributes when elements approach the viewport.

2. **Second bottleneck: Simultaneous video downloads.** If a user scrolls quickly through the portfolio grid, multiple videos could start loading metadata simultaneously. The preload hook should track a loading queue and limit concurrent loads to 3-4 at most.

## Anti-Patterns

### Anti-Pattern 1: Loading All Videos Eagerly

**What people do:** Set all video `src` attributes on render, or use `preload="metadata"` for all 19+ videos.
**Why it's wrong:** Each video triggers a network request for metadata (first few hundred KB). On mobile, this wastes bandwidth on videos the user may never see. Compounds with slow 3G connections.
**Do this instead:** Only set `src` when the video approaches the viewport (IntersectionObserver with `rootMargin`). Use `preload="none"` as default.

### Anti-Pattern 2: Hover-to-Play on Mobile

**What people do:** Use `onMouseEnter` to trigger video playback (current implementation).
**Why it's wrong:** Mobile devices have no hover state. The `mouseenter` event fires on first tap (consuming the tap), then the user has to tap again to actually interact. Meanwhile the video is downloading for no reason.
**Do this instead:** Detect touch devices via `useMediaQuery('(hover: hover)')`. On touch devices, show a static poster with a visible play button. On desktop, use hover-to-preview.

### Anti-Pattern 3: Copy-Paste Animation Props

**What people do:** Write `initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}` on every element (current implementation).
**Why it's wrong:** Creates visual monotony (everything does the same fade-up), makes it hard to change animation timing globally, and bloats JSX.
**Do this instead:** Define variants in a config file. Use parent-child variant propagation with `staggerChildren` for choreographed reveals. Give different sections different animation characters (slide-from-left for About, scale-in for services, fade-up for portfolio).

### Anti-Pattern 4: Blocking Body Scroll with style.overflow

**What people do:** Set `document.body.style.overflow = 'hidden'` directly (current implementation in Portfolio.tsx).
**Why it's wrong:** Causes layout shift on desktop (scrollbar disappears, content reflows). Does not account for iOS Safari scroll lock quirks. Not cleaned up if component unmounts unexpectedly.
**Do this instead:** Use a dedicated `useScrollLock` hook or the `body-scroll-lock` package pattern. Add `padding-right` equal to scrollbar width when locking. Use `useEffect` cleanup to guarantee unlock on unmount.

### Anti-Pattern 5: Monolithic Section Components

**What people do:** Put grid rendering, hover state, modal state, video controls, and modal UI all in one 180-line component (current `Portfolio.tsx`).
**Why it's wrong:** Hard to redesign one aspect without touching everything. Impossible to test video playback logic independently. Re-renders the entire grid when modal state changes.
**Do this instead:** Extract `VideoCard`, `VideoModal`, and `VideoPlayer` as separate components. Put playback logic in hooks. The section component becomes a thin composition layer.

## Integration Points

### External Services

| Service              | Integration Pattern                       | Notes                                                                                                                       |
| -------------------- | ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| CloudFront Media CDN | Direct `<video src>` / `<img src>` URLs   | CDN base URL should move from hardcoded constant to `VITE_CDN_BASE_URL` env var. Currently `d2fc83sck42gx7.cloudfront.net`. |
| API Gateway + Lambda | `fetch()` POST from `useContactForm` hook | Endpoint URL from `VITE_CONTACT_API_URL` env var. Needs error boundary around fetch failures.                               |
| Google Analytics     | Script tag in `index.html`                | Currently blocked by CSP. Fix CSP headers in Amplify config before revamp.                                                  |
| Google Fonts         | `@import` or `<link>` in HTML/CSS         | Currently blocked by CSP. Consider self-hosting fonts to eliminate external dependency.                                     |

### Internal Boundaries

| Boundary                   | Communication         | Notes                                                                                                                              |
| -------------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Section ↔ Video system     | Props + hooks         | Sections import video components and pass config data. Video hooks manage all playback state internally.                           |
| Section ↔ Animation system | Imported variants     | Sections import variant objects from `config/animations.ts`. No runtime communication.                                             |
| Portfolio ↔ VideoModal     | Shared state via hook | `useVideoModal` provides `openModal(video)` and `activeVideo` state. Only Portfolio and VideoModal consume it.                     |
| Navigation ↔ Sections      | DOM `id` attributes   | Navigation scrolls to sections by `id`. IntersectionObserver in Navigation detects which section is active. No React state shared. |
| Contact ↔ API client       | Hook → lib function   | `useContactForm` calls `lib/api.ts` which wraps `fetch()`. API client handles serialization and error normalization.               |

## Build Order (Dependencies Between Components)

Phase ordering matters because components depend on each other:

```
1. Foundation (no dependencies)
   ├── config/animations.ts      — Variants system, used by everything
   ├── config/videos.ts          — Already exists, refine types
   ├── hooks/use-media-query.ts  — Already exists as use-mobile.ts
   ├── hooks/use-reduced-motion.ts
   └── components/layout/ErrorBoundary.tsx

2. Video System (depends on Foundation)
   ├── hooks/use-video-preload.ts   — IntersectionObserver loading
   ├── hooks/use-video-player.ts    — Playback controls
   ├── hooks/use-video-modal.ts     — Modal state + scroll lock
   ├── components/video/HeroVideo.tsx
   ├── components/video/VideoCard.tsx
   ├── components/video/VideoPlayer.tsx  — Extract from Reel.tsx
   └── components/video/VideoModal.tsx

3. Layout Components (depends on Foundation)
   ├── components/layout/Navigation.tsx  — Refactor with useScroll
   └── components/layout/SectionHeader.tsx

4. Section Redesign (depends on Video System + Layout)
   ├── sections/Hero.tsx          — Uses HeroVideo + animation variants
   ├── sections/Portfolio.tsx     — Uses VideoCard + VideoModal + variants
   ├── sections/About.tsx         — Uses parallax + animation variants
   ├── sections/Clients.tsx       — Uses stagger variants
   ├── sections/Contact.tsx       — Uses useContactForm + variants
   └── sections/Footer.tsx        — Uses animation variants

5. Polish & Performance
   ├── Scroll-linked parallax effects
   ├── prefers-reduced-motion fallbacks
   ├── Mobile-specific video behavior
   └── Core Web Vitals optimization (LCP, CLS, INP)
```

**Why this order:**

- Foundation has zero dependencies and everything else imports from it
- Video system is the site's core differentiator and most complex subsystem — build it before sections so sections can consume it
- Layout components are shared across sections — build before section redesign
- Section redesign can proceed one section at a time once the video system and layout pieces exist
- Polish comes last because it optimizes what is already working

## Sources

- web.dev: Lazy Loading Video — IntersectionObserver patterns, preload attribute strategies [HIGH confidence]
- web.dev: Video and Source Tags — Format ordering, preload strategies, poster images, mobile considerations [HIGH confidence]
- motion.dev: React Scroll Animations — `whileInView`, `useScroll`, `useTransform` APIs [HIGH confidence]
- motion.dev: React Animation — Variants, `staggerChildren`, orchestration patterns [HIGH confidence]
- motion.dev: AnimatePresence — Exit animations, `mode` prop, modal patterns [HIGH confidence]
- motion.dev: Layout Animations — `layoutId` for shared element transitions [HIGH confidence]
- MDN: Intersection Observer API — Constructor options, callback parameters, lazy loading patterns [HIGH confidence]
- Chrome Developers: Autoplay Policy — Muted autoplay rules, `play()` promise handling [HIGH confidence]
- web.dev: Adaptive Serving — Network Information API for connection-aware video quality [MEDIUM confidence — limited browser support]
- Current codebase analysis: `Portfolio.tsx`, `Hero.tsx`, `Reel.tsx`, `videos.ts`, `theme.css` [HIGH confidence]

---

_Architecture research for: Video-heavy cinematography portfolio SPA revamp_
_Researched: 2026-03-27_
