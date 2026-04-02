---
phase: 02-cleanup-architecture
plan: 03
subsystem: ui, infra, tooling
tags: [intersection-observer, lazy-loading, eslint-flat-config, react, lambda, performance]
requirements_completed: [CLEAN-04, PERF-02]

# Dependency graph
requires:
  - phase: 02-01
    provides: Cleaned up unused components and dependencies, shared utilities in src/lib/
provides:
  - useInView hook for IntersectionObserver-based lazy rendering
  - ESLint flat config (eslint.config.js) replacing legacy .eslintrc.json
  - Lambda JavaScript linting (first time in project)
  - LazyVideo component for thumbnail-to-video swap
affects: [03-visual-overhaul, 04-production-hardening]

# Tech tracking
tech-stack:
  added: []
  patterns: [IntersectionObserver one-shot lazy rendering, ESLint flat config with multi-environment blocks]

key-files:
  created:
    - src/hooks/useInView.ts
    - eslint.config.js
  modified:
    - src/app/components/Portfolio.tsx
    - package.json
    - infra/lambda/contact/__tests__/index.test.js

key-decisions:
  - "One-shot IntersectionObserver pattern -- video stays mounted after entering view, never unmounts"
  - "200px rootMargin preloads videos slightly before entering viewport"
  - "ESLint flat config with separate blocks for TS/TSX, Lambda JS, Lambda tests, and config files"
  - "Lambda console.log allowed for structured CloudWatch logging"

patterns-established:
  - "useInView hook: reusable one-shot IntersectionObserver pattern in src/hooks/"
  - "ESLint flat config: multi-environment linting with file-scoped config blocks"

requirements-completed: [PERF-02, CLEAN-04]

# Metrics
duration: 8min
completed: 2026-03-30
---

# Phase 02 Plan 03: Lazy Loading + ESLint Migration Summary

**IntersectionObserver lazy video rendering for 18 grid videos and ESLint flat config migration with first-time Lambda JS linting**

## Performance

- **Duration:** 8 min
- **Started:** 2026-03-30T23:24:09Z
- **Completed:** 2026-03-30T23:32:23Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Grid videos now use thumbnail-to-video swap gated by IntersectionObserver (200px rootMargin), preventing 18 video elements from mounting on page load
- Featured video remains eagerly mounted (no lazy loading) as intended
- ESLint migrated from legacy .eslintrc.json to flat config eslint.config.js with TypeScript, React, React Hooks, and Security plugins
- Lambda JavaScript (index.js and test file) linted for the first time in the project -- zero errors, zero warnings
- Removed ESLINT_USE_FLAT_CONFIG=false flag from npm scripts (no longer needed with flat config)

## Task Commits

Each task was committed atomically:

1. **Task 1: Video lazy-loading with IntersectionObserver** - `b8aadcf` (feat)
2. **Task 2: ESLint flat config migration with Lambda linting** - `139d39e` (feat)

## Files Created/Modified
- `src/hooks/useInView.ts` - Reusable IntersectionObserver hook with one-shot pattern
- `src/app/components/Portfolio.tsx` - LazyVideo component for grid videos with thumbnail-to-video swap
- `eslint.config.js` - ESLint flat config with multi-environment blocks (TS/TSX, Lambda JS, Jest, config files)
- `package.json` - Removed ESLINT_USE_FLAT_CONFIG=false from lint scripts
- `infra/lambda/contact/__tests__/index.test.js` - Suppressed intentional no-constant-binary-expression in test

## Decisions Made
- One-shot IntersectionObserver pattern: once isInView is true, the observer disconnects and the video stays mounted permanently (no re-mounting on scroll)
- 200px rootMargin gives a preloading buffer so videos start mounting slightly before entering the viewport
- ESLint flat config uses separate blocks: TS/TSX files get React + React Hooks + browser globals; Lambda JS gets Node.js + CommonJS globals; Lambda tests get Jest globals; config files get Node.js + CommonJS
- Lambda console.log allowed (warn-level, not error) since it's used for structured CloudWatch logging
- Added .claude/ to ESLint ignores to prevent linting parallel agent worktree directories

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added .claude/ to ESLint ignores**
- **Found during:** Task 2 (ESLint flat config migration)
- **Issue:** ESLint was picking up `.claude/worktrees/` directories from parallel agent execution, causing formatter crash (RangeError: Invalid string length) due to thousands of errors in bundled JS files
- **Fix:** Added `.claude/` to the global ignores block in eslint.config.js
- **Files modified:** eslint.config.js
- **Verification:** `npx eslint . --max-warnings=0` passes clean
- **Committed in:** 139d39e (Task 2 commit)

**2. [Rule 3 - Blocking] Added infra/cdk.out/ and infra/node_modules/ to ESLint ignores**
- **Found during:** Task 2 (ESLint flat config migration)
- **Issue:** CDK build output under infra/cdk.out/ was being linted, generating hundreds of false errors on minified/bundled JS assets
- **Fix:** Added `infra/cdk.out/` and `infra/node_modules/` to global ignores
- **Files modified:** eslint.config.js
- **Verification:** `npx eslint infra/ --max-warnings=0` passes clean
- **Committed in:** 139d39e (Task 2 commit)

**3. [Rule 1 - Bug] Fixed no-constant-binary-expression in Lambda test**
- **Found during:** Task 2 (ESLint flat config migration)
- **Issue:** Lambda test file had `(undefined || '').split(',')` which ESLint flags as constant binary expression -- but it's intentional (testing the initialization pattern from the handler)
- **Fix:** Added eslint-disable-next-line comment with explanation
- **Files modified:** infra/lambda/contact/__tests__/index.test.js
- **Verification:** `npx eslint infra/lambda/contact/__tests__/index.test.js --max-warnings=0` passes clean
- **Committed in:** 139d39e (Task 2 commit)

**4. [Rule 3 - Blocking] Added Jest globals and config file handling to ESLint config**
- **Found during:** Task 2 (ESLint flat config migration)
- **Issue:** Lambda test files needed Jest globals (describe, it, expect, etc.) and infra/jest.config.js needed CommonJS support. Plan only specified Lambda source files.
- **Fix:** Added two additional config blocks: one for `infra/lambda/**/__tests__/**/*.js` with jest globals, one for `*.config.{js,mjs,cjs}` with Node.js globals and CommonJS
- **Files modified:** eslint.config.js
- **Verification:** `npx eslint infra/lambda/contact/__tests__/index.test.js --max-warnings=0` passes clean
- **Committed in:** 139d39e (Task 2 commit)

---

**Total deviations:** 4 auto-fixed (1 bug fix, 3 blocking issues)
**Impact on plan:** All auto-fixes necessary for ESLint to pass clean. No scope creep -- all fixes are directly within the ESLint migration scope.

## Issues Encountered
None beyond the auto-fixed deviations above.

## Known Stubs
None -- all functionality is fully wired.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Phase 02 (cleanup-architecture) is now complete with all 3 plans executed
- useInView hook available for any future lazy-loading needs (reusable pattern)
- ESLint flat config provides a modern foundation -- future plugins can be added as flat config blocks
- Ready for Phase 03 (visual-overhaul) with clean architecture, self-hosted fonts, and lazy video loading in place

## Self-Check: PASSED

- All created files verified on disk
- .eslintrc.json confirmed deleted
- Commit b8aadcf found (Task 1)
- Commit 139d39e found (Task 2)

---
*Phase: 02-cleanup-architecture*
*Completed: 2026-03-30*
