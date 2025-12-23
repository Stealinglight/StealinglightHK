# StealingLight.HK

Personal portfolio platform with three static SPAs deployed to AWS S3 + CloudFront using CDKv2 TypeScript and GitHub Actions.

## 🌐 Sites

| Site     | Domain                    | Description                       |
| -------- | ------------------------- | --------------------------------- |
| Hub      | stealinglight.hk          | Landing page with mode selection  |
| Creative | creative.stealinglight.hk | Video portfolio and creative work |
| Security | security.stealinglight.hk | Cybersecurity blog and services   |

## 📁 Project Structure

```
stealinglightHK/
├── apps/
│   ├── hub/        # Vite React TS - Hub/landing site
│   ├── creative/   # Vite React TS - Creative portfolio
│   └── security/   # Vite React TS - Security blog & services
├── packages/
│   └── ui/         # Shared React components (Nav, Footer, Button)
├── infra/          # CDKv2 TypeScript infrastructure
│   ├── bin/        # CDK app entry point
│   ├── lib/        # Stack definitions
│   └── src/lambda/ # Lambda functions
└── .github/
    └── workflows/  # GitHub Actions CI/CD
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm 9+
- AWS CLI configured (for deployment)

### Install Dependencies

```bash
npm ci
```

### Local Development

```bash
# Hub site (port 5173)
npm run dev:hub

# Creative site (port 5174)
npm run dev:creative

# Security site (port 5175)
npm run dev:security
```

### Build

```bash
# Build all apps
npm run build:hub
npm run build:creative
npm run build:security

# Lint and typecheck
npm run lint
npm run typecheck
```

## 🏗️ Infrastructure

### AWS Resources (per site)

- **S3 Bucket**: Private bucket for static files
- **CloudFront Distribution**: CDN with OAC for S3 access
- **Route53 Records**: A and AAAA alias records
- **ACM Certificate**: SSL/TLS certificate (us-east-1)

### API Resources

- **Lambda Function**: Contact form handler
- **API Gateway**: REST API with CORS
- **SES**: Email delivery

### CDK Commands

```bash
cd infra

# Preview changes
npx cdk diff --context certificateArn=<ARN>

# Deploy all stacks
npx cdk deploy --all --context certificateArn=<ARN>

# Destroy all stacks
npx cdk destroy --all
```

## 🔧 Manual AWS Setup (Phase 9)

Before deploying, complete these manual AWS setup steps:

### 1. Route53 Hosted Zone

If not already created:
```bash
aws route53 create-hosted-zone \
  --name stealinglight.hk \
  --caller-reference $(date +%s)
```

Update your domain registrar with the NS records from Route53.

### 2. ACM Certificate (us-east-1)

```bash
aws acm request-certificate \
  --domain-name stealinglight.hk \
  --subject-alternative-names "*.stealinglight.hk" \
  --validation-method DNS \
  --region us-east-1
```

Add the CNAME validation records to Route53, then wait for validation:
```bash
aws acm describe-certificate \
  --certificate-arn <CERTIFICATE_ARN> \
  --region us-east-1
```

### 3. SES Email Setup

Verify your domain in SES:
```bash
aws ses verify-domain-identity \
  --domain stealinglight.hk \
  --region us-west-2
```

Add the TXT and MX records to Route53. If in sandbox, also verify the recipient email:
```bash
aws ses verify-email-identity \
  --email-address your-email@example.com
```

### 4. GitHub OIDC Provider

Create IAM OIDC identity provider for GitHub Actions:
```bash
aws iam create-open-id-connect-provider \
  --url https://token.actions.githubusercontent.com \
  --client-id-list sts.amazonaws.com \
  --thumbprint-list 6938fd4d98bab03faadb97b34396831e3780aea1
```

### 5. GitHub Actions IAM Role

Create `github-actions-deploy-role.json`:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::383579119744:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:YOUR_GITHUB_USERNAME/stealinglightHK:*"
        }
      }
    }
  ]
}
```

```bash
aws iam create-role \
  --role-name github-actions-deploy \
  --assume-role-policy-document file://github-actions-deploy-role.json

aws iam attach-role-policy \
  --role-name github-actions-deploy \
  --policy-arn arn:aws:iam::aws:policy/AdministratorAccess
```

### 6. GitHub Repository Secrets

Configure these secrets in your GitHub repository:

| Secret                     | Description                                  |
| -------------------------- | -------------------------------------------- |
| `AWS_DEPLOY_ROLE_ARN`      | ARN of the GitHub Actions IAM role           |
| `CERTIFICATE_ARN`          | ARN of the ACM certificate                   |
| `CONTACT_EMAIL`            | Email to receive contact form submissions    |
| `HUB_DISTRIBUTION_ID`      | CloudFront distribution ID for hub site      |
| `CREATIVE_DISTRIBUTION_ID` | CloudFront distribution ID for creative site |
| `SECURITY_DISTRIBUTION_ID` | CloudFront distribution ID for security site |

## 📦 Initial Deployment (Phase 10)

### 1. Bootstrap CDK

```bash
npx cdk bootstrap aws://383579119744/us-west-2
```

### 2. Deploy Infrastructure

```bash
cd infra
npx cdk deploy --all \
  --context certificateArn=<YOUR_CERTIFICATE_ARN>
```

Note the outputs for:
- Bucket names (for GitHub Actions)
- Distribution IDs (for GitHub secrets)
- API endpoint (for frontend config)

### 3. Build and Deploy Sites

```bash
# Build all sites
npm run build:hub
npm run build:creative
npm run build:security

# Deploy to S3 (example for hub)
aws s3 sync apps/hub/dist/ s3://hub-stealinglight-hk/ --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id <DISTRIBUTION_ID> \
  --paths "/*"
```

## ✅ Testing & Validation (Phase 11)

### Build Tests

```bash
# All apps should build without errors
npm run build:hub && echo "Hub OK"
npm run build:creative && echo "Creative OK"
npm run build:security && echo "Security OK"

# CDK should synth without errors
cd infra && npx cdk synth
```

### Site Validation Checklist

For each site (hub, creative, security):

- [ ] Site loads over HTTPS
- [ ] No console errors
- [ ] Navigation works (all routes accessible)
- [ ] Mode switch between Creative/Security works
- [ ] Footer links are correct
- [ ] Mobile responsive design works
- [ ] Contact form submits successfully

### API Validation

```bash
# Test contact form endpoint
curl -X POST https://API_ENDPOINT/v1/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "Test message from validation",
    "source": "creative"
  }'
```

### DNS Propagation

```bash
# Check DNS records
dig stealinglight.hk
dig creative.stealinglight.hk
dig security.stealinglight.hk
dig www.stealinglight.hk
```

## 🔒 Security Considerations

- S3 buckets are private (no public access)
- CloudFront uses OAC (Origin Access Control) for S3
- HTTPS only (HTTP redirects to HTTPS)
- SES sender restricted to noreply@stealinglight.hk
- Contact form has honeypot spam protection
- No PII logged in Lambda functions
- GitHub Actions uses OIDC (no static AWS keys)

## 📝 Content Management

### Adding Blog Posts (Security Site)

Edit `apps/security/src/data/posts.json`:
```json
{
  "id": "your-post-slug",
  "title": "Your Post Title",
  "excerpt": "Brief description...",
  "category": "Cloud Security",
  "date": "2025-01-15",
  "readTime": "10 min read",
  "tags": ["aws", "security"],
  "content": "# Your Markdown Content\n\nPost body here..."
}
```

### Adding Projects (Creative Site)

Edit `apps/creative/src/data/projects.json`:
```json
{
  "id": "project-slug",
  "title": "Project Title",
  "category": "commercial",
  "description": "Brief description...",
  "fullDescription": "Detailed description...",
  "thumbnailUrl": "/thumbnails/project.jpg",
  "videoUrl": "/videos/project.mp4",
  "client": "Client Name",
  "year": "2025",
  "role": "Director",
  "tags": ["commercial", "drone"]
}
```

### Media Files

For production, upload media to S3 and use CloudFront URLs. During development, place files in the `public/` directory of each app.

## 🧹 Maintenance

### Update Dependencies

```bash
npm update
npm audit fix
```

### Clear CloudFront Cache

```bash
aws cloudfront create-invalidation \
  --distribution-id <DISTRIBUTION_ID> \
  --paths "/*"
```

### View Lambda Logs

```bash
aws logs tail /aws/lambda/StealingLightApiStack-ContactFormFunction
```

## 📄 License

Private repository - All rights reserved.
