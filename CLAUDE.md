# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website platform (Je1ghtxyuN) mid-migration from a legacy React/Firebase SPA to a modular multi-app architecture. The target stack is: Hexo portal + standalone React SPA (Study Room) + self-hosted Node.js API backend + MySQL via Prisma. Firebase is transitional and planned for full removal.

## Project Decisions & Constraints

These are locked architectural decisions. Do not contradict them unless the user explicitly asks to change direction.

- **Visual reference**: `https://atritium.github.io` — the only approved design reference
- **Hexo theme**: `hexo-theme-butterfly` by `jerryc127` — fixed, not negotiable
- **Aesthetic**: elegant technical blog + personal portfolio + anime subtle atmosphere
- **Hosting**: Ubuntu + Docker self-hosting, Cloudflare as CDN/reverse-proxy
- **China mainland accessibility required** — avoid dependencies blocked or unstable in mainland
- **Firebase is transitional** — do not add new Firebase-dependent features
- **Auth strategy**: DB-backed sessions with HttpOnly cookies, no JWT, single-admin architecture
- **Database**: MySQL (self-hosted) via Prisma ORM. Browsers never connect to DB directly
- **Comment system**: self-hosted (MySQL), not third-party hosted
- **Contact form**: backend-owned, replacing Formspree

## Current Project Status (as of 2026-05-08)

- Phase 1 (Architecture Memory): done
- Phase 2 (Hexo Portal): core UI done, content populated, locale sync working
- Phase 3 (Study Room): immersive scene-first UI, Pomodoro engine, video scenes, ambient music all working
- Phase 4 (Backend): Hono server bootstrapped, Prisma + MySQL connected, auth foundation (login/session/logout) working
- Phase 5 (Integration): portal ↔ study-room integrated via sync script, local preview working at localhost:4000
- Phase 6 (Optimization): not started

## Detailed References (read on demand, not every session)

These files contain full history and detail. Read them only when the task requires deep context:

- `docs/AI_PROJECT_MEMORY/PROJECT_CONTEXT.md` — permanent project identity, migration principles, infrastructure constraints
- `docs/AI_PROJECT_MEMORY/MASTER_ARCHITECTURE.md` — final target architecture, data model, auth strategy, deployment topology
- `docs/AI_PROJECT_MEMORY/DEVELOPMENT_ROADMAP.md` — 6-phase execution roadmap with checklists
- `docs/AI_PROJECT_MEMORY/CODEX_WORKLOG.md` — append-only engineering session log
- `docs/DEPLOYMENT_CONTRACT.md` — routing contract for portal + study-room + backend
- `docs/CONTENT_MAP.md` — where content is stored and how it flows to the homepage

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

## Output Style

Every response should be educational: explain what was done, how it was done, and why. The user is learning while building. Do not just produce code — teach the reasoning behind decisions, trade-offs considered, and patterns used. Structure explanations clearly with brief context before technical details.

## Skill Auto-Invoke Rules

Project commands live in `.claude/commands/`. When the work context matches a skill's domain, invoke it proactively without waiting for the user to type `/project:command`. Do NOT invoke skills for trivial or unrelated tasks.

| Work Context | Auto-Invoke |
|---|---|
| Writing, editing, or reviewing blog posts, About page, project descriptions, any user-facing copy | `/project:humanizer` |
| Working on auth, API endpoints, session handling, input validation, CORS, cookies | `/project:security-insecure-defaults`, `/project:security-c-review` |
| Adding new npm dependencies or upgrading existing ones | `/project:deps-audit` |
| Preparing Docker configs, deployment scripts, or production builds | `/project:deploy-checklist`, `/project:docker-optimize` |
| Database schema changes (Prisma models, migrations) | `/project:db-migrate` |
| Creating or modifying API routes (Hono backend) | `/project:api-scaffold` |
| Writing or modifying React components, layouts, pages | `/project:ui-ux-design` |
| Working on Hexo portal pages, meta tags, SEO-related content | `/project:seo-seo-analysis`, `/project:seo-meta-tags-optimizer` |
| Writing tests (unit, integration, e2e) | `/project:tdd-red`, `/project:tdd-green` |
| Refactoring existing code | `/project:karpathy-guidelines`, `/project:security-code-maturity` |
| Reviewing a PR or large changeset | `/project:security-diff-review`, `/project:pr-enhance` |
| Debugging errors or unexpected behavior | `/project:error-analysis` |
| Before any commit touching backend API, auth, or data handling | `/project:security-insecure-defaults` (quick scan) |

When invoking a skill automatically, briefly note which skill you're using and why — e.g., "Running security-insecure-defaults scan on the new auth route."
