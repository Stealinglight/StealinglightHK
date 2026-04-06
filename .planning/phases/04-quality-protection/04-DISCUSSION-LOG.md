# Phase 4: Quality & Protection - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-03-31
**Phase:** 04-quality-protection
**Areas discussed:** Turnstile integration, Accessibility scope, Alarm notifications, CSP nonce strategy

---

## Turnstile Integration

### Widget type

| Option | Description | Selected |
|--------|-------------|----------|
| Invisible | Zero-friction, challenge runs in background, falls back to visible if suspicious | ✓ |
| Managed widget | Small badge near submit button, users may need to interact | |
| Non-interactive widget | Badge visible but no user interaction needed | |

**User's choice:** Invisible (Recommended)
**Notes:** Best for portfolio sites where spam risk is low

### Verification failure UX

| Option | Description | Selected |
|--------|-------------|----------|
| Toast error + retry | Show sonner toast and re-render challenge, consistent with existing pattern | ✓ |
| Inline error below form | Error message below submit button | |
| Silent retry then error | Auto-retry once, show error only on second failure | |

**User's choice:** Toast error + retry (Recommended)

### Script loading

| Option | Description | Selected |
|--------|-------------|----------|
| Lazy on Contact visible | Load via IntersectionObserver when Contact section enters viewport | ✓ |
| In index.html head | Global load on page load, ~30KB initial cost | |

**User's choice:** Lazy on Contact section visible (Recommended)

---

## Accessibility Scope

### Audit depth

| Option | Description | Selected |
|--------|-------------|----------|
| Targeted fixes | Focus on 4 requirements: skip links, modal focus trap, alt text, reduced motion | ✓ (modified) |
| Full WCAG 2.2 AA | Comprehensive audit including contrast, ARIA, landmarks, etc. | |
| Automated only | Run axe-core/Lighthouse, fix only flagged items | |

**User's choice:** Targeted fixes, but modified — explicitly exclude reduced motion changes. "Very, very light without changing any of the aesthetics."
**Notes:** User expects low accessibility traffic. Don't alter animations or visual effects. Focus on structural items (skip link, focus trap, alt text) only.

### Skip link target

| Option | Description | Selected |
|--------|-------------|----------|
| Skip to portfolio section | Skip past hero video + nav to main content | ✓ |
| Skip to main wrapper | Generic main content wrapper | |
| Multiple skip links | Skip to Portfolio, Contact, About | |

**User's choice:** Skip to portfolio section (Recommended)

### Focus trap depth

| Option | Description | Selected |
|--------|-------------|----------|
| Full focus trap | Tab cycles through modal controls, focus returns on close | ✓ |
| Keep Phase 3 approach | tabIndex={-1} + keyboard handlers, no Tab cycling | |

**User's choice:** Full focus trap (Recommended)

---

## Alarm Notifications

### Notification target

| Option | Description | Selected |
|--------|-------------|----------|
| Email only | Single SNS topic with email subscription | ✓ |
| Email + Slack webhook | SNS triggers both email and Slack Lambda | |
| You decide | Claude picks simplest approach | |

**User's choice:** Email only (Recommended)

### Topic structure

| Option | Description | Selected |
|--------|-------------|----------|
| Single topic | One SNS topic for all alarms | ✓ |
| Two topics by severity | Critical and Warning as separate topics | |

**User's choice:** Single topic (Recommended)

---

## CSP Nonce Strategy

### Approach

| Option | Description | Selected |
|--------|-------------|----------|
| Accept unsafe-inline | Permanent trade-off, Motion requires it for style-src | ✓ |
| Nonce for script-src only | Keep unsafe-inline for style-src, try nonces for scripts | |
| Full nonce implementation | Attempt nonces for both, high risk of breaking Motion | |

**User's choice:** Accept unsafe-inline (Recommended)
**Notes:** Permanently closes the nonce exploration that was deferred from Phase 1/2. Motion/framer-motion makes it impractical.

---

## Claude's Discretion

- Turnstile site key management approach
- Focus trap implementation pattern
- SNS topic naming
- CSP update commit strategy

## Deferred Ideas

- Full WCAG 2.2 AA audit (v2)
- Automated a11y CI testing
- Slack/PagerDuty alarm integration
