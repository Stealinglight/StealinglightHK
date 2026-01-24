# Stealinglight Infrastructure

AWS CDK infrastructure for the stealinglight.hk portfolio site.

## Overview

This infrastructure includes:

| Stack | Description |
|-------|-------------|
| `stealinglight-amplify` | AWS Amplify hosting with GitHub CI/CD |
| `stealinglight-contact` | Contact form API (API Gateway + Lambda + SES) |

## Quick Start

```bash
cd infra
npm install
export CONTACT_EMAIL="your-email@example.com"
cdk deploy --all
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    GitHub                            │
│  Stealinglight/stealinglightHK (main branch)        │
└─────────────────┬───────────────────────────────────┘
                  │ Auto-deploy on push
                  ▼
┌─────────────────────────────────────────────────────┐
│               AWS Amplify                           │
│  - Builds frontend (npm ci && npm run build)        │
│  - Hosts static assets                              │
│  - SPA routing via rewrite rules                    │
└─────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────┐
│              Contact Form API                       │
│  API Gateway (REST) → Lambda → SES                  │
│  POST /contact                                      │
└─────────────────────────────────────────────────────┘
```

## Stack Details

### Amplify Hosting Stack

- **Build spec**: Uses npm (Amplify default) for reliable builds
- **SPA routing**: Configured rewrite rules for React Router
- **GitHub integration**: Connect via Amplify Console after deployment

### Contact Form Stack

- **API Gateway REST API**: With proper CORS (no wildcards)
- **Lambda (Node.js 20)**: Inline handler for contact form
- **SES integration**: Sends emails to configured address
- **Throttling**: 10 req/s rate limit, 20 burst limit

## Configuration

All configuration is managed via `cdk.json` context:

| Key | Description |
|-----|-------------|
| `appName` | Application name (stealinglight) |
| `domainName` | Domain (stealinglight.hk) |
| `repositoryOwner` | GitHub owner |
| `repositoryName` | GitHub repo name |
| `branch` | Branch to deploy (main) |
| `environment` | Environment name (production) |

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `CONTACT_EMAIL` | Yes | Email address for contact form submissions |
| `AWS_PROFILE` | Recommended | AWS CLI profile to use |

## Governance

All resources are tagged with:
- `Project`: stealinglight
- `Environment`: production
- `ManagedBy`: CDK
- `Repository`: Stealinglight/stealinglightHK

## Testing the Contact Form

```bash
curl -X POST https://YOUR_API_URL/production/contact \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{"name":"Test","email":"test@example.com","message":"Hello"}'
```

## Cleanup

```bash
cdk destroy --all
```
