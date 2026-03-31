# Phase 3: Visual Overhaul - Context

**Gathered:** 2026-03-30
**Status:** Ready for planning

<domain>
## Phase Boundary

Deliver the cinematic visual experience section by section: hero text reveal with refined animations, video category filtering with animated grid, branded full-page preloader, touch-friendly video interactions, keyboard navigation in modal, client logo marquee, coordinated scroll animations, scroll progress indicator, and typography/spacing consistency. This phase consumes the lean codebase and video infrastructure built in Phase 2.

</domain>

<decisions>
## Implementation Decisions

### Hero Cinematic Reveal

- **D-01:** Refined stagger approach — keep current Hero structure but upgrade easing curves to `cubic-bezier(0.16, 1, 0.3, 1)` (smooth deceleration), add subtle blur-to-sharp effect on text elements, and tighten stagger timing for a choreographed reveal sequence.
- **D-02:** Stagger timeline: name at 0.3s (tracking + fade), headline at 0.6s (fade-up + blur), subtitle at 0.9s (fade-up + blur), tagline at 1.2s (fade-in), CTAs at 1.6s (fade-up), scroll indicator at 2.0s (fade-in). Total sequence: ~2s.

### Category Filter

- **D-03:** Pill buttons — horizontal row of pill-shaped buttons above the video grid. "All" button plus 6 category pills (Commercial, Documentary, Short Film, Fashion, Event, Personal Reel). Active pill gets amber fill, inactive pills are outlined/muted. On mobile: horizontally scrollable strip (no wrapping).
- **D-04:** Grid transition uses Motion layout animation — filtered-out cards fade out + scale down (0.2s), remaining cards reflow smoothly via layout animation to fill gaps, settling cards fade in + scale up (0.3s). Total transition ~0.4s.
- **D-05:** Default view shows "All" (all videos visible). Categories derived from `videoProjects` in `videos.ts`.

### Branded Preloader

- **D-06:** Full-page preloader covering entire viewport including navigation. STEALINGLIGHT text centered on cinematic black background with subtle amber opacity pulse animation (0.5 to 1).
- **D-07:** Amber progress bar below the logo text showing video load progress.
- **D-08:** Minimum display time of 0.8s to avoid flash on fast connections. Dismisses when hero video `canPlay` event fires (whichever is later). Fades out to reveal hero content and navigation.

### Touch Interaction

- **D-09:** Two-tap flow on touch devices — first tap plays video preview in-place (same behavior as desktop hover) with a visible "tap to watch" overlay. Second tap opens the full video modal.
- **D-10:** Detection via CSS `@media (hover: hover)` media query. Hover-capable devices get existing mouseenter/mouseleave behavior. Touch-only devices get the tap-to-preview flow.

### Claude's Discretion

- Scroll animation coordination (VISL-02) — specific parallax depths, stagger timing, and animation types for non-hero sections (About, Services, Contact, Footer). Refine existing `whileInView` patterns.
- Client logo marquee (VISL-03) — implementation approach for infinite-scroll animation (CSS vs Motion), direction, speed, pause-on-hover behavior, logo duplication for seamless loop.
- Video modal keyboard navigation (VIDO-04) — handler implementation for Escape to close, left/right arrows to navigate between videos, spacebar to toggle play/pause. Focus trap management.
- Scroll progress indicator (QUAL-01) — thin amber bar (likely fixed at top of viewport), width tracks scroll position as percentage of page height.
- Typography and spacing consistency pass (VISL-04) — audit and fix any inconsistencies across sections. Fonts are already self-hosted (Phase 2).

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Requirements

- `.planning/REQUIREMENTS.md` — VISL-01 through VISL-04, VIDO-01 through VIDO-04, QUAL-01
- `.planning/ROADMAP.md` — Phase 3 success criteria (5 criteria)

### Hero Section

- `src/app/components/Hero.tsx` — Current hero animations to upgrade (motion stagger, easing, blur effect)
- `src/app/config/videos.ts` — Hero video source (`heroVideo.src`, `heroVideo.poster`)

### Portfolio Section

- `src/app/components/Portfolio.tsx` — Video grid + LazyVideo component + modal (add filtering, touch, keyboard nav)
- `src/app/config/videos.ts` — Video metadata with categories (7 categories across 19 projects)
- `src/hooks/useInView.ts` — Existing IntersectionObserver hook used by LazyVideo

### Client Section

- `src/app/components/Clients.tsx` — Static logo flex-wrap grid to convert to infinite-scroll marquee (7 client logos)

### Styling and Theme

- `src/styles/theme.css` — Cinematic color tokens (amber: #d4a853, black: #0a0a0a, dark: #141414, gray: #1f1f1f)
- `src/styles/fonts.css` — Font family declarations (Inter body, Space Grotesk headings)
- `src/lib/utils.ts` — cn() utility for Tailwind class merging

### Navigation and App Shell

- `src/app/components/Navigation.tsx` — Nav component (preloader must overlay this, then reveal)
- `src/app/App.tsx` — Root component composing all sections (preloader integration point)
- `src/app/components/SectionErrorBoundary.tsx` — Error boundary wrapping sections (Phase 1)

### Prior Phase Context

- `.planning/phases/01-infrastructure-safety-net/01-CONTEXT.md` — Error boundary decisions, CSP baseline
- `.planning/phases/02-cleanup-architecture/02-CONTEXT.md` — Video lazy-loading, font self-hosting, cn() relocation, ESLint migration

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `motion` (framer-motion successor) — already used in all section components for `whileInView` animations. Hero already has staggered `motion` with custom cubic bezier easing.
- `useInView` hook (`src/hooks/useInView.ts`) — IntersectionObserver with configurable rootMargin, used by LazyVideo for threshold-based video mounting.
- `cn()` utility (`src/lib/utils.ts`) — clsx + tailwind-merge for conditional class merging.
- `lucide-react` icons — Play, X, ChevronDown, Menu already imported across components.
- Cinematic theme colors — `cinematic-amber`, `cinematic-black`, `cinematic-dark`, `cinematic-gray` defined in theme.css and used consistently.
- CDN thumbnail JPGs — all 19 video projects have poster images on CloudFront CDN.

### Established Patterns

- Motion `whileInView` with `viewport={{ once: true }}` for scroll-triggered animations across all sections.
- Standard section pattern: `<section id="..." className="py-24 md:py-32">` with `max-w-7xl mx-auto` container.
- Local `useState` for all component state — no global state management.
- Video grid uses `onMouseEnter`/`onMouseLeave` for hover-to-play (needs touch fallback).
- Modal uses fixed overlay with `onClick` backdrop dismiss and `motion` scale/opacity transitions.

### Integration Points

- `App.tsx` — Preloader component wraps or precedes the section composition. Must manage initial load state.
- `Hero.tsx` — Animation values need updating (easing curves, blur filter, stagger timing). Structure preserved.
- `Portfolio.tsx` — Filter pill bar above grid, `LazyVideo` needs touch detection, modal needs keyboard handlers.
- `Clients.tsx` — Replace `flex-wrap` grid with CSS/Motion infinite-scroll marquee.
- `Navigation.tsx` — Hidden during preloader, revealed after preloader dismisses.

</code_context>

<specifics>
## Specific Ideas

- Hero reveal should feel like a film title sequence opening — not snappy UI, but measured and elegant
- The preloader sets the first impression of the site — it should feel intentional and cinematic, not like a loading screen
- Filter transitions should feel fluid and polished — videos flowing to new positions rather than popping
- On touch devices, the "tap to watch" overlay should be clear enough that users understand the two-tap flow without instructions
- The whole page should feel like one cohesive cinematic experience, not a collection of independently animated sections

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

_Phase: 03-visual-overhaul_
_Context gathered: 2026-03-30_
