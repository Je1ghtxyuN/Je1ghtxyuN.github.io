# Repository Audit Report

Date: 2026-04-27
Scope: full repository discovery and architecture audit
Mode: source read-only audit; no application source files changed

## Executive Summary

This repository is not a full-stack Node.js platform today. It is a client-rendered React 19 + Vite single-page app deployed to GitHub Pages, with Firebase used directly from the browser for authentication, Firestore, and analytics.

There is no custom backend, no API layer, no server-side routing, and no server startup entry beyond Vite's dev/preview commands. Most feature logic lives inside one monolithic file, `src/App.jsx`, while some data access is abstracted into `src/dataService.js` and other data writes bypass that abstraction entirely.

For a modern modular full-stack refactor, the main architectural shift will be introducing a real server boundary, role-based authorization, URL-based routing, and domain-separated modules for profile, works, blog, photos, comments, auth, and admin.

## A. Directory Tree

Important folders and files only. Generated directories such as `node_modules/` and `dist/` were scanned but are omitted here as non-source/runtime artifacts.

```text
.
├── .env.example
├── .gitignore
├── README.md
├── SECURITY.md
├── REPO_AUDIT_REPORT.md
├── document_tree.py
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── test-date-formatter.html
├── vite.config.js
├── personal-website/
│   └── README.md
├── public/
│   ├── vite.svg
│   ├── images/
│   │   ├── background.jpg
│   │   ├── icon.png
│   │   ├── profile.jpg
│   │   ├── gallery/
│   │   │   ├── photo1.jpg
│   │   │   ├── photo2.jpg
│   │   │   ├── photo3.jpg
│   │   │   ├── photo4.jpg
│   │   │   ├── photo5.png
│   │   │   ├── photo6.png
│   │   │   ├── photo7.png
│   │   │   └── photo8.png
│   │   └── works/
│   │       ├── GSSJ1.jpeg
│   │       ├── GSSJ2.jpeg
│   │       ├── REBORN1.jpg
│   │       └── REBORN2.jpg
│   └── music/
│       ├── doctordie.mp3
│       ├── あたらよ - 夏霞.mp3
│       ├── 主题.mp3
│       ├── 公园舒缓配乐.mp3
│       ├── 实验室（悬疑）.mp3
│       └── 科技lo-fi.mp3
├── src/
│   ├── App.css
│   ├── App.jsx
│   ├── ErrorBoundary.jsx
│   ├── dataService.js
│   ├── firebase.js
│   ├── index.css
│   ├── main.jsx
│   ├── assets/
│   │   └── react.svg
│   ├── components/
│   │   └── SettingsPanel.jsx
│   ├── contexts/
│   │   └── AppContext.jsx
│   ├── locales/
│   │   ├── en.json
│   │   ├── ja.json
│   │   └── zh.json
│   └── utils/
│       └── dateFormatter.js
├── 快速参考指南.md
├── 技术架构图.md
├── 目录结构.txt
└── 项目结构说明.md
```

## B. Inventory and Current Architecture

### 1. Frontend Files

Application entry and shell:

- `index.html`
- `src/main.jsx`
- `src/App.jsx`
- `src/ErrorBoundary.jsx`

UI components and state:

- `src/components/SettingsPanel.jsx`
- `src/contexts/AppContext.jsx`

Data, integration, utilities:

- `src/dataService.js`
- `src/firebase.js`
- `src/utils/dateFormatter.js`

Styling:

- `src/index.css`
- `src/App.css`

Localization/content resources:

- `src/locales/en.json`
- `src/locales/ja.json`
- `src/locales/zh.json`

Frontend-only auxiliary page:

- `test-date-formatter.html`

### 2. Backend Files

There are no backend application files in this repository.

What exists instead:

- build/dev tooling: `package.json`, `vite.config.js`, `eslint.config.js`
- client-side Firebase bootstrap: `src/firebase.js`
- client-side calls to Firestore/Auth from browser code: `src/App.jsx`, `src/dataService.js`

Conclusion:

- no Express/Fastify/Koa server
- no API routes
- no server controllers/services
- no server-side auth/session layer
- no database schema migrations
- no cloud functions checked into the repo

### 3. Static Assets

Public runtime assets:

- `public/images/background.jpg`
- `public/images/icon.png`
- `public/images/profile.jpg`
- `public/images/gallery/photo1.jpg`
- `public/images/gallery/photo2.jpg`
- `public/images/gallery/photo3.jpg`
- `public/images/gallery/photo4.jpg`
- `public/images/gallery/photo5.png`
- `public/images/gallery/photo6.png`
- `public/images/gallery/photo7.png`
- `public/images/gallery/photo8.png`
- `public/images/works/GSSJ1.jpeg`
- `public/images/works/GSSJ2.jpeg`
- `public/images/works/REBORN1.jpg`
- `public/images/works/REBORN2.jpg`
- `public/music/doctordie.mp3`
- `public/music/あたらよ - 夏霞.mp3`
- `public/music/主题.mp3`
- `public/music/公园舒缓配乐.mp3`
- `public/music/实验室（悬疑）.mp3`
- `public/music/科技lo-fi.mp3`
- `public/vite.svg`

Source asset:

- `src/assets/react.svg`

Generated static output also exists under `dist/`, but it is build output, not source.

### 4. Routing Logic

There is no URL router.

Actual navigation model:

- `src/main.jsx:23-31` mounts a single React app.
- `src/App.jsx:1083-1116` holds a local `tab` state.
- `src/App.jsx:243-297` desktop navigation writes `setTab(...)`.
- `src/App.jsx:299-334` mobile navigation writes `setTab(...)`.
- `src/App.jsx:1106-1111` conditionally renders sections by `tab`.

Implications:

- no route URLs
- no nested routes
- no browser-history-aware navigation
- no deep linking to blog posts
- no per-page SEO surfaces

### 5. Database Usage

Database is Firestore, accessed entirely from client code.

Bootstrap:

- `src/firebase.js:1-101`

Shared data access layer:

- `src/dataService.js:124-495`

Firestore collections/documents in use:

- profile doc: `artifacts/{APP_ID}/public/profile`
- blog posts: `artifacts/{APP_ID}/public/data/posts`
- works: `artifacts/{APP_ID}/public/data/works`
- photos: `artifacts/{APP_ID}/public/data/photos`
- post comments: `artifacts/{APP_ID}/public/data/posts/{postId}/comments`
- post likes: `artifacts/{APP_ID}/public/data/posts/{postId}/likes/{userId}`

Important note:

- `APP_ID` is duplicated in `src/App.jsx:43` and `src/dataService.js:8`.

### 6. Authentication Related Code

Firebase Auth is used directly in the SPA.

Bootstrap:

- `src/firebase.js:1-101`

Auth flow:

- `src/App.jsx:1088-1098` listens to auth state
- `src/App.jsx:1093-1095` auto-signs all visitors in anonymously if no user exists
- `src/App.jsx:1040-1055` provides email/password login modal
- `src/App.jsx:1100` logs out with `signOut(auth)`

Authorization model in UI:

- "admin" is effectively `user && !user.isAnonymous`
- edit/delete/create buttons appear based on that check in:
  - `src/App.jsx:507-514`
  - `src/App.jsx:603-605`
  - `src/App.jsx:682-684`
  - `src/App.jsx:847`
  - `src/App.jsx:862-877`

Important security caveat:

- there is no server-side role model in the repo
- Firebase rules are not version-controlled in the repo
- actual write protection cannot be fully audited from repository contents alone

### 7. Blog / Article Related Code

Rendering:

- `src/App.jsx:173-181` `MarkdownRenderer`
- `src/App.jsx:768-900` `BlogSection`
- `src/App.jsx:903-989` `BlogEditor`

Data access:

- `src/dataService.js:368-409` blog CRUD
- `src/dataService.js:447-473` comment helpers
- `src/dataService.js:475-494` like helper

Direct database bypasses inside UI:

- `src/App.jsx:707-765` comments query/write directly to Firestore
- `src/App.jsx:802-815` likes write directly to Firestore instead of `dataService.likePost`

### 8. Admin Related Code

Admin UI is present, but not modularized into a dedicated admin area.

Admin-capable edit/create flows:

- profile editing: `src/App.jsx:426-543`
- work add/edit modal: `src/App.jsx:991-1021`
- photo add modal: `src/App.jsx:1023-1038`
- blog write/edit modal: `src/App.jsx:903-989`
- login modal: `src/App.jsx:1040-1055`

Observations:

- there is no `/admin` route
- admin features are embedded inside public screens
- admin writes are mostly direct browser-to-Firestore operations

### 9. Reusable Components / Utilities

Best current candidates:

- `src/contexts/AppContext.jsx`
- `src/components/SettingsPanel.jsx`
- `src/ErrorBoundary.jsx`
- `src/utils/dateFormatter.js`
- `src/locales/*.json`
- `src/dataService.js` as a schema/reference starting point

Secondary reusable patterns currently trapped inside `src/App.jsx`:

- `MarkdownRenderer`
- `VideoPlayer`
- `Footer`
- `MusicPlayer`

These are reusable in concept, but they should be extracted before reuse.

## C. Current Technical Stack

### Framework

- React 19.2.0 (`package.json:17-18`)

### Build Tools

- Vite 7.2.4 (`package.json:33`)
- `@vitejs/plugin-react` (`package.json:26`)
- ESLint 9 (`package.json:23,27-29`)
- Terser minification (`package.json:32`, `vite.config.js:25-31`)
- `gh-pages` deploy workflow (`package.json:11-12,30`)

### Package Dependencies

Runtime dependencies:

- `firebase`
- `lucide-react`
- `react`
- `react-dom`
- `react-markdown`
- `remark-gfm`

Dev dependencies:

- `@eslint/js`
- `@types/react`
- `@types/react-dom`
- `@vitejs/plugin-react`
- `eslint`
- `eslint-plugin-react-hooks`
- `eslint-plugin-react-refresh`
- `gh-pages`
- `globals`
- `terser`
- `vite`

### CSS Solution

Mixed approach:

- global CSS file: `src/index.css`
- unused/legacy CSS file: `src/App.css`
- inline styles across nearly every component in `src/App.jsx`
- injected global `<style>` block in `src/App.jsx:45-169`
- CSS custom properties for theme tokens

Conclusion:

- no CSS modules
- no Tailwind
- no styled-components
- no design-system package
- styling is ad hoc and duplicated

### Server Runtime

Development/runtime model:

- Node.js runs Vite locally via `npm run dev`
- `npm run preview` serves built static files locally
- production hosting is static via GitHub Pages
- application runtime is browser-only

There is no persistent backend runtime in this repo.

### Other External Services

- Firebase Auth / Firestore / Analytics
- Formspree contact form endpoint in `src/App.jsx:1070-1075`
- CDN-hosted Font Awesome CSS in `index.html:8`
- Google Fonts imported both in `src/index.css:1-2` and `src/App.jsx:47`

## D. Current Architecture Explanation

### Entry and Startup

1. `index.html:11-12` defines the `#root` mount node and loads `src/main.jsx`.
2. `src/main.jsx:23-31` mounts the React app inside `StrictMode`.
3. The app is wrapped with:
   - `ErrorBoundary`
   - `AppProvider`
4. In production, `src/main.jsx:15-20` attempts to register `/sw.js`, but `public/sw.js` does not exist.

### Application Shell

The full SPA shell lives in `src/App.jsx`.

`src/App.jsx` contains:

- global styles
- navigation components
- utility components
- public sections
- modals
- auth logic
- direct Firestore write logic

This file is both the shell and the feature implementation layer.

### State and UI Flow

Global state:

- theme
- language

Local state inside `src/App.jsx` sections:

- current tab
- auth modal visibility
- profile editing state
- works list and modal state
- photo list and modal state
- blog list, active post, editor state

### Data Flow

Primary intended flow:

1. UI section mounts.
2. Section calls `dataService.getX()`.
3. Section subscribes via `dataService.subscribeX()`.
4. `dataService` queries Firestore and caches to `localStorage`.

Actual flow in practice:

- works/photos/posts reads mostly use `dataService`
- comments, likes, work writes, and photo writes bypass `dataService`
- authorization is determined in UI, not by any server layer

### Auth Flow

1. App mounts.
2. `onAuthStateChanged` runs.
3. If no user exists, anonymous sign-in is attempted automatically.
4. Public visitors become authenticated anonymous users.
5. Admin login is a modal using email/password auth.
6. UI treats any non-anonymous user as admin.

### Content Model

Current content domains:

- profile
- works
- blog posts
- photos
- comments
- likes
- contact submissions via Formspree instead of repo-owned backend

### Documentation Drift

The repo documentation does not match the live codebase:

- `README.md:5-27` describes an HTML/CSS/JS guestbook site, not React/Vite/Firebase.
- `README.md:9-13` says the site has 3 sections; the app currently has 5 tabs.
- `项目结构说明.md` describes a `legacy_site/` directory and `public/videos/` that do not exist in the current tree.
- `SECURITY.md` documents recommended Firebase rules, but no actual rules file is version-controlled.

## E. Architectural Problems and Technical Debt

### 1. Monolithic SPA Composition

Severity: High

Evidence:

- `src/App.jsx` is 1119 lines and mixes shell, navigation, auth, feature UI, styling, and data mutations.

Impact:

- low maintainability
- poor testability
- hard to parallelize refactor work
- feature coupling across unrelated domains

### 2. No Real Backend Boundary

Severity: High

Evidence:

- no backend source files exist
- Firestore/Auth are called directly from browser code in `src/App.jsx` and `src/dataService.js`

Impact:

- business rules live in client
- auditing permissions is difficult
- future modular full-stack migration requires creating backend capabilities from scratch

### 3. Weak Admin / Authorization Model

Severity: High

Evidence:

- UI admin check is `user && !user.isAnonymous` in multiple sections
- login is plain email/password in `src/App.jsx:1040-1055`
- no server-side role enforcement exists in repo
- `SECURITY.md:34-57` suggests Firebase rules, but actual enforced rules are not stored in source control

Impact:

- "admin" is a UI convention, not a durable domain model
- operational security depends on out-of-repo console settings
- difficult to migrate safely without redefining roles/permissions

### 4. Hardcoded Firebase Fallback Credentials

Severity: High

Evidence:

- `src/firebase.js:44-53` falls back to hardcoded Firebase config values if env vars are absent

Impact:

- environment separation is weak
- local/prod behavior can silently drift
- configuration hygiene is poor for a future platform

Note:

- Firebase web config values are not secrets in the same sense as server credentials, but hardcoded fallback config is still a maintainability and environment-control problem.

### 5. Service Layer Is Incomplete and Bypassed

Severity: High

Evidence:

- generic data layer exists in `src/dataService.js:124-495`
- comments bypass it in `src/App.jsx:712-734`
- likes bypass it in `src/App.jsx:802-815` despite `src/dataService.js:475-494`
- work modal bypasses it in `src/App.jsx:994-1000`
- photo modal bypasses it in `src/App.jsx:1023-1025`

Impact:

- duplicated Firestore query/write logic
- inconsistent error handling
- inconsistent caching behavior
- harder future API migration

### 6. Profile Data Model Conflicts With i18n Content

Severity: High

Evidence:

- profile edit form allows editing `subtitle`, `aboutTitle`, `aboutContent` in `src/App.jsx:495-496,521,524`
- display path ignores those saved values and renders translation keys instead:
  - `src/App.jsx:503`
  - `src/App.jsx:521`
  - `src/App.jsx:527`
- profile fetch only rehydrates `avatar` and `name` from Firestore in `src/App.jsx:439-445`

Impact:

- saved profile fields do not fully round-trip
- content ownership is unclear between CMS data and locale files
- future admin/content system will be harder to model correctly

### 7. Routing Is UI-State Only

Severity: Medium-High

Evidence:

- `src/App.jsx:1083-1111` uses local `tab` state instead of URL routing

Impact:

- no shareable URLs for blog posts
- poor SEO and analytics segmentation
- no lazy route boundaries
- difficult future expansion into admin/dashboard/content routes

### 8. Offline Fallback Gives False Success Semantics

Severity: Medium-High

Evidence:

- `src/dataService.js:237-251`, `271-280`, `299-306`, `362-364` can return success-like local fallback results
- there is no durable sync queue or reconciliation mechanism in repo

Impact:

- users can be told an operation succeeded even when it only updated local cache
- data consistency is not guaranteed
- dangerous for admin/content workflows

### 9. Styling Is Duplicated and Unstructured

Severity: Medium

Evidence:

- global tokens/styles in `src/index.css:4-220`
- near-duplicate global styles injected in `src/App.jsx:45-169`
- `src/App.css` exists but appears unused
- most layout/presentation is inline style code

Impact:

- visual drift risk
- hard theming refactor
- poor component reuse
- large JSX noise

### 10. Documentation Is Significantly Outdated

Severity: Medium

Evidence:

- `README.md` still describes HTML/CSS/JavaScript guestbook site
- `项目结构说明.md` describes nonexistent `legacy_site/`
- `技术架构图.md` describes dual-version architecture not present in the current tree
- `personal-website/README.md` is leftover Vite template content

Impact:

- onboarding friction
- misleading refactor assumptions
- wasted time during migration planning

### 11. External Link Security Gaps

Severity: Medium

Evidence:

- `target="_blank"` links without `rel="noopener noreferrer"`:
  - `src/App.jsx:416-419`
  - `src/App.jsx:618`

Impact:

- reverse tabnabbing exposure
- easy security hardening miss

### 12. Missing Service Worker File

Severity: Medium

Evidence:

- `src/main.jsx:15-20` registers `/sw.js`
- `public/sw.js` is absent

Impact:

- production console noise
- misleading offline story
- incomplete PWA behavior

### 13. Lint Failures in Current Main Branch

Severity: Medium

Validation result:

- `npm run lint` exits with 3 errors

Current findings:

- `src/App.jsx:195` unused `t`
- `src/components/SettingsPanel.jsx:6` unused `toggleTheme`
- `src/contexts/AppContext.jsx:152` react-refresh export pattern issue

Impact:

- baseline code quality is already failing
- modernization work should not build on a red lint baseline

### 14. Guestbook / Contact / Comment Responsibilities Are Mixed

Severity: Medium

Evidence:

- `README.md:5-20` describes a guestbook as a main product feature
- current contact section is a Formspree contact form at `src/App.jsx:1058-1078`
- blog comments exist separately in `src/App.jsx:707-765`

Impact:

- feature intent is unclear
- content boundaries are muddled
- future domain decomposition needs product clarification

### 15. Hardcoded and Placeholder Content Is Widespread

Severity: Medium

Examples:

- `src/App.jsx:199-200` hardcoded site start date
- `src/App.jsx:264-265` hardcoded display identity in sidebar
- `src/App.jsx:403` hardcoded music file
- `src/App.jsx:416-419` placeholder social links
- `src/App.jsx:1070` hardcoded Formspree endpoint
- `src/dataService.js:326-348` duplicated default profile content

Impact:

- configuration/content are not separated from code
- migration to CMS/admin/content platform will require extraction work

### 16. No True Test Suite

Severity: Medium

Evidence:

- only test-like artifact is `test-date-formatter.html`
- no unit/integration/e2e test setup is present

Impact:

- refactor safety net is minimal
- regression risk is high during modularization

## F. Modules That Can Be Reused

Reuse here means "worth preserving or extracting," not "drop in unchanged."

### Strong Reuse Candidates

#### `src/utils/dateFormatter.js`

Why reusable:

- isolated utility
- small surface area
- easy to port into shared library

Needed cleanup:

- move relative-time strings to i18n

#### `src/locales/en.json`, `src/locales/zh.json`, `src/locales/ja.json`

Why reusable:

- already separate content from code for many labels

Needed cleanup:

- complete missing hardcoded UI strings
- define translation ownership rules

#### `src/contexts/AppContext.jsx`

Why reusable:

- contains useful theme/i18n state patterns

Needed cleanup:

- split i18n and theme concerns
- remove duplicate `localStorage` writes
- move constants/hooks to Fast Refresh-safe structure

#### `src/ErrorBoundary.jsx`

Why reusable:

- clear UI fallback pattern

Needed cleanup:

- move strings to i18n
- move styling to shared UI system

#### `src/components/SettingsPanel.jsx`

Why reusable:

- useful feature concept for language/theme settings

Needed cleanup:

- remove inline styles
- fix lint issue
- align with future settings architecture

#### `src/dataService.js`

Why reusable:

- very useful as a map of existing Firestore collections and current domain boundaries

Important caveat:

- reuse more as migration reference than as final implementation
- current fallback/cache semantics should not be carried forward unchanged

#### Static media in `public/`

Why reusable:

- content assets can be retained independently of architecture

## G. Modules That Should Be Rewritten From Scratch

### 1. `src/App.jsx`

Reason:

- monolithic file combines too many layers
- best replaced with route-based modules and shared layout primitives

### 2. Routing and Navigation Layer

Reason:

- current tab-state routing is not scalable
- should become URL-based with real route boundaries

### 3. Admin and Authorization Model

Reason:

- admin is only "non-anonymous user"
- full-stack platform needs explicit roles, protected routes, audited permissions, and server-enforced policies

### 4. Browser-Direct Firestore Mutation Flows

Reason:

- current model couples UI directly to persistence
- should be replaced by server/API actions or at minimum a strict domain service boundary

### 5. Blog / Comment / Like Domain Layer

Reason:

- logic is split between UI and service layer
- content moderation, validation, slugging, routing, and SEO are absent

### 6. Works / Photos CRUD Flows

Reason:

- writes bypass shared service layer
- no upload/storage workflow
- likely better as dedicated content modules

### 7. Styling System

Reason:

- current inline-style-heavy approach will slow every future change
- refactor should establish a shared UI layer and one styling strategy

### 8. Offline/Cache Strategy

Reason:

- current local fallback creates false-success semantics
- should be replaced by explicit draft/offline queue behavior or removed

### 9. Documentation Set

Reason:

- repo docs are materially inaccurate
- modernization should ship with docs generated from real architecture

## H. Migration Difficulty Estimation

### Overall Estimate

Medium-High to High

Recommended score: 8/10

### Why It Is Not a Low-Difficulty Refactor

- there is no backend to incrementally refactor; it must be introduced
- UI, data, auth, and admin concerns are heavily interwoven
- one monolithic app file carries many unrelated responsibilities
- authorization rules are external and not version-controlled
- content ownership is split between locale JSON and Firestore documents

### Difficulty by Area

| Area | Difficulty | Notes |
| --- | --- | --- |
| Split monolithic SPA into modules | Medium | Mechanical but large |
| Introduce real URL routing | Medium | Straightforward, but touches all sections |
| Build backend/API layer | High | No current backend exists |
| Redesign auth and admin permissions | High | Current model is not platform-grade |
| Migrate Firestore access patterns | Medium-High | Data paths are known, but writes are duplicated |
| Replace style architecture | Medium | Large surface, low conceptual risk |
| Add test coverage | Medium | Necessary before major refactor |
| Repair docs and architecture visibility | Low-Medium | Important but not technically hard |

### Practical Migration Sequencing

Recommended order:

1. Freeze current behavior with a content/domain inventory and screenshots.
2. Extract shared schema knowledge from current Firestore usage.
3. Introduce route-based frontend structure without changing data source yet.
4. Introduce server/API or backend-for-frontend boundary.
5. Redesign auth/admin roles and move writes behind that boundary.
6. Split blog, works, photos, profile, contact into domain modules.
7. Replace styling system and clean i18n/content ownership.
8. Add tests around critical paths before final data migration.

## I. Trace Summary

### Actual App Entry

- `index.html:11-12`
- `src/main.jsx:23-31`

### Actual Server Startup Entry

- dev: `package.json:7`
- preview: `package.json:10`
- deploy build: `package.json:11-12`

There is no custom server startup file.

### Actual Route Entry Points

- desktop nav: `src/App.jsx:243-297`
- mobile nav: `src/App.jsx:299-334`
- render switch: `src/App.jsx:1106-1111`

### Actual Data Flow Entry Points

- Firebase bootstrap: `src/firebase.js:1-101`
- shared data layer: `src/dataService.js:124-495`
- direct Firestore bypasses in UI:
  - comments: `src/App.jsx:712-734`
  - likes: `src/App.jsx:802-815`
  - works write: `src/App.jsx:994-1000`
  - photo write: `src/App.jsx:1023-1025`

## J. Final Assessment

This codebase is a workable small personal SPA, but not yet a modular platform foundation. Its current strength is that the domain is small and the data model is still understandable. Its main weakness is that almost every architectural concern is concentrated in the browser and often inside a single file.

If the goal is a modern modular full-stack rebuild, the correct framing is:

- preserve content, assets, translation resources, and schema knowledge
- do not preserve the current app structure as the target architecture
- create backend, routing, auth, and module boundaries deliberately rather than incrementally stretching the current SPA

## Validation Notes

Commands run during audit:

- repository tree scan
- config/source inspection
- `npm run lint`

Lint result:

- failed with 3 current errors

Build was not run because it would regenerate `dist/` and this audit intentionally avoided source/build output churn.
