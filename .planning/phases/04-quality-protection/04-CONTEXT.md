# Phase 4: Quality & Protection - Context

**Gathered:** 2026-03-31
**Status:** Ready for planning

<domain>
## Phase Boundary

Make the finished site accessible, protected from contact form spam, and monitored for production failures. Three capabilities: Cloudflare Turnstile bot protection on the contact form, lightweight accessibility improvements (skip link, focus trap, alt text), and CloudWatch alarm notification via SNS email. No visual changes, no new features, no aesthetic modifications.

</domain>

<decisions>
## Implementation Decisions

### Turnstile Bot Protection

- **D-01:** Invisible Turnstile widget — challenge runs in background with zero user friction. Falls back to visible challenge only if Cloudflare flags suspicious behavior. Appropriate for a low-traffic portfolio site.
- **D-02:** Lazy-load Turnstile script — load the Turnstile JS only when the Contact section enters the viewport (IntersectionObserver). No impact on initial page load or LCP.
- **D-03:** Verification failure UX — show sonner toast error ("Verification failed, please try again") and re-render the challenge. Consistent with existing contact form error patterns (toast.error).
- **D-04:** Server-side verification — Lambda handler must verify the Turnstile token via Cloudflare's siteverify API before processing the email. Reject with 403 if token is invalid or missing. The Turnstile secret key should be an environment variable in the Lambda (set via CDK).
- **D-05:** CSP update — add `challenges.cloudflare.com` to script-src and frame-src in the Amplify hosting stack custom headers to allow the Turnstile script and iframe.

### Accessibility (Light Touch)

- **D-06:** Scope is deliberately light — focus on structural accessibility (skip link, focus trap, alt text) without changing any visual aesthetics or animation behavior. The site is a portfolio with low accessibility traffic expectations.
- **D-07:** Skip link — visible on focus, navigates to the portfolio section (`#portfolio`). This skips past the auto-playing hero video, which is the main barrier for screen reader users.
- **D-08:** Modal focus trap — full focus cycling within the video modal (Tab cycles through close/prev/next/video controls only). Focus returns to the trigger element on modal close. Phase 3 added `tabIndex={-1}` and keyboard handlers but no Tab cycling.
- **D-09:** Alt text audit — ensure all `<img>` elements have meaningful alt text. Video poster images should describe the project. Client logos already have alt text from Phase 3.
- **D-10:** Reduced motion — DO NOT add new reduced motion support beyond what Phase 3 already implemented (useReducedMotion in Preloader, prefers-reduced-motion for marquee). The user explicitly chose not to alter animation aesthetics for this.
- **D-11:** No automated accessibility testing suite to add — use axe-core or Lighthouse manually during verification, but don't add a11y test infrastructure to CI.

### CloudWatch Alarm Notifications

- **D-12:** Single SNS topic — one topic for all existing alarms (Lambda errors, API Gateway 5xx, API Gateway 4xx abuse detection). Low-traffic portfolio site doesn't need severity-based routing.
- **D-13:** Email-only subscription — notification email address configurable via CDK context variable (e.g., `notificationEmail`). No Slack, PagerDuty, or other integrations.
- **D-14:** Alarm thresholds stay as-is — existing thresholds in contact-stack.ts (5 Lambda errors/5min, 5 API 5xx/5min, 50 API 4xx/5min) are reasonable. Only add the SNS action to fire notifications.

### CSP Strategy

- **D-15:** Accept `unsafe-inline` permanently for style-src — Motion/framer-motion injects inline styles at runtime for animations. Nonces cannot cover dynamically injected styles. This is a well-understood, permanent trade-off. Do NOT pursue nonce implementation.
- **D-16:** Keep `unsafe-inline` for script-src as-is — the GA4 inline snippet requires it. Not worth the Amplify custom header complexity for nonce injection on a portfolio site.

### Claude's Discretion

- Turnstile site key management approach (CDK context, environment variable, or SSM parameter)
- Exact focus trap implementation pattern (custom hook vs library)
- SNS topic naming convention
- Whether to update CSP in a single commit with Turnstile or as a separate concern

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Infrastructure
- `infra/lib/contact-stack.ts` — Existing CloudWatch alarms (lines 88-129), Lambda definition, API Gateway config
- `infra/lib/amplify-hosting-stack.ts` — CSP and security headers in customHeaders YAML
- `infra/lambda/contact/index.js` — Lambda handler that needs Turnstile token verification added
- `infra/bin/app.ts` — CDK app entry point, context values

### Frontend
- `src/app/components/Contact.tsx` — Contact form that needs Turnstile widget integration
- `src/app/components/Portfolio.tsx` — Video modal needing focus trap enhancement
- `src/app/components/Navigation.tsx` — Where skip link should render (before or within nav)
- `src/app/App.tsx` — Root component for skip link placement

### Prior Phase Context
- `.planning/phases/01-infrastructure-safety-net/01-CONTEXT.md` — Phase 1 CSP decisions (D-04, D-05) that established unsafe-inline
- `.planning/phases/03-visual-overhaul/03-CONTEXT.md` — Phase 3 reduced motion decisions and modal keyboard nav

### External Documentation
- Cloudflare Turnstile docs (researcher should fetch current API reference)
- Cloudflare siteverify API for server-side token validation

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `sonner` toast system — already used for contact form success/error, reuse for Turnstile failure toast
- `useInView` hook (`src/hooks/useInView.ts`) — IntersectionObserver pattern, could be used or adapted for lazy Turnstile script loading
- Contact form state management pattern — `useState<FormData>` with controlled inputs in Contact.tsx
- SectionErrorBoundary — wraps all sections, catches component-level errors

### Established Patterns
- CDK context values for configuration (`cdk.json` — appName, domainName, branch, environment)
- Lambda environment variables set via CDK (`contact-stack.ts` line 47)
- CORS handling in Lambda with `getCorsHeaders()` and `ALLOWED_ORIGINS`
- CSP configured as YAML string in Amplify hosting stack custom headers

### Integration Points
- Contact.tsx `handleSubmit` — where Turnstile token gets attached to the fetch body
- Lambda `handler` — where server-side Turnstile verification happens before SES dispatch
- contact-stack.ts CloudWatch alarms — where SNS alarm actions get added
- amplify-hosting-stack.ts customHeaders — where CSP gets Turnstile domains added
- App.tsx or Navigation.tsx — where skip link element gets added

</code_context>

<specifics>
## Specific Ideas

- User explicitly stated: "very, very light without changing any of the aesthetics" for accessibility
- Reduced motion is explicitly excluded from Phase 4 scope — Phase 3 implementations are sufficient
- Invisible Turnstile chosen specifically because it's a low-traffic portfolio site where spam risk is low but protection is prudent

</specifics>

<deferred>
## Deferred Ideas

- Full WCAG 2.2 AA audit — deferred to v2 (QUAL-04 in REQUIREMENTS.md)
- Automated a11y testing in CI — not needed for this site's scale
- CSP nonce implementation — permanently closed, not deferred (Motion makes it impractical)
- Slack/PagerDuty alarm integration — overkill for portfolio site

</deferred>

---

*Phase: 04-quality-protection*
*Context gathered: 2026-03-31*
