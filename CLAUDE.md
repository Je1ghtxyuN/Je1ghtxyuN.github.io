# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal website platform (Je1ghtxyuN) — Hexo-based public portal with self-hosted Node.js API backend and MySQL. The Study Room (study-app) has been separated into its own independent repository at `study.je1ght.top`. Firebase is transitional and planned for full removal.

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

## Current Project Status (as of 2026-05-16)

- Phase 1 (Architecture Memory): done
- Phase 2 (Hexo Portal): core UI done, content populated, locale sync working
- Phase 3 (Study Room): **completed and separated** — now independent repo at `study.je1ght.top`
- Phase 4 (Backend): Hono server bootstrapped, Prisma + MySQL connected, auth working (portal-only routes)
- Phase 5 (Integration): portal deployed at `je1ght.top`, study-app deployed at `study.je1ght.top`
- Phase 6 (Optimization): not started

## Detailed References (read on demand, not every session)

These files contain full history and detail. Read them only when the task requires deep context:

- `docs/AI_PROJECT_MEMORY/PROJECT_CONTEXT.md` — permanent project identity, migration principles, infrastructure constraints
- `docs/AI_PROJECT_MEMORY/MASTER_ARCHITECTURE.md` — final target architecture, data model, auth strategy, deployment topology
- `docs/AI_PROJECT_MEMORY/DEVELOPMENT_ROADMAP.md` — 6-phase execution roadmap with checklists
- `docs/AI_PROJECT_MEMORY/CODEX_WORKLOG.md` — append-only engineering session log
- `docs/DEPLOYMENT_CONTRACT.md` — routing contract for portal + backend
- `docs/CONTENT_MAP.md` — where content is stored and how it flows to the homepage

## Repository Structure

This is a **manual monorepo** (no workspace tooling — each app has its own `node_modules`).

- `apps/blog-portal/` — Hexo 7 static site with Butterfly theme (the public portal at `/`)
- `apps/backend-api/` — Hono API server with Prisma ORM (portal backend, admin, comments, contact)
- `packages/shared-config/site-identity.json` — single source of truth for brand, routes, and i18n locale list
- `src/` — legacy React SPA (frozen reference, not the active development target)
- `docs/AI_PROJECT_MEMORY/` — architecture decisions, roadmap, and persistent engineering worklog

**Note:** The Study Room (study-app) was separated into its own repository on 2026-05-16. It lives at `/Users/je1ghtxyun/code/personal-website/study-app/` and deploys independently to `study.je1ght.top`.

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

### Backend API (`apps/backend-api/`)
```
npm run dev          # Hono server with --watch (port 3001)
npm start            # Hono server (port 3001)
npm run prisma:generate    # prisma generate (not yet installed)
npm run prisma:migrate:dev # prisma migrate dev (not yet installed)
npm run prisma:studio      # prisma studio GUI (not yet installed)
```

## Architecture: How The Apps Connect

**Routing contract** (defined in `docs/DEPLOYMENT_CONTRACT.md`):
- `/` → blog portal static output
- `je1ght.top` → portal (Hexo)
- `study.je1ght.top` → study-app (independent React + Hono + MySQL stack)

**Shared config**: The portal consumes `packages/shared-config/site-identity.json` for brand identity, route paths, and i18n locale definitions.

## Key Integration Points

- `apps/blog-portal/scripts/portal-renderer.js` — generates portal HTML pages
- `apps/blog-portal/scripts/portal-data-sync.js` — syncs data for portal generation

## Deployment Sync Rule (CRITICAL)

When any change touches the server-side build pipeline, you MUST update ALL THREE in sync:

| Component | File | Purpose |
|-----------|------|---------|
| Admin Rebuild button | `apps/backend-api/src/services/rebuild.js` | What happens when user clicks "Rebuild Portal" in Admin UI |
| Deploy script | `scripts/deploy.sh` | What `bash scripts/deploy.sh` does locally |
| Server state | `ssh je1ght-server` docker containers | What's actually running in production |

**Common failure points:**
- Hexo CLI vs programmatic build — must work both locally AND inside Docker
- `portal-home-generator.js` must be DISABLED on server (`source/index.md` + tag handles homepage)
- `hexo clean` deletes `public/` which breaks Docker bind mount — NEVER use it in rebuild service
- After `hexo generate` inside Docker, must chown files + restart nginx to refresh bind mount
- New dependencies (like `hexo-renderer-marked`) must be added to `package.json` so `npm install` picks them up
- Docker build context is `./backend-api` (relative to `~/docker/je1ght-platform/`)

## Conventions

- ESLint 9 flat config with `react-hooks` and `react-refresh` plugins (separate configs per app)
- ES modules throughout (`"type": "module"` in package.json)
- Each app is independently deployable — do not create cross-app runtime dependencies
- Keep shared product wording in `site-identity.json` and shared locale dictionaries, not duplicated in both apps
- Never hardcode `http://localhost:5173` in production-facing portal content
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

## Superpowers Workflow (REQUIRED)

The superpowers plugin provides process-enforcing skills. These are **mandatory** for non-trivial tasks — do not skip them.

| Phase | Skill | When To Use |
|-------|-------|-------------|
| Before creative work | `superpowers:brainstorming` | Creating features, building components, designing UI — anything that requires exploring ideas before coding |
| Before implementation | `superpowers:writing-plans` | Multi-step tasks that need a written plan before touching code |
| During implementation | `superpowers:test-driven-development` | Implementing any feature or bugfix — write failing tests first |
| When stuck | `superpowers:systematic-debugging` | Any bug, test failure, or unexpected behavior — before proposing a fix |
| Before claiming done | `superpowers:verification-before-completion` | Before saying "it works", "fixed", or "passing" — verify with actual evidence |

**Execution order for typical feature work:**
1. `brainstorming` → explore the problem space and possible approaches
2. `writing-plans` → produce a concrete implementation plan
3. `tdd-red` → write failing tests that define the expected behavior
4. Implementation code
5. `tdd-green` → make tests pass with minimal code
6. `verification-before-completion` → confirm everything actually works

Do NOT rationalize skipping these skills. Even if a task feels simple, invoke the relevant skill — it will determine whether its full workflow is needed or can be abbreviated.
