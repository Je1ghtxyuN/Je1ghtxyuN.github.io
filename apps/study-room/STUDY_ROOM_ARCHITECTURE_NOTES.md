# Study Room Architecture Notes

## Purpose Of This Application

The Study Room is the independent interactive focus application in the long-term platform split.

This first implementation pass is intentionally architecture-heavy and UI-light. The goal is to lock the app shell, routing, timer logic, feature boundaries, and shared state model before visual polish begins.

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
- `src/app/pages/StudyPage.jsx`
- `src/app/pages/SettingsPage.jsx`

Routing decision:

- `BrowserRouter` is used with `basename={import.meta.env.BASE_URL}`
- Vite development keeps the app at `http://localhost:5173`
- production builds use the `/study-app/` base path

This keeps the existing portal handoff contract stable while still preparing clean app routes such as `/settings`.

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
  - `lastTickAt`
  - completed work and break counters

- `preferences`
  - `autoStartBreaks`
  - `autoStartWork`
  - `soundEnabled`
  - `selectedTrackId`
  - `volume`

Why this shape was chosen:

- timer state is shared across routes
- music preferences and future user settings need a single source of truth
- the reducer can later hydrate from local storage or backend APIs without changing feature APIs
- the timer and statistics features already communicate through the same state contract

## Timer Logic Design

The timer uses a reducer-backed session model instead of isolated component state.

Important mechanics:

- `timer/start` records a `lastTickAt` timestamp
- `useTimerEngine()` runs a lightweight interval while the timer is active
- `timer/tick` computes elapsed whole seconds from timestamps rather than assuming perfect interval timing
- when a session finishes, the reducer switches to the next session type and respects the auto-start preferences

This keeps the timer deterministic and easier to extend for future persistence or sync.

## Audio System Design

The ambient music feature is intentionally local-first.

Current architecture:

- a small track catalog lives in `src/features/ambient-music/tracks.js`
- `useAmbientMusicController()` owns the browser `Audio` instance
- playback state is managed inside the feature
- shared preferences store the selected track id and volume

For this pass, track sources are silent local placeholder data URIs. That keeps the player logic real without introducing final audio asset policy decisions too early.

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

Still intentionally not final:

- polished visual design
- final ambience catalog
- login flow
- backend persistence
- advanced study analytics
