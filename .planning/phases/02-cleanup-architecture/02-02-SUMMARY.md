---
phase: 02-cleanup-architecture
plan: 02
subsystem: infra, ui
tags: [fontsource, self-hosted-fonts, csp, environment-variables, cloudfront, vite]
requirements_completed: [PERF-01, PERF-04]

# Dependency graph
requires:
  - phase: 01-critical-fixes
    provides: CSP directive array foundation, security headers in Amplify hosting stack
  - phase: 02-01
    provides: cleaned codebase with unused components and dependencies removed
provides:
  - Self-hosted Inter and Space Grotesk fonts via Fontsource variable packages
  - Tightened CSP with no external font CDN domains
  - Configurable CDN_BASE_URL via VITE_CDN_BASE_URL environment variable
  - .env.example documenting all VITE_ environment variables
affects: [amplify-deploy, media-stack, visual-overhaul]

# Tech tracking
tech-stack:
  added: ["@fontsource-variable/inter", "@fontsource-variable/space-grotesk"]
  patterns: ["Environment variable with hardcoded fallback for CDN URLs", "Self-hosted fonts via JS import for Vite bundling"]

key-files:
  created: []
  modified:
    - src/main.tsx
    - src/styles/fonts.css
    - index.html
    - infra/lib/amplify-hosting-stack.ts
    - src/app/config/videos.ts
    - src/app/components/About.tsx
    - .env.example

key-decisions:
  - "Fontsource variable packages imported via JS side-effect imports in main.tsx (not CSS @import) for Vite tree-shaking"
  - "Font-family names use Variable suffix (Inter Variable, Space Grotesk Variable) matching Fontsource registration"
  - "CSP unsafe-inline kept for style-src (Motion/framer-motion applies element.style) with Phase 4 nonce deferral documented"
  - "CDN_BASE_URL reads from import.meta.env.VITE_CDN_BASE_URL with hardcoded fallback for backward compatibility"

patterns-established:
  - "Environment variable pattern: import.meta.env.VITE_* with hardcoded fallback for local dev"
  - "Self-hosted fonts: Fontsource packages imported in main.tsx, font-family declared in fonts.css"

requirements-completed: [PERF-01, PERF-04]

# Metrics
duration: 4min
completed: 2026-03-30
---

# Phase 02 Plan 02: Font Self-Hosting and CDN Configuration Summary

**Self-hosted Inter and Space Grotesk via Fontsource eliminating Google Fonts CDN, tightened CSP, and extracted CloudFront CDN URL to configurable environment variable**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-30T23:16:34Z
- **Completed:** 2026-03-30T23:20:44Z
- **Tasks:** 2
- **Files modified:** 8 (including package.json, package-lock.json)

## Accomplishments
- Replaced Google Fonts CDN dependency with locally bundled Fontsource variable font packages (WOFF2 files in Vite output)
- Tightened CSP by removing fonts.googleapis.com and fonts.gstatic.com domains, with explanatory comments for remaining unsafe-inline
- Extracted hardcoded CloudFront CDN URL to VITE_CDN_BASE_URL environment variable with fallback in videos.ts and About.tsx
- Enriched CSP in Amplify hosting stack to include GA4 and Google Tag Manager domains matching the Phase 1 directive array intent

## Task Commits

Each task was committed atomically:

1. **Task 1: Self-host fonts via Fontsource variable packages** - `015e120` (feat)
2. **Task 2: Tighten CSP and extract CDN URL to environment variable** - `38e0544` (feat)

## Files Created/Modified
- `src/main.tsx` - Added Fontsource variable font side-effect imports
- `src/styles/fonts.css` - Updated font-family to Variable suffix names, updated comment
- `index.html` - Removed Google Fonts preconnect and stylesheet links
- `infra/lib/amplify-hosting-stack.ts` - Tightened CSP, added VITE_CDN_BASE_URL env var, added CSP comments
- `src/app/config/videos.ts` - CDN_BASE_URL reads from VITE_CDN_BASE_URL with hardcoded fallback
- `src/app/components/About.tsx` - Imports CDN_BASE_URL from config instead of hardcoding URL
- `.env.example` - Documents both VITE_CONTACT_API_URL and VITE_CDN_BASE_URL
- `package.json` - Added @fontsource-variable/inter and @fontsource-variable/space-grotesk
- `package-lock.json` - Updated lockfile with new dependencies

## Decisions Made
- Used Fontsource variable packages (not static weight packages) to cover the full weight range (300-700) with a single import per font
- Font imports via JS side-effect imports in main.tsx rather than CSS @import for better Vite tree-shaking
- Kept CSP `unsafe-inline` in style-src with documented comment about Motion/framer-motion element.style usage and Phase 4 nonce deferral
- Enriched inline CSP in customHeaders YAML to include GA4/GTM domains that were in the Phase 1 directive array but missing from the YAML CSP string

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] CSP in customHeaders YAML was missing GA4/GTM domains**
- **Found during:** Task 2 (CSP tightening)
- **Issue:** The CSP string in the customHeaders YAML block was a simplified version that lacked the GA4/GTM domains (googletagmanager.com, google-analytics.com, analytics.google.com) that were defined in Phase 1's directive array format
- **Fix:** Added the missing GA4/GTM domains to script-src, img-src, and connect-src directives in the CSP string
- **Files modified:** infra/lib/amplify-hosting-stack.ts
- **Verification:** grep confirmed all domains present, build passes
- **Committed in:** 38e0544 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Necessary for correctness -- the CSP would have blocked Google Analytics in production without the missing domains.

## Issues Encountered
None

## Known Stubs
None - all data sources are wired and functional.

## User Setup Required
None - no external service configuration required. VITE_CDN_BASE_URL has a hardcoded fallback so existing deployments work without configuration changes.

## Next Phase Readiness
- Fonts are self-hosted and CSP is tightened -- ready for visual overhaul phases
- CDN URL is configurable -- infrastructure changes to CloudFront distribution won't require code edits
- Phase 02 Plan 03 (remaining cleanup/architecture work) can proceed

## Self-Check: PASSED

All 8 files verified present. Both task commits (015e120, 38e0544) verified in git log.

---
*Phase: 02-cleanup-architecture*
*Completed: 2026-03-30*
