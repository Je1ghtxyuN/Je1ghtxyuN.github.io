# New Project Structure Proposal

Last updated: 2026-04-27
Status: documentation-only proposal, no scaffolding performed

## Purpose

This file proposes the final monorepo shape for the rebuilt platform.

It is a planning artifact only. No runtime projects, packages, or deployment assets are created by this document.

## 1. Proposed Final Monorepo Directory Tree

```text
.
├── apps/
│   ├── portal/
│   │   ├── _config.yml
│   │   ├── package.json
│   │   ├── scaffolds/
│   │   ├── scripts/
│   │   ├── source/
│   │   │   ├── _posts/
│   │   │   ├── about/
│   │   │   ├── works/
│   │   │   ├── gallery/
│   │   │   ├── study-room/
│   │   │   └── assets/
│   │   └── themes/
│   │       └── hexo-theme-butterfly/
│   ├── study-room/
│   │   ├── package.json
│   │   ├── public/
│   │   ├── src/
│   │   └── tests/
│   └── platform/
│       ├── package.json
│       ├── prisma/
│       │   ├── schema.prisma
│       │   ├── migrations/
│       │   └── seeds/
│       ├── src/
│       │   ├── modules/
│       │   │   ├── auth/
│       │   │   ├── admin/
│       │   │   ├── site-settings/
│       │   │   ├── portfolio/
│       │   │   ├── gallery/
│       │   │   ├── comments/
│       │   │   ├── contact/
│       │   │   ├── media/
│       │   │   └── study-room/
│       │   ├── http/
│       │   ├── middleware/
│       │   ├── services/
│       │   └── utils/
│       └── tests/
├── packages/
│   ├── shared-assets/
│   │   ├── images/
│   │   ├── audio/
│   │   └── manifests/
│   ├── shared-config/
│   │   ├── env/
│   │   ├── lint/
│   │   └── build/
│   ├── shared-i18n/
│   │   ├── en/
│   │   ├── zh-CN/
│   │   └── ja/
│   ├── shared-types/
│   └── shared-utils/
├── infra/
│   ├── docker/
│   ├── reverse-proxy/
│   ├── mysql/
│   ├── cloudflare/
│   └── backup/
├── scripts/
│   ├── migration/
│   ├── content/
│   └── deploy/
├── docs/
│   ├── AI_PROJECT_MEMORY/
│   └── architecture/
├── .github/
│   └── workflows/
├── package.json
├── workspace-config-file
└── README.md
```

Notes:

- `workspace-config-file` is intentionally generic at this stage and can later become `pnpm-workspace.yaml` or an equivalent workspace definition
- `apps/platform/` represents the combined backend/admin platform boundary even if some admin UI assets are later split internally
- `packages/` holds genuinely shared resources, not random leftovers from app code

## 2. Explanation Of Each Subproject Responsibility

### `apps/portal`

Responsibility:

- the main public website
- Hexo-powered blog and public pages
- Butterfly-based themed presentation layer
- portfolio, gallery, about/profile, and article publishing surfaces

Should not own:

- database writes
- admin trust boundary
- direct persistence for comments or contact forms

### `apps/study-room`

Responsibility:

- independent interactive study/focus application
- timers, ambience, media controls, room state, and future study-centric features
- a product surface with its own release rhythm and UI architecture

Should not own:

- public blog rendering
- site-wide admin content management
- direct database access

### `apps/platform`

Responsibility:

- admin/API platform service
- auth, sessions, roles, moderation, contact intake, asset metadata, and Study Room dynamic APIs
- Prisma-backed data access to MySQL

Should not own:

- primary long-form article rendering
- theme-driven public layout logic that belongs in Hexo

### `packages/shared-assets`

Responsibility:

- centralized source-of-truth storage for approved shared media
- asset manifests that map legacy source files to final consumption paths
- cross-project identity assets such as icons and profile imagery

### `packages/shared-config`

Responsibility:

- shared environment schema and conventions
- lint/build config shared across apps where it makes sense
- deployment configuration templates that should not live ad hoc inside one app

### `packages/shared-i18n`

Responsibility:

- normalized language resources
- shared common strings across portal, Study Room, and admin surfaces
- migration target for current `src/locales/*.json`

### `packages/shared-types`

Responsibility:

- cross-project DTOs, identifiers, and domain-level type contracts
- shared API payload structure definitions

### `packages/shared-utils`

Responsibility:

- framework-agnostic helpers that are safe to reuse across services and frontends

### `infra`

Responsibility:

- Docker build/deploy definitions
- reverse proxy config
- MySQL operational config
- Cloudflare environment notes
- backup and restore automation assets

### `scripts`

Responsibility:

- migration tooling
- content transformation utilities
- deployment automation helpers

### `docs/AI_PROJECT_MEMORY`

Responsibility:

- continuity memory for all future architecture and implementation sessions

## 3. Migration Map

### Old Assets That Should Migrate

Recommended migration target is the shared asset layer, with app-specific build pipelines consuming from it.

#### Identity And Core Site Images

- `public/images/profile.jpg` -> `packages/shared-assets/images/site/profile.jpg`
- `public/images/background.jpg` -> `packages/shared-assets/images/site/background.jpg`
- `public/images/icon.png` -> `packages/shared-assets/images/site/icon.png`

#### Portfolio And Gallery Media

- `public/images/works/*` -> `packages/shared-assets/images/works/`
- `public/images/gallery/*` -> `packages/shared-assets/images/gallery/`

Migration note:

- keep metadata about captions, project associations, and ordering outside raw filenames where possible

#### Audio Assets

- `public/music/*` -> candidate migration into `packages/shared-assets/audio/study-room/`

Important caveat:

- audio should be migrated only after confirming long-term usage intent, format suitability, and rights/licensing comfort for self-hosted production use

### Old Locale Files That Should Migrate

Current source:

- `src/locales/zh.json`
- `src/locales/en.json`
- `src/locales/ja.json`

Recommended migration target:

- `packages/shared-i18n/zh-CN/`
- `packages/shared-i18n/en/`
- `packages/shared-i18n/ja/`

Recommended transformation:

- split the current monolithic locale files into normalized namespaces such as:
  - `common`
  - `portal`
  - `study-room`
  - `admin`
  - `auth`

Migration note:

- the current locale files are valuable content seeds, but they should be normalized before long-term reuse

### Old Code That Is Deprecated

These files should be treated as legacy implementation, not as the future runtime foundation.

- `src/App.jsx`
  - deprecated as a monolithic app shell
  - use only as a source of content structure, interaction ideas, and feature inventory

- `src/firebase.js`
  - deprecated because Firebase is planned for full phase-out

- `src/dataService.js`
  - deprecated as a final runtime data layer
  - keep temporarily as a reference for Firestore collection structure and domain mapping

- `src/main.jsx`
  - deprecated with the retirement of the current Vite SPA shell

- `src/index.css` and `src/App.css`
  - deprecated as the future styling foundation

- `package.json` scripts tied to Vite + GitHub Pages deploy flow
  - deprecated for the future production model

- outdated repo docs such as the legacy `README.md` description
  - deprecated as architecture truth

### Legacy Code Worth Studying But Not Reusing Blindly

- `src/utils/dateFormatter.js`
  - useful logic reference, likely migratable after cleanup

- `src/contexts/AppContext.jsx`
  - useful state and preference ideas, not a direct architectural carryover

- `src/components/SettingsPanel.jsx`
  - useful UX reference for theme/language settings

- `src/ErrorBoundary.jsx`
  - reusable in concept, but should be reimplemented in the new app contexts

## 4. Deployment Relationship Explanation

The final deployment relationship should be:

- Cloudflare is the public edge layer
- Ubuntu Server is the origin host
- Docker services implement the portal, Study Room, platform backend, and MySQL
- reverse proxy routes requests from the edge-facing domain/subdomains to the correct internal containers

Recommended flow:

```text
Cloudflare
  -> reverse proxy on Ubuntu
    -> apps/portal build output service
    -> apps/study-room web service
    -> apps/platform backend/admin service
    -> internal-only MySQL service
```

Important relationship rules:

- MySQL is never publicly exposed
- the portal should be aggressively cacheable because it is mostly static
- the Study Room may have mixed caching needs depending on media and user state
- the platform backend must remain the only trusted writer to MySQL
- shared assets should be served with cache-friendly paths and versioning strategy

## 5. Data Relationship Explanation

### Source Of Truth Layers

The rebuilt platform should use three clearly separated data layers:

1. static content layer
   - blog markdown
   - page content
   - theme/layout content

2. structured relational data layer
   - MySQL accessed through Prisma
   - comments, contact messages, admin users, permissions, metadata, Study Room persisted state

3. shared asset layer
   - images, audio, and manifests that connect content and media

### Legacy Firestore To Future Data Mapping

Recommended conceptual mapping:

- legacy profile doc -> `site_profile` and related presentation config tables or content files
- legacy posts collection -> Hexo markdown content plus optional metadata tables if needed
- legacy comments subcollection -> `post_comments`
- legacy likes subcollection -> `post_reactions` or equivalent
- legacy works collection -> `portfolio_projects`
- legacy photos collection -> `gallery_items`
- legacy Formspree contact flow -> `contact_messages`

### Portal/Data Relationship

- the Hexo portal should primarily render from static content
- when dynamic data is needed, it should request it through the platform API
- the portal should never talk directly to MySQL

### Study Room/Data Relationship

- the Study Room should work locally for core interactions when possible
- persisted preferences, saved presets, or future account-linked study data should flow through the platform API

### Admin/Data Relationship

- admin is the operational writer for structured content and moderation state
- admin actions should update MySQL through Prisma-backed backend services
- any public-facing static rebuild trigger should happen intentionally, not through hidden browser-side writes

## Closing Principle

The new structure is designed to replace the legacy one-way dependency on a monolithic SPA. The future platform should have:

- a static-first portal
- an independently evolving interactive app
- a server-owned data and auth boundary
- shared assets and shared context managed deliberately
