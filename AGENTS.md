# AGENTS.md - AI Assistant Context

> This file provides context for AI assistants (Cline, GitHub Copilot, ChatGPT, etc.) working with this codebase.

## Project Overview

**Name**: Stealinglight HK
**Type**: Cinematography Portfolio Website / Single Page Application
**Language**: TypeScript
**Runtime**: Node.js 22 (bun for local dev, npm for CI/Amplify)
**Framework**: React 19 + Vite 7
**Styling**: Tailwind CSS 4 (via `@tailwindcss/vite` plugin)
**Animation**: Motion (framer-motion successor)
**Purpose**: Professional cinematography portfolio showcasing 19 film and video projects

## Architecture

### Directory Structure

```
stealinglightHK/
├── src/
│   ├── main.tsx                    # Application entry point
│   ├── app/
│   │   ├── App.tsx                 # Root component (section composition)
│   │   ├── components/
│   │   │   ├── Hero.tsx            # Hero with drone video background
│   │   │   ├── Portfolio.tsx       # Video grid with category filtering
│   │   │   ├── Clients.tsx         # Infinite-scroll brand marquee
│   │   │   ├── About.tsx           # Bio section
│   │   │   ├── Services.tsx        # Services overview
│   │   │   ├── Contact.tsx         # Contact form + Turnstile CAPTCHA
│   │   │   ├── Navigation.tsx      # Sticky nav with scroll tracking
│   │   │   ├── Footer.tsx          # Site footer
│   │   │   ├── Preloader.tsx       # Branded loading screen
│   │   │   ├── ScrollProgress.tsx  # Scroll position indicator
│   │   │   └── SectionErrorBoundary.tsx # Error boundary wrapper
│   │   └── config/
│   │       └── videos.ts           # Video metadata (19 projects)
│   ├── lib/
│   │   └── utils.ts                # cn() utility (clsx + tailwind-merge)
│   └── styles/
│       ├── index.css               # Global styles
│       ├── tailwind.css            # Tailwind directives (@import 'tailwindcss')
│       ├── theme.css               # Cinematic color theme (@theme inline)
│       └── fonts.css               # Self-hosted font config (Fontsource)
├── infra/                          # AWS CDK infrastructure
│   ├── bin/app.ts                  # CDK app entry point
│   ├── lib/                        # CDK stack definitions
│   │   ├── amplify-hosting-stack.ts
│   │   ├── contact-stack.ts
│   │   ├── media-stack.ts
│   │   ├── github-oidc-stack.ts
│   │   └── aspects/                # CDK aspects (tag compliance)
│   ├── lambda/contact/index.js     # Lambda contact form handler
│   └── __tests__/                  # Jest tests for Lambda
├── tests/                          # Playwright E2E tests
├── scripts/                        # Utility scripts
├── docs/screenshots/               # README screenshots
├── public/                         # Static assets (logos, SEO files)
├── eslint.config.js                # ESLint flat config
├── vite.config.ts                  # Vite configuration
├── tsconfig.json                   # TypeScript configuration
├── playwright.config.ts            # Playwright E2E config
├── package.json                    # Dependencies and scripts
├── bun.lock                        # Bun lockfile (local dev)
└── package-lock.json               # npm lockfile (CI)
```

### Key Components

1. **Layout Components**
   - `App.tsx`: Root component, composes all sections, configures Sonner toaster
   - `Navigation.tsx`: Sticky navigation with scroll tracking and mobile menu
   - `Footer.tsx`: Site footer

2. **Content Sections**
   - `Hero.tsx`: Landing section with drone footage background video and staggered animations
   - `Portfolio.tsx`: Video grid with category filtering and cinematic modal
   - `Clients.tsx`: Infinite-scroll brand marquee with 15 logos
   - `About.tsx`: Bio section with profile image
   - `Services.tsx`: Services overview
   - `Contact.tsx`: Serverless contact form with Turnstile CAPTCHA

3. **Utility Components**
   - `Preloader.tsx`: Branded loading screen while hero video buffers
   - `ScrollProgress.tsx`: Thin amber bar showing scroll position
   - `SectionErrorBoundary.tsx`: Error boundary wrapper for graceful crash recovery

4. **No UI Component Library**
   - All shadcn/ui components were removed in Phase 2
   - Components are built directly with Tailwind CSS utility classes
   - `cn()` utility in `src/lib/utils.ts` merges class names (clsx + tailwind-merge)

## Technology Stack

### Core Technologies

- **React 19**: UI framework with hooks
- **TypeScript**: Type-safe development (ES2022 target, strict mode)
- **Vite 7**: Build tool and dev server
- **Tailwind CSS 4**: Utility-first CSS via `@tailwindcss/vite` plugin (no PostCSS config needed)

### Animation

- **Motion 12**: Animation library (framer-motion successor) for scroll-triggered reveals
- **tw-animate-css**: Tailwind animation utilities

### Forms & Notifications

- **Controlled inputs with useState**: No form library — direct state management
- **Sonner**: Toast notification system

### Infrastructure

- **AWS CDK**: Infrastructure as Code (TypeScript)
- **AWS Lambda (Node.js 22)**: Contact form backend
- **AWS API Gateway**: REST API with rate limiting
- **AWS SES**: Email delivery
- **AWS Amplify**: Static site hosting with GitHub integration
- **AWS CloudFront + S3**: Media CDN for videos and thumbnails
- **Cloudflare Turnstile**: Invisible CAPTCHA protection

### Development

- **ESLint 9**: Flat config format (`eslint.config.js`) — no legacy `.eslintrc`
- **Prettier**: Code formatting
- **Husky + lint-staged**: Pre-commit hooks
- **Commitlint**: Conventional commit message enforcement
- **Playwright**: E2E browser testing
- **Jest**: Infrastructure/Lambda unit tests

### Fonts

- **Self-hosted via Fontsource**: Inter (body), Space Grotesk (headings)
- Imported in `main.tsx`, no external CDN dependency

## Development Patterns

### Component Structure

- Named function declarations (not arrow functions): `export function Hero() { ... }`
- Section components wrap in `<section>` with `id` for scroll navigation
- Local state with `useState` — no global state management
- Motion `whileInView` for scroll-triggered entrance animations

### Styling Approach

- Tailwind utility classes for all styling
- Custom cinematic theme colors via `@theme inline` in `theme.css`
- Prefix: `cinematic-*` (e.g., `bg-cinematic-black`, `text-cinematic-amber`)
- `cn()` for conditional class merging
- Mobile-first responsive design

### File Naming

- PascalCase for React components: `Hero.tsx`, `Portfolio.tsx`
- kebab-case for CSS files: `theme.css`, `fonts.css`
- camelCase for config files: `videos.ts`

### Code Style

- TypeScript strict mode
- ESLint flat config with typescript-eslint, react, react-hooks, security plugins
- Prettier: single quotes, semicolons, 2-space indent, 100 char width
- Conventional commits enforced (lowercase subject, max 72 chars)

## Development Workflow

### Installation

```bash
bun install     # Local development
npm install     # CI-compatible alternative
```

### Development

```bash
bun dev          # Start dev server (http://localhost:5173)
```

### Building

```bash
bun run build    # Production build
bun run preview  # Preview production build (http://localhost:4173)
```

### Linting & Formatting

```bash
bun run lint     # Run ESLint
bun run lint:fix # Auto-fix lint issues
```

### Testing

```bash
bun run test     # Playwright E2E tests
bun run test:ui  # Interactive Playwright UI
```

### Infrastructure (CDK)

```bash
cd infra
npm install
npm run build                    # Compile TypeScript
npm run synth                    # Generate CloudFormation templates
CONTACT_EMAIL=x@y.com npx cdk deploy --all  # Deploy all stacks
npm test                         # Jest tests
```

**AWS Profile**: Use `AWS_PROFILE=stealinglight+website` for deployments.

**Package Managers**: Use bun for frontend development (faster local builds). Use npm for infrastructure/CDK (better CDK compatibility). CI/CD uses npm for all deployments.

## Configuration Files

### eslint.config.js (Flat Config)

- Base: `@eslint/js` recommended, `typescript-eslint` recommended
- Plugins: `react` (flat), `react-hooks` (flat), `security`
- Custom: `no-console` warn (except warn/error), unused vars with `^_` ignored
- Lambda override: allows `console.log` for CloudWatch logging

### vite.config.ts

- Plugins: `@vitejs/plugin-react`, `@tailwindcss/vite`
- Alias: `@` maps to `src/`

### tsconfig.json

- Strict mode, ES2022 target, ESNext modules
- Path alias: `@/*` maps to `./src/*`

## Common Tasks

### Adding a New Page Section

1. Create component in `src/app/components/[SectionName].tsx`
2. Use `export function SectionName()` with `<section id="sectionname">`
3. Add Motion `whileInView` animations following existing patterns
4. Import in `App.tsx` and add to component composition
5. Wrap with `SectionErrorBoundary` in App.tsx
6. Update Navigation links if needed

### Styling a Component

1. Use Tailwind utility classes with cinematic theme colors
2. Use `cn()` from `src/lib/utils.ts` for conditional classes
3. Follow mobile-first responsive pattern: `text-base md:text-lg lg:text-xl`

### Managing Video Content

- Video metadata lives in `src/app/config/videos.ts`
- Media files served from CloudFront CDN (S3 bucket)
- CDN URL configured via `VITE_CDN_BASE_URL` environment variable

## Environment Variables

### Frontend (Vite)

- `VITE_CONTACT_API_URL`: API Gateway endpoint for contact form
- `VITE_CDN_BASE_URL`: CloudFront CDN URL for media assets
- `VITE_TURNSTILE_SITE_KEY`: Cloudflare Turnstile widget site key

### Infrastructure

- `CONTACT_EMAIL`: SES-verified email for receiving contact form submissions
- `TURNSTILE_SECRET`: Cloudflare Turnstile secret key for server-side verification

## Gotchas and Notes

### No PostCSS Config

- Tailwind CSS v4 uses the Vite plugin directly (`@tailwindcss/vite`)
- No `postcss.config.mjs` or `tailwind.config.js` needed

### No shadcn/ui

- All 44 shadcn/ui components were removed during cleanup
- No `src/app/components/ui/` directory exists
- Build components directly with Tailwind utility classes

### Dual Package Managers

- `bun.lock` for local development
- `package-lock.json` for CI and Amplify builds
- Keep both in sync when adding dependencies

### ESLint Flat Config

- Uses `eslint.config.js` (flat config), NOT `.eslintrc.json`
- No `ESLINT_USE_FLAT_CONFIG=false` flag needed

### Vite Path Aliases

- `@` is aliased to `src/` directory
- Must update both `vite.config.ts` and `tsconfig.json` for new aliases

## AI Assistant Tips

### When Adding Features

1. No UI component library — build with Tailwind utility classes directly
2. Follow TypeScript patterns from existing section components
3. Use Motion for animations, matching existing `whileInView` patterns
4. Test with `bun dev` before building

### When Debugging

1. Check browser console for React errors
2. Verify imports and path aliases (`@/` prefix)
3. Check TypeScript errors in IDE
4. Run `bun run lint` for linting issues

### When Refactoring

1. Maintain section-based component architecture
2. Keep all state local (no global state management)
3. Preserve accessibility features (reduced motion support, keyboard navigation)
4. Run Playwright tests after changes

### Code Generation Best Practices

- Generate TypeScript, not JavaScript
- Use named function declarations for components
- Apply Tailwind utility classes for styling (no CSS modules)
- Include Motion animations for section reveals
- Use `cn()` for conditional class merging
