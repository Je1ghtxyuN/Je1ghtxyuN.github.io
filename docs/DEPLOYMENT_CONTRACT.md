# Deployment Contract

Last updated: 2026-05-16
Status: active integration and deployment routing contract

## Purpose

This document records the portal's deployment contract. The Study Room (study-app) has been separated into its own independent repository and deploys to `study.je1ght.top` — it is no longer part of this contract.

## Product Outputs

### Blog Portal

- source: `apps/blog-portal/`
- runtime type: static Hexo site
- build output: `apps/blog-portal/public/`
- public role: main flagship portal at `/`

### Backend API

- source: `apps/backend-api/`
- runtime type: Node.js service
- deployment target: dedicated API host such as `api.yourdomain.com`
- current status: reserved contract, not yet production-integrated

## Intended Public Routing

Current stable routing contract:

- `/` -> blog portal static output (je1ght.top)
- `study.je1ght.top` -> independent study-app (separate repo, separate stack)

The Study Room is fully decoupled — the portal no longer hosts or proxies it.

## Reverse Proxy Mapping

Cloudflare and origin behavior:

- Cloudflare handles DNS, TLS, caching, and proxying for `je1ght.top`
- nginx reverse proxy on Ubuntu serves the portal static output and backend API

Origin mapping:

```text
je1ght.top/            -> blog-portal/public (via portal-nginx)
je1ght.top/api/*       -> backend-api service
```

## Config Files That Control The Contract

- `packages/shared-config/site-identity.json`
- `apps/blog-portal/scripts/portal-renderer.js`
- `apps/blog-portal/scripts/portal-data-sync.js`

## Deployment Assumption Guardrails

- keep shared product wording in `site-identity.json` and shared locale dictionaries instead of duplicating text
- the study-app is fully independent — do not reintroduce cross-repo sync dependencies
