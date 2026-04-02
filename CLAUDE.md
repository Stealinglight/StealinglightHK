<!-- GSD:project-start source:PROJECT.md -->

## Project

**stealinglight.hk**

A cinematography portfolio website for stealinglight.hk — a single-page React app showcasing previous film and video work. The site serves as a living portfolio for a cinematographer no longer actively pursuing business, but who wants their work presented beautifully and to remain contactable for select opportunities. Built with React + Vite + Tailwind CSS v4, deployed on AWS Amplify with serverless infrastructure for the contact form.

**Core Value:** Visitors experience the cinematography work in a contemporary, cinematic, artistically crafted presentation — and can easily reach out if interested.

### Constraints

- **Tech stack**: React 19 + Vite 7 + Tailwind CSS 4 + TypeScript — keep existing stack
- **Infrastructure**: AWS (Amplify, Lambda, API Gateway, SES, CloudFront, S3) — keep existing CDK approach
- **Deployment**: AWS Amplify with GitHub integration — no changes needed
- **CI/CD**: GitHub Actions — existing workflows, fix and enhance
- **Package manager**: bun (local) + npm (CI) — dual approach stays for now
- **Design direction**: Contemporary, cinematic, artistic with flow and character
- **Content**: Three sections matter — work showcase, about/bio, contact form
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->

## Technology Stack

## Languages

- TypeScript - Frontend (React SPA) and infrastructure (AWS CDK, Lambda)
- CSS - Tailwind CSS v4 with custom theme
- JavaScript - Husky hooks (`pre-commit`, `commit-msg`), Jest config (`infra/jest.config.js`)
- HTML - Single entry point `index.html` with SEO structured data (JSON-LD)
- YAML - GitHub Actions workflows (`.github/workflows/`)

## Runtime

- Node.js 22 - CI/CD (GitHub Actions), Lambda runtime, Amplify builds
- Browser - ES2022 target with DOM APIs
- npm - Used in CI, Amplify builds, and `lint-staged`; lockfile at `package-lock.json`
- bun - Used for local development; lockfile at `bun.lock`
- npm (infra) - Separate `infra/package-lock.json` for CDK project

## Frameworks

- React 19.2.4 - UI framework (`devDependencies` + `peerDependencies`)
- Vite 7.3.1 - Build tool and dev server; config at `vite.config.ts`
- Tailwind CSS 4.1.18 - Utility-first CSS via `@tailwindcss/vite` plugin
- Radix UI - Headless primitive components (accordion, dialog, dropdown-menu, tabs, tooltip, etc.) - 26 packages
- MUI 7.3.7 - Material UI components and icons (`@mui/material`, `@mui/icons-material`)
- Emotion 11.14.x - CSS-in-JS runtime required by MUI (`@emotion/react`, `@emotion/styled`)
- shadcn/ui pattern - `class-variance-authority` 0.7.1, `clsx` 2.1.1, `tailwind-merge` 3.4.0, `lucide-react` 0.563.0
- Motion 12.29.2 - Animation library (framer-motion successor)
- tw-animate-css 1.4.0 - Tailwind CSS animation utilities
- Playwright 1.58.1 - E2E browser testing; config at `playwright.config.ts`
- Jest 30.2.0 - Unit tests for infra/Lambda code; config at `infra/jest.config.js`
- AWS CDK 2.236.0+ (library: `aws-cdk-lib`) - Infrastructure as Code
- AWS CDK CLI 2.1112.0+ - CDK deployment toolchain
- constructs 10.4.5 - CDK construct library
- `@vitejs/plugin-react` 5.1.2 - React Fast Refresh for Vite
- `@tailwindcss/vite` 4.1.18 - Tailwind CSS Vite integration (replaces PostCSS plugin)
- ts-node - Used by CDK to execute `bin/app.ts` (via `cdk.json` app command)

## Key Dependencies

- `react` 19.2.4 + `react-dom` 19.2.4 - Core rendering
- `motion` 12.29.2 - Page transitions and scroll animations
- `react-hook-form` 7.71.1 - Contact form state management
- `sonner` 2.0.7 - Toast notification system (used in `App.tsx`)
- `@aws-sdk/client-ses` 3.980.0 - Email sending in Lambda contact form
- `embla-carousel-react` 8.6.0 - Carousel/slider component
- `react-responsive-masonry` 2.7.1 - Masonry grid layout
- `react-slick` 0.31.0 - Slider component
- `react-resizable-panels` 4.5.8 - Resizable panel layout
- `vaul` 1.1.2 - Drawer component
- `cmdk` 1.1.1 - Command palette
- `lucide-react` 0.563.0 - Icon library
- `date-fns` 4.1.0 - Date formatting
- `react-day-picker` 9.13.0 - Date picker component
- `recharts` 3.7.0 - Charting library
- `next-themes` 0.4.6 - Theme management
- `react-dnd` 16.0.1 + `react-dnd-html5-backend` 16.0.1 - Drag and drop
- `aws-cdk-lib` 2.236.0 - AWS CDK constructs
- `aws-sdk-client-mock` 4.1.0 - AWS SDK mocking for tests
- `eslint` 9.39.2 - Linting (runs in legacy flat config mode: `ESLINT_USE_FLAT_CONFIG=false`)
- `@typescript-eslint/eslint-plugin` 8.54.0 + `@typescript-eslint/parser` 8.54.0
- `eslint-plugin-react` 7.37.5 + `eslint-plugin-react-hooks` 7.0.1
- `eslint-plugin-security` 3.0.1 - Security-focused lint rules
- `prettier` 3.8.1 - Code formatting
- `husky` 9.1.7 - Git hooks
- `lint-staged` 16.2.7 - Pre-commit linting
- `@commitlint/cli` 20.4.0 + `@commitlint/config-conventional` 20.4.0 - Commit message enforcement

## Configuration

- Config: `tsconfig.json`
- Target: ES2022, Module: ESNext, JSX: react-jsx
- Strict mode enabled, `noUnusedLocals` and `noUnusedParameters` enforced
- Path alias: `@/*` maps to `./src/*`
- Module resolution: bundler
- Config: `infra/tsconfig.json`
- Target: ES2022, Module: CommonJS
- Strict mode enabled, `noUnusedLocals` and `noUnusedParameters` NOT enforced
- Output: `infra/dist/`
- Config: `vite.config.ts`
- Plugins: `@vitejs/plugin-react`, `@tailwindcss/vite`
- Path alias: `@` resolves to `./src`
- Config: `.eslintrc.json` (legacy JSON format, NOT flat config)
- Runs with `ESLINT_USE_FLAT_CONFIG=false` environment variable
- Extends: `eslint:recommended`, `@typescript-eslint/recommended`, `react/recommended`, `react-hooks/recommended`, `security/recommended-legacy`
- Custom rules: `react/react-in-jsx-scope` off, `no-console` warn (except warn/error), unused vars with `_` prefix ignored
- Ignores: `dist`, `build`, `node_modules`, `cdk.out`, `*.js`
- Config: `.prettierrc`
- Settings: semicolons, single quotes, 2-space tabs, ES5 trailing commas, 100 char print width, LF line endings
- Config: `commitlint.config.js`
- Extends: `@commitlint/config-conventional`
- Allowed types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert, security
- Subject: lowercase required, max 72 characters
- Config: `postcss.config.mjs` - Empty (Tailwind v4 via Vite plugin handles everything)
- Entry: `src/styles/tailwind.css` - Uses `@import 'tailwindcss' source(none)` with `@source` directive
- Animation: `tw-animate-css` imported
- Theme: Custom theme in `src/styles/theme.css`
- Fonts: Custom font imports in `src/styles/fonts.css`
- Config: `playwright.config.ts`
- Test dir: `./tests`
- Base URL: `http://localhost:4173` (Vite preview server)
- Browsers: Chromium only
- CI: 1 worker, 2 retries, forbidOnly enforced
- Config: `infra/jest.config.js`
- Environment: node
- Test match: `**/__tests__/**/*.test.js`
- Coverage: `lambda/**/*.js`
- Config: `infra/cdk.json`
- App command: `npx ts-node --prefer-ts-exts bin/app.ts`
- Context: appName=stealinglight, domainName=stealinglight.hk, branch=main, environment=production

## Platform Requirements

- Node.js 22
- bun (local) or npm (CI-compatible)
- Git with Husky hooks
- AWS Amplify - Static site hosting with GitHub integration
- AWS Lambda (Node.js 22) - Contact form backend
- AWS API Gateway - REST API for contact form
- AWS CloudFront - Media CDN for video assets
- AWS S3 - Media storage (videos, thumbnails)
- AWS SES - Email delivery
- GitHub Actions on ubuntu-latest with Node.js 22
- OIDC-based AWS authentication (no long-lived credentials)

## npm Overrides

- `pnpm.overrides.vite`: 6.3.5 (pnpm compatibility)
- `fast-xml-parser`: 5.5.8 (security fix for transitive dependency)
- `minimatch`: 10.2.4 (security fix for transitive dependency)
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->

## Conventions

## Naming Patterns

- PascalCase for React component files: `Hero.tsx`, `Navigation.tsx`, `Contact.tsx`
- kebab-case for shadcn/ui primitive components: `alert-dialog.tsx`, `hover-card.tsx`, `input-otp.tsx`
- kebab-case for hooks: `use-mobile.ts`
- kebab-case for CSS files: `index.css`, `theme.css`, `fonts.css`
- camelCase for config/data files: `videos.ts`
- lowercase for utility files: `utils.ts`
- camelCase for all functions: `scrollToWork`, `handleChange`, `handleSubmit`, `togglePlay`
- PascalCase for React components: `Hero`, `Navigation`, `Contact`, `Button`
- `use` prefix for custom hooks: `useIsMobile`, `useFormField`
- `handle` prefix for event handlers: `handleChange`, `handleSubmit`, `handleTimeUpdate`, `handleProgressClick`
- camelCase for all variables: `formData`, `isSubmitting`, `videoRef`, `isMobileMenuOpen`
- SCREAMING_SNAKE_CASE for constants: `CONTACT_API_URL`, `CDN_BASE_URL`, `MOBILE_BREAKPOINT`, `ERROR_IMG_SRC`
- Boolean state variables use `is`/`has`/`show` prefix: `isSubmitting`, `isPlaying`, `isMuted`, `showPhone`, `showControls`
- PascalCase for interfaces: `HeroProps`, `ReelProps`, `FormData`
- `Props` suffix for component prop interfaces: `HeroProps`, `ReelProps`
- Inline types used for simple cases; named interfaces for component props

## Code Style

- Config: `.prettierrc`
- Semicolons: enabled (`"semi": true`)
- Quotes: single (`"singleQuote": true`)
- Tab width: 2 spaces (`"tabWidth": 2`)
- Trailing commas: ES5 (`"trailingComma": "es5"`)
- Print width: 100 characters (`"printWidth": 100`)
- Bracket spacing: enabled (`"bracketSpacing": true`)
- Arrow parens: always (`"arrowParens": "always"`)
- End of line: LF (`"endOfLine": "lf"`)
- Config: `.eslintrc.json` (JSON format, legacy flat config mode)
- Run with `ESLINT_USE_FLAT_CONFIG=false` flag
- Extends: `eslint:recommended`, `@typescript-eslint/recommended`, `react/recommended`, `react-hooks/recommended`, `security/recommended-legacy`
- `react/react-in-jsx-scope`: off (React 19 automatic JSX transform)
- `react/prop-types`: off (TypeScript handles prop validation)
- `@typescript-eslint/explicit-module-boundary-types`: off
- `@typescript-eslint/no-unused-vars`: warn, with `^_` pattern for ignored args
- `no-console`: warn, with `console.warn` and `console.error` allowed
- Ignored patterns: `dist`, `build`, `node_modules`, `cdk.out`, `*.js`
- `*.{ts,tsx}` files: `npm run lint:fix` (ESLint auto-fix with zero warnings)
- `*.{json,md,css}` files: `prettier --write`
- Strict mode enabled in `tsconfig.json`
- `noUnusedLocals`: true
- `noUnusedParameters`: true
- `noFallthroughCasesInSwitch`: true
- Target: ES2022
- Module: ESNext
- JSX: react-jsx (automatic transform)

## Component Patterns

- Named exports: `export function Hero() { ... }`
- Wrap content in `<section>` with `id` attribute for scroll navigation: `<section id="portfolio">`
- Accept props via TypeScript interface when configurable
- Use `motion` (framer-motion) for entrance animations with `whileInView`
- Standard animation pattern:
- Consistent section padding: `className="py-24 md:py-32"`
- Max width container: `className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"`
- Named function declarations (not arrow functions): `function Button({ ... }) { ... }`
- Named exports at bottom of file: `export { Button, buttonVariants };`
- Use `data-slot` attribute for component identification: `data-slot="button"`
- Accept `className` prop and merge with `cn()` utility
- Spread remaining props with `...props`
- Wrap Radix UI primitives with styling
- Use `class-variance-authority` (cva) for variant-based styling on complex components
- Pattern:
- Destructure props in function signature
- Use `React.ComponentProps<"element">` for extending native HTML elements
- Use `VariantProps<typeof variants>` for cva variant types
- Optional props use `?` syntax: `videoSrc?: string`
- Default prop values via destructuring: `title = 'Showreel'`
- Local state with `useState` for all component state
- No global state management library
- Toast notifications via `sonner` (`toast.success()`, `toast.error()`)
- Form state managed with controlled inputs and `useState` (not react-hook-form in custom components)

## Import Organization

- `@/*` maps to `./src/*` (configured in both `tsconfig.json` and `vite.config.ts`)
- Used sparingly; most imports use relative paths (`./`, `../`)
- shadcn/ui components import utils with relative path: `import { cn } from "./utils"`
- No barrel `index.ts` files
- Each component file exports its own symbols directly
- shadcn/ui components export multiple related symbols from a single file (e.g., `Card`, `CardHeader`, `CardContent` from `card.tsx`)

## Error Handling

- Try/catch around async operations (`fetch` calls in `Contact.tsx`)
- User-facing errors shown via `sonner` toast: `toast.error(message)`
- `console.error` for developer-facing errors (allowed by ESLint rule)
- `console.warn` for configuration issues: `console.warn('VITE_CONTACT_API_URL is not set')`
- Pattern:
- Try/catch wrapping the entire handler body
- Structured JSON error responses with appropriate HTTP status codes (400, 403, 500)
- Input validation with early returns for invalid data
- HTML sanitization of user inputs via `escapeHtml()` function
- Newline stripping to prevent header injection
- `console.error` for server errors; structured `console.log(JSON.stringify(...))` for successful operations

## Logging

- `console.error` for caught exceptions in async operations
- `console.warn` for configuration warnings
- Direct `console.log` is warned against by ESLint (`no-console` rule)
- Structured JSON logging: `console.log(JSON.stringify({ event, sourceIp, timestamp }))`
- `console.error` for caught exceptions with contextual prefix: `console.error('Error sending email:', error)`

## Comments

- Inline comments for non-obvious logic or workarounds
- Section dividers within JSX: `{/* Video Modal */}`, `{/* Desktop Menu */}`, `{/* Scroll indicator */}`
- Configuration explanations: `// CloudFront CDN base URL for video assets`
- Security context: `// Sanitize user input to prevent HTML injection`
- Not used in the codebase
- No JSDoc annotations on functions or interfaces

## Function Design

## Module Design

- Section components: single named export per file (`export function Hero`)
- shadcn/ui components: multiple named exports per file (`export { Button, buttonVariants }`)
- Config files: multiple named exports (`export const heroVideo`, `export const gridVideos`)
- Utility files: single named export (`export function cn`)
- App component: default export (`export default function App`)

## Git Conventions

- Format: conventional commits (`@commitlint/config-conventional`)
- Config: `commitlint.config.js`
- Subject case: **lowercase required** (`subject-case: [2, 'always', 'lower-case']`)
- Subject max length: 72 characters
- Allowed types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`, `security`
- Enforced via Husky `commit-msg` hook: `npx --no -- commitlint --edit "$1"`
- Examples from recent history:
- Main branch: `main`
- Feature branches merged via pull requests

## CSS/Styling Conventions

- Use `cinematic-*` prefix for project-specific colors: `bg-cinematic-black`, `text-cinematic-amber`, `bg-cinematic-dark`
- Defined in `src/styles/theme.css` via `@theme inline` block
- Colors: `cinematic-black` (#0a0a0a), `cinematic-dark` (#141414), `cinematic-gray` (#1f1f1f), `cinematic-amber` (#d4a853), `cinematic-amber-light` (#e6c17a)
- Use `cn()` from `src/app/components/ui/utils.ts` (wraps `clsx` + `tailwind-merge`)
- Required for shadcn/ui components that accept `className` prop
- Display: Space Grotesk (headings)
- Body: Inter (body text)
- Loaded via Google Fonts in `index.html`
- CSS variables defined in `src/styles/fonts.css`
- Mobile-first approach
- Breakpoints: `md:` (768px), `lg:` (1024px), `sm:` (640px)
- Standard pattern: `className="text-base md:text-lg lg:text-xl"`
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->

## Architecture

## Pattern Overview

- Single-page React app with section-based navigation (no client-side routing)
- Scroll-based navigation between vertically stacked sections
- Serverless contact form backend via AWS Lambda + API Gateway + SES
- Media assets served from a separate AWS CloudFront CDN backed by S3
- Infrastructure defined as code using AWS CDK (TypeScript)
- Deployed via AWS Amplify Hosting with GitHub integration

## Layers

- Purpose: Renders the portfolio website as a single-page application
- Location: `src/`
- Contains: React components, styles, configuration data
- Depends on: React, Motion (framer-motion), Tailwind CSS, Radix UI, lucide-react
- Used by: End users via browser
- Purpose: Handles contact form submissions
- Location: `infra/lambda/contact/index.js`
- Contains: Lambda handler with input validation, sanitization, CORS handling, SES email dispatch
- Depends on: `@aws-sdk/client-ses`, AWS Lambda runtime
- Used by: Contact form component via `fetch()` POST
- Purpose: Defines and provisions all AWS resources
- Location: `infra/`
- Contains: CDK stacks, Lambda source, CDK aspects
- Depends on: `aws-cdk-lib`, `constructs`
- Used by: CI/CD pipeline and manual deployments
- Purpose: Serves client brand logos, SEO files, favicons
- Location: `public/`
- Contains: SVG logos, `robots.txt`, `sitemap.xml`, `humans.txt`, `llms.txt`
- Used by: Browser at runtime (served from Amplify CDN)
- Purpose: Delivers video content and images via CloudFront
- Location: External (S3 bucket + CloudFront distribution at `d2fc83sck42gx7.cloudfront.net`)
- Contains: Video files (MP4, MOV), thumbnails (JPG), profile images
- Used by: Portfolio, Hero, and About components

## Data Flow

- No global state management library; all state is component-local via `useState`
- Navigation scroll state tracked in `Navigation.tsx` via `useEffect` on `window.scrollY`
- Contact form state managed locally with `useState<FormData>` in `Contact.tsx`
- Video modal state (active video, hover state) managed locally in `Portfolio.tsx`
- Mobile menu open/close state managed locally in `Navigation.tsx`
- No React Context providers or reducers

## Key Abstractions

- Purpose: Each represents a full-width page section in the SPA
- Examples: `src/app/components/Hero.tsx`, `src/app/components/Portfolio.tsx`, `src/app/components/About.tsx`, `src/app/components/Services.tsx`, `src/app/components/Clients.tsx`, `src/app/components/Contact.tsx`, `src/app/components/Footer.tsx`
- Pattern: Each is a named export function component with its own `<section>` root element, `id` attribute for scroll targeting, and self-contained local state
- Purpose: Reusable, styled component primitives (mostly unused currently)
- Examples: `src/app/components/ui/button.tsx`, `src/app/components/ui/dialog.tsx`, `src/app/components/ui/card.tsx`
- Pattern: shadcn/ui pattern using Radix UI primitives + `class-variance-authority` (cva) + `cn()` utility from `src/app/components/ui/utils.ts`
- Purpose: Centralized video metadata and CDN URL construction
- Examples: `src/app/config/videos.ts`
- Pattern: Exports `videoProjects` array (read-only via `as const`), derives `featuredVideo`, `gridVideos`, and `heroVideo` from it. Uses `CDN_BASE_URL` constant for all media URLs.
- Purpose: Each stack encapsulates a distinct AWS service concern
- Examples: `infra/lib/contact-stack.ts`, `infra/lib/media-stack.ts`, `infra/lib/amplify-hosting-stack.ts`, `infra/lib/github-oidc-stack.ts`
- Pattern: Standard CDK Stack classes with typed Props interfaces, cross-stack references via public properties (e.g., `contactStack.apiUrl` fed into `amplifyStack`)

## Entry Points

- Location: `index.html` -> `src/main.tsx`
- Triggers: Page load
- Responsibilities: Mounts React app via `createRoot()`, imports global CSS (`src/styles/index.css`)
- Location: `src/app/App.tsx`
- Triggers: React render from `src/main.tsx`
- Responsibilities: Composes all section components in order (Navigation, Hero, Portfolio, Clients, About, Services, Contact, Footer), configures Sonner toaster
- Location: `infra/bin/app.ts`
- Triggers: `cdk synth`, `cdk deploy`, `cdk diff` commands
- Responsibilities: Instantiates all CDK stacks, configures cross-stack dependencies (`amplifyStack.addDependency(contactStack)`), applies `TagComplianceAspect` to all stacks, reads context values and environment variables
- Location: `infra/lambda/contact/index.js`
- Triggers: API Gateway POST to `/contact` endpoint
- Responsibilities: CORS preflight handling, request validation, input sanitization, SES email dispatch

## Error Handling

- Contact form: try/catch around `fetch()`, displays error via `toast.error()` from Sonner (`src/app/components/Contact.tsx`)
- API URL missing: early return with warning toast if `VITE_CONTACT_API_URL` is not set
- Image loading: `ImageWithFallback` component (`src/app/components/figma/ImageWithFallback.tsx`) catches `onError` and shows placeholder SVG
- Input validation returns `400` with specific error messages (missing body, missing fields, invalid email, length exceeded)
- SES send failure returns `500` with generic user-facing message
- All responses include CORS headers regardless of status code
- Errors logged via `console.error` (captured by CloudWatch)
- CloudWatch alarm for Lambda errors (threshold: 5 errors in 5 minutes) defined in `infra/lib/contact-stack.ts`
- CloudWatch alarm for API Gateway 5xx errors (threshold: 5 in 5 minutes)
- CloudWatch alarm for API Gateway 4xx errors (threshold: 50 in 5 minutes, abuse detection)

## Cross-Cutting Concerns

- Frontend: `console.error` and `console.warn` for error/warning conditions in Contact component
- Lambda: `console.error` for SES failures, captured by CloudWatch Logs (1-week retention set in `infra/lib/contact-stack.ts`)
- No structured logging framework on either side
- Frontend: Basic presence check before API call (`src/app/components/Contact.tsx`)
- Lambda: Field presence, email regex, input sanitization (strips `<>` tags), length limits (name: 200, email: 254, subject: 200, message: 5000) in `infra/lambda/contact/index.js`
- No user authentication (public portfolio site)
- Contact form protected by CORS origin allowlist (configured per-environment)
- API Gateway rate limiting: 10 requests/sec, burst limit 20
- Lambda-level CORS handling in `getCorsHeaders()` function validates request origin against `ALLOWED_ORIGINS` env var
- API Gateway-level CORS preflight configured via `defaultCorsPreflightOptions`
- Default allowed origins: `localhost:5173`, `localhost:3000`, `stealinglight.hk`, `www.stealinglight.hk`
- CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy all configured in `infra/lib/amplify-hosting-stack.ts` via `customHeaders` YAML
- All AWS resources tagged via `TagComplianceAspect` (`infra/lib/aspects/tag-compliance-aspect.ts`) with Project, Environment, ManagedBy, Repository
- Structured data (JSON-LD) with Person, LocalBusiness, WebSite, FAQPage schemas in `index.html`
- Open Graph and Twitter Card meta tags
- `public/robots.txt`, `public/sitemap.xml`, `public/humans.txt`, `public/llms.txt`
- All section components use `motion` (framer-motion successor) for scroll-triggered reveal animations via `whileInView`
- Navigation uses `motion` for initial slide-in and mobile menu transitions
- Hero uses staggered `motion` animations with custom easing
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->

## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:

- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.

<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->

## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.

<!-- GSD:profile-end -->
