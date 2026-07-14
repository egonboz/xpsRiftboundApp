# AGENTS.md

## Commands

```bash
npm run dev          # Start Vite dev server (HMR)
npm run build        # Type-check (tsc -b) then build (vite build)
npm run lint         # Run oxlint
npm run preview      # Preview production build
```

- `build` runs `tsc -b` first using project references — it type-checks **both** `tsconfig.app.json` and `tsconfig.node.json`. There is no standalone `typecheck` script.
- Linting uses **oxlint** (not ESLint). Config: `.oxlintrc.json`.

## Stack

React 19 + TypeScript 6 + Vite 8 + Tailwind CSS 4 + react-router-dom 7 (BrowserRouter, not data routers).

## Architecture

```
src/
├── app/          # Root App component (routing + global layout)
├── components/
│   ├── layout/   # Header, BottomNavigation
│   └── ui/       # Shared UI primitives (Badge, StatCard, SectionCard, etc.)
├── entities/     # Domain types (e.g., Player, DashboardData)
├── features/     # Feature modules, each with pages/, hooks/, components/
├── lib/          # cn() util, format helpers
├── mock/         # Hardcoded mock data
├── services/     # Async data layer (currently mock with simulated delays)
├── index.css     # Tailwind v4 config (@theme tokens, custom utilities)
└── main.tsx      # Entry point → renders <App /> into #root
```

- **Feature-based structure**: Each feature under `features/` is self-contained.
- **Services → hooks → components**: `services/` exports async functions, feature hooks call them with `useState`/`useEffect` + cancelled-flag pattern, pages compose loading/error/data states.
- **No global state** (no Redux, Zustand, Context). Each page fetches its own data.
- **Mobile-first**: layout is `max-w-lg` centered; designed as a mobile app shell with a persistent bottom nav bar rendered outside `<Routes>`.

## Key conventions

- **Path alias**: `@/*` → `./src/*` (configured in both `vite.config.ts` and `tsconfig.app.json`).
- **Module imports**: `verbatimModuleSyntax: true` — type-only imports require the `type` keyword (e.g., `import type { Player } from ...`).
- **Tailwind v4**: Uses `@import "tailwindcss"` in CSS (not `@tailwind` directives). No `tailwind.config.js`. Custom theme tokens defined in `src/index.css` via `@theme`. Custom utilities (`.glass`, `.glass-strong`, `.card-press`, etc.) in `@layer utilities`.
- **Component library**: Shared UI primitives live in a single file (`components/ui/shared.tsx`), not individual files per component.

## Mock data / services

All data flows through `services/player/playerService.ts` with simulated network delays (`setTimeout`). To swap in a real API, modify only the service functions — hooks and components are already agnostic. Refresh is currently `window.location.reload()` (full page reload).

## Unused dependencies

`react-hook-form`, `zod`, `@hookform/resolvers`, and `class-variance-authority` are installed but not yet used anywhere in the codebase.
