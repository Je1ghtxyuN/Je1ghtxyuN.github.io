import { useContext } from 'react'
import {
  StudyRoomDispatchContext,
  StudyRoomStateContext,
} from './studyRoomContext.js'

export function useStudyRoomState() {
  const value = useContext(StudyRoomStateContext)

  if (!value) {
    throw new Error('useStudyRoomState must be used inside StudyRoomProvider')
  }

  return value
}

export function useStudyRoomDispatch() {
  const value = useContext(StudyRoomDispatchContext)

  if (!value) {
    throw new Error('useStudyRoomDispatch must be used inside StudyRoomProvider')
  }

  return value
}

export function useStudyRoomActions() {
  const dispatch = useStudyRoomDispatch()

  return {
    startTimer() {
      dispatch({ type: 'timer/start', now: Date.now() })
    },
    pauseTimer() {
      dispatch({ type: 'timer/pause' })
    },
    resetTimer() {
      dispatch({ type: 'timer/reset' })
    },
    setSession(sessionType) {
      dispatch({ type: 'timer/set-session', sessionType })
    },
    setDurations(durations) {
      dispatch({ type: 'timer/set-durations', durations, now: Date.now() })
    },
    setPreference(key, value) {
      dispatch({ type: 'preferences/set', key, value })
    },
  }
}
