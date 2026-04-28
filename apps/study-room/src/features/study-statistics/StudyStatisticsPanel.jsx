import { useStudyRoomLocale } from '../../i18n/useStudyRoomLocale.js'
import { useStudyRoomState } from '../../state/useStudyRoom.js'

export function StudyStatisticsPanel() {
  const { timer } = useStudyRoomState()
  const { t } = useStudyRoomLocale()

  return (
    <section className="floating-widget">
      <div className="floating-widget__header">
        <div>
          <p className="floating-widget__eyebrow">
            {t('studyRoom.statistics.eyebrow', {}, 'Statistics')}
          </p>
          <h2 className="floating-widget__title">
            {t('studyRoom.statistics.title', {}, 'Session counters')}
          </h2>
          <p className="floating-widget__copy">
            {t(
              'studyRoom.statistics.intro',
              {},
              'The reducer already tracks completed sessions so this feature has a stable surface for future persistence and analytics.',
            )}
          </p>
        </div>
        <span className="floating-widget__badge">
          {t('common.local', {}, 'Local')}
        </span>
      </div>

      <div className="widget-metrics">
        <div className="widget-metric">
          <span className="widget-metric__value">
            {timer.completedWorkCycles}
          </span>
          <span className="widget-metric__label">
            {t(
              'studyRoom.statistics.completedPomodoros',
              {},
              'Completed Pomodoros',
            )}
          </span>
        </div>

        <div className="widget-metric">
          <span className="widget-metric__value">
            {timer.completedBreakSessions}
          </span>
          <span className="widget-metric__label">
            {t(
              'studyRoom.statistics.completedBreaks',
              {},
              'Completed breaks',
            )}
          </span>
        </div>
      </div>

      <p className="floating-widget__meta">
        {t(
          'studyRoom.statistics.futureCopy',
          {},
          'Future backend sync can store session history, streaks, and per-user study summaries without changing how the timer feature reports completion.',
        )}
      </p>
    </section>
  )
}
