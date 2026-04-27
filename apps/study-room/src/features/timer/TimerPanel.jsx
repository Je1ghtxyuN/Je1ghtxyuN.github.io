import { useState } from 'react'
import { secondsToMinutes } from './timerUtils.js'
import { useTimerController } from './useTimerController.js'

export function TimerPanel() {
  const {
    timer,
    sessionLabel,
    formattedRemaining,
    startTimer,
    pauseTimer,
    resetTimer,
    setSession,
    setDurations,
  } = useTimerController()

  const [workMinutes, setWorkMinutes] = useState(
    String(secondsToMinutes(timer.durations.work)),
  )
  const [breakMinutes, setBreakMinutes] = useState(
    String(secondsToMinutes(timer.durations.break)),
  )

  const handleDurationSubmit = (event) => {
    event.preventDefault()

    setDurations({
      workMinutes,
      breakMinutes,
    })
  }

  return (
    <section className="feature-card feature-card--wide">
      <div className="feature-card__header">
        <div>
          <h2>Pomodoro Timer Core</h2>
          <p className="feature-card__copy">
            The timer state lives in the global study room reducer so future
            backend sync can observe one stable session model.
          </p>
        </div>
        <span className="feature-card__badge">{timer.status}</span>
      </div>

      <div className="feature-card__stat">
        <span className="feature-card__stat-value">{formattedRemaining}</span>
        <span className="feature-card__stat-label">{sessionLabel}</span>
      </div>

      <div className="feature-card__session-switch">
        <button
          type="button"
          className={`button ${timer.sessionType === 'work' ? 'button--active' : 'button--ghost'}`}
          onClick={() => setSession('work')}
        >
          Work
        </button>
        <button
          type="button"
          className={`button ${timer.sessionType === 'break' ? 'button--active' : 'button--ghost'}`}
          onClick={() => setSession('break')}
        >
          Break
        </button>
      </div>

      <div className="feature-card__actions">
        <button
          type="button"
          className="button button--primary"
          onClick={startTimer}
          disabled={timer.status === 'running'}
        >
          Start
        </button>
        <button
          type="button"
          className="button button--ghost"
          onClick={pauseTimer}
          disabled={timer.status !== 'running'}
        >
          Pause
        </button>
        <button
          type="button"
          className="button button--ghost"
          onClick={resetTimer}
        >
          Reset
        </button>
      </div>

      <form className="feature-card__form" onSubmit={handleDurationSubmit}>
        <div className="feature-card__form-grid">
          <div className="field">
            <label htmlFor="work-minutes">Work minutes</label>
            <input
              id="work-minutes"
              className="input"
              type="number"
              min="1"
              max="180"
              value={workMinutes}
              onChange={(event) => setWorkMinutes(event.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="break-minutes">Break minutes</label>
            <input
              id="break-minutes"
              className="input"
              type="number"
              min="1"
              max="180"
              value={breakMinutes}
              onChange={(event) => setBreakMinutes(event.target.value)}
            />
          </div>
        </div>

        <div className="feature-card__actions">
          <button type="submit" className="button button--ghost">
            Apply Durations
          </button>
          <span className="feature-card__hint">
            Duration changes update the shared timer state without changing the
            current route or page shell.
          </span>
        </div>
      </form>
    </section>
  )
}
