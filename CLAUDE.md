# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website platform (Je1ghtxyuN) mid-migration from a legacy React/Firebase SPA to a modular multi-app architecture. The target stack is: Hexo portal + standalone React SPA (Study Room) + self-hosted Node.js API backend + MySQL via Prisma. Firebase is transitional and planned for full removal.

## Repository Structure

This is a **manual monorepo** (no workspace tooling — each app has its own `node_modules`).

- `apps/blog-portal/` — Hexo 7 static site with Butterfly theme (the public portal at `/`)
- `apps/study-room/` — React 19 + Vite 8 SPA (immersive focus app at `/study-app/`)
- `apps/backend-api/` — Hono API server with Prisma ORM (MySQL target, not yet production-integrated)
- `packages/shared-config/site-identity.json` — single source of truth for brand, routes, and i18n locale list
- `packages/shared-assets/` — shared images, music, videos, locales, sound effects
- `src/` — legacy React SPA (frozen reference, not the active development target)
- `docs/AI_PROJECT_MEMORY/` — architecture decisions, roadmap, and persistent engineering worklog

## Commands

### Root (legacy SPA)
```
npm run dev          # Vite dev server on port 5173
npm run build        # Production build with Terser (drops console/debugger)
npm run lint         # ESLint flat config
npm run deploy       # Build then deploy via gh-pages
```

### Blog Portal (`apps/blog-portal/`)
```
npm run dev          # hexo server (local dev)
npm run build        # hexo generate
npm run clean        # hexo clean
npm run deploy       # hexo deploy
```

### Study Room (`apps/study-room/`)
```
npm run dev          # Vite dev server
npm run build        # Vite production build
npm run lint         # ESLint flat config
npm run preview      # Preview production build
```

### Backend API (`apps/backend-api/`)
```
npm run dev          # Hono server with --watch (port 3001)
npm start            # Hono server (port 3001)
npm run prisma:generate    # prisma generate (not yet installed)
npm run prisma:migrate:dev # prisma migrate dev (not yet installed)
npm run prisma:studio      # prisma studio GUI (not yet installed)
```

### Cross-app sync
```
bash scripts/sync-study-app.sh   # Builds study-room, copies dist/ into blog-portal/source/study-app/
```

## Architecture: How The Apps Connect

**Routing contract** (defined in `docs/DEPLOYMENT_CONTRACT.md`):
- `/` → blog portal static output
- `/study-room/` → portal-owned informational landing page
- `/study-app/` → Study Room SPA static output
- `api.yourdomain.com` → backend API (placeholder, not yet deployed)

**Local dev routing**: Study Room CTAs always link to `/study-app/` in all modes (dev and production). The Hexo dev server does NOT host the Vite app — during local dev, `/study-app/` resolves from `blog-portal/source/study-app/` (synced via `scripts/sync-study-app.sh`). The Vite dev server at `localhost:5173` is only for standalone Study Room component development.

**Shared config**: Both apps consume `packages/shared-config/site-identity.json` for brand identity, route paths, and i18n locale definitions. The blog portal also uses it via its portal scripts; the study-room imports it directly in its Vite config.

**Shared i18n**: Both apps share the same `localStorage` key (`site-locale`) for locale preference. Locale files live in `packages/shared-assets/locales/site-ui/`. Supported: `en`, `zh-CN`, `zh-TW`, `ja`.

**Asset symlink**: `apps/blog-portal/source/shared-assets` is a symlink to `packages/shared-assets`.

## Key Integration Points

- `apps/blog-portal/scripts/portal-renderer.js` — generates portal HTML pages, controls Study Room CTA URLs
- `apps/blog-portal/scripts/portal-data-sync.js` — syncs data for portal generation
- `apps/study-room/vite.config.js` — sets dynamic `base` path from shared-config, controls build output paths
- `apps/study-room/src/i18n/config.js` — i18n provider that reads from shared locale files

## Conventions

- ESLint 9 flat config with `react-hooks` and `react-refresh` plugins (separate configs per app)
- ES modules throughout (`"type": "module"` in package.json)
- Each app is independently deployable — do not create cross-app runtime dependencies
- Keep shared product wording in `site-identity.json` and shared locale dictionaries, not duplicated in both apps
- Never hardcode `http://localhost:5173` in production-facing portal content
- The Study Room uses `BrowserRouter` — its hosting must serve `index.html` as SPA fallback for nested routes
- The engineering worklog at `docs/AI_PROJECT_MEMORY/CODEX_WORKLOG.md` is append-only — new sessions are appended, not overwritten
