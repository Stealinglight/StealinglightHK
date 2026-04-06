# Phase 3: Visual Overhaul - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-30
**Phase:** 03-visual-overhaul
**Areas discussed:** Hero reveal style, Category filter UX, Branded preloader, Touch interaction

---

## Hero Reveal Style

| Option               | Description                                                                                                        | Selected |
| -------------------- | ------------------------------------------------------------------------------------------------------------------ | -------- |
| Refined stagger      | Keep current structure, upgrade easing to cubic-bezier(0.16, 1, 0.3, 1), add blur-to-sharp, tighten stagger timing | ✓        |
| Mask/clip reveal     | Text hidden behind clip-path masks that wipe away to reveal each line                                              |          |
| Split-text character | Each character animates individually with 0.02-0.04s per-char stagger                                              |          |

**User's choice:** Refined stagger (Recommended)
**Notes:** Chosen for being polished without being flashy. Preserves existing Hero structure while upgrading the cinematic quality of the animations.

---

## Category Filter UX

### Filter Control Presentation

| Option                  | Description                                                                            | Selected |
| ----------------------- | -------------------------------------------------------------------------------------- | -------- |
| Pill buttons            | Horizontal row of pill-shaped buttons, active gets amber fill, mobile scrollable strip | ✓        |
| Underline tabs          | Text-only labels with amber underline on active tab, editorial aesthetic               |          |
| Dropdown (mobile-first) | Desktop shows pills, mobile collapses to dropdown select                               |          |

**User's choice:** Pill buttons (Recommended)
**Notes:** Simple, common in portfolio sites, works well on mobile as horizontally scrollable strip.

### Grid Animation

| Option         | Description                                                                              | Selected |
| -------------- | ---------------------------------------------------------------------------------------- | -------- |
| Layout animate | Filtered-out cards fade/scale, remaining reflow via Motion layout animation, ~0.4s total | ✓        |
| Crossfade swap | Entire grid fades out 0.15s, items swap, fades back in 0.2s                              |          |
| Instant swap   | No animation, items swap immediately                                                     |          |

**User's choice:** Layout animate (Recommended)
**Notes:** Fluid and modern feel. Motion layoutId handles position shifts between filter states.

---

## Branded Preloader

### Preloader Style

| Option          | Description                                                                     | Selected |
| --------------- | ------------------------------------------------------------------------------- | -------- |
| Logo pulse      | STEALINGLIGHT text centered on black, amber pulse animation, amber progress bar | ✓        |
| Cinematic bars  | Two horizontal letterbox bars that slide apart to reveal hero                   |          |
| Minimal spinner | Small amber circular spinner centered on poster image                           |          |

**User's choice:** Logo pulse (Recommended)
**Notes:** Sets cinematic tone from first load. Includes amber progress bar and 0.8s minimum display time.

### Preloader Scope

| Option    | Description                                                          | Selected |
| --------- | -------------------------------------------------------------------- | -------- |
| Full-page | Covers entire viewport including navigation, true "opening sequence" | ✓        |
| Hero-only | Only covers hero section, nav visible immediately                    |          |

**User's choice:** Full-page (Recommended)
**Notes:** Creates a cinematic opening moment. Navigation appears after preloader dismisses.

---

## Touch Interaction

| Option             | Description                                                                          | Selected |
| ------------------ | ------------------------------------------------------------------------------------ | -------- |
| Tap-to-preview     | First tap plays preview in-place with "tap to watch" overlay, second tap opens modal | ✓        |
| Direct to modal    | Single tap opens modal immediately, skip preview on touch                            |          |
| Long-press preview | Short tap opens modal, long-press (500ms+) plays preview in-place                    |          |

**User's choice:** Tap-to-preview (Recommended)
**Notes:** Detection via CSS @media (hover: hover). Hover-capable devices get existing behavior, touch-only devices get the two-tap flow.

---

## Claude's Discretion

- Scroll animation coordination (VISL-02) — parallax depths, stagger timing for non-hero sections
- Client logo marquee (VISL-03) — direction, speed, pause-on-hover, duplication
- Video modal keyboard navigation (VIDO-04) — Escape, arrow keys, spacebar handlers
- Scroll progress indicator (QUAL-01) — thin amber bar positioning
- Typography/spacing consistency (VISL-04) — audit and fix inconsistencies

## Deferred Ideas

None — discussion stayed within phase scope
