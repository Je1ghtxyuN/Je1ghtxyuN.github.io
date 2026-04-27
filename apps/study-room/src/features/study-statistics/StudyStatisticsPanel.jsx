import { useStudyRoomState } from '../../state/useStudyRoom.js'

export function StudyStatisticsPanel() {
  const { timer } = useStudyRoomState()

  return (
    <section className="feature-card">
      <div className="feature-card__header">
        <div>
          <h2>Study Statistics Placeholder</h2>
          <p className="feature-card__copy">
            The reducer already tracks completed sessions so this feature has a
            stable surface for future persistence and analytics.
          </p>
        </div>
        <span className="feature-card__badge">Local</span>
      </div>

      <div className="feature-card__row">
        <div className="feature-card__stat">
          <span className="feature-card__stat-value">
            {timer.completedWorkSessions}
          </span>
          <span className="feature-card__stat-label">Completed work sessions</span>
        </div>

        <div className="feature-card__stat">
          <span className="feature-card__stat-value">
            {timer.completedBreakSessions}
          </span>
          <span className="feature-card__stat-label">Completed breaks</span>
        </div>
      </div>

      <p className="feature-card__meta">
        Future backend sync can store session history, streaks, and per-user
        study summaries without changing how the timer feature reports completion.
      </p>
    </section>
  )
}
