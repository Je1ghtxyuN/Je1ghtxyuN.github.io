import { useStudyRoomState } from '../../state/useStudyRoom.js'

export function StudyStatisticsPanel() {
  const { timer } = useStudyRoomState()

  return (
    <section className="floating-widget">
      <div className="floating-widget__header">
        <div>
          <p className="floating-widget__eyebrow">Statistics</p>
          <h2 className="floating-widget__title">Session counters</h2>
          <p className="floating-widget__copy">
            The reducer already tracks completed sessions so this feature has a
            stable surface for future persistence and analytics.
          </p>
        </div>
        <span className="floating-widget__badge">Local</span>
      </div>

      <div className="widget-metrics">
        <div className="widget-metric">
          <span className="widget-metric__value">
            {timer.completedWorkSessions}
          </span>
          <span className="widget-metric__label">Completed work sessions</span>
        </div>

        <div className="widget-metric">
          <span className="widget-metric__value">
            {timer.completedBreakSessions}
          </span>
          <span className="widget-metric__label">Completed breaks</span>
        </div>
      </div>

      <p className="floating-widget__meta">
        Future backend sync can store session history, streaks, and per-user
        study summaries without changing how the timer feature reports completion.
      </p>
    </section>
  )
}
