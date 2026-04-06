# Phase 2: Cleanup & Architecture - Context

**Gathered:** 2026-03-30
**Status:** Ready for planning

<domain>
## Phase Boundary

Strip dead code (44 shadcn/ui files, ~20 unused npm packages, stale configs), build video lazy-loading architecture, self-host fonts via Fontsource, migrate ESLint to flat config, and extract CDN URL to environment variable. No visual redesign — this phase delivers the lean codebase and video infrastructure that Phase 3 consumes.

</domain>

<decisions>
## Implementation Decisions

### UI Component Retention

- **D-01:** Nuclear delete — remove ALL 44 shadcn/ui files from `src/app/components/ui/` including `utils.ts` and `use-mobile.ts`. Zero files remain in `ui/`. Phase 3 rebuilds from scratch only what it needs.
- **D-02:** Create standalone `src/lib/utils.ts` with the `cn()` function (clsx + tailwind-merge). This is the standard Tailwind class-merge utility and Phase 3 will need it.
- **D-03:** Remove all 26 Radix UI npm packages — they are only consumed by the deleted shadcn/ui files. Phase 3 re-adds only the specific Radix primitives it actually uses.

### Video Lazy-Loading

- **D-04:** Thumbnail image to video swap — show the CDN thumbnail JPG immediately for each grid video. When scrolled into view, mount the actual `<video>` element on top. Thumbnails already exist on the CDN for all 19 video projects.
- **D-05:** IntersectionObserver with 200px root margin — videos mount ~200px before entering the viewport. Good balance between preloading and resource conservation.
- **D-06:** Featured video always mounts eagerly — only the 18 grid videos are lazy-loaded. The featured video is prominent and near the top of the page; lazy-loading it risks visible pop-in.

### Font Self-Hosting

- **D-07:** Use Fontsource npm packages (`@fontsource/inter` and `@fontsource/space-grotesk`). Import in CSS/JS, Vite bundles WOFF2 files automatically. Remove Google Fonts `<link>` tag from `index.html`.
- **D-08:** Match current weight range: 300-700 for both fonts (light, regular, medium, semibold, bold). No visual change from font migration.
- **D-09:** Tighten CSP immediately after migration — remove `fonts.googleapis.com` and `fonts.gstatic.com` from CSP. Remove `'unsafe-inline'` from `style-src` (was only needed for Google Fonts CSS). **Caveat:** Researcher must verify whether Motion (framer-motion) injects inline styles that require `'unsafe-inline'` in `style-src`. If so, keep `'unsafe-inline'` for style-src with a comment noting the reason, and defer removal to Phase 4 nonce work. `'unsafe-inline'` in `script-src` stays regardless (needed for GA inline snippet until Phase 4).

### ESLint Migration

- **D-10:** Migrate from `.eslintrc.json` (legacy) to `eslint.config.js` (flat config). Remove the `ESLINT_USE_FLAT_CONFIG=false` flag from all scripts and CI workflows.
- **D-11:** Start linting Lambda JavaScript — add `infra/lambda/` to ESLint scope. The deployed Lambda (`index.js`) has never been linted; this phase fixes that.
- **D-12:** Keep `eslint-plugin-security` in the flat config — security rules are valuable, especially now that Lambda JS is linted.
- **D-13:** No new plugins — migrate the existing 4 plugins (typescript-eslint, react, react-hooks, security) to flat config format. Keep the scope minimal.

### Claude's Discretion

- IntersectionObserver implementation pattern (custom hook vs inline in Portfolio.tsx)
- Fontsource import method (CSS `@import` vs JS `import` in main.tsx)
- ESLint flat config exact structure and shared config patterns
- Order of operations for the dependency cleanup (remove files first, then packages, or vice versa)
- Whether `postcss.config.mjs` (currently empty) should be deleted as part of cleanup
- CDN URL environment variable naming and fallback behavior (PERF-04)
- Package name rename approach (CLEAN-03) and whether `bun.lock` needs regeneration after dependency changes

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Dead Code Inventory

- `.planning/codebase/CONCERNS.md` — Full issue list with specific file/line references for all tech debt items
- `.planning/codebase/STACK.md` — Complete dependency inventory showing which packages are unused

### UI Components (to delete)

- `src/app/components/ui/` — All 44 shadcn/ui files to remove (5,119 lines)
- `src/app/components/ui/utils.ts` — cn() utility to relocate to `src/lib/utils.ts`
- `src/app/components/Reel.tsx` — Dead application component (QUAL-03)
- `src/app/components/figma/ImageWithFallback.tsx` — Dead application component (QUAL-03)

### Dependencies (to clean)

- `package.json` — Root dependencies, package name (`@figma/my-make-file`), pnpm overrides block
- `src/app/App.tsx` — Verify no ui/ imports exist after deletion

### Video System

- `src/app/components/Portfolio.tsx` — Video grid rendering (add lazy loading)
- `src/app/config/videos.ts` — CDN base URL constant to extract to env var (PERF-04)
- `src/app/components/About.tsx` — Hardcoded CDN URL (line 17)
- `src/app/components/Hero.tsx` — Hero video (eagerly loaded, not lazy)

### Font Migration

- `index.html` — Google Fonts `<link>` tag to remove (lines 128-130)
- `src/styles/fonts.css` — Font family declarations to update for Fontsource
- `infra/lib/amplify-hosting-stack.ts` — CSP headers to tighten (remove Google Fonts domains)

### ESLint Migration

- `.eslintrc.json` — Current legacy config to migrate to `eslint.config.js`
- `package.json` scripts — `ESLINT_USE_FLAT_CONFIG=false` flag to remove
- `infra/lambda/contact/index.js` — Lambda JS to be linted for the first time
- `.github/workflows/test.yml` — May reference ESLint flag in CI

### Prior Phase Context

- `.planning/phases/01-infrastructure-safety-net/01-CONTEXT.md` — Phase 1 CSP decisions (D-04, D-05) that Phase 2 builds on

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `sonner` toast library already integrated in App.tsx — survives the dependency cleanup
- `motion` animation library actively used in all section components — survives cleanup
- `lucide-react` icons used in Navigation.tsx and Contact.tsx — survives cleanup
- `class-variance-authority`, `clsx`, `tailwind-merge` — keep these (used by cn() utility)
- CDN thumbnail JPGs exist for all 19 video projects — used for lazy-loading placeholders

### Established Patterns

- Section components use named exports with `<section id="...">` root elements
- Video metadata centralized in `src/app/config/videos.ts` with `CDN_BASE_URL` constant
- Motion `whileInView` pattern used across all sections for scroll animations
- Contact.tsx uses local `useState` for form state (not react-hook-form — that package is unused)

### Integration Points

- `src/lib/utils.ts` — new location for cn() utility, imported by any component that needs class merging
- `Portfolio.tsx` — IntersectionObserver added here wrapping the grid video items
- `index.html` — Google Fonts link removed, Fontsource handles font loading via Vite bundle
- `infra/lib/amplify-hosting-stack.ts` — CSP updated to remove Google Fonts domains
- `.env.example` — new `VITE_CDN_BASE_URL` variable documented here

</code_context>

<specifics>
## Specific Ideas

- The thumbnail-to-video swap should feel seamless — no jarring layout shift or flash of empty space
- After the nuclear UI cleanup, the `src/app/components/ui/` directory should not exist at all (delete the directory itself)
- The `figma/` subdirectory under components should also be removed (contains only the dead ImageWithFallback.tsx)
- CSP tightening should be verified post-deploy since local Vite dev server doesn't apply Amplify headers (noted in Phase 1 blockers)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

_Phase: 02-cleanup-architecture_
_Context gathered: 2026-03-30_
