import {
  TIMER_SESSION_TYPES,
  timerSessionLabels,
} from '../../state/studyRoomReducer.js'

const SESSION_COPY = Object.freeze({
  [TIMER_SESSION_TYPES.work]: Object.freeze({
    status: Object.freeze({
      idle: 'Focus Ready',
      paused: 'Focus Held',
      running: 'Focused Flow',
    }),
    hintText: 'Focus Session Running',
    metadataTone: 'Deep Work Window',
  }),
  [TIMER_SESSION_TYPES.shortBreak]: Object.freeze({
    status: Object.freeze({
      idle: 'Short Break Ready',
      paused: 'Break Held',
      running: 'Gentle Reset',
    }),
    hintText: 'Gentle Break Time',
    metadataTone: 'Soft Recovery Window',
  }),
  [TIMER_SESSION_TYPES.longBreak]: Object.freeze({
    status: Object.freeze({
      idle: 'Long Break Ready',
      paused: 'Recovery Held',
      running: 'Deep Recovery',
    }),
    hintText: 'Long Recovery Interval',
    metadataTone: 'Calm Reset Window',
  }),
})

function getSessionCopy(sessionType = TIMER_SESSION_TYPES.work) {
  return SESSION_COPY[sessionType] ?? SESSION_COPY[TIMER_SESSION_TYPES.work]
}

export function getSessionPresentation(
  sessionType = TIMER_SESSION_TYPES.work,
  timerStatus = 'idle',
) {
  const sessionCopy = getSessionCopy(sessionType)

  return {
    statusText: sessionCopy.status[timerStatus] ?? sessionCopy.status.idle,
    hintText: sessionCopy.hintText,
    metadataTone: sessionCopy.metadataTone,
    sessionLabel:
      timerSessionLabels[sessionType] ?? timerSessionLabels[TIMER_SESSION_TYPES.work],
  }
}

export function getAutomaticTransitionCue(transition) {
  if (!transition) return null

  if (transition.fromSessionType === TIMER_SESSION_TYPES.work) {
    return {
      title: 'Focus Complete',
      subtitle:
        transition.toSessionType === TIMER_SESSION_TYPES.longBreak
          ? 'Long Break'
          : 'Short Break',
      sessionType: transition.toSessionType,
    }
  }

  return {
    title: 'Back To Focus',
    subtitle: timerSessionLabels[TIMER_SESSION_TYPES.work],
    sessionType: TIMER_SESSION_TYPES.work,
  }
}
