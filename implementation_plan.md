# Implementation Plan

## [Overview]

Build a monorepo containing three static SPAs (hub, creative, security) deployed to AWS S3 + CloudFront with CDKv2 TypeScript infrastructure.

This implementation creates a complete personal portfolio platform with a hub landing page routing users to creative and security subdomains. Each site is independently deployable via GitHub Actions with OIDC authentication. The infrastructure uses private S3 buckets with CloudFront OAC, Route 53 DNS, ACM certificates, and serverless contact form processing via API Gateway and Lambda.

The project follows modern monorepo patterns using npm workspaces, with shared UI components and minimal dependencies. All three sites are Vite + React + TypeScript SPAs with React Router for client-side routing. The creative site focuses on video portfolio content, while the security site includes markdown-based writing/blog functionality.

## [Types]

Define TypeScript interfaces and types used across the monorepo.

### Shared UI Types (`packages/ui/src/types.ts`)
```typescript
export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface ModeConfig {
  name: 'creative' | 'security';
  displayName: string;
  url: string;
  description: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  honeypot?: string; // spam prevention
}

export interface ContactFormResponse {
  success: boolean;
  message: string;
  error?: string;
}
```

### Creative Site Types (`apps/creative/src/types.ts`)
```typescript
export interface Project {
  slug: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl?: string;
  tags: string[];
  featured?: boolean;
  date: string;
}

export interface VideoAsset {
  url: string;
  posterUrl: string;
  title: string;
  duration?: string;
}
```

### Security Site Types (`apps/security/src/types.ts`)
```typescript
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  tags: string[];
  featured?: boolean;
}

export interface CaseStudy {
  slug: string;
  title: string;
  summary: string;
  thumbnail: string;
  technologies: string[];
  date: string;
}
```

### Lambda Types (`infra/lambda/contact/types.ts`)
```typescript
export interface ContactRequest {
  name: string;
  email: string;
  message: string;
  honeypot?: string;
}

export interface SESEmailParams {
  to: string;
  from: string;
  subject: string;
  body: string;
}
```

## [Files]

Comprehensive breakdown of all files to create, modify, or configure.

### New Files to Create

#### Root Level
- `package.json` - Root workspace config with npm workspaces and scripts
- `tsconfig.json` - Base TypeScript config for all workspaces
- `.gitignore` - Ignore node_modules, dist, .env files, CDK outputs
- `README.md` - Project overview, setup instructions, deployment guide
- `.prettierrc` - Code formatting configuration
- `.eslintrc.json` - ESLint configuration for TypeScript + React
- `.github/workflows/deploy.yml` - CI/CD workflow for all three sites

#### Apps - Hub (`apps/hub/`)
- `package.json` - Vite + React + TypeScript dependencies
- `tsconfig.json` - TypeScript config extending root
- `vite.config.ts` - Vite configuration
- `index.html` - HTML entry point
- `src/main.tsx` - React app entry
- `src/App.tsx` - Main app component with routing
- `src/pages/Home.tsx` - Hub landing page with mode cards
- `src/styles/global.css` - Global styles
- `public/favicon.ico` - Favicon placeholder

#### Apps - Creative (`apps/creative/`)
- `package.json` - Vite + React + TypeScript dependencies
- `tsconfig.json` - TypeScript config
- `vite.config.ts` - Vite configuration with env variables
- `index.html` - HTML entry point
- `src/main.tsx` - React app entry
- `src/App.tsx` - App with routing
- `src/pages/Home.tsx` - Featured reel + projects
- `src/pages/Projects.tsx` - Project grid with filtering
- `src/pages/ProjectDetail.tsx` - Individual project page
- `src/pages/About.tsx` - About page
- `src/pages/Contact.tsx` - Contact form
- `src/components/VideoPlayer.tsx` - HTML5 video component
- `src/components/ProjectCard.tsx` - Project card component
- `src/data/projects.json` - Project data (placeholder)
- `src/types.ts` - Creative-specific types
- `src/styles/global.css` - Global styles
- `public/favicon.ico` - Favicon placeholder

#### Apps - Security (`apps/security/`)
- `package.json` - Vite + React + TypeScript + markdown dependencies
- `tsconfig.json` - TypeScript config
- `vite.config.ts` - Vite configuration
- `index.html` - HTML entry point
- `src/main.tsx` - React app entry
- `src/App.tsx` - App with routing
- `src/pages/Home.tsx` - Intro + featured projects + writing
- `src/pages/Projects.tsx` - Case study cards
- `src/pages/Writing.tsx` - Blog post list
- `src/pages/WritingDetail.tsx` - Individual blog post (markdown)
- `src/pages/About.tsx` - About page
- `src/pages/Contact.tsx` - Contact form
- `src/components/MarkdownRenderer.tsx` - Markdown to HTML component
- `src/components/CaseStudyCard.tsx` - Case study card component
- `src/data/posts/` - Directory for markdown blog posts
- `src/data/posts/example-post.md` - Example markdown post
- `src/data/projects.json` - Case study data (placeholder)
- `src/types.ts` - Security-specific types
- `src/styles/global.css` - Global styles
- `public/favicon.ico` - Favicon placeholder

#### Packages - UI (`packages/ui/`)
- `package.json` - Shared component dependencies
- `tsconfig.json` - TypeScript config
- `src/index.ts` - Export barrel file
- `src/components/Nav.tsx` - Navigation component
- `src/components/Footer.tsx` - Footer component
- `src/components/ModeSwitch.tsx` - Mode switch link component
- `src/components/Button.tsx` - Reusable button component
- `src/types.ts` - Shared types
- `src/theme/tokens.ts` - Design tokens (colors, spacing, typography)
- `src/styles/components.css` - Component styles

#### Infrastructure - CDK (`infra/`)
- `package.json` - CDK dependencies
- `tsconfig.json` - TypeScript config
- `cdk.json` - CDK configuration
- `bin/app.ts` - CDK app entry point
- `lib/hub-stack.ts` - Hub site infrastructure stack
- `lib/creative-stack.ts` - Creative site infrastructure stack
- `lib/security-stack.ts` - Security site infrastructure stack
- `lib/certificate-stack.ts` - ACM certificate stack (us-east-1)
- `lib/api-stack.ts` - Contact form API Gateway + Lambda stack
- `lib/constructs/static-site.ts` - Reusable static site construct
- `lambda/contact/index.ts` - Contact form Lambda handler
- `lambda/contact/types.ts` - Lambda types
- `lambda/contact/package.json` - Lambda dependencies

### Configuration Files Details

**Root `package.json`:**
```json
{
  "name": "stealinglight-monorepo",
  "private": true,
  "workspaces": ["apps/*", "packages/*", "infra"],
  "engines": { "node": ">=20" },
  "scripts": {
    "dev:hub": "npm -w apps/hub run dev",
    "dev:creative": "npm -w apps/creative run dev",
    "dev:security": "npm -w apps/security run dev",
    "build:hub": "npm -w apps/hub run build",
    "build:creative": "npm -w apps/creative run build",
    "build:security": "npm -w apps/security run build",
    "lint": "npm -ws run lint",
    "typecheck": "npm -ws run typecheck",
    "test": "npm -ws run test --if-present",
    "cdk:synth": "npm -w infra run cdk:synth",
    "cdk:diff": "npm -w infra run cdk:diff",
    "cdk:deploy": "npm -w infra run cdk:deploy"
  }
}
```

**.gitignore:**
```
node_modules/
dist/
build/
.env
.env.local
*.log
.DS_Store
cdk.out/
.cdk.staging/
*.js
*.d.ts
!lambda/**/*.js
```

## [Functions]

Detailed breakdown of key functions and their purposes.

### Hub App Functions

**`apps/hub/src/App.tsx`:**
- `App()` - Main app component with React Router setup
- Returns routes for home page only

**`apps/hub/src/pages/Home.tsx`:**
- `Home()` - Landing page component
- Renders two large mode cards (Creative, Security)
- Each card links to respective subdomain

### Creative App Functions

**`apps/creative/src/App.tsx`:**
- `App()` - Main app component with routing for all pages
- Includes Nav component from shared UI package

**`apps/creative/src/pages/Projects.tsx`:**
- `Projects()` - Project grid page component
- `useFilteredProjects(projects: Project[], selectedTag?: string)` - Custom hook for filtering
- `handleTagFilter(tag: string)` - Tag filter handler

**`apps/creative/src/components/VideoPlayer.tsx`:**
- `VideoPlayer({ videoUrl, posterUrl, title }: VideoPlayerProps)` - HTML5 video component
- Uses `preload="none"` for performance
- Implements poster image

### Security App Functions

**`apps/security/src/pages/Writing.tsx`:**
- `Writing()` - Blog post list page
- `loadPosts()` - Async function to load markdown files
- `filterByTag(posts: BlogPost[], tag?: string)` - Filter posts

**`apps/security/src/components/MarkdownRenderer.tsx`:**
- `MarkdownRenderer({ content }: { content: string })` - Renders markdown to HTML
- Uses `react-markdown` library
- Sanitizes HTML output

### Lambda Functions

**`infra/lambda/contact/index.ts`:**
- `handler(event: APIGatewayProxyEvent)` - Main Lambda handler
- `validateInput(data: ContactRequest): boolean` - Input validation
- `checkHoneypot(data: ContactRequest): boolean` - Spam detection
- `sendEmail(params: SESEmailParams): Promise<void>` - SES email sending
- `createResponse(statusCode: number, body: object)` - API response formatter

### CDK Functions

**`lib/constructs/static-site.ts`:**
- `constructor(scope: Construct, id: string, props: StaticSiteProps)` - Initialize construct
- `createBucket(): s3.Bucket` - Create private S3 bucket
- `createOAC(): cloudfront.OriginAccessControl` - Create OAC for S3
- `createDistribution(): cloudfront.Distribution` - Create CloudFront distribution
- `createDnsRecords(): void` - Create Route 53 alias records
- `configureSpaRouting(): void` - Configure 403/404 -> index.html

**`lib/certificate-stack.ts`:**
- `constructor(scope: Construct, id: string, props: CertificateStackProps)` - Certificate stack
- `createCertificate(): acm.Certificate` - Create ACM cert in us-east-1
- Must include apex + all subdomains

## [Classes]

Class structure and modifications across the project.

### New Classes

**`lib/constructs/StaticSite` (CDK Construct):**
```typescript
export class StaticSite extends Construct {
  public readonly bucket: s3.Bucket;
  public readonly distribution: cloudfront.Distribution;
  public readonly domainName: string;

  constructor(scope: Construct, id: string, props: StaticSiteProps) {
    // Initialize S3, CloudFront, Route 53, OAC
  }

  private createBucket(): s3.Bucket { /* ... */ }
  private createOAC(): cloudfront.OriginAccessControl { /* ... */ }
  private createDistribution(): cloudfront.Distribution { /* ... */ }
  private createDnsRecords(): void { /* ... */ }
}
```

**`lib/hub-stack.ts` (CDK Stack):**
```typescript
export class HubStack extends Stack {
  constructor(scope: Construct, id: string, props: HubStackProps) {
    super(scope, id, props);
    
    const site = new StaticSite(this, 'HubSite', {
      domainName: 'stealinglight.hk',
      certificateArn: props.certificateArn,
      hostedZoneId: props.hostedZoneId
    });

    new CfnOutput(this, 'BucketName', { value: site.bucket.bucketName });
    new CfnOutput(this, 'DistributionId', { value: site.distribution.distributionId });
  }
}
```

**Similar stack classes:**
- `CreativeStack` - For creative.stealinglight.hk
- `SecurityStack` - For security.stealinglight.hk
- `CertificateStack` - For ACM certificate in us-east-1
- `ApiStack` - For API Gateway + Lambda contact form

### Component Classes (React Functional Components)

All React components use functional components with hooks:
- `Nav` - Navigation with mode switch
- `Footer` - Site footer
- `ModeSwitch` - Toggle between creative/security
- `VideoPlayer` - HTML5 video with controls
- `ProjectCard` - Project display card
- `MarkdownRenderer` - Markdown to HTML renderer

## [Dependencies]

Package dependencies for each workspace.

### Root Workspace
```json
{
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^7.0.0",
    "@typescript-eslint/parser": "^7.0.0",
    "eslint": "^8.57.0",
    "eslint-plugin-react": "^7.34.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "prettier": "^3.2.0",
    "typescript": "^5.3.3"
  }
}
```

### Hub/Creative/Security Apps (similar dependencies)
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0",
    "@stealinglight/ui": "workspace:*"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.1.0",
    "typescript": "^5.3.3"
  }
}
```

### Security App (additional markdown dependencies)
```json
{
  "dependencies": {
    "react-markdown": "^9.0.0",
    "remark-gfm": "^4.0.0"
  }
}
```

### UI Package
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "typescript": "^5.3.3"
  }
}
```

### Infrastructure
```json
{
  "dependencies": {
    "aws-cdk-lib": "^2.120.0",
    "constructs": "^10.3.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "typescript": "^5.3.3",
    "aws-cdk": "^2.120.0"
  }
}
```

### Lambda
```json
{
  "dependencies": {
    "@aws-sdk/client-ses": "^3.500.0"
  },
  "devDependencies": {
    "@types/aws-lambda": "^8.10.0",
    "@types/node": "^20.11.0",
    "typescript": "^5.3.3"
  }
}
```

## [Testing]

Testing strategy and requirements.

### Testing Framework
- Use Vitest for unit testing (compatible with Vite)
- React Testing Library for component tests
- No E2E tests in v1 scope

### Test Files to Create

**`packages/ui/src/components/__tests__/Nav.test.tsx`:**
- Test navigation rendering
- Test mode switch functionality
- Test link behavior

**`apps/creative/src/components/__tests__/VideoPlayer.test.tsx`:**
- Test video component rendering
- Test poster image display
- Test preload behavior

**`apps/security/src/components/__tests__/MarkdownRenderer.test.tsx`:**
- Test markdown rendering
- Test HTML sanitization
- Test code block rendering

**`infra/lambda/contact/__tests__/handler.test.ts`:**
- Test input validation
- Test honeypot detection
- Test email sending (mocked)
- Test error handling

### Test Commands
Each workspace with tests should have:
```json
{
  "scripts": {
    "test": "vitest",
    "test:coverage": "vitest --coverage"
  }
}
```

### Validation Strategy
- Lint all code before commit: `npm run lint`
- Type check all code: `npm run typecheck`
- Run unit tests: `npm test`
- CDK synth before deploy: `npm run cdk:synth`

## [Implementation Order]

Logical sequence of implementation steps to minimize conflicts.

### Phase 1: Repository Setup
1. Initialize git repository (`git init`)
2. Create root `package.json` with workspaces
3. Create `.gitignore`, `.prettierrc`, `.eslintrc.json`
4. Create root `tsconfig.json`
5. Create `README.md` with setup instructions
6. Create `AGENTS.md` (already exists)
7. Commit: "chore: initialize monorepo structure"

### Phase 2: Shared UI Package
1. Create `packages/ui/` directory structure
2. Create `packages/ui/package.json`
3. Create `packages/ui/tsconfig.json`
4. Create theme tokens in `src/theme/tokens.ts`
5. Create shared types in `src/types.ts`
6. Create Nav component
7. Create Footer component
8. Create ModeSwitch component
9. Create Button component
10. Create component styles
11. Create barrel export in `src/index.ts`
12. Run `npm install` at root
13. Commit: "feat(ui): add shared UI components and theme"

### Phase 3: Hub App
1. Create `apps/hub/` directory structure
2. Create `apps/hub/package.json`
3. Create Vite and TypeScript configs
4. Create `index.html`
5. Create `src/main.tsx` entry point
6. Create `src/App.tsx` with routing
7. Create `src/pages/Home.tsx` with mode cards
8. Create global styles
9. Run `npm install` at root
10. Test locally: `npm run dev:hub`
11. Test build: `npm run build:hub`
12. Commit: "feat(hub): implement hub landing page"

### Phase 4: Creative App
1. Create `apps/creative/` directory structure
2. Create `apps/creative/package.json`
3. Create Vite config with env variables
4. Create TypeScript config
5. Create `index.html`
6. Create `src/main.tsx` entry point
7. Create types in `src/types.ts`
8. Create all page components
9. Create VideoPlayer component
10. Create ProjectCard component
11. Create placeholder `src/data/projects.json`
12. Create global styles
13. Run `npm install` at root
14. Test locally: `npm run dev:creative`
15. Test build: `npm run build:creative`
16. Commit: "feat(creative): implement creative portfolio site"

### Phase 5: Security App
1. Create `apps/security/` directory structure
2. Create `apps/security/package.json` with markdown deps
3. Create Vite config
4. Create TypeScript config
5. Create `index.html`
6. Create `src/main.tsx` entry point
7. Create types in `src/types.ts`
8. Create all page components
9. Create MarkdownRenderer component
10. Create CaseStudyCard component
11. Create placeholder `src/data/projects.json`
12. Create example markdown post in `src/data/posts/`
13. Create global styles
14. Run `npm install` at root
15. Test locally: `npm run dev:security`
16. Test build: `npm run build:security`
17. Commit: "feat(security): implement security portfolio site"

### Phase 6: Infrastructure - Lambda
1. Create `infra/lambda/contact/` directory
2. Create Lambda `package.json`
3. Create Lambda types
4. Create Lambda handler with validation and SES
5. Build Lambda: `cd infra/lambda/contact && npm install && npm run build`
6. Commit: "feat(infra): add contact form lambda handler"

### Phase 7: Infrastructure - CDK
1. Create `infra/` directory structure
2. Create `infra/package.json`
3. Create `cdk.json` configuration
4. Create `infra/tsconfig.json`
5. Install CDK globally: `npm install -g aws-cdk`
6. Create `bin/app.ts` CDK app entry
7. Create `lib/constructs/static-site.ts` reusable construct
8. Create `lib/certificate-stack.ts` for ACM cert (us-east-1)
9. Create `lib/hub-stack.ts`
10. Create `lib/creative-stack.ts`
11. Create `lib/security-stack.ts`
12. Create `lib/api-stack.ts` for contact form API
13. Run `npm install` in infra/
14. Bootstrap CDK: `cdk bootstrap aws://383579119744/us-west-2`
15. Bootstrap us-east-1 for cert: `cdk bootstrap aws://383579119744/us-east-1`
16. Test synth: `npm run cdk:synth`
17. Commit: "feat(infra): add CDK infrastructure stacks"

### Phase 8: GitHub Actions CI/CD
1. Create `.github/workflows/` directory
2. Create `deploy.yml` workflow
3. Configure OIDC authentication with AWS
4. Add path filters for each app
5. Configure build and deploy jobs
6. Add CloudFront invalidation steps
7. Commit: "ci: add github actions deployment workflow"

### Phase 9: AWS Setup (Manual Steps)
1. Create IAM OIDC provider in AWS console
2. Create IAM role for GitHub Actions with trust policy
3. Attach policies to role: S3, CloudFront, CloudFormation
4. Create Route 53 hosted zone for stealinglight.hk (if not exists)
5. Note hosted zone ID for CDK
6. Verify SES email addresses for contact form
7. Update CDK stack props with actual values

### Phase 10: Initial Deployment
1. Set environment variables in GitHub repository secrets
2. Deploy infrastructure: `npm run cdk:deploy` (all stacks)
3. Note CloudFront distribution URLs
4. Update DNS if needed
5. Build all apps locally to verify
6. Push to GitHub main branch
7. Verify GitHub Actions deployments
8. Test all three sites end-to-end
9. Commit: "docs: update README with deployment details"

### Phase 11: Documentation and Polish
1. Update README with:
   - Complete setup instructions
   - Environment variable documentation
   - Deployment process
   - Local development guide
   - Troubleshooting section
2. Add placeholder images/videos documentation
3. Add contributing guidelines
4. Add LICENSE file
5. Commit: "docs: finalize documentation"

### Phase 12: Testing and Validation
1. Add unit tests for UI components
2. Add unit tests for Lambda handler
3. Run all tests: `npm test`
4. Run linter: `npm run lint`
5. Run type checker: `npm run typecheck`
6. Fix any issues found
7. Commit: "test: add unit tests for core functionality"
