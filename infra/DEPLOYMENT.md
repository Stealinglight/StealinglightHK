# Deployment Guide

## Prerequisites

- AWS CLI configured with appropriate credentials
- Node.js 18+ installed
- AWS CDK CLI installed (`npm install -g aws-cdk`)

## Environment Setup

1. Set required environment variables:

```bash
export CONTACT_EMAIL="your-email@example.com"
export AWS_PROFILE="stealinglight+website"  # or your AWS profile
export AWS_REGION="us-west-2"
```

2. Verify SES email identity is configured for the contact email address.

## First-Time Deployment

### 1. Bootstrap CDK (one-time setup)

```bash
cd infra
npm install
cdk bootstrap
```

### 2. Deploy Infrastructure

```bash
cdk deploy --all
```

This creates:
- **Amplify App** - Ready for GitHub connection
- **Contact API** - API Gateway + Lambda + SES integration

### 3. Connect GitHub Repository

After deployment, connect your GitHub repository via the AWS Console:

1. Open the Amplify Console URL from the deployment output
2. Click "Connect branch"
3. Select "GitHub" and authorize Amplify
4. Choose the `Stealinglight/stealinglightHK` repository
5. Select the `main` branch
6. Review and confirm the build settings (already configured)
7. Save and deploy

### 4. Update CORS Origins (After First Amplify Build)

Once your Amplify app has a URL (e.g., `main.d1234567.amplifyapp.com`):

1. Add the Amplify domain to `allowedOrigins` in `bin/app.ts`
2. Redeploy the contact stack: `cdk deploy stealinglight-contact`

## Subsequent Deployments

### Code Changes (Frontend)

Push to GitHub - Amplify auto-deploys on push to `main`.

### Infrastructure Changes

```bash
cd infra
cdk diff        # Preview changes
cdk deploy --all  # Apply changes
```

## Stack Outputs

After deployment, note these outputs:

| Output | Description |
|--------|-------------|
| `AmplifyAppId` | Amplify application ID |
| `AmplifyDefaultDomain` | Default Amplify domain |
| `AmplifyConsoleUrl` | Link to Amplify Console |
| `ContactApiUrl` | Base URL for contact API |
| `ContactEndpoint` | Full contact form endpoint |

## Contact Form Integration

Update your frontend to use the contact API:

```typescript
// src/config.ts or .env
const CONTACT_API = 'https://xxx.execute-api.us-west-2.amazonaws.com/production/contact';

// Submit form
const response = await fetch(CONTACT_API, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, message }),
});
```

## Troubleshooting

### CORS Errors

If you see CORS errors:
1. Check that your frontend origin is in `allowedOrigins`
2. Redeploy the contact stack
3. Hard refresh your browser

### Contact Form Not Sending

1. Verify CONTACT_EMAIL is set and SES identity is verified
2. Check CloudWatch Logs for Lambda errors
3. Ensure SES is out of sandbox mode (or recipient is verified)

### Amplify Build Failures

1. Check Amplify Console build logs
2. Verify `npm ci` and `npm run build` work locally
3. Check environment variables are set in Amplify Console

## SES Setup

Amazon SES (Simple Email Service) requires identity verification before you can send emails.

### Understanding Sandbox Mode

**Important:** New AWS accounts start in SES sandbox mode with these restrictions:
- You can only send emails to verified email addresses
- You're limited to 200 emails per 24-hour period
- You're limited to 1 email per second

To move to production mode, you must request production access via the AWS Console.

### Option 1: Verify Email Identity (Quick Start)

For development/testing, verify individual email addresses:

1. Open AWS Console → SES → Verified identities
2. Click "Create identity" → Select "Email address"
3. Enter your `CONTACT_EMAIL` address
4. Check your inbox and click the verification link
5. (If in sandbox mode) Also verify any recipient email addresses

### Option 2: Verify Domain Identity (Production)

For production, verify your entire domain:

1. Open AWS Console → SES → Verified identities
2. Click "Create identity" → Select "Domain"
3. Enter your domain (e.g., `stealinglight.hk`)
4. Choose "Easy DKIM" for improved deliverability
5. Copy the CNAME records provided by SES
6. Add these DNS records to your domain registrar:
   - 3 DKIM CNAME records (for email authentication)
   - 1 optional MX record (if receiving emails)
7. Wait for verification (can take up to 72 hours)

### Request Production Access

Once your identity is verified and you're ready for production:

1. Open AWS Console → SES → Account dashboard
2. Click "Request production access"
3. Fill out the form with:
   - Use case description
   - Expected email volume
   - How you handle bounces and complaints
4. AWS typically responds within 24 hours

### Verify SES Configuration

```bash
# List verified identities
aws ses list-identities --region us-west-2

# Check identity verification status
aws ses get-identity-verification-attributes \
  --identities your-email@example.com \
  --region us-west-2

# Send a test email (only works if both sender and recipient are verified in sandbox)
aws ses send-email \
  --from verified-sender@example.com \
  --to verified-recipient@example.com \
  --subject "Test Email" \
  --text "This is a test." \
  --region us-west-2
```
