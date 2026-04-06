---
phase: 04-quality-protection
plan: 01
subsystem: infra
tags: [aws-cdk, sns, cloudwatch, cloudflare-turnstile, lambda, csp, bot-protection]
requirements_completed: [INFRA-05]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: CDK stacks with CloudWatch alarms and CSP headers
provides:
  - SNS topic wired to all 3 CloudWatch alarms with email subscription
  - Lambda Turnstile server-side verification (siteverify API)
  - CSP allows challenges.cloudflare.com in script-src and frame-src
  - VITE_TURNSTILE_SITE_KEY Amplify environment variable
  - TURNSTILE_SECRET Lambda environment variable
  - notificationEmail CDK context placeholder
affects: [04-quality-protection plan 02 (frontend Turnstile widget)]

# Tech tracking
tech-stack:
  added: [aws-cdk-lib/aws-sns, aws-cdk-lib/aws-sns-subscriptions, aws-cdk-lib/aws-cloudwatch-actions]
  patterns: [SNS alarm actions for CloudWatch monitoring, Turnstile server-side token verification with env var guard]

key-files:
  created: []
  modified: [infra/lib/contact-stack.ts, infra/lib/amplify-hosting-stack.ts, infra/bin/app.ts, infra/cdk.json, infra/lambda/contact/index.js, infra/lambda/contact/__tests__/index.test.js]

key-decisions:
  - "Single SNS topic for all 3 alarms per D-12, keeping thresholds unchanged per D-14"
  - "TURNSTILE_SECRET env var guard allows Lambda to work without Turnstile in dev/staging"
  - "CSP unsafe-inline permanently accepted per D-15/D-16; no nonce implementation"

patterns-established:
  - "Turnstile verification before field validation in Lambda handler flow"
  - "Env var guard pattern: if (SECRET) { verify } -- graceful degradation when not configured"

requirements-completed: [INFRA-05, PERF-03]

# Metrics
duration: 5min
completed: 2026-04-01
---

# Phase 4 Plan 1: Infrastructure Quality & Protection Summary

**SNS alarm notifications wired to 3 CloudWatch alarms, Turnstile server-side verification in Lambda with 5 new tests, CSP updated for Cloudflare challenges**

## Performance

- **Duration:** 5 min
- **Started:** 2026-04-01T14:34:19Z
- **Completed:** 2026-04-01T14:39:17Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- All 3 existing CloudWatch alarms (Lambda errors, API 5xx, API 4xx) wired to a single SNS topic with configurable email subscription
- Lambda handler verifies Turnstile tokens server-side via Cloudflare siteverify API before processing email, returning 403 for missing/invalid tokens
- CSP updated to allow challenges.cloudflare.com in both script-src and frame-src for Turnstile widget
- 5 new Turnstile tests added; all 27 Lambda tests pass (22 existing + 5 new)

## Task Commits

Each task was committed atomically:

1. **Task 1: CDK infrastructure -- SNS alarm notifications and Turnstile environment wiring** - `31eea11` (feat)
2. **Task 2: Lambda Turnstile server-side verification and test updates** - `42bfeb8` (feat)

## Files Created/Modified
- `infra/lib/contact-stack.ts` - SNS topic, alarm actions, TURNSTILE_SECRET env var, notificationEmail/turnstileSecret props
- `infra/lib/amplify-hosting-stack.ts` - CSP with challenges.cloudflare.com, VITE_TURNSTILE_SITE_KEY env var, D-15/D-16 CSP comments
- `infra/bin/app.ts` - notificationEmail context and turnstileSecret env var wired to ContactStack props
- `infra/cdk.json` - notificationEmail placeholder in context
- `infra/lambda/contact/index.js` - verifyTurnstileToken function, Turnstile verification block with TURNSTILE_SECRET guard
- `infra/lambda/contact/__tests__/index.test.js` - 5 new Turnstile tests, fetch mock setup, cf-turnstile-response in all test bodies

## Decisions Made
- Single SNS topic for all 3 alarms (D-12) -- simplicity for a low-traffic portfolio site
- TURNSTILE_SECRET env var guard lets Lambda work without Turnstile in dev/staging (graceful degradation)
- CSP unsafe-inline permanently accepted per D-15 (Motion inline styles) and D-16 (GA4 inline snippet)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Added cf-turnstile-response token to all existing test bodies**
- **Found during:** Task 2 (Lambda test updates)
- **Issue:** Plan only added the token to the default createEvent helper, but 12 tests override the body with custom JSON.stringify, losing the token. These tests failed with 403 (Verification token missing) since TURNSTILE_SECRET is set in the test environment.
- **Fix:** Added `'cf-turnstile-response': 'test-token'` to all 12 test bodies that provide custom body overrides
- **Files modified:** infra/lambda/contact/__tests__/index.test.js
- **Verification:** All 27 tests pass
- **Committed in:** 42bfeb8 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Essential fix -- without it, 12 existing tests would fail. No scope creep.

## Issues Encountered
- infra node_modules not present in worktree; ran `npm install` to enable TypeScript compilation check

## User Setup Required

**External services require manual configuration before deployment:**

- **Cloudflare Turnstile:** Create a Turnstile widget for stealinglight.hk in Cloudflare Dashboard (Widget Type: Invisible). Set the resulting Secret Key as `TURNSTILE_SECRET` environment variable for CDK deploy. Set the Site Key as `VITE_TURNSTILE_SITE_KEY` in Amplify Console environment variables.
- **SNS Notification Email:** Set `notificationEmail` in `infra/cdk.json` context to the desired alert email address before deploying. After `cdk deploy`, confirm the SNS subscription by clicking the link in the confirmation email.

## Known Stubs
None -- all values are intentionally empty placeholders requiring user configuration (notificationEmail in cdk.json, VITE_TURNSTILE_SITE_KEY in Amplify env vars). These are infrastructure configuration points, not code stubs.

## Next Phase Readiness
- Backend fully prepared for Turnstile -- Plan 04-02 can wire the frontend Turnstile widget to this ready backend
- SNS alarms are ready to fire once notificationEmail is set and subscription confirmed
- CSP already allows Turnstile script and iframe loading

---
*Phase: 04-quality-protection*
*Completed: 2026-04-01*
