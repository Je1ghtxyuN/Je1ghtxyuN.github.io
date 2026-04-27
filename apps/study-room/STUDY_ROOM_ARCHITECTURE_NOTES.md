# Study Room Architecture Notes

## Purpose Of This Scaffold

This application is the independent interactive study environment in the long-term platform split.

The scaffold is intentionally minimal today. It is only preparing the app boundary and future feature organization, not implementing the actual product yet.

## Planned Future Capability Areas

- focus timer
- todo/task capture
- ambient music and audio controls
- login and user identity flows
- study statistics and session history

## Current Structural Direction

- `src/features/timer/` for future timer logic and UI
- `src/features/todo/` for task capture and task management
- `src/features/ambient-music/` for player state and ambience controls
- `src/features/auth/` for login and identity-related UI
- `src/features/study-statistics/` for session summaries and persisted study data
- `src/components/` for shared UI pieces
- `src/layouts/` for top-level screen composition
- `src/lib/` for app-local utilities and future API client code

## Why This App Stays Separate

- the Study Room has different runtime needs from the static blog portal
- it needs room for interactive state, longer browser sessions, and future account-linked data
- keeping it separate avoids forcing Hexo to carry application concerns it should not own

## Current Scope Boundary

- Vite + React scaffold created
- no feature implementation yet
- no shared auth or backend integration yet
- no final design system or state model locked yet
