# Stack Research

**Domain:** Cinematography portfolio website (video-heavy SPA)
**Researched:** 2026-03-27
**Confidence:** HIGH

## Context

This research targets the revamp of an existing React 19 + Vite 7 + Tailwind CSS 4 cinematography portfolio site. The core framework is decided and not changing. The focus here is on: what supporting libraries to keep, add, or remove; font loading strategy; video optimization patterns; animation best practices; accessibility tooling; and contact form bot protection.

The site currently has **massive dependency bloat** (20+ unused packages, 44 unused UI components) from its Figma Make template origin. The revamp should result in a lean, purpose-built stack.

---

## Recommended Stack

### Core Technologies (Keep, Update)

| Technology           | Current   | Target    | Purpose                   | Why Recommended                                                                                                                                                                                          |
| -------------------- | --------- | --------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| React                | 19.2.4    | 19.2.4    | UI framework              | Already current. React 19 has excellent performance with concurrent features. No action needed.                                                                                                          |
| Vite                 | 7.3.1     | 7.3.1     | Build tool and dev server | **Stay on Vite 7.** Vite 8.0.3 just released and is tagged `latest`, but it is a brand-new major version (days old). Let it stabilize for 2-3 months before upgrading. Vite 7 receives security patches. |
| Tailwind CSS         | 4.1.18    | 4.2.2     | Utility-first CSS         | Tailwind 4.2 is a minor bump, safe to upgrade. Uses the Vite plugin integration (no PostCSS) which is the correct approach for Vite projects.                                                            |
| TypeScript           | (project) | (project) | Type safety               | Already configured with strict mode. ES2022 target is correct for 2026 browsers.                                                                                                                         |
| @tailwindcss/vite    | 4.1.18    | 4.2.2     | Tailwind Vite integration | Upgrade alongside Tailwind CSS. Supports Vite 5-8 per peer deps.                                                                                                                                         |
| @vitejs/plugin-react | 5.1.2     | 5.2.0     | React Fast Refresh        | Minor bump, adds Vite 8 peer support (future-proofing). Stays on v5 line.                                                                                                                                |

**Confidence:** HIGH -- versions verified via npm registry 2026-03-27.

### Font Loading (Replace Google Fonts CDN)

| Technology                         | Version | Purpose                                 | Why Recommended                                                                                                                                                                                                                       |
| ---------------------------------- | ------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| @fontsource-variable/inter         | 5.2.8   | Self-hosted Inter variable font         | Eliminates render-blocking Google Fonts CDN call. Variable font means one file covers all weights (400-600). Bundled by Vite, served from same origin = no DNS lookup, no CORS, no CSP issues. Fixes the CSP-blocks-Google-Fonts bug. |
| @fontsource-variable/space-grotesk | 5.2.10  | Self-hosted Space Grotesk variable font | Same benefits. Variable font covers weights 500-700 in a single file.                                                                                                                                                                 |

**Why self-host over Google Fonts CDN:**

1. **Eliminates render-blocking request** -- the current `<link>` tag in `index.html` (line 130) blocks first paint
2. **Fixes CSP issue** -- the current CSP blocks `fonts.googleapis.com` and `fonts.gstatic.com`; self-hosting means `font-src 'self'` just works
3. **No third-party dependency** -- Google Fonts CDN adds DNS lookup + TLS handshake + download latency
4. **Variable fonts** -- smaller total payload than loading 6 separate static weight files
5. **Subsetting** -- Fontsource packages include only Latin subset by default, further reducing size
6. **Cache coherence** -- fonts are hashed by Vite and cached alongside your JS/CSS

**Implementation:**

```css
/* src/styles/fonts.css - replace the current file */
@import '@fontsource-variable/inter';
@import '@fontsource-variable/space-grotesk';

:root {
  --font-display: 'Space Grotesk Variable', system-ui, sans-serif;
  --font-body: 'Inter Variable', system-ui, sans-serif;
}
```

Then remove the `<link>` tags for Google Fonts from `index.html` (lines 128-130) and the `<link rel="preconnect">` tags.

**Confidence:** HIGH -- Fontsource versions verified via npm registry. Self-hosting fonts is the established best practice per web.dev (2025) for performance-critical sites.

### Animation (Keep, Update)

| Technology     | Current | Target  | Purpose                      | Why Recommended                                                                                                                                                                                                                                                                                                                                       |
| -------------- | ------- | ------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| motion         | 12.29.2 | 12.38.0 | Declarative React animations | Motion (the framer-motion successor) is the correct choice for this site. It powers scroll-triggered reveals (`whileInView`), hover states, page entrance animations, and modal transitions. The hybrid engine uses Web Animations API + ScrollTimeline for hardware-accelerated 60/120fps animation off the main thread. Patch update, safe to bump. |
| tw-animate-css | 1.4.0   | 1.4.0   | Tailwind animation presets   | Already current. Provides CSS animation classes for simple transitions (loading spinners, etc.).                                                                                                                                                                                                                                                      |

**Key Motion patterns for this project:**

- `whileInView` with `viewport={{ once: true }}` -- used correctly in current Portfolio and Contact sections
- `useReducedMotion` hook -- **currently missing, must add** for accessibility (see Accessibility section below)
- `useScroll` + `useTransform` -- for parallax effects in the hero section
- `AnimatePresence` -- **currently missing from video modal**, needed for exit animations
- Animate only `transform` and `opacity` -- avoids layout thrashing. Current code correctly does this.

**Confidence:** HIGH -- version verified via npm registry. Motion docs confirmed features and API.

### Icons (Keep, Update)

| Technology   | Current | Target  | Purpose      | Why Recommended                                                                                                                                              |
| ------------ | ------- | ------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| lucide-react | 0.563.0 | 0.563.0 | Icon library | Tree-shakeable SVG icons. Current version is fine. Only 4-5 icons are actually used (Play, X, ChevronDown, Phone, MapPin, Loader2). Very lightweight import. |

**Note:** lucide-react 1.x exists but is a major version bump. The 0.x line is still actively maintained. Evaluate the 1.x migration during a future maintenance pass, not during the visual revamp.

**Confidence:** HIGH.

### Toast Notifications (Keep)

| Technology | Current | Target | Purpose             | Why Recommended                                                                                                          |
| ---------- | ------- | ------ | ------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| sonner     | 2.0.7   | 2.0.7  | Toast notifications | Already current. Lightweight, accessible toast library. Used for contact form success/error feedback. No changes needed. |

**Confidence:** HIGH.

### CSS Utilities (Keep)

| Technology               | Current | Target | Purpose                            | Why Recommended                                                                                       |
| ------------------------ | ------- | ------ | ---------------------------------- | ----------------------------------------------------------------------------------------------------- |
| clsx                     | 2.1.1   | 2.1.1  | Conditional class joining          | Tiny (< 1KB), fast. Used for dynamic Tailwind class composition. Already current.                     |
| tailwind-merge           | 3.4.0   | 3.5.0  | Tailwind class conflict resolution | Merges conflicting Tailwind classes intelligently. Minor bump available, safe to update.              |
| class-variance-authority | 0.7.1   | 0.7.1  | Component variant definitions      | Useful if building reusable button/input variants during the visual revamp. Already current. Keep it. |

**Confidence:** HIGH.

### Bot Protection (Add)

| Technology                           | Version          | Purpose                            | Why Recommended                                                                                                                                                                                                                                                                                                                                                        |
| ------------------------------------ | ---------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cloudflare Turnstile (client widget) | N/A (CDN script) | Invisible CAPTCHA for contact form | Free, privacy-preserving, no user interaction required (invisible mode). Replaces the missing bot protection flagged in CONCERNS.md. Does NOT require Cloudflare CDN -- works with any infrastructure including AWS. Generates a token client-side that Lambda validates server-side via a simple POST to `https://challenges.cloudflare.com/turnstile/v0/siteverify`. |

**Why Turnstile over reCAPTCHA:**

- Free with no request limits for the managed/invisible widget
- Privacy-preserving (no tracking cookies)
- No "click all the traffic lights" UX friction
- Works as invisible challenge -- users never see it
- Simple server-side validation (single HTTP POST from Lambda)
- Does not require Cloudflare as CDN/proxy

**Implementation approach:**

1. Load Turnstile script via `<script>` tag or dynamic import
2. Add invisible Turnstile widget to contact form
3. Include Turnstile token in the contact form POST body
4. Lambda validates token with Cloudflare siteverify API before sending email
5. Update CSP to allow `https://challenges.cloudflare.com`

**Confidence:** MEDIUM -- Turnstile is well-established and free. Server-side validation from Lambda is straightforward. MEDIUM because we have not tested the specific Lambda integration yet.

### Contact Form Validation (Add)

| Technology | Version | Purpose           | Why Recommended                                                      |
| ---------- | ------- | ----------------- | -------------------------------------------------------------------- | --- | --------------- | --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| zod        | 4.3.6   | Schema validation | The current contact form uses manual validation (`if (!formData.name |     | !formData.email |     | ...)`). Zod provides typed schema validation that works both in the React form and can be shared with the Lambda for server-side validation. Tiny runtime. |

**Why Zod over react-hook-form:**

- react-hook-form (currently listed as dependency but unused) is overkill for a single 4-field contact form
- Zod schemas are reusable between client and server
- The current vanilla `useState` + `onChange` pattern is perfectly adequate for this form size
- Zod adds validation rules (email format, min length, max length) without the form library overhead

**Confidence:** HIGH -- Zod is the standard validation library in the React ecosystem.

### Accessibility Tooling (Add for Development)

| Technology           | Version | Purpose                       | Why Recommended                                                                                                                             |
| -------------------- | ------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| @axe-core/playwright | 4.11.1  | Automated a11y testing in E2E | Integrates with existing Playwright test suite. Runs axe-core accessibility checks during E2E tests. Catches WCAG violations automatically. |

**Confidence:** HIGH -- axe-core is the industry standard for automated accessibility testing.

### Image Optimization (Add for Build)

| Technology                  | Version | Purpose                       | Why Recommended                                                                                                                                                            |
| --------------------------- | ------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| vite-plugin-image-optimizer | 2.0.3   | Build-time image optimization | Optimizes static images (og-image.jpg, favicon, any poster images bundled locally) during Vite build using Sharp and SVGO. Reduces file sizes without manual optimization. |

**Note:** Video poster images served from CloudFront are outside Vite's build pipeline. Those should be optimized at upload time (see Video Optimization section below).

**Confidence:** HIGH.

---

## Video Optimization Strategy

This is the most impactful performance area. The site has 19 video elements + 1 hero background video.

### Current Problems

1. **19 `<video>` elements rendered simultaneously** -- even with `preload="none"`, all DOM elements exist
2. **Hover-to-play on grid items** triggers downloads of full video files (some up to 7:45 long)
3. **Hero video auto-plays immediately** consuming bandwidth before user interaction
4. **No WebM format** -- only MP4 served
5. **No responsive video** -- same file served to mobile and desktop
6. **Some files are `.mov`** (Gin Mare, NIU) -- not web-optimized

### Recommended Approach (No New Libraries Required)

**1. Lazy-render off-screen video elements with Intersection Observer:**

```tsx
// Use native IntersectionObserver or Motion's whileInView
// Only mount <video> elements when they scroll near viewport
// Before intersection: show <img> poster with play button overlay
// After intersection: swap to <video> element
```

This is a code pattern, not a library addition. Motion's `whileInView` already provides the intersection detection.

**2. Short preview clips for hover-to-play:**
Generate 10-15 second, low-resolution preview clips for grid hover. Keep full-length originals for modal playback only. These previews should be:

- 720p max resolution
- 1-2 Mbps bitrate
- WebM (VP9) with MP4 fallback
- Uploaded to the same CloudFront/S3 bucket

**3. Hero video optimization:**

- Serve a compressed, lower-bitrate hero loop (15-30 seconds max)
- Use `poster` image with `fetchpriority="high"` (current code already has poster support)
- Respect `prefers-reduced-motion` -- show static poster instead of video
- Consider using `<source>` with `media` attribute for mobile: serve a still image or very short clip

**4. Provide WebM alternatives:**

```html
<video>
  <source src="video.webm" type="video/webm" />
  <source src="video.mp4" type="video/mp4" />
</video>
```

WebM (VP9) is ~30% smaller than H.264 MP4 at equivalent quality. All modern browsers support it.

**5. Video format for new uploads:**

- **WebM (VP9)** primary -- best compression
- **MP4 (H.264)** fallback -- universal compatibility
- Consider **AV1** for future-proofing (supported in Chrome, Firefox, Safari 17+)

**Confidence:** HIGH -- these are established web performance patterns documented by web.dev. The specific implementation is code-level, not library-level.

---

## What NOT to Use

### Dependencies to Remove (Currently Installed, Unused)

| Package                            | Why Remove                                                                                                                                                                  | Confidence |
| ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- |
| @emotion/react, @emotion/styled    | MUI CSS-in-JS runtime. Never imported in app. Adds ~12KB to potential bundle.                                                                                               | HIGH       |
| @mui/material, @mui/icons-material | Material UI. Never imported. Massive dependency tree.                                                                                                                       | HIGH       |
| next-themes                        | Next.js-specific theming. Only imported in unused ui/sonner.tsx. Will crash if ever used in Vite.                                                                           | HIGH       |
| react-dnd, react-dnd-html5-backend | Drag and drop. Never imported. Not needed for a portfolio site.                                                                                                             | HIGH       |
| react-slick                        | Carousel. Never imported.                                                                                                                                                   | HIGH       |
| recharts                           | Charting library. Only in unused ui/chart.tsx. A portfolio site does not need charts.                                                                                       | HIGH       |
| react-hook-form                    | Only in unused ui/form.tsx. Manual form handling is sufficient for one contact form.                                                                                        | HIGH       |
| react-responsive-masonry           | Never imported. If masonry is wanted, CSS Grid + `masonry-auto-flow` or a simpler approach is better.                                                                       | HIGH       |
| date-fns, react-day-picker         | Date utilities. Only in unused ui/calendar.tsx. Not needed.                                                                                                                 | HIGH       |
| input-otp                          | OTP input. Only in unused ui/input-otp.tsx. Not needed.                                                                                                                     | HIGH       |
| react-resizable-panels             | Only in unused ui/resizable.tsx. Not needed.                                                                                                                                | HIGH       |
| cmdk                               | Command palette. Only in unused ui/command.tsx. Not needed.                                                                                                                 | HIGH       |
| embla-carousel-react               | Carousel. Only in unused ui/carousel.tsx. Not needed.                                                                                                                       | HIGH       |
| vaul                               | Drawer. Only in unused ui/drawer.tsx. Not needed.                                                                                                                           | HIGH       |
| All 26 @radix-ui/\* packages       | Only consumed by unused ui/ components. **Exception:** keep @radix-ui/react-dialog if used for the video modal revamp, and @radix-ui/react-slot if used in button variants. | HIGH       |

**Total packages to remove: ~40+**

This cleanup is the single highest-impact performance and DX improvement. It reduces install time, lockfile size, `node_modules` bloat, and potential vulnerability surface area.

### Technologies to Avoid Adding

| Avoid                        | Why                                                                                                                                                                                                         | Use Instead                                                |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| GSAP                         | Requires license for commercial use. Motion already handles everything this site needs. Mixing two animation libraries is an anti-pattern.                                                                  | Motion (already installed)                                 |
| Three.js / React Three Fiber | Massive bundle. Not needed for a video portfolio. WebGL is overkill for this use case.                                                                                                                      | CSS transforms + Motion for visual effects                 |
| Video.js / Shaka Player      | Heavy video player libraries. The site uses native `<video>` elements which are perfectly adequate for self-hosted MP4/WebM playback. These are for adaptive streaming (HLS/DASH) which is not needed here. | Native `<video>` with `<source>` elements                  |
| react-player                 | Wraps YouTube/Vimeo/etc embeds. This site self-hosts videos on CloudFront. Native `<video>` is simpler and lighter.                                                                                         | Native `<video>` element                                   |
| Lenis / Locomotive Scroll    | Smooth scroll libraries. They hijack native scrolling and break accessibility (keyboard navigation, screen readers). The `scroll-behavior: smooth` CSS property + Motion scroll animations are sufficient.  | CSS `scroll-behavior: smooth` + Motion                     |
| reCAPTCHA v2/v3              | Google tracking, user-hostile UX, accessibility issues with the checkbox/image challenge.                                                                                                                   | Cloudflare Turnstile (invisible, free, privacy-preserving) |
| Tailwind UI / Headless UI    | Paid component library. The site needs 5-6 custom components, not a component system.                                                                                                                       | Custom components with Tailwind CSS                        |
| PostCSS                      | Tailwind v4 uses the Vite plugin, not PostCSS. The empty `postcss.config.mjs` is a template artifact.                                                                                                       | @tailwindcss/vite (already installed)                      |
| CSS Modules                  | Conflicts with Tailwind's utility approach. Adds configuration complexity for no benefit.                                                                                                                   | Tailwind CSS utilities                                     |
| Styled Components            | CSS-in-JS adds runtime overhead. Tailwind is already the styling solution.                                                                                                                                  | Tailwind CSS                                               |

---

## Installation

```bash
# Add new dependencies
npm install @fontsource-variable/inter@5.2.8 @fontsource-variable/space-grotesk@5.2.10 zod@4.3.6

# Add dev dependencies
npm install -D vite-plugin-image-optimizer@2.0.3 @axe-core/playwright@4.11.1

# Update existing dependencies
npm install motion@12.38.0 tailwind-merge@3.5.0
npm install -D tailwindcss@4.2.2 @tailwindcss/vite@4.2.2 @vitejs/plugin-react@5.2.0

# Remove unused dependencies (run AFTER removing unused ui/ components)
npm uninstall @emotion/react @emotion/styled @mui/icons-material @mui/material \
  next-themes react-dnd react-dnd-html5-backend react-slick recharts \
  react-hook-form react-responsive-masonry date-fns react-day-picker \
  input-otp react-resizable-panels cmdk embla-carousel-react vaul \
  @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-aspect-ratio \
  @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-collapsible \
  @radix-ui/react-context-menu @radix-ui/react-dropdown-menu @radix-ui/react-hover-card \
  @radix-ui/react-label @radix-ui/react-menubar @radix-ui/react-navigation-menu \
  @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-radio-group \
  @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-separator \
  @radix-ui/react-slider @radix-ui/react-switch @radix-ui/react-tabs \
  @radix-ui/react-toggle @radix-ui/react-toggle-group @radix-ui/react-tooltip
```

**Note on Radix removal:** If the visual revamp uses `@radix-ui/react-dialog` for the video modal or `@radix-ui/react-slot` for polymorphic components, keep those specific packages. Remove the rest.

---

## Alternatives Considered

| Category           | Recommended                            | Alternative                          | When to Use Alternative                                                                                                                                                                    |
| ------------------ | -------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Font hosting       | Fontsource (self-hosted)               | Google Fonts CDN                     | Only if you do not care about CSP, render-blocking, or third-party dependency. Not recommended for this project.                                                                           |
| Font hosting       | Fontsource (self-hosted)               | vite-plugin-webfont-dl (3.12.0)      | Downloads Google Fonts at build time and injects them. A valid alternative but Fontsource gives more control (variable fonts, subsetting).                                                 |
| Animation          | Motion                                 | CSS-only animations                  | For simple hover/focus transitions that do not need scroll-triggered or gesture-based behavior. Use CSS for `:hover` color changes; use Motion for entrance animations and scroll effects. |
| Animation          | Motion                                 | GSAP                                 | Only if you need timeline-based, frame-perfect cinematic sequences (e.g., a full intro animation). Not needed here -- Motion handles all current patterns.                                 |
| Form validation    | Zod (standalone)                       | react-hook-form + zod                | If the contact form grows beyond 4 fields or needs complex multi-step validation. Overkill for current scope.                                                                              |
| Bot protection     | Cloudflare Turnstile                   | Honeypot field                       | Simpler to implement (hidden form field that bots fill in). Catches naive bots but not sophisticated ones. Could be a quick first step before adding Turnstile.                            |
| Bot protection     | Cloudflare Turnstile                   | hCaptcha                             | Another privacy-focused CAPTCHA. Requires user interaction (image challenges). Turnstile's invisible mode is better UX.                                                                    |
| Image optimization | vite-plugin-image-optimizer            | Manual Sharp/SVGO pipeline           | More control but more effort. The plugin automates what you would do manually.                                                                                                             |
| Lazy loading video | Native IntersectionObserver via Motion | react-intersection-observer (10.0.3) | A dedicated React hook library. Not needed because Motion's `whileInView` already uses IntersectionObserver internally. Adding another library for the same browser API is redundant.      |

---

## Stack Patterns by Variant

**If the visual revamp adds a video lightbox with custom controls:**

- Use `@radix-ui/react-dialog` for the accessible modal foundation (focus trap, ESC to close, aria attributes)
- Keep native `<video controls>` or build lightweight custom controls with `<video>` API
- Wrap in `AnimatePresence` from Motion for enter/exit animations
- Current modal implementation lacks `AnimatePresence`, focus trap, and keyboard handling

**If parallax scrolling is desired for the hero:**

- Use Motion's `useScroll()` + `useTransform()` for scroll-linked parallax
- Apply to hero background video/image layer
- Keep it subtle -- heavy parallax causes motion sickness and is a WCAG concern
- Gate behind `useReducedMotion()` check

**If the site adds a "reel player" section:**

- Use native `<video>` with custom controls styled to match the cinematic theme
- Do NOT add a heavy player library (Video.js, Plyr, etc.)
- The current `<video controls>` with autoPlay on modal open is the right approach

---

## Version Compatibility Matrix

| Package                    | Compatible With                                      | Notes                                                                |
| -------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------- |
| Vite 7.3.1                 | @vitejs/plugin-react 5.x, @tailwindcss/vite 4.x      | Current working combination                                          |
| Vite 8.0.3                 | @vitejs/plugin-react 5.2.0+, @tailwindcss/vite 4.2.x | Future upgrade path. Both plugins support Vite 8 in their peer deps. |
| Tailwind CSS 4.2.2         | @tailwindcss/vite 4.2.2                              | Must be upgraded together (same version line)                        |
| Motion 12.38.0             | React 18+ (including React 19)                       | Import from `motion/react` (not `framer-motion`)                     |
| Fontsource 5.x             | Any bundler (Vite, webpack)                          | CSS import, processed by Vite                                        |
| @vitejs/plugin-react 6.0.1 | Vite 8 ONLY                                          | Do NOT upgrade to v6 while on Vite 7. Stay on 5.2.0.                 |

---

## ESLint Migration Note

The project runs ESLint 9 with `ESLINT_USE_FLAT_CONFIG=false` (legacy mode). ESLint 10.1.0 has shipped and will eventually drop legacy config support. The flat config migration should happen during the cleanup phase, not during the visual revamp:

1. Migrate `.eslintrc.json` to `eslint.config.js` (flat config format)
2. Remove `ESLINT_USE_FLAT_CONFIG=false` from package.json scripts
3. Update `@typescript-eslint/*` packages for flat config compatibility
4. Remove the `*.js` ignore pattern that excludes the Lambda from linting

This is a separate concern from the stack revamp but is tracked here because it affects the dev toolchain.

---

## Post-Cleanup Dependency Footprint

After the recommended changes, the production dependency list becomes:

| Package                            | Purpose                          |
| ---------------------------------- | -------------------------------- |
| motion                             | Animations                       |
| lucide-react                       | Icons                            |
| sonner                             | Toast notifications              |
| clsx                               | Class joining                    |
| tailwind-merge                     | Class conflict resolution        |
| class-variance-authority           | Component variants               |
| tw-animate-css                     | CSS animation presets            |
| @fontsource-variable/inter         | Self-hosted body font            |
| @fontsource-variable/space-grotesk | Self-hosted display font         |
| zod                                | Form validation                  |
| @radix-ui/react-dialog             | Video modal (if used)            |
| @radix-ui/react-slot               | Polymorphic components (if used) |

**That is 10-12 production dependencies, down from 60+.** A reduction of approximately 80%.

---

## Sources

- npm registry (2026-03-27) -- all version numbers verified via `npm view`
- web.dev: "Optimize WebFont Loading" -- font loading best practices (HIGH confidence)
- web.dev: "Optimize Largest Contentful Paint" (updated 2025-03-31) -- LCP optimization (HIGH confidence)
- web.dev: "Video and source tags" -- HTML5 video optimization (HIGH confidence)
- web.dev: "Lazy Loading Video" -- IntersectionObserver patterns for video (HIGH confidence)
- web.dev: "Fast Playback with Preload" -- video preloading strategies (HIGH confidence)
- web.dev: "prefers-reduced-motion" -- accessibility motion preferences (HIGH confidence)
- W3C WAI: "Making Audio and Video Media Accessible" -- WCAG media requirements (HIGH confidence)
- motion.dev docs: React Quick Start, Scroll Animations, Performance, useReducedMotion (HIGH confidence)
- Cloudflare Turnstile: Get Started documentation (MEDIUM confidence -- not yet tested with Lambda)
- Fontsource: Inter and Space Grotesk package pages (HIGH confidence)

---

_Stack research for: stealinglight.hk cinematography portfolio revamp_
_Researched: 2026-03-27_
