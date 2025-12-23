# stealinglightHK

Personal portfolio platform with three static SPAs (hub, creative, security) deployed to AWS S3 + CloudFront using CDKv2 TypeScript.

## Architecture

```
stealinglight.hk          → Hub landing page (mode selector)
www.stealinglight.hk      → Redirect to hub
creative.stealinglight.hk → Creative portfolio (video-focused)
security.stealinglight.hk → Security portfolio (blog/writing)
```

## Project Structure

```
├── apps/
│   ├── hub/           # Landing page SPA
│   ├── creative/      # Creative portfolio SPA
│   └── security/      # Security portfolio SPA (with blog)
├── packages/
│   └── ui/            # Shared UI components and theme
├── infra/             # CDK infrastructure code
│   ├── bin/           # CDK app entry point
│   ├── lib/           # Stacks and constructs
│   └── lambda/        # Lambda function source
└── .github/
    └── workflows/     # CI/CD pipelines
```

## Requirements

- Node.js 20+
- npm 9+
- AWS CLI configured with credentials
- CDK bootstrapped in target AWS account

## Setup

### 1. Install Dependencies

```bash
npm ci
```

### 2. Local Development

```bash
# Start hub site on localhost:5173
npm run dev:hub

# Start creative site on localhost:5174
npm run dev:creative

# Start security site on localhost:5175
npm run dev:security
```

### 3. Build

```bash
# Build all sites
npm run build:hub
npm run build:creative
npm run build:security
```

### 4. Lint & Typecheck

```bash
npm run lint
npm run typecheck
```

### 5. Run Tests

```bash
npm test
```

## Infrastructure

### CDK Commands

```bash
# Synthesize CloudFormation templates
npm run cdk:synth

# Show diff from deployed state
npm run cdk:diff

# Deploy all stacks
npm run cdk:deploy
```

### AWS Account Setup

1. Bootstrap CDK in us-west-2 (primary region):
   ```bash
   cdk bootstrap aws://383579119744/us-west-2
   ```

2. Bootstrap CDK in us-east-1 (for ACM certificates):
   ```bash
   cdk bootstrap aws://383579119744/us-east-1
   ```

3. Create Route 53 hosted zone for `stealinglight.hk`

4. Verify SES email addresses for contact form

5. Create GitHub OIDC provider and IAM role for CI/CD

## CI/CD

GitHub Actions automatically deploys changes when pushing to `main`:

- Hub: Deploys when `apps/hub/**` changes
- Creative: Deploys when `apps/creative/**` changes  
- Security: Deploys when `apps/security/**` changes
- Infrastructure: Deploys when `infra/**` changes

## Environment Variables

### GitHub Repository Secrets

| Secret         | Description                    |
| -------------- | ------------------------------ |
| `AWS_ROLE_ARN` | IAM role ARN for GitHub OIDC   |
| `AWS_REGION`   | Primary AWS region (us-west-2) |

### Vite Environment Variables

Create `.env.local` files in each app directory:

```bash
# apps/creative/.env.local
VITE_CONTACT_API_URL=https://api.stealinglight.hk/contact

# apps/security/.env.local
VITE_CONTACT_API_URL=https://api.stealinglight.hk/contact
```

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, React Router
- **Styling**: CSS (no framework)
- **Infrastructure**: AWS CDK v2, S3, CloudFront, Route 53, ACM, Lambda, API Gateway, SES
- **CI/CD**: GitHub Actions with OIDC authentication
- **Package Management**: npm workspaces

## License

Private - All rights reserved
