# Codex Worklog

Last updated: 2026-04-28
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
  - optimize the bundled study-scene media and then deepen the atmosphere layer with mode-aware ambience, better scene metadata, and optional persisted last-used playback state
