import { useEffect, useRef, useState } from 'react'
import { getAutomaticTransitionCue } from '../features/timer/sessionPresentation.js'
import { useStudyRoomLocale } from '../i18n/useStudyRoomLocale.js'
import { useStudyRoomState } from '../state/useStudyRoom.js'

const CUE_DURATION_MS = 3200

export function SessionTransitionCue() {
  const {
    timer: { lastAutoTransition },
  } = useStudyRoomState()
  const { t } = useStudyRoomLocale()
  const [visibleTransitionId, setVisibleTransitionId] = useState(0)
  const lastHandledTransitionIdRef = useRef(0)

  useEffect(() => {
    if (!lastAutoTransition) return undefined
    if (lastAutoTransition.id === lastHandledTransitionIdRef.current) {
      return undefined
    }

    lastHandledTransitionIdRef.current = lastAutoTransition.id

    const cue = getAutomaticTransitionCue(lastAutoTransition, t)

    if (!cue) return undefined

    const showTimeoutId = window.setTimeout(() => {
      setVisibleTransitionId(lastAutoTransition.id)
    }, 0)

    const hideTimeoutId = window.setTimeout(() => {
      setVisibleTransitionId((currentTransitionId) =>
        currentTransitionId === lastAutoTransition.id ? 0 : currentTransitionId,
      )
    }, CUE_DURATION_MS)

    return () => {
      window.clearTimeout(showTimeoutId)
      window.clearTimeout(hideTimeoutId)
    }
  }, [lastAutoTransition, t])

  if (!lastAutoTransition || visibleTransitionId !== lastAutoTransition.id) {
    return null
  }

  const activeCue = getAutomaticTransitionCue(lastAutoTransition, t)

  if (!activeCue) return null

  return (
    <div
      className={`session-cue session-cue--${activeCue.sessionType}`}
      role="status"
      aria-live="polite"
    >
      <p className="session-cue__eyebrow">
        {t('studyRoom.cues.eyebrow', {}, 'Atmosphere Shift')}
      </p>
      <p className="session-cue__title">{activeCue.title}</p>
      <p className="session-cue__subtitle">{activeCue.subtitle}</p>
    </div>
  )
}
