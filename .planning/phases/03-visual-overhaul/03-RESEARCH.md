# Phase 3: Visual Overhaul - Research

**Researched:** 2026-03-30
**Domain:** Frontend animation, scroll interactions, touch UX, CSS marquee, keyboard accessibility
**Confidence:** HIGH

## Summary

Phase 3 transforms the stealinglight.hk portfolio from functional sections with basic animations into a cohesive cinematic experience. The core technical domain is the Motion library (framer-motion successor) version 12.29.2 already installed in the project, which provides every animation primitive needed: layout animations for filter transitions, AnimatePresence for mount/unmount choreography, useScroll for progress indicators, variants with staggerChildren for orchestrated reveals, and useReducedMotion for accessibility.

The phase breaks into distinct technical areas: (1) Hero cinematic reveal refinement with custom cubic-bezier easing and blur-to-sharp filter animation, (2) branded full-page preloader with video load detection, (3) category filter with Motion layout animations for smooth grid reflow, (4) touch device detection via CSS `@media (hover: hover)` with a two-tap preview flow, (5) video modal keyboard navigation with focus trapping, (6) CSS-only infinite-scroll marquee for client logos, (7) scroll progress indicator using Motion's useScroll + useSpring, and (8) typography/spacing consistency pass.

**Primary recommendation:** Use Motion's existing API surface exclusively -- no additional animation libraries needed. The CSS-only approach for the marquee is preferred over Motion-based animation for GPU efficiency. Touch detection should use the CSS media query approach (not JS-based detection) as decided in D-10.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Refined stagger approach -- keep current Hero structure but upgrade easing curves to `cubic-bezier(0.16, 1, 0.3, 1)` (smooth deceleration), add subtle blur-to-sharp effect on text elements, and tighten stagger timing for a choreographed reveal sequence.
- **D-02:** Stagger timeline: name at 0.3s (tracking + fade), headline at 0.6s (fade-up + blur), subtitle at 0.9s (fade-up + blur), tagline at 1.2s (fade-in), CTAs at 1.6s (fade-up), scroll indicator at 2.0s (fade-in). Total sequence: ~2s.
- **D-03:** Pill buttons -- horizontal row of pill-shaped buttons above the video grid. "All" button plus 6 category pills (Commercial, Documentary, Short Film, Fashion, Event, Personal Reel). Active pill gets amber fill, inactive pills are outlined/muted. On mobile: horizontally scrollable strip (no wrapping).
- **D-04:** Grid transition uses Motion layout animation -- filtered-out cards fade out + scale down (0.2s), remaining cards reflow smoothly via layout animation to fill gaps, settling cards fade in + scale up (0.3s). Total transition ~0.4s.
- **D-05:** Default view shows "All" (all videos visible). Categories derived from `videoProjects` in `videos.ts`.
- **D-06:** Full-page preloader covering entire viewport including navigation. STEALINGLIGHT text centered on cinematic black background with subtle amber opacity pulse animation (0.5 to 1).
- **D-07:** Amber progress bar below the logo text showing video load progress.
- **D-08:** Minimum display time of 0.8s to avoid flash on fast connections. Dismisses when hero video `canPlay` event fires (whichever is later). Fades out to reveal hero content and navigation.
- **D-09:** Two-tap flow on touch devices -- first tap plays video preview in-place (same behavior as desktop hover) with a visible "tap to watch" overlay. Second tap opens the full video modal.
- **D-10:** Detection via CSS `@media (hover: hover)` media query. Hover-capable devices get existing mouseenter/mouseleave behavior. Touch-only devices get the tap-to-preview flow.

### Claude's Discretion

- Scroll animation coordination (VISL-02) -- specific parallax depths, stagger timing, and animation types for non-hero sections (About, Services, Contact, Footer). Refine existing `whileInView` patterns.
- Client logo marquee (VISL-03) -- implementation approach for infinite-scroll animation (CSS vs Motion), direction, speed, pause-on-hover behavior, logo duplication for seamless loop.
- Video modal keyboard navigation (VIDO-04) -- handler implementation for Escape to close, left/right arrows to navigate between videos, spacebar to toggle play/pause. Focus trap management.
- Scroll progress indicator (QUAL-01) -- thin amber bar (likely fixed at top of viewport), width tracks scroll position as percentage of page height.
- Typography and spacing consistency pass (VISL-04) -- audit and fix any inconsistencies across sections.

### Deferred Ideas (OUT OF SCOPE)

None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>

## Phase Requirements

| ID      | Description                                                                                                | Research Support                                                                                                 |
| ------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| VISL-01 | Hero section has cinematic text reveal animations with refined easing (0.6-1.2s timing, not snappy UI)     | Motion variants + staggerChildren + custom cubic-bezier easing + filter blur animation (see Hero Reveal Pattern) |
| VISL-02 | All sections have coordinated scroll-triggered animations with staggered reveals and subtle parallax depth | Motion whileInView + variants + delayChildren/staggerChildren orchestration (see Scroll Animation Coordination)  |
| VISL-03 | Client logo section uses animated infinite-scroll marquee instead of static grid                           | CSS-only @keyframes marquee with logo duplication and pause-on-hover (see Marquee Pattern)                       |
| VISL-04 | Typography and spacing are consistent across all sections with self-hosted fonts via Fontsource            | Typography audit of all section components; fonts already self-hosted in Phase 2                                 |
| VIDO-01 | Video grid works on touch devices with tap-to-preview fallback (detects hover capability via media query)  | CSS @media (hover: hover/none) + React state machine for two-tap flow (see Touch Interaction Pattern)            |
| VIDO-02 | User can filter portfolio videos by category                                                               | Motion AnimatePresence mode="popLayout" + layout prop for grid reflow (see Category Filter Pattern)              |
| VIDO-03 | Branded preloader displays while hero video buffers on initial page load                                   | React state + video canPlay event + minimum display timer (see Preloader Pattern)                                |
| VIDO-04 | Video modal supports keyboard navigation (Escape to close, arrow keys between videos, spacebar play/pause) | useEffect keydown handler + focus management + video element API (see Modal Keyboard Nav Pattern)                |
| QUAL-01 | Scroll progress indicator shows position within single-page site (thin accent-color bar)                   | Motion useScroll + useSpring + fixed-position bar (see Scroll Progress Pattern)                                  |

</phase_requirements>

## Standard Stack

### Core

| Library      | Version             | Purpose                                                         | Why Standard                                                  |
| ------------ | ------------------- | --------------------------------------------------------------- | ------------------------------------------------------------- |
| motion       | 12.29.2 (installed) | All animations: layout, exit, scroll, variants, stagger         | Already in project, provides every animation primitive needed |
| react        | 19.2.4 (installed)  | UI framework                                                    | Already in project                                            |
| tailwind-css | 4.1.18 (installed)  | Utility-first styling                                           | Already in project                                            |
| lucide-react | 0.563.0 (installed) | Icons (Play, X, ChevronDown, Filter, ChevronLeft, ChevronRight) | Already in project                                            |

### Supporting

| Library               | Version                   | Purpose                            | When to Use                                                                   |
| --------------------- | ------------------------- | ---------------------------------- | ----------------------------------------------------------------------------- |
| tw-animate-css        | 1.4.0 (installed)         | Tailwind animation utilities       | Already imported in tailwind.css; provides pulse and other utility animations |
| clsx + tailwind-merge | 2.1.1 + 3.4.0 (installed) | Conditional class merging via cn() | Already available at src/lib/utils.ts                                         |

### Alternatives Considered

| Instead of        | Could Use                 | Tradeoff                                                                                                           |
| ----------------- | ------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| CSS marquee       | Motion-based marquee      | CSS is GPU-accelerated, simpler, no JS overhead; Motion adds complexity for zero benefit on infinite linear scroll |
| Custom focus trap | focus-trap-react library  | Custom is simpler for a single modal with known focusable elements; library adds dependency for minimal gain       |
| matchMedia JS     | CSS @media (hover: hover) | CSS approach is declarative and avoids JS hydration mismatch; D-10 locks this decision                             |

**Installation:**
No new packages needed. All required libraries are already installed.

## Architecture Patterns

### Recommended Component Structure

```
src/
  app/
    components/
      Preloader.tsx          # NEW - full-page branded preloader
      ScrollProgress.tsx     # NEW - fixed scroll progress bar
      Hero.tsx               # MODIFY - refined stagger + blur easing
      Portfolio.tsx           # MODIFY - add filter pills, touch support, keyboard nav
      Clients.tsx            # MODIFY - replace grid with CSS marquee
      Navigation.tsx         # MODIFY - z-index aware of preloader
      About.tsx              # MODIFY - refined scroll animations
      Services.tsx           # MODIFY - refined scroll animations
      Contact.tsx            # MODIFY - refined scroll animations
      Footer.tsx             # MODIFY - refined scroll animations
    App.tsx                  # MODIFY - integrate Preloader + ScrollProgress
  hooks/
    useInView.ts             # EXISTING - no changes needed
  styles/
    theme.css                # POSSIBLY MODIFY - add marquee keyframes
```

### Pattern 1: Hero Cinematic Reveal with Variants and Stagger

**What:** Orchestrated parent-child animation using Motion variants with staggerChildren
**When to use:** D-01 and D-02 hero reveal sequence
**Example:**

```typescript
// Source: Motion docs - Variants with orchestration
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.3,
      delayChildren: 0.3,
    },
  },
};

const nameVariants = {
  hidden: { opacity: 0, letterSpacing: '0.5em' },
  visible: {
    opacity: 1,
    letterSpacing: '0.3em',
    transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] },
  },
};

const fadeUpBlurVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};
```

### Pattern 2: Category Filter with AnimatePresence + Layout

**What:** Filtered grid with smooth reflow using layout animations and exit transitions
**When to use:** D-03 through D-05 video category filtering
**Example:**

```typescript
// Source: Motion docs - AnimatePresence mode="popLayout" + layout
import { AnimatePresence, motion } from 'motion/react';

const [activeCategory, setActiveCategory] = useState('All');

const filteredVideos = activeCategory === 'All'
  ? allVideos
  : allVideos.filter(v => v.category === activeCategory);

<AnimatePresence mode="popLayout">
  {filteredVideos.map((video) => (
    <motion.div
      key={video.id}
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{
        layout: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
      }}
    >
      <LazyVideo project={video} ... />
    </motion.div>
  ))}
</AnimatePresence>
```

### Pattern 3: CSS-Only Marquee for Client Logos

**What:** Infinite-scroll animation using CSS @keyframes with duplicated content
**When to use:** VISL-03 client logo section
**Example:**

```typescript
// Source: ryanmulligan.dev CSS marquee pattern
const allClients = [...clients, ...clients]; // duplicate for seamless loop

<div className="overflow-hidden">
  <div
    className="flex gap-12 animate-marquee hover:[animation-play-state:paused]"
    aria-label="Client logos"
  >
    {allClients.map((client, i) => (
      <img
        key={`${client.name}-${i}`}
        src={client.logo}
        alt={client.name}
        className="h-8 md:h-10 w-auto opacity-30 hover:opacity-60 transition-opacity"
        style={{ filter: 'brightness(0) invert(1)' }}
        aria-hidden={i >= clients.length} // hide duplicates from screen readers
      />
    ))}
  </div>
</div>

// In theme.css or tailwind config:
@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(calc(-50% - 1.5rem)); }
}
```

### Pattern 4: Scroll Progress Indicator

**What:** Fixed thin bar at top of viewport tracking scroll position
**When to use:** QUAL-01 scroll progress indicator
**Example:**

```typescript
// Source: Motion docs - useScroll + useSpring
import { motion, useScroll, useSpring } from 'motion/react';

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-0.5 bg-cinematic-amber origin-left z-[60]"
      style={{ scaleX }}
    />
  );
}
```

### Pattern 5: Touch Detection + Two-Tap Flow

**What:** CSS media query for hover detection combined with React state for two-tap interaction
**When to use:** D-09, D-10 touch device video preview
**Example:**

```typescript
// Source: MDN @media (hover) + project pattern
// CSS approach: use Tailwind's hover: modifier which respects @media (hover: hover)
// JS approach for tap state management:

const [tappedId, setTappedId] = useState<number | null>(null);

// In LazyVideo, detect touch via CSS class or matchMedia for runtime behavior:
// First tap: setTappedId(id) -> plays preview, shows "tap to watch" overlay
// Second tap (tappedId === id): openVideo(project)
// Tap elsewhere: setTappedId(null)

// The "tap to watch" overlay only renders for touch devices:
// Use @media (hover: none) to show the overlay text
```

### Pattern 6: Preloader with Video Load Detection

**What:** Full-page overlay that dismisses when hero video is ready
**When to use:** D-06 through D-08 branded preloader
**Example:**

```typescript
// Preloader.tsx
function Preloader({ onDismiss }: { onDismiss: () => void }) {
  // Amber pulse animation on the STEALINGLIGHT text
  // Progress bar below text
  // Fades out when parent signals ready
}

// App.tsx integration:
const [isLoading, setIsLoading] = useState(true);
const [videoReady, setVideoReady] = useState(false);
const [minTimePassed, setMinTimePassed] = useState(false);

useEffect(() => {
  const timer = setTimeout(() => setMinTimePassed(true), 800);
  return () => clearTimeout(timer);
}, []);

useEffect(() => {
  if (videoReady && minTimePassed) setIsLoading(false);
}, [videoReady, minTimePassed]);

// Hero receives onVideoReady callback -> fires on canPlay event
```

### Pattern 7: Modal Keyboard Navigation

**What:** useEffect keydown handler for Escape, arrow keys, and spacebar in video modal
**When to use:** VIDO-04 keyboard navigation
**Example:**

```typescript
// Source: WAI-ARIA dialog pattern
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
        e.preventDefault(); // prevent page scroll
        togglePlayPause();
        break;
    }
  };

  document.addEventListener('keydown', handleKeyDown);
  // Focus the modal container for screen readers
  modalRef.current?.focus();

  return () => document.removeEventListener('keydown', handleKeyDown);
}, [activeVideo]);
```

### Anti-Patterns to Avoid

- **Animating width/height directly:** Use Motion's `layout` prop which animates via transforms for GPU performance
- **Using array index as key in filtered lists:** Causes wrong elements to animate. Use stable `video.id` as key.
- **Hover-dependent content without fallback:** Touch devices cannot hover; D-10 requires explicit `@media (hover: none)` handling
- **Playing all videos on mount:** The existing `useInView` + `preload="none"` pattern must be preserved for performance
- **Scroll hijacking or parallax scrolljacking:** Explicitly out of scope per REQUIREMENTS.md

## Don't Hand-Roll

| Problem                  | Don't Build                                            | Use Instead                                               | Why                                                                          |
| ------------------------ | ------------------------------------------------------ | --------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Layout reflow animation  | Manual position calculation with getBoundingClientRect | Motion `layout` prop + AnimatePresence `mode="popLayout"` | Motion handles FLIP technique internally, cross-browser, with spring physics |
| Scroll progress tracking | Manual scroll event listener with percentage calc      | Motion `useScroll()` + `useSpring()`                      | Hardware-accelerated via ScrollTimeline API with JS fallback                 |
| Infinite marquee         | requestAnimationFrame loop                             | CSS `@keyframes` with `translateX(-50%)`                  | GPU-composited, zero JS, pause-on-hover via `animation-play-state`           |
| Reduced motion detection | Manual `matchMedia('prefers-reduced-motion')`          | Motion `useReducedMotion()`                               | Reactive hook that re-renders on OS setting change                           |
| Stagger orchestration    | Manual delay calculation per child                     | Motion variants with `staggerChildren`                    | Declarative, handles dynamic child counts, propagates through tree           |

**Key insight:** Motion 12.x provides every animation primitive needed for this phase. The only CSS-native pattern is the marquee, where CSS outperforms JS for infinite linear transforms.

## Common Pitfalls

### Pitfall 1: AnimatePresence Key Stability

**What goes wrong:** Using array indices as keys in filtered lists causes Motion to animate the wrong elements in and out
**Why it happens:** When filtering removes item at index 2, the item previously at index 3 now gets key "2" and Motion thinks item 2 is still present
**How to avoid:** Always use `video.id` as the key prop, never the map index
**Warning signs:** Videos "morph" into wrong content during filter transitions instead of smoothly fading

### Pitfall 2: Layout Animation Parent Positioning

**What goes wrong:** Layout animations with `mode="popLayout"` cause visual glitches because exiting elements use absolute positioning
**Why it happens:** AnimatePresence popLayout removes exiting items from document flow; they need a positioned parent
**How to avoid:** Ensure the grid container has `position: relative` (or any non-static positioning). In Tailwind: `className="relative"`
**Warning signs:** Exiting cards jump to wrong positions or overlap during filter transitions

### Pitfall 3: Preloader Blocking Interaction

**What goes wrong:** Preloader stays visible indefinitely if the video `canPlay` event never fires (e.g., slow connection, video blocked by CSP, or browser autoplay policy)
**Why it happens:** Only relying on `canPlay` without a fallback timeout
**How to avoid:** Implement a maximum display timeout (e.g., 3-4 seconds) as a safety valve. If `canPlay` hasn't fired, dismiss preloader anyway and let the video fade in later.
**Warning signs:** White/black screen on first visit with no way to interact

### Pitfall 4: Filter Blur on Text Jank

**What goes wrong:** Animating CSS `filter: blur()` on text elements causes visible text jank or rendering artifacts
**Why it happens:** Blur is paint-heavy; some browsers render intermediate blur states poorly on text
**How to avoid:** Apply `will-change: filter` on elements that will blur-animate, and keep blur values small (4-8px max). Test on Safari specifically. Use Motion's `filter` animation target which handles vendor prefixing.
**Warning signs:** Blurry text that appears crispy/pixelated at intermediate states, especially on Safari

### Pitfall 5: Touch Two-Tap and Scroll Conflict

**What goes wrong:** First tap on a video card registers as a preview trigger when the user was actually trying to scroll
**Why it happens:** On mobile, tap events fire even during scroll gestures if the finger doesn't move enough
**How to avoid:** Use `onPointerDown`/`onPointerUp` with a movement threshold, or use `onClick` which browsers already debounce against scroll. Add a brief delay (~100ms) or check if the card's position changed between pointer events.
**Warning signs:** Videos start playing unexpectedly while scrolling through the portfolio on mobile

### Pitfall 6: Marquee Animation Duplication Math

**What goes wrong:** Visible "jump" or "gap" when the marquee resets to start position
**Why it happens:** The translateX distance doesn't exactly match the width of the first set of logos plus the gap
**How to avoid:** Use `translateX(calc(-50% - var(--gap)/2))` where the content is exactly doubled. The 50% accounts for half the total width (the first copy). Ensure `flex-shrink: 0` on all items.
**Warning signs:** Visible stutter or blank space at the loop point of the marquee

### Pitfall 7: Spacebar in Modal Scrolls Page

**What goes wrong:** Pressing spacebar to play/pause video also scrolls the background page
**Why it happens:** Default browser behavior for spacebar is page scroll; if `document.body.style.overflow` isn't set to 'hidden' or the event isn't prevented
**How to avoid:** Call `e.preventDefault()` in the keydown handler for spacebar. The existing modal already sets `document.body.style.overflow = 'hidden'` which helps but is insufficient for spacebar specifically.
**Warning signs:** Page jumps behind the modal overlay when pressing spacebar

### Pitfall 8: Category Mismatch Between Data and UI

**What goes wrong:** Filter shows 6 categories but data has 7 (includes "Company Reel")
**Why it happens:** The featured video (id 1, "BLNK Media Reel") has category "Company Reel" which is not in D-03's filter list. The featured video displays separately above the grid.
**How to avoid:** The featured video is already excluded from `gridVideos` via the filter `v => !v.featured`. The 6 categories in D-03 correctly cover the 18 non-featured videos. Verify this by checking that `gridVideos` contains no "Company Reel" entries.
**Warning signs:** "Company Reel" category pill with only 0 results, or missing video from grid

## Code Examples

### Hero Reveal with D-02 Timeline (verified pattern)

```typescript
// Source: Motion docs variants + project D-01/D-02 decisions
import { motion, type Variants } from 'motion/react';

const EASE_CINEMATIC: [number, number, number, number] = [0.16, 1, 0.3, 1];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.3,
    },
  },
};

const trackingFade: Variants = {
  hidden: { opacity: 0, letterSpacing: '0.5em' },
  visible: {
    opacity: 1,
    letterSpacing: '0.3em',
    transition: { duration: 1.5, ease: EASE_CINEMATIC },
  },
};

const fadeUpBlur: Variants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.8, ease: EASE_CINEMATIC },
  },
};

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1, ease: EASE_CINEMATIC },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE_CINEMATIC },
  },
};

// Usage in Hero component:
<motion.div variants={containerVariants} initial="hidden" animate="visible">
  <motion.p variants={trackingFade}>CHRIS MCMILLON</motion.p>     {/* 0.3s */}
  <motion.h1 variants={fadeUpBlur}>Cinematographer</motion.h1>      {/* 0.6s */}
  <motion.p variants={fadeUpBlur}>Aerial photographer...</motion.p> {/* 0.9s */}
  <motion.p variants={fadeIn}>Tagline text</motion.p>               {/* 1.2s */}
  <motion.div variants={fadeUp}>CTAs</motion.div>                   {/* 1.6s -- needs custom delay offset */}
  {/* Scroll indicator at 2.0s -- separate from stagger, use explicit delay */}
</motion.div>
```

**Note on D-02 timing:** The stagger timeline is not perfectly uniform (0.3, 0.6, 0.9, 1.2, 1.6, 2.0). The gap between tagline (1.2s) and CTAs (1.6s) is 0.4s, and between CTAs (1.6s) and scroll indicator (2.0s) is also 0.4s. This requires either: (a) using `custom` prop with dynamic variants for per-element delays instead of `staggerChildren`, or (b) using `staggerChildren: 0.3` for the first 4 elements and explicit `delay` overrides on the CTA and scroll indicator variants.

### Video Categories Extraction

```typescript
// Derive categories from videoProjects at module level
const CATEGORIES = ['All', ...new Set(gridVideos.map((v) => v.category))] as const;
// Result: ['All', 'Documentary', 'Commercial', 'Short Film', 'Event', 'Fashion', 'Personal Reel']
```

### Preloader with Dual Condition Dismissal

```typescript
// Source: Standard React pattern for "wait for both conditions"
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const videoReadyRef = useRef(false);
  const minTimeRef = useRef(false);

  const checkDismiss = useCallback(() => {
    if (videoReadyRef.current && minTimeRef.current) {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      minTimeRef.current = true;
      checkDismiss();
    }, 800); // D-08: minimum 0.8s
    return () => clearTimeout(timer);
  }, [checkDismiss]);

  const handleVideoReady = useCallback(() => {
    videoReadyRef.current = true;
    checkDismiss();
  }, [checkDismiss]);

  // Safety timeout to prevent infinite preloader
  useEffect(() => {
    const safetyTimer = setTimeout(() => setIsLoading(false), 4000);
    return () => clearTimeout(safetyTimer);
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && <Preloader key="preloader" />}
      </AnimatePresence>
      <Hero onVideoReady={handleVideoReady} ... />
    </>
  );
}
```

### Reduced Motion Support

```typescript
// Source: Motion docs useReducedMotion
import { useReducedMotion } from 'motion/react';

// In any component with potentially disorienting animation:
const shouldReduceMotion = useReducedMotion();

// Replace motion transitions with instant or opacity-only:
const fadeUpBlur: Variants = {
  hidden: {
    opacity: 0,
    y: shouldReduceMotion ? 0 : 30,
    filter: shouldReduceMotion ? 'none' : 'blur(8px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: shouldReduceMotion ? 0.01 : 0.8 },
  },
};
```

## Existing Code Inventory

### Components That Need Modification

| File                         | Current State                                | Changes Required                                                                                                                   |
| ---------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `Hero.tsx` (140 lines)       | Basic motion animate with inline transitions | Refactor to variants, add custom easing D-01, stagger timeline D-02, blur filter, accept onVideoReady callback                     |
| `Portfolio.tsx` (227 lines)  | Grid with hover-to-play, basic modal         | Add filter pills D-03/D-04/D-05, AnimatePresence for grid, touch detection D-09/D-10, keyboard nav VIDO-04, "tap to watch" overlay |
| `Clients.tsx` (55 lines)     | Static flex-wrap grid of 7 logos             | Replace with CSS marquee, expand to all 15 available logos, add duplication + aria-hidden                                          |
| `App.tsx` (50 lines)         | Simple section composition                   | Add Preloader + ScrollProgress, manage loading state, pass onVideoReady to Hero                                                    |
| `Navigation.tsx` (100 lines) | Fixed z-50 nav                               | Needs z-index coordination with preloader (preloader at z-[70], nav stays z-50)                                                    |
| `About.tsx` (102 lines)      | Basic whileInView fade-left/right            | Refine stagger timing, add subtle depth variations                                                                                 |
| `Services.tsx` (72 lines)    | Basic whileInView fade-up with stagger       | Refine easing to cinematic curve, tighten timing                                                                                   |
| `Contact.tsx` (222 lines)    | Basic whileInView fade-up                    | Refine easing and stagger                                                                                                          |
| `Footer.tsx` (102 lines)     | No animations                                | Add subtle entrance animation                                                                                                      |

### New Components

| File                 | Purpose                                        |
| -------------------- | ---------------------------------------------- |
| `Preloader.tsx`      | Full-page branded preloader (D-06, D-07, D-08) |
| `ScrollProgress.tsx` | Fixed scroll progress bar (QUAL-01)            |

### Available Client Logos (15 total, 7 currently used)

Currently used: Tencent, Intel, Lenovo, Burton, Toyota, Volkswagen, Audi
Additional available: Aperture, Calvin Klein, Coach, Converse, DJI, Netflix, Puma, Vogue

**Recommendation:** Expand the marquee to use all 15 logos. More logos create a more impressive visual effect and make the marquee seamless loop more convincing.

### Video Data Structure

- 19 total projects in `videoProjects`
- 1 featured (id 1, "Company Reel") shown separately above grid
- 18 in `gridVideos` spanning 6 categories
- Category distribution: Commercial (6), Short Film (4), Documentary (2), Event (2), Fashion (2), Personal Reel (2)
- All videos have `id`, `title`, `category`, `description`, `duration`, `videoUrl`, `posterUrl`
- Categories are string literals, not an enum -- filter implementation should derive unique categories from data

## State of the Art

| Old Approach                                | Current Approach                            | When Changed                | Impact                                                         |
| ------------------------------------------- | ------------------------------------------- | --------------------------- | -------------------------------------------------------------- |
| framer-motion package                       | motion package (import from 'motion/react') | Motion v11+ (2024)          | Already using correct import path in this project              |
| `staggerChildren` as number                 | `stagger()` function for more control       | Motion v11                  | Both approaches work; stagger() allows direction/delay options |
| JS-based touch detection (ontouchstart)     | CSS `@media (hover: hover/none)`            | Widely available since 2018 | More reliable, no hydration issues, declarative                |
| Manual FLIP animations                      | Motion `layout` prop                        | Built into Motion           | Handles all transform-based reflow animations automatically    |
| JS IntersectionObserver for scroll progress | Motion `useScroll()` with ScrollTimeline    | Motion v11+                 | Hardware-accelerated where browser supports ScrollTimeline API |

**Deprecated/outdated:**

- `framer-motion` package name: Renamed to `motion`. This project already uses `motion/react` imports.
- `AnimatePresence exitBeforeEnter`: Replaced by `mode="wait"` in newer versions.

## Open Questions

1. **CTA timing gap in D-02 stagger**
   - What we know: D-02 specifies non-uniform delays (0.3s intervals for first 4 elements, then 0.4s gaps for CTAs and scroll indicator)
   - What's unclear: Whether to use `staggerChildren` (uniform spacing) and override the last two, or use fully manual delays via `custom` prop
   - Recommendation: Use explicit per-element delay values via the `custom` prop pattern rather than `staggerChildren`, since the timing is intentionally non-uniform. This gives exact control over D-02's choreographed sequence.

2. **Number of client logos in marquee**
   - What we know: 7 currently in Clients.tsx, 15 available in public/logos/
   - What's unclear: Whether owner wants all 15 or a curated subset
   - Recommendation: Use all 15 for the marquee. More logos = smoother infinite scroll illusion. If any are not actual clients, they can be removed. This is a Claude's Discretion area.

3. **Preloader progress bar accuracy**
   - What we know: D-07 asks for a progress bar showing video load progress
   - What's unclear: Browser video preload provides limited progress events. The `progress` event gives buffered ranges but not a clean 0-100% for streaming video.
   - Recommendation: Use a synthetic progress animation (smooth fill over 0.8s minimum time) rather than actual video download progress. The preloader is a branding moment, not a technical loading indicator. If the video `canPlay` fires early, snap the bar to 100%.

## Project Constraints (from CLAUDE.md)

- **Tech stack locked:** React 19 + Vite 7 + Tailwind CSS 4 + TypeScript -- no new frameworks
- **Component naming:** PascalCase for files, named exports, function declarations (not arrow functions)
- **Section pattern:** `<section id="..." className="py-24 md:py-32">` with `max-w-7xl mx-auto` container
- **Animation library:** `motion` (framer-motion successor) already in use -- continue using `motion/react` imports
- **State management:** Local `useState` only, no global state
- **Error handling:** SectionErrorBoundary wraps all sections in App.tsx
- **CSS conventions:** Use `cinematic-*` prefix colors, `cn()` for class merging, mobile-first breakpoints
- **Import path:** `@/*` alias maps to `./src/*` but most imports use relative paths
- **ESLint:** Flat config with `ESLINT_USE_FLAT_CONFIG=false` flag -- run lint before commit
- **Prettier:** Semicolons, single quotes, 2-space indent, 100 char width
- **Git commits:** Conventional commits, lowercase subject, max 72 chars
- **No scroll hijacking:** Explicitly out of scope per REQUIREMENTS.md
- **No video autoplay in grid:** Out of scope per REQUIREMENTS.md (hover/tap to preview only)

## Sources

### Primary (HIGH confidence)

- Motion official docs (motion.dev/docs) - Layout animations, AnimatePresence, useScroll, useSpring, useReducedMotion, variants, transitions
- MDN Web Docs - CSS @media (hover) feature, keyboard navigation patterns
- Project source code - All component files, videos.ts, theme.css, package.json

### Secondary (MEDIUM confidence)

- ryanmulligan.dev/blog/css-marquee - CSS-only marquee pattern (well-established technique, multiple sources confirm)
- WAI-ARIA Authoring Practices - Modal dialog keyboard navigation patterns (referenced by MDN)

### Tertiary (LOW confidence)

- None -- all patterns are well-established and verified against official documentation

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - All libraries already installed and in use; no new dependencies needed
- Architecture: HIGH - Patterns directly from Motion official docs, verified against current project structure
- Pitfalls: HIGH - Based on practical experience with Motion layout animations, touch interactions, and CSS animations; cross-verified with documentation warnings
- Code examples: HIGH - Derived from official docs + adapted to project's existing patterns and CONTEXT.md decisions

**Research date:** 2026-03-30
**Valid until:** 2026-04-30 (stable -- Motion 12.x API is mature, no breaking changes expected)
