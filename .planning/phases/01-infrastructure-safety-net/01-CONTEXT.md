# Phase 1: Infrastructure & Safety Net - Context

**Gathered:** 2026-03-29
**Status:** Ready for planning

<domain>
## Phase Boundary

Fix broken systems and add error isolation so development can proceed safely. This phase resolves the contact form, CSP, missing assets, error boundary, and npm vulnerabilities. No visual changes, no new features — just making what exists work correctly and safely.

</domain>

<decisions>
## Implementation Decisions

### Lambda Resolution

- **D-01:** Keep `index.js` (the deployed, tested, properly-sanitized file) and delete `index.ts` entirely. The TS file was never compiled or deployed, has different env vars (`FROM_EMAIL`/`TO_EMAIL` vs `CONTACT_EMAIL`), uses wrong API Gateway event format (`event.requestContext.http.method` vs `event.httpMethod`), and has weaker sanitization. Single source of truth going forward is `index.js`.
- **D-02:** Also remove `infra/lambda/contact/bun.lock` (stale lockfile in Lambda directory).
- **D-03:** Update Lambda unit tests if they reference any TS-specific behavior. Tests currently import `index.js` which is correct.

### CSP Fix

- **D-04:** Update Content-Security-Policy in `infra/lib/amplify-hosting-stack.ts` to allow Google Analytics (`googletagmanager.com`, `google-analytics.com`), Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`), and CloudFront CDN (`d2fc83sck42gx7.cloudfront.net`). Note: Google Fonts will be self-hosted in Phase 2 (PERF-01), but CSP must allow them now since they're currently loaded.
- **D-05:** Include `'unsafe-inline'` for script-src (required for GA inline snippet) and style-src (required for Google Fonts CSS). This is a temporary allowance — Phase 2 self-hosting will tighten CSP.

### Error Boundary

- **D-06:** Implement React error boundary that silently hides crashed sections. Visitors should never see error UI on a portfolio site — the rest of the page continues working. Log errors to console for debugging.
- **D-07:** Wrap each major section component individually (Hero, Portfolio, Clients, About, Services, Contact, Footer) so a single section failure doesn't take down the whole page.

### Missing Assets

- **D-08:** Favicon: Camera/lens icon in the site's color palette (amber accent on dark background), saved as `public/favicon.svg`.
- **D-09:** OG Image: Cinematic still from the best work with "stealinglight" text overlaid, saved as `public/og-image.jpg`. Dimensions: 1200x630px (standard OG image size).

### npm Vulnerabilities

- **D-10:** Run `npm audit fix` in both root and `infra/` directories. If CDK needs upgrading to resolve transitive vulns, upgrade `aws-cdk-lib` and CDK CLI to match.

### Claude's Discretion

- CSP directive exact syntax and formatting
- Error boundary component implementation pattern (class component vs library)
- favicon SVG design details (exact lens icon style)
- npm audit fix order and any necessary package upgrades
- Whether to verify SES production access status as part of contact form fix

</decisions>

<canonical_refs>

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Contact Form Lambda

- `infra/lambda/contact/index.js` — The canonical Lambda source (keep this, delete index.ts)
- `infra/lambda/contact/__tests__/index.test.js` — Existing unit tests for the Lambda
- `infra/lib/contact-stack.ts` — CDK stack defining Lambda, API Gateway, SES, CloudWatch alarms

### CSP and Security Headers

- `infra/lib/amplify-hosting-stack.ts` — Contains CSP and all security headers in customHeaders YAML (line ~95)
- `index.html` — Contains Google Analytics script (lines 5-11) and Google Fonts link (lines 128-130)

### Error Boundary

- `src/app/App.tsx` — Root component where error boundaries wrap sections
- `src/app/components/` — All section components (Hero, Portfolio, Clients, About, Services, Contact, Footer)

### Infrastructure

- `infra/package.json` — Contains npm overrides for fast-xml-parser and minimatch
- `.planning/codebase/CONCERNS.md` — Full list of known issues with specific file/line references
- `.planning/research/PITFALLS.md` — Phase-specific pitfalls and prevention strategies

</canonical_refs>

<code_context>

## Existing Code Insights

### Reusable Assets

- `sonner` toast notifications already integrated in App.tsx — can be used for contact form success/error feedback
- CloudWatch alarms already defined in contact-stack.ts (lines 88-129) — just missing notification targets (Phase 4)
- `TagComplianceAspect` in `infra/lib/aspects/` — ensures all new AWS resources get tagged

### Established Patterns

- CDK stacks use typed Props interfaces with cross-stack references (e.g., `contactStack.apiUrl`)
- Lambda uses `getCorsHeaders()` function for CORS — this pattern should be preserved
- Contact form uses `useState<FormData>` for local state — simple and appropriate

### Integration Points

- Error boundary wraps sections in `App.tsx` — between existing `<Navigation>` and `<Footer>`
- CSP changes deploy via CDK `amplify-hosting-stack.ts` — triggers via `deploy-infra.yml` GitHub Action
- favicon.svg and og-image.jpg go in `public/` — served directly by Amplify CDN

</code_context>

<specifics>
## Specific Ideas

- Favicon should be a minimal camera/lens icon that reads well at 16x16 and 32x32 sizes
- OG image should use a cinematic frame from the owner's best work — check `src/app/config/videos.ts` for the featured/hero video thumbnail as a candidate
- Error boundary should be completely invisible to visitors — no "oops" messages, no retry buttons, just graceful disappearance

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

_Phase: 01-infrastructure-safety-net_
_Context gathered: 2026-03-29_
