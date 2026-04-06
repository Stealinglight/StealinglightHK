---
phase: 01-infrastructure-safety-net
plan: 01
subsystem: infra
tags: [lambda, csp, security-headers, google-analytics, google-fonts, cloudfront, aws-cdk]
requirements_completed: [INFRA-01, INFRA-02]

# Dependency graph
requires: []
provides:
  - Clean Lambda contact directory with single source of truth (index.js)
  - Updated CSP header allowing GA4, Google Fonts, and CloudFront CDN
affects: [01-02, deploy-infra, amplify-hosting]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "CSP as programmatic array of directives joined with semicolons (not raw string)"

key-files:
  created: []
  modified:
    - infra/lambda/contact/package.json
    - infra/lib/amplify-hosting-stack.ts

key-decisions:
  - "Keep index.js as canonical Lambda source -- index.ts was never deployed and had incompatible implementations"
  - "Build CSP as array of directives for readability and maintenance"
  - "unsafe-inline temporary for script-src and style-src -- Phase 2 self-hosts fonts, Phase 4 explores nonces"

patterns-established:
  - "CSP construction: array of directive strings joined with '; ' for maintainability"

requirements-completed: [INFRA-01, INFRA-02]

# Metrics
duration: 3min
completed: 2026-03-30
---

# Phase 01 Plan 01: Lambda Cleanup and CSP Fix Summary

**Resolved dual Lambda file divergence and fixed CSP to unblock Google Analytics, Google Fonts, and CloudFront CDN in production**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-30T05:28:18Z
- **Completed:** 2026-03-30T05:31:15Z
- **Tasks:** 2/2
- **Files modified:** 4 (2 deleted, 1 rewritten, 1 edited)

## Accomplishments
- Eliminated dual Lambda source divergence by deleting index.ts (wrong env vars, wrong API Gateway format, weaker sanitization) and stale bun.lock
- Cleaned Lambda package.json of all TypeScript tooling (esbuild, typescript, @types/aws-lambda, build script)
- Updated CSP from hardcoded raw string to programmatic array-based construction with all required external domains
- All 44 Lambda unit tests pass, CDK synth produces valid CloudFormation template

## Task Commits

Each task was committed atomically:

1. **Task 1: Lambda cleanup -- delete divergent files and clean package.json** - `f3c89ee` (fix)
2. **Task 2: Fix CSP to allow Google Analytics, Google Fonts, and CloudFront CDN** - `579dd1d` (fix)

## Files Created/Modified
- `infra/lambda/contact/index.ts` - Deleted (divergent TypeScript source, never deployed)
- `infra/lambda/contact/bun.lock` - Deleted (stale lockfile)
- `infra/lambda/contact/package.json` - Removed scripts, devDependencies (esbuild, typescript, @types/aws-lambda)
- `infra/lib/amplify-hosting-stack.ts` - Replaced hardcoded CSP with programmatic array adding GA4, Google Fonts, CloudFront domains

## Decisions Made
- Kept index.js as canonical Lambda source since index.ts was never compiled or deployed and had incompatible implementations (FROM_EMAIL/TO_EMAIL vs CONTACT_EMAIL, event.requestContext.http.method vs event.httpMethod)
- Built CSP as array of directive strings joined with '; ' for readability and maintenance
- Added 'unsafe-inline' to script-src (needed for GA inline snippet) and style-src (for Google Fonts) as temporary measure -- Phase 2 self-hosts fonts, Phase 4 can explore nonces

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Node modules not installed in worktree -- ran `npm install` in infra/ directory to enable test execution (not a code change, just local dev setup)

## User Setup Required
None - no external service configuration required.

## Known Stubs
None - no stubs or placeholders introduced.

## Next Phase Readiness
- Lambda directory is clean and ready for any future contact form work
- CSP changes will take effect on next Amplify deploy (triggered by merge to main or manual deploy-infra workflow)
- CSP is invisible in local dev (Vite dev server does not apply Amplify custom headers) -- must verify post-deploy

## Self-Check: PASSED

All artifacts verified:
- SUMMARY.md exists
- amplify-hosting-stack.ts exists with CSP changes
- package.json exists without TS tooling
- index.ts confirmed deleted
- bun.lock confirmed deleted
- Commit f3c89ee found
- Commit 579dd1d found

---
*Phase: 01-infrastructure-safety-net*
*Completed: 2026-03-30*
