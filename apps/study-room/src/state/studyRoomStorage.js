const STORAGE_KEY = 'study-room-state:v2'

const secondsToMinutes = (seconds) => Math.round(Number(seconds || 0) / 60)

export function readPersistedStudyRoomState() {
  if (typeof window === 'undefined') return null

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY)

    if (!rawValue) return null

    const parsedValue = JSON.parse(rawValue)
    return parsedValue && typeof parsedValue === 'object' ? parsedValue : null
  } catch {
    return null
  }
}

export function writePersistedStudyRoomState(state) {
  if (typeof window === 'undefined') return

  const payload = {
    preferences: {
      selectedSceneId: state.preferences.selectedSceneId,
      soundEnabled: state.preferences.soundEnabled,
      selectedTrackId: state.preferences.selectedTrackId,
      volume: state.preferences.volume,
    },
    timerConfig: {
      workMinutes: secondsToMinutes(state.timer.durations.work),
      shortBreakMinutes: secondsToMinutes(state.timer.durations.shortBreak),
      longBreakMinutes: secondsToMinutes(state.timer.durations.longBreak),
      longBreakInterval: state.timer.longBreakInterval,
    },
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // Ignore persistence failures so local-only UX never blocks the Study Room.
  }
}
