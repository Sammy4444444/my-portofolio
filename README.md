# Cosmic Contrast

Interactive portfolio site built with React, Vite, TypeScript, Tailwind CSS v4, Framer Motion, and Three.js. Includes a real-time WebGL black hole simulation.

## Getting started

```bash
npm install
npm run dev
```

The dev server runs at http://localhost:8080.

## Build

```bash
npm run build
```

Outputs a static site to `dist/`, containing `dist/index.html` plus hashed asset files.

Preview the production build locally:

```bash
npm run preview
```

## Deployment

The build output in `dist/` is a plain static site and can be deployed to any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages, S3, etc.).

For providers that need SPA fallback so client-side routes like `/black-hole` work on refresh, redirect all unknown paths to `index.html`. On Netlify this is a one-liner in `public/_redirects`:

```
/*   /index.html   200
```

## Tech stack

- React 19 + React Router
- Vite 7
- TypeScript
- Tailwind CSS v4
- Framer Motion (via `motion`)
- Three.js
- shadcn/ui components (Radix primitives)
