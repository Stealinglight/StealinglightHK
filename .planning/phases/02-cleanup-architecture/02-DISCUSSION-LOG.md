# Phase 2: Cleanup & Architecture - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-30
**Phase:** 02-cleanup-architecture
**Areas discussed:** UI component retention, Video lazy-loading placeholders, Font self-hosting method, ESLint migration scope

---

## UI Component Retention

### Q1: How aggressively should we strip the ui/ directory?

| Option                         | Description                                                                                   | Selected |
| ------------------------------ | --------------------------------------------------------------------------------------------- | -------- |
| Nuclear — delete everything    | Remove all 44 files including utils.ts and use-mobile.ts. Phase 3 re-adds only what it needs. | ✓        |
| Keep utilities only            | Delete components but keep utils.ts and use-mobile.ts.                                        |          |
| Keep a curated set for Phase 3 | Keep utils.ts, use-mobile.ts, button.tsx, dialog.tsx, card.tsx. Delete 39 files.              |          |

**User's choice:** Nuclear — delete everything
**Notes:** Clean slate preferred. Phase 3 rebuilds from zero.

### Q2: Where should cn() live after the ui/ directory is deleted?

| Option                      | Description                                                    | Selected |
| --------------------------- | -------------------------------------------------------------- | -------- |
| Standalone src/lib/utils.ts | Standard location. Phase 3 will need it. One file, one export. | ✓        |
| Inline at call sites        | Write clsx() + twMerge() directly if only 1-2 sites.           |          |
| You decide                  | Claude picks based on call site count.                         |          |

**User's choice:** Standalone src/lib/utils.ts
**Notes:** None.

### Q3: Remove all 26 Radix UI packages?

| Option                         | Description                                                | Selected |
| ------------------------------ | ---------------------------------------------------------- | -------- |
| Yes, remove all Radix packages | Clean break. 26 fewer deps. Phase 3 re-adds what it needs. | ✓        |
| Keep Radix packages            | Leave installed for Phase 3. Avoids churn.                 |          |

**User's choice:** Yes, remove all Radix packages
**Notes:** None.

---

## Video Lazy-Loading Placeholders

### Q1: What should show before a video element lazy-renders?

| Option                            | Description                                                              | Selected |
| --------------------------------- | ------------------------------------------------------------------------ | -------- |
| Thumbnail image → video swap      | Show CDN thumbnail JPG immediately. Mount video when scrolled into view. | ✓        |
| Skeleton placeholder → video swap | Dark animated skeleton rectangle. Modern feel but no content preview.    |          |
| Empty space → video mount         | Reserve space but show nothing. Simplest but empty grid.                 |          |
| You decide                        | Claude picks best approach.                                              |          |

**User's choice:** Thumbnail image → video swap
**Notes:** Thumbnails already exist on CDN.

### Q2: IntersectionObserver root margin?

| Option                    | Description                                               | Selected |
| ------------------------- | --------------------------------------------------------- | -------- |
| 200px root margin         | Videos mount ~200px before viewport. Good balance.        | ✓        |
| One viewport height ahead | More aggressive preloading. Smoother on slow connections. |          |
| You decide                | Claude picks based on testing.                            |          |

**User's choice:** 200px root margin
**Notes:** None.

### Q3: Should featured video be lazy-loaded?

| Option                       | Description                                             | Selected |
| ---------------------------- | ------------------------------------------------------- | -------- |
| Always mount featured video  | Prominent, near top of page. Lazy-loading risks pop-in. | ✓        |
| Lazy-load everything equally | Same logic for all 19 videos. Simpler code.             |          |

**User's choice:** Always mount featured video
**Notes:** Only the 18 grid videos are lazy-loaded.

---

## Font Self-Hosting Method

### Q1: How should we self-host Inter and Space Grotesk?

| Option                  | Description                                                                          | Selected |
| ----------------------- | ------------------------------------------------------------------------------------ | -------- |
| Fontsource npm packages | Install @fontsource/inter and @fontsource/space-grotesk. Vite bundles automatically. | ✓        |
| Manual WOFF2 download   | Download WOFF2 files, place in src/assets/fonts/, manual @font-face.                 |          |
| You decide              | Claude picks.                                                                        |          |

**User's choice:** Fontsource npm packages
**Notes:** None.

### Q2: Which font weights to include?

| Option                          | Description                                   | Selected |
| ------------------------------- | --------------------------------------------- | -------- |
| Match current: 300-700 for both | Same as Google Fonts today. No visual change. | ✓        |
| Minimal: 400 + 700 only         | Smaller bundle. May need CSS adjustments.     |          |
| You decide based on usage       | Claude audits actual usage.                   |          |

**User's choice:** Match current: 300-700 for both
**Notes:** None.

### Q3: Tighten CSP after font migration?

| Option                       | Description                                                   | Selected |
| ---------------------------- | ------------------------------------------------------------- | -------- |
| Yes, tighten CSP immediately | Remove Google Fonts domains and unsafe-inline from style-src. | ✓        |
| Keep CSP loose until Phase 4 | Leave as no-ops. Full CSP audit in Phase 4.                   |          |
| You decide                   | Claude decides based on safety.                               |          |

**User's choice:** Yes, tighten CSP immediately
**Notes:** Caveat — verify whether Motion needs unsafe-inline for style-src.

---

## ESLint Migration Scope

### Q1: Should Lambda JS be linted?

| Option               | Description                                                  | Selected |
| -------------------- | ------------------------------------------------------------ | -------- |
| Yes, lint Lambda JS  | Add infra/lambda/ to scope. Catches bugs in production code. | ✓        |
| Keep Lambda excluded | Stable and tested. Less churn.                               |          |
| You decide           | Claude decides based on churn assessment.                    |          |

**User's choice:** Yes, lint Lambda JS
**Notes:** None.

### Q2: Keep eslint-plugin-security?

| Option               | Description                                        | Selected |
| -------------------- | -------------------------------------------------- | -------- |
| Keep security plugin | Valuable rules, especially with Lambda now linted. | ✓        |
| Drop security plugin | Fewer noisy warnings.                              |          |
| You decide           | Claude decides on compatibility.                   |          |

**User's choice:** Keep security plugin
**Notes:** None.

### Q3: Add any new ESLint plugins?

| Option                                | Description                                   | Selected |
| ------------------------------------- | --------------------------------------------- | -------- |
| No new plugins — migrate existing set | Same 4 plugins in flat config. Minimal scope. | ✓        |
| Add eslint-plugin-jsx-a11y            | Early a11y feedback before Phase 4.           |          |
| You decide                            | Claude decides.                               |          |

**User's choice:** No new plugins — migrate existing set
**Notes:** None.

---

## Claude's Discretion

- IntersectionObserver implementation pattern (custom hook vs inline)
- Fontsource import method (CSS vs JS)
- ESLint flat config exact structure
- Dependency cleanup ordering
- CDN URL env var naming and fallback behavior
- Package name rename and lockfile regeneration

## Deferred Ideas

None — discussion stayed within phase scope
