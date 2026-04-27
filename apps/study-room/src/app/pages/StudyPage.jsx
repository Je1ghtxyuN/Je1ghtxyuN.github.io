import { AmbientMusicPanel } from '../../features/ambient-music/index.js'
import { AuthPlaceholderCard } from '../../features/auth/index.js'
import { StudyStatisticsPanel } from '../../features/study-statistics/index.js'
import { TimerPanel } from '../../features/timer/index.js'
import { TodoPanel } from '../../features/todo/index.js'

export function StudyPage() {
  return (
    <div className="study-page">
      <section className="study-page__intro">
        <h2>Core Runtime Surface</h2>
        <p>
          The Study Room now has a real application shell: the timer owns the
          main session state, music has a controllable local playback layer, and
          future auth and statistics modules already have stable feature slots.
        </p>
      </section>

      <div className="study-page__grid">
        <TimerPanel />
        <AmbientMusicPanel />
        <TodoPanel />
        <StudyStatisticsPanel />
        <AuthPlaceholderCard />
      </div>
    </div>
  )
}
