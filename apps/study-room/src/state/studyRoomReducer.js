import { DEFAULT_SCENE_ID } from '../lib/studyScene.js'
import {
  DEFAULT_LOCALE,
  normalizeLocale,
} from '../i18n/config.js'

export const TIMER_SESSION_TYPES = Object.freeze({
  work: 'work',
  shortBreak: 'shortBreak',
  longBreak: 'longBreak',
})

export const TIMER_DISPLAY_MODES = Object.freeze({
  centerFocus: 'center_focus',
  minimalOverlay: 'minimal_overlay',
  cornerEmbed: 'corner_embed',
})

const DEFAULT_DURATIONS_MINUTES = Object.freeze({
  work: 25,
  shortBreak: 5,
  longBreak: 15,
})

const DEFAULT_LONG_BREAK_INTERVAL = 4

const DEFAULT_PREFERENCES = Object.freeze({
  locale: DEFAULT_LOCALE,
  soundEnabled: true,
  selectedTrackId: 'deep-focus-placeholder',
  selectedSceneId: DEFAULT_SCENE_ID,
  timerDisplayMode: TIMER_DISPLAY_MODES.centerFocus,
  volume: 0.45,
})

const DEFAULT_UI_STATE = Object.freeze({
  mode: 'idle',
  activePanel: null,
  previousMode: 'idle',
})

const MANUAL_SESSION_TYPE_MAP = Object.freeze({
  work: TIMER_SESSION_TYPES.work,
  break: TIMER_SESSION_TYPES.shortBreak,
  shortBreak: TIMER_SESSION_TYPES.shortBreak,
  longBreak: TIMER_SESSION_TYPES.longBreak,
})

const minutesToSeconds = (minutes) => Math.round(minutes * 60)

const clampMinutes = (value, fallback) => {
  const parsed = Number(value)

  if (!Number.isFinite(parsed)) return fallback

  return Math.min(180, Math.max(1, parsed))
}

const clampInterval = (value, fallback = DEFAULT_LONG_BREAK_INTERVAL) => {
  const parsed = Number(value)

  if (!Number.isFinite(parsed)) return fallback

  return Math.min(12, Math.max(2, Math.round(parsed)))
}

const clampVolume = (value, fallback = DEFAULT_PREFERENCES.volume) => {
  const parsed = Number(value)

  if (!Number.isFinite(parsed)) return fallback

  return Math.min(1, Math.max(0, parsed))
}

const normalizeTimerConfiguration = (timerConfig = {}) => {
  const workMinutes = clampMinutes(
    timerConfig.workMinutes,
    DEFAULT_DURATIONS_MINUTES.work,
  )
  const shortBreakMinutes = clampMinutes(
    timerConfig.shortBreakMinutes,
    DEFAULT_DURATIONS_MINUTES.shortBreak,
  )
  const longBreakMinutes = clampMinutes(
    timerConfig.longBreakMinutes,
    DEFAULT_DURATIONS_MINUTES.longBreak,
  )

  return {
    durations: {
      work: minutesToSeconds(workMinutes),
      shortBreak: minutesToSeconds(shortBreakMinutes),
      longBreak: minutesToSeconds(longBreakMinutes),
    },
    longBreakInterval: clampInterval(timerConfig.longBreakInterval),
  }
}

const normalizePreferences = (preferences = {}) => ({
  locale: normalizeLocale(preferences.locale),
  soundEnabled:
    typeof preferences.soundEnabled === 'boolean'
      ? preferences.soundEnabled
      : DEFAULT_PREFERENCES.soundEnabled,
  selectedTrackId:
    typeof preferences.selectedTrackId === 'string' &&
    preferences.selectedTrackId.trim()
      ? preferences.selectedTrackId
      : DEFAULT_PREFERENCES.selectedTrackId,
  selectedSceneId:
    typeof preferences.selectedSceneId === 'string' &&
    preferences.selectedSceneId.trim()
      ? preferences.selectedSceneId
      : DEFAULT_PREFERENCES.selectedSceneId,
  timerDisplayMode:
    Object.values(TIMER_DISPLAY_MODES).includes(preferences.timerDisplayMode)
      ? preferences.timerDisplayMode
      : DEFAULT_PREFERENCES.timerDisplayMode,
  volume: clampVolume(preferences.volume),
})

const normalizeManualSessionType = (sessionType) =>
  MANUAL_SESSION_TYPE_MAP[sessionType] ?? TIMER_SESSION_TYPES.work

const isBreakSession = (sessionType) =>
  sessionType === TIMER_SESSION_TYPES.shortBreak ||
  sessionType === TIMER_SESSION_TYPES.longBreak

export const createInitialStudyRoomState = (persistedState = null) => {
  const timerConfig = normalizeTimerConfiguration(persistedState?.timerConfig)

  return {
    timer: {
      sessionType: TIMER_SESSION_TYPES.work,
      status: 'idle',
      remainingSeconds: timerConfig.durations.work,
      durations: timerConfig.durations,
      longBreakInterval: timerConfig.longBreakInterval,
      lastTickAt: null,
      completedWorkCycles: 0,
      completedBreakSessions: 0,
      lastAutoTransitionId: 0,
      lastAutoTransition: null,
    },
    preferences: normalizePreferences(persistedState?.preferences),
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

    case 'timer/set-session': {
      const sessionType = normalizeManualSessionType(action.sessionType)

      return {
        ...state,
        timer: {
          ...state.timer,
          sessionType,
          status: 'idle',
          remainingSeconds: state.timer.durations[sessionType],
          lastTickAt: null,
        },
      }
    }

    case 'timer/set-config': {
      const timerConfig = normalizeTimerConfiguration(action.config)
      const activeSessionDuration = timerConfig.durations[state.timer.sessionType]
      const remainingSeconds =
        state.timer.status === 'running'
          ? Math.min(state.timer.remainingSeconds, activeSessionDuration)
          : activeSessionDuration

      return {
        ...state,
        timer: {
          ...state.timer,
          durations: timerConfig.durations,
          longBreakInterval: timerConfig.longBreakInterval,
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

      const completedSessionType = state.timer.sessionType
      const completedWorkCycles =
        state.timer.completedWorkCycles +
        (completedSessionType === TIMER_SESSION_TYPES.work ? 1 : 0)
      const completedBreakSessions =
        state.timer.completedBreakSessions +
        (isBreakSession(completedSessionType) ? 1 : 0)

      // Automatic rollover only happens in the countdown-completion path.
      // Manual session changes and resets use dedicated reducer branches above,
      // which keeps bell cues and Pomodoro progression tied only to natural
      // timer completion.
      const nextSessionType =
        completedSessionType === TIMER_SESSION_TYPES.work
          ? completedWorkCycles % state.timer.longBreakInterval === 0
            ? TIMER_SESSION_TYPES.longBreak
            : TIMER_SESSION_TYPES.shortBreak
          : TIMER_SESSION_TYPES.work

      const nextAutoTransitionId = state.timer.lastAutoTransitionId + 1

      return {
        ...state,
        timer: {
          ...state.timer,
          sessionType: nextSessionType,
          status: 'running',
          remainingSeconds: state.timer.durations[nextSessionType],
          lastTickAt: now,
          completedWorkCycles,
          completedBreakSessions,
          lastAutoTransitionId: nextAutoTransitionId,
          lastAutoTransition: {
            id: nextAutoTransitionId,
            fromSessionType: completedSessionType,
            toSessionType: nextSessionType,
            completedAt: now,
          },
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
              : action.key === 'locale'
                ? normalizeLocale(action.value)
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
  [TIMER_SESSION_TYPES.work]: 'Work Session',
  [TIMER_SESSION_TYPES.shortBreak]: 'Short Break',
  [TIMER_SESSION_TYPES.longBreak]: 'Long Break',
})
