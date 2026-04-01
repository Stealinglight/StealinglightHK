# Requirements: stealinglight.hk

**Defined:** 2026-03-29
**Core Value:** Visitors experience the cinematography work in a contemporary, cinematic, artistically crafted presentation — and can easily reach out if interested.

## v1 Requirements

Requirements for the site revamp. Each maps to roadmap phases.

### Infrastructure

- [x] **INFRA-01**: Contact form submits successfully and delivers email via SES end-to-end (resolve dual Lambda file divergence)
- [x] **INFRA-02**: CSP headers allow Google Analytics, Google Fonts, and CloudFront CDN without blocking
- [x] **INFRA-03**: Site has favicon.svg in browser tab and og-image.jpg for social media sharing previews
- [x] **INFRA-04**: React error boundary catches component crashes and displays graceful fallback instead of blank page
- [x] **INFRA-05**: CloudWatch alarms notify via SNS when Lambda errors or API 5xx/4xx thresholds are breached
- [x] **INFRA-06**: npm audit shows zero high/critical vulnerabilities in both root and infra packages

### Cleanup

- [x] **CLEAN-01**: All 44 unused shadcn/ui component files removed from src/app/components/ui/
- [x] **CLEAN-02**: All unused npm packages removed from package.json (MUI, Radix, drag-drop, charts, date pickers, etc.)
- [x] **CLEAN-03**: Package name updated from @figma/my-make-file to stealinglight-hk, stale pnpm overrides removed
- [x] **CLEAN-04**: ESLint migrated from legacy .eslintrc.json to flat config (eslint.config.js), ESLINT_USE_FLAT_CONFIG flag removed

### Visual

- [x] **VISL-01**: Hero section has cinematic text reveal animations with refined easing (0.6-1.2s timing, not snappy UI)
- [x] **VISL-02**: All sections have coordinated scroll-triggered animations with staggered reveals and subtle parallax depth
- [x] **VISL-03**: Client logo section uses animated infinite-scroll marquee instead of static grid
- [x] **VISL-04**: Typography and spacing are consistent across all sections with self-hosted fonts via Fontsource (no render-blocking CDN)

### Video

- [x] **VIDO-01**: Video grid works on touch devices with tap-to-preview fallback (detects hover capability via media query)
- [x] **VIDO-02**: User can filter portfolio videos by category (Commercial, Documentary, Short Film, Fashion, Event, Personal Reel)
- [x] **VIDO-03**: Branded preloader displays while hero video buffers on initial page load
- [x] **VIDO-04**: Video modal supports keyboard navigation (Escape to close, arrow keys between videos, spacebar play/pause)

### Performance

- [x] **PERF-01**: Fonts self-hosted via Fontsource (Inter, Space Grotesk) — no render-blocking Google Fonts CDN dependency
- [x] **PERF-02**: Off-screen video elements lazy-rendered via IntersectionObserver instead of all 19 mounted simultaneously
- [x] **PERF-03**: Contact form protected by Cloudflare Turnstile invisible CAPTCHA with server-side verification in Lambda
- [x] **PERF-04**: CloudFront CDN base URL sourced from VITE_CDN_BASE_URL environment variable instead of hardcoded

### Quality

- [x] **QUAL-01**: Scroll progress indicator shows position within single-page site (thin accent-color bar)
- [x] **QUAL-02**: Site passes basic accessibility audit — skip links, focus management in modal, alt text on images, reduced motion support via useReducedMotion
- [x] **QUAL-03**: Unused application components removed (Reel.tsx, ImageWithFallback.tsx) and dead code cleaned up

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Video Enhancement

- **VIDO-05**: Custom video player chrome with branded progress bar, volume slider, time display in site accent color
- **VIDO-06**: Animated transitions between videos within modal (swipe or crossfade to next/previous)

### Performance Deep Dive

- **PERF-05**: Core Web Vitals optimization — bundle splitting, image optimization pipeline, font subsetting
- **PERF-06**: WebM video alternatives for smaller file sizes on supporting browsers
- **PERF-07**: Transcode .mov files (Gin Mare, NIU eScooters) to .mp4 for broader browser compatibility

### Quality Deep Dive

- **QUAL-04**: WCAG 2.2 AA compliance with screen reader testing
- **QUAL-05**: CDK infrastructure snapshot tests for all four stacks
- **QUAL-06**: Cross-browser E2E testing (Firefox, WebKit in addition to Chromium)

## Out of Scope

| Feature                                     | Reason                                                                         |
| ------------------------------------------- | ------------------------------------------------------------------------------ |
| Multi-page routing / separate project pages | Single-page scroll architecture is intentional and correct for this use case   |
| Blog or news section                        | Owner not actively pursuing business; stale blog is worse than no blog         |
| CMS / admin panel                           | Over-engineering for 19-video portfolio managed in code via videos.ts          |
| Background music / ambient audio            | Universally hated, browsers block it, interferes with video playback           |
| Scroll hijacking / parallax scrolljacking   | Breaks accessibility, disorients users, causes motion sickness                 |
| Custom cursor / animated cursor             | Breaks accessibility, feels gimmicky, interferes with native browser behaviors |
| Chatbot / AI assistant                      | Over-scoped for portfolio site; contact form is sufficient                     |
| Testimonials / reviews section              | Client logos ARE the social proof; quotes section would feel forced            |
| Credits / resume page                       | User explicitly excluded; shifts site from portfolio to job application        |
| Video autoplay in grid                      | Destroys performance, eats bandwidth, crashes mobile browsers                  |
| Mobile native app                           | Web-only portfolio                                                             |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase   | Status  |
| ----------- | ------- | ------- |
| INFRA-01    | Phase 1 | Complete |
| INFRA-02    | Phase 1 | Complete |
| INFRA-03    | Phase 1 | Complete |
| INFRA-04    | Phase 1 | Complete |
| INFRA-05    | Phase 4 | Complete |
| INFRA-06    | Phase 1 | Complete |
| CLEAN-01    | Phase 2 | Complete |
| CLEAN-02    | Phase 2 | Complete |
| CLEAN-03    | Phase 2 | Complete |
| CLEAN-04    | Phase 2 | Complete |
| VISL-01     | Phase 3 | Complete |
| VISL-02     | Phase 3 | Complete |
| VISL-03     | Phase 3 | Complete |
| VISL-04     | Phase 3 | Complete |
| VIDO-01     | Phase 3 | Complete |
| VIDO-02     | Phase 3 | Complete |
| VIDO-03     | Phase 3 | Complete |
| VIDO-04     | Phase 3 | Complete |
| PERF-01     | Phase 2 | Complete |
| PERF-02     | Phase 2 | Complete |
| PERF-03     | Phase 4 | Complete |
| PERF-04     | Phase 2 | Complete |
| QUAL-01     | Phase 3 | Complete |
| QUAL-02     | Phase 4 | Complete |
| QUAL-03     | Phase 2 | Complete |

**Coverage:**

- v1 requirements: 25 total
- Mapped to phases: 25
- Unmapped: 0

---

_Requirements defined: 2026-03-29_
_Last updated: 2026-03-27 after roadmap creation_
