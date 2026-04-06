# Feature Research

**Domain:** Cinematography / filmmaker portfolio website
**Researched:** 2026-03-27
**Confidence:** HIGH

## Context

This research covers what premium cinematography and filmmaker portfolio websites look like in 2026. The stealinglight.hk site already exists with: hero video, portfolio grid with hover-to-play, video modal, about section, services, clients (logo bar), contact form (broken), and footer. The question is what is table stakes versus differentiating for a cinematic portfolio experience, and what should be deliberately avoided.

Research sources: Awwwards award-winning portfolio patterns, Autumn Durald Arkapaw (ASC cinematographer) portfolio analysis, Roger Deakins' site analysis, Awwwards video showcase patterns, and domain expertise from analyzing the cinematographer portfolio ecosystem.

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = site feels unfinished or amateur.

| Feature                                    | Why Expected                                                                                                                                                                    | Complexity | Notes                                                                                                                                                                 |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Working contact form**                   | Primary conversion mechanism. Visitors who want to hire need to reach out. A broken form = lost opportunity.                                                                    | LOW        | Currently broken. Lambda TypeScript/JavaScript divergence. Must be fixed first -- it is the only interactive element that matters.                                    |
| **Responsive mobile experience**           | Over 50% of portfolio traffic is mobile. Producers, directors, and clients browse on phones.                                                                                    | MEDIUM     | Existing site has responsive classes but needs audit. Video hover-to-play does not work on touch devices -- needs tap-to-play fallback.                               |
| **Fast page load with video optimization** | Video-heavy sites that stutter or blank-screen on load feel broken. First impression is everything for a cinematographer.                                                       | MEDIUM     | Need lazy loading for grid videos (currently `preload="none"` which is good), poster images for perceived instant load, progressive enhancement for slow connections. |
| **Full-screen video playback**             | The work IS the product. Viewers need to see it large, clean, without distractions. Native browser controls are acceptable but custom controls feel more intentional.           | LOW        | Existing modal works but uses default browser `controls`. Acceptable for launch but custom controls are a differentiator.                                             |
| **Clear visual hierarchy: work first**     | Portfolio visitors are here to see the reel. Work must dominate. Everything else is supporting context.                                                                         | LOW        | Current order (Hero > Portfolio > Clients > About > Services > Contact) is correct. Work is prominently placed.                                                       |
| **Professional typography and spacing**    | Sloppy typography instantly signals "amateur." Clean type hierarchy with generous whitespace signals production quality.                                                        | LOW        | Existing site uses tracking-based type treatments. Needs audit for consistency, font loading optimization (currently render-blocking Google Fonts).                   |
| **Dark color scheme**                      | Cinematography portfolios are almost universally dark. Dark backgrounds make video thumbnails pop and create a theater-like viewing context.                                    | LOW        | Already implemented with `cinematic-black` palette. This is correct.                                                                                                  |
| **Social/professional links**              | Visitors expect to find Vimeo, Instagram, IMDb, or similar. Validates the person is real and active in the industry.                                                            | LOW        | Footer has Vimeo, Instagram, Facebook. Consider adding IMDb if applicable.                                                                                            |
| **Favicon and Open Graph images**          | Shared links without preview images look unprofessional. Missing favicons signal an unfinished site.                                                                            | LOW        | Currently missing. `og-image.jpg` and `favicon.svg` are noted as missing in PROJECT.md.                                                                               |
| **HTTPS and basic security**               | Browsers warn on non-HTTPS. Any professional site must be secure.                                                                                                               | LOW        | Already handled via Amplify/CloudFront. CSP needs fixes (blocking Google Analytics and Fonts).                                                                        |
| **Accessible navigation**                  | Keyboard navigation, proper heading hierarchy, alt text on images, focus indicators. Not glamorous but expected by standards-aware clients and required by law in some markets. | MEDIUM     | Existing navigation has `aria-label` on some elements. Needs comprehensive audit -- skip links, focus management in modal, video captions.                            |
| **Loading states and error handling**      | Videos that fail silently or forms that hang with no feedback feel broken.                                                                                                      | LOW        | Contact form has loading spinner. Video playback has no loading indicator or error state. Poster images serve as placeholder.                                         |

### Differentiators (Competitive Advantage)

Features that make the site feel premium and cinematic rather than just "a portfolio on a template." These create the "wow" factor.

| Feature                                                      | Value Proposition                                                                                                                                                                                                                                      | Complexity | Notes                                                                                                                                                                                                               |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Cinematic scroll transitions**                             | Scroll-triggered reveals, parallax depth, and staggered animations create a "directed" feeling -- like the site itself was cinematographed. Award-winning portfolios all use this.                                                                     | MEDIUM     | Motion (framer-motion) is already installed and used for basic `whileInView` fades. Opportunity to add parallax on hero, staggered grid reveals, and section transitions that feel intentional rather than generic. |
| **Custom video player chrome**                               | Default browser controls scream "template." A minimal, branded video player with custom progress bar, play/pause, volume, and fullscreen controls in the site's amber accent color signals attention to craft.                                         | HIGH       | Current modal uses native `controls`. Custom player requires building progress bar, time display, volume slider, keyboard shortcuts, and fullscreen toggle. Worth it for the polish factor.                         |
| **Video category filtering**                                 | The site has 19 videos across categories (Commercial, Documentary, Short Film, Fashion, Event, Personal Reel). Filtering lets visitors find relevant work fast -- a director hiring for a fashion shoot cares about fashion work, not event coverage.  | MEDIUM     | Current grid shows all videos. Filtering by category with animated transitions would be a strong usability and visual improvement. Categories already exist in video config data.                                   |
| **Cinematic hero with text animations**                      | The hero is the storefront. Staggered text reveals, cinematic letter-spacing animations, and a smooth video-to-content transition create the "movie title sequence" feeling that sets tone.                                                            | LOW        | Existing hero has basic Motion animations. Can be elevated with more refined easing, text-reveal effects (clip-path or mask), and a more dramatic entrance sequence. Low complexity because the structure exists.   |
| **Smooth page transitions between sections**                 | Instead of abrupt scroll-to-section jumps, sections that flow cinematically -- with opacity crossfades, subtle parallax depth between layers, and content that choreographs in as you scroll.                                                          | MEDIUM     | Existing animations are basic fade-up-on-scroll. Elevating to coordinated scroll-driven choreography (using Motion's scroll progress) would make the single-page feel like a directed experience.                   |
| **Video thumbnail hover previews with graceful degradation** | Hover-to-play previews are already implemented. The differentiator is making them graceful: smooth fade-in of video over poster, category label animation on hover, subtle zoom, and proper touch-device handling (tap to preview, tap again to open). | LOW        | Existing hover-to-play works on desktop. Needs touch fallback and smoother fade transitions rather than abrupt play/pause.                                                                                          |
| **Animated client logo bar**                                 | Static logo grids are everywhere. An infinite-scroll marquee of client logos (like a film credits roll) with subtle hover-pause and opacity changes creates movement and premium feel.                                                                 | LOW        | Currently a static flexbox grid. CSS-only infinite scroll marquee is straightforward and visually impactful.                                                                                                        |
| **Keyboard navigation for video modal**                      | Escape to close, arrow keys to navigate between videos, spacebar to play/pause. Power users (producers reviewing multiple pieces) expect this.                                                                                                         | LOW        | Current modal only closes on click. Adding keyboard shortcuts is low effort, high polish.                                                                                                                           |
| **Preloader / loading screen**                               | A brief, branded loading screen while the hero video buffers. Prevents the jarring blank-screen-to-content jump. Think film studio logo before the movie starts.                                                                                       | LOW        | Not currently implemented. A simple branded preloader with the site name and a subtle animation while the hero video loads would smooth the initial experience.                                                     |
| **Scroll progress indicator**                                | A thin, subtle progress bar (in accent color) along the top or side of the viewport showing how far down the page the viewer has scrolled. Signals content density and provides orientation in a single-page site.                                     | LOW        | Not implemented. Can be a single CSS custom property driven by scroll position, or a simple Motion-based component.                                                                                                 |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem appealing but create problems for this specific project context.

| Feature                                         | Why Requested                                               | Why Problematic                                                                                                                                                                                                                                                                                                           | Alternative                                                                                                                                                                                                                                                |
| ----------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Multi-page routing / separate project pages** | "Each video should have its own page with full details."    | Adds routing complexity (React Router), breaks the single-page scroll architecture, increases maintenance burden, and for a 19-video portfolio where the owner is not actively pursuing business, individual pages are over-engineering. SEO benefit is minimal for a portfolio with no blog or written content strategy. | Keep the modal-based video viewer. The single-page architecture is the right call for this use case. Individual project pages make sense when there are case studies, behind-the-scenes content, or production credits -- none of which are in scope here. |
| **Background music / ambient audio**            | "Would make it feel more cinematic."                        | Auto-playing audio is universally hated. Browsers block it. It interferes with video playback. It makes the site inaccessible. No professional cinematographer site uses ambient background music.                                                                                                                        | Let the videos speak. The hero video is muted by design. If audio atmosphere is desired, consider a subtle sound-on-hover for video previews (still risky -- only if implemented as opt-in).                                                               |
| **Parallax scrolljacking**                      | "Override scroll behavior to create cinematic pacing."      | Hijacking scroll breaks accessibility, disorients users, causes motion sickness, and performs poorly on mobile. Every UX study shows users hate scroll hijacking.                                                                                                                                                         | Use subtle parallax depth WITHIN the normal scroll flow (background moves at 0.8x speed, content at 1x). Enhance scroll, don't replace it.                                                                                                                 |
| **Blog or news section**                        | "Keep the site fresh with regular updates."                 | The owner is not actively pursuing business and explicitly excluded multi-page routing. A blog requires ongoing content creation and maintenance. An empty or stale blog is worse than no blog -- it signals abandonment.                                                                                                 | The portfolio itself is the content. If freshness is desired, rotate the featured video or update the hero seasonally. The `videos.ts` config makes this trivial.                                                                                          |
| **CMS / admin panel**                           | "Make it easy to update content without code."              | Over-engineering for a 19-video portfolio managed by a developer. CMS adds infrastructure complexity (database, auth, admin UI), security surface area, and ongoing maintenance. Explicitly marked out of scope in PROJECT.md.                                                                                            | Video config is code-managed in `videos.ts`. Adding a new video is one object in an array. This is the right level of abstraction for this use case.                                                                                                       |
| **Animated cursor / custom cursor**             | "Would make navigation feel unique and premium."            | Custom cursors break accessibility, confuse users, perform poorly on touch devices, and make the site feel gimmicky rather than professional. They also interfere with native browser behaviors (text selection, right-click).                                                                                            | Focus on hover states and micro-interactions on the actual interactive elements (buttons, video cards, nav links). The existing amber accent hover states are the right approach.                                                                          |
| **Video autoplay in grid**                      | "All videos should play simultaneously as you scroll past." | Destroys performance, eats bandwidth, causes audio conflicts, and overwhelms the viewer. Multiple simultaneous video decodes will crash mobile browsers.                                                                                                                                                                  | Keep the current hover-to-play approach. One video plays at a time. This is the industry standard pattern.                                                                                                                                                 |
| **Chatbot / AI assistant**                      | "Let visitors ask questions about my work."                 | Wildly over-scoped for a portfolio site. Adds complexity, requires backend services, and the contact form already serves the communication purpose. Nobody expects a chatbot on a cinematographer's personal site.                                                                                                        | Working contact form. That is sufficient.                                                                                                                                                                                                                  |
| **Testimonials / reviews section**              | "Social proof from clients."                                | Requires sourcing quotes (which may not exist), adds content maintenance burden, and testimonial sections often feel forced on portfolio sites where the work itself is the proof.                                                                                                                                        | The client logo bar IS the social proof. Intel, Tencent, Toyota, Volkswagen -- those logos say more than any quote.                                                                                                                                        |
| **Credits / resume page**                       | "List all productions and roles."                           | Explicitly excluded by the user in PROJECT.md Out of Scope. A resume page shifts the site from "portfolio experience" to "job application," which conflicts with the intended purpose.                                                                                                                                    | The About section's credentials and specialties serve this purpose at the right level of detail.                                                                                                                                                           |

## Feature Dependencies

```
[Working Contact Form]
    (standalone -- no dependencies, fix first)

[Responsive Mobile Experience]
    └──requires──> [Touch-friendly Video Interaction]
                       └──enhances──> [Video Thumbnail Hover Previews]

[Video Category Filtering]
    └──requires──> [Video Config Categories] (already exist in videos.ts)
    └──enhances──> [Portfolio Grid Section]

[Custom Video Player]
    └──requires──> [Full-screen Video Playback] (existing modal)
    └──enhances──> [Keyboard Navigation for Modal]

[Cinematic Scroll Transitions]
    └──enhances──> [Cinematic Hero Text Animations]
    └──enhances──> [Smooth Section Transitions]

[Animated Client Logo Marquee]
    (standalone -- CSS-only, can be added anytime)

[Preloader]
    └──enhances──> [Hero Video Load Experience]
    (standalone -- no dependencies)

[Scroll Progress Indicator]
    (standalone -- no dependencies)

[Favicon + OG Image]
    (standalone -- no dependencies, high impact for sharing)
```

### Dependency Notes

- **Custom Video Player requires existing Modal:** The modal structure is already built. Custom controls replace the native `controls` attribute inside it. The modal is the container; the player is the content.
- **Video Category Filtering requires Category Data:** Already present in `videos.ts` -- each video has a `category` field. The data model supports this with zero backend changes.
- **Cinematic Scroll Transitions enhance all sections:** Motion is already installed. Scroll transitions are applied per-section and can be incrementally improved without changing the component architecture.
- **Touch-friendly Video conflicts with Hover-to-Play:** On mobile, there is no hover. The current approach silently fails on touch devices. Must implement tap-to-preview as a parallel interaction path.
- **Preloader is independent but enhances hero:** Can be implemented as a wrapper around the App component that fades out once the hero video fires `onLoadedData`.

## MVP Definition

### Launch With (v1) -- "Polished and Working"

The minimum to make the existing site feel finished rather than abandoned.

- [ ] **Fix contact form end-to-end** -- the only functional feature that is currently broken. Without this, the site has no conversion path.
- [ ] **Fix CSP blocking Google Analytics and Fonts** -- analytics are useless if blocked; fonts affect rendering.
- [ ] **Add favicon.svg and og-image.jpg** -- shared links without previews look unprofessional.
- [ ] **Mobile touch-to-play video fallback** -- hover-to-play fails silently on mobile; over half of visitors are on phones.
- [ ] **Consistent typography and spacing audit** -- fix design inconsistencies identified in PROJECT.md.
- [ ] **Remove dead code** -- 44 unused shadcn/ui components (5,119 lines) and ~20 unused npm packages create confusion and bloat.
- [ ] **Fix package name** -- `@figma/my-make-file` signals "unfinished scaffold."

### Add After Foundation (v1.x) -- "Premium Feel"

Features that elevate from "works correctly" to "feels cinematic."

- [ ] **Cinematic hero text animations** -- refined easing, text-reveal effects, dramatic entrance sequence. Low complexity, high visual impact.
- [ ] **Video category filtering** -- let visitors filter by Commercial, Documentary, Short Film, etc. Medium complexity but directly serves the use case.
- [ ] **Animated client logo marquee** -- replace static grid with infinite-scroll marquee. Low complexity, significant polish.
- [ ] **Preloader / loading screen** -- smooth the initial load experience. Low complexity.
- [ ] **Scroll progress indicator** -- orientation aid for single-page scroll. Low complexity.
- [ ] **Enhanced scroll-triggered section animations** -- coordinated reveals, staggered grids, parallax depth within normal scroll.
- [ ] **Keyboard navigation for video modal** -- Escape, arrows, spacebar. Low effort, high polish.

### Future Consideration (v2+) -- "Craft-Level Detail"

Features to defer until core is polished and stable.

- [ ] **Custom video player chrome** -- branded progress bar, volume, time display. HIGH complexity. Defer because native controls work and this is a significant build.
- [ ] **Video transition animations** -- animated transitions between videos within the modal (swipe or crossfade to next/previous). Requires custom player infrastructure.
- [ ] **Performance optimization for Core Web Vitals** -- bundle splitting, image optimization pipeline, font subsetting. Important but not visible to casual visitors.
- [ ] **Accessibility deep audit** -- WCAG 2.2 AA compliance, screen reader testing, reduced motion preferences. Important ethical/legal concern but significant effort.

## Feature Prioritization Matrix

| Feature                        | User Value | Implementation Cost | Priority |
| ------------------------------ | ---------- | ------------------- | -------- |
| Fix contact form               | HIGH       | LOW                 | P1       |
| Fix CSP (Analytics + Fonts)    | HIGH       | LOW                 | P1       |
| Add favicon + OG image         | HIGH       | LOW                 | P1       |
| Remove dead code / unused deps | MEDIUM     | LOW                 | P1       |
| Fix package name               | LOW        | LOW                 | P1       |
| Mobile touch-to-play fallback  | HIGH       | LOW                 | P1       |
| Typography/spacing audit       | MEDIUM     | LOW                 | P1       |
| Cinematic hero animations      | MEDIUM     | LOW                 | P2       |
| Video category filtering       | HIGH       | MEDIUM              | P2       |
| Animated logo marquee          | MEDIUM     | LOW                 | P2       |
| Preloader                      | MEDIUM     | LOW                 | P2       |
| Scroll progress indicator      | LOW        | LOW                 | P2       |
| Enhanced scroll animations     | MEDIUM     | MEDIUM              | P2       |
| Keyboard modal navigation      | MEDIUM     | LOW                 | P2       |
| Custom video player            | MEDIUM     | HIGH                | P3       |
| Video transition animations    | LOW        | HIGH                | P3       |
| Core Web Vitals optimization   | MEDIUM     | MEDIUM              | P3       |
| Accessibility deep audit       | MEDIUM     | HIGH                | P3       |

**Priority key:**

- P1: Must fix before the site can be considered "launched" -- broken features, missing basics
- P2: Should add to make the site feel premium -- the cinematic polish layer
- P3: Nice to have, adds craft-level refinement -- defer until P1 and P2 are solid

## Competitor Feature Analysis

| Feature                       | Autumn Durald (ASC)                       | Roger Deakins (ASC, BSC)                        | Award-winning Portfolios (Awwwards)                  | stealinglight.hk (Current)                   | Our Approach                                                                 |
| ----------------------------- | ----------------------------------------- | ----------------------------------------------- | ---------------------------------------------------- | -------------------------------------------- | ---------------------------------------------------------------------------- |
| **Work showcase**             | Grid of thumbnails, click to project page | Film-organized filmography, educational content | Large-scale imagery, hover reveals, featured project | Featured video + grid, hover-to-play, modal  | Keep modal approach. Add category filtering. Polish hover interactions.      |
| **Navigation**                | Minimal: Work, Contact, Press             | Hierarchical: Forums, Members, Team, Contact    | Sticky headers, breadcrumb filtering                 | Sticky header with smooth scroll links       | Keep current approach. Already clean and appropriate.                        |
| **Video presentation**        | Embedded Vimeo/YouTube players            | YouTube embeds within educational articles      | Custom players, cinematic overlays, hover previews   | Self-hosted MP4, native controls in modal    | Self-hosted is premium (no third-party branding). Add custom controls later. |
| **Color scheme**              | Clean white/minimal                       | White with teal accents                         | Dark, cinematic, gradient overlays                   | Dark with amber accents                      | Already correct. Dark + amber is strong for cinematography.                  |
| **About section**             | Brief bio, ASC credential                 | Extensive educational content, forums, podcast  | Minimal or absent on portfolio-first sites           | Detailed bio, credentials, specialties       | Current depth is good. Don't over-expand.                                    |
| **Client/credential display** | Director collaborations listed            | Filmography by film                             | Logo bars, client grids                              | Static logo grid                             | Upgrade to animated marquee.                                                 |
| **Contact**                   | Simple email/representation info          | Contact form                                    | Clean forms, minimal friction                        | Form (broken) with phone + location          | Fix form. Current layout is appropriate.                                     |
| **Loading experience**        | Instant (static site, Squarespace)        | Instant (lightweight)                           | Preloaders, skeleton screens                         | No preloader, poster image while video loads | Add branded preloader for hero video.                                        |

## Key Insight: What Makes Cinematography Portfolios Feel "Premium"

The research reveals a consistent pattern across the best sites in this space:

1. **Restraint over excess.** The best cinematographer portfolios have LESS, not more. Fewer navigation items, fewer sections, fewer words. The work does the talking. stealinglight.hk actually has too many sections for a cinematographer portfolio (Services and Clients could arguably be folded into About).

2. **Video is the hero, not the page.** The page exists to serve the video, not the other way around. Everything should make the videos look better -- dark backgrounds, generous whitespace around thumbnails, clean overlays that don't compete with the imagery.

3. **Cinematic pacing, not speed.** Award-winning portfolios use deliberate animation timing (0.6s-1.2s transitions, not 0.3s snappy UI animations). The site should feel like it was directed, not coded.

4. **Self-hosted video is a differentiator.** Most cinematographers use Vimeo embeds. Self-hosted video via CloudFront (which stealinglight.hk already has) means no third-party branding, no "Watch on Vimeo" prompts, no buffering ads. This is already a competitive advantage.

5. **The site IS the portfolio.** Visitors are not reading -- they are watching. Text should be minimal, purposeful, and never compete with video content for attention.

## Sources

- Awwwards portfolio website patterns analysis (awwwards.com/websites/portfolio/) -- HIGH confidence
- Awwwards video website patterns analysis (awwwards.com/websites/video/) -- HIGH confidence
- Autumn Durald Arkapaw portfolio (autumndurald.com) -- MEDIUM confidence (single site analysis)
- Roger Deakins website (rogerdeakins.com) -- MEDIUM confidence (atypical, more educational than portfolio)
- Matt Porwoll cinematographer portfolio (mattporwoll.com) -- LOW confidence (structural analysis only)
- One Page Love video portfolio collection (onepagelove.com/tag/video) -- LOW confidence (directory, not analysis)
- Domain expertise from cinematographer portfolio ecosystem -- MEDIUM confidence (training data, not verified against 2026 trends)

---

_Feature research for: Cinematography portfolio website_
_Researched: 2026-03-27_
