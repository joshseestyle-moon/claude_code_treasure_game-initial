# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install       # Install dependencies
npm run dev       # Start dev server at http://localhost:3000
npm run build     # Build to build/ directory
```

There is no test runner or lint script configured.

## Architecture

This is a single-page React 18 + TypeScript app built with Vite 6.

**Game logic** lives entirely in `src/App.tsx`. The game presents 3 treasure chests, one of which randomly contains treasure (+$100); the others contain skeletons (-$50). The game ends when the player finds the treasure or opens all boxes.

**Component library**: `src/components/ui/` contains shadcn/ui components (Radix UI wrappers with Tailwind). Treat these as third-party — don't edit them unless specifically updating the design system. `src/components/figma/ImageWithFallback.tsx` is a utility that shows an SVG placeholder on image load failure.

**Styling**: Tailwind CSS v4. `src/index.css` is the pre-compiled Tailwind output (do not edit manually). `src/styles/globals.css` defines CSS custom properties used by shadcn/ui for theming (light/dark mode tokens, border radius, etc.). Custom theme tokens go in `globals.css`.

**Assets**:
- `src/assets/` — chest images: `treasure_closed.png`, `treasure_opened.png` (gold), `treasure_opened_skeleton.png`, `key.png`
- `src/audios/` — `chest_open.mp3`, `chest_open_with_evil_laugh.mp3`
- `src/results/` — `key_hover.png`

**Path alias**: `@` resolves to `src/`.

**Animations**: Uses `motion/react` (Framer Motion v11+ package name). Import as `import { motion } from 'motion/react'`.

No TypeScript config file is present; Vite handles transpilation via `@vitejs/plugin-react-swc`.
