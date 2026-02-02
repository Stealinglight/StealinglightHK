# Security Controls Documentation

**Date:** 2026-02-01
**Status:** Implemented

---

## Overview

This document describes the security controls implemented for the Stealinglight portfolio website. Controls are organized by layer: pre-commit (local development), CI/CD pipeline, and runtime.

---

## Pre-commit Hooks

Located in `.husky/`

### Secret Detection (pre-commit)

**Purpose:** Prevent accidental commit of secrets

**Patterns detected:**
- AWS access keys (AKIA...)
- Private keys (BEGIN RSA/EC/OPENSSH PRIVATE KEY)
- Password assignments with 8+ character values
- Secret/token patterns with base64-like values

**Behavior:** Blocks commit if patterns found in staged files

### ESLint Security Rules (lint-staged)

**Purpose:** Catch insecure coding patterns

**Plugin:** `eslint-plugin-security`

**Rules enforced:**
- Detects unsafe regex patterns
- Flags dynamic require statements
- Warns about non-literal arguments to certain functions
- Checks for object injection vulnerabilities

**Behavior:** Auto-fixes where possible, blocks commit on unfixable errors

### Commit Message Validation (commit-msg)

**Purpose:** Enforce conventional commits for clear history

**Tool:** commitlint with @commitlint/config-conventional

**Types allowed:** feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert, security

---

## CI/CD Security Gates

Located in `.github/workflows/`

### Dependency Scanning (security.yml)

**Tool:** npm audit

**Triggers:** Every PR, push to main, weekly schedule

**Threshold:** High severity (fails build if high/critical vulnerabilities found)

**Coverage:** Root project + infra directory

### Static Analysis (security.yml)

**Tool:** GitHub CodeQL

**Languages:** JavaScript/TypeScript

**Queries:** security-extended, security-and-quality

**Triggers:** Every PR

### GitHub Native Secret Scanning

**Status:** Enabled at repository level

**Coverage:** All pushes, historical commits

### Workflow Permissions

All workflows use explicit least-privilege permissions:
- `contents: read` - minimum for checkout
- `id-token: write` - OIDC for AWS auth (no static credentials)
- Additional permissions only where required (e.g., `security-events: write` for CodeQL)

---

## Runtime Protections

### Security Headers (Amplify)

Configured in `infra/lib/amplify-hosting-stack.ts`

| Header | Value | Purpose |
|--------|-------|---------|
| Content-Security-Policy | See csp-policy.md | XSS prevention |
| X-Frame-Options | DENY | Clickjacking prevention |
| X-Content-Type-Options | nosniff | MIME sniffing prevention |
| Referrer-Policy | strict-origin-when-cross-origin | Referrer leak prevention |
| Strict-Transport-Security | max-age=31536000; includeSubDomains | Force HTTPS |
| Permissions-Policy | camera=(), microphone=(), etc. | Restrict browser APIs |

### API Rate Limiting

Configured in `infra/lib/contact-stack.ts`

| Limit | Value |
|-------|-------|
| Requests per second | 10 |
| Burst limit | 20 |

### CORS Protection

**Contact API:** Allowlist only (no wildcards)
- localhost:5173, localhost:3000 (development)
- stealinglight.hk, www.stealinglight.hk (production)

### Input Validation (Lambda)

| Field | Max Length | Validation |
|-------|------------|------------|
| name | 100 | Required, sanitized |
| email | 254 | Required, regex validated, sanitized |
| subject | 200 | Required, sanitized |
| message | 5000 | Required, sanitized |

Sanitization removes angle brackets to prevent HTML injection.

### CloudWatch Monitoring

Alarms configured for:
- Lambda errors (threshold: 5 in 5 minutes)
- API Gateway 5xx errors (threshold: 5 in 5 minutes)
- API Gateway 4xx errors (threshold: 50 in 5 minutes - abuse detection)

---

## Infrastructure Security

### S3 (Media Bucket)

- Block all public access
- S3-managed encryption at rest
- Enforce SSL for all requests
- CloudFront Origin Access Control (no direct access)

### CloudFront (Media CDN)

- HTTPS only (redirect HTTP)
- HTTP/2 and HTTP/3 enabled
- No direct bucket access (OAC)

### Lambda

- IAM permissions scoped to specific SES identities
- 15 second timeout
- CloudWatch logging enabled

### AWS Authentication (CI/CD)

- OIDC authentication (no static credentials)
- Role assumption via AWS_ROLE_ARN
- No secrets in code or environment files

---

## Verification

### To verify pre-commit hooks:

```bash
# Test secret detection (should fail)
echo "AKIAIOSFODNN7EXAMPLE" > test-secret.txt
git add test-secret.txt
git commit -m "test: secret detection"
# Expected: Commit blocked

# Cleanup
rm test-secret.txt
```

### To verify CI gates:

1. Create a PR with a vulnerable dependency
2. Observe security.yml workflow failure

### To verify security headers:

```bash
# After deployment
curl -I https://stealinglight.hk | grep -E "X-Frame|Content-Security|Strict-Transport"
```
