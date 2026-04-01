---
phase: 04-quality-protection
verified: 2026-04-01T15:30:00Z
status: gaps_found
score: 10/11 must-haves verified
re_verification: false
gaps:
  - truth: "Animations respect prefers-reduced-motion (QUAL-02 success criterion)"
    status: failed
    reason: "QUAL-02 explicitly requires 'reduced motion support via useReducedMotion' and the Phase 4 ROADMAP success criterion states 'animations respect prefers-reduced-motion'. Neither 04-01-PLAN.md nor 04-02-PLAN.md addressed this. Only Preloader.tsx uses useReducedMotion. Hero.tsx, Portfolio.tsx, About.tsx, Services.tsx, Navigation.tsx, Contact.tsx, Footer.tsx, and Clients.tsx all use Motion animations without reduced-motion handling."
    artifacts:
      - path: "src/app/components/Hero.tsx"
        issue: "Uses motion animations (whileInView, initial, animate) without useReducedMotion guard"
      - path: "src/app/components/About.tsx"
        issue: "Uses motion animations without useReducedMotion guard"
      - path: "src/app/components/Services.tsx"
        issue: "Uses motion animations without useReducedMotion guard"
      - path: "src/app/components/Contact.tsx"
        issue: "Uses motion animations without useReducedMotion guard"
      - path: "src/app/components/Footer.tsx"
        issue: "Uses motion animations without useReducedMotion guard"
      - path: "src/app/components/Navigation.tsx"
        issue: "Uses motion animations without useReducedMotion guard"
      - path: "src/app/components/Portfolio.tsx"
        issue: "Uses motion animations without useReducedMotion guard"
      - path: "src/app/components/Clients.tsx"
        issue: "CSS marquee pauses via media query but React motion animations have no guard"
    missing:
      - "Add useReducedMotion() from motion/react to animated section components and conditionally disable or simplify Motion animations when shouldReduceMotion is true"
---

# Phase 4: Quality & Protection Verification Report

**Phase Goal:** The finished site is accessible, protected from bots, and monitored for failures
**Verified:** 2026-04-01T15:30:00Z
**Status:** gaps_found
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | CloudWatch alarms fire SNS notifications when thresholds are breached | ✓ VERIFIED | contact-stack.ts lines 138-151: SNS topic created, email subscription wired, all 3 alarms (lambdaErrorAlarm, api5xxAlarm, api4xxAlarm) call addAlarmAction(new SnsAction(alarmTopic)) |
| 2 | Lambda rejects contact form submissions without valid Turnstile token (403) | ✓ VERIFIED | index.js lines 81-99: if (TURNSTILE_SECRET) block returns 403 "Verification token missing" when cf-turnstile-response absent, 403 "Verification failed" when siteverify returns success: false |
| 3 | Lambda accepts submissions with valid Turnstile token and sends email | ✓ VERIFIED | index.js verifyTurnstileToken() calls siteverify; test suite confirms 200 response with valid token; all 27 Lambda tests pass |
| 4 | CSP headers allow Turnstile script and iframe from challenges.cloudflare.com | ✓ VERIFIED | amplify-hosting-stack.ts line 108: script-src contains https://challenges.cloudflare.com; frame-src 'self' https://challenges.cloudflare.com present in same CSP value |
| 5 | Turnstile site key is available to Amplify frontend build as environment variable | ✓ VERIFIED | amplify-hosting-stack.ts lines 63-65: VITE_TURNSTILE_SITE_KEY in environmentVariables array |
| 6 | Turnstile invisible widget renders in contact form when section enters viewport | ✓ VERIFIED | Contact.tsx: IntersectionObserver with 200px rootMargin triggers loadTurnstileScript() then window.turnstile.render() with appearance: 'interaction-only'; conditional div with ref={turnstileContainerRef} present |
| 7 | Contact form attaches Turnstile token to submission and handles verification failures with toast | ✓ VERIFIED | Contact.tsx line 159: 'cf-turnstile-response': turnstileToken in fetch body; handleSubmit checks token expiry and presence before submit; catch block resets widget |
| 8 | Skip link is the first focusable element and navigates to #portfolio on activation | ✓ VERIFIED | App.tsx lines 17-26: SkipLink component with href="#portfolio"; lines 61: rendered as first child of root div before AnimatePresence; sr-only focus:not-sr-only class pattern |
| 9 | Tab key cycles within the video modal and does not escape to background content | ✓ VERIFIED | useFocusTrap.ts: FOCUSABLE_SELECTOR queries a[href], button, input, select, textarea, [tabindex], video[controls]; re-queries on each Tab press; Portfolio.tsx line 164: useFocusTrap(modalRef, activeVideo !== null) |
| 10 | Focus returns to the element that opened the modal when the modal closes | ✓ VERIFIED | Portfolio.tsx: triggerRef.current = document.activeElement in openVideo(); closeVideo() calls requestAnimationFrame(() => triggerRef.current?.focus()) |
| 11 | Animations respect prefers-reduced-motion | ✗ FAILED | Only Preloader.tsx uses useReducedMotion() from motion/react. Hero.tsx, Portfolio.tsx, About.tsx, Services.tsx, Navigation.tsx, Contact.tsx, Footer.tsx, Clients.tsx all apply Motion animations with no reduced-motion guard. CSS marquee in theme.css has media query fallback (pauses on reduce), but React-driven animations do not. Neither plan's must_haves addressed this component of QUAL-02. |

**Score:** 10/11 truths verified

---

### Required Artifacts

#### Plan 04-01 Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `infra/lib/contact-stack.ts` | SNS topic, alarm actions, TURNSTILE_SECRET env var, notificationEmail/turnstileSecret props | ✓ VERIFIED | Lines 7-9: sns/subscriptions/actions imports present. Lines 18-19: notificationEmail? and turnstileSecret? props. Line 54: TURNSTILE_SECRET: props.turnstileSecret \|\| ''. Lines 138-151: SNS topic, email subscription guarded by notificationEmail, 3x addAlarmAction calls. |
| `infra/lib/amplify-hosting-stack.ts` | CSP with challenges.cloudflare.com in script-src and frame-src, VITE_TURNSTILE_SITE_KEY env var | ✓ VERIFIED | Line 108: challenges.cloudflare.com present in both script-src and frame-src. Lines 63-65: VITE_TURNSTILE_SITE_KEY in environmentVariables. Comment block at 89-92 documents D-05. |
| `infra/lambda/contact/index.js` | Server-side Turnstile token verification before email dispatch | ✓ VERIFIED | Lines 6-7: TURNSTILE_SECRET and TURNSTILE_VERIFY_URL constants. Lines 25-42: verifyTurnstileToken() async function. Lines 81-99: TURNSTILE_SECRET-guarded verification block returning 403 for missing/invalid tokens. |
| `infra/lambda/contact/__tests__/index.test.js` | Tests for Turnstile verification (missing token, invalid token, valid token) | ✓ VERIFIED | Lines 11-16: TURNSTILE_SECRET set before require, global.fetch mocked. Lines 411-476: describe('Turnstile Verification') with 5 tests: missing token, invalid token, valid token, sourceIp forwarding, API error handling. All 27 tests pass (93 total across 4 test suites including cdk.out copies). |
| `infra/cdk.json` | notificationEmail context variable | ✓ VERIFIED | Line 23: "notificationEmail": "" present in context object. |

#### Plan 04-02 Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/types/turnstile.d.ts` | TypeScript declarations for window.turnstile API | ✓ VERIFIED | Contains interface Turnstile with render, reset, getResponse, isExpired, remove, execute methods. declare global extends Window with turnstile?: Turnstile. |
| `src/app/components/Contact.tsx` | Turnstile integration with lazy script loading and token management | ✓ VERIFIED | loadTurnstileScript() function, IntersectionObserver trigger, turnstile.render() call with full options, cf-turnstile-response in fetch body, expiry check before submit, cleanup useEffect. |
| `src/hooks/useFocusTrap.ts` | Custom hook for Tab key cycling within a container | ✓ VERIFIED | export function useFocusTrap with FOCUSABLE_SELECTOR; re-queries elements inside keydown handler; handles Shift+Tab (wrap to last) and Tab (wrap to first). |
| `src/app/components/Portfolio.tsx` | Focus trap in video modal, role=dialog, aria-modal, focus restore on close | ✓ VERIFIED | Line 6: import useFocusTrap. Line 164: useFocusTrap(modalRef, activeVideo !== null). Lines 171-175: triggerRef.current = document.activeElement in openVideo. Lines 182-185: requestAnimationFrame focus restore in closeVideo. Lines 371-374: role="dialog" aria-modal="true" aria-labelledby="modal-video-title". Line 429: id="modal-video-title" on h3. |
| `src/app/App.tsx` | Skip link component as first child | ✓ VERIFIED | Lines 17-26: SkipLink() component with href="#portfolio" and sr-only focus:not-sr-only classes. Line 61: renders as first child of root div. |

---

### Key Link Verification

#### Plan 04-01 Key Links

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `infra/lib/contact-stack.ts` | SNS topic | addAlarmAction(new SnsAction(alarmTopic)) | ✓ WIRED | 3 calls confirmed (grep returns count 3). lambdaErrorAlarm, api5xxAlarm, api4xxAlarm all wired. |
| `infra/lambda/contact/index.js` | Cloudflare siteverify API | fetch POST to challenges.cloudflare.com/turnstile/v0/siteverify | ✓ WIRED | Line 7: TURNSTILE_VERIFY_URL constant. Line 27: fetch(TURNSTILE_VERIFY_URL, { method: 'POST', ... }) inside verifyTurnstileToken(). |
| `infra/lib/amplify-hosting-stack.ts` | CSP header | challenges.cloudflare.com in script-src and frame-src | ✓ WIRED | Line 108: single-line CSP value contains https://challenges.cloudflare.com in script-src and frame-src directives. |

#### Plan 04-02 Key Links

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/app/components/Contact.tsx` | Cloudflare Turnstile script | Dynamic script injection with IntersectionObserver trigger | ✓ WIRED | Line 37: src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'. IntersectionObserver on turnstileContainerRef triggers loadTurnstileScript() then window.turnstile.render(). |
| `src/app/components/Contact.tsx` | Lambda API | fetch POST with cf-turnstile-response in body | ✓ WIRED | Line 159: 'cf-turnstile-response': turnstileToken included in JSON.stringify({...formData, ...}). |
| `src/app/components/Portfolio.tsx` | `src/hooks/useFocusTrap.ts` | import and call with modalRef + isActive | ✓ WIRED | Line 6: import { useFocusTrap } from '../../hooks/useFocusTrap'. Line 164: useFocusTrap(modalRef, activeVideo !== null). |
| `src/app/App.tsx` | #portfolio section | Skip link href | ✓ WIRED | Line 20: href="#portfolio". Portfolio section has id="portfolio" at Portfolio.tsx line 256. |

---

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|-------------------|--------|
| `Contact.tsx` | turnstileToken | window.turnstile callback → setState | Populated by Cloudflare Turnstile widget at runtime | ✓ FLOWING — token populated via callback, consumed in fetch body |
| `Contact.tsx` | formData | Controlled inputs via handleChange | User input via onChange handlers | ✓ FLOWING — formData fields map to input elements via value+onChange |
| `Portfolio.tsx` | activeVideo | openVideo() click handlers on video cards | Video data from config/videos.ts constants | ✓ FLOWING — gridVideos/featuredVideo real data; modal renders activeVideo.title, .description |

---

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| All Lambda tests pass (22 existing + 5 Turnstile) | npx jest --verbose (run from /infra) | 93 tests pass across 4 suites; Turnstile Verification describe block: 5/5 passing | ✓ PASS |
| addAlarmAction wired to all 3 alarms | grep -c 'addAlarmAction' infra/lib/contact-stack.ts | 3 | ✓ PASS |
| challenges.cloudflare.com in CSP | grep in amplify-hosting-stack.ts | Found in both script-src and frame-src on line 108 | ✓ PASS |

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| INFRA-05 | 04-01-PLAN.md | CloudWatch alarms notify via SNS when Lambda errors or API 5xx/4xx thresholds are breached | ✓ SATISFIED | SNS topic created, email subscription guarded by notificationEmail prop, all 3 alarms wired via addAlarmAction. notificationEmail placeholder in cdk.json. |
| PERF-03 | 04-01-PLAN.md + 04-02-PLAN.md | Contact form protected by Cloudflare Turnstile invisible CAPTCHA with server-side verification in Lambda | ✓ SATISFIED | Server-side: verifyTurnstileToken() in Lambda with TURNSTILE_SECRET guard and 403 responses. Client-side: invisible widget with lazy loading, token state, cf-turnstile-response in submission body, expiry handling. |
| QUAL-02 | 04-02-PLAN.md | Site passes basic accessibility audit — skip links, focus management in modal, alt text on images, reduced motion support via useReducedMotion | ✗ BLOCKED (partial) | Skip link: present in App.tsx. Focus trap: useFocusTrap wired in Portfolio.tsx modal with role=dialog, aria-modal, focus restore. Alt text: audit completed in plan (no changes needed). Reduced motion: NOT implemented for section animations. Only Preloader.tsx uses useReducedMotion(). QUAL-02 explicitly lists "reduced motion support via useReducedMotion" as a criterion. Neither plan's must_haves addressed this. |

**Orphaned requirements check:** REQUIREMENTS.md Traceability table maps INFRA-05 (Phase 4), PERF-03 (Phase 4), QUAL-02 (Phase 4). All three appear in plan frontmatter. No orphaned requirements.

---

### Anti-Patterns Found

| File | Pattern | Severity | Impact |
|------|---------|----------|--------|
| `src/app/components/Preloader.tsx` | useReducedMotion used for pulse animation only — exit/scale transitions on the preloader container itself do not respect shouldReduceMotion | ℹ Info | Minor: preloader exit animation runs even when user prefers reduced motion, though the pulse animation correctly stops |
| `infra/cdk.json` | notificationEmail: "" (empty string) | ℹ Info | Intentional placeholder documented in SUMMARY. SNS subscription guarded by `if (props.notificationEmail)` — no notification will fire until user fills this in. |
| `amplify-hosting-stack.ts` VITE_TURNSTILE_SITE_KEY: "" | Empty value in CDK | ℹ Info | Intentional — documented in SUMMARY as "Set in Amplify Console after Turnstile widget creation". Frontend gracefully degrades when key is unset. |

No blockers from anti-pattern scan in Phase 4 files. Existing pre-phase stubs (SectionErrorBoundary.tsx, videos.ts tsc errors) are pre-existing and out of scope per prompt instructions.

---

### Human Verification Required

#### 1. SNS email notification fires on alarm

**Test:** Deploy the CDK stack with a real notificationEmail in cdk.json. Trigger a Lambda error above the threshold (5 errors in 5 minutes) via the production API. Check inbox.
**Expected:** Email arrives from AWS Notifications within 1-2 minutes of threshold breach.
**Why human:** Cannot test SNS→email delivery path programmatically without live AWS environment and SES-verified sender.

#### 2. Turnstile widget renders visibly on contact form scroll

**Test:** Navigate to stealinglight.hk on a desktop browser. Scroll to the Contact section. Open DevTools Network tab and observe requests.
**Expected:** A request to challenges.cloudflare.com/turnstile/v0/api.js fires when the contact section enters viewport (within ~200px). No Turnstile challenge UI appears for normal users (invisible widget). No console errors.
**Why human:** Requires live Cloudflare Turnstile site key (VITE_TURNSTILE_SITE_KEY not set in dev environment) and browser interaction.

#### 3. Contact form submission rejected without Turnstile token in production

**Test:** With VITE_TURNSTILE_SITE_KEY set but TURNSTILE_SECRET not configured on Lambda, attempt form submission. Then test with both configured.
**Expected:** 403 with "Verification token missing" when token absent; 200 success when token valid.
**Why human:** Requires live Cloudflare keys and AWS deployment.

#### 4. Tab key visible focus on skip link (keyboard navigation smoke test)

**Test:** Load the site in a browser. Press Tab. Observe that the skip link "Skip to content" appears at top-left with cinematic-amber background. Press Enter. Observe that viewport scrolls to the portfolio section.
**Expected:** Skip link visible on first Tab press at z-[60], amber background, keyboard-activatable.
**Why human:** Visual rendering and scroll behavior require a browser.

#### 5. Prefers-reduced-motion: section animations stop when OS setting enabled (BLOCKED — gap)

**Test:** Enable "Reduce Motion" in macOS/iOS Accessibility settings. Load the site and scroll through sections.
**Expected (per QUAL-02):** Scroll-triggered Motion animations in Hero, Portfolio, About, Services, Contact, Footer, Clients should not play kinetic animations. Currently FAILS — these components use motion.div with whileInView without checking useReducedMotion().
**Why human:** Requires OS accessibility setting change and visual inspection.

---

### Gaps Summary

**One gap blocks full QUAL-02 satisfaction:** The `prefers-reduced-motion` requirement is explicitly named in both REQUIREMENTS.md (QUAL-02: "reduced motion support via useReducedMotion") and the Phase 4 ROADMAP success criteria ("animations respect prefers-reduced-motion"). Neither 04-01-PLAN.md nor 04-02-PLAN.md included this as a must-have truth or artifact. The 04-02 SUMMARY claims `requirements-completed: [PERF-03, QUAL-02]` but the reduced-motion criterion was not planned or implemented.

**What exists:** Preloader.tsx correctly uses `useReducedMotion()` to skip the pulse animation. The CSS marquee in theme.css pauses via `@media (prefers-reduced-motion: reduce)`.

**What is missing:** The 8 animated section components (Hero, Portfolio, About, Services, Contact, Footer, Navigation, Clients) use `motion` with `whileInView`, `initial`, and `animate` props without any `useReducedMotion()` guard. A user who has enabled "Reduce Motion" in their OS will still see all kinetic scroll animations.

**Scope of the fix:** Add `const shouldReduceMotion = useReducedMotion()` to each animated component and either (a) pass `shouldReduceMotion ? {} : { initial, animate }` props to remove entrance animations, or (b) set `viewport={{ once: true }}` motion values to static when reduced motion is preferred. This is a contained, predictable change.

**All other must-haves are fully satisfied.** All 3 CloudWatch alarms are wired to SNS. Lambda verifies Turnstile tokens server-side with correct 403 responses. CSP allows Turnstile. VITE_TURNSTILE_SITE_KEY is available as Amplify env var. Frontend lazy-loads Turnstile, stores token, and includes it in submission. Skip link is first focusable element. Focus trap works in video modal with ARIA attributes. Focus restore on close is implemented. Alt text audit confirmed correct. 93 Lambda tests pass.

---

_Verified: 2026-04-01T15:30:00Z_
_Verifier: Claude (gsd-verifier)_
