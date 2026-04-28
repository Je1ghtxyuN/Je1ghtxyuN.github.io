import { SITE_LOCALE_STORAGE_KEY } from '../i18n/config.js'

const STORAGE_KEY = 'study-room-state:v3'

const secondsToMinutes = (seconds) => Math.round(Number(seconds || 0) / 60)

export function createPersistedStudyRoomPayload(state) {
  return {
    preferences: {
      locale: state.preferences.locale,
      selectedSceneId: state.preferences.selectedSceneId,
      soundEnabled: state.preferences.soundEnabled,
      selectedTrackId: state.preferences.selectedTrackId,
      timerDisplayMode: state.preferences.timerDisplayMode,
      volume: state.preferences.volume,
    },
    timerConfig: {
      workMinutes: secondsToMinutes(state.timer.durations.work),
      shortBreakMinutes: secondsToMinutes(state.timer.durations.shortBreak),
      longBreakMinutes: secondsToMinutes(state.timer.durations.longBreak),
      longBreakInterval: state.timer.longBreakInterval,
    },
  }
}

export function readPersistedStudyRoomState() {
  if (typeof window === 'undefined') return null

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY)
    const sharedLocale = window.localStorage.getItem(SITE_LOCALE_STORAGE_KEY)

    if (!rawValue) {
      if (typeof sharedLocale === 'string' && sharedLocale.trim()) {
        return {
          preferences: {
            locale: sharedLocale,
          },
        }
      }

      return null
    }

    const parsedValue = JSON.parse(rawValue)
    const nextValue =
      parsedValue && typeof parsedValue === 'object' ? parsedValue : null

    if (nextValue && typeof sharedLocale === 'string' && sharedLocale.trim()) {
      nextValue.preferences = {
        ...(nextValue.preferences || {}),
        locale: sharedLocale,
      }
    }

    return nextValue
  } catch {
    return null
  }
}

export function writePersistedStudyRoomState(state) {
  if (typeof window === 'undefined') return

  try {
    if (state.preferences?.locale) {
      window.localStorage.setItem(
        SITE_LOCALE_STORAGE_KEY,
        state.preferences.locale,
      )
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(createPersistedStudyRoomPayload(state)),
    )
  } catch {
    // Ignore persistence failures so local-only UX never blocks the Study Room.
  }
}
