# AGENTS.md

This file defines conventions, context, and rules for AI agents (Claude Code, Cursor, Copilot, etc.) working on this repository.

## Project Overview

Andrew Dumitru's UX/product design portfolio — a TypeScript React (Vite) single-page application deployed to GitHub Pages at `https://adumitru195.github.io/Portfolio/`.

## Tech Stack

| Layer | Choice |
|---|---|
| Language | TypeScript (strict) |
| Framework | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| Animation | Framer Motion |
| 3D | Three.js + React Three Fiber **v8** (React 18 line; do not bump to v9, it needs React 19) |
| Icons | Phosphor Icons (`@phosphor-icons/react`) |
| Font | Cabinet Grotesk (headings) + Geist (body) |
| Deployment | GitHub Pages via `gh-pages` package |

## Design System (taste-skill)

This project follows the [taste-skill](https://github.com/Leonxlnx/taste-skill) design system. See `SKILL.md` in the root for full rules.

**Active settings:**
- `DESIGN_VARIANCE = 8` — Asymmetric, experimental layouts
- `MOTION_INTENSITY = 6` — Scroll reveals, spring physics
- `VISUAL_DENSITY = 3` — Spacious, letting work breathe

**Non-negotiable rules:**
- Headlines: Cabinet Grotesk, tight tracking, fluid `clamp()` sizes tuned per section (see `src/sections/Hero.tsx`)
- Max 1 accent color (indigo `#4F46E5`) — no visual chaos
- Centered hero sections are BANNED (variance > 4)
- AI purple (`#8B5CF6`) is FORBIDDEN
- Animations ONLY use `transform` and `opacity` (GPU-accelerated)
- `min-h-[100dvh]` instead of `h-screen`
- No emojis — Phosphor icons only
- Light theme: off-white background `#F7F7F5`, white surfaces, dark ink text `#1C1C1C` / `#4B4B4B`. Lavender tints (`lavender-*`) for the footer panel
- Tinted shadows (indigo-tinted, e.g. `rgba(46,43,110,…)`, never pure black)
- When motion > 5: Framer Motion `useMotionValue` + spring physics (`stiffness: 100, damping: 20`)

## Creative Direction: Tactile Digital Workspace

The homepage is being redesigned under this direction: the minimal editorial base (Cabinet Grotesk, Geist, off-white, dark type, one indigo accent) plus composed, interactive depth that shows the real work of a product designer.

- **Do:** layered interfaces, subtle depth, soft tinted shadows, restrained colour, deliberate composition, real project screenshots and real design tokens.
- **Don't:** heavy gradients, glassmorphism, glows, generic SaaS/agency patterns, random abstract 3D, floating software logos, perpetual floating/spinning, over-rounded cards everywhere, invented interfaces or claims.
- Three.js is a tool, not a requirement: use CSS transforms when they give the same result.

### Staged redesign plan

Work proceeds one stage at a time; each stage is reviewed by the owner before the next starts. Never commit, push or deploy without explicit approval.

| Stage | Scope | Status |
|---|---|---|
| A | Hero copy + layout, navigation (Work · About · Start a project), hero Three.js workspace | Approved |
| B | Services ("How I can help") layout, copy, illustrations, interactions | Approved (CSS 3D only — no WebGL in Services) |
| C | Featured Backwater Journal presentation + remaining five project folders | Approved |
| D | Homepage About preview, Contact, Footer | Approved |
| E | Responsive, accessibility (WCAG 2.2 AA target), performance QA | In review |

### Decorative 3D pattern (hero, work folders, contact, About)

Services illustrations are deliberately CSS 3D, not WebGL: `src/components/services/ServicePlate.tsx` (play-once trigger, spring pointer tilt) + `ServiceIllustrations.tsx` (sizes in `em` against a 1cqw root, so 1em = 1% of the plate width; offsets on an element with its own font size use that size's em).

- A complete HTML/SVG/canvas composition always renders first and is what phones, touch, reduced motion and WebGL failures keep.
- The R3F scene is `React.lazy`-loaded only on eligible desktops, wrapped in `WebGLBoundary` (+ `WebGLFailSignal`), renders on demand (`frameloop="demand"`), caps DPR at 1.5, pauses offscreen (IntersectionObserver) and while the tab is hidden (`usePageVisible`), disposes its geometries/materials/textures, and is `aria-hidden` with `pointer-events: none`.
- The featured Backwater Journal presentation (`src/components/work/FeaturedProject.tsx`, copy in `src/data/work.ts`) is CSS perspective only; its release facts and App Store link come from `src/data/backwater-release.ts`, the single source shared with the case study. Folder types (`kind` in `src/data/work-folders.ts`) come from each case study's own eyebrow.
- Shared poses live in `src/lib/` so the HTML and 3D versions match exactly at hand-off. The hero workspace (`src/components/hero/HeroWorkspace*.tsx`, `src/lib/heroWorkspace.ts`) paints each panel once into a `<canvas>` that both versions display.
- Respect both `prefers-reduced-motion` and the footer's "Reduce motion" toggle via `useReducedMotionPreference()`.
- Scroll reveals use `useReveal()` (`src/hooks/useReveal.ts`): content is shown from the start under reduced motion or without IntersectionObserver, and print CSS forces it visible. Never leave essential content dependent on an animation firing.
- Guard every `new IntersectionObserver` with `'IntersectionObserver' in window`.

### Homepage structure (current)

`src/App.tsx` renders the homepage eagerly: Hero → Services → Work (featured Backwater Journal + folder gallery) → AboutPreview → Contact, with Navbar and Footer. The About page and the case-study route are `React.lazy` routes, so the homepage doesn't download them.

- Copy lives in `src/data/`: `hero.ts`, `services.ts`, `work.ts`, `work-folders.ts`, `about.ts` (`aboutPreview`), `contact.ts`.
- **Manually maintained release facts:** `src/data/backwater-release.ts` is the only place Backwater Journal's release date, latest version, price and App Store link are written. Update it (and its `verifiedOn` date) by hand when a version ships; both the homepage and the case study read from it.
- Colour tokens: body text uses `text-primary` / `text-secondary`; `text-muted` (#6B6B6B) is the lightest grey allowed for text (AA on the page and the lavender footer).

### Metadata and SEO

- `index.html` holds the title, description, canonical URL and Open Graph / Twitter tags. Pages set `document.title` on mount and restore it on unmount.
- `public/og-image.png` (1200 × 630) is captured from the real hero by `scripts/og-image.mjs`; regenerate it after hero changes. Social networks don't accept SVG previews.
- Hash routing means crawlers see a single document; only the homepage URL is indexable as its own page. Changing that would need a router/hosting change, which is out of scope.

## File Structure

```
src/
  components/      # Reusable UI components
  sections/        # Homepage sections (Hero, Services, Work, Contact)
  pages/           # About page and case study pages
  data/            # Static content (copy, projects, case studies)
  hooks/           # Custom React hooks
  lib/             # Utility functions
  types/           # TypeScript interfaces
  App.tsx
  main.tsx
  index.css
```

## Coding Conventions

- **React**: Default to functional components. Use Server-friendly patterns.
- **State**: `useState`/`useReducer` for local state; no global state library needed for this static site.
- **TypeScript**: Strict mode on. No `any`. Prefer `interface` for object shapes.
- **CSS classes**: Tailwind utility classes. No inline styles except for Framer Motion dynamic values.
- **Imports**: Absolute imports via `@/` alias (configured in `tsconfig.json` and `vite.config.ts`).
- **Naming**: PascalCase for components and their files, camelCase for functions/variables and `lib/` files, kebab-case for multi-word `data/` files.
- **Assets**: never modify source screenshots or photos; generate derivatives with a script in `scripts/` (e.g. `scripts/hero-assets.py`, `scripts/about-assets.py`).

## GitHub Pages

- Base URL: `/Portfolio/`
- Deploy command: `npm run deploy`
- Build output: `dist/`
- The `gh-pages` branch is auto-managed — never edit it manually.

## Content Updates

Portfolio content lives in `src/data/`. To update project info, experience, or bio, edit those files — **do not** hardcode content in components.

## Projects

This is a **UX portfolio** with six case studies (`src/data/projects.ts`, routes `#/project/<id>`). **Backwater Journal is the flagship**: a released iOS product designed and built end to end. Clearly distinguish released products, concept work and academic work, using each project's own information.

| Project               | Type and assets                                                                          |
|-----------------------|-----------------------------------------------------------------------------------------|
| Backwater Journal     | Released iOS app (product strategy, UX/UI, development, release). Assets in `public/projects/backwater-journal/`. Green identity (Forest `#20382F`) |
| AIC Museum Experience | Academic group project, UXD 260 Research & Evaluation, DePaul University. Assets in `public/projects/aic-museum-experience/` |
| Porchlight            | `UX Projects/Porchlight/` — rental discovery redesign of Arcadian Homes; case study PDF, wireframe board, screenshots |
| Afterglow Cinema      | `UX Projects/Afterglow Cinema/` — midnight/lavender cinema app; screenshots and motion demo captured from it. The case study PDF still shows the old charcoal/amber theme, so its download link is removed until it is regenerated. Film artwork is unlicensed: see its `docs/ASSET-SOURCES.md` before publishing |
| Wovenward             | `UX Projects/Wovenward/` — responsive clothing shop (replaces The Sustained Company); case study PDF, supplied wireframe board (kept unchanged) and corrected wireframes from `scripts/wovenward-wireframes.py`. Old `/project/sustained-company` redirects to `/project/wovenward` |
| Typography Systems    | Editorial design and typography studies (two books). Assets from `scripts/typography-systems-assets.py` |

Porchlight and Wovenward are untested with users: never invent participants, findings or metrics for them. Never invent clients, testimonials, credentials or business results anywhere.

Project thumbnails are copied to `public/projects/` and referenced in `src/data/projects.ts`.

## Agent Rules

1. **Never truncate code** — output complete implementations
2. **Never use placeholder comments** (`// ...`, `// TODO`) in deliverables
3. **Always implement all states** — loading, empty, error, and success
4. **Never center the hero section**
5. **Never introduce `h-screen`** — use `min-h-[100dvh]`
6. **Always use semantic HTML** — `<nav>`, `<main>`, `<article>`, `<section>`, etc.
7. **Run `npm run build`** after changes to confirm no TypeScript errors
8. **Keep `SKILL.md` in project root** — reference it when generating new UI
9. **This is a UX portfolio** — tone is thoughtful, confident, design-focused
10. **Backwater Journal is the flagship case study** — do not duplicate it in both the featured presentation and the folder grid
11. **Do not modify individual case study content** without the owner's authorization
12. **Never commit, push or deploy** without the owner's explicit approval

## Future Improvements

### Individual case-study SEO (hash routing) — not yet scheduled

**Current limitation.** The site uses `HashRouter`, so every page is a fragment of one document: `/Portfolio/#/about`, `/Portfolio/#/project/backwater-journal`, and so on. Search engines ignore the part after `#`, which means:

- Only the homepage URL (`https://adumitru195.github.io/Portfolio/`) is indexable. The About page and the six case studies cannot rank or appear as separate search results.
- Every route shares the same `<title>`, meta description and Open Graph tags from `index.html` when crawled or shared. Titles set by pages at runtime (`document.title`) aren't seen by most crawlers or link-preview bots, so a shared case-study link previews as the homepage.
- A sitemap can't usefully list the case studies, and `robots.txt` would have to live in the root `adumitru195.github.io` repository, not this one.

**Why it's hash routing today.** GitHub Pages serves static files with no server-side rewrites, and hash routes always load `index.html`, so deep links and refreshes never 404.

**Possible approaches (each needs a deliberate decision; don't change routing without one):**

1. **Pre-rendered static pages.** Switch to `BrowserRouter` with `basename="/Portfolio"` and generate a real HTML file per route at build time (for example with a Vite prerender/SSG step), each with its own title, description, canonical URL and Open Graph image. Add a `404.html` fallback for anything not pre-rendered.
2. **Lightweight share pages.** Keep the hash routes, and add static HTML stubs (e.g. `/Portfolio/work/backwater-journal/`) that carry the correct metadata for search engines and link previews, then forward visitors to the matching hash route.
3. **Hosting with rewrites.** Move to a host that supports history-API fallbacks, then use `BrowserRouter` with per-route metadata.

Whichever is chosen must keep existing `#/project/<id>` links working (redirect them), keep ScrollManager's scroll restoration, and give each case study its own preview image.

## Common Tasks

| Task | Command |
|------|---------|
| Start dev server | `npm run dev` |
| Build for production | `npm run build` |
| Deploy to GitHub Pages | `npm run deploy` |
| Preview build locally | `npm run preview` |

## Testing

Currently this project has no test suite. If tests are added:
- Use **Vitest** (matches Vite ecosystem)
- Place tests alongside source files with `.test.ts` or `.test.tsx` suffix
- Run tests with `npm run test`
- Include unit tests for utility functions in `src/lib/`

## Debugging

**Common issues:**
- **Blank page after deploy**: Check that base URL in `vite.config.ts` is set to `/Portfolio/`
- **Missing images**: Ensure project thumbnails are in `public/projects/`, not `src/`
- **TypeScript errors**: Run `npm run build` to see full error details
- **Font not loading**: Cabinet Grotesk (Fontshare) and Geist (Google Fonts) are linked from `index.html`, not imported in CSS
- **New Tailwind tokens not applying**: restart the dev server after editing `tailwind.config.js`
- **Sections blank in a full-page screenshot**: scroll reveals only fire when scrolled into view; scroll the page first (or emulate reduced motion) before capturing

## Anti-patterns

- Do NOT use `h-screen` — use `min-h-[100dvh]` for mobile viewport issues
- Do NOT hardcode content in components — edit files in `src/data/` instead
- Do NOT use placeholder comments like `// ...` or `// TODO`
- Do NOT center hero sections — use asymmetric layouts per design variance rule
- Do NOT use pure black shadows — use tinted shadows matching background hue
