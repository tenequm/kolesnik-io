# CLAUDE.md

Development guidance for this Astro site.

## Stack

- Astro 6 (static output)
- Tailwind CSS v4 via `@tailwindcss/vite` (CSS-first config in `src/styles/global.css`, no `tailwind.config.js`)
- Biome 2 for lint and format (TypeScript, JavaScript, JSON, CSS, and Astro files)
- pnpm package manager
- Node 22.12+

## Commands

| Command        | Action                                       |
| -------------- | -------------------------------------------- |
| `pnpm dev`     | Local dev server at http://localhost:4321    |
| `pnpm build`   | Static build to `./dist`                     |
| `pnpm preview` | Preview the production build locally         |
| `pnpm check`   | `astro check` + `biome check .` (must pass)  |
| `pnpm lint`    | `biome check .` only                         |
| `pnpm format`  | Apply Biome safe fixes                       |

## File layout

```
src/
  layouts/BaseLayout.astro  HTML shell, font preloads, footer
  pages/
    index.astro             Home (all sections inline)
    privacy.astro           Privacy policy
  styles/global.css         Tailwind import + design tokens
```

Sections on the home page are inline in `index.astro` rather than extracted into components. Extract to `src/components/` only when a section is reused across pages or `index.astro` becomes hard to navigate.

## Design tokens

All colors and font variables live in `src/styles/global.css` under `@theme`. They become Tailwind utility classes automatically (e.g. `bg-bg`, `text-ink`, `text-accent`).

## Fonts

Fonts are loaded via the Astro Fonts API (configured in `astro.config.mjs`) and exposed as CSS variables `--font-display` (Source Serif 4) and `--font-body` (IBM Plex Sans). The `<Font />` component in `BaseLayout.astro` handles preload links.
