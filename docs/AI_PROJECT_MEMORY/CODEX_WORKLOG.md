# Codex Worklog

Last updated: 2026-05-05
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

### Session 2026-04-28 — Portal Homepage Stabilization And Study Room Integration Prep

- objectives:
  - stabilize homepage content selection so recent posts render deterministically
  - centralize homepage preview limits in code instead of YAML
  - prepare the Study Room entry flow for environment-aware app links
  - document homepage data flow for future editing and CMS preparation
- actions taken:
  - completed the shared portal renderer split so homepage, about, portfolio, and Study Room rendering now flow through `apps/blog-portal/scripts/portal-renderer.js`
  - kept the homepage on a generator-backed root route through `apps/blog-portal/scripts/portal-home-generator.js`
  - updated the recent-post logic to normalize the post collection, sort explicitly by date descending, apply a stable tie-breaker, and then trim to the configured homepage limit
  - centralized homepage configuration in `PORTAL_CONFIG`, including recent-post count, portfolio-preview count, fallback text, fallback image paths, and Study Room dev/prod URLs
  - removed stale content-level limit fields from `site_profile.yml` and `portfolio.yml` so editing data files no longer changes homepage structural behavior implicitly
  - updated the Study Room landing page metadata and integration notes for the future standalone app handoff
  - documented the homepage rendering flow and content map in portal docs
  - added `docs/CONTENT_MAP.md` to explain where content is stored and how it reaches the homepage
- files changed:
  - updated `apps/blog-portal/scripts/portal-renderer.js`
  - updated `apps/blog-portal/source/study-room/index.md`
  - updated `apps/blog-portal/source/_data/site_profile.yml`
  - updated `apps/blog-portal/source/_data/portfolio.yml`
  - updated `apps/blog-portal/BLOG_PORTAL_SETUP_NOTES.md`
  - updated `apps/blog-portal/CONTENT_EDITING_GUIDE.md`
  - deleted `apps/blog-portal/source/index.md`
  - added `docs/CONTENT_MAP.md`
  - updated `docs/AI_PROJECT_MEMORY/CODEX_WORKLOG.md`
- decisions made:
  - the root homepage is now generator-owned and should not return to source-page tag rendering
  - homepage preview counts are configuration constants in code, not editable YAML content
  - Study Room CTA routing is environment-aware: local server sessions target the Vite app and generated builds target the production placeholder path
- risks or blockers:
  - the Study Room production mount path `/study-app/` is still a placeholder and must be finalized during real app integration
  - the current environment split is intentionally simple and may later need a more formal deploy-time variable strategy
- next recommended step:
  - verify generated output in `apps/blog-portal/public/`, then begin the first true Study Room app implementation pass while keeping the portal CTA contract stable

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

### Session 2026-04-28 — Study Room Foundation Architecture First Pass

- objectives:
  - replace the Vite starter UI with a real Study Room application shell
  - define modular feature boundaries for timer, todo, ambient music, auth, and study statistics
  - implement the first shared state model and the timer core without overbuilding the UI
  - keep the Study Room route contract aligned with the portal handoff decision
- actions taken:
  - installed `react-router-dom` and introduced a route shell with a study page and a placeholder settings page
  - configured Vite to keep development on `/` and production builds on `/study-app/`
  - created a reducer-driven global state layer under `apps/study-room/src/state/`
  - implemented timer actions for start, pause, reset, session switching, duration updates, and reducer-driven ticking based on timestamps
  - created separate feature entry points under `src/features/` for timer, todo, ambient music, auth, and study statistics
  - added a local audio controller with play, pause, track switching, and volume support using silent placeholder tracks
  - replaced the Vite starter content with a lightweight app shell that exercises the new architecture without attempting final visual design
  - updated `STUDY_ROOM_ARCHITECTURE_NOTES.md`
  - verified the app with successful `npm run lint` and `npm run build`
- files changed:
  - updated `apps/study-room/package.json`
  - added `apps/study-room/package-lock.json`
  - updated `apps/study-room/vite.config.js`
  - replaced the starter app files under `apps/study-room/src/`
  - added route, state, and feature modules under `apps/study-room/src/app/`, `src/state/`, and `src/features/`
  - updated `apps/study-room/STUDY_ROOM_ARCHITECTURE_NOTES.md`
  - updated `docs/AI_PROJECT_MEMORY/CODEX_WORKLOG.md`
- decisions made:
  - the timer is the first reducer-owned runtime feature and acts as the central session model
  - preferences are shared state now so future backend sync has a stable insertion point
  - the production base path remains `/study-app/`, matching the current portal CTA contract
  - ambient music remains local-first for now and does not depend on any external API
- risks or blockers:
  - the current audio catalog is intentionally placeholder-only and should be replaced only after media policy and asset packaging are decided
  - BrowserRouter on `/study-app/` assumes the eventual production service will serve SPA fallback for nested routes such as `/study-app/settings`
- next recommended step:
  - begin the next Study Room pass by deepening the timer/session UX and deciding whether local persistence should be added before backend APIs exist

### Session 2026-04-28 — Study Room Ambience Intelligence Pass

- objectives:
  - add session-aware atmosphere reactivity without changing the existing Pomodoro engine or scene-first layout philosophy
  - introduce cinematic automatic-transition cues tied only to natural countdown completion
  - refine timer presentation behavior across the three persisted display modes
- actions taken:
  - expanded `src/lib/studyScene.js` so each scene now carries `reactiveAtmosphere` data for `work`, `shortBreak`, and `longBreak`
  - added `resolveStudyScenePresentation()` to compute final background overlay, glow, vignette, motion, and media-filter values from the selected scene plus the current session/mode
  - updated `AppShell.jsx` and `BackgroundLayer.jsx` so root-level scene rendering now reacts to `selectedSceneId`, `sessionType`, and focus/idle mode without changing the underlying video assets
  - added `src/app/SessionTransitionCue.jsx` for short cinematic rollover copy such as `Focus Complete`, `Short Break`, and `Back To Focus`
  - kept the bell logic unchanged so sound still fires only on automatic reducer rollover
  - added `src/features/timer/sessionPresentation.js` to centralize timer tone, hint, and auto-transition copy
  - refined `TimerPanel.jsx` and `App.css` so `center_focus`, `minimal_overlay`, and `corner_embed` each respond more gracefully to focus/idle state and current session type
  - verified the Study Room app with successful `npm run lint` and `npm run build`
- files changed:
  - updated `apps/study-room/src/lib/studyScene.js`
  - updated `apps/study-room/src/components/BackgroundLayer.jsx`
  - updated `apps/study-room/src/app/AppShell.jsx`
  - added `apps/study-room/src/app/SessionTransitionCue.jsx`
  - updated `apps/study-room/src/features/timer/TimerPanel.jsx`
  - added `apps/study-room/src/features/timer/sessionPresentation.js`
  - updated `apps/study-room/src/App.css`
  - updated `apps/study-room/STUDY_ROOM_ARCHITECTURE_NOTES.md`
  - updated `docs/AI_PROJECT_MEMORY/CODEX_WORKLOG.md`
- decisions made:
  - session-aware ambience belongs in the scene layer, not inside timer logic or unrelated panel components
  - automatic transition cues remain a separate shell-level overlay and are intentionally driven only by `lastAutoTransition`
  - timer display mode continues to affect only presentation, but now also receives session-aware opacity and metadata refinement
- risks or blockers:
  - build output is now functionally correct, but the local loop videos remain very large and will still need compression/streaming strategy before production deployment
  - scene reactivity is ready for smarter assets, but the current visual ceiling is still limited by the available local loop videos
- next recommended step:
  - begin a media-optimization and scene-asset quality pass, then consider optional scene-aware audio or completion-transition ambience so the emotional feedback layer grows without bloating the UI

### Session 2026-04-28 — Study Room Immersive UI Foundation Pass

- objectives:
  - move the Study Room from stacked panel UI toward an immersive floating layout
  - introduce a reusable fixed background system and a zone-based placement model
  - convert the timer, music, and todo modules into compact floating widgets without changing their core logic
- actions taken:
  - added `BackgroundLayer` and a simple scene config so the app now renders a fixed full-screen background with overlay treatment
  - introduced `StudyLayout` with explicit top-left, top-right, center, bottom-left, and bottom-right zones
  - moved app chrome and navigation into a lightweight floating widget instead of a large header panel
  - refactored the study route to place widgets in floating zones rather than a stacked card grid
  - converted the timer into a compact center widget and moved duration controls into a separate timer settings widget
  - converted the music controller and todo list into smaller floating widgets
  - updated the settings route to reuse the same floating layout system
  - rewrote the Study Room CSS around fixed background, glass-like widgets, and responsive zone collapse
  - updated `STUDY_ROOM_ARCHITECTURE_NOTES.md`
  - verified the Study Room app with successful lint and build runs
- files changed:
  - added `apps/study-room/src/components/BackgroundLayer.jsx`
  - added `apps/study-room/src/lib/studyScene.js`
  - added `apps/study-room/src/layouts/StudyLayout.jsx`
  - added `apps/study-room/src/app/StudyChromeWidget.jsx`
  - updated `apps/study-room/src/app/AppShell.jsx`
  - updated study and settings route files under `apps/study-room/src/app/pages/`
  - updated timer, music, todo, statistics, and auth feature UI files
  - added `apps/study-room/src/features/timer/TimerSettingsWidget.jsx`
  - replaced `apps/study-room/src/App.css`
  - updated `apps/study-room/STUDY_ROOM_ARCHITECTURE_NOTES.md`
  - updated `docs/AI_PROJECT_MEMORY/CODEX_WORKLOG.md`
- decisions made:
  - the background system lives only at the app-shell layer and should not be embedded into feature widgets
  - the floating zone layout is now the structural basis for immersive UI work
  - duration editing moved out of the center timer so the main study view can stay visually lighter
- risks or blockers:
  - the current background scene still uses a local placeholder image and should be replaced once final study background assets are chosen
  - the floating layout is desktop-first and intentionally conservative on smaller screens; more nuanced mobile behavior can be refined later
- next recommended step:
  - continue by deepening the center timer experience and ambient scene controls before starting any final visual polish pass

### Session 2026-04-28 — Study Room Interaction Model Upgrade

- objectives:
  - introduce a mode-based interaction model without replacing the existing timer architecture
  - make the timer the primary entry point and move secondary tools into overlays
  - simplify layout usage so the center interaction space becomes dominant
- actions taken:
  - extended reducer state with a `ui` domain for `idle`, `focus`, and `panel` modes
  - added panel open/close actions while preserving the existing timer reducer and engine logic
  - refactored the main Study Room page so idle mode shows a small timer entry and focus mode shows a larger immersive timer
  - added a reusable panel overlay system for todo, music, statistics, and settings
  - simplified StudyLayout usage to emphasize top-left chrome plus the center interaction space
  - updated the app shell so the background layer responds to focus and panel modes
  - redirected the old `/settings` route back to the root interaction surface because settings now live inside panel mode
  - updated Study Room interaction documentation
- files changed:
  - updated `apps/study-room/src/state/studyRoomReducer.js`
  - updated `apps/study-room/src/state/useStudyRoom.js`
  - added `apps/study-room/src/app/PanelOverlay.jsx`
  - added `apps/study-room/src/app/panels/SettingsPanelContent.jsx`
  - updated `apps/study-room/src/app/AppRouter.jsx`
  - updated `apps/study-room/src/app/AppShell.jsx`
  - updated `apps/study-room/src/app/StudyChromeWidget.jsx`
  - updated `apps/study-room/src/app/pages/StudyPage.jsx`
  - updated `apps/study-room/src/layouts/StudyLayout.jsx`
  - updated `apps/study-room/src/features/timer/TimerPanel.jsx`
  - replaced `apps/study-room/src/App.css`
  - updated `apps/study-room/STUDY_ROOM_ARCHITECTURE_NOTES.md`
  - updated `docs/AI_PROJECT_MEMORY/CODEX_WORKLOG.md`
- decisions made:
  - the timer remains the only always-visible primary interaction surface
  - secondary tools now belong to panel mode instead of permanent layout zones
  - focus mode enhances immersion mainly through timer scale and scene dimming rather than heavy visual effects
- risks or blockers:
  - the panel system currently assumes one panel at a time and does not yet preserve deeper sub-state such as per-panel tabs
  - the `/settings` path is now a compatibility redirect rather than an independent page
- next recommended step:
  - deepen the focus-mode scene with session-complete cues, optional local persistence, and future background/audio controls before any final polish phase

### Session 2026-04-28 — Study Room Scene-First Immersive Redesign

- objectives:
  - keep the new idle/focus/panel interaction model but redesign the presentation around atmosphere instead of widgets
  - demote navigation and utility controls so the scene becomes the visual protagonist
  - embed the timer into the scene more lightly and make focus exit spatially intuitive
- actions taken:
  - replaced the descriptive top-left chrome card with a compact top-center micro-toolbar
  - simplified `StudyLayout` usage so the main screen now revolves around chrome, center timer space, and an optional hint area
  - redesigned the idle timer into a small scene-entry control and the focus timer into lightweight overlay text with subtle control rails
  - implemented scene click-exit in focus mode by adding a dedicated interaction hit area behind the timer and chrome
  - kept panel architecture but visually subordinated the launchers so todo/music/stats/settings now feel like hidden utilities instead of homepage content
  - extended the scene structure and background layer so future animated or video-backed study scenes can be supported without replacing the shell
  - rewrote Study Room styling toward scene-first balance, lighter chrome, and atmospheric timer presentation
  - updated Study Room architecture notes to document the philosophy shift
- files changed:
  - updated `apps/study-room/src/components/BackgroundLayer.jsx`
  - updated `apps/study-room/src/lib/studyScene.js`
  - updated `apps/study-room/src/app/StudyChromeWidget.jsx`
  - updated `apps/study-room/src/layouts/StudyLayout.jsx`
  - updated `apps/study-room/src/app/pages/StudyPage.jsx`
  - updated `apps/study-room/src/features/timer/TimerPanel.jsx`
  - replaced `apps/study-room/src/App.css`
  - updated `apps/study-room/STUDY_ROOM_ARCHITECTURE_NOTES.md`
  - updated `docs/AI_PROJECT_MEMORY/CODEX_WORKLOG.md`
- decisions made:
  - the scene is now the dominant layer and the UI should read as attached controls rather than standalone cards
  - chrome is intentionally compact and symmetric so it does not pull visual weight to one side
  - focus mode should keep the background highly visible and rely on empty-scene click exit for natural control
- risks or blockers:
  - the current scene media is still a placeholder image, so the full emotional payoff depends on future illustration or animated background assets
  - panel contents still use the shared floating surface language and may need another pass later to feel even more scene-native
- next recommended step:
  - add richer scene assets and session-complete ambience behavior so the new scene-first shell starts feeling like a real study atmosphere instead of a structural mockup

### Session 2026-04-28 — Study Room Atmosphere Implementation Pass

- objectives:
  - keep the idle/focus/panel interaction model stable while making the scene itself feel like the main product surface
  - replace the single placeholder background treatment with a real multi-scene architecture
  - make timer and chrome presentation more atmospheric and less widget-like
- actions taken:
  - refactored `src/lib/studyScene.js` into a real scene registry with selectable `night-desk` and `rain-room` definitions
  - added scene identity, overlay-strength, glow, and future media fields so live wallpaper support can slot into the same structure later
  - updated `BackgroundLayer.jsx` to consume scene definitions through background image, overlay strength, glow, vignette, and future video-ready media fields
  - wired `selectedSceneId` into shared preferences and app-shell scene resolution so scene switching is immediate and reducer-friendly
  - added a scene selector to the settings panel
  - refined the timer into a lighter atmospheric overlay with focus-status micro text instead of a boxed centerpiece
  - rebalanced the top chrome into a centered symmetric micro-toolbar
  - rewrote the Study Room CSS around clearer background presence, lighter overlays, and subtle ambient animation
  - verified the Study Room app with successful lint and build runs after importing shared scene images across app boundaries
- files changed:
  - updated `apps/study-room/src/lib/studyScene.js`
  - updated `apps/study-room/src/components/BackgroundLayer.jsx`
  - updated `apps/study-room/src/state/studyRoomReducer.js`
  - updated `apps/study-room/src/app/AppShell.jsx`
  - updated `apps/study-room/src/app/pages/StudyPage.jsx`
  - updated `apps/study-room/src/app/StudyChromeWidget.jsx`
  - updated `apps/study-room/src/app/panels/SettingsPanelContent.jsx`
  - updated `apps/study-room/src/features/timer/TimerPanel.jsx`
  - updated `apps/study-room/src/App.css`
  - updated `apps/study-room/STUDY_ROOM_ARCHITECTURE_NOTES.md`
  - updated `docs/AI_PROJECT_MEMORY/CODEX_WORKLOG.md`
- decisions made:
  - scene selection is now a first-class shared preference and should remain compatible with future local persistence and backend sync
  - the timer should read as atmospheric text inside the scene rather than a dominant card surface
  - scene media must stay extensible enough for future illustration packs, looped video, or live wallpaper support without changing UI mode architecture
- risks or blockers:
  - the current placeholder scene assets are serviceable for architecture validation but are not yet the final emotional-quality study illustrations
  - importing large shared images directly into the Study Room bundle increased build output size and may need later optimization or asset-specific variants
- next recommended step:
  - introduce better study-scene source assets plus mode-aware ambience behavior such as session-complete cues, optional rain/audio sync, and user-selectable scene persistence

### Session 2026-04-28 — Real Video Scene Integration And Pomodoro Engine Upgrade

- objectives:
  - replace placeholder primary scenes with real local loop videos
  - upgrade the timer into a professional three-phase Pomodoro state machine
  - add local persistence and a strict bell-on-auto-completion rule without breaking the scene-first shell
- actions taken:
  - detected and wired `packages/shared-assets/videos/1.mp4`, `2.mp4`, and `3.mp4` as the new primary Study Room scenes
  - generated and copied local poster frames from those videos into `packages/shared-assets/videos/1-poster.png`, `2-poster.png`, and `3-poster.png` for smoother scene fallback and fade-in
  - refactored `src/lib/studyScene.js` so scene definitions are now video-first and data-driven through `mediaType` and `mediaSrc`
  - updated `BackgroundLayer.jsx` to support inline loop-video playback with poster fallback and smooth opacity reveal
  - replaced the old work/break reducer flow with `work`, `shortBreak`, and `longBreak` automatic rollover logic plus `completedWorkCycles` and `longBreakInterval`
  - added `lastAutoTransition` tracking so bell playback can distinguish automatic completion from manual timer actions
  - added provider-level runtime effects for local persistence and bell playback
  - persisted scene selection, sound preference, selected track, volume, timer durations, and long-break interval through local storage
  - upgraded the settings panel and timer presentation so the new Pomodoro state machine is editable and visible without changing the scene-first interaction philosophy
  - verified the Study Room app with successful lint and build runs after bundling the real videos and bell asset
- files changed:
  - added `apps/study-room/src/state/studyRoomStorage.js`
  - added `apps/study-room/src/state/StudyRoomRuntimeEffects.jsx`
  - updated `apps/study-room/src/state/StudyRoomProvider.jsx`
  - updated `apps/study-room/src/state/studyRoomReducer.js`
  - updated `apps/study-room/src/state/useStudyRoom.js`
  - updated `apps/study-room/src/lib/studyScene.js`
  - updated `apps/study-room/src/components/BackgroundLayer.jsx`
  - updated `apps/study-room/src/features/timer/useTimerController.js`
  - updated `apps/study-room/src/features/timer/TimerPanel.jsx`
  - updated `apps/study-room/src/features/timer/TimerSettingsWidget.jsx`
  - updated `apps/study-room/src/features/study-statistics/StudyStatisticsPanel.jsx`
  - updated `apps/study-room/src/app/panels/SettingsPanelContent.jsx`
  - updated `apps/study-room/src/App.css`
  - added `packages/shared-assets/videos/1-poster.png`
  - added `packages/shared-assets/videos/2-poster.png`
  - added `packages/shared-assets/videos/3-poster.png`
  - updated `apps/study-room/STUDY_ROOM_ARCHITECTURE_NOTES.md`
  - updated `docs/AI_PROJECT_MEMORY/CODEX_WORKLOG.md`
- decisions made:
  - automatic timer completion is now always responsible for Pomodoro phase rollover; manual session changes remain separate and non-counting
  - the bell cue is tied only to `lastAutoTransition` so manual UI actions can never accidentally trigger it
  - local persistence intentionally stores configuration and media preferences, but not live countdown progress
  - real loop videos are now the primary scene medium and static images are reduced to poster/fallback responsibility
- risks or blockers:
  - the three real local videos bundle successfully, but their current build sizes are large and will likely need later compression, streaming strategy, or alternate-quality variants for production
  - ambient music remains placeholder-only, so the Study Room still lacks final-grade audio ambience despite the new bell cue and real scene loops
- next recommended step:

### Session 2026-04-28 — Portal And Study Room Integration Verification Stabilization

- objectives:
  - finish the interrupted cross-app integration pass
  - stabilize shared locale wiring across the Hexo portal and the Study Room
  - verify the `/study-app/` deployment contract with clean builds for both apps
- actions taken:
  - completed the shared route and identity contract under `packages/shared-config/site-identity.json`
  - completed the shared locale dictionary set under `packages/shared-assets/locales/site-ui/`
  - finished portal-side locale bootstrap wiring through `apps/blog-portal/scripts/portal-shared-config.js`, `portal-data-sync.js`, and `source/js/portal-i18n.js`
  - hardened `apps/blog-portal/source/_data/site_profile.yml` by converting the long Study Room text fields to YAML block scalars so Hexo config validation succeeds
  - split the Study Room locale hook into `src/i18n/useStudyRoomLocale.js` and kept the provider isolated in `StudyRoomLocaleProvider.jsx` so React Fast Refresh and eslint stop flagging mixed exports
  - updated Study Room locale imports across timer, panel, music, todo, statistics, auth, and shell components
  - adjusted Study Room locale hydration so the shared `site-locale` key wins on boot, keeping portal-side language changes aligned with the app on the next load
  - verified there are no remaining `localhost:5173` references in production-facing portal content
  - created `docs/DEPLOYMENT_CONTRACT.md` to record the stable routing and deployment assumptions for `/`, `/study-room/`, `/study-app/`, and the future API host
  - completed verification with successful:
    - `apps/blog-portal`: `npm run clean && npm run build`
    - `apps/study-room`: `npm run lint`
    - `apps/study-room`: `npm run build`
- files changed:
  - updated portal integration files under `apps/blog-portal/`
  - updated Study Room i18n files under `apps/study-room/src/i18n/`
  - updated Study Room localized UI consumers under `apps/study-room/src/`
  - added `docs/DEPLOYMENT_CONTRACT.md`
  - updated `apps/blog-portal/BLOG_PORTAL_SETUP_NOTES.md`
  - updated `apps/study-room/STUDY_ROOM_ARCHITECTURE_NOTES.md`
  - updated `docs/AI_PROJECT_MEMORY/CODEX_WORKLOG.md`
- decisions made:
  - `/study-room/` remains the portal-owned explanatory landing page, while `/study-app/` is the standalone application mount used by production-facing CTAs
  - shared locale selection is now stored in `site-locale` so the portal and Study Room can honor the same user language preference
  - only shared UI surfaces are localized in this phase; article bodies remain single-source content
- risks or blockers:
  - the deployment contract is now documented, but real production rollout still depends on future nginx or equivalent SPA fallback configuration for `/study-app/`
  - portal locale switching is client-side DOM translation, so any future fully static multilingual SEO strategy would need an explicit later design rather than piggybacking on this UI-layer system
- next recommended step:
  - run a browser-level manual QA pass for locale switching and cross-app navigation, then begin backend-phase planning so comments, contact handling, and future Study Room account sync can move behind the shared API boundary
  - optimize the bundled study-scene media and then deepen the atmosphere layer with mode-aware ambience, better scene metadata, and optional persisted last-used playback state

### Session 2026-04-28 — Study Room Productization Preferences Pass

- objectives:
  - add product-level flexibility to timer presentation without changing the Pomodoro engine
  - turn the settings panel into a real user preferences surface
  - prepare the ambient music feature for future cloud provider integration while keeping current local playback intact
- actions taken:
  - added persisted `timerDisplayMode` support with `center_focus`, `minimal_overlay`, and `corner_embed` modes
  - updated `StudyLayout` and `TimerPanel` so timer presentation now changes through CSS/layout classes instead of duplicate timer logic
  - reworked the settings panel into grouped sections for scene settings, timer display settings, timer behavior settings, and future audio architecture
  - refactored `TimerSettingsWidget` into a compact embedded settings section instead of a standalone stacked card
  - expanded local persistence to include the new timer display preference
  - split ambient music into a track-source abstraction (`musicSources.js`) plus the existing playback controller
  - kept current playback on the local source provider while documenting the future cloud provider attachment point
  - verified the Study Room app with successful lint and build runs
- files changed:
  - updated `apps/study-room/src/state/studyRoomReducer.js`
  - updated `apps/study-room/src/state/studyRoomStorage.js`
  - updated `apps/study-room/src/state/StudyRoomRuntimeEffects.jsx`
  - updated `apps/study-room/src/layouts/StudyLayout.jsx`
  - updated `apps/study-room/src/app/pages/StudyPage.jsx`
  - updated `apps/study-room/src/features/timer/TimerPanel.jsx`
  - updated `apps/study-room/src/features/timer/TimerSettingsWidget.jsx`
  - updated `apps/study-room/src/app/panels/SettingsPanelContent.jsx`
  - added `apps/study-room/src/features/ambient-music/musicSources.js`
  - updated `apps/study-room/src/features/ambient-music/tracks.js`
  - updated `apps/study-room/src/features/ambient-music/useAmbientMusicController.js`
  - updated `apps/study-room/src/features/ambient-music/AmbientMusicPanel.jsx`
  - updated `apps/study-room/src/features/ambient-music/index.js`
  - updated `apps/study-room/src/App.css`
  - updated `apps/study-room/STUDY_ROOM_ARCHITECTURE_NOTES.md`
  - updated `docs/AI_PROJECT_MEMORY/CODEX_WORKLOG.md`
- decisions made:
  - timer display choice is now a user preference and should stay presentation-only
  - the settings surface now acts as the product-owned control center for scene and timer behavior preferences
  - future cloud music work should plug into the new source-provider layer instead of being mixed directly into the playback controller
- risks or blockers:
  - corner and minimal timer modes are intentionally conservative first-pass presentations and may still need real-world tuning after longer usage
  - the ambient music provider abstraction is ready, but the actual cloud service integration remains unimplemented by design
- next recommended step:
  - refine the current display modes with user-facing polish and then begin the first real cloud-music planning pass or media-optimization pass, depending on priority

### Session 2026-04-29 — Cross-App Integration Fix And UX Simplification Pass

- objectives:
  - fix locale synchronization so the portal and Study Room truly share one locale source
  - restore a usable one-click Study Room entry during both local preview and production output
  - document the real cause of `/study-app/` 404 behavior and the required deployment contract
- actions taken:
  - centralized the portal-side Study Room public URL decision in `apps/blog-portal/scripts/portal-shared-config.js`
  - restored environment-aware portal linking so `hexo server` points Study Room CTAs at `http://localhost:5173`, while generated output keeps `/study-app/`
  - updated theme-menu sync so the main portal navigation now points directly to the Study Room app instead of the explanatory landing page
  - kept `/study-room/` as an optional portal-owned landing page for SEO and explanation instead of the primary user flow
  - tightened portal locale bootstrap so it now reads only the shared `site-locale` storage key and falls back to the shared default locale instead of browser-language heuristics
  - strengthened `portal-i18n.js` search placeholder handling so translated placeholder text is re-applied when Butterfly search UI is inserted dynamically
  - verified production output still points to `/study-app/` without leaking `localhost:5173`
  - verified local preview portal output points to `http://localhost:5173`
  - updated deployment and portal notes with local-testing instructions, `/study-app/` hosting requirements, and single-key locale-sync rules
- files changed:
  - updated `apps/blog-portal/scripts/portal-shared-config.js`
  - updated `apps/blog-portal/scripts/portal-data-sync.js`
  - updated `apps/blog-portal/scripts/portal-renderer.js`
  - updated `apps/blog-portal/source/js/portal-i18n.js`
  - updated `apps/blog-portal/source/_data/navigation.yml`
  - updated `apps/blog-portal/_config.butterfly.yml`
  - updated `docs/DEPLOYMENT_CONTRACT.md`
  - updated `apps/blog-portal/BLOG_PORTAL_SETUP_NOTES.md`
  - updated `docs/AI_PROJECT_MEMORY/CODEX_WORKLOG.md`
- decisions made:
  - `site-locale` is the only shared locale storage key and now acts as the effective locale source for both apps
  - the main user flow to the Study Room should be one click from the portal, while `/study-room/` remains optional supporting content
  - the `Cannot GET /study-app/` failure is treated as a deployment mounting/fallback problem, not a frontend route-design problem
- risks or blockers:
  - the deployment contract is clearer now, but production still requires an actual reverse-proxy or static host rule that mounts `apps/study-room/dist/` at `/study-app/` with SPA fallback
  - runtime locale translation in the portal still operates at the shared-UI layer only and does not make article bodies multilingual
- next recommended step:
  - run a real browser QA pass across portal search, locale switching, and Study Room entry, then begin backend-phase integration planning so cross-app identity can eventually extend beyond static assets and local storage

## 2026-05-05 — Fix local integrated preview: /study-app/ served by single Hexo server

- session: local-preview-integration
- objectives:
  - make `localhost:4000/study-app/` serve the Study Room SPA from a single Hexo server process
  - establish a repeatable build+sync workflow so study-room dist is mounted into portal source
- root cause:
  - `apps/study-room/dist/` (Vite build output) was never copied into `apps/blog-portal/source/`
  - Hexo only serves files from its `source/` directory; without the dist files there, `/study-app/` returned 404
- actions taken:
  - built study-room with `npm run build` (Vite, base=`/study-app/`)
  - copied `dist/*` into `apps/blog-portal/source/study-app/`
  - added `study-app/**` to `skip_render` in `apps/blog-portal/_config.yml` so Hexo copies those files as-is without processing
  - added `source/study-app/` to `apps/blog-portal/.gitignore` so build artifacts are not committed
  - created `scripts/sync-study-app.sh` at repo root — one-command build+sync script
  - fixed initial mistake: shell `.sh` file was placed in `apps/blog-portal/scripts/` which Hexo tried to load as JS; moved to repo root `scripts/`
- files changed:
  - created `scripts/sync-study-app.sh` (repo root — build and sync script)
  - updated `apps/blog-portal/_config.yml` (added `skip_render: study-app/**`)
  - updated `apps/blog-portal/.gitignore` (added `source/study-app/`)
  - created `apps/blog-portal/source/study-app/` (copied build artifacts, gitignored)
- verification (curl results):
  - `curl localhost:4000/` → 200, portal homepage HTML (Butterfly theme)
  - `curl localhost:4000/study-app/` → 200, study-room SPA index.html
  - `curl localhost:4000/study-app/assets/index-BJ429heq.js` → 200
  - `curl localhost:4000/study-app/assets/index-BPV2UKAU.css` → 200
- decisions made:
  - `skip_render` is the correct Hexo mechanism for excluding SPA build artifacts from processing
  - sync script lives at repo root `scripts/` to avoid Hexo's JS script loading from `apps/blog-portal/scripts/`
  - `source/study-app/` is gitignored since it's a derived build artifact
- risks or blockers:
  - `source/study-app/` must be re-synced after any study-room code change (run `bash scripts/sync-study-app.sh`)
  - large video assets in study-room dist (~44MB) inflate the portal source directory; acceptable for local dev, production deploys handle this separately
- next recommended step:
  - run browser QA pass on `localhost:4000/study-app/` to verify full SPA functionality (timer, scenes, settings)

### Session 2026-05-05 — Fix Portal Study Room Links To Use /study-app/ In All Modes

- objectives:
  - remove the `localhost:5173` dev shortcut logic from portal Study Room links
  - make all local portal CTAs consistently point to `/study-app/` since integrated preview is now the default
  - verify no `localhost:5173` references remain in generated HTML
- actions taken:
  - analyzed `portal-shared-config.js` and found `resolveStudyRoomPublicUrl()` returns `localhost:5173` when `hexo.env.cmd === 'server'`
  - simplified `resolveStudyRoomPublicUrl()` to always return `studyRoomAppPath` (`/study-app/`)
  - removed unused `studyRoomDevUrl` constant and its export
  - updated `BLOG_PORTAL_SETUP_NOTES.md` to reflect unified local/production behavior
  - verified with Hexo server that all Study Room links now use `/study-app/`
- files changed:
  - updated `apps/blog-portal/scripts/portal-shared-config.js` (removed dev URL logic)
  - updated `apps/blog-portal/BLOG_PORTAL_SETUP_NOTES.md` (updated dev vs prod documentation)
- verification results:
  - `curl localhost:4000/` → 200, homepage HTML
  - grep for `localhost:5173` in generated HTML → 0 matches
  - grep for `href="/study-app/"` → 4 matches (nav menu, sidebar menu, shortcut card, portfolio card)
  - `curl localhost:4000/study-app/` → 200, Study Room SPA
- decisions made:
  - local integrated preview is now the default mode; no more dev/prod URL switching for Study Room links
  - the `resolveStudyRoomPublicUrl()` function signature is preserved for backward compatibility but always returns `/study-app/`
- risks or blockers:
  - if someone needs to run Study Room separately on `localhost:5173` again, they would need to manually change the URL or restore the old logic
- next recommended step:
  - run browser QA pass to verify clicking Study Room links from portal actually loads the SPA correctly

### Session 2026-05-05 — Fix Study Room Video Playback Under /study-app/

- objectives:
  - fix background videos not playing and scene 3 causing a black page when served from `/study-app/` through Hexo
  - add resilience to the BackgroundVideo component so videos become visible even when autoplay or canplay is delayed
- root cause:
  - Hexo's built-in server does not support HTTP Range requests (returns 200 instead of 206 Partial Content)
  - some browsers require Range requests for video autoplay to fire `canplay` reliably
  - the original `BackgroundVideo` component relied solely on `onCanPlay` to set visibility, with no timeout or fallback
- actions taken:
  - read and analyzed `BackgroundLayer.jsx`, `studyScene.js`, video file integrity, and Hexo serving behavior
  - confirmed all three video files (1.mp4, 2.mp4, 3.mp4) are valid H.264 MP4s with correct magic bytes
  - confirmed all assets serve with correct MIME types and HTTP 200 from Hexo
  - confirmed JS bundle contains correct `/study-app/` paths for all video/poster assets
  - refactored `BackgroundVideo` into a stateful component with:
    - `onLoadedData` handler as an additional visibility trigger
    - 4-second timeout fallback (`VIDEO_VISIBILITY_TIMEOUT_MS`) ensuring video becomes visible even if events never fire
    - proper cleanup via `useEffect`/`useRef` to prevent stale timers on scene switch
    - CSS class toggle (`background-layer__video--visible`) for opacity transition
  - rebuilt study-room, synced to portal source, and verified lint passes
- files changed:
  - updated `apps/study-room/src/components/BackgroundLayer.jsx` (resilient BackgroundVideo component)
  - rebuilt `apps/blog-portal/source/study-app/` (synced dist artifacts)
- verification results:
  - `npm run lint` passes
  - `npm run build` succeeds
  - all three video files serve correctly from Hexo (200, correct content-type)
  - MD5 checksums match between source, dist, and served files
  - CSS variables for poster images generate correctly for all scenes
- decisions made:
  - the 4-second timeout is a safety net, not the primary path; `onLoadedData` and `onCanPlay` still fire first when possible
  - the fix is component-level resilience, not a Hexo server workaround — the approach works regardless of server Range request support
- risks or blockers:
  - Hexo's lack of Range request support remains a limitation for large video files; production should use nginx or equivalent
  - the specific "black page on scene 3" may need further investigation if the current fix does not fully resolve it in browser testing
- next recommended step:
  - run browser QA pass on all three scenes under `localhost:4000/study-app/` to confirm videos play and scene switching works correctly

### Session 2026-05-05 — Fix Aquarium Scene Runtime Crash (overlayShift undefined)

- objectives:
  - fix `TypeError: undefined is not an object (evaluating 'reactiveAtmosphere.overlayShift[modeKey]')` crash when switching to the aquarium scene
  - make `createSceneDefinition` correctly preserve deep-merged `reactiveAtmosphere` instead of overwriting it
- root cause:
  - `createSceneDefinition()` in `studyScene.js` line 136 called `mergeReactiveAtmosphere(scene.reactiveAtmosphere)` to deep-merge scene overrides with defaults
  - BUT line 138 did `...scene` which overwrote the merged result with the ORIGINAL partial `scene.reactiveAtmosphere`
  - scenes 1 (coastal-cafe) and 2 (retro-desk) survived because their `reactiveAtmosphere.work` overrides included explicit `overlayShift` objects
  - scene 3 (aquarium-room) crashed because its `reactiveAtmosphere.work` was `{ glowOpacity: 0.72 }` only — no `overlayShift`
  - the spread destroyed the deep-merged result, leaving `overlayShift` undefined on the `work` session
- actions taken:
  - destructured `reactiveAtmosphere` out of `scene` before the final spread: `const { reactiveAtmosphere: sceneAtmosphere, ...sceneRest } = scene`
  - used `mergeReactiveAtmosphere(sceneAtmosphere)` in the returned object and spread `...sceneRest` (which no longer contains `reactiveAtmosphere`)
  - added defensive optional chaining in `resolveStudyScenePresentation`: `reactiveAtmosphere.overlayShift?.[modeKey] ?? 0`
  - rebuilt study-room, synced to portal source, lint passes, build passes
- files changed:
  - updated `apps/study-room/src/lib/studyScene.js` (fixed `createSceneDefinition` and defensive `resolveStudyScenePresentation`)
- verification results:
  - `npm run lint` passes
  - `npm run build` succeeds (318.95 kB JS)
  - aquarium scene's `reactiveAtmosphere.work` now correctly contains `overlayShift: { idle: 0.05, focus: 0.08 }` from defaults plus `glowOpacity: 0.72` from scene override
- decisions made:
  - the primary fix is structural (prevent spread from overwriting merged data), not just defensive optional chaining
  - the defensive `?. ?? 0` fallback in `resolveStudyScenePresentation` is belt-and-suspenders for any future scene that might still miss `overlayShift`
- why aquarium was uniquely broken:
  - it was the only scene whose `reactiveAtmosphere.work` override omitted `overlayShift`; scenes 1 and 2 happened to include it, masking the bug
- next recommended step:
  - browser QA pass to confirm aquarium scene renders correctly and scene switching no longer crashes

### Session 2026-05-06 — Phase 6.5.1 Backend Runtime Bootstrap

- objectives:
  - convert apps/backend-api from an empty placeholder scaffold into a minimal runnable HTTP server
  - establish Hono as the backend framework
  - implement validated env loading, error handling middleware, and a health check endpoint
  - verify the server boots and responds to HTTP requests
- actions taken:
  - installed dependencies: hono, @hono/node-server, dotenv, zod
  - created src/config/env.js with zod-validated env loading (PORT, DATABASE_URL, SESSION_SECRET)
  - created src/app.js as Hono app factory with logger, CORS, error handler, and route mounting
  - created src/middleware/errorHandler.js as global error handling middleware
  - created src/routes/health.js with GET /health returning { ok: true, service: "backend-api" }
  - rewrote src/index.js to use @hono/node-server serve() with the Hono app
  - removed obsolete src/config/runtime.js (replaced by env.js)
  - removed obsolete src/http/routes/index.js and empty src/http/ directory
  - preserved module placeholder folders: src/modules/auth/, src/modules/site-config/, src/modules/study-data/
  - preserved src/db/README.md placeholder
  - updated package.json with dependencies and corrected scripts (dev with --watch, start without)
  - fixed bug: env.port → env.PORT (zod schema key is uppercase)
- files changed:
  - updated apps/backend-api/package.json (added deps, fixed scripts)
  - added apps/backend-api/package-lock.json
  - created apps/backend-api/src/config/env.js
  - created apps/backend-api/src/app.js
  - created apps/backend-api/src/middleware/errorHandler.js
  - created apps/backend-api/src/routes/health.js
  - updated apps/backend-api/src/index.js (rewritten to Hono server)
  - updated apps/backend-api/.env.example
  - removed apps/backend-api/src/config/runtime.js
  - removed apps/backend-api/src/http/routes/index.js
  - removed apps/backend-api/src/http/ directory
- verification results:
  - `npm install` succeeds (4 packages added)
  - `npm start` boots server on port 3001, stays alive
  - `npm run dev` boots server with --watch on port 3001, stays alive
  - `curl localhost:3001/health` returns `{"ok":true,"service":"backend-api"}` (200)
  - `curl localhost:3001/` returns `{"error":"Not found"}` (404)
- decisions made:
  - Hono is the backend framework (lightweight, ESM-native, Web Standard API)
  - zod is used for env validation (fail-fast on invalid config)
  - dotenv loads .env file automatically via `import 'dotenv/config'`
  - error handler returns generic 500 messages to clients, logs full errors server-side
  - module folders (auth, site-config, study-data) are preserved as empty domain placeholders
- risks or blockers:
  - no .env file exists yet (only .env.example) — server uses defaults, which is fine for dev
  - Prisma is not installed yet (intentionally deferred to Phase 6.5.2)
- next recommended step:
  - Phase 6.5.2: install Prisma, create AdminUser + Session models, run first migration

### Session 2026-05-08 — Phase 6.5.2A Prisma + Database Foundation

- objectives:
  - install Prisma ORM into apps/backend-api
  - create AdminUser and Session models
  - create Prisma client singleton
  - improve env validation for fail-fast behavior
  - prepare schema and client without running migrations
- actions taken:
  - installed prisma (6.19.3) and @prisma/client (6.19.3) — pinned to v6 because Prisma 7 introduced breaking changes (adapter-based client, TypeScript-only generated output, removed datasource URL from schema) that add unnecessary complexity for a JS-only foundation
  - created prisma/schema.prisma with MySQL datasource, generator, AdminUser model, and Session model with relation
  - created src/db/client.js as ESM-compatible PrismaClient singleton (avoids multiple instances in dev/watch mode via globalThis caching)
  - updated src/config/env.js to make DATABASE_URL and SESSION_SECRET required (fail-fast with zod .min(1))
  - added COOKIE_DOMAIN to env schema with default "localhost"
  - updated .env.example with all required and optional variables
  - added prisma:generate, prisma:validate, prisma:migrate:dev, and prisma:studio scripts to package.json
  - moved prisma CLI to devDependencies
- files changed:
  - updated apps/backend-api/package.json (added prisma deps and scripts)
  - updated apps/backend-api/package-lock.json
  - updated apps/backend-api/prisma/schema.prisma (added AdminUser + Session models)
  - created apps/backend-api/src/db/client.js (PrismaClient singleton)
  - updated apps/backend-api/src/config/env.js (required DATABASE_URL and SESSION_SECRET)
  - updated apps/backend-api/.env.example (added COOKIE_DOMAIN and REPO_ROOT)
- verification results:
  - `node_modules/.bin/prisma validate` → schema valid
  - `node_modules/.bin/prisma generate` → Prisma Client v6.19.3 generated to ./node_modules/@prisma/client
  - PrismaClient import resolves correctly
  - `node src/index.js` boots on port 3001
  - `curl localhost:3001/health` returns `{"ok":true,"service":"backend-api"}` (200)
  - env validation correctly exits(1) when DATABASE_URL or SESSION_SECRET are empty
- decisions made:
  - pinned Prisma to v6.x — Prisma 7 requires adapter-based PrismaClient constructor, generates TypeScript-only output, and removes datasource URL from schema.prisma; these are breaking changes that add unnecessary complexity for a pure JS ESM project at this stage
  - PrismaClient singleton uses globalThis pattern to prevent multiple instances during --watch hot reload
  - DATABASE_URL and SESSION_SECRET are now required (server exits immediately if missing)
  - no prisma.config.js needed (Prisma 6 uses url in schema.prisma)
- risks or blockers:
  - no real database connected yet — PrismaClient instantiation works but queries will fail until a MySQL instance is available
  - migrations intentionally deferred until remote database deployment strategy is finalized
  - Prisma 7 upgrade path exists but should be evaluated separately when the project is ready for TypeScript or needs Prisma 7-specific features
- next recommended step:
  - set up remote MySQL database (Docker on Ubuntu server), then run first prisma migrate dev to create tables
  - begin auth route implementation once database is connected

### Session 2026-05-08 — Phase 6.5.2B Local MySQL Foundation

- objectives:
  - establish local MySQL database for backend-api development
  - execute first Prisma migration to create AdminUser and Session tables
  - verify end-to-end Prisma connectivity from backend-api
- actions taken:
  - audited repo: no existing Docker files, MySQL configs, or .env files found
  - attempted Docker Desktop install via brew — failed (network: connection reset by peer on Docker CDN download)
  - installed Colima + Docker CLI + qemu as alternative — Colima VM image download also failed (GitHub timeout)
  - installed MySQL 9.6 via Homebrew as fallback (lighter, no large downloads needed)
  - started MySQL service via `brew services start mysql`
  - created `personal_website` database with utf8mb4_unicode_ci collation
  - created `personal_user` with full privileges (required for Prisma shadow database)
  - created `infra/local-db/docker-compose.yml` for future Docker-based setup (preserved as reference)
  - created `infra/local-db/README.md` documenting both Homebrew and Docker approaches
  - updated `apps/backend-api/.env` with Docker/Homebrew MySQL credentials
  - ran `prisma migrate dev --name init` — created migration `20260508094440_init`
  - verified tables: AdminUser (id, email, password, createdAt), Session (id, userId, expiresAt, createdAt) with foreign key
  - verified Prisma queries work: `prisma.adminUser.count()` and `prisma.session.count()` both return 0
  - verified server boots and /health endpoint responds correctly with DB connected
- files changed:
  - created infra/local-db/docker-compose.yml (Docker MySQL reference stack)
  - created infra/local-db/README.md (setup instructions for both methods)
  - updated apps/backend-api/.env (real MySQL credentials for local dev)
  - created apps/backend-api/prisma/migrations/20260508094440_init/migration.sql
  - created apps/backend-api/prisma/migrations/migration_lock.toml
- verification results:
  - `mysql -u personal_user -p[REDACTED] personal_website -e "SHOW TABLES"` → AdminUser, Session, _prisma_migrations
  - `prisma migrate dev --name init` → migration applied, client generated
  - `node src/index.js` → boots on port 3001
  - `fetch localhost:3001/health` → 200, `{"ok":true,"service":"backend-api"}`
  - `prisma.adminUser.count()` → 0 (table accessible)
  - `prisma.session.count()` → 0 (table accessible)
- decisions made:
  - Homebrew MySQL used instead of Docker due to network issues blocking large downloads (Docker Desktop CDN, Colima/GitHub VM images)
  - docker-compose.yml preserved as reference for future Docker-based workflow when network allows
  - personal_user granted full privileges (not just personal_website scope) because Prisma shadow database requires CREATE DATABASE permission
  - MySQL 9.6 installed (latest Homebrew default), compatible with Prisma 6 MySQL connector
- risks or blockers:
  - Homebrew MySQL is not as isolated as Docker — data lives in /opt/homebrew/var/mysql, shared with any other local MySQL usage
  - if Docker Desktop is installed later, the docker-compose.yml can replace the Homebrew approach
  - shadow database requires elevated privileges; in production, use `prisma migrate deploy` instead (no shadow DB needed)
- next recommended step:
  - begin auth route implementation (login, session creation) since database is now connected and tables exist

### Session 2026-05-08 — Phase 6.5.3 Backend Auth Foundation

- objectives:
  - implement minimal but production-structured authentication/session infrastructure
  - DB-backed sessions with HttpOnly cookies (no JWT)
  - single-admin architecture
- actions taken:
  - installed bcryptjs for password hashing
  - created src/middleware/auth.js with authMiddleware() and requireAuth() guards
    - authMiddleware reads session_id cookie, validates against DB, attaches user to Hono context
    - requireAuth() returns 401 if no authenticated user
    - expired sessions are auto-cleaned on access
  - created src/routes/auth.js with three endpoints:
    - POST /auth/login — validates email/password via bcrypt, creates Session row, sets HttpOnly cookie, returns safe user payload
    - POST /auth/logout — deletes Session row, clears cookie
    - GET /auth/session — returns current authenticated user (requires auth)
  - created src/routes/protected.js with GET /protected/ping (requires auth, returns user info)
  - updated src/app.js to mount auth routes at /auth and protected routes at /protected, added CORS with credentials
  - created scripts/create-admin.js — bootstraps initial admin user from ADMIN_EMAIL/ADMIN_PASSWORD env vars
  - verified full flow: unauthenticated 401, wrong-password 401, login 200 + cookie, authenticated session 200, authenticated protected 200, logout 200 + cookie cleared, post-logout 401
- files changed:
  - updated apps/backend-api/package.json (added bcryptjs)
  - updated apps/backend-api/package-lock.json
  - created apps/backend-api/src/middleware/auth.js
  - created apps/backend-api/src/routes/auth.js
  - created apps/backend-api/src/routes/protected.js
  - created apps/backend-api/scripts/create-admin.js
  - updated apps/backend-api/src/app.js (mounted auth + protected routes, CORS with credentials)
- verification results:
  - POST /auth/login with wrong password → 401 "Invalid credentials"
  - POST /auth/login with correct credentials → 200 + Set-Cookie: session_id=...; HttpOnly; SameSite=Lax
  - GET /auth/session with cookie → 200 + user object (no password field)
  - GET /protected/ping with cookie → 200 + user info
  - POST /auth/logout → 200 + cookie cleared, session row deleted from DB
  - GET /auth/session after logout → 401
  - DB verified: AdminUser row exists, Session row correctly deleted after logout
- decisions made:
  - DB-backed sessions only (no JWT) — session token is a cuid stored in HttpOnly cookie
  - session duration: 7 days
  - cookie: HttpOnly, Secure (non-localhost), SameSite=Lax
  - bcrypt cost factor: 12 (in create-admin.js)
  - auth middleware runs on every request but does not block — requireAuth() is a separate guard
  - password field stripped from all responses via destructuring
  - CORS configured with credentials: true for localhost:4000 and localhost:5173
- risks or blockers:
  - no rate limiting on login endpoint (acceptable for single-admin architecture)
  - no CSRF protection yet (SameSite=Lax provides partial protection)
  - session cleanup only happens on access — orphaned expired sessions accumulate until accessed
- next recommended step:
  - add admin dashboard routes or CMS content editing endpoints that use the auth foundation
