# Content Security Policy Documentation

**Date:** 2026-02-01
**Status:** Implemented

---

## Overview

Content Security Policy (CSP) is a browser security feature that helps prevent XSS attacks by controlling which resources can be loaded on a page. This document describes the CSP policy for stealinglight.hk.

---

## Current Policy

```
default-src 'self';
script-src 'self';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self' data:;
media-src 'self' https://*.cloudfront.net;
connect-src 'self' https://*.execute-api.us-west-2.amazonaws.com;
frame-ancestors 'none';
form-action 'self';
base-uri 'self';
upgrade-insecure-requests
```

---

## Directive Breakdown

### default-src 'self'

**Purpose:** Fallback for all directives not explicitly defined

**Allowed:** Resources from the same origin only

### script-src 'self'

**Purpose:** Control JavaScript sources

**Allowed:** Scripts from same origin only

**Blocked:** Inline scripts, external CDNs

**Note:** No `'unsafe-inline'` or `'unsafe-eval'` - these are dangerous

### style-src 'self' 'unsafe-inline'

**Purpose:** Control CSS sources

**Allowed:**
- Stylesheets from same origin
- Inline styles (required by React/Emotion)

**Why 'unsafe-inline':** React and CSS-in-JS libraries (Emotion, styled-components) inject inline styles at runtime. Without this, the site would be unstyled.

**Future consideration:** Use nonces if moving away from CSS-in-JS

### img-src 'self' data: https:

**Purpose:** Control image sources

**Allowed:**
- Images from same origin
- Data URIs (base64 images)
- Any HTTPS source (for external images if needed)

### font-src 'self' data:

**Purpose:** Control web font sources

**Allowed:**
- Fonts from same origin
- Data URIs (embedded fonts)

### media-src 'self' https://*.cloudfront.net

**Purpose:** Control video/audio sources

**Allowed:**
- Media from same origin
- CloudFront CDN (video hosting)

**Pattern:** `*.cloudfront.net` allows any CloudFront distribution (future-proof)

### connect-src 'self' https://*.execute-api.us-west-2.amazonaws.com

**Purpose:** Control fetch/XHR destinations

**Allowed:**
- Same origin API calls
- AWS API Gateway in us-west-2 (contact form API)

### frame-ancestors 'none'

**Purpose:** Prevent site from being embedded in iframes

**Effect:** Equivalent to X-Frame-Options: DENY

**Protection:** Clickjacking attacks

### form-action 'self'

**Purpose:** Control form submission targets

**Allowed:** Forms can only submit to same origin

### base-uri 'self'

**Purpose:** Restrict base element URLs

**Protection:** Prevents base tag injection attacks

### upgrade-insecure-requests

**Purpose:** Automatically upgrade HTTP requests to HTTPS

**Effect:** Any HTTP resource URLs are rewritten to HTTPS

---

## Testing the Policy

### Browser DevTools

1. Open site in Chrome/Firefox
2. Open DevTools (F12)
3. Go to Console tab
4. Look for CSP violation warnings

### Online Validators

- [CSP Evaluator (Google)](https://csp-evaluator.withgoogle.com/)
- [Observatory by Mozilla](https://observatory.mozilla.org/)
- [Security Headers](https://securityheaders.com/)

### Command Line

```bash
curl -s -I https://stealinglight.hk | grep -i "content-security-policy"
```

---

## Common Issues and Solutions

### Video Not Playing

**Symptom:** Videos from CloudFront fail to load

**Solution:** Verify CloudFront domain matches `*.cloudfront.net` pattern

### Contact Form Not Working

**Symptom:** Contact form submissions fail

**Solution:** Verify API Gateway URL matches `*.execute-api.us-west-2.amazonaws.com`

### Styles Not Applying

**Symptom:** Page looks unstyled

**Solution:** Ensure `'unsafe-inline'` is in style-src (required for React)

### External Images Blocked

**Symptom:** Third-party images don't load

**Solution:** img-src includes `https:` so any HTTPS image should work

---

## Modification Guidelines

### Adding a New Script Source

1. Prefer same-origin hosting over external CDNs
2. If external is required, add specific domain to script-src
3. NEVER add `'unsafe-inline'` or `'unsafe-eval'` to script-src

### Adding a New API Endpoint

1. Add specific domain pattern to connect-src
2. Use wildcards sparingly (e.g., `*.api.example.com`)

### Changing the Policy

1. Update `infra/lib/amplify-hosting-stack.ts`
2. Deploy via CDK: `cd infra && cdk deploy`
3. Test thoroughly in browser DevTools
4. Update this documentation

---

## Security Considerations

### What This Policy Prevents

- **XSS attacks:** Scripts can only run from same origin
- **Clickjacking:** Site cannot be embedded in iframes
- **Data exfiltration:** Connections only to known APIs
- **Protocol downgrade:** All requests upgraded to HTTPS

### What This Policy Does NOT Prevent

- **Server-side vulnerabilities:** CSP is browser-side only
- **Authentication bypasses:** Need separate controls
- **CSRF:** Need CSRF tokens (not applicable for static site)

### Trade-offs

| Decision | Security | Convenience |
|----------|----------|-------------|
| No 'unsafe-inline' for scripts | High | Requires bundled scripts |
| 'unsafe-inline' for styles | Medium | Enables CSS-in-JS |
| Wildcard CloudFront | Medium | Future-proof video CDN |
