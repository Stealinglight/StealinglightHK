# Roadmap: stealinglight.hk

## Overview

This roadmap transforms the stealinglight.hk cinematography portfolio from a partially-built Figma template scaffold into a polished, cinematic presentation of the owner's film work. The journey follows hard dependencies: fix broken infrastructure first (contact form, CSP, error isolation), then strip the codebase to its essentials and build the video architecture, then apply the cinematic visual overhaul that consumes that architecture, and finally add quality and monitoring polish. Four phases, sequential, each delivering a verifiable capability that the next phase depends on.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Infrastructure & Safety Net** - Fix broken systems and add error isolation so development can proceed safely (completed 2026-03-30)
- [x] **Phase 2: Cleanup & Architecture** - Strip dead code, build video system and hooks that the visual overhaul consumes (completed 2026-03-30)
- [x] **Phase 3: Visual Overhaul** - Deliver the cinematic experience section by section using Phase 2 infrastructure (completed 2026-03-31)
- [x] **Phase 4: Quality & Protection** - Add accessibility, bot protection, and monitoring to the finished site (completed 2026-04-01)
- [x] **Phase 5: Tech Debt Sweep** - Close audit gaps: fix tsc errors, dead code, broken animation, stale docs (completed 2026-04-02)
- [ ] **Phase 6: README & Screenshots** - Polished GitHub README with live site screenshots, tech badges, architecture
- [ ] **Phase 7: Docs Audit & Repo Hygiene** - Full docs audit and .planning/ exclusion from GitHub

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

- [x] 03-01-PLAN.md -- Preloader, scroll progress, and hero cinematic reveal (Preloader.tsx, ScrollProgress.tsx, Hero variant-based stagger with blur)
- [x] 03-02-PLAN.md -- Portfolio filter pills, touch support, and keyboard navigation (category filtering with AnimatePresence, two-tap touch flow, modal keyboard nav)
- [x] 03-03-PLAN.md -- Client marquee, section animation polish, and typography pass (CSS marquee with 15 logos, cinematic easing on all sections, Footer entrance, weight consolidation)

### Phase 4: Quality & Protection

**Goal**: The finished site is accessible, protected from bots, and monitored for failures
**Depends on**: Phase 3
**Requirements**: INFRA-05, PERF-03, QUAL-02
**Success Criteria** (what must be TRUE):

1. Contact form is protected by Cloudflare Turnstile invisible CAPTCHA and the Lambda verifies the token server-side before sending email
2. Site passes automated accessibility checks -- skip links exist, modal traps focus correctly, images have alt text, and animations respect prefers-reduced-motion
3. CloudWatch alarms fire an SNS notification when Lambda error rate or API Gateway 5xx/4xx counts exceed configured thresholds
   **Plans**: 3 plans

Plans:

- [x] 04-01-PLAN.md -- CDK infrastructure: SNS alarm notifications, Turnstile Lambda verification, CSP update
- [x] 04-02-PLAN.md -- Frontend: Turnstile widget in contact form, skip link, modal focus trap, alt text audit
- [x] 04-03-PLAN.md -- Gap closure: add useReducedMotion guards to 8 animated section components (QUAL-02)

### Phase 5: Tech Debt Sweep

**Goal**: Close all actionable tech debt identified by the v1.0 milestone audit — fix type errors, remove dead code, repair broken animation, and correct stale documentation
**Depends on**: Phase 4
**Requirements**: None (all 25/25 satisfied; this phase addresses code quality and documentation)
**Gap Closure:** Closes integration gap PRELOADER_ONDISMISS and 7 tech debt items from v1.0-MILESTONE-AUDIT.md
**Success Criteria** (what must be TRUE):

1. `npx tsc --noEmit` reports zero errors (SectionErrorBoundary.tsx and videos.ts fixed)
2. Navigation.tsx mobile menu exit animation plays correctly (AnimatePresence wrapper added)
3. Preloader.tsx no longer accepts an `onDismiss` prop (dead interface removed)
4. `.env.example` includes `VITE_TURNSTILE_SITE_KEY` placeholder
5. CLAUDE.md documents contact name max length as 200 (matching Lambda's `MAX_NAME_LENGTH`)
6. ROADMAP.md progress table reflects actual state (all 4 phases complete)
7. All SUMMARY.md files have populated `requirements_completed` frontmatter fields

**Plans**: 2 plans

Plans:

- [x] 05-01-PLAN.md -- Code fixes: tsc type errors, Navigation AnimatePresence, Preloader dead prop removal
- [x] 05-02-PLAN.md -- Documentation fixes: .env.example, CLAUDE.md, SUMMARY.md frontmatter population

### Phase 6: README & Screenshots

**Goal**: Create a polished GitHub README.md with live site screenshots, tech badges, architecture overview, and dev setup instructions
**Depends on**: Phase 5
**Requirements**: READ-01, READ-02, READ-03, READ-04, READ-05, SHOT-01, SHOT-02, SHOT-03
**Success Criteria** (what must be TRUE):

1. README.md renders on GitHub with hero screenshot, tech badges, and architecture section
2. Screenshots directory contains captures of hero, portfolio grid, and contact sections
3. README includes working local dev setup instructions

Plans: TBD (planned via `/gsd-plan-phase 6`)

### Phase 7: Docs Audit & Repo Hygiene

**Goal**: Ensure all project documentation is accurate and .planning/ is excluded from the repository
**Depends on**: Phase 6
**Requirements**: DOCS-01, DOCS-02, DOCS-03, DOCS-04, DOCS-05, REPO-01, REPO-02
**Success Criteria** (what must be TRUE):

1. CLAUDE.md accurately reflects current dependencies, conventions, and architecture
2. package.json, .env.example, humans.txt, llms.txt, sitemap.xml, robots.txt are all current
3. .planning/ directory is gitignored and untracked

Plans: TBD (planned via `/gsd-plan-phase 7`)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7

| Phase                          | Plans Complete | Status   | Completed  |
| ------------------------------ | -------------- | -------- | ---------- |
| 1. Infrastructure & Safety Net | 2/2            | Complete | 2026-03-30 |
| 2. Cleanup & Architecture      | 3/3            | Complete | 2026-03-30 |
| 3. Visual Overhaul             | 3/3            | Complete | 2026-03-31 |
| 4. Quality & Protection        | 3/3            | Complete | 2026-04-01 |
| 5. Tech Debt Sweep             | 2/2            | Complete | 2026-04-02 |
| 6. README & Screenshots        | 0/?            | Pending  | —          |
| 7. Docs Audit & Repo Hygiene   | 0/?            | Pending  | —          |
