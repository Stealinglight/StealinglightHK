# Pitfalls Research

**Domain:** Video-heavy cinematography portfolio site revamp (React + Vite + AWS serverless)
**Researched:** 2026-03-27
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Dead Code Removal Breaks Live Features Via Hidden Import Chains

**What goes wrong:**
Mass-deleting the 44 unused shadcn/ui components and 20+ unused npm packages simultaneously introduces subtle breakage. Some packages may be peer dependencies of packages you keep (e.g., `@radix-ui/react-slot` is used by `class-variance-authority` patterns even if the component file importing it is gone). Removing everything in one pass can cause build failures or runtime errors that are hard to trace back to a specific deletion.

**Why it happens:**
The temptation during a cleanup phase is to rip out everything at once -- delete all 48 files in `ui/`, remove all unused packages from `package.json`, and run `npm install`. But transitive dependency chains are not always visible. The current codebase has `clsx`, `tailwind-merge`, and `class-variance-authority` which are actually used by the real app components. These live alongside 20+ Radix packages and libraries like `cmdk`, `vaul`, `recharts` that are genuinely unused. Deleting the wrong thing at the wrong time creates a debugging nightmare.

**How to avoid:**

1. Delete component files first, verify build passes, then commit.
2. Remove npm packages in groups by category (Radix packages, MUI packages, utility libraries), verifying the build between each group.
3. Use `npx depcheck` or similar to validate after each removal round.
4. Keep `class-variance-authority`, `clsx`, `tailwind-merge`, `tw-animate-css`, `motion`, `lucide-react`, and `sonner` -- these are actively used by real components.

**Warning signs:**

- Build errors mentioning missing modules after package removal
- TypeScript errors in files you did not touch
- `npm ls [package]` showing a package is depended on by something you intend to keep

**Phase to address:**
Cleanup/Stabilization phase -- must happen before the visual overhaul so the design work starts from a clean, known-good codebase.

---

### Pitfall 2: Resolving the Dual Lambda Without Verifying SES Production Access

**What goes wrong:**
You delete `index.ts`, keep `index.js` as the canonical Lambda source (correct -- it matches the CDK stack's `CONTACT_EMAIL` env var and REST API event format). You deploy, test locally, form submits, Lambda runs... and emails never arrive. The SES identity might not be verified for the domain, or the account may still be in SES sandbox mode (can only send to pre-verified recipient addresses).

**Why it happens:**
The Lambda code looks correct. The CDK stack looks correct. The API Gateway returns 200. But SES has its own verification layer that is invisible to application-level testing. New AWS accounts start in SES sandbox mode with a 200-email/day limit and can only send to verified email addresses. Even production accounts require verified sender identities (email or domain). The contact form will return 500 errors from SES that get swallowed into a generic "Failed to send message" response.

**How to avoid:**

1. Before touching Lambda code, verify SES sender identity status: `aws ses get-identity-verification-attributes --identities [CONTACT_EMAIL] [DOMAIN]`
2. Check SES account status: `aws sesv2 get-account` -- look for `ProductionAccessEnabled`
3. If in sandbox, request production access (24hr AWS review) BEFORE starting contact form work
4. After resolving the dual-file issue, send a real test email through the deployed Lambda -- do not rely on unit tests alone
5. Add SES bounce/complaint handling (Return-Path configuration)

**Warning signs:**

- Lambda CloudWatch logs showing SES errors (403, MessageRejected)
- Contact form returns 500 but Lambda unit tests pass
- Emails work to your own verified address but fail for random test addresses

**Phase to address:**
Infrastructure fixes phase -- resolve before any frontend contact form work begins. SES verification is a blocking prerequisite.

---

### Pitfall 3: CSP Changes That Break The Site in Production But Work in Development

**What goes wrong:**
You update the CSP in `amplify-hosting-stack.ts` to allow Google Analytics and Google Fonts, deploy, and something else breaks. The CSP is a single string with multiple directives. A typo, missing semicolon, or incorrect domain breaks the entire policy -- and browsers enforce CSP silently (resources just fail to load, no visible error unless you check DevTools console). Worse, Vite dev server does not apply Amplify's custom headers, so CSP issues are invisible during local development.

**Why it happens:**
CSP is unforgiving syntax. The current policy string is already 300+ characters on a single line in a YAML block inside a CDK TypeScript file. One missing semicolon between directives invalidates the entire policy. The gap between dev (no CSP) and production (strict CSP) means you cannot catch CSP violations until after deployment.

**How to avoid:**

1. Build the CSP string programmatically in the CDK stack using an object/array structure, not a hand-edited string:
   ```typescript
   const cspDirectives = [
     "default-src 'self'",
     "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com",
     // ...
   ].join('; ');
   ```
2. Add `Content-Security-Policy-Report-Only` header in parallel during testing to log violations without blocking resources
3. Test with a local proxy or Playwright test that injects CSP headers to simulate production
4. After deploying, check the browser console for CSP violation reports before declaring success

**Warning signs:**

- Google Analytics showing zero traffic after deployment
- Fonts falling back to system fonts in production but looking correct in dev
- Console errors containing "Refused to load" or "violates the following Content Security Policy directive"

**Phase to address:**
Infrastructure fixes phase -- fix CSP early so that all subsequent visual work is tested under production-equivalent conditions.

---

### Pitfall 4: Video-Heavy Page Destroying Mobile Performance and Core Web Vitals

**What goes wrong:**
The portfolio section renders 19 `<video>` elements simultaneously. Even with `preload="none"`, the browser still creates 19 media element instances in the DOM. On hover (desktop) or scroll-into-view (mobile), videos start downloading competing streams over the same connection. The hero section's autoplay video starts downloading immediately on page load. Combined with render-blocking Google Fonts, LCP (Largest Contentful Paint) exceeds 4 seconds on mobile connections, CLS (Cumulative Layout Shift) spikes from poster-to-video transitions, and the page consumes 50-100MB+ of bandwidth even with partial viewing.

**Why it happens:**
Desktop development with fast connections masks the problem. The hover-to-play pattern works beautifully on desktop with broadband but translates terribly to mobile: there is no hover event, so videos never preview (wasted DOM), and if touch-to-play is added, multiple video downloads compete. The `preload="none"` attribute prevents initial download but does nothing to limit concurrent streams once playback begins.

**How to avoid:**

1. Use Intersection Observer to lazily _render_ video elements -- do not just set `preload="none"` on 19 always-rendered elements. Only mount `<video>` tags when they scroll into the viewport.
2. Limit concurrent video downloads to 2-3 maximum. When a new video starts, pause/unload videos that scrolled out of view.
3. For mobile: replace hover-to-play with static poster images + play icon overlay. Only load video on explicit tap.
4. Hero video: use poster image as LCP element with `fetchpriority="high"`, defer video load until after initial paint.
5. Consider adaptive loading: detect `navigator.connection.effectiveType` and skip video autoplay on slow connections.
6. Serve different video qualities (720p mobile, 1080p desktop) via CloudFront with `Accept` header or query parameter.

**Warning signs:**

- Lighthouse performance score below 50 on mobile
- LCP exceeding 2.5s (good threshold)
- Network tab showing multiple parallel video downloads
- High bounce rate from mobile visitors in Google Analytics

**Phase to address:**
Performance optimization phase -- but the architectural decisions (Intersection Observer lazy rendering, mobile strategy) should be planned during the visual overhaul phase so the component structure supports them.

---

### Pitfall 5: Visual Overhaul Without Error Boundaries Causes Complete Page Crashes

**What goes wrong:**
During the visual overhaul, you refactor components, add new animations, change video modal behavior, integrate new design patterns. A runtime error in any single component (failed video load, animation library version mismatch, null reference in restructured props) crashes the entire single-page application. The user sees a white screen with no recovery path. Because there is no error boundary, React's default behavior is to unmount the entire component tree.

**Why it happens:**
The current `App.tsx` renders Navigation, Hero, Portfolio, Clients, About, Services, Contact, and Footer as siblings with no error isolation. An error in Portfolio (e.g., video playback fails on an unsupported format) kills Contact, About, and everything else. During active development with frequent changes, runtime errors are common -- and without boundaries, they are catastrophic rather than contained.

**How to avoid:**

1. Add error boundaries BEFORE starting the visual overhaul, not after
2. Wrap each major section in its own error boundary with a graceful fallback UI
3. Create a dedicated video error boundary for the Portfolio section that catches media playback errors without killing the rest of the page
4. Add `window.onerror` and `window.onunhandledrejection` handlers for edge cases error boundaries miss
5. In the video modal, catch `video.play()` promise rejections (browsers reject autoplay promises when media engagement policy is not met)

**Warning signs:**

- White screen during development after a component change
- `Uncaught Error` in console with no fallback UI
- Video `play()` returning a rejected promise (especially on Safari/iOS)
- User reports of "blank page" with no way to navigate

**Phase to address:**
First phase -- add error boundaries as infrastructure before any visual work begins. This is a safety net for all subsequent phases.

---

### Pitfall 6: Removing Components Before Understanding What the Visual Overhaul Needs

**What goes wrong:**
You aggressively clean up the codebase -- remove all 44 shadcn/ui components, delete Radix packages, strip out MUI -- and then during the visual overhaul discover you actually need a dialog, a sheet/drawer, a tooltip, or tabs component. You end up reinstalling and reconfiguring the same libraries you just removed, wasting time and creating churn.

**Why it happens:**
The cleanup feels urgent because of the 5,119 lines of dead code. The visual overhaul plan is not yet finalized. Removing "unused" code before knowing what the redesign requires means you are optimizing for the current design rather than the future one. Some of those shadcn/ui components (dialog, sheet, tooltip, tabs) are common patterns in portfolio sites.

**How to avoid:**

1. Complete the visual design/wireframing phase BEFORE the code cleanup phase
2. Identify which UI primitives the new design requires (modal/dialog, navigation patterns, form elements)
3. Only then remove components that are definitively not in the new design
4. Keep a minimal set: if the new design uses modals, keep `dialog.tsx` (or decide to build custom). Do not delete then recreate.
5. If starting fresh (custom components, no shadcn), remove everything but do so with the design spec in hand

**Warning signs:**

- Reinstalling packages you removed in the previous phase
- Building custom versions of components you already had
- Design mockups requiring UI patterns (drawers, sheets, tooltips) you just deleted

**Phase to address:**
Design/planning phase must complete before cleanup phase. The cleanup should reference a finalized component inventory.

---

### Pitfall 7: Font Loading Strategy That Causes Flash of Invisible Text or Layout Shift

**What goes wrong:**
You self-host fonts (correct move for performance and CSP) but serve them without proper `font-display` strategy. Or you change fonts during the visual overhaul and the new fonts have different metrics than the system fallback, causing significant CLS when web fonts load. The current render-blocking Google Fonts link means the page waits for fonts before painting anything -- removing this improves FCP but introduces FOIT/FOUT if not handled.

**Why it happens:**
Moving from render-blocking external fonts to self-hosted fonts with `font-display: swap` trades one problem (slow first paint) for another (layout shift when fonts swap in). The font metric differences between Inter/Space Grotesk and system sans-serif cause text reflow. This is invisible during development (fonts are cached) but visible on every first visit.

**How to avoid:**

1. Self-host fonts using `@font-face` with `font-display: swap`
2. Use `size-adjust`, `ascent-override`, and `descent-override` in `@font-face` to match fallback font metrics, minimizing CLS
3. Preload the critical font files: `<link rel="preload" href="/fonts/Inter-Regular.woff2" as="font" type="font/woff2" crossorigin>`
4. Subset fonts to Latin characters only (Inter full is 300KB+; Latin subset is ~20KB per weight)
5. Limit font weights: the current import loads Inter 400/500/600 and Space Grotesk 500/600/700 -- six font files. Consider reducing to 3-4 files maximum.

**Warning signs:**

- CLS score above 0.1 in Lighthouse
- Visible text reflow on first page load (test in incognito)
- Font files totaling more than 100KB
- Multiple font weights loading that are only used in one place

**Phase to address:**
Performance optimization phase, but font decisions should be made during the visual overhaul so the design is built around the final font stack.

---

## Technical Debt Patterns

| Shortcut                                      | Immediate Benefit                           | Long-term Cost                                                                                                                                  | When Acceptable                                                                              |
| --------------------------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Keeping dual Lambda files (TS + JS)           | Avoid decision about which to use           | Confusion about which code runs in production, divergent behavior, untested TS source                                                           | Never -- resolve to single source immediately                                                |
| Hardcoded CDN URL in source                   | Works today, simple                         | Every CloudFront distribution change requires code changes across multiple files                                                                | Only in prototype; move to env var before production                                         |
| `preload="none"` as only video optimization   | Easy to add, some bandwidth savings         | Still renders 19 video elements in DOM, no mobile strategy, no concurrent stream limiting                                                       | As an interim measure during cleanup; must replace with Intersection Observer lazy rendering |
| Dual lockfiles (bun.lock + package-lock.json) | Flexibility for local vs CI                 | Dependency version drift between environments, contributor confusion                                                                            | Acceptable if documented and both lockfiles are updated together; risky at scale             |
| `ESLINT_USE_FLAT_CONFIG=false` legacy mode    | ESLint works today without migration effort | Blocks ESLint 10+ upgrades, deployed Lambda code is never linted (`.js` files ignored)                                                          | Only during active development; migrate before next ESLint major upgrade                     |
| No unit tests for React components            | Faster feature development                  | E2E tests are slow, fragile, and test less granularly; regressions in component logic (form validation, modal state, scroll lock) go undetected | Acceptable for a portfolio site if E2E coverage is comprehensive                             |

## Integration Gotchas

| Integration                    | Common Mistake                                                                                                                            | Correct Approach                                                                                                                                                                                                                                                                                                       |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AWS SES                        | Deploying Lambda and assuming email works; forgetting sandbox mode verification requirements                                              | Verify sender identity AND check account production status before deploying contact form. Test with an unverified recipient address to confirm you are out of sandbox.                                                                                                                                                 |
| Google Analytics + CSP         | Adding GA script to HTML without updating CSP; inline scripts require `'unsafe-inline'` or nonce-based CSP                                | Update CSP to include `https://www.googletagmanager.com` and `https://www.google-analytics.com` in `script-src`. Add `https://www.google-analytics.com` to `connect-src` for beacon requests. Consider using a nonce instead of `'unsafe-inline'`.                                                                     |
| CloudFront CDN + Video         | Assuming CloudFront serves all formats equally; `.mov` files (2 in the current config) may not stream properly in all browsers            | Verify all video files are in MP4/H.264 format. The current config includes two `.mov` files (`Gin Mare` and `NIU eScooters`) that may fail on some browsers. Transcode to MP4 or add format fallbacks.                                                                                                                |
| Amplify + Vite env vars        | Setting `VITE_CONTACT_API_URL` in CDK but forgetting Amplify needs a rebuild to pick up changes                                           | After CDK deploys and updates Amplify env vars, trigger an Amplify rebuild. Env vars are baked into the Vite build at compile time, not read at runtime.                                                                                                                                                               |
| API Gateway CORS + Lambda CORS | Configuring CORS in both API Gateway (`defaultCorsPreflightOptions`) and Lambda (`corsHeaders`) leading to duplicate headers or conflicts | The current setup has CORS in both places. API Gateway handles OPTIONS preflight; Lambda handles CORS for POST responses. This works but is fragile -- changes to allowed origins must be synchronized in CDK stack (which sets `ALLOWED_ORIGINS` env var) and API Gateway config (which reads `allowedOrigins` prop). |

## Performance Traps

| Trap                                               | Symptoms                                                                            | Prevention                                                                                                                                                            | When It Breaks                                                                                |
| -------------------------------------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| 19 video elements rendered simultaneously          | High memory usage, slow scroll, janky animations                                    | Intersection Observer lazy rendering; only mount 5-7 video elements at a time                                                                                         | Immediately on low-end mobile devices (2GB RAM phones); noticeable on any mobile connection   |
| Hero autoplay video on mobile                      | 10-50MB video download before any user interaction; data plan consumption; slow LCP | Detect mobile/slow connection; show poster image with play button instead of autoplay                                                                                 | On any mobile connection slower than 4G; on metered connections (most mobile users)           |
| Motion (framer-motion) animations on every section | Excessive repaints during scroll; GPU memory pressure; animation jank               | Use `viewport={{ once: true }}` (already done) but also consider `will-change` CSS and reducing simultaneous animations. Test with Chrome DevTools Performance panel. | When 5+ sections animate simultaneously during fast scroll; on mid-range Android devices      |
| Render-blocking font stylesheet                    | Delays First Contentful Paint by 200-500ms                                          | Self-host fonts, use `font-display: swap`, preload critical font files                                                                                                | On every page load for new visitors; more severe on high-latency connections (Asia, cellular) |
| `.mov` video files served to non-Apple browsers    | Video fails to play, shows black frame or error                                     | Transcode all assets to MP4/H.264. The two `.mov` files in `videos.ts` (Gin Mare, NIU eScooters) are at risk.                                                         | On Firefox, some Android browsers, older Chrome versions                                      |

## Security Mistakes

| Mistake                                                           | Risk                                                                                                                                        | Prevention                                                                                                                                                                                               |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Keeping `index.ts` with weaker sanitization alongside `index.js`  | Future developer transpiles TS, deploys code with `replace(/[<>]/g, '')` instead of proper `escapeHtml()`, re-introducing XSS in email body | Delete `index.ts` immediately; single source of truth in `index.js` with its proper `escapeHtml()` function                                                                                              |
| Adding `'unsafe-inline'` to CSP `script-src` for Google Analytics | Allows any inline script execution, defeating most XSS protections CSP provides                                                             | Use nonce-based CSP: generate a nonce per request, add to GA inline script tag and CSP header. If nonce is not feasible with Amplify static hosting, use `'unsafe-inline'` but acknowledge the tradeoff. |
| No honeypot or CAPTCHA on contact form                            | Automated spam bots can submit the form at up to 10 req/sec (API Gateway rate limit) -- 864,000 emails/day; SES costs and reputation damage | Add a honeypot field (hidden input that bots fill but humans skip) as minimum protection. Consider Cloudflare Turnstile for invisible CAPTCHA without Google dependency.                                 |
| Hardcoded phone number in JS bundle                               | Phone number extractable from built JavaScript even with click-to-reveal UI pattern                                                         | Accept this as a known tradeoff (the number must be in the bundle to display it). The click-to-reveal prevents casual HTML scraping. No additional mitigation needed unless spam calls increase.         |
| CloudWatch alarms with no notification target                     | Production errors (Lambda failures, 5xx responses, suspected abuse) trigger alarms that nobody sees                                         | Add SNS topic with email subscription as alarm action. Takes 5 minutes to configure in CDK.                                                                                                              |

## UX Pitfalls

| Pitfall                                                    | User Impact                                                                                                                                       | Better Approach                                                                                                                                     |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hover-to-play video on mobile (no hover events)            | Mobile users see static poster images with no indication videos are playable; play button overlay only appears on hover state they cannot trigger | Implement tap-to-play on mobile with visible play icon always shown; detect touch device via `@media (hover: none)`                                 |
| Video modal without keyboard navigation                    | Users cannot close modal with Escape key, cannot tab to controls, screen readers cannot announce modal state                                      | Add `onKeyDown` handler for Escape, `aria-modal="true"`, focus trap, return focus to trigger on close                                               |
| Contact form with no client-side email validation feedback | User submits with malformed email, gets generic server error instead of inline guidance                                                           | Add `type="email"` input validation (already present) AND inline validation message on blur; use `pattern` attribute for additional format checking |
| Missing favicon shows browser default icon                 | Site looks unfinished/unprofessional in browser tabs and bookmarks                                                                                | Add favicon.svg before any public launch; use the site's amber accent color for brand recognition                                                   |
| Missing og-image shows blank card on social shares         | When someone shares the portfolio link on LinkedIn/Twitter/iMessage, no preview image appears -- devastating for a visual portfolio               | Create og-image.jpg (1200x630px) from a compelling frame of the cinematography work; this is table-stakes for a portfolio site                      |
| No loading state for video modal                           | User clicks play, waits for video to buffer with no feedback; may click again thinking click did not register                                     | Show loading spinner/skeleton in modal while video buffers; use `onWaiting` and `onCanPlay` video events                                            |
| `document.body.style.overflow = 'hidden'` without cleanup  | If modal component unmounts unexpectedly (error, navigation), scroll lock persists; page becomes unscrollable                                     | Use `useEffect` cleanup function to restore overflow on unmount; or use a scroll lock library that handles edge cases                               |

## "Looks Done But Isn't" Checklist

- [ ] **Contact form:** Backend deployed and returns 200, but SES identity not verified or account in sandbox -- emails silently fail. Verify by sending a test email to a non-verified external address.
- [ ] **CSP headers:** Updated in CDK stack, but Amplify caches old headers. Verify by checking response headers in browser DevTools after deployment (not just CDK output).
- [ ] **Video modal:** Opens and plays video, but does not handle `play()` promise rejection on Safari/iOS autoplay policy. Verify by testing on actual iOS device in low-power mode.
- [ ] **Favicon/og-image:** Files added to `public/` directory, but Amplify build does not include them or path is wrong. Verify by checking production URL directly (`https://stealinglight.hk/favicon.svg`).
- [ ] **Google Analytics:** CSP updated and GA script loads, but `connect-src` missing `https://www.google-analytics.com` so beacon requests are blocked. Verify by checking Real-time reports in GA dashboard after deployment.
- [ ] **Font self-hosting:** Fonts load locally, but CORS headers on font files are missing or `font-display` not set. Verify by testing in incognito mode on a throttled connection.
- [ ] **Dead code removal:** All 44 shadcn/ui files deleted and build passes, but `"use client"` directives in remaining files or leftover imports in config cause warnings. Verify by running `npm run build` with zero warnings.
- [ ] **Package cleanup:** Unused packages removed from `package.json`, but `bun.lock` and `package-lock.json` not both regenerated. Verify by deleting `node_modules` and both lockfiles, then reinstalling.
- [ ] **Lambda dual-file resolution:** `index.ts` removed, but `infra/lambda/contact/package.json` still has the esbuild TypeScript build script referencing it. Verify by checking the Lambda `package.json` for stale scripts.
- [ ] **Mobile video performance:** Videos have `preload="none"`, but all 19 `<video>` elements still render in DOM on mobile. Verify using Chrome DevTools on mobile emulation -- check Elements panel for video element count in viewport vs total.

## Recovery Strategies

| Pitfall                                                 | Recovery Cost | Recovery Steps                                                                                                                                                |
| ------------------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Broke site with aggressive dead code removal            | LOW           | Revert the cleanup commit, re-approach with incremental removal verified between each step                                                                    |
| SES emails not delivering after Lambda fix              | LOW           | Check SES console for verification status; request production access if in sandbox; wait 24hrs for AWS approval                                               |
| CSP change broke production                             | LOW           | Revert CDK deploy with `cdk deploy` using previous CSP string; or temporarily use `Content-Security-Policy-Report-Only` while debugging                       |
| Video performance unacceptable on mobile                | MEDIUM        | Requires architectural change (Intersection Observer, conditional rendering); cannot be patched with attributes alone. Plan 2-3 days of refactoring.          |
| Error boundary missing and page crashes in production   | LOW           | Add `react-error-boundary` package and wrap sections; takes 1-2 hours. But if a crash already happened and user bounced, you cannot recover that impression.  |
| Font swap causing layout shift                          | LOW           | Adjust `size-adjust` and `ascent-override` values in `@font-face`; or switch back to system fonts temporarily while tuning                                    |
| Removed shadcn components then needed them for redesign | MEDIUM        | Reinstall specific packages and recreate component files. Alternatively, build custom lightweight versions. 1-2 days depending on how many components needed. |

## Pitfall-to-Phase Mapping

| Pitfall                                    | Prevention Phase                                    | Verification                                                                                                           |
| ------------------------------------------ | --------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Dead code removal breaks live features     | Cleanup phase (after design spec finalized)         | `npm run build` passes with zero warnings; `npm run test` passes; manual smoke test of all sections                    |
| SES sandbox/verification blocking emails   | Infrastructure fixes phase (first phase)            | Send test email to external, non-verified address via deployed Lambda endpoint                                         |
| CSP changes break production silently      | Infrastructure fixes phase                          | Browser DevTools console shows zero CSP violations on production URL; GA Real-time shows hits                          |
| Video performance on mobile                | Performance phase (planned during visual overhaul)  | Lighthouse mobile performance score above 70; LCP below 2.5s on simulated 4G; max 5 concurrent video downloads         |
| No error boundaries during visual overhaul | Infrastructure phase (before visual work)           | Intentionally throw error in one section; verify other sections remain functional                                      |
| Premature component removal                | Design/planning phase (before cleanup)              | Component inventory document lists which primitives the new design needs; cleanup only removes what is not on the list |
| Font loading causing FOIT/FOUT/CLS         | Visual overhaul phase (font strategy decided early) | CLS below 0.1 in Lighthouse; visual test in incognito with throttled network; no visible text reflow on first load     |

## Sources

- Codebase analysis: `CONCERNS.md` (2026-03-27 audit), direct code review of all referenced files
- web.dev: Lazy Loading Video best practices (https://web.dev/articles/lazy-loading-video)
- web.dev: Optimize LCP guidance (https://web.dev/articles/optimize-lcp)
- AWS SES documentation: Sandbox mode limitations, production access requirements (https://docs.aws.amazon.com/ses/latest/dg/request-production-access.html)
- AWS SES documentation: Email format and bounce handling (https://docs.aws.amazon.com/ses/latest/dg/send-email-concepts-email-format.html)
- Direct code analysis: `Portfolio.tsx`, `Hero.tsx`, `Contact.tsx`, `index.js`, `index.ts`, `amplify-hosting-stack.ts`, `contact-stack.ts`, `videos.ts`, `App.tsx`, `package.json`, `index.html`

---

_Pitfalls research for: cinematography portfolio site revamp_
_Researched: 2026-03-27_
