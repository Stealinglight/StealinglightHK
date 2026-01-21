# Bun Migration Plan

This document outlines the step-by-step plan to migrate the Stealinglight HK project from npm to Bun.

## Overview

**Current Stack:**
- Package Manager: npm
- Runtime: Node.js 18+
- Build Tool: Vite 6.3.5
- Framework: React 18 + TypeScript
- Styling: Tailwind CSS v4 (via @tailwindcss/vite)

**Target Stack:**
- Package Manager: Bun
- Runtime: Bun
- Build Tool: Vite 6.3.5 (unchanged)
- Framework: React 18 + TypeScript (unchanged)
- Styling: Tailwind CSS v4 (unchanged)

## Compatibility Assessment

| Component | Bun Compatible | Notes |
|-----------|----------------|-------|
| Vite 6.3.5 | Yes | Full support, faster startup |
| React 18 | Yes | No changes needed |
| Tailwind CSS v4 | Yes | @tailwindcss/vite works seamlessly |
| Radix UI | Yes | No changes needed |
| shadcn/ui components | Yes | No changes needed |
| framer-motion/motion | Yes | No changes needed |
| AWS CDK (infra) | Yes | Use `bunx` instead of `npx` |

---

## Phase 1: Local Development Environment

### Task 1.1: Remove npm Artifacts
**Files to delete:**
- `package-lock.json`
- `node_modules/` (directory)

**Commands:**
```bash
rm package-lock.json
rm -rf node_modules
```

### Task 1.2: Install Dependencies with Bun
**Command:**
```bash
bun install
```

**Expected outcome:**
- Creates `bun.lockb` (binary lockfile)
- Installs all dependencies significantly faster than npm

### Task 1.3: Update package.json Scripts
**File:** `package.json`

**Current scripts:**
```json
{
  "scripts": {
    "build": "vite build",
    "dev": "vite"
  }
}
```

**Updated scripts:**
```json
{
  "scripts": {
    "dev": "bunx --bun vite",
    "build": "bunx --bun vite build",
    "preview": "bunx --bun vite preview",
    "lint": "eslint ."
  }
}
```

**Notes:**
- `bunx --bun` forces Bun runtime even if the executable specifies Node
- Added `preview` and `lint` scripts for completeness

### Task 1.4: Add TypeScript Configuration (Recommended)
**File:** `tsconfig.json` (new file - currently missing)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "types": ["vite/client"],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**File:** `tsconfig.node.json` (new file)
```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

### Task 1.5: Install Bun Types (Optional)
**Command:**
```bash
bun add -d @types/bun
```

**Update tsconfig.json types array:**
```json
"types": ["bun-types", "vite/client"]
```

### Task 1.6: Verify Local Development
**Commands:**
```bash
bun dev      # Start development server
bun build    # Build for production
bun preview  # Preview production build
bun lint     # Run ESLint
```

---

## Phase 2: GitHub Actions CI/CD Migration

### Task 2.1: Update deploy-creative.yml
**File:** `.github/workflows/deploy-creative.yml`

**Changes:**
1. Replace `actions/setup-node@v4` with `oven-sh/setup-bun@v2`
2. Replace `npm ci` with `bun install --frozen-lockfile`
3. Replace `npm run build:creative` with `bun run build:creative`

**Updated workflow steps:**
```yaml
- name: Setup Bun
  uses: oven-sh/setup-bun@v2
  with:
    bun-version: latest

- name: Install dependencies
  run: bun install --frozen-lockfile

- name: Build Creative app
  run: bun run build:creative
```

### Task 2.2: Update deploy-hub.yml
**File:** `.github/workflows/deploy-hub.yml`

**Same changes as deploy-creative.yml:**
- Replace Node.js setup with Bun setup
- Replace npm commands with bun commands

### Task 2.3: Update deploy-security.yml
**File:** `.github/workflows/deploy-security.yml`

**Same changes as deploy-creative.yml:**
- Replace Node.js setup with Bun setup
- Replace npm commands with bun commands

### Task 2.4: Update deploy-infra.yml
**File:** `.github/workflows/deploy-infra.yml`

**Changes:**
1. Replace Node.js setup with Bun setup
2. Replace `npx cdk` with `bunx cdk`

**Updated workflow steps:**
```yaml
- name: Setup Bun
  uses: oven-sh/setup-bun@v2
  with:
    bun-version: latest

- name: Install dependencies
  run: bun install --frozen-lockfile

- name: CDK Diff
  working-directory: infra
  run: bunx cdk diff --context certificateArn=${{ secrets.CERTIFICATE_ARN }}

- name: CDK Deploy
  working-directory: infra
  run: |
    bunx cdk deploy --all \
      --require-approval never \
      --context certificateArn=${{ secrets.CERTIFICATE_ARN }}
  env:
    CONTACT_EMAIL: ${{ secrets.CONTACT_EMAIL }}
```

### Task 2.5: Update claude.yml (Optional)
**File:** `.github/workflows/claude.yml`

If this workflow runs any npm commands, update them to use bun. Otherwise, no changes needed.

### Task 2.6: Update claude-code-review.yml (Optional)
**File:** `.github/workflows/claude-code-review.yml`

If this workflow runs any npm commands, update them to use bun. Otherwise, no changes needed.

---

## Phase 3: Documentation Updates

### Task 3.1: Update README.md
**File:** `README.md`

**Sections to update:**

1. **Prerequisites section** - Add Bun installation:
```markdown
## Prerequisites

- [Bun](https://bun.sh) (latest version)
```

2. **Quick Start section** - Update commands:
```markdown
## Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/StealinglightHK/StealinglightHK.git
   cd StealinglightHK
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Start development server:
   ```bash
   bun dev
   ```

4. Open [http://localhost:5173](http://localhost:5173)
```

3. **Scripts section** - Update command references:
```markdown
## Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start development server |
| `bun build` | Build for production |
| `bun preview` | Preview production build |
| `bun lint` | Run ESLint |
```

### Task 3.2: Update AGENTS.md
**File:** `AGENTS.md`

Update any references to npm commands to use bun equivalents.

---

## Phase 4: Cleanup and Verification

### Task 4.1: Add bun.lockb to Version Control
**Commands:**
```bash
git add bun.lockb
git commit -m "chore: add bun lockfile"
```

### Task 4.2: Update .gitignore (if needed)
Ensure `node_modules/` is still ignored (it should be).

### Task 4.3: Final Verification Checklist
- [ ] `bun dev` starts development server successfully
- [ ] `bun build` completes without errors
- [ ] `bun preview` serves the production build
- [ ] `bun lint` runs ESLint successfully
- [ ] All dependencies install correctly
- [ ] Hot Module Replacement (HMR) works
- [ ] All existing functionality works as expected

---

## File Change Summary

### Files to Delete
| File | Reason |
|------|--------|
| `package-lock.json` | Replaced by `bun.lockb` |

### Files to Create
| File | Purpose |
|------|---------|
| `bun.lockb` | Bun binary lockfile (auto-generated) |
| `tsconfig.json` | TypeScript configuration (currently missing) |
| `tsconfig.node.json` | TypeScript config for Vite (currently missing) |

### Files to Modify
| File | Changes |
|------|---------|
| `package.json` | Update scripts to use `bunx --bun` |
| `.github/workflows/deploy-creative.yml` | Replace Node.js with Bun |
| `.github/workflows/deploy-hub.yml` | Replace Node.js with Bun |
| `.github/workflows/deploy-security.yml` | Replace Node.js with Bun |
| `.github/workflows/deploy-infra.yml` | Replace Node.js with Bun, use `bunx` |
| `README.md` | Update commands and prerequisites |
| `AGENTS.md` | Update command references |

---

## Rollback Plan

If issues arise, rollback is straightforward:

1. Delete `bun.lockb`
2. Restore `package-lock.json` from git history
3. Revert workflow files to use Node.js/npm
4. Run `npm ci` to reinstall dependencies

---

## Expected Benefits

1. **Faster dependency installation** - Bun's package manager is significantly faster than npm
2. **Faster script execution** - Bun runtime starts faster than Node.js
3. **Simpler toolchain** - Single tool for package management and runtime
4. **Better TypeScript support** - Native TypeScript execution without compilation step
5. **Improved developer experience** - Faster feedback loops during development

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Dependency incompatibility | Low | Medium | Test all features after migration |
| CI/CD failures | Low | High | Test workflows in PR before merge |
| Build output differences | Very Low | Low | Compare build outputs before/after |
| Team adoption friction | Low | Low | Update documentation thoroughly |

---

## Implementation Order

For the safest migration path, implement in this order:

1. **Phase 1** - Local development (can be tested independently)
2. **Phase 3** - Documentation (helps team understand changes)
3. **Phase 2** - CI/CD (deploy after local verification)
4. **Phase 4** - Final cleanup and verification

This order allows for incremental testing and easy rollback at each phase.
