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
- Headlines: `text-4xl md:text-6xl tracking-tighter`
- Max 1 accent color — no visual chaos
- Centered hero sections are BANNED (variance > 4)
- AI purple (`#8B5CF6`) is FORBIDDEN
- Animations ONLY use `transform` and `opacity` (GPU-accelerated)
- `min-h-[100dvh]` instead of `h-screen`
- No emojis — Phosphor icons only
- Off-black backgrounds: `#0a0a0a` or `#121212`
- Tinted shadows (match background hue, not pure black)
- When motion > 5: Framer Motion `useMotionValue` + spring physics (`stiffness: 100, damping: 20`)

## File Structure

```
src/
  components/      # Reusable UI components
  sections/        # Page sections (Hero, Work, About, Contact)
  data/            # Static content (projects, experience)
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
- **Naming**: PascalCase for components, camelCase for functions/variables, kebab-case for files in `sections/` and `components/`.

## GitHub Pages

- Base URL: `/Portfolio/`
- Deploy command: `npm run deploy`
- Build output: `dist/`
- The `gh-pages` branch is auto-managed — never edit it manually.

## Content Updates

Portfolio content lives in `src/data/`. To update project info, experience, or bio, edit those files — **do not** hardcode content in components.

## Projects

This is a **UX portfolio**. The following three case studies are featured (Backwater Journal is excluded):

| Project               | Assets folder                                                                           |
|-----------------------|-----------------------------------------------------------------------------------------|
| Arcadian Homes        | `UX Projects/Arcadian Homes/` — persona, journey map, user research, wireframes, videos |
| ReelHouse Cinemas     | `UX Projects/ReelHouse Cinemas/` — cinema booking UX                                    |
| The Sustained Company | `UX Projects/The Sustained Company/` — persona, journey map, usability study, videos   |

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
10. **Do NOT use Backwater Journal** as a project case study
