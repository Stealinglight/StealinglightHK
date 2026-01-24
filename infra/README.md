# Stealinglight Infrastructure

AWS CDK infrastructure for the stealinglight.hk portfolio site.

## Prerequisites

- AWS CLI configured with profile `stealinglight+website`
- Node.js 20+
- Bun (or npm)

## Setup

```bash
cd infra
bun install
```

## SES Domain Verification

Before deploying, verify your domain in SES so you can send emails from @stealinglight.hk addresses.

### 1. Start domain verification

```bash
aws ses verify-domain-identity \
  --domain stealinglight.hk \
  --profile stealinglight+website \
  --region us-west-2
```

This returns a verification token. Add it as a TXT record in your DNS (101domain.com):

| Type | Name | Value |
|------|------|-------|
| TXT | `_amazonses.stealinglight.hk` | `<verification-token>` |

### 2. Check verification status

```bash
aws ses get-identity-verification-attributes \
  --identities stealinglight.hk \
  --profile stealinglight+website \
  --region us-west-2
```

Wait until status shows `Success`.

### 3. (Optional) Set up DKIM for better deliverability

```bash
aws ses verify-domain-dkim \
  --domain stealinglight.hk \
  --profile stealinglight+website \
  --region us-west-2
```

Add the returned CNAME records to your DNS.

## Deploy

```bash
# Bootstrap CDK (first time only)
AWS_PROFILE=stealinglight+website cdk bootstrap

# Deploy the stack
AWS_PROFILE=stealinglight+website cdk deploy
```

## After Deployment

The deployment outputs the API endpoint URL. Create a `.env` file in the project root:

```bash
VITE_CONTACT_API_URL=https://xxx.execute-api.us-west-2.amazonaws.com/contact
```

## Configuration

Contact form submissions:
- **From**: noreply@stealinglight.hk
- **To**: stealinglight+website@gmail.com
- **Reply-To**: The submitter's email

## Stack Resources

- **Lambda Function**: Handles contact form submissions
- **API Gateway HTTP API**: Public endpoint with CORS
- **IAM Role**: SES send email permissions

## Testing

```bash
curl -X POST https://YOUR_API_URL/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","subject":"Test","message":"Hello"}'
```

## Cleanup

```bash
AWS_PROFILE=stealinglight+website cdk destroy
```
