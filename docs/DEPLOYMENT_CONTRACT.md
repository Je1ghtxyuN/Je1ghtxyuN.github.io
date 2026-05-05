# Deployment Contract

Last updated: 2026-04-29
Status: active integration and deployment routing contract

## Purpose

This document records how the portal, Study Room, and future backend are expected to deploy together without drifting in route assumptions.

## Product Outputs

### Blog Portal

- source: `apps/blog-portal/`
- runtime type: static Hexo site
- build output: `apps/blog-portal/public/`
- public role: main flagship portal at `/`

### Study Room

- source: `apps/study-room/`
- runtime type: static Vite SPA
- build output: `apps/study-room/dist/`
- public role: standalone interactive app at `/study-app/`

### Backend API

- source: `apps/backend-api/`
- runtime type: Node.js service
- deployment target: dedicated API host such as `api.yourdomain.com`
- current status: reserved contract, not yet production-integrated

## Intended Public Routing

Current stable routing contract:

- `/` -> blog portal static output
- `/study-room/` -> portal-owned informational landing page
- `/study-app/` -> Study Room SPA static output
- `api.yourdomain.com` -> backend API service

This means the portal can describe and link the Study Room while the actual app remains independently built and deployed.

## Why `Cannot GET /study-app/` Happens

That failure is not caused by the Vite build itself. It happens when the deployed origin only serves the portal output and does not also mount the Study Room static build at `/study-app/`.

There are two required deployment conditions:

- `apps/study-room/dist/` must actually be served at `/study-app/`
- the `/study-app/` origin mapping must return the Study Room `index.html` as SPA fallback for direct requests

If either piece is missing, direct navigation to `/study-app/` will return `Cannot GET /study-app/` or an equivalent 404 from the server.

## Reverse Proxy Mapping

Intended Cloudflare and origin behavior:

- Cloudflare handles DNS, TLS, caching, and proxying
- nginx or equivalent reverse proxy on Ubuntu maps public routes to the correct static root or upstream container

Suggested origin mapping:

```text
/            -> blog-portal/public
/study-app/  -> study-room/dist
api.*        -> backend-api service
```

Important operational note:

- the Study Room uses `BrowserRouter`, so `/study-app/` must serve SPA fallback to its `index.html` for nested client-side routes

## Local Development Routing

During local preview we intentionally do not point the Hexo portal at `/study-app/`, because the Hexo dev server does not also host the Vite app.

Current behavior:

- `apps/blog-portal` in `hexo server` mode links Study Room CTAs to `http://localhost:5173`
- `apps/blog-portal` in generated production output links Study Room CTAs to `/study-app/`
- `apps/study-room` Vite development stays at `http://localhost:5173`

This keeps the one-click user flow working during local development while preserving the production subpath contract.

## How To Test Locally

Recommended local preview:

1. run `npm run dev` in `apps/study-room`
2. run `npm run dev -- --port 4100` in `apps/blog-portal`
3. open `http://127.0.0.1:4100`
4. click a Study Room CTA from the homepage or navigation
5. confirm it opens the Vite app at `http://localhost:5173`

Recommended production-contract verification:

1. run `npm run build` in `apps/study-room`
2. confirm `apps/study-room/dist/index.html` uses `/study-app/` asset paths
3. run `npm run build` in `apps/blog-portal`
4. confirm generated portal CTA links point to `/study-app/` and do not contain `localhost:5173`

## Config Files That Control The Contract

Shared product contract:

- `packages/shared-config/site-identity.json`

Portal integration:

- `apps/blog-portal/scripts/portal-renderer.js`
- `apps/blog-portal/scripts/portal-data-sync.js`
- `apps/blog-portal/source/_data/site_profile.yml`
- `apps/blog-portal/source/_data/portfolio.yml`
- `apps/blog-portal/source/_data/navigation.yml`

Study Room integration:

- `apps/study-room/vite.config.js`
- `apps/study-room/src/i18n/config.js`

## Locale Contract

Shared UI locales are defined once and consumed by both apps.

Current supported locales:

- `en`
- `zh-CN`
- `zh-TW`
- `ja`

Shared locale assets live in:

- `packages/shared-assets/locales/site-ui/`

Portal translation behavior:

- client-side DOM translation for shared UI labels
- blog article bodies remain single-source in this phase

Study Room translation behavior:

- provider and hook-based UI translation inside the React app
- locale preference persists locally and also syncs to the shared `site-locale` storage key

Single shared locale rule:

- both apps use the same `localStorage` key: `site-locale`
- the portal writes that key when the user switches language
- the Study Room hydrates from that same key on boot and falls back to `en` when it is missing
- changing locale in either app is therefore reflected by the other app on refresh

## Deployment Assumption Guardrails

- do not hardcode `http://localhost:5173` into production-facing portal content
- use `/study-app/` for production Study Room CTAs
- keep shared product wording in `site-identity.json` and shared locale dictionaries instead of duplicating text in both apps
- treat `api.yourdomain.com` as the placeholder host until the backend rollout phase chooses the final production domain
