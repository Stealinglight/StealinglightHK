# Stealinglight Deployment Guide

## Contact Form Setup

### SES Domain Verification

**Verification Token:** `aQxdAQJYYk3hVN6OaFMJsgwsaJ6lkbilz9zhdbwtAKg=`

Add this DNS TXT record (in whichever DNS provider manages your nameservers):

| Type | Name | Value |
|------|------|-------|
| TXT | `_amazonses.stealinglight.hk` | `aQxdAQJYYk3hVN6OaFMJsgwsaJ6lkbilz9zhdbwtAKg=` |

**Note:** As of Jan 2026, DNS is on Wix nameservers (NS7.WIXDNS.NET, NS6.WIXDNS.NET) with pending changes. Add the TXT record wherever your DNS ends up after propagation.

### Check Verification Status

```bash
aws ses get-identity-verification-attributes \
  --identities stealinglight.hk \
  --profile stealinglight+website \
  --region us-west-2
```

Look for `"VerificationStatus": "Success"`.

### Deploy CDK Stack

Once domain is verified:

```bash
cd infra

# Bootstrap (first time only)
AWS_PROFILE=stealinglight+website cdk bootstrap

# Deploy
AWS_PROFILE=stealinglight+website cdk deploy
```

### Configure Frontend

After deployment, copy the `ContactEndpoint` output URL and create `.env` in project root:

```
VITE_CONTACT_API_URL=https://xxx.execute-api.us-west-2.amazonaws.com/contact
```

Then rebuild and deploy the frontend.

---

## Static Site Deployment (S3 + CloudFront)

### Create S3 Bucket

```bash
aws s3 mb s3://stealinglight-hk-website \
  --profile stealinglight+website \
  --region us-west-2
```

### Configure for Static Hosting

```bash
aws s3 website s3://stealinglight-hk-website \
  --index-document index.html \
  --error-document index.html \
  --profile stealinglight+website
```

### Build and Upload

```bash
# Build
bun run build

# Upload
aws s3 sync dist/ s3://stealinglight-hk-website \
  --profile stealinglight+website \
  --delete
```

### CloudFront Distribution

Create a CloudFront distribution pointing to the S3 bucket with:
- Origin: S3 bucket
- Default root object: `index.html`
- Custom error response: 403/404 → `/index.html` (for SPA routing)
- SSL certificate for stealinglight.hk (ACM in us-east-1)
- Alternate domain names: `stealinglight.hk`, `www.stealinglight.hk`

### DNS Records (after nameserver propagation)

Point your domain to CloudFront:

| Type | Name | Value |
|------|------|-------|
| A | `stealinglight.hk` | CloudFront distribution (alias) |
| CNAME | `www.stealinglight.hk` | CloudFront distribution domain |

---

## Summary of DNS Records Needed

| Type | Name | Value | Purpose |
|------|------|-------|---------|
| TXT | `_amazonses.stealinglight.hk` | `aQxdAQJYYk3hVN6OaFMJsgwsaJ6lkbilz9zhdbwtAKg=` | SES verification |
| A/ALIAS | `stealinglight.hk` | CloudFront distribution | Website |
| CNAME | `www.stealinglight.hk` | CloudFront domain | Website www |

---

## Contact Form Configuration

- **From:** noreply@stealinglight.hk
- **To:** stealinglight+website@gmail.com
- **Reply-To:** Submitter's email address

---

## Useful Commands

```bash
# Check SES verification
aws ses get-identity-verification-attributes \
  --identities stealinglight.hk \
  --profile stealinglight+website \
  --region us-west-2

# List SES identities
aws ses list-identities \
  --profile stealinglight+website \
  --region us-west-2

# Test contact form
curl -X POST https://YOUR_API_URL/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","subject":"Test","message":"Hello"}'

# CDK commands
cd infra
AWS_PROFILE=stealinglight+website cdk diff      # Preview changes
AWS_PROFILE=stealinglight+website cdk deploy    # Deploy
AWS_PROFILE=stealinglight+website cdk destroy   # Tear down
```
