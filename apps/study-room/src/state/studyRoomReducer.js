const DEFAULT_DURATIONS_MINUTES = Object.freeze({
  work: 25,
  break: 5,
})

const DEFAULT_PREFERENCES = Object.freeze({
  autoStartBreaks: false,
  autoStartWork: false,
  soundEnabled: true,
  selectedTrackId: 'deep-focus-placeholder',
  volume: 0.45,
})

const DEFAULT_UI_STATE = Object.freeze({
  mode: 'idle',
  activePanel: null,
  previousMode: 'idle',
})

const minutesToSeconds = (minutes) => Math.round(minutes * 60)

const clampMinutes = (value, fallback) => {
  const parsed = Number(value)

  if (!Number.isFinite(parsed)) return fallback

  return Math.min(180, Math.max(1, parsed))
}

const clampVolume = (value, fallback = DEFAULT_PREFERENCES.volume) => {
  const parsed = Number(value)

  if (!Number.isFinite(parsed)) return fallback

  return Math.min(1, Math.max(0, parsed))
}

const normalizeDurations = (durations = {}) => {
  const workMinutes = clampMinutes(
    durations.workMinutes,
    DEFAULT_DURATIONS_MINUTES.work,
  )
  const breakMinutes = clampMinutes(
    durations.breakMinutes,
    DEFAULT_DURATIONS_MINUTES.break,
  )

  return {
    work: minutesToSeconds(workMinutes),
    break: minutesToSeconds(breakMinutes),
  }
}

const getNextSessionType = (sessionType) =>
  sessionType === 'work' ? 'break' : 'work'

export const createInitialStudyRoomState = () => {
  const durations = normalizeDurations()

  return {
    timer: {
      sessionType: 'work',
      status: 'idle',
      remainingSeconds: durations.work,
      durations,
      lastTickAt: null,
      completedWorkSessions: 0,
      completedBreakSessions: 0,
    },
    preferences: {
      ...DEFAULT_PREFERENCES,
    },
    ui: {
      ...DEFAULT_UI_STATE,
    },
  }
}

export function studyRoomReducer(state, action) {
  switch (action.type) {
    case 'timer/start': {
      if (state.timer.status === 'running') return state

      return {
        ...state,
        timer: {
          ...state.timer,
          status: 'running',
          lastTickAt: action.now ?? Date.now(),
        },
      }
    }

    case 'timer/pause':
      return {
        ...state,
        timer: {
          ...state.timer,
          status: 'paused',
          lastTickAt: null,
        },
      }

    case 'timer/reset':
      return {
        ...state,
        timer: {
          ...state.timer,
          status: 'idle',
          remainingSeconds: state.timer.durations[state.timer.sessionType],
          lastTickAt: null,
        },
      }

    case 'timer/set-session':
      return {
        ...state,
        timer: {
          ...state.timer,
          sessionType: action.sessionType === 'break' ? 'break' : 'work',
          status: 'idle',
          remainingSeconds:
            state.timer.durations[action.sessionType === 'break' ? 'break' : 'work'],
          lastTickAt: null,
        },
      }

    case 'timer/set-durations': {
      const durations = normalizeDurations(action.durations)
      const activeSessionDuration = durations[state.timer.sessionType]
      const remainingSeconds =
        state.timer.status === 'running'
          ? Math.min(state.timer.remainingSeconds, activeSessionDuration)
          : activeSessionDuration

      return {
        ...state,
        timer: {
          ...state.timer,
          durations,
          remainingSeconds,
          lastTickAt: state.timer.status === 'running' ? action.now ?? Date.now() : null,
        },
      }
    }

    case 'timer/tick': {
      if (state.timer.status !== 'running' || !state.timer.lastTickAt) return state

      const now = action.now ?? Date.now()
      const elapsedSeconds = Math.max(
        0,
        Math.floor((now - state.timer.lastTickAt) / 1000),
      )

      if (elapsedSeconds === 0) return state

      const nextRemaining = state.timer.remainingSeconds - elapsedSeconds

      if (nextRemaining > 0) {
        return {
          ...state,
          timer: {
            ...state.timer,
            remainingSeconds: nextRemaining,
            lastTickAt: state.timer.lastTickAt + elapsedSeconds * 1000,
          },
        }
      }

      // When a session finishes, we move to the next phase and respect the
      // future-facing auto-start preferences instead of hardcoding one behavior.
      const nextSessionType = getNextSessionType(state.timer.sessionType)
      const completedWorkSessions =
        state.timer.completedWorkSessions + (state.timer.sessionType === 'work' ? 1 : 0)
      const completedBreakSessions =
        state.timer.completedBreakSessions + (state.timer.sessionType === 'break' ? 1 : 0)
      const shouldAutoStart =
        nextSessionType === 'break'
          ? state.preferences.autoStartBreaks
          : state.preferences.autoStartWork

      return {
        ...state,
        timer: {
          ...state.timer,
          sessionType: nextSessionType,
          status: shouldAutoStart ? 'running' : 'idle',
          remainingSeconds: state.timer.durations[nextSessionType],
          lastTickAt: shouldAutoStart ? now : null,
          completedWorkSessions,
          completedBreakSessions,
        },
      }
    }

    case 'preferences/set':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          [action.key]:
            action.key === 'volume'
              ? clampVolume(action.value)
              : action.value,
        },
      }

    case 'ui/set-idle':
      return {
        ...state,
        ui: {
          mode: 'idle',
          activePanel: null,
          previousMode: 'idle',
        },
      }

    case 'ui/set-focus':
      return {
        ...state,
        ui: {
          mode: 'focus',
          activePanel: null,
          previousMode: 'focus',
        },
      }

    case 'ui/open-panel': {
      const previousMode =
        state.ui.mode === 'panel' ? state.ui.previousMode : state.ui.mode

      return {
        ...state,
        ui: {
          mode: 'panel',
          activePanel: action.panel,
          previousMode,
        },
      }
    }

    case 'ui/close-panel':
      return {
        ...state,
        ui: {
          mode: state.ui.previousMode,
          activePanel: null,
          previousMode: state.ui.previousMode,
        },
      }

    default:
      return state
  }
}

export const timerSessionLabels = Object.freeze({
  work: 'Work Session',
  break: 'Break Session',
})
