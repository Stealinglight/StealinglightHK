# Security Audit Findings

**Date:** 2026-02-01
**Status:** In Progress

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 0 |
| Medium | 1 |
| Low | 4 |

---

## Track 1.1: Dependencies & Secrets Scan

### Dependencies

**Status:** PASS

- `bun audit` reports no known vulnerabilities
- All packages at current versions

### Secrets Exposure

**Status:** PASS

| Check | Result |
|-------|--------|
| .env tracked in git | No (properly gitignored) |
| .env in git history | Never committed |
| AWS access keys (AKIA*) | None found |
| Private keys (PEM/RSA) | None found |
| API keys/tokens patterns | None in source (false positives in lockfiles only) |

### Build Output

**Status:** PASS

- No source maps in `dist/` folder
- Vite default config does not generate production source maps

---

## Track 1.2: Application Code Review

### React Patterns

**Status:** PASS with notes

| Pattern | Found | Risk |
|---------|-------|------|
| Unsafe HTML injection | 1 (chart.tsx) | LOW - shadcn/ui internal CSS injection, controlled data |
| Dynamic code evaluation | 0 | N/A |
| Direct DOM manipulation | 0 | N/A |

### Contact Form (Frontend)

**Status:** PASS

- Uses `type="email"` for browser validation
- Basic required field validation
- TypeScript provides type safety
- Data sent as JSON to Lambda (server-side validation is authoritative)

### Contact Form (Lambda Backend)

**Status:** PASS with notes

#### Security Controls Present:
- Email format validation (regex)
- Input sanitization (removes angle brackets)
- Length limits enforced (name:100, email:254, subject:200, message:5000)
- CORS allowlist validation
- Required field validation

#### Findings:

**[LOW-001] Minimal HTML Sanitization**
- **Location:** `infra/lambda/contact/index.ts:18-20`
- **Description:** `sanitize()` only removes angle bracket characters. More vectors exist for HTML context.
- **Impact:** Low - HTML email is rendered in owner's email client only. Not a web XSS vector.
- **Recommendation:** Consider using a proper HTML escaping function if paranoid, but current risk is acceptable.

**[LOW-002] Non-null Assertions on Environment Variables**
- **Location:** `infra/lambda/contact/index.ts:92-93`
- **Description:** Environment variables accessed with non-null assertions will throw if unset.
- **Impact:** Low - Lambda will fail on invocation, but this is a deployment misconfiguration issue, not security.
- **Recommendation:** Add startup validation for required env vars.

---

## Track 1.3: Infrastructure Audit

### S3 (Media Bucket)

**Status:** PASS

| Control | Status |
|---------|--------|
| Block public access | BLOCK_ALL |
| Encryption at rest | S3_MANAGED |
| Enforce SSL | Enabled |
| CloudFront OAC | Configured |

### CloudFront (Media CDN)

**Status:** PASS

| Control | Status |
|---------|--------|
| HTTPS enforcement | REDIRECT_TO_HTTPS |
| HTTP/2 + HTTP/3 | Enabled |
| Origin Access Control | Configured |

### Lambda (Contact Form)

**Status:** PASS

| Control | Status |
|---------|--------|
| IAM permissions | Scoped to specific SES identities |
| Timeout | 15 seconds |
| Memory | 256 MB |
| CloudWatch logging | Enabled |

### API Gateway

**Status:** PASS

| Control | Status |
|---------|--------|
| Rate limiting | 10 req/s, burst 20 |
| CORS | Allowlist (no wildcards) |
| CloudWatch alarms | 4xx, 5xx, Lambda errors |

### Amplify Hosting

**Status:** PASS with findings

**[MEDIUM-001] Missing Security Headers**
- **Location:** Amplify hosting configuration
- **Description:** No security headers configured (CSP, X-Frame-Options, HSTS, etc.)
- **Impact:** Medium - Missing XSS protection and clickjacking prevention for the website.
- **Recommendation:** Add security headers via Amplify custom headers configuration.

### CDK Code Review

**Status:** PASS

- No hardcoded secrets
- Environment variables used for sensitive config
- Tag compliance aspect applied to all stacks
- Cross-stack references properly configured

---

## Track 1.4: CI/CD Workflow Audit

### Workflow Permissions

**Status:** PASS

| Workflow | Permissions |
|----------|-------------|
| security.yml | contents: read, security-events: write (CodeQL only) |
| test.yml | contents: read |
| claude.yml | contents/pulls/issues: read, id-token: write |
| claude-code-review.yml | contents: read, pull-requests: write, id-token: write |
| deploy-infra.yml | contents: read, id-token: write |

All workflows use explicit least-privilege permissions.

### AWS Authentication

**Status:** PASS

- Uses OIDC authentication (id-token: write)
- No static AWS credentials in secrets
- Role assumption via AWS_ROLE_ARN

### Third-Party Actions

**Status:** PASS with notes

| Action | Pin Level |
|--------|-----------|
| actions/checkout | v4 (major) |
| actions/setup-node | v4 (major) |
| actions/cache | v4 (major) |
| actions/upload-artifact | v4 (major) |
| github/codeql-action/* | v3 (major) |
| aws-actions/configure-aws-credentials | v4 (major) |
| anthropics/claude-code-action | v1 (major) |

**[LOW-003] Actions Pinned to Major Versions**
- **Description:** Actions are pinned to major versions (e.g., v4) rather than SHA hashes.
- **Impact:** Low - Major version pins are acceptable but SHA pins are more secure against supply chain attacks.
- **Recommendation:** Consider SHA pinning for higher security, but current state is acceptable.

### Secrets Handling

**Status:** PASS

- AWS_ROLE_ARN stored in GitHub secrets
- CONTACT_EMAIL stored in GitHub secrets
- CLAUDE_CODE_OAUTH_TOKEN stored in GitHub secrets
- No secrets exposed in logs

### Security Scanning

**Status:** PASS

| Scanner | Status |
|---------|--------|
| npm audit | Runs on every PR and push to main |
| CodeQL | Runs on every PR with security-extended queries |
| Secret scanning | GitHub native (enabled at repo level) |

---

## Remediation Priority

### Immediate (Before Production)
None required - no Critical or High findings.

### Recommended Improvements (Being Addressed in Track 2)
1. **[MEDIUM-001] Add security headers to Amplify** - CSP, X-Frame-Options, HSTS, etc.

### Optional Improvements
1. [LOW-001] Consider enhanced HTML escaping in Lambda email body
2. [LOW-002] Add startup validation for required env vars in Lambda
3. [LOW-003] Consider SHA pinning for GitHub Actions (currently major version pins)

### Already Implemented (No Action Needed)
- Rate limiting on contact API (10 req/s, burst 20)
- CORS allowlist (no wildcards)
- IAM least privilege for Lambda
- S3 private bucket with OAC
- HTTPS enforcement everywhere
- CodeQL security scanning in CI

---

## Appendix: Tools Used

- `bun audit` - Dependency vulnerability scanning
- Manual grep patterns - Secrets detection
- Code review - React patterns and data flow analysis
- AWS CDK code review - Infrastructure as code analysis
- GitHub Actions workflow review - CI/CD security analysis
