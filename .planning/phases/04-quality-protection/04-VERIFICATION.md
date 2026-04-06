---
phase: 04-quality-protection
verified: 2026-04-01T16:45:00Z
status: passed
score: 11/11 must-haves verified
re_verification: true
re_verification_meta:
  previous_status: gaps_found
  previous_score: 10/11
  previous_verified: 2026-04-01T15:30:00Z
  gaps_closed:
    - "Animations respect prefers-reduced-motion (QUAL-02 success criterion)"
  gaps_remaining: []
  regressions: []
---

# Phase 4: Quality & Protection Verification Report

**Phase Goal:** The finished site is accessible, protected from bots, and monitored for failures
**Verified:** 2026-04-01T16:45:00Z
**Status:** passed
**Re-verification:** Yes — after gap closure via plan 04-03 (commit ee090f0)

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | CloudWatch alarms fire SNS notifications when thresholds are breached | ✓ VERIFIED | contact-stack.ts lines 138-151: SNS topic created, email subscription wired, all 3 alarms (lambdaErrorAlarm, api5xxAlarm, api4xxAlarm) call addAlarmAction(new SnsAction(alarmTopic)) |
| 2 | Lambda rejects contact form submissions without valid Turnstile token (403) | ✓ VERIFIED | index.js lines 81-99: if (TURNSTILE_SECRET) block returns 403 "Verification token missing" when cf-turnstile-response absent, 403 "Verification failed" when siteverify returns success: false |
| 3 | Lambda accepts submissions with valid Turnstile token and sends email | ✓ VERIFIED | index.js verifyTurnstileToken() calls siteverify; 93 Lambda tests pass including 5 Turnstile-specific tests |
| 4 | CSP headers allow Turnstile script and iframe from challenges.cloudflare.com | ✓ VERIFIED | amplify-hosting-stack.ts line 108: script-src contains https://challenges.cloudflare.com; frame-src 'self' https://challenges.cloudflare.com present in same CSP value |
| 5 | Turnstile site key is available to Amplify frontend build as environment variable | ✓ VERIFIED | amplify-hosting-stack.ts lines 63-65: VITE_TURNSTILE_SITE_KEY in environmentVariables array |
| 6 | Turnstile invisible widget renders in contact form when section enters viewport | ✓ VERIFIED | Contact.tsx: IntersectionObserver with 200px rootMargin triggers loadTurnstileScript() then window.turnstile.render() with appearance: 'interaction-only'; conditional div with ref={turnstileContainerRef} present |
| 7 | Contact form attaches Turnstile token to submission and handles verification failures with toast | ✓ VERIFIED | Contact.tsx line 159: 'cf-turnstile-response': turnstileToken in fetch body; handleSubmit checks token expiry and presence before submit; catch block resets widget |
| 8 | Skip link is the first focusable element and navigates to #portfolio on activation | ✓ VERIFIED | App.tsx lines 17-26: SkipLink component with href="#portfolio"; rendered as first child of root div before AnimatePresence; sr-only focus:not-sr-only class pattern |
| 9 | Tab key cycles within the video modal and does not escape to background content | ✓ VERIFIED | useFocusTrap.ts: FOCUSABLE_SELECTOR queries a[href], button, input, select, textarea, [tabindex], video[controls]; re-queries on each Tab press; Portfolio.tsx line 164: useFocusTrap(modalRef, activeVideo !== null) |
| 10 | Focus returns to the element that opened the modal when the modal closes | ✓ VERIFIED | Portfolio.tsx: triggerRef.current = document.activeElement in openVideo(); closeVideo() calls requestAnimationFrame(() => triggerRef.current?.focus()) |
| 11 | Animations respect prefers-reduced-motion | ✓ VERIFIED | All 8 section components now import useReducedMotion from 'motion/react' (2 occurrences each: import + declaration) and use shouldReduceMotion conditionals on entrance/scroll animations. Hero: 18 guarded usages. Portfolio: 7. About: 7. Services: 7. Contact: 10. Footer: 7. Navigation: 11. Clients: 7. whileHover/whileTap left unguarded (0 false guards confirmed). Committed in ee090f0. |

**Score:** 11/11 truths verified

---

### Required Artifacts

#### Plan 04-01 Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `infra/lib/contact-stack.ts` | SNS topic, alarm actions, TURNSTILE_SECRET env var, notificationEmail/turnstileSecret props | ✓ VERIFIED | Lines 7-9: sns/subscriptions/actions imports present. Lines 18-19: notificationEmail? and turnstileSecret? props. Line 54: TURNSTILE_SECRET: props.turnstileSecret \|\| ''. Lines 138-151: SNS topic, email subscription guarded by notificationEmail, 3x addAlarmAction calls. |
| `infra/lib/amplify-hosting-stack.ts` | CSP with challenges.cloudflare.com in script-src and frame-src, VITE_TURNSTILE_SITE_KEY env var | ✓ VERIFIED | Line 108: challenges.cloudflare.com present in both script-src and frame-src. Lines 63-65: VITE_TURNSTILE_SITE_KEY in environmentVariables. |
| `infra/lambda/contact/index.js` | Server-side Turnstile token verification before email dispatch | ✓ VERIFIED | Lines 6-7: TURNSTILE_SECRET and TURNSTILE_VERIFY_URL constants. Lines 25-42: verifyTurnstileToken() async function. Lines 81-99: TURNSTILE_SECRET-guarded verification block returning 403 for missing/invalid tokens. |
| `infra/lambda/contact/__tests__/index.test.js` | Tests for Turnstile verification (missing token, invalid token, valid token) | ✓ VERIFIED | Lines 411-476: describe('Turnstile Verification') with 5 tests. All 93 tests pass across 4 suites. |
| `infra/cdk.json` | notificationEmail context variable | ✓ VERIFIED | Line 23: "notificationEmail": "" present in context object. |

#### Plan 04-02 Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/types/turnstile.d.ts` | TypeScript declarations for window.turnstile API | ✓ VERIFIED | Contains interface Turnstile with render, reset, getResponse, isExpired, remove, execute methods. declare global extends Window with turnstile?: Turnstile. |
| `src/app/components/Contact.tsx` | Turnstile integration with lazy script loading and token management; useReducedMotion guard on entrance animations | ✓ VERIFIED | loadTurnstileScript() function, IntersectionObserver trigger, turnstile.render() call, cf-turnstile-response in fetch body. useReducedMotion import on line 1; shouldReduceMotion guards on heading, contact info grid, and form container motion.divs. |
| `src/hooks/useFocusTrap.ts` | Custom hook for Tab key cycling within a container | ✓ VERIFIED | export function useFocusTrap with FOCUSABLE_SELECTOR; re-queries elements inside keydown handler; handles Shift+Tab (wrap to last) and Tab (wrap to first). |
| `src/app/components/Portfolio.tsx` | Focus trap in video modal, role=dialog, aria-modal, focus restore on close; useReducedMotion guard on entrance animations | ✓ VERIFIED | useFocusTrap wired (line 164). role="dialog" aria-modal="true" aria-labelledby="modal-video-title". requestAnimationFrame focus restore. useReducedMotion import on line 1; shouldReduceMotion guards on heading and featured video entrance animations. Grid item AnimatePresence and modal animations correctly left unguarded. |
| `src/app/App.tsx` | Skip link component as first child | ✓ VERIFIED | Lines 17-26: SkipLink() component with href="#portfolio" and sr-only focus:not-sr-only classes. Line 61: renders as first child of root div. |

#### Plan 04-03 Artifacts (Gap Closure)

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/app/components/Hero.tsx` | useReducedMotion guard on all entrance animations | ✓ VERIFIED | Import line 1: motion, useReducedMotion, Variants. Line 53: const shouldReduceMotion = useReducedMotion(). 18 shouldReduceMotion usages guard: name trackingFade, headline fadeUpBlur, subtitle fadeUpBlur, CTAs fadeUp, scroll indicator fadeIn, chevron bounce animate+transition. whileHover/whileTap on CTA buttons left unguarded. |
| `src/app/components/About.tsx` | useReducedMotion guard on slide-in entrance animations | ✓ VERIFIED | Import line 1. Line 5: declaration. Guards on image column (x: -40) and text column (x: 40) initial/whileInView/transition props. 7 usages. |
| `src/app/components/Services.tsx` | useReducedMotion guard on heading and staggered card animations | ✓ VERIFIED | Import line 1. Line 32: declaration. Guards on heading motion.div and each service card motion.div in .map(). 7 usages. |
| `src/app/components/Contact.tsx` | useReducedMotion guard on section entrance animations | ✓ VERIFIED | Import line 1. Line 46: declaration (first line of Contact()). Guards on heading, contact info grid, and form container. 10 usages. whileHover/whileTap on submit button unguarded. |
| `src/app/components/Footer.tsx` | useReducedMotion guard on entrance animations; motion.div wrappers added | ✓ VERIFIED | Import line 1. Line 5: declaration. Footer upgraded with motion.div on grid container and copyright section. Both guarded via shouldReduceMotion conditionals. 7 usages. |
| `src/app/components/Navigation.tsx` | useReducedMotion guard on nav slide-in and mobile menu animations | ✓ VERIFIED | Import line 2. Line 6: declaration (first line of Navigation()). Guards on motion.nav initial/animate/transition, mobile menu overlay initial/animate/exit/transition, mobile menu items initial/animate/transition. 11 usages. |
| `src/app/components/Portfolio.tsx` | useReducedMotion guard on decorative entrance animations | ✓ VERIFIED | Import line 1. Line 154: declaration (first line of Portfolio()). Guards on heading and featured video entrance. Grid AnimatePresence items and modal animations correctly NOT guarded (functional). 7 usages. |
| `src/app/components/Clients.tsx` | useReducedMotion guard on heading and marquee container entrance | ✓ VERIFIED | Import line 1. Line 24: declaration. Guards on heading motion.div and marquee container motion.div. 7 usages. |

---

### Key Link Verification

#### Plan 04-01 Key Links

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `infra/lib/contact-stack.ts` | SNS topic | addAlarmAction(new SnsAction(alarmTopic)) | ✓ WIRED | 3 calls confirmed: lambdaErrorAlarm, api5xxAlarm, api4xxAlarm all wired. |
| `infra/lambda/contact/index.js` | Cloudflare siteverify API | fetch POST to challenges.cloudflare.com/turnstile/v0/siteverify | ✓ WIRED | TURNSTILE_VERIFY_URL constant. fetch(TURNSTILE_VERIFY_URL) inside verifyTurnstileToken(). |
| `infra/lib/amplify-hosting-stack.ts` | CSP header | challenges.cloudflare.com in script-src and frame-src | ✓ WIRED | Line 108: single-line CSP value contains https://challenges.cloudflare.com in both directives. |

#### Plan 04-02 Key Links

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `src/app/components/Contact.tsx` | Cloudflare Turnstile script | Dynamic script injection with IntersectionObserver trigger | ✓ WIRED | src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'. IntersectionObserver on turnstileContainerRef triggers loadTurnstileScript() then window.turnstile.render(). |
| `src/app/components/Contact.tsx` | Lambda API | fetch POST with cf-turnstile-response in body | ✓ WIRED | 'cf-turnstile-response': turnstileToken included in JSON.stringify({...formData, ...}). |
| `src/app/components/Portfolio.tsx` | `src/hooks/useFocusTrap.ts` | import and call with modalRef + isActive | ✓ WIRED | import { useFocusTrap } from '../../hooks/useFocusTrap'. useFocusTrap(modalRef, activeVideo !== null). |
| `src/app/App.tsx` | #portfolio section | Skip link href | ✓ WIRED | href="#portfolio". Portfolio section has id="portfolio". |

#### Plan 04-03 Key Links (Gap Closure)

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| All 8 section components | `motion/react` | import { useReducedMotion } from 'motion/react' | ✓ WIRED | All 8 files: import confirmed with 2 occurrences each (import line + declaration). grep count: each file returns exactly 2. |
| shouldReduceMotion variable | motion element props | conditional: shouldReduceMotion ? undefined : animationProps | ✓ WIRED | shouldReduceMotion usage count per file — Hero: 18, Portfolio: 7, About: 7, Services: 7, Contact: 10, Footer: 7, Navigation: 11, Clients: 7. Zero false guards on whileHover/whileTap confirmed. |

---

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|-------------------|--------|
| `Contact.tsx` | turnstileToken | window.turnstile callback → setState | Populated by Cloudflare Turnstile widget at runtime | ✓ FLOWING — token populated via callback, consumed in fetch body |
| `Contact.tsx` | formData | Controlled inputs via handleChange | User input via onChange handlers | ✓ FLOWING — formData fields map to input elements via value+onChange |
| `Portfolio.tsx` | activeVideo | openVideo() click handlers on video cards | Video data from config/videos.ts constants | ✓ FLOWING — gridVideos/featuredVideo real data; modal renders activeVideo.title, .description |
| `shouldReduceMotion` | Animation props across 8 components | useReducedMotion() hook from motion/react reads OS prefers-reduced-motion media query | Browser OS preference | ✓ FLOWING — hook reads real OS preference; conditional prop spread applies at render time |

---

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| All Lambda tests pass (22 existing + 5 Turnstile) | npx jest --verbose (run from /infra) | 93 tests pass across 4 suites | ✓ PASS |
| addAlarmAction wired to all 3 alarms | grep -c 'addAlarmAction' infra/lib/contact-stack.ts | 3 | ✓ PASS |
| challenges.cloudflare.com in CSP | grep in amplify-hosting-stack.ts | Found in both script-src and frame-src on line 108 | ✓ PASS |
| useReducedMotion import in all 8 components | grep -c "useReducedMotion" across 8 files | 2 per file (import + declaration) — all 8 confirmed | ✓ PASS |
| shouldReduceMotion used in all 8 components | grep -c "shouldReduceMotion" across 8 files | Hero: 18, Portfolio: 7, About: 7, Services: 7, Contact: 10, Footer: 7, Navigation: 11, Clients: 7 | ✓ PASS |
| whileHover/whileTap not wrapped in shouldReduceMotion | grep across all component files | 0 matches — user-initiated animations correctly left unguarded | ✓ PASS |
| Production build succeeds | npx vite build (documented in 04-03-SUMMARY.md) | 385.70 kB JS, 101.29 kB CSS — build passes | ✓ PASS |

---

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| INFRA-05 | 04-01-PLAN.md | CloudWatch alarms notify via SNS when Lambda errors or API 5xx/4xx thresholds are breached | ✓ SATISFIED | SNS topic created, email subscription guarded by notificationEmail prop, all 3 alarms wired via addAlarmAction. notificationEmail placeholder in cdk.json. Traceability table confirms Phase 4. |
| PERF-03 | 04-01-PLAN.md + 04-02-PLAN.md | Contact form protected by Cloudflare Turnstile invisible CAPTCHA with server-side verification in Lambda | ✓ SATISFIED | Server-side: verifyTurnstileToken() in Lambda with TURNSTILE_SECRET guard and 403 responses. Client-side: invisible widget with lazy loading, token state, cf-turnstile-response in submission body, expiry handling. Traceability table confirms Phase 4. |
| QUAL-02 | 04-02-PLAN.md + 04-03-PLAN.md | Site passes basic accessibility audit — skip links, focus management in modal, alt text on images, reduced motion support via useReducedMotion | ✓ SATISFIED | Skip link: present in App.tsx. Focus trap: useFocusTrap wired in Portfolio.tsx modal with role=dialog, aria-modal, focus restore. Alt text: audit completed. Reduced motion: ALL 8 section components now use useReducedMotion(); gap closed in commit ee090f0. Traceability table confirms Phase 4. |

**Orphaned requirements check:** REQUIREMENTS.md Traceability table maps INFRA-05, PERF-03, and QUAL-02 to Phase 4. All three appear in plan frontmatter across 04-01, 04-02, and 04-03. No orphaned requirements.

---

### Anti-Patterns Found

| File | Pattern | Severity | Impact |
|------|---------|----------|--------|
| `src/app/components/Preloader.tsx` | useReducedMotion used for pulse animation only — exit/scale transitions on the preloader container itself do not respect shouldReduceMotion | ℹ Info | Minor: preloader exit animation runs even when user prefers reduced motion, though the pulse animation correctly stops. Pre-existing issue, out of scope for Phase 4. |
| `infra/cdk.json` | notificationEmail: "" (empty string) | ℹ Info | Intentional placeholder. SNS subscription guarded by `if (props.notificationEmail)` — no notification will fire until user fills this in. |
| `amplify-hosting-stack.ts` VITE_TURNSTILE_SITE_KEY: "" | Empty value in CDK | ℹ Info | Intentional — set in Amplify Console after Turnstile widget creation. Frontend gracefully degrades when key is unset. |

No blockers in any Phase 4 files.

---

### Human Verification Required

#### 1. SNS email notification fires on alarm

**Test:** Deploy the CDK stack with a real notificationEmail in cdk.json. Trigger a Lambda error above the threshold (5 errors in 5 minutes) via the production API. Check inbox.
**Expected:** Email arrives from AWS Notifications within 1-2 minutes of threshold breach.
**Why human:** Cannot test SNS->email delivery path programmatically without live AWS environment.

#### 2. Turnstile widget renders visibly on contact form scroll

**Test:** Navigate to stealinglight.hk on a desktop browser. Scroll to the Contact section. Open DevTools Network tab and observe requests.
**Expected:** A request to challenges.cloudflare.com/turnstile/v0/api.js fires when the contact section enters viewport. No Turnstile challenge UI appears for normal users (invisible widget). No console errors.
**Why human:** Requires live Cloudflare Turnstile site key and browser interaction.

#### 3. Contact form submission rejected without Turnstile token in production

**Test:** With VITE_TURNSTILE_SITE_KEY set but TURNSTILE_SECRET not configured on Lambda, attempt form submission. Then test with both configured.
**Expected:** 403 with "Verification token missing" when token absent; 200 success when token valid.
**Why human:** Requires live Cloudflare keys and AWS deployment.

#### 4. Tab key visible focus on skip link (keyboard navigation smoke test)

**Test:** Load the site in a browser. Press Tab. Observe that the skip link "Skip to content" appears at top-left with cinematic-amber background. Press Enter. Observe that viewport scrolls to the portfolio section.
**Expected:** Skip link visible on first Tab press at z-[60], amber background, keyboard-activatable.
**Why human:** Visual rendering and scroll behavior require a browser.

#### 5. Prefers-reduced-motion: section animations stop when OS setting enabled

**Test:** Enable "Reduce Motion" in macOS/iOS Accessibility settings. Load the site and scroll through sections.
**Expected (per QUAL-02):** Scroll-triggered Motion animations in Hero, Portfolio, About, Services, Contact, Footer, Navigation, Clients do not play kinetic animations. Elements appear immediately in their final visible state. User-initiated hover/tap animations still respond normally.
**Why human:** Requires OS accessibility setting change and visual inspection. Code evidence is complete — this is a final runtime confirmation.

---

### Gap Closure Summary

**Gap closed:** "Animations respect prefers-reduced-motion (QUAL-02 success criterion)" — resolved in commit ee090f0 via plan 04-03.

**What was fixed:** All 8 animated section components (Hero, About, Services, Contact, Footer, Navigation, Portfolio, Clients) now import `useReducedMotion` from `motion/react` and use `const shouldReduceMotion = useReducedMotion()` to conditionally set `initial`, `animate`, `whileInView`, and `transition` props to `undefined` when the OS reports `prefers-reduced-motion: reduce`. User-initiated animations (`whileHover`, `whileTap`) were correctly left unguarded. Footer.tsx was upgraded with `motion.div` wrappers as a deviation from the plan (Footer had no prior motion elements) and immediately guarded.

**All 11 must-haves are now fully satisfied.** Phase goal achieved.

---

_Verified: 2026-04-01T16:45:00Z_
_Verifier: Claude (gsd-verifier)_
_Re-verification after: 04-03 gap closure (commit ee090f0)_
