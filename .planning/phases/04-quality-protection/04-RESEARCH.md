# Phase 4: Quality & Protection - Research

**Researched:** 2026-03-31
**Domain:** Bot protection (Cloudflare Turnstile), accessibility (WCAG keyboard/structural), AWS monitoring (CloudWatch + SNS)
**Confidence:** HIGH

## Summary

Phase 4 adds three independent capabilities to the finished site: Cloudflare Turnstile invisible CAPTCHA on the contact form, lightweight structural accessibility improvements, and CloudWatch alarm notifications via SNS email. All three are well-documented, mature patterns with no experimental APIs or version-edge concerns.

The Turnstile integration is the most complex piece, requiring coordinated changes across four files (Contact.tsx, Lambda handler, contact-stack.ts, amplify-hosting-stack.ts). The frontend uses Turnstile's explicit rendering API with lazy script loading via IntersectionObserver. The Lambda handler adds a server-side siteverify call before processing the email. The CDK stack adds the Turnstile secret key as a Lambda environment variable. CSP headers gain `challenges.cloudflare.com` in script-src and frame-src.

Accessibility work is deliberately light per user decisions: a skip link in App.tsx, focus trapping in the video modal, and an alt text audit on existing images. The SNS notification work is purely additive CDK -- create one SNS topic, add an email subscription, wire it to the three existing CloudWatch alarms.

**Primary recommendation:** Implement as three independent work streams (Turnstile, accessibility, SNS alarms) that can be planned and executed in parallel without interference.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Invisible Turnstile widget -- challenge runs in background with zero user friction. Falls back to visible challenge only if Cloudflare flags suspicious behavior. Appropriate for a low-traffic portfolio site.
- **D-02:** Lazy-load Turnstile script -- load the Turnstile JS only when the Contact section enters the viewport (IntersectionObserver). No impact on initial page load or LCP.
- **D-03:** Verification failure UX -- show sonner toast error ("Verification failed, please try again") and re-render the challenge. Consistent with existing contact form error patterns (toast.error).
- **D-04:** Server-side verification -- Lambda handler must verify the Turnstile token via Cloudflare's siteverify API before processing the email. Reject with 403 if token is invalid or missing. The Turnstile secret key should be an environment variable in the Lambda (set via CDK).
- **D-05:** CSP update -- add `challenges.cloudflare.com` to script-src and frame-src in the Amplify hosting stack custom headers to allow the Turnstile script and iframe.
- **D-06:** Scope is deliberately light -- focus on structural accessibility (skip link, focus trap, alt text) without changing any visual aesthetics or animation behavior.
- **D-07:** Skip link -- visible on focus, navigates to the portfolio section (`#portfolio`). This skips past the auto-playing hero video.
- **D-08:** Modal focus trap -- full focus cycling within the video modal (Tab cycles through close/prev/next/video controls only). Focus returns to the trigger element on modal close.
- **D-09:** Alt text audit -- ensure all `<img>` elements have meaningful alt text. Video poster images should describe the project. Client logos already have alt text from Phase 3.
- **D-10:** Reduced motion -- DO NOT add new reduced motion support beyond what Phase 3 already implemented (useReducedMotion in Preloader, prefers-reduced-motion for marquee).
- **D-11:** No automated accessibility testing suite to add -- use axe-core or Lighthouse manually during verification.
- **D-12:** Single SNS topic -- one topic for all existing alarms (Lambda errors, API Gateway 5xx, API Gateway 4xx).
- **D-13:** Email-only subscription -- notification email address configurable via CDK context variable (e.g., `notificationEmail`).
- **D-14:** Alarm thresholds stay as-is -- only add the SNS action to fire notifications.
- **D-15:** Accept `unsafe-inline` permanently for style-src -- Motion injects inline styles. Do NOT pursue nonce implementation.
- **D-16:** Keep `unsafe-inline` for script-src as-is -- GA4 inline snippet requires it.

### Claude's Discretion

- Turnstile site key management approach (CDK context, environment variable, or SSM parameter)
- Exact focus trap implementation pattern (custom hook vs library)
- SNS topic naming convention
- Whether to update CSP in a single commit with Turnstile or as a separate concern

### Deferred Ideas (OUT OF SCOPE)

- Full WCAG 2.2 AA audit -- deferred to v2 (QUAL-04 in REQUIREMENTS.md)
- Automated a11y testing in CI -- not needed for this site's scale
- CSP nonce implementation -- permanently closed, not deferred (Motion makes it impractical)
- Slack/PagerDuty alarm integration -- overkill for portfolio site
  </user_constraints>

<phase_requirements>

## Phase Requirements

| ID       | Description                                                                                                                                     | Research Support                                                                                                                          |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| INFRA-05 | CloudWatch alarms notify via SNS when Lambda errors or API 5xx/4xx thresholds are breached                                                      | SNS topic + email subscription + alarm actions in CDK; three existing alarms in contact-stack.ts lines 88-129 need `addAlarmAction` calls |
| PERF-03  | Contact form protected by Cloudflare Turnstile invisible CAPTCHA with server-side verification in Lambda                                        | Turnstile explicit rendering API, lazy script loading, Lambda siteverify integration, CSP updates                                         |
| QUAL-02  | Site passes basic accessibility audit -- skip links, focus management in modal, alt text on images, reduced motion support via useReducedMotion | Skip link in App.tsx, focus trap in Portfolio.tsx modal, alt text audit on Hero.tsx images; reduced motion already done in Phase 3        |

</phase_requirements>

## Standard Stack

### Core

No new npm packages required. All implementations use browser APIs, CDK constructs, or Cloudflare's hosted script.

| Library/API                        | Version     | Purpose                             | Why Standard                                                                     |
| ---------------------------------- | ----------- | ----------------------------------- | -------------------------------------------------------------------------------- |
| Cloudflare Turnstile JS            | v0 (hosted) | Client-side bot verification widget | Official Cloudflare CDN script; no npm package needed                            |
| Turnstile siteverify API           | v0          | Server-side token validation        | REST endpoint at challenges.cloudflare.com; Lambda uses Node.js built-in `fetch` |
| aws-cdk-lib/aws-sns                | 2.245.0+    | SNS topic for alarm notifications   | Already installed in infra; standard CDK construct                               |
| aws-cdk-lib/aws-sns-subscriptions  | 2.245.0+    | Email subscription to SNS topic     | Part of aws-cdk-lib; no additional dependency                                    |
| aws-cdk-lib/aws-cloudwatch-actions | 2.245.0+    | SnsAction to wire alarms to SNS     | Part of aws-cdk-lib; no additional dependency                                    |

### Alternatives Considered

| Instead of                             | Could Use                                                | Tradeoff                                                                                                                                           |
| -------------------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Raw Turnstile API (explicit rendering) | `@marsidev/react-turnstile` v1.5.0 (React 19 compatible) | Wrapper adds convenience but limits lazy-load control per D-02; raw API keeps dependencies at zero and gives full IntersectionObserver control     |
| Custom focus trap hook                 | `focus-trap-react` library                               | Library handles edge cases (shadow DOM, iframes) but is overkill for a single modal with 4-5 focusable elements; custom 30-line hook is sufficient |

### Discretion Recommendations

**Turnstile site key management:** Use Vite environment variable `VITE_TURNSTILE_SITE_KEY` for the frontend (consistent with existing `VITE_CONTACT_API_URL` and `VITE_CDN_BASE_URL` patterns). The secret key goes in Lambda env via CDK. For local development, use Cloudflare's test keys (see Code Examples below).

**Focus trap pattern:** Custom `useFocusTrap` hook. The modal has exactly 4 interactive elements (close, prev, next, video controls). A 30-line hook is simpler than adding a dependency.

**SNS topic naming:** `${appName}-alarm-notifications` -- consistent with existing CDK naming (`${appName}-contact-lambda-errors`, `${appName}-contact-api-5xx`).

**CSP update:** Bundle CSP changes with the Turnstile commit. The CSP change only makes sense in context of Turnstile and should ship atomically.

## Architecture Patterns

### Turnstile Integration Flow

```
Contact section enters viewport
  -> IntersectionObserver fires
  -> <script> tag injected for challenges.cloudflare.com/turnstile/v0/api.js
  -> turnstile.render() called on container div (explicit mode)
  -> Invisible challenge runs in background
  -> onSuccess callback stores token in React state
  -> Form submit attaches token to POST body as "cf-turnstile-response"
  -> Lambda receives token
  -> Lambda calls siteverify API with secret + token
  -> If success: proceed with email
  -> If failure: return 403
```

### Modified Contact.tsx Data Flow

```
Contact.tsx
  ├── State: formData, isSubmitting, showPhone, turnstileToken
  ├── Ref: turnstileWidgetId (for reset on failure)
  ├── Effect: lazy-load script when section enters view (useInView or useEffect+IntersectionObserver)
  ├── Effect: render Turnstile widget after script loads
  ├── Callback: onTurnstileSuccess(token) -> setTurnstileToken(token)
  ├── Callback: onTurnstileError() -> toast.error + turnstile.reset()
  ├── handleSubmit: attach turnstileToken to fetch body
  └── On 403 response: toast.error("Verification failed") + turnstile.reset()
```

### Modified Lambda Handler Flow

```
Lambda index.js
  handler(event)
    ├── CORS check (existing)
    ├── OPTIONS handling (existing)
    ├── Parse body (existing)
    ├── Extract cf-turnstile-response from body  <-- NEW
    ├── Call siteverify API with TURNSTILE_SECRET + token + sourceIp  <-- NEW
    ├── If !success: return 403 "Verification failed"  <-- NEW
    ├── Input validation (existing)
    ├── Sanitization (existing)
    └── SES send (existing)
```

### SNS Alarm Architecture

```
contact-stack.ts
  ├── new sns.Topic('AlarmNotifications')
  ├── topic.addSubscription(new EmailSubscription(notificationEmail))
  ├── lambdaErrorAlarm.addAlarmAction(new SnsAction(topic))
  ├── api5xxAlarm.addAlarmAction(new SnsAction(topic))
  └── api4xxAlarm.addAlarmAction(new SnsAction(topic))
```

### Skip Link Placement

```
App.tsx
  <div className="size-full bg-cinematic-black">
    <SkipLink />              <-- NEW: first focusable element
    <AnimatePresence>...</AnimatePresence>
    <ScrollProgress />
    <Navigation />
    ...
  </div>
```

### Anti-Patterns to Avoid

- **Loading Turnstile script eagerly in index.html:** Violates D-02. The script is ~40KB and should only load when the contact section is visible.
- **Storing Turnstile secret in frontend code:** The secret key MUST only exist in the Lambda environment. The frontend only needs the site key.
- **Client-only Turnstile verification:** Tokens MUST be verified server-side. Client-side token presence is a UX check, not a security check.
- **Adding focus-trap-react for one modal:** Unnecessary dependency for 4 focusable elements. A custom hook is more appropriate.

## Don't Hand-Roll

| Problem                  | Don't Build                      | Use Instead                                       | Why                                                                                    |
| ------------------------ | -------------------------------- | ------------------------------------------------- | -------------------------------------------------------------------------------------- |
| CAPTCHA/bot detection    | Custom honeypot or rate limiting | Cloudflare Turnstile                              | Cloudflare's ML-based detection is orders of magnitude better than any custom approach |
| SNS topic + subscription | Custom email notification Lambda | CDK SNS constructs                                | aws-cdk-lib handles IAM policies, subscription confirmation, and delivery retries      |
| CSP header construction  | Manual string concatenation      | Existing YAML pattern in amplify-hosting-stack.ts | Maintain consistency with Phase 1's CSP approach                                       |

## Common Pitfalls

### Pitfall 1: Turnstile Token Expiry (300 seconds)

**What goes wrong:** User fills out a long form message, token expires before submit, server-side verification fails silently.
**Why it happens:** Turnstile tokens expire 5 minutes after generation. Long form sessions can exceed this.
**How to avoid:** On form submit, check `turnstile.isExpired(widgetId)`. If expired, call `turnstile.reset(widgetId)` and wait for new token before submitting. Show a brief toast: "Refreshing verification..."
**Warning signs:** Intermittent 403 errors in production that users report as "form broken."

### Pitfall 2: Turnstile Script Loading Race Condition

**What goes wrong:** `turnstile.render()` called before the script has finished loading, causing `turnstile is not defined` error.
**Why it happens:** Script injection via DOM is async. The `api.js` script needs time to parse and define `window.turnstile`.
**How to avoid:** Use the `?onload=onTurnstileLoad` query parameter on the script URL, or poll `window.turnstile` existence before calling render. The `onload` callback approach is cleaner.
**Warning signs:** Console errors on slow connections or first-time visitors.

### Pitfall 3: SNS Email Subscription Requires Confirmation

**What goes wrong:** Alarms fire but no email is received.
**Why it happens:** SNS email subscriptions require the recipient to click a confirmation link in their inbox. Until confirmed, the subscription is in "PendingConfirmation" state and won't deliver.
**How to avoid:** After `cdk deploy`, immediately check the notification email inbox (including spam folder) for the AWS SNS confirmation email. Click "Confirm subscription."
**Warning signs:** `aws sns list-subscriptions-by-topic` shows status as "PendingConfirmation."

### Pitfall 4: Focus Trap Breaks When Modal Content Changes

**What goes wrong:** Arrow keys change the active video (navigateVideo), which re-renders the modal content. The focus trap's cached list of focusable elements becomes stale.
**Why it happens:** The focusable elements are queried once on mount, but the video element changes on navigation.
**How to avoid:** Re-query focusable elements on each Tab keydown, not on mount. Use `modalRef.current.querySelectorAll(FOCUSABLE_SELECTOR)` inside the keydown handler.
**Warning signs:** Tab key stops cycling after navigating between videos.

### Pitfall 5: CSP Blocks Turnstile iframe

**What goes wrong:** Turnstile widget renders but shows error or blank space.
**Why it happens:** Turnstile uses an iframe from `challenges.cloudflare.com`. If `frame-src` is not added to CSP, the iframe is blocked.
**How to avoid:** Add `https://challenges.cloudflare.com` to BOTH `script-src` and `frame-src` in the CSP header. The current CSP has no `frame-src` directive, so it falls back to `default-src 'self'` which blocks it.
**Warning signs:** Browser console shows "Refused to frame" CSP violation.

### Pitfall 6: Lambda fetch() Availability

**What goes wrong:** `fetch()` call to siteverify API fails with "fetch is not defined."
**Why it happens:** Older Node.js versions don't have global fetch.
**How to avoid:** The Lambda runtime is Node.js 22 (confirmed in contact-stack.ts line 42), which has stable global `fetch`. No polyfill needed.
**Warning signs:** None expected -- Node.js 22 has had stable fetch since v21.

### Pitfall 7: Hero Background Images Have Empty Alt Text

**What goes wrong:** Accessibility audit flags empty alt attributes.
**Why it happens:** Hero.tsx lines 85 and 91 have `alt=""` on the poster/fallback images. These are decorative (the content is conveyed by overlaid text), so empty alt is actually correct per WCAG for decorative images.
**How to avoid:** Leave Hero images with `alt=""` -- they are decorative. The video modal poster images in Portfolio.tsx already use `alt={project.title}`. Focus alt text audit on ensuring `<video>` poster attributes describe the content.
**Warning signs:** False positives from automated tools that don't understand decorative image context.

## Code Examples

### Turnstile Lazy Script Loading + Explicit Rendering

```typescript
// Source: Cloudflare Turnstile docs (client-side-rendering)
// Pattern for Contact.tsx

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';

// Lazy-load the Turnstile script (D-02)
function loadTurnstileScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.turnstile) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Turnstile'));
    document.head.appendChild(script);
  });
}

// Inside component: render widget after script loads
// turnstile.render returns a widgetId string
const widgetId = turnstile.render('#turnstile-container', {
  sitekey: TURNSTILE_SITE_KEY,
  callback: (token: string) => setTurnstileToken(token),
  'error-callback': () => {
    toast.error('Verification failed, please try again');
    turnstile.reset(widgetId);
  },
  'expired-callback': () => {
    setTurnstileToken('');
    turnstile.reset(widgetId);
  },
  theme: 'dark',
  appearance: 'interaction-only', // invisible unless suspicious
});
```

### Turnstile Global Type Declaration

```typescript
// src/types/turnstile.d.ts
interface TurnstileRenderOptions {
  sitekey: string;
  callback?: (token: string) => void;
  'error-callback'?: (errorCode?: string) => void;
  'expired-callback'?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  appearance?: 'always' | 'execute' | 'interaction-only';
  size?: 'normal' | 'compact' | 'flexible' | 'invisible';
  execution?: 'render' | 'execute';
}

interface Turnstile {
  render(container: string | HTMLElement, options: TurnstileRenderOptions): string;
  reset(widgetId: string): void;
  getResponse(widgetId: string): string | undefined;
  isExpired(widgetId: string): boolean;
  remove(widgetId: string): void;
  execute(container: string | HTMLElement): void;
}

declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

export {};
```

### Lambda Server-Side Verification

```javascript
// Source: Cloudflare Turnstile docs (server-side-validation)
// Pattern for infra/lambda/contact/index.js

const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET;
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

async function verifyTurnstileToken(token, remoteIp) {
  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: TURNSTILE_SECRET,
        response: token,
        remoteip: remoteIp,
      }),
    });
    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return false;
  }
}

// In handler, after CORS check and before input validation:
const turnstileToken = body['cf-turnstile-response'];
if (!turnstileToken) {
  return {
    statusCode: 403,
    headers,
    body: JSON.stringify({ error: 'Verification token missing' }),
  };
}

const isHuman = await verifyTurnstileToken(turnstileToken, sourceIp);
if (!isHuman) {
  return {
    statusCode: 403,
    headers,
    body: JSON.stringify({ error: 'Verification failed' }),
  };
}
```

### CDK SNS Topic + Alarm Actions

```typescript
// Source: AWS CDK v2 docs (aws-sns, aws-cloudwatch-actions)
// Pattern for infra/lib/contact-stack.ts

import * as sns from 'aws-cdk-lib/aws-sns';
import * as subscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import * as actions from 'aws-cdk-lib/aws-cloudwatch-actions';

// Create SNS topic for alarm notifications
const alarmTopic = new sns.Topic(this, 'AlarmNotifications', {
  displayName: `${props.appName} Alarm Notifications`,
});

// Add email subscription (requires confirmation click)
if (notificationEmail) {
  alarmTopic.addSubscription(new subscriptions.EmailSubscription(notificationEmail));
}

// Wire existing alarms to SNS topic
lambdaErrorAlarm.addAlarmAction(new actions.SnsAction(alarmTopic));
api5xxAlarm.addAlarmAction(new actions.SnsAction(alarmTopic));
api4xxAlarm.addAlarmAction(new actions.SnsAction(alarmTopic));
```

### CSP Update Pattern

```yaml
# Add to existing CSP in amplify-hosting-stack.ts customHeaders YAML
# script-src: add https://challenges.cloudflare.com
# frame-src: add as new directive (currently absent, falls back to default-src 'self')
#
# Before:
#   script-src 'self' 'unsafe-inline' https://*.googletagmanager.com;
# After:
#   script-src 'self' 'unsafe-inline' https://*.googletagmanager.com https://challenges.cloudflare.com;
#   frame-src 'self' https://challenges.cloudflare.com;
```

### Skip Link Component

```typescript
// Source: WAI-ARIA APG, WCAG 2.1 SC 2.4.1
// Pattern: visually hidden until focused, then visible

function SkipLink() {
  return (
    <a
      href="#portfolio"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-cinematic-amber focus:text-cinematic-black focus:font-semibold focus:rounded focus:outline-none"
    >
      Skip to content
    </a>
  );
}
```

### Focus Trap Hook

```typescript
// Source: WAI-ARIA APG Dialog Modal pattern
// Custom hook for trapping Tab within a container

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  'video[controls]',
].join(', ');

function useFocusTrap(containerRef: React.RefObject<HTMLElement | null>, isActive: boolean) {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      // Re-query each time (content may change on video navigation)
      const focusableElements =
        containerRef.current!.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (focusableElements.length === 0) return;

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    containerRef.current.addEventListener('keydown', handleKeyDown);
    return () => containerRef.current?.removeEventListener('keydown', handleKeyDown);
  }, [containerRef, isActive]);
}
```

### Turnstile Test Keys (for local development)

```typescript
// Source: Cloudflare Turnstile testing docs
// Use these in .env.local for development -- no Cloudflare account needed

// Invisible widget, always passes:
// VITE_TURNSTILE_SITE_KEY=1x00000000000000000000BB

// Test secret key, always passes:
// TURNSTILE_SECRET=1x0000000000000000000000000000000AA

// Invisible widget, always fails (for testing error handling):
// VITE_TURNSTILE_SITE_KEY=2x00000000000000000000BB
// TURNSTILE_SECRET=2x0000000000000000000000000000000AA
```

## State of the Art

| Old Approach                          | Current Approach                      | When Changed     | Impact                                                                     |
| ------------------------------------- | ------------------------------------- | ---------------- | -------------------------------------------------------------------------- |
| reCAPTCHA v2 checkbox                 | Cloudflare Turnstile invisible        | 2022             | Zero-friction UX, no Google dependency, free tier covers portfolio traffic |
| Manual focus trap implementation      | WAI-ARIA APG dialog pattern           | Ongoing standard | Consistent keyboard behavior expected by screen reader users               |
| CloudWatch console polling            | SNS email notifications               | Always available | Passive monitoring -- no need to check console for failures                |
| Google Fonts CDN link `unsafe-inline` | N/A -- permanently kept per D-15/D-16 | Phase 4 decision | No change; inline styles needed for Motion, inline scripts for GA4         |

## Existing Code Audit

### Alt Text Status

| Component        | Element                            | Current Alt                 | Action Needed                                      |
| ---------------- | ---------------------------------- | --------------------------- | -------------------------------------------------- |
| Hero.tsx:85      | Poster `<img>` (while video loads) | `alt=""`                    | None -- decorative (overlaid text conveys content) |
| Hero.tsx:91      | Fallback `<img>` (no video)        | `alt=""`                    | None -- decorative (same reasoning)                |
| Portfolio.tsx:82 | Grid thumbnail `<img>`             | `alt={project.title}`       | Adequate -- title describes the project            |
| About.tsx:18     | Profile photo `<img>`              | `alt="Chris McMillon"`      | Adequate                                           |
| Clients.tsx:55   | Logo `<img>` (first set)           | `alt={client.name}`         | Adequate                                           |
| Clients.tsx:55   | Logo `<img>` (duplicate set)       | `alt=""` with `aria-hidden` | Correct for duplicated marquee elements            |

**Video elements:** `<video>` elements do not support `alt` attributes. Accessibility for videos is handled via surrounding text (title, description) and `aria-label` on interactive controls. The modal video has a title and description below it (Portfolio.tsx:415-416). No action needed.

### Modal Focus Management Status

The video modal (Portfolio.tsx:356-422) currently has:

- `tabIndex={-1}` on the modal container (line 360) -- allows programmatic focus
- `aria-label` on close, prev, next buttons (lines 371, 383, 395)
- Keyboard handlers for Escape, ArrowLeft, ArrowRight, Space (lines 218-243)
- `modalRef.current?.focus()` on open (line 241)

**Missing (needed for D-08):**

- Tab cycling (focus trap) -- Tab currently escapes the modal into background content
- `role="dialog"` and `aria-modal="true"` on the modal container
- `aria-labelledby` pointing to the video title
- Focus return to trigger element on close

### Existing Reduced Motion Support

Per D-10, no new work needed. Current implementations:

- Preloader.tsx: `useReducedMotion()` from Motion -- disables pulsing animation
- theme.css: `@media (prefers-reduced-motion: reduce)` -- pauses marquee animation

## Open Questions

1. **Cloudflare Turnstile account setup**
   - What we know: Need a Cloudflare account, create a Turnstile widget, get site key + secret key
   - What's unclear: Whether the user already has a Cloudflare account or needs to create one
   - Recommendation: Use test keys for development/CI. Document production key setup as a manual post-deploy step.

2. **Turnstile privacy policy requirement**
   - What we know: Cloudflare requires sites using invisible Turnstile to reference Cloudflare's Turnstile Privacy Addendum in their own privacy policy
   - What's unclear: Whether the site has a privacy policy page
   - Recommendation: Flag as a non-code task for the site owner. Not blocking for implementation.

3. **SNS notification email address**
   - What we know: Configurable via CDK context (`notificationEmail`)
   - What's unclear: Which email address the user wants to receive alarm notifications
   - Recommendation: Add `notificationEmail` to cdk.json context with a placeholder. User sets the real address before deploying.

## Environment Availability

| Dependency               | Required By                  | Available      | Version  | Fallback                |
| ------------------------ | ---------------------------- | -------------- | -------- | ----------------------- |
| Node.js 22               | Lambda runtime, global fetch | Yes            | 22.21.0  | --                      |
| aws-cdk-lib              | SNS, CloudWatch actions      | Yes            | ^2.245.0 | --                      |
| Cloudflare Turnstile CDN | Client-side widget           | Yes (external) | v0 API   | Test keys for local dev |
| Turnstile siteverify API | Server-side verification     | Yes (external) | v0       | --                      |

**Missing dependencies with no fallback:** None.

**Missing dependencies with fallback:** None.

## Sources

### Primary (HIGH confidence)

- Cloudflare Turnstile client-side docs: https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/ -- explicit rendering API, script URL, callback parameters
- Cloudflare Turnstile server-side docs: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/ -- siteverify endpoint, request/response format, Node.js example
- Cloudflare Turnstile testing docs: https://developers.cloudflare.com/turnstile/troubleshooting/testing/ -- test site keys and secret keys
- AWS CDK v2 SNS docs: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_sns-readme.html -- Topic creation, email subscriptions
- AWS CDK v2 CloudWatch Actions docs: https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_cloudwatch_actions-readme.html -- SnsAction for alarms
- WAI-ARIA APG Dialog Modal pattern: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/ -- focus trap requirements, keyboard interactions, ARIA attributes
- Existing codebase: contact-stack.ts (alarms lines 88-129), amplify-hosting-stack.ts (CSP line 104), Contact.tsx (form handler), Portfolio.tsx (modal), Lambda index.js

### Secondary (MEDIUM confidence)

- @marsidev/react-turnstile npm: v1.5.0 supports React 19 -- evaluated as alternative but raw API preferred for lazy-load control

### Tertiary (LOW confidence)

- None.

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH -- all components are well-documented, official APIs with no experimental features
- Architecture: HIGH -- patterns derived from official docs and verified against existing codebase structure
- Pitfalls: HIGH -- based on Cloudflare docs (token expiry), CDK docs (SNS confirmation), and direct code inspection (focus trap stale elements)

**Research date:** 2026-03-31
**Valid until:** 2026-04-30 (stable APIs, no fast-moving targets)
