# Stealinglight HK

A modern, responsive portfolio website built with React, TypeScript, and Vite, showcasing professional work and services.

## Features

- Modern, responsive design with Tailwind CSS
- Lightning-fast development with Vite + Bun
- Type-safe with TypeScript
- 40+ high-quality UI components from shadcn/ui
- Accessible components built on Radix UI
- Mobile-first responsive design
- Single Page Application architecture
- Robust image handling with fallbacks

## Tech Stack

- **Runtime**: Bun
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod

## Quick Start

### Prerequisites

- [Bun](https://bun.sh) (latest version)

**Install Bun:**
```bash
# macOS/Linux
curl -fsSL https://bun.sh/install | bash

# Windows (PowerShell)
powershell -c "irm bun.sh/install.ps1 | iex"
```

### Installation

```bash
# Clone the repository
git clone https://github.com/Stealinglight/StealinglightHK.git
cd StealinglightHK

# Install dependencies
bun install
```

### Development

```bash
# Start development server
bun dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production

```bash
# Create production build
bun build

# Preview production build locally
bun preview
```

## Project Structure

```
stealinglightHK/
├── src/
│   ├── main.tsx                  # Application entry point
│   ├── app/
│   │   ├── App.tsx              # Main app component
│   │   └── components/
│   │       ├── About.tsx        # About section
│   │       ├── Clients.tsx      # Client showcase
│   │       ├── Contact.tsx      # Contact section
│   │       ├── Footer.tsx       # Site footer
│   │       ├── Hero.tsx         # Hero/landing section
│   │       ├── Navigation.tsx   # Navigation bar
│   │       ├── Portfolio.tsx    # Portfolio showcase
│   │       ├── Services.tsx     # Services section
│   │       ├── figma/          # Figma utilities
│   │       └── ui/             # shadcn/ui components
│   └── styles/
│       ├── fonts.css           # Custom fonts
│       ├── index.css           # Main styles
│       ├── tailwind.css        # Tailwind directives
│       └── theme.css           # Theme variables
├── guidelines/                  # Project guidelines
├── index.html                  # HTML entry point
├── vite.config.ts             # Vite configuration
├── tsconfig.json              # TypeScript configuration
├── bun.lockb                  # Bun lockfile
└── package.json               # Dependencies
```

## Available Scripts

| Command       | Description              |
| ------------- | ------------------------ |
| `bun dev`     | Start development server |
| `bun build`   | Build for production     |
| `bun preview` | Preview production build |
| `bun lint`    | Run ESLint               |
| `bun test`    | Run Playwright tests     |

## Component Library

The project includes 40+ production-ready components from shadcn/ui:

### Form Components
- Button, Input, Textarea, Select, Checkbox, Radio Group
- Form, Label, Switch, Slider, Input OTP

### Navigation
- Navigation Menu, Menubar, Breadcrumb, Pagination, Tabs

### Overlay Components
- Dialog, Sheet, Drawer, Popover, Hover Card, Tooltip
- Alert Dialog, Command, Context Menu, Dropdown Menu

### Data Display
- Card, Table, Avatar, Badge, Calendar
- Chart, Progress, Separator, Scroll Area

### Feedback
- Alert, Toast (Sonner integration)

### Layout
- Accordion, Carousel, Collapsible, Resizable, Sidebar, Aspect Ratio

## Development

### Adding UI Components

Use the shadcn CLI to add more components:

```bash
bunx shadcn-ui@latest add [component-name]
```

Components are installed in `src/app/components/ui/` and can be customized directly.

### Code Style

- TypeScript strict mode enabled
- ESLint for code quality
- Prettier for formatting (configured)
- Functional components with hooks
- Tailwind utility classes for styling

### Path Aliases

The project uses the `@` alias for imports:

```typescript
import { Button } from '@/app/components/ui/button';
```

## Configuration

### Vite Configuration

Path aliases and React plugin configured in `vite.config.ts`.

### TypeScript Configuration

Strict type checking enabled with modern ES2022 target.

### Tailwind Configuration

Custom theme extensions for consistent design system.

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES2020+ features required
- CSS Grid and Flexbox support required

## Deployment

### AWS Amplify (Production)

The application is deployed to AWS Amplify with a contact form backend on API Gateway + Lambda.

See [infra/DEPLOYMENT.md](./infra/DEPLOYMENT.md) for full deployment instructions.

**Quick deploy:**
```bash
cd infra
npm install
export CONTACT_EMAIL="your-email@example.com"
cdk deploy --all
```

Then connect your GitHub repository via the Amplify Console (link provided in deployment output).

## CI/CD

GitHub Actions workflows run automatically on pull requests and pushes to `main`:

### E2E Tests (`test.yml`)
- Runs Playwright E2E tests against a production build
- Uploads test reports as artifacts (7-day retention)
- Triggered on PRs, pushes to main, and manual dispatch

### Security Scanning (`security.yml`)
- **Dependency Audit**: Runs `npm audit` on root and infra packages
- **CodeQL Analysis**: Static analysis for JavaScript/TypeScript security issues
- Runs on PRs, pushes to main, weekly schedule, and manual dispatch

### Troubleshooting CI/CD

**E2E Test Failures:**
- Check the Actions tab for the workflow run
- Download test report artifacts to see detailed failure information
- Test reports are retained for 7 days
- Workflows can be manually triggered via the Actions tab using "Run workflow"

**Security Scan Failures:**
- Review the Security tab for CodeQL findings
- Check uploaded audit-results artifacts for dependency vulnerability details
- High-severity vulnerabilities will cause the workflow to fail
- Address vulnerabilities by updating dependencies or reviewing false positives

**Manual Workflow Dispatch:**
- Navigate to Actions tab → Select workflow → Click "Run workflow"
- Useful for testing changes or running scans on-demand

## Documentation

- [AGENTS.md](./AGENTS.md) - Detailed context for AI assistants
- [Guidelines](./guidelines/Guidelines.md) - Project guidelines

## Development Workflow

1. Create a new branch for features: `git checkout -b feature/your-feature`
2. Make changes and test locally with `bun dev`
3. Run linting: `bun lint`
4. Build and preview: `bun build && bun preview`
5. Commit changes and create a pull request

## License

All rights reserved.

## Contact

For inquiries, please visit the contact section on the website.

---

**Built with React + TypeScript + Vite, powered by Bun**
