# AGENTS.md

This repository contains three static SPAs (hub, creative, security) hosted on AWS S3 + CloudFront and deployed with CDKv2 TypeScript and GitHub Actions.

Codex and other coding agents must read and follow this file before making changes. This file defines commands, structure, conventions, and boundaries. (Codex reads AGENTS.md automatically.) 

## Project goals

- Hub site (apex + www) routes users to two “modes”:
  - Creative: https://creative.stealinglight.hk
  - Security: https://security.stealinglight.hk
- Each mode is a separate SPA deployed to its own S3 bucket and CloudFront distribution.
- Shared top nav includes a mode switch link between Creative and Security.

## Repo layout

- apps/
  - hub/        Vite React TS SPA for stealinglight.hk
  - creative/   Vite React TS SPA for creative.stealinglight.hk
  - security/   Vite React TS SPA for security.stealinglight.hk (includes markdown blog)
- packages/
  - ui/         shared UI components and theme tokens (nav, footer, buttons)
- infra/        CDKv2 TypeScript app (S3, CloudFront, Route53, ACM, Lambda/API/SES)

## Setup

### Requirements
- Node.js 20+
- npm 9+
- AWS CLI configured for local deploys
- CDK bootstrap done in target accounts

### Install
- From repo root:
  - `npm ci`

### Local dev
- Hub: `npm run dev:hub`
- Creative: `npm run dev:creative`
- Security: `npm run dev:security`

### Build
- Hub: `npm run build:hub`
- Creative: `npm run build:creative`
- Security: `npm run build:security`

### Lint and typecheck
- `npm run lint`
- `npm run typecheck`
- `npm test` (if present)

## Infrastructure

### Key constraints
- S3 buckets must be private.
- Use CloudFront Origin Access Control (OAC) for S3 origin access.
- SPA routing must map 403/404 to `/index.html` with 200.
- Use Route 53 alias records to CloudFront for:
  - stealinglight.hk
  - www.stealinglight.hk
  - creative.stealinglight.hk
  - security.stealinglight.hk
- CloudFront requires ACM certificates in us-east-1 for custom domains.

### CDK commands
- In `infra/`:
  - `npm ci`
  - `npx cdk synth`
  - `npx cdk diff`
  - `npx cdk deploy`

## CI/CD

- GitHub Actions deploy per app using path filters.
- Must use OIDC with aws-actions/configure-aws-credentials (no static AWS keys).
- Deploy sequence:
  1) Build Vite app to `dist/`
  2) `aws s3 sync dist/ s3://<bucket>/ --delete`
  3) CloudFront invalidation

## Code style and conventions

- TypeScript everywhere.
- Prefer simple, readable code over clever abstractions.
- Keep dependencies minimal.
- Use React Router for SPA routes.
- Vite client environment variables must be prefixed with `VITE_`.

## Security boundaries

- Do not commit secrets, tokens, or private keys.
- Do not log PII from contact form submissions.
- Validate all contact form inputs server-side.
- Add basic spam prevention (honeypot field + check).

## Agent workflow expectations

- Make changes in small, reviewable commits.
- Update README when you change commands or structure.
- If a task touches multiple areas (apps + infra + CI), create a short plan document (PLANS.md) describing steps and files to change before implementing.

## Out of scope for v1

- No Amplify.
- No CMS (use JSON/markdown in repo).
- No SSR frameworks for now.
- No real media uploads in git. Use placeholders and document S3 upload steps.