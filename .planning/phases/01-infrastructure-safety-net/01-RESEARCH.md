# Phase 1: Infrastructure & Safety Net - Research

**Researched:** 2026-03-30
**Domain:** AWS infrastructure fixes (Lambda/SES/CSP), React error boundaries, asset creation, npm vulnerability remediation
**Confidence:** HIGH

## Summary

Phase 1 addresses five distinct infrastructure problems that must be resolved before any visual or functional work begins: a broken contact form (dual Lambda files, unverified SES), a CSP that blocks Google Analytics and Google Fonts, missing favicon and og-image assets, no React error boundary, and npm audit vulnerabilities. All five are well-understood, have clear solutions, and require no experimental approaches.

The most important sequencing insight is that the SES verification status must be checked first because if the account is in sandbox mode, AWS production access review takes up to 24 hours. The CSP fix requires careful syntax since Amplify custom headers are YAML-embedded strings and CSP violations are invisible in local dev (Vite dev server does not apply Amplify headers). The error boundary should use the `react-error-boundary` library (v6.1.1) rather than hand-rolling a class component, and should render nothing on failure (invisible to visitors on a portfolio site).

**Primary recommendation:** Start with SES verification check and Lambda cleanup (delete index.ts), then CSP fix, then error boundary, then assets, then npm audit -- ordered by blocking risk.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Keep `index.js` (the deployed, tested, properly-sanitized file) and delete `index.ts` entirely. The TS file was never compiled or deployed, has different env vars (`FROM_EMAIL`/`TO_EMAIL` vs `CONTACT_EMAIL`), uses wrong API Gateway event format (`event.requestContext.http.method` vs `event.httpMethod`), and has weaker sanitization. Single source of truth going forward is `index.js`.
- **D-02:** Also remove `infra/lambda/contact/bun.lock` (stale lockfile in Lambda directory).
- **D-03:** Update Lambda unit tests if they reference any TS-specific behavior. Tests currently import `index.js` which is correct.
- **D-04:** Update Content-Security-Policy in `infra/lib/amplify-hosting-stack.ts` to allow Google Analytics (`googletagmanager.com`, `google-analytics.com`), Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`), and CloudFront CDN (`d2fc83sck42gx7.cloudfront.net`). Note: Google Fonts will be self-hosted in Phase 2 (PERF-01), but CSP must allow them now since they're currently loaded.
- **D-05:** Include `'unsafe-inline'` for script-src (required for GA inline snippet) and style-src (required for Google Fonts CSS). This is a temporary allowance -- Phase 2 self-hosting will tighten CSP.
- **D-06:** Implement React error boundary that silently hides crashed sections. Visitors should never see error UI on a portfolio site -- the rest of the page continues working. Log errors to console for debugging.
- **D-07:** Wrap each major section component individually (Hero, Portfolio, Clients, About, Services, Contact, Footer) so a single section failure doesn't take down the whole page.
- **D-08:** Favicon: Camera/lens icon in the site's color palette (amber accent on dark background), saved as `public/favicon.svg`.
- **D-09:** OG Image: Cinematic still from the best work with "stealinglight" text overlaid, saved as `public/og-image.jpg`. Dimensions: 1200x630px (standard OG image size).
- **D-10:** Run `npm audit fix` in both root and `infra/` directories. If CDK needs upgrading to resolve transitive vulns, upgrade `aws-cdk-lib` and CDK CLI to match.

### Claude's Discretion

- CSP directive exact syntax and formatting
- Error boundary component implementation pattern (class component vs library)
- favicon SVG design details (exact lens icon style)
- npm audit fix order and any necessary package upgrades
- Whether to verify SES production access status as part of contact form fix

### Deferred Ideas (OUT OF SCOPE)

None -- discussion stayed within phase scope
</user_constraints>

<phase_requirements>

## Phase Requirements

| ID       | Description                                                                                                   | Research Support                                                                                                      |
| -------- | ------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| INFRA-01 | Contact form submits successfully and delivers email via SES end-to-end (resolve dual Lambda file divergence) | Lambda cleanup (D-01/D-02/D-03), SES verification check, Lambda package.json esbuild script cleanup                   |
| INFRA-02 | CSP headers allow Google Analytics, Google Fonts, and CloudFront CDN without blocking                         | CSP directive research from Google's official CSP guide, Amplify custom headers YAML format, exact domains documented |
| INFRA-03 | Site has favicon.svg in browser tab and og-image.jpg for social media sharing previews                        | SVG favicon format, OG image 1200x630px spec, existing meta tags already reference these paths                        |
| INFRA-04 | React error boundary catches component crashes and displays graceful fallback instead of blank page           | react-error-boundary v6.1.1 API, per-section wrapping pattern, invisible fallback strategy                            |
| INFRA-06 | npm audit shows zero high/critical vulnerabilities in both root and infra packages                            | Current vulns documented (3 root, 5 infra), fix paths identified (npm audit fix + CDK upgrade to 2.245.0+)            |

</phase_requirements>

## Standard Stack

### Core

| Library              | Version  | Purpose                        | Why Standard                                                                                                                             |
| -------------------- | -------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| react-error-boundary | 6.1.1    | React error boundary component | De facto standard; avoids hand-rolling class components. Supports fallback prop, FallbackComponent, fallbackRender, and onError callback |
| aws-cdk-lib          | 2.245.0  | CDK infrastructure library     | Upgrade from 2.244.0 required to resolve transitive yaml vulnerability                                                                   |
| aws-cdk (CLI)        | 2.1114.1 | CDK deployment CLI             | Must match or exceed library schema version                                                                                              |

### Supporting

| Library             | Version  | Purpose                     | When to Use                                           |
| ------------------- | -------- | --------------------------- | ----------------------------------------------------- |
| @aws-sdk/client-ses | 3.980.0+ | SES email sending in Lambda | Already installed in infra/; no version change needed |

### Alternatives Considered

| Instead of               | Could Use                   | Tradeoff                                                                                                                |
| ------------------------ | --------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| react-error-boundary     | Hand-rolled class component | Class component works but is more code, no onError callback, no reset mechanism. Library is 3KB and well-maintained.    |
| CSP array builder in CDK | Raw string editing          | Array builder (join with '; ') is cleaner and less error-prone than editing a 300+ character single-line string in YAML |

**Installation:**

```bash
# Root project
npm install react-error-boundary

# Infra project
cd infra && npm install aws-cdk-lib@^2.245.0 && npm install -D aws-cdk@^2.1114.0
```

**Version verification:** Checked 2026-03-30 against npm registry:

- `react-error-boundary`: 6.1.1 (latest)
- `aws-cdk-lib`: 2.245.0 (latest, resolves yaml vuln)
- `aws-cdk`: 2.1114.1 (latest CLI)

## Architecture Patterns

### Recommended Project Structure

No new directories needed. Changes are in-place:

```
infra/
  lambda/contact/
    index.js           # KEEP (canonical Lambda)
    index.ts           # DELETE
    bun.lock           # DELETE
    package.json       # CLEAN (remove stale esbuild script)
    __tests__/
      index.test.js    # VERIFY (already imports index.js)
  lib/
    amplify-hosting-stack.ts   # MODIFY (CSP update)
public/
  favicon.svg          # CREATE
  og-image.jpg         # CREATE
src/
  app/
    components/
      SectionErrorBoundary.tsx  # CREATE (or ErrorBoundary.tsx)
    App.tsx             # MODIFY (wrap sections with error boundary)
```

### Pattern 1: Per-Section Error Boundary

**What:** Wrap each major section component in its own error boundary so failures are isolated.
**When to use:** Always in App.tsx for all content sections.
**Example:**

```typescript
// Source: react-error-boundary v6.1.1 docs
import { ErrorBoundary } from 'react-error-boundary';

// Silent fallback -- renders nothing when a section crashes
function SectionFallback() {
  return null;
}

// Log errors to console for debugging
function logSectionError(error: Error, info: { componentStack?: string | null }) {
  console.error('Section crashed:', error, info.componentStack);
}

// In App.tsx:
<ErrorBoundary FallbackComponent={SectionFallback} onError={logSectionError}>
  <Hero videoSrc={heroVideo.src} posterSrc={heroVideo.poster} />
</ErrorBoundary>
<ErrorBoundary FallbackComponent={SectionFallback} onError={logSectionError}>
  <Portfolio />
</ErrorBoundary>
// ... etc for each section
```

### Pattern 2: CSP as Array Builder

**What:** Build CSP string programmatically from an array of directives rather than editing a single-line string.
**When to use:** In `amplify-hosting-stack.ts` when constructing the CSP header value.
**Example:**

```typescript
// Build CSP from structured directives -- less error-prone than single-line editing
const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://*.googletagmanager.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: https: https://*.google-analytics.com https://*.googletagmanager.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "media-src 'self' https://*.cloudfront.net",
  "connect-src 'self' https://*.execute-api.us-west-2.amazonaws.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  'upgrade-insecure-requests',
];
const cspValue = cspDirectives.join('; ');
```

### Anti-Patterns to Avoid

- **Editing CSP as a raw string in YAML:** A single missing semicolon or misplaced quote invalidates the entire policy. Always build programmatically.
- **Testing CSP in dev only:** Vite dev server does not apply Amplify custom headers. CSP issues are invisible until deployed. Must verify post-deploy.
- **Keeping both Lambda files "just in case":** The TS file has different env vars, different API event format, and weaker sanitization. It is not a fallback; it is a liability.
- **Using ErrorBoundary with visible fallback on a portfolio site:** A "Something went wrong" message in the middle of a beautiful portfolio is worse than silently hiding the crashed section.

## Don't Hand-Roll

| Problem                 | Don't Build                              | Use Instead                            | Why                                                                               |
| ----------------------- | ---------------------------------------- | -------------------------------------- | --------------------------------------------------------------------------------- |
| React error boundary    | Class component with `componentDidCatch` | `react-error-boundary` v6.1.1          | Handles reset, onError callback, multiple fallback patterns, tested with React 19 |
| CSP string construction | Concatenation or template literal        | Array of directives joined with `'; '` | Prevents syntax errors, easy to read/modify, each directive on its own line       |
| SVG favicon             | Complex multi-layer icon                 | Simple geometric camera lens shape     | Must be legible at 16x16; complex detail is invisible at that size                |

**Key insight:** Every problem in this phase has a well-known solution. The risk is not technical difficulty -- it is sequencing (SES verification), invisible failures (CSP in production), and typos (CSP syntax).

## Common Pitfalls

### Pitfall 1: SES Sandbox Mode Blocks Email Delivery

**What goes wrong:** Lambda code is correct, CDK deploys successfully, API returns 200, but emails never arrive. SES is in sandbox mode and can only send to pre-verified recipient addresses.
**Why it happens:** SES sandbox restrictions are invisible to application code. The Lambda catches SES errors as generic 500s. New AWS accounts start in sandbox mode.
**How to avoid:**

1. Check SES account status early: `aws sesv2 get-account` -- look for `ProductionAccessEnabled: true`
2. Check sender identity verification: `aws ses get-identity-verification-attributes --identities [email] [domain]`
3. If in sandbox, request production access immediately (24hr AWS review window)
4. Test with an external, non-verified email address to confirm you are out of sandbox
   **Warning signs:** Lambda logs showing SES 403/MessageRejected errors; form returns 500 but unit tests pass

### Pitfall 2: CSP Invisible in Development

**What goes wrong:** CSP changes look correct in code but break Google Analytics, Google Fonts, or other resources in production. No way to catch this locally.
**Why it happens:** Vite dev server does not apply Amplify custom headers. CSP is only enforced by Amplify CDN in production.
**How to avoid:**

1. Build CSP as array (not string) to prevent syntax errors
2. After deploying, check browser DevTools console for "Refused to load" CSP violation messages
3. Verify Google Analytics real-time view shows hits after deployment
4. Verify Google Fonts load (check Network tab for fonts.gstatic.com requests)
   **Warning signs:** Zero GA traffic post-deploy; fonts falling back to system sans-serif in production

### Pitfall 3: Lambda package.json Stale References

**What goes wrong:** After deleting `index.ts`, the Lambda `package.json` still contains an esbuild build script (`"build": "esbuild index.ts --bundle..."`) that references the deleted file, plus devDependencies (`esbuild`, `typescript`, `@types/aws-lambda`) that are no longer needed.
**Why it happens:** The Lambda directory has its own `package.json` with a TypeScript build pipeline that was never used in deployment. CDK deploys `index.js` directly via `lambda.Code.fromAsset()`.
**How to avoid:** Clean up the Lambda `package.json` when deleting `index.ts`:

1. Remove the `build` script referencing `index.ts`
2. Remove `devDependencies` (`esbuild`, `typescript`, `@types/aws-lambda`) -- these are TS-specific
3. Keep `dependencies` (`@aws-sdk/client-ses`) -- needed for local development reference
4. Keep the `package.json` itself -- it documents the Lambda's dependencies
   **Warning signs:** `npm run build` in Lambda directory fails with "index.ts not found"

### Pitfall 4: OG Image Cannot Be Code-Generated

**What goes wrong:** The planner creates a task to "generate og-image.jpg" but this requires an actual cinematic still from the owner's video work, not a programmatically generated image.
**Why it happens:** OG images for portfolio sites need real visual content. A placeholder or generated graphic defeats the purpose -- the whole point is showcasing the cinematography.
**How to avoid:** The OG image must be sourced from existing video thumbnails available on the CloudFront CDN (`d2fc83sck42gx7.cloudfront.net/thumbnails/`). Download a compelling thumbnail, resize to 1200x630px, and overlay "stealinglight" text. Check `src/app/config/videos.ts` for the featured video thumbnail as a candidate.
**Warning signs:** A generic placeholder being committed instead of actual portfolio content

### Pitfall 5: npm audit fix May Not Fully Resolve Infra Vulns

**What goes wrong:** Running `npm audit fix` in `infra/` does not resolve the `yaml` vulnerability because it is transitive through `aws-cdk-lib@<=2.244.0`. A version upgrade is required.
**Why it happens:** `npm audit fix` only updates within semver ranges. The `aws-cdk-lib` dependency is pinned at `^2.236.0` and resolves to 2.244.0, which bundles the vulnerable `yaml` package. The fix requires upgrading to `aws-cdk-lib@2.245.0+`.
**How to avoid:**

1. Run `npm audit fix` first (catches picomatch and other fixable vulns)
2. Then explicitly upgrade: `npm install aws-cdk-lib@^2.245.0`
3. Also upgrade CDK CLI: `npm install -D aws-cdk@^2.1114.0` (must match or exceed library schema version)
4. Run `npm audit` again to verify zero high/critical
   **Warning signs:** `npm audit` still showing vulnerabilities after `npm audit fix`

## Code Examples

### Error Boundary Component

```typescript
// src/app/components/SectionErrorBoundary.tsx
// Source: react-error-boundary v6.1.1 API
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';
import { type ReactNode } from 'react';

// Invisible fallback -- crashed section simply disappears
function SectionFallback(_props: FallbackProps) {
  return null;
}

function handleSectionError(error: Error, info: { componentStack?: string | null }) {
  console.error('[SectionError]', error.message, info.componentStack);
}

export function SectionErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={SectionFallback} onError={handleSectionError}>
      {children}
    </ErrorBoundary>
  );
}
```

### App.tsx with Error Boundaries

```typescript
// src/app/App.tsx -- wrapping each section individually
import { SectionErrorBoundary } from './components/SectionErrorBoundary';

export default function App() {
  return (
    <div className="size-full bg-cinematic-black">
      <Navigation />
      <SectionErrorBoundary>
        <Hero videoSrc={heroVideo.src} posterSrc={heroVideo.poster} />
      </SectionErrorBoundary>
      <SectionErrorBoundary>
        <Portfolio />
      </SectionErrorBoundary>
      <SectionErrorBoundary>
        <Clients />
      </SectionErrorBoundary>
      <SectionErrorBoundary>
        <About />
      </SectionErrorBoundary>
      <SectionErrorBoundary>
        <Services />
      </SectionErrorBoundary>
      <SectionErrorBoundary>
        <Contact />
      </SectionErrorBoundary>
      <SectionErrorBoundary>
        <Footer />
      </SectionErrorBoundary>
      <Toaster ... />
    </div>
  );
}
```

### CSP Update in Amplify Hosting Stack

```typescript
// infra/lib/amplify-hosting-stack.ts -- CSP as structured array
// Source: Google CSP guide (developers.google.com/tag-platform/security/guides/csp)

const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://*.googletagmanager.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: https: https://*.google-analytics.com https://*.googletagmanager.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "media-src 'self' https://*.cloudfront.net",
  "connect-src 'self' https://*.execute-api.us-west-2.amazonaws.com https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "base-uri 'self'",
  'upgrade-insecure-requests',
];
const cspValue = cspDirectives.join('; ');

// Then in the YAML customHeaders:
//   - key: Content-Security-Policy
//     value: "${cspValue}"
```

### Favicon SVG (Minimal Camera Lens)

```svg
<!-- public/favicon.svg -->
<!-- Camera lens icon in site palette: amber on dark background -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="4" fill="#0a0a0a"/>
  <circle cx="16" cy="16" r="10" stroke="#d4a853" stroke-width="2" fill="none"/>
  <circle cx="16" cy="16" r="5" stroke="#d4a853" stroke-width="1.5" fill="none"/>
  <circle cx="16" cy="16" r="2" fill="#d4a853"/>
</svg>
```

Note: The exact SVG design is at Claude's discretion per D-08. The above is a starting point -- a concentric-circle lens motif using `cinematic-amber` (#d4a853) on `cinematic-black` (#0a0a0a). It must be legible at 16x16 and 32x32.

### Lambda package.json Cleanup

```json
{
  "name": "contact-lambda",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "@aws-sdk/client-ses": "^3.700.0"
  }
}
```

Remove: `scripts.build` (references deleted index.ts), `devDependencies` block entirely (esbuild, typescript, @types/aws-lambda are TS-specific).

## State of the Art

| Old Approach                    | Current Approach               | When Changed                                    | Impact                                                                                                                                                                         |
| ------------------------------- | ------------------------------ | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Class-based error boundaries    | `react-error-boundary` library | Stable since React 16, library v4+              | No need to write class components; library handles edge cases                                                                                                                  |
| `'unsafe-inline'` for GA script | Nonce-based CSP                | Available but not practical with static hosting | Amplify static hosting cannot generate per-request nonces; `'unsafe-inline'` is the pragmatic choice for now. Phase 2 self-hosts fonts and Phase 4 can explore nonce if needed |
| aws-cdk-lib 2.244.0             | aws-cdk-lib 2.245.0            | 2026 Q1                                         | Resolves transitive yaml vulnerability                                                                                                                                         |

**Deprecated/outdated:**

- `react-error-boundary` v3 API (different import patterns) -- use v6 API
- `componentDidCatch` class component pattern -- still works but unnecessary with the library

## Open Questions

1. **SES Production Access Status**
   - What we know: The CDK stack grants SES permissions scoped to the contact email and domain. SES identity may or may not be verified.
   - What's unclear: Whether the AWS account has SES production access or is still in sandbox mode.
   - Recommendation: Check early with `aws sesv2 get-account`. If sandbox, request production access as the first action (24hr review). This is a blocker for INFRA-01 end-to-end verification.

2. **OG Image Source Material**
   - What we know: Thumbnails exist on CloudFront CDN at `d2fc83sck42gx7.cloudfront.net/thumbnails/`. The featured video is BLNK Media reel (id 1). The hero video uses drone reel thumbnail (id 17).
   - What's unclear: Which frame or thumbnail best represents the portfolio for social sharing. This is an aesthetic judgment.
   - Recommendation: Use the featured video thumbnail (`01-blnk-reel-2020.jpg`) or drone reel thumbnail (`17-drone-reel.jpg`) as the base image. Download, resize to 1200x630, and overlay minimal text. The owner may want to provide a specific frame -- flag for human review after creating initial version.

3. **Amplify Rebuild After CDK Deploy**
   - What we know: CSP changes are deployed via CDK to the Amplify app configuration. Vite env vars (like `VITE_CONTACT_API_URL`) are baked at build time.
   - What's unclear: Whether Amplify custom header changes take effect immediately or require a rebuild/redeployment of the frontend.
   - Recommendation: After CDK deploy with CSP changes, trigger an Amplify rebuild to ensure headers take effect. Verify via browser DevTools response headers on the production URL.

## Environment Availability

| Dependency             | Required By                        | Available          | Version                             | Fallback                             |
| ---------------------- | ---------------------------------- | ------------------ | ----------------------------------- | ------------------------------------ |
| Node.js                | All                                | Needs check        | Expected 22                         | --                                   |
| npm                    | Package management, audit          | Needs check        | Expected 10+                        | --                                   |
| AWS CLI                | SES verification check             | Needs check        | --                                  | Check via AWS Console instead        |
| CDK CLI                | Infrastructure deploy              | Available (infra/) | 2.1112.0 (will upgrade to 2.1114.1) | --                                   |
| ImageMagick or similar | OG image creation (resize/overlay) | Needs check        | --                                  | Use browser-based tool or Python PIL |

**Missing dependencies with no fallback:**

- None blocking -- all core tools are standard Node.js/npm.

**Missing dependencies with fallback:**

- AWS CLI: If not installed locally, SES verification can be checked via the AWS Console web UI.
- Image processing tool: If no CLI tool available, OG image can be created with any image editor or browser-based tool.

## Sources

### Primary (HIGH confidence)

- Google CSP Guide for Tag Manager/GA4: https://developers.google.com/tag-platform/security/guides/csp -- exact domains for script-src, connect-src, img-src
- react-error-boundary GitHub: https://github.com/bvaughn/react-error-boundary -- v6.1.1 API, fallback patterns
- npm registry: Verified versions for react-error-boundary (6.1.1), aws-cdk-lib (2.245.0), aws-cdk CLI (2.1114.1)
- Direct codebase analysis: All referenced files read and analyzed

### Secondary (MEDIUM confidence)

- AWS Amplify custom headers docs: Format is YAML string in CfnApp `customHeaders` property. Verified by examining existing working configuration in `amplify-hosting-stack.ts`.

### Tertiary (LOW confidence)

- Amplify header cache behavior: Whether custom header changes require a frontend rebuild. Marked as open question.

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH -- all libraries verified against npm registry, versions confirmed
- Architecture: HIGH -- patterns derived from existing codebase conventions and official library docs
- Pitfalls: HIGH -- drawn from direct codebase analysis (CONCERNS.md, PITFALLS.md) and verified against current file state

**Research date:** 2026-03-30
**Valid until:** 2026-04-30 (stable domain; no fast-moving dependencies)
