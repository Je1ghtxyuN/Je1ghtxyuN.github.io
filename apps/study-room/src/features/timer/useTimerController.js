import {
  useStudyRoomActions,
  useStudyRoomState,
} from '../../state/useStudyRoom.js'
import { timerSessionLabels } from '../../state/studyRoomReducer.js'
import { formatSecondsAsClock } from './timerUtils.js'
import { useTimerEngine } from './useTimerEngine.js'

export function useTimerController() {
  const { timer } = useStudyRoomState()
  const actions = useStudyRoomActions()

  useTimerEngine()

  return {
    timer,
    sessionLabel: timerSessionLabels[timer.sessionType],
    formattedRemaining: formatSecondsAsClock(timer.remainingSeconds),
    startTimer: actions.startTimer,
    pauseTimer: actions.pauseTimer,
    resetTimer: actions.resetTimer,
    setSession: actions.setSession,
    setTimerConfiguration: actions.setTimerConfiguration,
  }
}
