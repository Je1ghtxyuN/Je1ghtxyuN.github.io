import { useEffect, useRef } from 'react'
import bellCueSource from '../../../../packages/shared-assets/se/BreakOrWork.mp3'
import { writePersistedStudyRoomState } from './studyRoomStorage.js'
import { useStudyRoomState } from './useStudyRoom.js'
import { recordPomodoro, saveUserPrefs, fetchCurrentUser } from './studySessionRecorder.js'

export function StudyRoomRuntimeEffects() {
  const state = useStudyRoomState()
  const bellAudioRef = useRef(null)
  const lastHandledTransitionIdRef = useRef(0)
  const accumulatedWorkSecondsRef = useRef(0)
  const prevSessionTypeRef = useRef(null)
  const prevStatusRef = useRef(null)
  const prevTickRemainingRef = useRef(null)
  const { preferences, timer } = state
  const {
    locale,
    selectedSceneId,
    selectedTrackId,
    soundEnabled,
    timerDisplayMode,
    volume,
  } = preferences
  const { durations, longBreakInterval, lastAutoTransition } = timer

  useEffect(() => {
    writePersistedStudyRoomState({
      preferences: {
        locale,
        selectedSceneId,
        selectedTrackId,
        soundEnabled,
        timerDisplayMode,
        volume,
      },
      timer: {
        durations: {
          work: durations.work,
          shortBreak: durations.shortBreak,
          longBreak: durations.longBreak,
        },
        longBreakInterval,
      },
    })
  }, [
    durations.longBreak,
    durations.shortBreak,
    durations.work,
    locale,
    longBreakInterval,
    selectedSceneId,
    selectedTrackId,
    soundEnabled,
    timerDisplayMode,
    volume,
  ])

  useEffect(() => {
    const bellAudio = new Audio(bellCueSource)
    bellAudio.preload = 'auto'
    bellAudioRef.current = bellAudio

    return () => {
      bellAudio.pause()
      bellAudio.src = ''
      bellAudioRef.current = null
    }
  }, [])

  // Sync preferences to backend when logged in
  useEffect(() => {
    fetchCurrentUser().then((user) => {
      if (!user) return
      saveUserPrefs({
        selectedSceneId,
        selectedTrackId,
        timerDisplayMode,
        volume,
        soundEnabled,
        durations: {
          work: durations.work,
          shortBreak: durations.shortBreak,
          longBreak: durations.longBreak,
        },
        longBreakInterval,
      })
    })
  }, [selectedSceneId, selectedTrackId, timerDisplayMode, volume, soundEnabled, durations.work, durations.shortBreak, durations.longBreak, longBreakInterval])

  // Helper: flush accumulated seconds → minutes, send to backend, reset
  const flushAccumulatedRef = useRef(() => {})
  flushAccumulatedRef.current = () => {
    if (accumulatedWorkSecondsRef.current > 0) {
      recordPomodoro(Math.round(accumulatedWorkSecondsRef.current / 60))
      accumulatedWorkSecondsRef.current = 0
    }
  }

  // Continuous work time tracking — accumulate seconds, flush every 60s
  useEffect(() => {
    if (timer.status !== 'running' || timer.sessionType !== 'work') return

    // Track remaining seconds so we can detect natural completion vs manual switch
    prevTickRemainingRef.current = timer.remainingSeconds

    const interval = setInterval(() => {
      accumulatedWorkSecondsRef.current += 1
      if (accumulatedWorkSecondsRef.current >= 60) {
        recordPomodoro(1) // 1 minute
        accumulatedWorkSecondsRef.current -= 60
      }
    }, 1000)

    // Flush on page hide/close
    const handleBeforeUnload = () => { flushAccumulatedRef.current() }
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') flushAccumulatedRef.current()
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(interval)
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [timer.status, timer.sessionType])

  // Detect session transitions — flush remaining time + record completed work sessions
  useEffect(() => {
    const prevSession = prevSessionTypeRef.current
    const prevStatus = prevStatusRef.current
    prevSessionTypeRef.current = timer.sessionType
    prevStatusRef.current = timer.status
    if (prevSession === null) return

    // Flush any remaining accumulated seconds (convert to minutes)
    flushAccumulatedRef.current()

    // Natural work completion: timer hit zero and auto-transitioned to break
    if (prevSession === 'work' && timer.sessionType !== 'work' && prevStatus === 'running') {
      if (prevTickRemainingRef.current !== null && prevTickRemainingRef.current <= 0) {
        recordPomodoro(Math.round(durations.work / 60))
      }
    }
  }, [timer.sessionType, timer.status, durations.work])

  // Bell sound on session transition
  useEffect(() => {
    const transition = lastAutoTransition

    if (!transition) return
    if (transition.id === lastHandledTransitionIdRef.current) return

    lastHandledTransitionIdRef.current = transition.id

    if (!soundEnabled) return

    const bellAudio = bellAudioRef.current

    if (!bellAudio) return

    bellAudio.currentTime = 0
    void bellAudio.play().catch(() => {
      // Playback can be blocked until the browser receives a user gesture.
    })
  }, [lastAutoTransition, soundEnabled])

  return null
}
