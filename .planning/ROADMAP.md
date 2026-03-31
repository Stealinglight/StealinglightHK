# Roadmap: stealinglight.hk

## Overview

This roadmap transforms the stealinglight.hk cinematography portfolio from a partially-built Figma template scaffold into a polished, cinematic presentation of the owner's film work. The journey follows hard dependencies: fix broken infrastructure first (contact form, CSP, error isolation), then strip the codebase to its essentials and build the video architecture, then apply the cinematic visual overhaul that consumes that architecture, and finally add quality and monitoring polish. Four phases, sequential, each delivering a verifiable capability that the next phase depends on.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Infrastructure & Safety Net** - Fix broken systems and add error isolation so development can proceed safely (completed 2026-03-30)
- [ ] **Phase 2: Cleanup & Architecture** - Strip dead code, build video system and hooks that the visual overhaul consumes
- [ ] **Phase 3: Visual Overhaul** - Deliver the cinematic experience section by section using Phase 2 infrastructure
- [ ] **Phase 4: Quality & Protection** - Add accessibility, bot protection, and monitoring to the finished site

## Phase Details

### Phase 1: Infrastructure & Safety Net

**Goal**: Broken systems work correctly and the site is safe to develop against without cascading failures
**Depends on**: Nothing (first phase)
**Requirements**: INFRA-01, INFRA-02, INFRA-03, INFRA-04, INFRA-06
**Success Criteria** (what must be TRUE):

1. Contact form submits from the live site and an email arrives in the recipient's inbox (tested with a non-verified external address)
2. Google Analytics reports page views in the GA dashboard and Google Fonts load without console errors in production
3. Browser tab shows the stealinglight favicon and shared links on social media display the og-image preview
4. A deliberate error thrown inside a section component shows a graceful fallback instead of a blank white page
5. npm audit reports zero high or critical vulnerabilities in both root and infra packages
   **Plans**: 2 plans

Plans:

- [x] 01-01-PLAN.md -- Lambda cleanup and CSP fix (delete divergent index.ts, fix Content-Security-Policy for GA/Fonts/CDN)
- [x] 01-02-PLAN.md -- Error boundary, assets, and npm audit (react-error-boundary wrapping, favicon/og-image, vulnerability remediation)

### Phase 2: Cleanup & Architecture

**Goal**: Codebase is lean (10-12 production dependencies), video system architecture is built, and fonts are self-hosted
**Depends on**: Phase 1
**Requirements**: CLEAN-01, CLEAN-02, CLEAN-03, CLEAN-04, PERF-01, PERF-02, PERF-04, QUAL-03
**Success Criteria** (what must be TRUE):

1. The src/app/components/ui/ directory contains only components actively imported by the application (zero unused shadcn/ui files remain)
2. npm ls --depth=0 shows 10-15 production dependencies (down from 60+) and the build completes with zero warnings
3. Fonts load from the local bundle (no network request to fonts.googleapis.com visible in DevTools) and package.json shows name "stealinglight-hk"
4. Video elements below the fold are not present in the DOM until scrolled near (verified via DevTools Elements panel on page load)
5. ESLint runs without the ESLINT_USE_FLAT_CONFIG flag and uses eslint.config.js
   **Plans**: 3 plans

Plans:

- [x] 02-01-PLAN.md -- Nuclear cleanup (delete 44 shadcn/ui files, dead components, overhaul package.json dependencies)
- [x] 02-02-PLAN.md -- Font self-hosting + CSP + CDN variable (Fontsource migration, CSP tightening, VITE_CDN_BASE_URL)
- [x] 02-03-PLAN.md -- Video lazy-loading + ESLint migration (IntersectionObserver hook, flat config with Lambda linting)

### Phase 3: Visual Overhaul

**Goal**: Visitors experience the cinematography work in a contemporary, cinematic presentation with smooth animations, video filtering, and touch-friendly interactions
**Depends on**: Phase 2
**Requirements**: VISL-01, VISL-02, VISL-03, VISL-04, VIDO-01, VIDO-02, VIDO-03, VIDO-04, QUAL-01
**Success Criteria** (what must be TRUE):

1. Hero section plays a cinematic text reveal sequence with smooth easing (0.6-1.2s timing) while the background video loads behind a branded preloader
2. Scrolling through the page triggers coordinated section animations with staggered reveals and the client logo section displays an animated infinite-scroll marquee
3. User can filter portfolio videos by category (Commercial, Documentary, Short Film, Fashion, Event, Personal Reel) and the grid animates between filter states
4. On a touch device, tapping a video card shows a preview (no hover required) and the video modal supports Escape to close, arrow keys to navigate, and spacebar to play/pause
5. Typography and spacing are visually consistent across all sections with no jarring transitions, and a thin scroll progress bar indicates position within the page
   **Plans**: 3 plans
   **UI hint**: yes

Plans:

- [ ] 03-01-PLAN.md -- Preloader, scroll progress, and hero cinematic reveal (Preloader.tsx, ScrollProgress.tsx, Hero variant-based stagger with blur)
- [ ] 03-02-PLAN.md -- Portfolio filter pills, touch support, and keyboard navigation (category filtering with AnimatePresence, two-tap touch flow, modal keyboard nav)
- [ ] 03-03-PLAN.md -- Client marquee, section animation polish, and typography pass (CSS marquee with 15 logos, cinematic easing on all sections, Footer entrance, weight consolidation)

### Phase 4: Quality & Protection

**Goal**: The finished site is accessible, protected from bots, and monitored for failures
**Depends on**: Phase 3
**Requirements**: INFRA-05, PERF-03, QUAL-02
**Success Criteria** (what must be TRUE):

1. Contact form is protected by Cloudflare Turnstile invisible CAPTCHA and the Lambda verifies the token server-side before sending email
2. Site passes automated accessibility checks -- skip links exist, modal traps focus correctly, images have alt text, and animations respect prefers-reduced-motion
3. CloudWatch alarms fire an SNS notification when Lambda error rate or API Gateway 5xx/4xx counts exceed configured thresholds
   **Plans**: TBD

Plans:

- [ ] 04-01: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4

| Phase                          | Plans Complete | Status      | Completed  |
| ------------------------------ | -------------- | ----------- | ---------- |
| 1. Infrastructure & Safety Net | 2/2            | Complete    | 2026-03-30 |
| 2. Cleanup & Architecture      | 3/3            | Complete    | 2026-03-30 |
| 3. Visual Overhaul             | 0/3            | Planned     | -          |
| 4. Quality & Protection        | 0/1            | Not started | -          |
