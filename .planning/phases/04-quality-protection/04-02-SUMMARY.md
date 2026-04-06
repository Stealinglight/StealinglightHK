---
phase: 04-quality-protection
plan: 02
subsystem: ui
tags: [cloudflare-turnstile, accessibility, focus-trap, skip-link, aria, react]
requirements_completed: [PERF-03, QUAL-02]

# Dependency graph
requires:
  - phase: 04-quality-protection plan 01
    provides: Lambda Turnstile server-side verification, CSP allows challenges.cloudflare.com, VITE_TURNSTILE_SITE_KEY Amplify env var
provides:
  - Turnstile invisible widget in Contact.tsx with lazy script loading and token management
  - Skip link as first focusable element in App.tsx navigating to #portfolio
  - Focus trap in Portfolio.tsx video modal with role=dialog and aria-modal
  - Focus restore on modal close to trigger element
  - TypeScript declarations for Cloudflare Turnstile API
affects: []

# Tech tracking
tech-stack:
  added: []
  patterns: [IntersectionObserver lazy script loading for third-party widgets, useFocusTrap hook with dynamic element re-querying, SkipLink component with sr-only focus:not-sr-only pattern]

key-files:
  created: [src/types/turnstile.d.ts, src/hooks/useFocusTrap.ts]
  modified: [src/app/components/Contact.tsx, src/app/components/Portfolio.tsx, src/app/App.tsx]

key-decisions:
  - "IntersectionObserver with 200px rootMargin for lazy Turnstile loading (consistent with existing video lazy load pattern)"
  - "appearance: interaction-only for Turnstile widget (invisible until interaction needed)"
  - "Turnstile token check skipped when VITE_TURNSTILE_SITE_KEY not configured (development graceful degradation)"
  - "Alt text audit confirmed all images correctly attributed -- no changes needed"

patterns-established:
  - "Lazy third-party script loading via IntersectionObserver + dynamic script injection"
  - "Focus trap hook re-queries focusable elements on each Tab press for dynamic modal content"
  - "Skip link with sr-only focus:not-sr-only Tailwind pattern for keyboard accessibility"
  - "Modal focus restore via triggerRef capturing document.activeElement before open"

requirements-completed: [PERF-03, QUAL-02]

# Metrics
duration: 3min
completed: 2026-04-01
---

# Phase 4 Plan 2: Frontend Turnstile & Accessibility Summary

**Turnstile invisible widget with lazy loading in contact form, skip link for keyboard navigation, and focus-trapped video modal with ARIA attributes**

## Performance

- **Duration:** 3 min
- **Started:** 2026-04-01T14:43:49Z
- **Completed:** 2026-04-01T14:47:00Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Turnstile invisible widget loads lazily via IntersectionObserver when contact section enters viewport, stores token in state, attaches cf-turnstile-response to form submission, handles expired tokens and verification errors
- Skip link renders as first focusable element in App.tsx, visible on Tab focus with cinematic-amber styling at z-[60], navigates to #portfolio
- Video modal has role=dialog, aria-modal=true, aria-labelledby, Tab key cycling via useFocusTrap hook, and focus restores to trigger element on close
- Alt text audit completed: all 6 image locations verified correct (decorative images use alt="", content images use descriptive alt text)

## Task Commits

Each task was committed atomically:

1. **Task 1: Turnstile client-side integration in Contact.tsx** - `ac1de71` (feat)
2. **Task 2: Accessibility -- skip link, modal focus trap, and alt text audit** - `c189404` (feat)

## Files Created/Modified
- `src/types/turnstile.d.ts` - TypeScript declarations for Cloudflare Turnstile global API (render, reset, getResponse, isExpired, remove, execute)
- `src/app/components/Contact.tsx` - Turnstile lazy loading, token state, expiry check, form submission integration, widget cleanup
- `src/hooks/useFocusTrap.ts` - Custom hook trapping Tab/Shift+Tab within a container, re-queries elements on each keypress
- `src/app/components/Portfolio.tsx` - Focus trap in video modal, triggerRef for focus restore, role=dialog, aria-modal, aria-labelledby
- `src/app/App.tsx` - SkipLink component as first child of root div, sr-only with focus:not-sr-only visibility

## Decisions Made
- Used IntersectionObserver directly in Contact.tsx (consistent with existing useInView pattern) rather than importing useInView hook, since Turnstile needs the observer for script loading not just visibility state
- Turnstile appearance set to interaction-only (widget stays invisible unless Cloudflare needs user interaction)
- Token expiry check before submit (Pitfall 1 from research) prevents 403 errors from expired tokens
- Alt text audit confirmed no changes needed -- all images follow WCAG guidelines correctly

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Pre-existing TypeScript errors in SectionErrorBoundary.tsx and videos.ts (not caused by this plan's changes, out of scope)
- node_modules not present in worktree; ran npm install for TypeScript compilation

## User Setup Required
None - Turnstile site key was already configured as Amplify env var in Plan 04-01. Frontend integration will activate automatically when VITE_TURNSTILE_SITE_KEY is set.

## Known Stubs
None -- Turnstile integration gracefully degrades when VITE_TURNSTILE_SITE_KEY is not configured (skips token check, does not render widget). This is intentional for development environments and documented in the code.

## Next Phase Readiness
- Turnstile bot protection is fully wired end-to-end (backend verification in 04-01, frontend widget in 04-02)
- Accessibility improvements (skip link, focus trap, ARIA) are structural and require no further configuration
- Phase 04 (quality-protection) is complete

## Self-Check: PASSED

- All 6 files verified present
- Both task commits (ac1de71, c189404) verified in git log
- Production build succeeds (424.73 kB JS, 35.84 kB CSS)
- No TypeScript errors in modified files

---
*Phase: 04-quality-protection*
*Completed: 2026-04-01*
