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
- the current code now ships three real local loop-video scenes sourced from `packages/shared-assets/videos/`:
  - `coastal-cafe` -> `1.mp4`
  - `retro-desk` -> `2.mp4`
  - `aquarium-room` -> `3.mp4`
- `BackgroundLayer.jsx` treats the media itself as the protagonist and only adds cinematic overlay, vignette, grain, and glow layers for readability and atmosphere
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
- subtle animation lives in CSS and decorates the scene rather than becoming foreground UI motion
- focus mode now adds gentle vignette pulse, faint overlay drift, and lightweight grain motion without introducing heavy animation libraries

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

## Local Persistence

Local persistence now exists and is intentionally scoped to user-facing preferences plus timer configuration.

Persisted fields:

- `preferences.selectedSceneId`
- `preferences.soundEnabled`
- `preferences.selectedTrackId`
- `preferences.volume`
- timer work duration
- timer short-break duration
- timer long-break duration
- timer `longBreakInterval`

Persistence flow:

- `StudyRoomProvider.jsx` hydrates initial state from local storage through `studyRoomStorage.js`
- `StudyRoomRuntimeEffects.jsx` writes the persisted subset back whenever one of those persisted fields changes
- per-second countdown state is not persisted, which keeps the local save model simple and avoids storing noisy runtime values

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

This keeps navigation available while avoiding a dashboard-like first impression.

## Timer As Scene Overlay

The timer is no longer presented as a heavy widget card.

Current behavior:

- idle mode shows a very small scene-entry timer near the upper-center interaction band
- focus mode shows the timer as lightweight scene text plus a subtle control rail and low-opacity scene metadata
- statistics and configuration are no longer embedded into the main focus view

The goal is that the user reads the timer while still visually remaining inside the atmosphere of the scene.

## Audio System Design

The ambient music feature is intentionally local-first.

Current architecture:

- a small track catalog lives in `src/features/ambient-music/tracks.js`
- `useAmbientMusicController()` owns the browser `Audio` instance
- playback state is managed inside the feature
- shared preferences store the selected track id and volume

For this pass, track sources are silent local placeholder data URIs. That keeps the player logic real without introducing final audio asset policy decisions too early.

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
- background scene structure prepared for future live or animated scene support

Still intentionally not final:

- final polished visual design
- final ambience catalog
- login flow
- backend persistence
- advanced study analytics
