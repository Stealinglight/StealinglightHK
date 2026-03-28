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
- ✓ Security headers (CSP, HSTS, X-Frame-Options, etc.) — existing (needs fixes)
- ✓ Google Analytics integration — existing (blocked by CSP)

### Active

- [ ] Fix contact form end-to-end (resolve dual Lambda files, ensure form submits and emails arrive)
- [ ] Visual overhaul — contemporary, cinematic aesthetic with artistic flow and character
- [ ] Fix design inconsistencies across all sections
- [ ] Remove unused UI components (44 shadcn/ui files, 5,119 lines of dead code)
- [ ] Remove unused npm dependencies (~20+ packages not imported in app)
- [ ] Fix CSP blocking Google Analytics and Google Fonts
- [ ] Add missing favicon.svg and og-image.jpg
- [ ] Fix package name (currently `@figma/my-make-file`)
- [ ] Remove stale pnpm overrides
- [ ] Resolve dual Lambda file issue (index.ts vs index.js divergence)
- [ ] Migrate ESLint from legacy config to flat config (ESLint 9+)
- [ ] Fix npm audit vulnerabilities (root + infra)
- [ ] Add React error boundary
- [ ] Improve video loading performance (lazy rendering, mobile optimization)
- [ ] Self-host fonts or optimize font loading (currently render-blocking)
- [ ] Move hardcoded CDN URL to environment variable
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
- **Contact form:** Lambda backend exists and is deployed, but the TypeScript source diverges from the deployed JavaScript — different env vars, different API Gateway event formats, different sanitization
- **Tech debt:** 44 unused shadcn/ui components (5,119 lines), 20+ unused npm packages, dual lockfiles, stale overrides
- **CSP issue:** Security headers block Google Analytics and Google Fonts in production
- **Missing assets:** No favicon.svg or og-image.jpg
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
| Resolve Lambda to single source (JS) | TypeScript source was never deployed, has different logic  | — Pending |
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

_Last updated: 2026-03-27 after initialization_
