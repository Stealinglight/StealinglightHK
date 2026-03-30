# Phase 1: Infrastructure & Safety Net - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-29
**Phase:** 01-infrastructure-safety-net
**Areas discussed:** Lambda resolution, Error boundary UX, Favicon + OG image

---

## Lambda Resolution

| Option                           | Description                                                                                                       | Selected |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------- | -------- |
| Keep JS, remove TS (Recommended) | index.js is deployed, tested, and has better sanitization. Delete index.ts to eliminate confusion.                | ✓        |
| Set up TS build pipeline         | Use esbuild to compile index.ts to index.js. More maintainable long-term but requires fixing the TS source first. |          |
| You decide                       | Claude picks the best approach based on the codebase                                                              |          |

**User's choice:** Keep JS, remove TS
**Notes:** Clean and simple approach. The JS file is the canonical deployed version with correct env vars, event format, and sanitization.

---

## Error Boundary UX

| Option                | Description                                                                               | Selected |
| --------------------- | ----------------------------------------------------------------------------------------- | -------- |
| Hide crashed section  | Silently remove the broken section — rest of site keeps working. Clean but hides issues.  | ✓        |
| Minimal error message | Show a subtle 'Something went wrong' in the section space. Honest without being alarming. |          |
| You decide            | Claude picks the best UX for a portfolio site                                             |          |

**User's choice:** Hide crashed section
**Notes:** For a portfolio site, visitors should never see error UI. Silent removal preserves the cinematic experience.

---

## Favicon

| Option                    | Description                                                                         | Selected |
| ------------------------- | ----------------------------------------------------------------------------------- | -------- |
| Stylized 'S' or 'SL' mark | Lettermark from 'stealinglight' in the site's amber accent color on dark background |          |
| Camera/lens icon          | Minimal cinematography-themed icon in the site's color palette                      | ✓        |
| Use existing logo         | If you have a stealinglight logo/mark, we'll adapt it for favicon                   |          |

**User's choice:** Camera/lens icon
**Notes:** Cinematography-themed icon in the site's color palette.

---

## OG Image

| Option                      | Description                                                             | Selected |
| --------------------------- | ----------------------------------------------------------------------- | -------- |
| Still from best work + name | A cinematic frame from your reel with 'stealinglight' overlaid          | ✓        |
| Typography-focused          | Clean dark background with 'stealinglight' in the site's type treatment |          |
| You decide                  | Claude creates something that fits the cinematic aesthetic              |          |

**User's choice:** Still from best work + name
**Notes:** Cinematic frame from the reel with name overlay. Standard 1200x630px dimensions.

---

## Claude's Discretion

- CSP directive exact syntax and formatting
- Error boundary implementation pattern
- favicon SVG design specifics
- npm audit fix strategy
- SES verification status check

## Deferred Ideas

None — discussion stayed within phase scope
