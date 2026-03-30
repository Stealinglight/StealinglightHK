# stealinglight.hk

## What This Is

A cinematography portfolio website for stealinglight.hk — a single-page React app showcasing previous film and video work. The site serves as a living portfolio for a cinematographer no longer actively pursuing business, but who wants their work presented beautifully and to remain contactable for select opportunities. Built with React + Vite + Tailwind CSS v4, deployed on AWS Amplify with serverless infrastructure for the contact form.

## Core Value

Visitors experience the cinematography work in a contemporary, cinematic, artistically crafted presentation — and can easily reach out if interested.

## Requirements

### Validated

- ✓ Single-page app with section-based scroll navigation — existing
- ✓ Hero section with auto-playing background video — existing
- ✓ Portfolio section with video grid and hover-to-play previews — existing
- ✓ Video modal with playback controls (play/pause, mute, progress, fullscreen) — existing
- ✓ About / bio section — existing
- ✓ Services section — existing
- ✓ Clients section — existing
- ✓ Footer — existing
- ✓ AWS CDK infrastructure (Lambda, API Gateway, SES, CloudFront, Amplify) — existing
- ✓ CI/CD via GitHub Actions (E2E tests, security scan, infra deploy, Claude review) — existing
- ✓ SEO structured data (JSON-LD: Person, LocalBusiness, WebSite, FAQPage) — existing
- ✓ Motion scroll-triggered animations — existing
- ✓ Media CDN via CloudFront + S3 for video assets — existing
- ✓ Security headers (CSP, HSTS, X-Frame-Options, etc.) — existing, CSP fixed in Phase 1
- ✓ Google Analytics integration — existing, CSP unblocked in Phase 1
- ✓ Dual Lambda file resolved — index.js is sole source, index.ts deleted. Validated in Phase 1.
- ✓ CSP allows GA4, Google Fonts, CloudFront CDN — rebuilt as directive array. Validated in Phase 1.
- ✓ Favicon.svg and og-image.jpg — camera lens icon + cinematic still. Validated in Phase 1.
- ✓ React error boundary — SectionErrorBoundary wraps 7 sections individually. Validated in Phase 1.
- ✓ npm audit clean (high/critical) — CDK upgraded to 2.245. Validated in Phase 1.
- ✓ Unused UI components removed — 44 shadcn/ui files (5,119 lines) deleted, ui/ directory removed. Validated in Phase 2.
- ✓ Unused npm dependencies removed — production deps reduced from 50+ to 10. Validated in Phase 2.
- ✓ Package name fixed — renamed from @figma/my-make-file to stealinglight-hk. Validated in Phase 2.
- ✓ Stale pnpm overrides removed — pnpm, peerDependencies, peerDependenciesMeta blocks deleted. Validated in Phase 2.
- ✓ ESLint migrated to flat config — eslint.config.js, ESLINT_USE_FLAT_CONFIG flag removed, Lambda JS now linted. Validated in Phase 2.
- ✓ Video lazy loading — IntersectionObserver with 200px root margin, thumbnail-to-video swap for grid videos. Validated in Phase 2.
- ✓ Fonts self-hosted — Fontsource variable packages (Inter, Space Grotesk), Google Fonts CDN removed. Validated in Phase 2.
- ✓ CDN URL extracted to environment variable — VITE_CDN_BASE_URL with fallback. Validated in Phase 2.
- ✓ Dead application components removed — Reel.tsx, figma/ImageWithFallback.tsx deleted. Validated in Phase 2.

### Active

- [ ] Visual overhaul — contemporary, cinematic aesthetic with artistic flow and character
- [ ] Fix design inconsistencies across all sections
- [ ] Add honeypot or bot protection to contact form
- [ ] Add CloudWatch alarm notification target (SNS)
- [ ] E2E tests passing in CI
- [ ] Accessibility audit and fixes
- [ ] Performance optimization (Core Web Vitals)

### Out of Scope

- Multi-page routing or blog — single-page scroll site is the intended architecture
- User authentication — public portfolio site, no login needed
- CMS or content management — video config is code-managed, works for static content
- Credits/resume page — user explicitly excluded this
- Mobile native app — web-only
- CDK infrastructure rewrite — existing stacks are sound, just need fixes
- Migrating from dual package manager (bun/npm) — document the approach instead

## Context

- **Origin:** Site was scaffolded from a Figma Make template, partially built, and never fully finished
- **Media:** Video assets hosted on AWS S3, served via CloudFront CDN (`d2fc83sck42gx7.cloudfront.net`)
- **Contact form:** Lambda backend uses index.js as sole source (Phase 1 cleaned up divergent index.ts)
- **Tech debt:** Dual lockfiles (bun.lock + package-lock.json) remain; all other tech debt resolved in Phase 2
- **CSP:** Tightened in Phase 2 — Google Fonts domains removed, unsafe-inline kept for style-src (Motion requires it)
- **Assets:** favicon.svg (camera lens) and og-image.jpg (1200x630 cinematic still) in place (Phase 1)
- **Tests:** 13 Playwright E2E tests exist but contact form test can't hit API in CI

## Constraints

- **Tech stack**: React 19 + Vite 7 + Tailwind CSS 4 + TypeScript — keep existing stack
- **Infrastructure**: AWS (Amplify, Lambda, API Gateway, SES, CloudFront, S3) — keep existing CDK approach
- **Deployment**: AWS Amplify with GitHub integration — no changes needed
- **CI/CD**: GitHub Actions — existing workflows, fix and enhance
- **Package manager**: bun (local) + npm (CI) — dual approach stays for now
- **Design direction**: Contemporary, cinematic, artistic with flow and character
- **Content**: Three sections matter — work showcase, about/bio, contact form

## Key Decisions

| Decision                             | Rationale                                                  | Outcome   |
| ------------------------------------ | ---------------------------------------------------------- | --------- |
| Keep single-page scroll architecture | Matches portfolio use case, already built                  | — Pending |
| Remove unused shadcn/ui components   | 5,119 lines of dead code, not imported anywhere            | — Pending |
| Resolve Lambda to single source (JS) | TypeScript source was never deployed, has different logic  | ✓ Phase 1 |
| Production-grade finish              | User wants tests, perf, a11y, SEO — not just visual polish | — Pending |
| Contemporary cinematic aesthetic     | User's creative direction for the visual overhaul          | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):

1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):

1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---

_Last updated: 2026-03-30 after Phase 2 completion_
