# Codex Worklog

Last updated: 2026-04-27
Status: persistent append-only engineering progress journal

## Usage Rule

This file should be continuously appended in future Codex development sessions.

Do not overwrite prior session history unless a correction is required. New work should be recorded as a new dated session entry.

## Session 2026-04-27 — Repository Audit Understanding And Architecture Memory Initialization

### Repository Audit Understanding Summary

- the repository is currently a legacy React 19 + Vite SPA with browser-direct Firebase usage
- there is no real backend service, no API boundary, and no self-hosted data layer yet
- production assumptions are still shaped by static hosting and GitHub Pages-era workflow
- `src/App.jsx` is a monolithic application shell that mixes navigation, styling, auth, Firestore writes, and multiple feature domains
- admin capability is currently a UI convention tied to non-anonymous Firebase users, not a durable server-enforced role model
- blog comments and likes are partially handled outside the shared data service, which makes the current architecture inconsistent
- the repo contains reusable migration inputs such as static assets, locale files, and legacy data/domain structure knowledge
- project documentation outside the new audit was materially outdated and does not describe the true current architecture

### Architecture Memory Creation Log

- created `docs/AI_PROJECT_MEMORY/MASTER_ARCHITECTURE.md`
- created `docs/AI_PROJECT_MEMORY/PROJECT_CONTEXT.md`
- created `docs/AI_PROJECT_MEMORY/DEVELOPMENT_ROADMAP.md`
- initialized this persistent worklog file
- created `NEW_PROJECT_STRUCTURE_PROPOSAL.md`
- recorded the permanent rule that the old React/Firebase SPA is not the final architecture target
- established the long-term target split: Hexo portal, Study Room app, backend/admin platform, and shared assets/config
- recorded the self-hosted production direction: Ubuntu + Docker + Cloudflare + MySQL + Prisma

### Decisions Locked By This Session

- the rebuild is a long-term flagship platform effort, not a cosmetic refresh of the old SPA
- `hexo-theme-butterfly` is the fixed theme anchor for the public portal direction
- Firebase is transitional and should be fully phased out over time
- the Study Room must remain an independent sub-application in the final platform design
- documentation continuity is now part of the architecture process

### Follow-Up Items For Future Sessions

- decide the exact monorepo workspace tooling when implementation begins
- define the first Prisma schema based on legacy Firestore collections and final product needs
- decide the backend framework for the admin/API platform service
- audit music/media usage rights before long-term migration into the shared asset system
- plan the first concrete implementation session for Phase 2 or Phase 4, depending on project priority

## Future Session Template

Copy this template and append a new entry for each future session.

### Session YYYY-MM-DD — Title

- objectives:
- actions taken:
- files changed:
- decisions made:
- risks or blockers:
- next recommended step:

## Future Session Entries

Append new dated sessions below this line.

### Session 2026-04-27 — Monorepo Skeleton And Legacy Freeze Preparation

- objectives:
  - create the first real monorepo skeleton for the rebuild
  - preserve the existing React/Vite/Firebase app as frozen reference material
  - begin shared asset migration preparation
  - initialize the three new long-term subprojects without implementing business pages
- actions taken:
  - created top-level monorepo directories under `apps/`, `packages/`, and `legacy_archive/`
  - copied the current `src/` tree into `legacy_archive/legacy_react_spa_src_reference/`
  - copied important legacy-facing docs into `legacy_archive/legacy_docs_reference/`
  - created `packages/shared-assets/images/`, `packages/shared-assets/music/`, and `packages/shared-assets/locales/`
  - copied legacy `public/images/*`, `public/music/*`, and `src/locales/*` into the shared asset layer
  - initialized `apps/blog-portal/` as a Hexo scaffold and added `BLOG_PORTAL_SETUP_NOTES.md`
  - initialized `apps/study-room/` as a React + Vite scaffold and added `STUDY_ROOM_ARCHITECTURE_NOTES.md`
  - initialized `apps/backend-api/` as a framework-neutral Node.js scaffold prepared for Prisma/MySQL/auth/site-config/study-data expansion
  - added placeholder feature/module directories so the new app boundaries are present without feature implementation
- files changed:
  - new scaffold files under `apps/blog-portal/`
  - new scaffold files under `apps/study-room/`
  - new scaffold files under `apps/backend-api/`
  - new shared asset copies under `packages/shared-assets/`
  - new reference copies under `legacy_archive/`
  - updated `docs/AI_PROJECT_MEMORY/CODEX_WORKLOG.md`
- decisions made:
  - the legacy application remains in place and is not yet deleted or refactored
  - the backend scaffold remains framework-neutral for now because the exact server framework is still an open architecture decision
  - shared assets are being migrated by copy-first strategy so legacy runtime paths remain intact
- risks or blockers:
  - the new portal scaffold was prepared for future Giscus comments and Formspree contact integration per current task wording, which does not fully align with the earlier architecture memory that preferred self-hosted comments/contact ownership
  - this should be resolved explicitly before production implementation of comments or contact flows
- next recommended step:
  - choose the next execution lane explicitly:
    - deepen `apps/blog-portal/` into a Butterfly-based portal skeleton
    - formalize `apps/backend-api/` framework choice and Prisma baseline
    - normalize shared assets/locales and define migration manifests

### Session 2026-04-27 — Phase 2 Portal First Implementation Pass

- objectives:
  - install and activate Butterfly in the Hexo portal
  - prepare branded portal structure without doing final visual polish
  - create CMS-friendly content data files and placeholder custom pages
  - wire shared legacy assets into the portal without duplicating files
- actions taken:
  - installed `hexo-theme-butterfly`, `hexo-renderer-pug`, and `hexo-generator-searchdb` in `apps/blog-portal/`
  - switched Hexo root config to `theme: butterfly`
  - split Butterfly-specific configuration into `_config.butterfly.yml`
  - removed the default `hello-world` demo post and replaced the posts directory with a keep-file
  - added `site_profile.yml`, `portfolio.yml`, and `navigation.yml` under `source/_data/`
  - created portal placeholder pages for home, archives, about, contact, portfolio, and Study Room
  - added categories and tags page stubs to support Butterfly taxonomy pages
  - mounted shared assets through `source/shared-assets -> ../../../packages/shared-assets`
  - documented content editing locations in `CONTENT_EDITING_GUIDE.md`
- files changed:
  - updated Hexo root config and package manifest under `apps/blog-portal/`
  - added `_config.butterfly.yml`
  - added multiple new markdown and YAML content files under `apps/blog-portal/source/`
  - updated `apps/blog-portal/BLOG_PORTAL_SETUP_NOTES.md`
  - updated `docs/AI_PROJECT_MEMORY/CODEX_WORKLOG.md`
- decisions made:
  - Butterfly settings are now isolated from Hexo core settings for cleaner long-term maintenance
  - local search is enabled via `hexo-generator-searchdb`
  - comments remain disabled for now, but the future Giscus configuration slot is reserved
  - shared assets are consumed through a symlinked source mount rather than file duplication
- risks or blockers:
  - the portal still carries an unresolved architectural tension between future Giscus/Formspree placeholders and the broader self-hosted long-term direction
  - live navigation is currently mirrored manually between `source/_data/navigation.yml` and `_config.butterfly.yml`
  - final public domain and production URL strategy for Hexo may still change later
- next recommended step:
  - start the next portal pass by shaping the homepage and page templates around `site_profile.yml` and `portfolio.yml`, then decide whether navigation/data should become custom-template-driven instead of manually mirrored

### Session 2026-04-27 — Phase 2 Portal Core UI Customization

- objectives:
  - replace placeholder portal pages with real data-driven layouts
  - build the first branded homepage structure inspired by the approved visual reference direction
  - bind profile, navigation, and portfolio YAML data into the UI instead of hardcoding page copy
- actions taken:
  - expanded `site_profile.yml` with homepage, about, Study Room, and footer-oriented content structure
  - expanded `portfolio.yml` with homepage preview metadata
  - expanded `navigation.yml` with homepage shortcut data
  - created `scripts/portal-data-sync.js` so YAML data now also feeds Butterfly menu, social links, avatar, favicon, and default top-image settings
  - created `scripts/portal-tags.js` to render the homepage, about page, portfolio page, and Study Room landing page from YAML data and `site.posts`
  - replaced placeholder markdown page bodies with lightweight page shells that call the custom portal tags
  - added a custom portal stylesheet
  - updated portal documentation to explain template structure and content-editing locations
  - verified the final tag-based implementation with a clean `hexo generate` run
- files changed:
  - updated portal YAML data files under `source/_data/`
  - added data-driven Hexo tag rendering under `scripts/`
  - updated the portal page shell files under `source/`
  - added `source/css/portal-custom.css`
  - updated `BLOG_PORTAL_SETUP_NOTES.md`, `CONTENT_EDITING_GUIDE.md`, and `CODEX_WORKLOG.md`
- decisions made:
  - major branded portal pages now use normal Butterfly page shells plus custom Hexo tags instead of source-level Pug templates
  - homepage shortcuts are sourced from navigation data instead of fixed template text
  - the Butterfly shell now consumes project YAML data through a sync script to reduce duplication
  - recent posts are rendered from `site.posts`, with an empty-state fallback until real articles exist
- risks or blockers:
  - the homepage recent-post section cannot demonstrate full visual density until the first real posts exist
  - navigation now has a stronger data-driven story, but theme-shell synchronization still depends on Butterfly internals and should be tested again after later theme upgrades
  - the first source-level Pug attempt failed because source rendering did not reliably expose `site.data`; the tag-based solution replaced it
  - the Study Room CTA still points at a placeholder route because the standalone app is not integrated yet
- next recommended step:
  - create the first real blog posts and then begin the next portal pass focused on homepage refinement, archive polish, and optionally custom contact-page rendering from structured data

### Session YYYY-MM-DD — Pending

- objectives:
- actions taken:
- files changed:
- decisions made:
- risks or blockers:
- next recommended step:

### Session 2026-04-27 — Portal Content Initialization And Realism Pass

- objectives:
  - populate the portal with real starter content so the homepage and portfolio sections become meaningful
  - replace empty recent-post states with actual articles
  - improve the profile and contact content without changing the existing layout structure
- actions taken:
  - created three real blog posts under `apps/blog-portal/source/_posts/`
  - updated `site_profile.yml` with stronger intro copy, clearer subtitle, more realistic social placeholders, and better contact metadata
  - replaced seed portfolio placeholders with current project-track entries in `portfolio.yml`
  - rewrote the contact page into a cleaner structured contact surface with a Formspree-ready form layout
  - expanded `CONTENT_EDITING_GUIDE.md` so post writing and data flow are clearer for future editing sessions
  - moved the default generated post index to `/blog/` so the branded root route can remain the homepage
  - verified with a clean Hexo build that the homepage now renders real posts and portfolio cards instead of fallback empty states
- files changed:
  - added three markdown posts under `apps/blog-portal/source/_posts/`
  - updated `apps/blog-portal/source/_data/site_profile.yml`
  - updated `apps/blog-portal/source/_data/portfolio.yml`
  - updated `apps/blog-portal/source/_data/navigation.yml`
  - updated `apps/blog-portal/source/contact/index.md`
  - updated `apps/blog-portal/_config.yml`
  - updated `apps/blog-portal/CONTENT_EDITING_GUIDE.md`
  - updated `docs/AI_PROJECT_MEMORY/CODEX_WORKLOG.md`
- decisions made:
  - content population continues to use the existing data-driven Hexo setup instead of introducing new layout mechanisms
  - portfolio entries are now framed around real current project tracks rather than abstract placeholders
  - the contact page remains Formspree-ready for now, but the longer-term backend-owned contact flow remains the strategic direction
- risks or blockers:
  - the Formspree endpoint is still a placeholder and cannot be considered production-ready
  - social handles were upgraded to more realistic placeholders but still need final owner confirmation before launch
- next recommended step:
  - continue the portal pass by refining the about, contact, and portfolio content depth, then move into the first implementation work for the standalone Study Room application
