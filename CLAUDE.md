# CLAUDE.md

Development guidance for this Astro site.

## Stack

- Astro 7 (static output)
- Tailwind CSS v4 via `@tailwindcss/vite` (CSS-first config in `src/styles/global.css`, no `tailwind.config.js`)
- Biome 2 for lint and format (TypeScript, JavaScript, JSON, CSS, and Astro files)
- pnpm package manager
- Node 26 (pinned in `.nvmrc`)

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
  assets/blog/              Images used by blog posts (optimized at build)
  components/Callout.astro  MDX callout aside
  content/blog/             Blog posts (.md/.mdx), frontmatter per content.config.ts
  content.config.ts         Blog collection schema (glob loader + Zod)
  layouts/BaseLayout.astro  HTML shell, header nav, font preloads, footer
  pages/
    index.astro             Home (all sections inline; latest 3 posts)
    blog/index.astro        Post list
    blog/[...slug].astro    Post pages
    rss.xml.ts              RSS feed (published posts only)
    privacy.astro           Privacy policy
  styles/global.css         Tailwind import + design tokens + .prose-body
```

Posts with `draft: true` render in dev (marked "Draft") but are excluded from
production builds and the RSS feed.

Sections on the home page are inline in `index.astro` rather than extracted into components. Extract to `src/components/` only when a section is reused across pages or `index.astro` becomes hard to navigate.

## Design tokens

Site colors live in `src/styles/global.css` as `--kolesnik-*` variables on `:root`. An `@theme inline` block maps them and the Astro font variables to existing Tailwind utilities (e.g. `bg-bg`, `text-ink`, `text-accent`). Use the namespaced variables directly in handwritten CSS. Keep the mappings inline so utilities do not depend on generic variables that browser extensions may overwrite.

## Fonts

Fonts are loaded via the Astro Fonts API (configured in `astro.config.mjs`) and exposed as CSS variables `--kolesnik-font-serif` (Source Serif 4) and `--kolesnik-font-mono` (IBM Plex Mono). The `<Font />` component in `BaseLayout.astro` handles preload links.
