# Deployment Contract

Last updated: 2026-04-28
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

## Deployment Assumption Guardrails

- do not hardcode `http://localhost:5173` into production-facing portal content
- use `/study-app/` for production Study Room CTAs
- keep shared product wording in `site-identity.json` and shared locale dictionaries instead of duplicating text in both apps
- treat `api.yourdomain.com` as the placeholder host until the backend rollout phase chooses the final production domain
