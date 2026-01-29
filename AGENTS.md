# AGENTS.md - AI Assistant Context

> This file provides context for AI assistants (Cline, GitHub Copilot, ChatGPT, etc.) working with this codebase.

## Project Overview

**Name**: Stealinglight HK
**Type**: Portfolio Website / Single Page Application
**Language**: TypeScript
**Runtime**: Bun
**Framework**: React 18 + Vite
**UI Library**: shadcn/ui + Tailwind CSS
**Purpose**: Professional portfolio and business showcase website

## Architecture

### Directory Structure

```
stealinglightHK/
├── src/
│   ├── main.tsx              # Application entry point
│   ├── app/
│   │   ├── App.tsx           # Main application component
│   │   └── components/
│   │       ├── About.tsx     # About section component
│   │       ├── Clients.tsx   # Client showcase component
│   │       ├── Contact.tsx   # Contact form/section
│   │       ├── Footer.tsx    # Site footer
│   │       ├── Hero.tsx      # Hero/landing section
│   │       ├── Navigation.tsx # Navigation bar
│   │       ├── Portfolio.tsx  # Portfolio showcase
│   │       ├── Services.tsx   # Services section
│   │       ├── figma/        # Figma-related utilities
│   │       │   └── ImageWithFallback.tsx
│   │       └── ui/           # shadcn/ui components (40+ components)
│   └── styles/
│       ├── fonts.css         # Custom font definitions
│       ├── index.css         # Main styles
│       ├── tailwind.css      # Tailwind base
│       └── theme.css         # Theme variables
├── guidelines/
│   └── Guidelines.md         # Project guidelines
├── index.html               # HTML entry point
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── bun.lockb               # Bun lockfile
└── package.json            # Dependencies and scripts
```

### Key Components

1. **Layout Components**
   - `App.tsx`: Main application shell, orchestrates all sections
   - `Navigation.tsx`: Site navigation with responsive menu
   - `Footer.tsx`: Site footer with links and information

2. **Content Sections**
   - `Hero.tsx`: Landing section with primary CTA
   - `About.tsx`: About/introduction section
   - `Services.tsx`: Services offered section
   - `Portfolio.tsx`: Project showcase/gallery
   - `Clients.tsx`: Client logos/testimonials
   - `Contact.tsx`: Contact form/information

3. **UI Components** (`src/app/components/ui/`)
   - 40+ shadcn/ui components for consistent design
   - Includes: buttons, forms, dialogs, cards, navigation, etc.
   - All components follow shadcn/ui patterns

4. **Utilities**
   - `ImageWithFallback.tsx`: Robust image loading with fallback handling

## Technology Stack

### Core Technologies
- **Bun**: JavaScript runtime and package manager
- **React 18**: UI framework with hooks and modern patterns
- **TypeScript**: Type-safe JavaScript
- **Vite**: Build tool and dev server (fast HMR)

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality React components
- **Radix UI**: Accessible component primitives (via shadcn)
- **Lucide React**: Icon library

### State & Forms
- **React Hook Form**: Form state management
- **Zod**: Schema validation

### Development
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **PostCSS**: CSS processing

## Development Patterns

### Component Structure
- Functional components with TypeScript
- Props interfaces defined at component level
- Hooks for state and side effects
- Composition over inheritance

### Styling Approach
- Tailwind utility classes for styling
- CSS variables for theming (theme.css)
- Custom fonts loaded via fonts.css
- Responsive design with Tailwind breakpoints

### File Naming
- PascalCase for component files (e.g., `Hero.tsx`)
- kebab-case for utility/config files
- Component files include `.tsx` extension

### Code Style
- TypeScript strict mode enabled
- ESLint and Prettier for code quality
- Functional components preferred
- Props destructuring common

## Development Workflow

### Installation
```bash
bun install
```

### Development
```bash
bun dev          # Start dev server (default: http://localhost:5173)
```

### Building
```bash
bun build        # Production build
bun preview      # Preview production build
```

### Linting
```bash
bun lint         # Run ESLint
```

### Infrastructure (CDK)
```bash
cd infra
npm install
npm run build                    # Compile TypeScript
npm run synth                    # Generate CloudFormation templates
CONTACT_EMAIL=x@y.com cdk deploy --all  # Deploy all stacks
npm test                         # Jest tests
```

**AWS Profile**: Use `AWS_PROFILE=stealinglight+website` for deployments.

**Package Managers**: Use Bun for frontend development (faster local builds). Use npm for infrastructure/CDK (better CDK compatibility). CI/CD uses npm for infrastructure deployments.

## Configuration Files

### vite.config.ts
- Aliases configured: `@` → `src/`
- React plugin enabled
- Path resolution for TypeScript

### tsconfig.json
- Strict type checking enabled
- ES2022 target
- Path aliases configured

### tailwind.config.js
- Custom theme extensions
- Component paths configured
- shadcn/ui integration

## Common Tasks

### Adding a New Page Section
1. Create component in `src/app/components/[SectionName].tsx`
2. Import in `App.tsx`
3. Add to component composition in App render
4. Update Navigation if needed

### Adding a UI Component
1. Use shadcn CLI: `bunx shadcn-ui@latest add [component-name]`
2. Component appears in `src/app/components/ui/`
3. Import and use in your components

### Styling a Component
1. Use Tailwind utility classes
2. Reference theme variables from `theme.css` if needed
3. Follow existing component patterns for consistency

### Managing Assets
- Images referenced from public directory
- Use `ImageWithFallback` component for robust loading
- Optimize images for web before adding

## Dependencies

### Runtime
- `react`, `react-dom`: ^18.3.1 - UI framework
- `@radix-ui/*`: Various versions - Accessible component primitives
- `lucide-react`: ^0.468.0 - Icons
- `react-hook-form`: ^7.54.2 - Form management
- `zod`: ^3.24.1 - Schema validation

### Development
- `vite`: ^6.0.5 - Build tool
- `typescript`: ~5.7.2 - Type system
- `@vitejs/plugin-react`: ^4.3.4 - React support for Vite
- `tailwindcss`: ^3.4.17 - CSS framework
- `eslint`: ^9.17.0 - Linting
- `prettier`: ^3.4.2 - Formatting

### shadcn/ui Components
The project includes 40+ shadcn/ui components in `src/app/components/ui/`:
- Form controls: button, input, textarea, select, checkbox, radio, switch
- Navigation: navigation-menu, menubar, breadcrumb, pagination, tabs
- Overlays: dialog, sheet, drawer, popover, hover-card, tooltip
- Feedback: alert, alert-dialog, toast (sonner)
- Layout: card, separator, scroll-area, resizable, sidebar
- Data display: table, avatar, badge, calendar, chart, progress
- And more: accordion, carousel, collapsible, command, context-menu, etc.

## Environment Setup

### Prerequisites
- Bun (latest version)

### Local Development
1. Clone repository
2. Run `bun install`
3. Run `bun dev`
4. Open http://localhost:5173

### Environment Variables
Currently no environment variables required for basic operation.

## Project Structure Notes

### Single Page Application
- This is a SPA with all sections rendered on one page
- Navigation uses smooth scrolling between sections (if implemented)
- No routing library needed for current structure

### Component Organization
- Main sections at `/components` level
- UI primitives in `/components/ui`
- Utility components in specialized folders (e.g., `/figma`)

### Styling Organization
- `index.css`: Main entry point, imports other styles
- `tailwind.css`: Tailwind directives
- `theme.css`: CSS custom properties for theming
- `fonts.css`: Font-face declarations

## Gotchas and Notes

### Vite Path Aliases
- `@` is aliased to `src/` directory
- Must update both `vite.config.ts` and `tsconfig.json` for new aliases

### shadcn/ui Components
- Components are copied into project (not imported from package)
- Customize components directly in `src/app/components/ui/`
- Regenerating a component will overwrite customizations

### TypeScript Configuration
- Strict mode enabled - all types must be defined
- React JSX transform configured
- Module resolution set to bundler mode

### Image Handling
- Use `ImageWithFallback` component for external/unreliable images
- Provides graceful degradation if images fail to load

### Tailwind CSS
- Custom theme extends default Tailwind theme
- Theme variables defined in `theme.css`
- Use theme values via Tailwind classes (e.g., `bg-primary`)

### Build Output
- Production builds to `dist/` directory
- Assets are optimized and hashed for caching
- Preview build before deploying

## Testing

### End-to-End Tests (Playwright)

The project uses Playwright for E2E testing:

```bash
bun test          # Run all tests
bun test:ui       # Run tests with UI
```

Tests are located in `tests/` and cover:
- Page loading and title verification
- Navigation visibility
- Responsive design
- Console error checking

### Test Configuration

- `playwright.config.ts`: Playwright configuration
- Uses preview server (`bun preview`) for testing
- Runs in Chromium by default

## Deployment

### Build for Production
```bash
bun build
```

### Preview Production Build
```bash
bun preview
```

### AWS Amplify (Production)

The production deployment uses AWS infrastructure managed with CDK:

```bash
cd infra
npm install
export CONTACT_EMAIL="your-email@example.com"
cdk deploy --all
```

Infrastructure includes:
- **Amplify Hosting**: Auto-deploys from GitHub
- **Contact Form API**: API Gateway + Lambda + SES

See [infra/DEPLOYMENT.md](./infra/DEPLOYMENT.md) for details.

### Alternative Platforms

The application can also be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Any static hosting service

## Related Files

- [README.md](./README.md) - Project overview and quick start
- [guidelines/Guidelines.md](./guidelines/Guidelines.md) - Project-specific guidelines
- [package.json](./package.json) - Dependencies and scripts
- [ATTRIBUTIONS.md](./ATTRIBUTIONS.md) - Third-party attributions

## AI Assistant Tips

### When Adding Features
1. Check existing components in `ui/` before creating new ones
2. Follow TypeScript patterns from existing components
3. Use Tailwind classes consistently with existing code
4. Test in dev mode before building

### When Debugging
1. Check browser console for React errors
2. Verify imports and path aliases
3. Check TypeScript errors in IDE
4. Ensure all dependencies are installed

### When Refactoring
1. Maintain existing component structure patterns
2. Update TypeScript types as needed
3. Test all sections after changes
4. Keep shadcn/ui components in sync

### Code Generation Best Practices
- Generate TypeScript, not JavaScript
- Include proper type definitions
- Follow existing naming conventions
- Use functional components with hooks
- Apply Tailwind classes for styling
