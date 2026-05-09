import { useEffect, useState } from 'react'
import { useStudyRoomLocale } from '../../i18n/useStudyRoomLocale.js'
import { useStudyRoomState } from '../../state/useStudyRoom.js'
import { fetchStats } from '../../state/studySessionRecorder.js'

export function StudyStatisticsPanel() {
  const { timer } = useStudyRoomState()
  const { t } = useStudyRoomLocale()
  const [stats, setStats] = useState({ total: 0, today: 0, thisWeek: 0, totalMinutes: 0 })

  useEffect(() => {
    fetchStats().then(setStats)
  }, [timer.completedWorkCycles])

  const hours = Math.floor(stats.totalMinutes / 60)
  const mins = stats.totalMinutes % 60
  const totalTime = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`

  return (
    <section className="floating-widget">
      <div className="floating-widget__header">
        <div>
          <p className="floating-widget__eyebrow">
            {t('studyRoom.statistics.eyebrow', {}, 'Statistics')}
          </p>
          <h2 className="floating-widget__title">
            {t('studyRoom.statistics.title', {}, 'Study Stats')}
          </h2>
        </div>
        <span className="floating-widget__badge">Server</span>
      </div>

      <div className="widget-metrics">
        <div className="widget-metric">
          <span className="widget-metric__value">{timer.completedWorkCycles}</span>
          <span className="widget-metric__label">{t('studyRoom.statistics.sessionPomodoros', {}, 'This session')}</span>
        </div>
        <div className="widget-metric">
          <span className="widget-metric__value">{stats.today}</span>
          <span className="widget-metric__label">{t('studyRoom.statistics.todayPomodoros', {}, 'Today')}</span>
        </div>
        <div className="widget-metric">
          <span className="widget-metric__value">{stats.total}</span>
          <span className="widget-metric__label">{t('studyRoom.statistics.totalPomodoros', {}, 'All time')}</span>
        </div>
      </div>

      <p className="floating-widget__meta">
        {t('studyRoom.statistics.totalTime', {}, `Total focus time: ${totalTime}`)}
      </p>
    </section>
  )
}
