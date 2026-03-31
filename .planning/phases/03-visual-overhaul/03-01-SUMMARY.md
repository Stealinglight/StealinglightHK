---
phase: 03-visual-overhaul
plan: 01
subsystem: ui
tags: [motion, animation, preloader, scroll-progress, hero, variants, blur-filter]

# Dependency graph
requires:
  - phase: 02-cleanup-architecture
    provides: Self-hosted fonts, SectionErrorBoundary, cleaned component tree
provides:
  - Branded full-page preloader with amber pulse and progress bar
  - Scroll progress indicator using Motion useScroll + useSpring
  - Cinematic hero reveal with variant-based stagger and blur-to-sharp effect
  - App.tsx load state management with dual-condition preloader dismissal
affects: [03-02, 03-03, 04-production-hardening]

# Tech tracking
tech-stack:
  added: []
  patterns: [variant-based stagger with explicit per-element delays, dual-condition state gate pattern, useReducedMotion accessibility]

key-files:
  created:
    - src/app/components/Preloader.tsx
    - src/app/components/ScrollProgress.tsx
  modified:
    - src/app/components/Hero.tsx
    - src/app/App.tsx

key-decisions:
  - "Per-element explicit delays instead of staggerChildren for non-uniform D-02 timeline"
  - "Synthetic progress bar animation (0.8s fill) instead of actual video download progress"
  - "useReducedMotion skips pulse animation but keeps static amber text visible"

patterns-established:
  - "EASE_CINEMATIC [0.16, 1, 0.3, 1] as shared easing constant for all phase 3 animations"
  - "Variant factory functions (fadeUpBlur, fadeIn, fadeUp) accepting delay parameter"
  - "Dual-condition preloader: refs + useCallback checkDismiss pattern"

requirements-completed: [VISL-01, VIDO-03, QUAL-01]

# Metrics
duration: 3min
completed: 2026-03-31
---

# Phase 3 Plan 01: Preloader, Scroll Progress, and Hero Reveal Summary

**Branded preloader with amber pulse + scroll progress bar + cinematic hero stagger with blur-to-sharp filter animation using Motion variants**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-31T11:52:51Z
- **Completed:** 2026-03-31T11:55:39Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments
- Created Preloader component with STEALINGLIGHT amber pulse, progress bar, and smooth exit animation at z-[70]
- Created ScrollProgress component with spring-physics scroll tracking at z-[60]
- Refactored Hero to variant-based stagger with D-02 choreographed timeline (0.3s, 0.6s, 0.9s, 1.6s, 2.0s)
- Wired App.tsx with dual-condition preloader dismissal (video canPlay + 800ms minimum + 4s safety timeout)

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Preloader, ScrollProgress, and wire App.tsx load state** - `87753a2` (feat)
2. **Task 2: Refactor Hero to cinematic variant-based stagger with blur reveal** - `549b84f` (feat)

## Files Created/Modified
- `src/app/components/Preloader.tsx` - Full-page branded preloader with amber pulse and progress bar
- `src/app/components/ScrollProgress.tsx` - Fixed scroll progress bar using Motion useScroll + useSpring
- `src/app/components/Hero.tsx` - Cinematic hero with variant-based stagger and blur-to-sharp effect
- `src/app/App.tsx` - Root component with preloader state management and scroll progress integration

## Decisions Made
- Used per-element explicit delay values via variant factory functions instead of staggerChildren, because D-02 timeline has non-uniform spacing (0.3s intervals then 0.4s gaps)
- Synthetic progress bar animation (smooth 0.8s fill) rather than tracking actual video download progress, since browser streaming video provides unreliable progress events
- Added will-change: filter on blur-animated elements to prevent Safari text rendering jank (per RESEARCH.md Pitfall 4)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added onVideoReady to HeroProps in Task 1**
- **Found during:** Task 1 (App.tsx wiring)
- **Issue:** Plan passes onVideoReady to Hero in Task 1 but updates Hero interface in Task 2. TypeScript would error.
- **Fix:** Added onVideoReady to HeroProps interface and onCanPlay handler in Task 1 alongside App.tsx wiring
- **Files modified:** src/app/components/Hero.tsx
- **Verification:** npx tsc --noEmit passes
- **Committed in:** 87753a2 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Minor ordering adjustment to avoid TS error between tasks. No scope creep.

## Issues Encountered
- Pre-existing TypeScript errors in SectionErrorBoundary.tsx (error type mismatch) and videos.ts (featured property on as const array) exist but are unrelated to this plan's changes. Both compile fine in Vite build (which uses esbuild, not strict tsc).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Preloader and scroll progress are globally available via App.tsx
- EASE_CINEMATIC constant and variant factory pattern established for reuse in plans 02 and 03
- Hero reveal sequence fully choreographed per D-02 specification
- Z-index stack documented: content (auto) < nav (z-50) < scroll progress (z-[60]) < preloader (z-[70])

## Self-Check: PASSED

All 5 files verified present. Both task commits (87753a2, 549b84f) confirmed in git log.

---
*Phase: 03-visual-overhaul*
*Completed: 2026-03-31*
