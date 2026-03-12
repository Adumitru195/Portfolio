# Andrew Dumitru — UX Portfolio

Personal UX design portfolio featuring case studies for Arcadian Homes, ReelHouse Cinemas, and The Sustained Company. Built with React, TypeScript, and Vite. Deployed to GitHub Pages.

**Live site:** [adumitru195.github.io/Portfolio](https://adumitru195.github.io/Portfolio/)

## Stack

- **React 18 + Vite** — fast dev server and optimized builds
- **TypeScript** — strict mode, no `any`
- **Tailwind CSS** — utility-first styling
- **Framer Motion** — spring-physics animations
- **Phosphor Icons** — consistent iconography
- **Cabinet Grotesk + Geist** — premium typography

## Design System

This project follows the [taste-skill](https://github.com/Leonxlnx/taste-skill) design system for high-quality, non-generic UI. See `SKILL.md` for the full rule set used by AI agents.

## Getting Started

```bash
npm install
npm run dev
```

## Build & Deploy

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

The `deploy` script builds the project and pushes the `dist/` folder to the `gh-pages` branch automatically.

## Project Structure

```
src/
  components/    # Reusable UI components (Navbar, Footer, Tag, etc.)
  sections/      # Page sections (Hero, Work, About, Contact)
  data/          # Static content — edit this to update portfolio info
  hooks/         # Custom React hooks
  lib/           # Framer Motion animation variants
  types/         # TypeScript interfaces
public/
  projects/      # Project thumbnail images (.webp)
```

## Content

All portfolio content (projects, work experience, bio) is defined in `src/data/`. No content is hardcoded in components.

## AI Agent Configuration

See [AGENTS.md](./AGENTS.md) for AI agent rules, coding conventions, and design system settings.
