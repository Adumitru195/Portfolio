# taste-skill — Frontend Design System

Source: https://github.com/Leonxlnx/taste-skill

## Active Settings

```
DESIGN_VARIANCE   = 8   // Asymmetric, experimental layouts
MOTION_INTENSITY  = 6   // Scroll reveals, spring physics, smooth transitions
VISUAL_DENSITY    = 3   // Spacious, letting work breathe
```

## Architecture & Engineering

- React 18 + Vite + TypeScript (strict)
- Tailwind CSS v3 for utility classes
- Framer Motion for all animations
- Phosphor Icons (`@phosphor-icons/react`)
- Cabinet Grotesk (headings) + Geist (body)

## Typography

- Headlines: `font-display font-black text-4xl md:text-6xl tracking-tightest`
- Never use generic Inter as primary display font
- Line height for large headlines: `leading-[0.9]` to `leading-[1.0]`

## Color

- Backgrounds: `#0a0a0a` (ink) or `#121212` (ink-soft)
- Accent: `#e8ff4d` — exactly ONE accent. No secondary accents.
- Text primary: `#f0ede8` (warm off-white)
- Text secondary: `#a09b93`
- Text muted: `#5c5852`
- FORBIDDEN: `#8B5CF6` (AI purple), pure `#000000`, pure `#ffffff`

## Layout Rules

- Centered hero sections are BANNED (DESIGN_VARIANCE > 4)
- Use CSS Grid for complex layouts — not flexbox percentage math
- `min-h-[100dvh]` always — never `h-screen`
- Max content width: `max-w-6xl mx-auto`
- Page padding: `px-6 md:px-10`

## Animation Rules (MOTION_INTENSITY = 6)

- All animations ONLY use `transform` and `opacity` (GPU-accelerated)
- NEVER animate `top`, `left`, `width`, `height`
- Spring physics: `{ stiffness: 100, damping: 20, mass: 1 }`
- Scroll-triggered: `whileInView` with `viewport={{ once: true, margin: '-10%' }}`
- Magnetic/parallax: `useMotionValue` + `useSpring` for cursor tracking
- Stagger children: `staggerChildren: 0.1`

## Component Patterns

- Semantic HTML required: `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`
- Glassmorphism: `backdrop-filter: blur(12px)` + `1px rgba border` + inner shadow
- Shadows: tinted to match background hue (never pure black box-shadow)
- Border radius: tighter on inner elements (`rounded-md`), softer on cards (`rounded-2xl`)
- Icons: Phosphor only — `weight="bold"` for actions, `weight="regular"` for content

## Banned Patterns

- No emojis in UI
- No centered hero (when DESIGN_VARIANCE > 4)
- No AI purple (`#8B5CF6`)
- No `h-screen` — use `min-h-[100dvh]`
- No `// ...` or `// TODO` placeholders in deliverable code
- No truncated output — all code must be complete and executable
- No inline styles for static values (use Tailwind classes)
- No Lucide or Feather icons

## States

Always implement ALL states:
- Loading state
- Empty state
- Error state
- Success state

## Code Quality

- TypeScript strict mode — no `any`
- Absolute imports via `@/` alias
- `interface` for object shapes
- PascalCase components, camelCase functions/hooks, kebab-case file names
