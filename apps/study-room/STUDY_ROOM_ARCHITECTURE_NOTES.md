# Study Room Architecture Notes

## Purpose Of This Application

The Study Room is the independent interactive focus application in the long-term platform split.

This phase keeps the new mode-based state architecture, but intentionally shifts the presentation philosophy from widget-first to scene-first.

The background scene is now the visual protagonist. Timer, chrome, and utility surfaces are treated as attached overlays rather than separate product cards.

## Feature Structure

Current feature modules:

- `src/features/timer/`
  - Pomodoro session logic
  - start, pause, reset, session switching
  - configurable work and break durations
  - timer engine hook that drives countdown updates

- `src/features/todo/`
  - lightweight local task capture
  - isolated reducer so future persistence can be added without touching timer logic

- `src/features/ambient-music/`
  - local audio controller
  - play, pause, previous, next, track selection
  - volume wiring through shared preferences

- `src/features/auth/`
  - placeholder module for future backend-owned login and session handoff

- `src/features/study-statistics/`
  - placeholder presentation backed by reducer-level completed-session counters

Each feature now has an `index.js` entry point so future page-level composition can stay stable even if internal files grow.

## App Shell And Routing

Top-level app structure:

- `src/app/AppRouter.jsx`
- `src/app/AppShell.jsx`
- `src/app/StudyChromeWidget.jsx`
- `src/app/pages/StudyPage.jsx`
- `src/app/PanelOverlay.jsx`
- `src/app/panels/SettingsPanelContent.jsx`
- `src/components/BackgroundLayer.jsx`
- `src/layouts/StudyLayout.jsx`

Routing decision:

- `BrowserRouter` is used with `basename={import.meta.env.BASE_URL}`
- Vite development keeps the app at `http://localhost:5173`
- production builds use the `/study-app/` base path
- the former `/settings` path now redirects back to `/` because settings live in panel mode instead of a dedicated route

This keeps the existing portal handoff contract stable while allowing the interaction model to move away from route-first settings screens.

## Background System

The app now uses a dedicated fixed background layer:

- `src/components/BackgroundLayer.jsx`
- `src/lib/studyScene.js`

Current design rules:

- the background is rendered at the root app shell level
- it uses `position: fixed` and does not participate in normal layout flow
- the background scene is configurable through `src/lib/studyScene.js`
- each scene now carries a stable identity plus `mediaType`, `mediaSrc`, poster image, `idleOverlayStrength`, `focusOverlayStrength`, `ambientGlow`, and future media fields
- each scene now also carries `reactiveAtmosphere` definitions so the same video can respond differently during work, short-break, and long-break states
- the current code now ships three real local loop-video scenes sourced from `packages/shared-assets/videos/`:
  - `coastal-cafe` -> `1.mp4`
  - `retro-desk` -> `2.mp4`
  - `aquarium-room` -> `3.mp4`
- `BackgroundLayer.jsx` treats the media itself as the protagonist and only adds cinematic overlay, vignette, grain, and glow layers for readability and atmosphere
- `AppShell.jsx` now resolves a scene presentation object from the selected scene, current Pomodoro session type, and current UI mode before passing it into `BackgroundLayer.jsx`
- focus mode uses a stronger cinematic overlay and ambient glow instead of hiding the scene behind a large timer card
- video scenes autoplay muted, loop, play inline, and fade in over their own poster frame so scene changes stay smooth

This allows the Study Room to grow into a more atmospheric experience without pushing visual concerns into feature components.

## Atmosphere System

This pass formalizes the difference between a structural background and a real scene system.

Current atmosphere rules:

- scene identity is reducer-friendly and stored through shared preferences via `selectedSceneId`
- scene switching happens immediately and does not require route changes
- background media is designed to accept either static illustration or future video/live wallpaper fields
- overlays are strength-based so focus and idle states can reuse the same scene definition without duplicating theme logic
- session-aware ambience is now part of the contract:
  - `work` uses slightly tighter overlays, lower brightness, firmer vignette, and faster motion timing
  - `shortBreak` softens the darkness and glow behavior so the scene relaxes briefly
  - `longBreak` is the calmest state, with the lightest overlays and slowest motion feel
- `resolveStudyScenePresentation()` is the key helper that combines:
  - selected scene identity
  - current `sessionType`
  - current `uiMode`
  - future scene-pack overrides
- subtle animation lives in CSS and decorates the scene rather than becoming foreground UI motion
- focus mode now adds gentle vignette pulse, faint overlay drift, and lightweight grain motion without introducing heavy animation libraries

This keeps visual reactivity scene-driven instead of scattering conditionals across unrelated UI components.

## Mode-Based Interaction Model

The Study Room now has three UI modes stored in reducer state:

- `idle`
  - default floating state
  - small timer entry is shown
  - panel launcher remains visible

- `focus`
  - immersive active-timer state
  - timer grows larger and moves to the visual center
  - other widgets are hidden

- `panel`
  - overlay state for secondary surfaces
  - used for todo, music, statistics, and settings
  - returns to the previous non-panel mode when closed

This state lives alongside the existing timer and preference state so the interaction model can evolve without rewriting the core timer engine.

## Simplified Layout Usage

`src/layouts/StudyLayout.jsx` still exists, but it is now used more narrowly.

Current usage:

- `idle` mode uses top-center chrome and a lightly elevated timer entry
- `focus` mode uses center as the primary interaction space
- footer space is reserved only for lightweight focus hints
- panel content is no longer placed into persistent layout zones

This removes the empty-zone feeling from the previous floating widget arrangement while preserving a reusable placement shell.

## Shared State Design

Global state is now managed through:

- `src/state/studyRoomReducer.js`
- `src/state/StudyRoomProvider.jsx`

Current reducer domains:

- `timer`
  - `sessionType`
  - `status`
  - `remainingSeconds`
  - `durations`
  - `longBreakInterval`
  - `lastTickAt`
  - `completedWorkCycles`
  - `completedBreakSessions`
  - `lastAutoTransition`

- `preferences`
  - `soundEnabled`
  - `selectedSceneId`
  - `selectedTrackId`
  - `timerDisplayMode`
  - `volume`

- `ui`
  - `mode`
  - `activePanel`
  - `previousMode`

Why this shape was chosen:

- timer state is shared across routes
- music preferences and future user settings need a single source of truth
- the reducer can later hydrate from local storage or backend APIs without changing feature APIs
- the timer and statistics features already communicate through the same state contract
- the interaction mode now lives beside feature state rather than inside one page component

## Timer Logic Design

The timer uses a reducer-backed session model instead of isolated component state.

Important mechanics:

- `timer/start` records a `lastTickAt` timestamp
- `useTimerEngine()` runs a lightweight interval while the timer is active
- `timer/tick` computes elapsed whole seconds from timestamps rather than assuming perfect interval timing
- the timer now behaves as a real Pomodoro state machine with `work`, `shortBreak`, and `longBreak`
- when a work session finishes naturally:
  - `completedWorkCycles` increments
  - if the completed cycle count hits `longBreakInterval`, the reducer auto-rolls into `longBreak`
  - otherwise it auto-rolls into `shortBreak`
- when any break session finishes naturally, the reducer auto-rolls back into `work`
- manual session switching and timer resets are intentionally separate reducer branches so they do not count as automatic Pomodoro completion

This keeps the timer deterministic and easier to extend for future persistence or sync.

## Bell Trigger Rules

The Study Room now includes a single local completion bell sourced from `packages/shared-assets/se/BreakOrWork.mp3`.

Important rules:

- the bell plays only when the reducer records an automatic rollover in the `timer/tick` completion path
- this means the bell fires for:
  - work -> short break
  - work -> long break
  - short break -> work
  - long break -> work
- the bell never fires for:
  - manual session switching
  - timer reset
  - duration edits
  - start/pause interaction

Implementation boundary:

- reducer state records `lastAutoTransition`
- `StudyRoomRuntimeEffects.jsx` observes that transition id and plays the bell only once if `preferences.soundEnabled` is enabled

## Automatic Transition Cue Layer

The Study Room now has a separate cinematic cue overlay for natural session rollover.

Rules:

- cue text appears only when the reducer records an automatic transition in `lastAutoTransition`
- manual session switching, reset, duration edits, and focus-mode changes do not trigger it
- the cue is intentionally lightweight and fades on its own after a short display window

Implementation boundary:

- `src/app/SessionTransitionCue.jsx` watches `lastAutoTransition`
- the component maps transition direction to cinematic copy such as:
  - `Focus Complete`
  - `Short Break`
  - `Long Break`
  - `Back To Focus`
- the overlay lives at the app-shell level so it can appear regardless of whether the user is in focus mode or idle mode when the timer completes

## Local Persistence

Local persistence now exists and is intentionally scoped to user-facing preferences plus timer configuration.

Persisted fields:

- `preferences.selectedSceneId`
- `preferences.soundEnabled`
- `preferences.selectedTrackId`
- `preferences.timerDisplayMode`
- `preferences.volume`
- timer work duration
- timer short-break duration
- timer long-break duration
- timer `longBreakInterval`

Persistence flow:

- `StudyRoomProvider.jsx` hydrates initial state from local storage through `studyRoomStorage.js`
- `StudyRoomRuntimeEffects.jsx` writes the persisted subset back whenever one of those persisted fields changes
- per-second countdown state is not persisted, which keeps the local save model simple and avoids storing noisy runtime values

## Timer Display Mode System

The timer engine now has a presentation-only preference layer called `timerDisplayMode`.

Supported modes:

- `center_focus`
  - keeps the immersive centered timer as the dominant focus surface
- `minimal_overlay`
  - keeps the timer visible in a smaller overlay that competes less with the video scene
- `corner_embed`
  - pushes the timer into a low-obstruction corner treatment with only essential controls visible

Important rule:

- these modes change only presentation and positioning
- timer state, Pomodoro rollover, bell rules, and focus/panel mode logic remain unchanged
- the Study Room preserves timer state while the user switches display mode
- the current phase also adds session-aware refinement on top of each display mode:
  - `center_focus` keeps the richest metadata and control treatment in focus mode
  - `minimal_overlay` reduces width and visual weight so the scene stays dominant
  - `corner_embed` stays readable while remaining the quietest on-screen timer option

## Panels Replace Persistent Widgets

Secondary surfaces no longer stay on screen all the time.

The new overlay system uses:

- `src/app/PanelOverlay.jsx`
- `src/app/panels/SettingsPanelContent.jsx`

Supported panels:

- todo
- music
- statistics
- settings

Important rule:

- timer remains the primary always-visible interaction
- todo/music/statistics/settings open only on demand
- feature logic still lives inside feature modules and is reused inside the panel system
- panel launchers are intentionally low-visibility and secondary so they do not compete with the scene

## Scene-First Chrome

The old top-left descriptive panel has been replaced by compact scene chrome:

- a minimal top-center control strip
- micro launcher buttons for panels
- a tiny brand mark instead of a large textual hero block

## Shared Identity And Locale Contract

The Study Room now consumes the same shared product contract as the portal instead of carrying isolated app-only copy.

Shared sources:

- identity and route contract: `packages/shared-config/site-identity.json`
- shared locale dictionaries: `packages/shared-assets/locales/site-ui/*.json`

Study Room locale files:

- `src/i18n/config.js`
- `src/i18n/studyRoomLocaleContext.js`
- `src/i18n/StudyRoomLocaleProvider.jsx`
- `src/i18n/useStudyRoomLocale.js`

Behavior summary:

- the default locale comes from the shared identity config
- locale selection is stored in local state and persisted to `localStorage.site-locale`
- the portal and Study Room therefore reuse the same user language preference
- missing keys fall back to the default locale bundle

Current translated Study Room UI includes:

- chrome labels and panel titles
- timer labels, session hints, and transition cues
- settings labels and descriptions
- scene names and descriptions
- music, todo, statistics, and auth placeholder UI

What is not translated in this phase:

- freeform blog post bodies
- user-authored todo content
- backend-provided content that does not exist yet

## Locale Provider Flow

The locale flow is intentionally simple:

- `config.js` imports the shared locale bundles and exports normalization plus translation helpers
- `StudyRoomLocaleProvider` reads the current locale from reducer preferences
- `useStudyRoomLocale()` exposes `locale`, `supportedLocales`, `setLocale()`, and `t()`
- feature components call `t()` for visible UI labels instead of hardcoding strings

The locale hook now lives in its own module so React Fast Refresh stays clean and eslint no longer flags mixed component and hook exports.

## Shared Persistence Behavior

The Study Room persists both app-specific preferences and the shared locale choice.

Persisted fields now include:

- `preferences.locale`
- `preferences.selectedSceneId`
- `preferences.soundEnabled`
- `preferences.selectedTrackId`
- `preferences.timerDisplayMode`
- `preferences.volume`
- work duration
- short-break duration
- long-break duration
- `longBreakInterval`

Storage behavior:

- `studyRoomStorage.js` writes the Study Room snapshot to its local storage key
- the same write also syncs `preferences.locale` into `site-locale`
- on boot, the shared `site-locale` value overrides the stored app snapshot locale when present so the portal and Study Room stay aligned after cross-app language changes

This makes language switching sticky across both apps without coupling the portal to React state.

## Deployment And Route Contract

The Study Room must keep these path assumptions stable:

- development preview stays on the Vite dev server
- production output is built for `/study-app/`
- the portal-owned descriptive landing page stays at `/study-room/`

The key files are:

- `packages/shared-config/site-identity.json`
- `vite.config.js`
- portal-side CTA generation in `apps/blog-portal/scripts/portal-renderer.js`

## Adding A New Language

To add a new shared UI language:

1. register the locale in `packages/shared-config/site-identity.json`
2. add `packages/shared-assets/locales/site-ui/<locale>.json`
3. import that bundle into `src/i18n/config.js`
4. translate the visible Study Room keys
5. keep fallback behavior intact by preserving key names

The portal will discover the new locale from shared config, and the Study Room will use it once the bundle import is added.

This keeps navigation available while avoiding a dashboard-like first impression.

## Timer As Scene Overlay

The timer is no longer presented as a heavy widget card.

Current behavior:

- idle mode shows a very small scene-entry timer near the upper-center interaction band
- focus mode shows the timer as lightweight scene text plus a subtle control rail and low-opacity scene metadata
- focus mode now also carries a very small session-aware ambient hint line such as `Focus Session Running` or `Long Recovery Interval`
- statistics and configuration are no longer embedded into the main focus view

The goal is that the user reads the timer while still visually remaining inside the atmosphere of the scene.

## Audio System Design

The ambient music feature is intentionally local-first.

Current architecture:

- a local track catalog lives in `src/features/ambient-music/tracks.js`
- `musicSources.js` now owns the track-source abstraction
- `useAmbientMusicController()` owns the browser `Audio` instance and playback transport
- playback state is managed inside the feature
- shared preferences store the selected track id and volume

For this pass, track sources are silent local placeholder data URIs. That keeps the player logic real without introducing final audio asset policy decisions too early.

Future cloud integration point:

- `musicSources.js` already separates source-provider selection from playback transport
- a future NetEase or other cloud-backed provider should attach there under a new `musicSourceType`
- the goal is to swap catalog/data origin without rewriting the playback controller or the rest of the Study Room UI

## Mode Transitions

The interaction model now uses subtle motion instead of abrupt layout swaps:

- idle to focus: timer scales up slightly and settles into a lighter scene overlay while the background overlay darkens
- focus to idle: the reverse motion returns the timer to a compact entry state
- panel open/close: overlay uses fade plus a light upward slide

These transitions are intentionally restrained so the app feels calmer and does not undermine focus.

## Focus Exit Interaction

Focus mode now supports scene click-exit:

- clicking or tapping empty scene space returns the UI to idle mode
- timer controls and panel launchers stop propagation so normal interaction is preserved

This makes focus exit feel spatial and natural instead of relying only on a small button target.

## Future Backend Integration Direction

When the backend service is ready, the Study Room should integrate in layers:

1. hydrate preferences from authenticated user settings
2. persist timer presets and selected ambience choices
3. store session completion summaries and study statistics
4. introduce auth/session handoff from the main platform

Important boundary rule:

- backend integration should plug into the provider/reducer layer and feature hooks
- feature UI should not talk to backend routes directly without shared client abstractions

## Current Scope Boundary

Implemented in this pass:

- real route shell
- reducer-based global state
- working timer logic
- working local audio controller
- placeholder auth and statistics modules
- fixed background scene system
- reusable floating zone layout
- compact floating widget presentation for timer, music, and todo
- reducer-owned `uiMode` interaction system
- overlay panels that replace always-visible secondary widgets
- scene-first chrome and timer overlay presentation
- selectable real local loop-video scene system with immediate switching
- atmospheric timer overlay treatment
- professional three-phase Pomodoro state machine
- local bell cue on automatic completion rollover only
- local persistence for scene selection, sound, track selection, volume, durations, and long-break interval
- persisted timer display preference with multiple visual timer modes
- product-style grouped settings center for scene, timer display, timer behavior, and future music architecture
- background scene structure prepared for future live or animated scene support

Still intentionally not final:

- final polished visual design
- final ambience catalog
- login flow
- backend persistence
- advanced study analytics
