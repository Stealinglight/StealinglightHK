# Phase 2: Cleanup & Architecture - Research

**Researched:** 2026-03-29
**Domain:** Dependency cleanup, video lazy-loading, font self-hosting, ESLint migration
**Confidence:** HIGH

## Summary

Phase 2 is a lean-out phase: delete 44 unused shadcn/ui files, remove ~50 unused npm packages (26 Radix, 4 MUI/Emotion, plus assorted dead libraries), build an IntersectionObserver-based video lazy-loading system, self-host fonts via Fontsource variable font packages, migrate ESLint from legacy `.eslintrc.json` to flat config `eslint.config.js`, and extract the hardcoded CDN URL to an environment variable.

All sub-tasks are well-understood with established ecosystem solutions. The nuclear UI deletion is straightforward -- verified that zero active application components import from `src/app/components/ui/`. The Fontsource variable font packages (`@fontsource-variable/inter`, `@fontsource-variable/space-grotesk`) provide the exact weight ranges needed in a single WOFF2 file per font. The ESLint flat config migration is fully supported by all four plugins currently in use (typescript-eslint, react, react-hooks, security). The video lazy-loading uses standard IntersectionObserver API -- no library needed.

**Primary recommendation:** Execute in dependency order -- delete dead files first, then remove packages, then add new features (fonts, lazy-loading, ESLint), then tighten CSP last.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Nuclear delete -- remove ALL 44 shadcn/ui files from `src/app/components/ui/` including `utils.ts` and `use-mobile.ts`. Zero files remain in `ui/`. Phase 3 rebuilds from scratch only what it needs.
- **D-02:** Create standalone `src/lib/utils.ts` with the `cn()` function (clsx + tailwind-merge). This is the standard Tailwind class-merge utility and Phase 3 will need it.
- **D-03:** Remove all 26 Radix UI npm packages -- they are only consumed by the deleted shadcn/ui files. Phase 3 re-adds only the specific Radix primitives it actually uses.
- **D-04:** Thumbnail image to video swap -- show the CDN thumbnail JPG immediately for each grid video. When scrolled into view, mount the actual `<video>` element on top. Thumbnails already exist on the CDN for all 19 video projects.
- **D-05:** IntersectionObserver with 200px root margin -- videos mount ~200px before entering the viewport. Good balance between preloading and resource conservation.
- **D-06:** Featured video always mounts eagerly -- only the 18 grid videos are lazy-loaded. The featured video is prominent and near the top of the page; lazy-loading it risks visible pop-in.
- **D-07:** Use Fontsource npm packages (`@fontsource/inter` and `@fontsource/space-grotesk`). Import in CSS/JS, Vite bundles WOFF2 files automatically. Remove Google Fonts `<link>` tag from `index.html`.
- **D-08:** Match current weight range: 300-700 for both fonts (light, regular, medium, semibold, bold). No visual change from font migration.
- **D-09:** Tighten CSP immediately after migration -- remove `fonts.googleapis.com` and `fonts.gstatic.com` from CSP. Remove `'unsafe-inline'` from `style-src` (was only needed for Google Fonts CSS). **Caveat:** Researcher must verify whether Motion (framer-motion) injects inline styles that require `'unsafe-inline'` in `style-src`. If so, keep `'unsafe-inline'` for style-src with a comment noting the reason, and defer removal to Phase 4 nonce work. `'unsafe-inline'` in `script-src` stays regardless (needed for GA inline snippet until Phase 4).
- **D-10:** Migrate from `.eslintrc.json` (legacy) to `eslint.config.js` (flat config). Remove the `ESLINT_USE_FLAT_CONFIG=false` flag from all scripts and CI workflows.
- **D-11:** Start linting Lambda JavaScript -- add `infra/lambda/` to ESLint scope. The deployed Lambda (`index.js`) has never been linted; this phase fixes that.
- **D-12:** Keep `eslint-plugin-security` in the flat config -- security rules are valuable, especially now that Lambda JS is linted.
- **D-13:** No new plugins -- migrate the existing 4 plugins (typescript-eslint, react, react-hooks, security) to flat config format. Keep the scope minimal.

### Claude's Discretion

- IntersectionObserver implementation pattern (custom hook vs inline in Portfolio.tsx)
- Fontsource import method (CSS `@import` vs JS `import` in main.tsx)
- ESLint flat config exact structure and shared config patterns
- Order of operations for the dependency cleanup (remove files first, then packages, or vice versa)
- Whether `postcss.config.mjs` (currently empty) should be deleted as part of cleanup
- CDN URL environment variable naming and fallback behavior (PERF-04)
- Package name rename approach (CLEAN-03) and whether `bun.lock` needs regeneration after dependency changes

### Deferred Ideas (OUT OF SCOPE)

None -- discussion stayed within phase scope

</user_constraints>

<phase_requirements>

## Phase Requirements

| ID       | Description                                                                                                       | Research Support                                                                                         |
| -------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| CLEAN-01 | All 44 unused shadcn/ui component files removed from src/app/components/ui/                                       | Verified zero imports from ui/ in active code. Nuclear delete is safe. See "Dead Code Deletion" pattern. |
| CLEAN-02 | All unused npm packages removed from package.json (MUI, Radix, drag-drop, charts, date pickers, etc.)             | Full inventory of surviving vs removable packages documented. Target: 10-12 production deps.             |
| CLEAN-03 | Package name updated from @figma/my-make-file to stealinglight-hk, stale pnpm overrides removed                   | Simple package.json edits. pnpm overrides block confirmed stale (pins vite 6.3.5, project uses 7.3.1).   |
| CLEAN-04 | ESLint migrated from legacy .eslintrc.json to flat config (eslint.config.js), ESLINT_USE_FLAT_CONFIG flag removed | All 4 plugins verified to support flat config. Migration pattern documented.                             |
| PERF-01  | Fonts self-hosted via Fontsource (Inter, Space Grotesk) -- no render-blocking Google Fonts CDN dependency         | Fontsource variable font packages verified. Import pattern documented.                                   |
| PERF-02  | Off-screen video elements lazy-rendered via IntersectionObserver instead of all 19 mounted simultaneously         | IntersectionObserver pattern documented with custom hook approach.                                       |
| PERF-04  | CloudFront CDN base URL sourced from VITE_CDN_BASE_URL environment variable instead of hardcoded                  | Pattern follows existing VITE_CONTACT_API_URL approach. Both videos.ts and About.tsx need update.        |
| QUAL-03  | Unused application components removed (Reel.tsx, ImageWithFallback.tsx) and dead code cleaned up                  | Both files confirmed dead (zero imports). figma/ directory also dead.                                    |

</phase_requirements>

## Project Constraints (from CLAUDE.md)

- **Tech stack**: React 19 + Vite 7 + Tailwind CSS 4 + TypeScript -- no changes
- **Package manager**: bun (local) + npm (CI) -- dual lockfiles stay
- **Commit format**: Conventional commits, lowercase subject, max 72 chars
- **Pre-commit**: Husky runs lint-staged (eslint fix for ts/tsx, prettier for json/md/css)
- **ESLint**: Currently `.eslintrc.json` with `ESLINT_USE_FLAT_CONFIG=false` -- migrating to flat config
- **Naming**: PascalCase components, camelCase functions, `SCREAMING_SNAKE_CASE` constants
- **Path alias**: `@/*` maps to `./src/*`
- **Code style**: Prettier (semicolons, single quotes, 2 spaces, 100 char width, LF)
- **CSS**: `cinematic-*` prefix for project colors, `cn()` utility for class merging

## Standard Stack

### Core (Surviving Dependencies -- Post-Cleanup)

| Package                    | Version | Purpose                        | Status                                                                 |
| -------------------------- | ------- | ------------------------------ | ---------------------------------------------------------------------- |
| `motion`                   | 12.29.2 | Scroll animations, transitions | KEEP -- used in all section components                                 |
| `lucide-react`             | 0.563.0 | Icon library                   | KEEP -- used in Navigation, Contact, Portfolio, Hero, Services, Footer |
| `sonner`                   | 2.0.7   | Toast notifications            | KEEP -- used in App.tsx and Contact.tsx                                |
| `class-variance-authority` | 0.7.1   | Variant-based styling          | KEEP -- used by cn() utility, Phase 3 will need it                     |
| `clsx`                     | 2.1.1   | Conditional className builder  | KEEP -- dependency of cn() utility                                     |
| `tailwind-merge`           | 3.4.0   | Tailwind class deduplication   | KEEP -- dependency of cn() utility                                     |
| `tw-animate-css`           | 1.4.0   | Tailwind animation utilities   | KEEP -- imported in tailwind.css                                       |
| `react-error-boundary`     | 6.1.1   | Error boundary wrapper         | KEEP -- used in SectionErrorBoundary.tsx (added in Phase 1)            |

### New Dependencies (This Phase)

| Package                              | Version | Purpose                                                | Why                                                                                |
| ------------------------------------ | ------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| `@fontsource-variable/inter`         | 5.2.8   | Self-hosted Inter variable font (wght 100-900)         | Replaces Google Fonts CDN link. Single WOFF2 file covers all weights.              |
| `@fontsource-variable/space-grotesk` | 5.2.10  | Self-hosted Space Grotesk variable font (wght 300-700) | Replaces Google Fonts CDN link. Single WOFF2 file covers all weights.              |
| `typescript-eslint`                  | 8.58.0  | Unified typescript-eslint flat config package          | Replaces separate `@typescript-eslint/eslint-plugin` + `@typescript-eslint/parser` |
| `@eslint/js`                         | 10.0.1  | ESLint recommended rules for flat config               | Required for `js.configs.recommended` in flat config                               |
| `globals`                            | 17.4.0  | Global variable definitions for ESLint                 | Replaces `env: { browser: true }` in flat config                                   |

### Packages to REMOVE (50+ packages)

**MUI/Emotion (4 packages):**
`@emotion/react`, `@emotion/styled`, `@mui/icons-material`, `@mui/material`

**Radix UI (26 packages):**
All `@radix-ui/react-*` packages: accordion, alert-dialog, aspect-ratio, avatar, checkbox, collapsible, context-menu, dialog, dropdown-menu, hover-card, label, menubar, navigation-menu, popover, progress, radio-group, scroll-area, select, separator, slider, slot, switch, tabs, toggle, toggle-group, tooltip

**Unused libraries (14 packages):**
`cmdk`, `date-fns`, `embla-carousel-react`, `input-otp`, `next-themes`, `react-day-picker`, `react-dnd`, `react-dnd-html5-backend`, `react-hook-form`, `react-resizable-panels`, `react-responsive-masonry`, `react-slick`, `recharts`, `vaul`

**Dev dependencies to REMOVE:**
`@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser` (replaced by unified `typescript-eslint`)

**Config blocks to REMOVE:**

- `pnpm.overrides` block in package.json (pins vite 6.3.5 but project uses 7.3.1 -- stale and ineffective)
- `peerDependencies` and `peerDependenciesMeta` blocks (Figma template artifact -- not a published package)

### Post-Cleanup Dependency Count

**Production dependencies (target: 10):**

1. `@fontsource-variable/inter`
2. `@fontsource-variable/space-grotesk`
3. `class-variance-authority`
4. `clsx`
5. `lucide-react`
6. `motion`
7. `react-error-boundary`
8. `sonner`
9. `tailwind-merge`
10. `tw-animate-css`

This hits the target of 10-15 production dependencies (down from 70+ listed by `npm ls --depth=0 --prod`).

**Installation:**

```bash
# Remove all dead packages (run after file deletion)
npm uninstall @emotion/react @emotion/styled @mui/icons-material @mui/material \
  @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-aspect-ratio \
  @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-collapsible \
  @radix-ui/react-context-menu @radix-ui/react-dialog @radix-ui/react-dropdown-menu \
  @radix-ui/react-hover-card @radix-ui/react-label @radix-ui/react-menubar \
  @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-progress \
  @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select \
  @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-slot \
  @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toggle \
  @radix-ui/react-toggle-group @radix-ui/react-tooltip \
  cmdk date-fns embla-carousel-react input-otp next-themes \
  react-day-picker react-dnd react-dnd-html5-backend react-hook-form \
  react-resizable-panels react-responsive-masonry react-slick recharts vaul

# Add new packages
npm install @fontsource-variable/inter @fontsource-variable/space-grotesk
npm install -D typescript-eslint @eslint/js globals

# Remove old typescript-eslint packages
npm uninstall @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

## Architecture Patterns

### Pattern 1: Dead Code Deletion (CLEAN-01, CLEAN-02, QUAL-03)

**What:** Remove all files and packages in one sweep, then verify build succeeds.
**When to use:** When dead code has already been verified as unimported.
**Order of operations (recommended):**

1. Delete all 44 files in `src/app/components/ui/` and the directory itself
2. Delete `src/app/components/Reel.tsx`
3. Delete `src/app/components/figma/` directory (contains only `ImageWithFallback.tsx`)
4. Create `src/lib/utils.ts` with the `cn()` function (relocated from ui/utils.ts)
5. Remove all unused npm packages from package.json
6. Remove stale config blocks (pnpm overrides, peerDependencies, peerDependenciesMeta)
7. Rename package from `@figma/my-make-file` to `stealinglight-hk`
8. Run `npm install` to regenerate lockfile, then `bun install` to sync bun.lock
9. Run `npm run build` to verify zero build errors

**Why delete files before packages:** If you remove packages first, TypeScript/Vite will report import errors in the ui/ files you're about to delete anyway. Delete files first for a clean package removal.

### Pattern 2: Video Lazy-Loading with IntersectionObserver (PERF-02)

**What:** Custom hook `useInView` wrapping IntersectionObserver, used in Portfolio.tsx to conditionally mount `<video>` elements for grid videos.
**When to use:** For the 18 grid video items (not the featured video, per D-06).

**Recommended approach -- custom hook:**

```typescript
// src/hooks/useInView.ts
import { useState, useEffect, useRef } from 'react';

export function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.unobserve(element); // Once visible, stop observing
      }
    }, options);

    observer.observe(element);
    return () => observer.disconnect();
  }, [options]);

  return { ref, isInView };
}
```

**Usage in Portfolio.tsx grid item:**

```typescript
function LazyVideo({ project }: { project: typeof gridVideos[number] }) {
  const { ref, isInView } = useInView({ rootMargin: '200px' });

  return (
    <div ref={ref} className="relative aspect-video">
      <img
        src={project.posterUrl}
        alt={project.title}
        className="w-full h-full object-cover"
      />
      {isInView && (
        <video
          src={project.videoUrl}
          poster={project.posterUrl}
          muted
          loop
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
    </div>
  );
}
```

**Why custom hook over inline:** Separating the IntersectionObserver logic into a hook keeps Portfolio.tsx focused on rendering. The hook is reusable if needed elsewhere.

**Why not a library:** IntersectionObserver is a standard browser API. The hook is ~20 lines. Adding `react-intersection-observer` (13KB) for this would be counter to the cleanup philosophy.

### Pattern 3: Fontsource Variable Font Self-Hosting (PERF-01)

**What:** Replace Google Fonts CDN `<link>` with locally bundled variable font files.
**Approach:** JS import in `src/main.tsx` (recommended over CSS @import for Vite tree-shaking).

**Import in main.tsx:**

```typescript
import '@fontsource-variable/inter';
import '@fontsource-variable/space-grotesk';
```

**Update src/styles/fonts.css:**

```css
:root {
  --font-display: 'Space Grotesk Variable', system-ui, sans-serif;
  --font-body: 'Inter Variable', system-ui, sans-serif;
}

body {
  font-family: var(--font-body);
}

h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: var(--font-display);
}
```

**Remove from index.html:**

```html
<!-- DELETE these 3 lines -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap"
  rel="stylesheet"
/>
```

**Why variable fonts:** A single WOFF2 file per font covers the entire weight range (100-900 for Inter, 300-700 for Space Grotesk). This is smaller than loading multiple static weight files and provides smooth weight transitions if ever needed.

**Font family name difference:** Fontsource variable packages use `"Inter Variable"` and `"Space Grotesk Variable"` as the font-family name (not plain `"Inter"` / `"Space Grotesk"`). This is important -- the CSS must use the Variable suffix.

### Pattern 4: ESLint Flat Config Migration (CLEAN-04)

**What:** Migrate from `.eslintrc.json` to `eslint.config.js` flat config format.

**New eslint.config.js structure:**

```javascript
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import security from 'eslint-plugin-security';
import globals from 'globals';

export default [
  // Global ignores
  {
    ignores: ['dist/', 'build/', 'node_modules/', 'cdk.out/', 'infra/'],
  },

  // Base recommended configs
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // React config for TSX files
  {
    files: ['**/*.{ts,tsx}'],
    ...react.configs.flat.recommended,
    ...react.configs.flat['jsx-runtime'],
    languageOptions: {
      ...react.configs.flat.recommended.languageOptions,
      globals: {
        ...globals.browser,
        ...globals.es2022,
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },

  // React hooks
  reactHooks.configs.flat.recommended,

  // Security plugin for all files
  security.configs.recommended,

  // Lambda JavaScript files (D-11: lint Lambda for the first time)
  {
    files: ['infra/lambda/**/*.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.es2022,
      },
      sourceType: 'commonjs',
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error', 'log'] }],
    },
  },
];
```

**Package changes for ESLint migration:**

- REMOVE: `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`
- ADD: `typescript-eslint` (unified package), `@eslint/js`, `globals`
- KEEP: `eslint`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-security`

**Script changes in package.json:**

```json
{
  "lint": "eslint .",
  "lint:fix": "eslint --fix --max-warnings=0"
}
```

(Remove `ESLINT_USE_FLAT_CONFIG=false` prefix)

**lint-staged update:** The lint-staged config in package.json references `npm run lint:fix` which will automatically use the new flat config once the flag is removed.

**File cleanup:** Delete `.eslintrc.json` after creating `eslint.config.js`.

**Lambda linting scope (D-11):** The current `.eslintrc.json` ignores all `*.js` files. The flat config adds a specific block for `infra/lambda/**/*.js` with node globals and CommonJS source type. The Lambda uses `require()` and `exports.handler`, which need CommonJS configuration. The `no-console` rule allows `console.log` for Lambda (structured logging pattern).

### Pattern 5: CDN URL Environment Variable (PERF-04)

**What:** Extract hardcoded CDN URL to `VITE_CDN_BASE_URL` environment variable.
**Files to update:** `src/app/config/videos.ts`, `src/app/components/About.tsx`

**In videos.ts:**

```typescript
export const CDN_BASE_URL =
  import.meta.env.VITE_CDN_BASE_URL || 'https://d2fc83sck42gx7.cloudfront.net';
```

**In About.tsx:**

```typescript
import { CDN_BASE_URL } from '../config/videos';
// ...
<img src={`${CDN_BASE_URL}/images/chris-mcmillon-profile.jpg`} ... />
```

**In .env.example:**

```env
# Contact Form API endpoint (set after CDK deployment)
VITE_CONTACT_API_URL=https://your-api-id.execute-api.us-west-2.amazonaws.com/contact

# CloudFront CDN base URL for media assets
VITE_CDN_BASE_URL=https://d2fc83sck42gx7.cloudfront.net
```

**In Amplify hosting stack (infra/lib/amplify-hosting-stack.ts):**
Add `VITE_CDN_BASE_URL` to the `environmentVariables` array alongside `VITE_CONTACT_API_URL`.

**Fallback strategy:** Keep the hardcoded URL as fallback (`|| 'https://d2fc83sck42gx7.cloudfront.net'`) so the site works without the env var being set. This matches the pattern used by `VITE_CONTACT_API_URL` in Contact.tsx.

### Pattern 6: CSP Tightening (D-09)

**What:** Remove Google Fonts domains from CSP after self-hosting fonts.

**CSP changes in amplify-hosting-stack.ts:**

```typescript
const cspDirectives = [
  "default-src 'self'",
  // 'unsafe-inline' in script-src: required for GA inline snippet (until Phase 4 nonce work)
  "script-src 'self' 'unsafe-inline' https://*.googletagmanager.com",
  // 'unsafe-inline' in style-src: required because Motion (framer-motion) applies animations
  // via inline style attributes (element.style). Confirmed: Motion closed CSP issue as wontfix
  // (GitHub #1727). Nonce support added in v11.0.9 via <MotionConfig> but does not cover
  // all animation props (initial/animate still inject inline styles). Defer removal to Phase 4.
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https: https://*.google-analytics.com https://*.googletagmanager.com",
  "font-src 'self' data:",
  "media-src 'self' https://*.cloudfront.net",
  "connect-src 'self' https://*.execute-api.us-west-2.amazonaws.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  'upgrade-insecure-requests',
];
```

**Key changes from current CSP:**

- `style-src`: Removed `https://fonts.googleapis.com`. KEPT `'unsafe-inline'` because Motion injects inline styles via `element.style` for animations. This is confirmed behavior (GitHub issue #1727, closed as wontfix). Nonce support exists since v11.0.9 via `<MotionConfig nonce>` but does not fully cover `initial`/`animate` props. Defer `'unsafe-inline'` removal to Phase 4.
- `font-src`: Removed `https://fonts.gstatic.com`. Fonts are now self-hosted and served from `'self'`.

### Anti-Patterns to Avoid

- **Removing packages before files:** TypeScript compiler will report errors on imports in files you're about to delete. Delete dead files first.
- **Using static Fontsource packages instead of variable:** Would require 5+ separate weight files per font. Variable fonts are a single file each and support any weight in the range.
- **Creating a full IntersectionObserver provider/context:** Overkill for this use case. A simple hook per grid item is sufficient.
- **Using `eslint-config-*` wrapper packages:** These add indirection. Import plugins directly in flat config.
- **Trying to remove `'unsafe-inline'` from style-src now:** Motion requires it. Attempting to remove it will break all scroll animations.

## Don't Hand-Roll

| Problem                 | Don't Build                                     | Use Instead                                | Why                                                                                          |
| ----------------------- | ----------------------------------------------- | ------------------------------------------ | -------------------------------------------------------------------------------------------- |
| Font self-hosting       | Manual WOFF2 download + @font-face declarations | `@fontsource-variable/*` packages          | Handles subsetting, format negotiation, CSS declarations, and Vite integration automatically |
| ESLint config migration | Manual rule-by-rule translation                 | Plugin `.configs.flat.recommended` presets | Plugins export ready-made flat config objects -- use them directly                           |
| Class merging utility   | Custom className concatenation                  | `clsx` + `tailwind-merge` via `cn()`       | Handles Tailwind class conflicts, conditional classes, and edge cases                        |

## Common Pitfalls

### Pitfall 1: Fontsource Variable Font Family Names

**What goes wrong:** After switching to Fontsource variable fonts, all text falls back to system fonts.
**Why it happens:** Fontsource variable packages register the font as `"Inter Variable"` and `"Space Grotesk Variable"` (with "Variable" suffix), not `"Inter"` / `"Space Grotesk"`.
**How to avoid:** Update all CSS `font-family` declarations to use the Variable suffix. Check `src/styles/fonts.css` and any inline font-family references in the theme.
**Warning signs:** Text appearing in system-ui font after the change.

### Pitfall 2: bun.lock Drift After Mass Package Changes

**What goes wrong:** Local development works (using bun) but CI fails (using npm) because lockfiles diverge.
**Why it happens:** Removing 50+ packages and adding new ones requires both lockfiles to be regenerated.
**How to avoid:** After all package.json changes, run `npm install` to update `package-lock.json`, then `bun install` to update `bun.lock`. Commit both lockfiles.
**Warning signs:** CI failing with dependency resolution errors.

### Pitfall 3: ESLint Flat Config Lambda Scope

**What goes wrong:** Lambda linting fails because ESLint applies TypeScript rules to `.js` files or doesn't recognize `require()` / `exports`.
**Why it happens:** The flat config applies TS rules globally. Lambda uses CommonJS (`require`/`exports`).
**How to avoid:** Use a separate config block for `infra/lambda/**/*.js` with `sourceType: 'commonjs'` and `globals.node`. Ensure this block does NOT extend typescript-eslint rules.
**Warning signs:** ESLint errors about `require is not defined` or unexpected `exports`.

### Pitfall 4: Motion Inline Styles and CSP

**What goes wrong:** After removing `'unsafe-inline'` from `style-src`, all Motion animations break.
**Why it happens:** Motion applies animations by directly setting `element.style` properties. With strict CSP, these inline styles are blocked.
**How to avoid:** Per D-09, keep `'unsafe-inline'` in `style-src` with a clear comment explaining why. Defer removal to Phase 4 nonce work.
**Warning signs:** Animation elements appearing but not animating, CSP violation errors in browser console.

### Pitfall 5: postcss.config.mjs Deletion Breaking Vite

**What goes wrong:** Deleting the empty `postcss.config.mjs` causes Vite to look for PostCSS config elsewhere or apply different defaults.
**Why it happens:** Vite detects PostCSS config files. An empty config is different from no config.
**How to avoid:** Test the build after deleting `postcss.config.mjs`. Tailwind v4 via `@tailwindcss/vite` plugin handles PostCSS internally and does not need this file. However, if any tool in the chain looks for PostCSS config, deletion could cause issues. The safe approach: delete it, run `npm run build`, and if it fails, restore it.
**Warning signs:** Build errors mentioning PostCSS, or Tailwind classes not being processed.

### Pitfall 6: Vite Config Comment About "Make"

**What goes wrong:** The comment in `vite.config.ts` ("The React and Tailwind plugins are both required for Make") is a Figma template artifact and may confuse future developers.
**Why it happens:** The project was scaffolded from a Figma Make template.
**How to avoid:** Update the comment to accurately describe why the plugins are needed, or remove it entirely since both plugins are obviously required.

## Code Examples

### Verified: Fontsource Variable Font Import

```typescript
// Source: https://fontsource.org/docs/getting-started/variable
// In src/main.tsx
import '@fontsource-variable/inter';
import '@fontsource-variable/space-grotesk';
```

### Verified: ESLint Flat Config Plugin Exports

```javascript
// All confirmed working via local node_modules inspection:
import security from 'eslint-plugin-security';
security.configs.recommended; // Flat config object with { name, plugins, rules }

import react from 'eslint-plugin-react';
react.configs.flat.recommended; // Flat config object
react.configs.flat['jsx-runtime']; // For React 17+ JSX transform

import reactHooks from 'eslint-plugin-react-hooks';
reactHooks.configs.flat.recommended; // Flat config object
```

### Verified: IntersectionObserver Browser Support

IntersectionObserver is supported in all modern browsers (Chrome 51+, Firefox 55+, Safari 12.1+, Edge 15+). No polyfill needed for this project's browser targets (ES2022).

## State of the Art

| Old Approach                                                              | Current Approach                                | When Changed                | Impact                                                                         |
| ------------------------------------------------------------------------- | ----------------------------------------------- | --------------------------- | ------------------------------------------------------------------------------ |
| `.eslintrc.json` (legacy)                                                 | `eslint.config.js` (flat config)                | ESLint 9.0 (2024)           | Flat config is default; legacy support will be removed in ESLint 10            |
| Separate `@typescript-eslint/eslint-plugin` + `@typescript-eslint/parser` | Unified `typescript-eslint` package             | typescript-eslint v8 (2024) | Single import with `tseslint.configs.recommended`                              |
| Google Fonts CDN `<link>`                                                 | Self-hosted via Fontsource packages             | Ongoing industry trend      | Eliminates render-blocking third-party request, improves privacy, tightens CSP |
| `@fontsource/[font]` static packages                                      | `@fontsource-variable/[font]` variable packages | Fontsource v5 (2023)        | Single file per font covering all weights, smaller total size                  |

**Deprecated/outdated:**

- `ESLINT_USE_FLAT_CONFIG=false`: Compatibility flag that masks using legacy config with ESLint 9+. Will be removed when ESLint 10 drops legacy support.
- `plugin:security/recommended-legacy`: The old eslintrc config name. Use `security.configs.recommended` (flat config object) instead.

## Open Questions

1. **postcss.config.mjs deletion safety**
   - What we know: The file is empty (exports `{}`). Tailwind v4 uses `@tailwindcss/vite` plugin which handles PostCSS internally.
   - What's unclear: Whether any part of the Vite/Tailwind pipeline checks for this file's existence.
   - Recommendation: Delete it as part of cleanup, verify build succeeds. Restore if needed. LOW risk.

2. **ESLint flat config and lint-staged interaction**
   - What we know: lint-staged runs `npm run lint:fix` which calls `eslint --fix --max-warnings=0`. After migration, this will use the new flat config automatically.
   - What's unclear: Whether the `--max-warnings=0` flag might cause pre-commit failures on the Lambda JS files that have never been linted before.
   - Recommendation: Run ESLint on `infra/lambda/contact/index.js` manually during migration and fix all warnings before enabling the hook. Lambda linting should be additive, not breaking.

3. **Lambda linting -- existing violations**
   - What we know: `infra/lambda/contact/index.js` has never been linted. It uses `console.log` and `console.error`, has potential security plugin flags (regex in email validation), and uses CommonJS.
   - What's unclear: Exact number and severity of lint violations.
   - Recommendation: Run lint on Lambda file before committing the flat config. Fix violations in the same commit/plan to avoid a broken lint state.

## Sources

### Primary (HIGH confidence)

- Local `node_modules` inspection -- verified plugin config exports for all 4 ESLint plugins
- `package.json` and `npm ls --depth=0 --prod` -- verified current dependency tree (70+ packages)
- Source code grep -- verified zero imports from ui/ directory in active components
- Fontsource official docs (https://fontsource.org/docs/getting-started/variable) -- variable font import pattern
- ESLint official migration guide (https://eslint.org/docs/latest/use/configure/migration-guide) -- flat config migration
- typescript-eslint docs (https://typescript-eslint.io/getting-started/) -- flat config setup
- GitHub Motion issue #1727 -- confirmed Motion requires `unsafe-inline` for style-src (closed as wontfix)

### Secondary (MEDIUM confidence)

- eslint-plugin-react README (https://github.com/jsx-eslint/eslint-plugin-react) -- flat config `configs.flat.recommended` pattern
- eslint-plugin-react-hooks README (https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks) -- `configs.flat.recommended` pattern
- eslint-plugin-security README (https://github.com/eslint-community/eslint-plugin-security) -- `configs.recommended` (already flat config object)

### Tertiary (LOW confidence)

- None -- all findings verified against primary or secondary sources

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH -- all packages verified via npm registry and local inspection
- Architecture patterns: HIGH -- all patterns use standard browser/library APIs verified in docs
- Pitfalls: HIGH -- Motion/CSP issue verified via GitHub issue; font naming verified in Fontsource docs
- ESLint migration: HIGH -- all plugin flat config exports verified locally

**Research date:** 2026-03-29
**Valid until:** 2026-04-29 (stable domain, 30-day validity)
