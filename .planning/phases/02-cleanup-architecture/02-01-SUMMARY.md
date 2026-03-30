---
phase: 02-cleanup-architecture
plan: 01
subsystem: cleanup
tags: [dead-code, dependencies, package-json, eslint, fontsource]

# Dependency graph
requires:
  - phase: 01-infrastructure-hardening
    provides: stable build and CI baseline
provides:
  - lean codebase with 48 dead UI files removed (5,369 lines deleted)
  - relocated cn() utility at src/lib/utils.ts
  - clean package.json with 10 production dependencies
  - fontsource font packages for self-hosting
  - new ESLint tooling (typescript-eslint, @eslint/js, globals) for flat config migration
  - lint scripts without ESLINT_USE_FLAT_CONFIG flag
affects: [02-02-eslint-flat-config, 02-03-font-self-hosting, 03-visual-overhaul]

# Tech tracking
tech-stack:
  added: ["@fontsource-variable/inter", "@fontsource-variable/space-grotesk", "typescript-eslint", "@eslint/js", "globals"]
  removed: ["@mui/*", "@radix-ui/*", "@emotion/*", "recharts", "cmdk", "vaul", "react-hook-form", "date-fns", "embla-carousel-react", "react-dnd", "react-slick", "react-responsive-masonry", "next-themes", "react-day-picker", "react-resizable-panels", "input-otp", "react-dnd-html5-backend", "@typescript-eslint/eslint-plugin", "@typescript-eslint/parser"]
  patterns: [utility-relocation-to-src-lib]

key-files:
  created: [src/lib/utils.ts]
  modified: [package.json, package-lock.json, bun.lock, vite.config.ts]
  deleted: [src/app/components/ui/ (48 files), src/app/components/Reel.tsx, src/app/components/figma/ImageWithFallback.tsx, postcss.config.mjs]

key-decisions:
  - "Downgraded @eslint/js from ^10.0.1 to ^9.39.2 to match eslint@^9.39.2 peer requirement"
  - "Kept class-variance-authority, clsx, tailwind-merge as production deps for cn() utility pattern"

patterns-established:
  - "Shared utilities live in src/lib/ (not src/app/components/ui/)"

requirements-completed: [CLEAN-01, CLEAN-02, CLEAN-03, QUAL-03]

# Metrics
duration: 8min
completed: 2026-03-30
---

# Phase 02 Plan 01: Dead Code and Dependency Cleanup Summary

**Removed 48 unused UI component files (5,369 lines), overhauled package.json from 50+ to 10 production deps, added Fontsource fonts and new ESLint tooling**

## Performance

- **Duration:** 8 min
- **Started:** 2026-03-30T23:05:35Z
- **Completed:** 2026-03-30T23:13:46Z
- **Tasks:** 2
- **Files modified:** 56 (53 deleted, 1 created, 3 modified)

## Accomplishments
- Deleted entire src/app/components/ui/ directory (48 files, 5,119 lines of dead shadcn/ui code)
- Deleted dead Reel.tsx and figma/ImageWithFallback.tsx components
- Relocated cn() utility to src/lib/utils.ts for continued use
- Renamed package from @figma/my-make-file to stealinglight-hk
- Removed 50+ unused npm packages (MUI, Radix UI, recharts, cmdk, vaul, etc.)
- Removed stale pnpm overrides, peerDependencies, and peerDependenciesMeta blocks
- Added @fontsource-variable/inter and @fontsource-variable/space-grotesk for font self-hosting
- Added typescript-eslint, @eslint/js, globals for ESLint flat config migration
- Removed ESLINT_USE_FLAT_CONFIG=false flag from lint scripts
- Deleted empty postcss.config.mjs and Figma template comment from vite.config.ts
- Regenerated both package-lock.json and bun.lock
- Build passes with 10 production dependencies

## Task Commits

Each task was committed atomically:

1. **Task 1: Delete dead files and relocate cn() utility** - `0c59415` (chore)
2. **Task 2: Package.json overhaul and lockfile regeneration** - `995b8c5` (chore)

**Plan metadata:** (pending final docs commit)

## Files Created/Modified
- `src/lib/utils.ts` - Relocated cn() class merging utility (clsx + tailwind-merge)
- `package.json` - Renamed, cleaned deps, added fonts/ESLint tooling, updated lint scripts
- `package-lock.json` - Regenerated for clean dependency tree
- `bun.lock` - Regenerated for clean dependency tree
- `vite.config.ts` - Removed Figma template comment
- `src/app/components/ui/` (48 files) - Deleted entire directory
- `src/app/components/Reel.tsx` - Deleted dead component
- `src/app/components/figma/ImageWithFallback.tsx` - Deleted dead component
- `postcss.config.mjs` - Deleted empty config (Tailwind v4 uses Vite plugin)

## Decisions Made
- Downgraded @eslint/js from ^10.0.1 (plan-specified) to ^9.39.2 to resolve peer dependency conflict with eslint@^9.39.2 -- @eslint/js@10.x requires eslint@^10.0.0
- Kept class-variance-authority, clsx, and tailwind-merge as production dependencies since cn() utility is actively used

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed @eslint/js version incompatibility**
- **Found during:** Task 2 (npm install)
- **Issue:** Plan specified @eslint/js@^10.0.1 which requires eslint@^10.0.0 as peer dependency, but project uses eslint@^9.39.2. npm install failed with ERESOLVE error.
- **Fix:** Changed @eslint/js version from ^10.0.1 to ^9.39.2 to match the eslint 9.x major version
- **Files modified:** package.json
- **Verification:** npm install succeeded, build passes
- **Committed in:** 995b8c5 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Version alignment necessary for npm install to succeed. @eslint/js@9.x provides the same flat config utilities needed for Plan 02-02. No scope creep.

## Issues Encountered
None beyond the deviation documented above.

## User Setup Required
None - no external service configuration required.

## Known Stubs
None - no stubs or placeholders introduced.

## Next Phase Readiness
- Codebase is lean with only actively-used dependencies
- Fontsource packages installed, ready for Plan 02-03 (font self-hosting)
- ESLint tooling packages installed, ready for Plan 02-02 (flat config migration)
- cn() utility relocated to src/lib/utils.ts, all future imports should reference this path

## Self-Check: PASSED

All created files verified to exist. All deleted directories/files verified absent. Both commit hashes (0c59415, 995b8c5) found in git log.

---
*Phase: 02-cleanup-architecture*
*Completed: 2026-03-30*
