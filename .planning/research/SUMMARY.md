# Project Research Summary

**Project:** stealinglight.hk cinematography portfolio revamp
**Domain:** Video-heavy single-page cinematography portfolio (React + Vite + AWS serverless)
**Researched:** 2026-03-27
**Confidence:** HIGH

## Executive Summary

This is a visual revamp of an existing React 19 + Vite 7 + Tailwind CSS 4 cinematography portfolio. The site already functions architecturally — it has a hero video, portfolio grid with hover-to-play, video modal, about section, services, client logos, contact form, and footer — but suffers from three systemic problems: broken infrastructure (contact form fails, CSP blocks Analytics and Fonts), massive dependency bloat from a Figma Make template origin (60+ packages, 44 unused UI components, 5,119 lines of dead code), and a visual experience that is "functional but unfinished" rather than "cinematic and professional." The revamp goal is a lean, purpose-built site that makes the cinematography work the hero.

The recommended approach is sequential, not parallel: fix what is broken before touching design. The critical path is (1) infrastructure fixes — SES verification, CSP overhaul, error boundaries, Lambda dual-file resolution — then (2) dependency cleanup guided by a finalized design spec, then (3) visual overhaul section-by-section using the existing React + Motion + Tailwind stack with a small number of targeted additions (Fontsource for self-hosted fonts, Zod for form validation, Cloudflare Turnstile for bot protection). The stack does not need to change; the architecture does — specifically around video loading (19 simultaneous DOM elements is a mobile performance bomb) and component decomposition (monolithic Portfolio.tsx must be split into video system components and hooks).

The single highest risk is deploying contact form fixes without verifying SES production access. AWS SES sandbox mode blocks emails to non-verified recipients and is invisible to application-level testing — the Lambda can return 200 while SES silently drops every email. This is a blocking prerequisite for all contact form work and requires a 24-hour AWS review if the account is not already in production mode. Secondary risks are aggressive dead code removal breaking hidden import chains, and CSP changes silently breaking production (Vite dev server does not apply Amplify custom headers, so CSP issues only surface post-deploy).

## Key Findings

### Recommended Stack

The core framework is locked and correct: React 19, Vite 7.3, Tailwind CSS 4, TypeScript, Motion (framer-motion successor), Lucide React icons, Sonner toasts. No framework changes are warranted. The revamp adds four targeted libraries: `@fontsource-variable/inter` and `@fontsource-variable/space-grotesk` (self-host fonts, eliminating the render-blocking Google Fonts CDN call and fixing the CSP conflict), `zod` (typed form validation, replaces manual if/else checks), and Cloudflare Turnstile (invisible bot protection for the contact form via CDN script + Lambda server-side validation). Two dev dependencies are added: `@axe-core/playwright` for automated accessibility testing and `vite-plugin-image-optimizer` for build-time image compression.

The most impactful single action is removing ~50 unused packages and 44 unused UI components. This reduces production dependencies from 60+ to 10-12 packages, cuts install time, eliminates vulnerability surface area, and removes 5,119 lines of dead code that currently obscure the real architecture. The cleanup must happen after the design spec is finalized (to avoid removing components the redesign actually needs) and incrementally (to avoid breaking hidden import chains). Video optimization requires no new libraries — it is a code architecture change: IntersectionObserver lazy rendering, a `useVideoPreload` hook with three-stage loading (poster → metadata → ready), and mobile-specific behavior switching via `useMediaQuery('(hover: hover)')`.

**Core technologies:**

- React 19 + Vite 7.3: UI framework and build tool — already current, no changes needed
- Tailwind CSS 4.2 + @tailwindcss/vite: Utility CSS via Vite plugin (not PostCSS) — safe minor bump
- Motion 12.38: Declarative animations with hardware-accelerated scroll-linked effects — already installed, needs `useReducedMotion` and `AnimatePresence` additions
- @fontsource-variable/inter + space-grotesk: Self-hosted variable fonts — eliminates render-blocking CDN and CSP conflict
- Zod 4.3: Typed schema validation for contact form — replaces manual validation, shared client/server
- Cloudflare Turnstile: Invisible bot protection — free, privacy-preserving, no user friction
- @radix-ui/react-dialog: Accessible modal foundation (keep only this, remove 24 other Radix packages)

**What NOT to use:**

- GSAP (commercial license, Motion covers all needs), Three.js (overkill), Video.js/Plyr (overkill for self-hosted MP4/WebM), Lenis/Locomotive Scroll (breaks accessibility), reCAPTCHA (tracking, bad UX), react-player (redundant with native video), CSS Modules or Styled Components (conflict with Tailwind), PostCSS (Tailwind 4 uses Vite plugin)

### Expected Features

The features research reveals a clear three-tier structure: fix what is broken, then add cinematic polish, then defer craft-level refinement.

**Must have (table stakes — P1, ship before launch):**

- Working contact form end-to-end — the only conversion mechanism, currently broken
- Fix CSP blocking Google Analytics and fonts — analytics are useless if blocked
- Favicon and og-image.jpg — shared links without previews look unprofessional for a visual portfolio
- Mobile touch-to-play video fallback — hover-to-play fails silently on mobile; 50%+ of portfolio visitors are on phones
- Remove dead code and unused dependencies — 5,119 lines of unused shadcn/ui components bloat the codebase
- Typography and spacing audit — fix design inconsistencies from the template origin
- Fix package name (`@figma/my-make-file` signals unfinished scaffold)

**Should have (differentiators — P2, cinematic polish layer):**

- Cinematic hero text animations — refined easing, text-reveal clip-path effects, dramatic entrance sequence
- Video category filtering — let visitors filter by Commercial, Documentary, Short Film, Fashion (data already exists in videos.ts)
- Animated client logo marquee — replace static grid with CSS infinite-scroll marquee
- Preloader / loading screen — branded transition while hero video buffers, prevents blank-screen jump
- Enhanced scroll-triggered section animations — coordinated reveals, staggered grids, parallax depth
- Keyboard navigation for video modal — Escape, arrow keys, spacebar; low effort, high polish

**Defer (v2+ — P3):**

- Custom video player chrome — branded progress bar, volume, time display; HIGH complexity, native controls are adequate for launch
- Video transition animations between modal items — requires custom player infrastructure
- Core Web Vitals optimization — bundle splitting, font subsetting, image pipeline; important but not visible to casual visitors
- Accessibility deep audit — WCAG 2.2 AA compliance; important ethical concern but significant effort

**Anti-features (explicitly avoid):**

- Multi-page routing / individual project pages — over-engineering for 19 videos
- Background music / ambient audio — universally disliked, inaccessible
- Parallax scrolljacking — breaks accessibility, mobile performance
- CMS / admin panel — out of scope (videos.ts config is the right abstraction level)
- Blog or news section — requires ongoing content creation, empty blog signals abandonment
- Animated custom cursor — gimmicky, breaks accessibility, fails on touch

### Architecture Approach

The recommended architecture centers on three systemic changes to the current flat component structure: (1) extract a video system with proper separation between data, loading, playback, and presentation; (2) centralize animation definitions in a variants config file to replace 20+ instances of copy-pasted `whileInView` props; (3) decompose the monolithic `Portfolio.tsx` (178 lines handling grid rendering, hover state, video playback, modal state, and modal UI simultaneously) into `VideoCard`, `VideoModal`, `VideoPlayer` components backed by `useVideoPreload`, `useVideoPlayer`, and `useVideoModal` hooks. No global state management library is needed — every concern is self-contained and the video modal (the only cross-component communication) needs only a single hook sharing which video is active.

**Major components:**

1. Video system (`VideoCard`, `VideoModal`, `VideoPlayer`, `HeroVideo`) — core complexity of the site; builds on `useVideoPreload` (IntersectionObserver lazy loading), `useVideoPlayer` (controls), `useVideoModal` (modal state + scroll lock)
2. Animation orchestrator (`config/animations.ts`) — centralized Motion variants with named transitions (smooth 0.8s, snappy 0.4s, slow 1.2s for hero); eliminates copy-paste animation props across every component
3. Section components (`Hero`, `Portfolio`, `About`, `Clients`, `Contact`, `Footer`) — thin composition layers that consume the video system and animation variants; redesigned one at a time
4. Contact form system (`useContactForm` hook + `lib/api.ts`) — separates form state/validation from the contact section component; integrates Zod validation and Turnstile token
5. App shell with error boundaries — wrap each major section independently so a video playback failure in Portfolio does not kill the Contact form

**Build order (based on dependency graph):**

1. Foundation (animation config, hooks, error boundaries) — zero dependencies, everything imports from here
2. Video system — builds on foundation, deployed before sections so sections can consume it
3. Layout components (Navigation with `useScroll`, SectionHeader) — shared across sections
4. Section redesign — one section at a time, consuming video system and layout components
5. Polish and performance — optimizes what is already working

### Critical Pitfalls

1. **SES sandbox mode blocks emails silently** — Verify SES sender identity AND account production access (`aws sesv2 get-account`) before any contact form work. Request production access (24hr review) if in sandbox. Test by sending to a non-verified external address through the deployed Lambda endpoint.

2. **Dead code removal breaks hidden import chains** — Delete component files first, verify build, then commit. Remove npm packages in category groups (Radix packages, MUI packages, etc.), verifying build between each group. Run `npx depcheck` after each round. Never remove all 50 packages in one pass.

3. **CSP changes break production silently** — Vite dev server does not apply Amplify custom headers, so CSP issues are invisible locally. Build the CSP string programmatically in the CDK stack (array of directives joined with `; `) rather than editing a hand-built 300-character string. After each deploy, check browser console for `Refused to load` errors before declaring success.

4. **19 video elements destroy mobile performance** — `preload="none"` is not enough; all 19 DOM elements still exist. Use IntersectionObserver to lazy-render `<video>` elements (only set `src` when approaching viewport), limit concurrent downloads to 3-4, and replace hover-to-play with static poster + play button on touch devices. This requires architectural change, not attribute tweaks.

5. **No error boundaries causes white-screen crashes during development** — Add error boundaries wrapping each major section before starting any visual overhaul work. A null reference in a refactored component unmounts the entire app with no recovery. Takes 1-2 hours; prevents catastrophic first impressions during active development.

6. **Premature component removal before design spec is finalized** — Some shadcn/ui components (dialog, tooltip, tabs) may be needed in the new design. Complete the visual design spec BEFORE the cleanup phase. The cleanup should reference a finalized component inventory, not speculate about what the design will require.

## Implications for Roadmap

Based on combined research, five phases emerge from hard dependencies — not arbitrary grouping. The architecture research provides the build order; the pitfalls research determines what must happen first to make subsequent work safe.

### Phase 1: Infrastructure and Safety Net

**Rationale:** Three blocking prerequisites exist before any other work can proceed safely. SES must be verified before contact form work (24hr blocking review). Error boundaries must exist before visual overhaul work (otherwise development crashes cascade to white screens). CSP must be fixed under production-equivalent conditions before analytics can be validated. These are all low-complexity, high-consequence fixes that gate everything downstream.

**Delivers:** A working deployment pipeline with a functioning contact form, correct CSP, and error isolation between sections.

**Addresses:** Working contact form (P1), CSP blocking Analytics and Fonts (P1), error boundaries (architectural safety net).

**Avoids:** SES sandbox blocking emails (Pitfall 2), CSP silent production failures (Pitfall 3), white-screen crashes during development (Pitfall 5).

**Tasks:**

- Verify SES sender identity and account production status; request production access if needed
- Resolve Lambda dual-file issue (delete `index.ts`, keep `index.js` as single source)
- Fix CSP in `amplify-hosting-stack.ts` to allow Google Analytics, Google Fonts, Turnstile
- Add error boundaries wrapping each major section in `App.tsx`
- Add favicon.svg and og-image.jpg
- Fix package name in `package.json`
- End-to-end contact form test to a non-verified external address

### Phase 2: Codebase Cleanup

**Rationale:** The visual overhaul must start from a clean, known-good codebase. Cleanup must happen after design intent is clear enough to know which components stay (avoid Pitfall 6 — removing components the redesign needs) but before writing new component code (avoid polluting the design work with dead code). This phase is destructive-but-safe when done incrementally with build verification between steps.

**Delivers:** A lean codebase — 10-12 production dependencies down from 60+, zero unused UI component files, no dead code obscuring the real architecture.

**Addresses:** Remove dead code and unused dependencies (P1), fix dependency bloat.

**Avoids:** Aggressive cleanup breaking import chains (Pitfall 1), removing needed components (Pitfall 6).

**Tasks:**

- Delete all 44 unused shadcn/ui component files from `src/app/components/ui/` (except `button.tsx`, `utils.ts`)
- Remove all 26 @radix-ui packages except `react-dialog` and `react-slot`
- Remove @mui/material, @emotion/react, @emotion/styled
- Remove react-dnd, react-slick, recharts, react-hook-form, react-responsive-masonry, date-fns, react-day-picker, input-otp, react-resizable-panels, cmdk, embla-carousel-react, vaul, next-themes
- Install Fontsource variable fonts; remove Google Fonts link tags from `index.html`
- Install Zod; replace manual contact form validation
- Add Cloudflare Turnstile widget and Lambda server-side validation
- Migrate ESLint to flat config (remove `ESLINT_USE_FLAT_CONFIG=false`)
- Verify build passes with zero warnings after each removal group

### Phase 3: Architecture Foundation

**Rationale:** The video system is the site's core differentiator and most complex subsystem. Per the architecture research build order, foundation pieces (animation config, hooks) and the video system must be built before section redesign — sections are thin composition layers that consume these. Building the video system first means section redesign can proceed one section at a time without structural rewrites. This phase creates no visible UI change but makes Phase 4 reliable.

**Delivers:** The complete hook and component infrastructure — animation variants system, video loading pipeline, video player, modal transition system — that Phase 4 sections consume.

**Addresses:** Architecture decomposition (Portfolio monolith split), mobile video performance, IntersectionObserver lazy loading.

**Avoids:** 19 simultaneous video elements on mobile (Pitfall 4), monolithic components making redesign risky (ARCHITECTURE anti-pattern 5), hover-to-play failing on mobile (ARCHITECTURE anti-pattern 2).

**Tasks:**

- Create `config/animations.ts` with centralized Motion variants (smooth/snappy/slow transitions, `sectionReveal`, `fadeUp`, `heroStagger`)
- Create `hooks/use-video-preload.ts` (IntersectionObserver, 3-stage loading: poster → metadata → ready)
- Create `hooks/use-video-player.ts` (play/pause/seek/mute/fullscreen, promise rejection handling)
- Create `hooks/use-video-modal.ts` (modal state + scroll lock with proper cleanup)
- Create `hooks/use-reduced-motion.ts` and `hooks/use-media-query.ts`
- Create `components/video/VideoCard.tsx`, `VideoModal.tsx` (with `AnimatePresence` + `layoutId`), `VideoPlayer.tsx`, `HeroVideo.tsx`
- Create `components/layout/SectionHeader.tsx` (extract repeated title+subtitle pattern)
- Refactor `Navigation.tsx` with `useScroll` from Motion

### Phase 4: Visual Overhaul

**Rationale:** With infrastructure stable, codebase clean, and video system built, section redesign can proceed one section at a time with low risk. The architecture research confirms section redesign is the final step in the build order. Each section is a thin composition layer that consumes the Phase 3 infrastructure.

**Delivers:** The cinematic visual experience — dramatic hero sequence, animated portfolio grid, smooth scroll reveals, animated client marquee, polished contact form, keyboard-navigable video modal.

**Addresses:** Cinematic hero animations (P2), video category filtering (P2), animated logo marquee (P2), enhanced scroll animations (P2), keyboard modal navigation (P2), typography/spacing audit (P1), mobile touch-to-play (P1).

**Avoids:** Font FOIT/FOUT causing layout shift (Pitfall 7), hover-to-play failing on mobile (UX pitfall), missing `AnimatePresence` on modal exit (current code gap).

**Tasks:**

- Hero: staggered text reveal with clip-path, hero video with poster-first loading, `prefers-reduced-motion` fallback
- Portfolio: video category filter UI with animated transitions, VideoCard hover/tap interactions, VideoModal with `layoutId` shared element transition
- About: parallax image + slide-from-left/right reveal
- Clients: CSS infinite-scroll marquee replacing static grid
- Contact: Zod-validated form with Turnstile widget, loading and error states
- Preloader component (wraps App, fades out on `onLoadedData`)
- Scroll progress indicator

### Phase 5: Performance and Polish

**Rationale:** Optimization work runs last because it measures and improves what is already working. Core Web Vitals measurement requires a complete visual implementation to be meaningful. The font loading strategy (CLS mitigation via `size-adjust`, preload hints) and video quality strategy (WebM alternatives, responsive quality) are measured against the finished design.

**Delivers:** A site that scores well on Lighthouse mobile performance, has measurable Core Web Vitals, and handles edge cases gracefully.

**Addresses:** Core Web Vitals (P3), accessibility deep audit (P3), font CLS mitigation (Pitfall 7), `.mov` file transcoding.

**Avoids:** Font metrics causing CLS on first visits (Pitfall 7), `.mov` files failing on Firefox/Android (integration gotcha).

**Tasks:**

- Lighthouse mobile audit; target LCP < 2.5s, CLS < 0.1, performance score > 70
- Add `size-adjust` and `ascent-override` to `@font-face` to minimize CLS during font swap
- Transcode two `.mov` video files (Gin Mare, NIU eScooters) to MP4/H.264
- Add WebM alternatives for all videos (`<source type="video/webm">` before MP4 fallback)
- Add `@axe-core/playwright` automated accessibility checks to E2E test suite
- `vite-plugin-image-optimizer` for build-time image optimization (og-image, poster images)
- Add CloudWatch SNS alarm for Lambda failures and SES errors

### Phase Ordering Rationale

- Infrastructure (Phase 1) before everything: SES verification has a 24hr blocking dependency that cannot be parallelized. CSP must be fixed before visual work to avoid testing under incorrect security conditions.
- Cleanup (Phase 2) before architecture work: The video system hooks and components built in Phase 3 should be built into the clean codebase, not around dead code. Moving packages and components during active architectural work creates debugging confusion.
- Architecture Foundation (Phase 3) before section redesign: The architecture research explicitly identifies a 5-step build order where video hooks and components must precede sections. Building sections before the video system leads to either coupled monoliths (current problem) or wasted rework.
- Visual Overhaul (Phase 4) before performance work: You cannot meaningfully optimize what does not yet exist in final form. Measuring LCP against an incomplete design produces irrelevant baselines.

### Research Flags

Phases likely needing deeper research during planning:

- **Phase 1 (Infrastructure):** Cloudflare Turnstile + Lambda integration has MEDIUM confidence in STACK.md — the pattern is clear but untested in this specific CDK/Lambda environment. Verify the siteverify API call pattern from Node.js Lambda before implementing. Also check current SES account production status early (it may already be verified).
- **Phase 3 (Architecture Foundation):** The `layoutId` shared element transition between VideoCard and VideoModal requires testing with the actual video poster images and CSS layout. Motion's `layoutId` can produce unexpected behavior with `overflow: hidden` and `border-radius` on the transitioning element — plan a spike for the modal transition before committing to it.
- **Phase 5 (Performance):** Network Information API for adaptive video quality has MEDIUM confidence (ARCHITECTURE.md notes limited browser support). Do not rely on it as the primary strategy; use it as enhancement only.

Phases with standard patterns (skip research-phase):

- **Phase 2 (Cleanup):** Incremental package removal with build verification is a well-documented pattern. The specific packages to remove and keep are identified with HIGH confidence in STACK.md.
- **Phase 4 (Visual Overhaul — most sections):** Motion variants, scroll reveals, and CSS marquee are all well-documented patterns with HIGH confidence sources. Hero text reveal with clip-path is a known pattern.

## Confidence Assessment

| Area         | Confidence | Notes                                                                                                                                                                                                                                  |
| ------------ | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Stack        | HIGH       | All version numbers verified via npm registry 2026-03-27. Fontsource, Zod, Motion APIs confirmed against official docs. Turnstile MEDIUM for Lambda-specific integration.                                                              |
| Features     | HIGH       | Based on Awwwards portfolio patterns and cinematographer portfolio analysis. Anti-features are well-supported by UX research. Feature prioritization aligns with PROJECT.md scope constraints.                                         |
| Architecture | HIGH       | Based on direct codebase analysis + official Motion/MDN/web.dev documentation. The 5-step build order is derived from actual component dependency graph. Video loading pipeline has explicit code examples from authoritative sources. |
| Pitfalls     | HIGH       | Based on direct code analysis of CONCERNS.md and all referenced source files. SES sandbox behavior documented by AWS. CSP pitfall is from direct observation of the production CSP string in the codebase.                             |

**Overall confidence:** HIGH

### Gaps to Address

- **SES production access status:** Unknown at research time. Check immediately (`aws sesv2 get-account`). If in sandbox, the 24hr review must be requested before Phase 1 work can complete. This is the highest-uncertainty scheduling risk.
- **Current CDN video file inventory:** Two `.mov` files are identified in `videos.ts` config (Gin Mare, NIU eScooters). The full resolution and bitrate of all 20 video files is unknown, which affects the video optimization strategy in Phase 5. Do a file audit against the CloudFront bucket during Phase 3.
- **Turnstile Lambda integration:** Documented with MEDIUM confidence. The Cloudflare siteverify API call from Node.js 22 Lambda is straightforward (single `fetch()` POST) but should be tested against a real Turnstile site key before wiring it into the production Lambda.
- **Design intent for section redesign:** The visual overhaul (Phase 4) is constrained by what the design spec specifies. The architecture provides the infrastructure; the visual design must drive the component compositions. This is not a research gap but a planning dependency — Phase 4 planning requires design decisions that are outside the scope of technical research.

## Sources

### Primary (HIGH confidence)

- npm registry (2026-03-27) — all version numbers for stack recommendations
- web.dev: Optimize WebFont Loading, Optimize LCP, Lazy Loading Video, Video and Source Tags, Fast Playback with Preload, prefers-reduced-motion
- motion.dev docs: React Quick Start, Scroll Animations, AnimatePresence, Layout Animations, useReducedMotion
- MDN: Intersection Observer API, Network Information API
- Chrome Developers: Autoplay Policy documentation
- AWS SES documentation: Sandbox mode limitations, production access requirements
- Direct codebase analysis: Portfolio.tsx, Hero.tsx, Contact.tsx, App.tsx, index.js, index.ts, amplify-hosting-stack.ts, contact-stack.ts, videos.ts, package.json, CONCERNS.md

### Secondary (MEDIUM confidence)

- Awwwards portfolio and video website pattern analysis — feature prioritization and cinematic portfolio conventions
- Autumn Durald Arkapaw portfolio (autumndurald.com) — single-site feature analysis
- Cloudflare Turnstile documentation — bot protection integration pattern (untested in this Lambda environment)
- web.dev: Adaptive Serving — Network Information API for connection-aware video quality (limited browser support)

### Tertiary (LOW confidence)

- Roger Deakins website (rogerdeakins.com) — atypical portfolio, primarily educational content
- One Page Love video portfolio collection — directory listing, not deep analysis
- Domain expertise from cinematographer portfolio ecosystem — training data, not verified against 2026 trends

---

_Research completed: 2026-03-27_
_Ready for roadmap: yes_
