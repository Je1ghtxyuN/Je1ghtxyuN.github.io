import { TIMER_SESSION_TYPES } from '../../state/studyRoomReducer.js'

export function getSessionPresentation(
  sessionType = TIMER_SESSION_TYPES.work,
  timerStatus = 'idle',
  t,
) {
  const sessionKey =
    sessionType === TIMER_SESSION_TYPES.shortBreak
      ? 'shortBreak'
      : sessionType === TIMER_SESSION_TYPES.longBreak
        ? 'longBreak'
        : 'work'

  return {
    statusText: t(
      `studyRoom.timer.status.${sessionKey}.${timerStatus}`,
      {},
      t(
        `studyRoom.timer.status.${sessionKey}.idle`,
        {},
        'Focus Ready',
      ),
    ),
    hintText: t(
      `studyRoom.timer.hint.${sessionKey}`,
      {},
      'Focus Session Running',
    ),
    metadataTone: t(
      `studyRoom.timer.metadataTone.${sessionKey}`,
      {},
      'Deep Work Window',
    ),
  }
}

export function getAutomaticTransitionCue(transition, t) {
  if (!transition) return null

  if (transition.fromSessionType === TIMER_SESSION_TYPES.work) {
    return {
      title: t('studyRoom.cues.focusComplete', {}, 'Focus Complete'),
      subtitle:
        transition.toSessionType === TIMER_SESSION_TYPES.longBreak
          ? t('studyRoom.cues.longBreak', {}, 'Long Break')
          : t('studyRoom.cues.shortBreak', {}, 'Short Break'),
      sessionType: transition.toSessionType,
    }
  }

  return {
    title: t('studyRoom.cues.backToFocus', {}, 'Back To Focus'),
    subtitle: t('studyRoom.cues.workSession', {}, 'Work Session'),
    sessionType: TIMER_SESSION_TYPES.work,
  }
}
