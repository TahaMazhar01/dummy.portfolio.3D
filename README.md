# Sarah Guhaina — Portfolio

A responsive React portfolio with animated teal annotations, a smooth title orbit, lilac and plum backgrounds, and a generated reference-based portrait.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Open the local address printed by Vite (normally http://localhost:5173).

## Build

```sh
npm run build
npm run preview
```

The production output is in `dist/`. For Vercel, use the Vite preset, build command `npm run build`, and output directory `dist`.

## Customize

Edit `src/main.tsx` for the name, portrait, background and pencil colours, and QR destination. The QR code currently points to https://3dportfolioview01.vercel.app/.

The portrait is `public/sarah-guhaina-portrait.png`; its generation prompt is recorded in `portrait-prompt.txt`.

## Original template

Based on Marginalia Portfolio Template by Kedhareswer Naidu, distributed under the MIT license.

- Original author: https://kedhar.pages.dev
- Component demo: https://kedhar-components.pages.dev/#marginalia-portfolio-template
- Component documentation: `components/marginalia-portfolio-template/README.md`

The UK education entries and language proficiency levels are sample content. A standalone QR code is available at public/portfolio-qr.svg.

The home page includes a themed Design Studio section with rolling letters, pointer interactions, and sticker bursts. Its source and styles are in src/components/StudioMotionHero.tsx and StudioMotionHero.module.css. Social profile links are hidden until Sarah's actual profile URLs are supplied.
