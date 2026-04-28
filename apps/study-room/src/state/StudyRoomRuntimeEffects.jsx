import { useEffect, useRef } from 'react'
import bellCueSource from '../../../../packages/shared-assets/se/BreakOrWork.mp3'
import { writePersistedStudyRoomState } from './studyRoomStorage.js'
import { useStudyRoomState } from './useStudyRoom.js'

export function StudyRoomRuntimeEffects() {
  const state = useStudyRoomState()
  const bellAudioRef = useRef(null)
  const lastHandledTransitionIdRef = useRef(0)
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
