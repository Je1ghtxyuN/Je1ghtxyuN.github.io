import { useTimerController } from './useTimerController.js'

export function TimerPanel({
  mode = 'idle',
  sceneLabel = 'Coastal Cafe',
  timerStatus,
  onEnterFocus,
  onExitFocus,
}) {
  const {
    timer,
    sessionLabel,
    formattedRemaining,
    startTimer,
    pauseTimer,
    resetTimer,
    setSession,
  } = useTimerController()
  const focusStatusText =
    timer.status === 'running' ? 'Pomodoro Running' : 'Pomodoro Ready'
  const sceneMetaText = `${sceneLabel} Active`
  const workSessionsUntilLongBreak =
    timer.longBreakInterval -
    (timer.completedWorkCycles % timer.longBreakInterval)
  const nextBreakHint =
    timer.sessionType === 'work'
      ? workSessionsUntilLongBreak === 1
        ? 'Long Break Next'
        : `Long Break In ${workSessionsUntilLongBreak}`
      : 'Automatic Return To Work'

  const handleIdleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onEnterFocus()
    }
  }

  if (mode === 'idle') {
    const handleIdlePrimaryAction = () => {
      if (timer.status !== 'running') {
        startTimer()
      }

      onEnterFocus()
    }

    return (
      <section
        className="scene-timer scene-timer--idle"
        onClick={onEnterFocus}
        role="button"
        tabIndex={0}
        onKeyDown={handleIdleKeyDown}
      >
        <p className="scene-timer__ambient">{sceneLabel}</p>
        <div className="scene-timer__clock scene-timer__clock--idle">
          {formattedRemaining}
        </div>
        <button
          type="button"
          className="scene-timer__primary"
          onClick={(event) => {
            event.stopPropagation()
            handleIdlePrimaryAction()
          }}
        >
          {timerStatus === 'running' ? 'Resume Focus' : 'Start'}
        </button>
      </section>
    )
  }

  const handleFocusPrimaryAction = () => {
    if (timer.status === 'running') {
      pauseTimer()
      return
    }

    startTimer()
  }

  return (
    <section className="scene-timer scene-timer--focus">
      <p className="scene-timer__status">{focusStatusText}</p>
      <div className="scene-timer__clock">{formattedRemaining}</div>
      <p className="scene-timer__ambient scene-timer__ambient--focus">
        {sessionLabel} · {sceneMetaText} · {nextBreakHint}
      </p>

      <div className="scene-timer__session-switch">
        <button
          type="button"
          className={`scene-timer__chip${timer.sessionType === 'work' ? ' scene-timer__chip--active' : ''}`}
          onClick={() => setSession('work')}
        >
          Work
        </button>
        <button
          type="button"
          className={`scene-timer__chip${timer.sessionType === 'shortBreak' ? ' scene-timer__chip--active' : ''}`}
          onClick={() => setSession('shortBreak')}
        >
          Short Break
        </button>
        <button
          type="button"
          className={`scene-timer__chip${timer.sessionType === 'longBreak' ? ' scene-timer__chip--active' : ''}`}
          onClick={() => setSession('longBreak')}
        >
          Long Break
        </button>
      </div>

      <div className="scene-timer__actions">
        <button
          type="button"
          className="scene-timer__control scene-timer__control--primary"
          onClick={handleFocusPrimaryAction}
        >
          {timer.status === 'running' ? 'Pause' : 'Start'}
        </button>
        <button
          type="button"
          className="scene-timer__control"
          onClick={resetTimer}
        >
          Reset
        </button>
        <button
          type="button"
          className="scene-timer__control"
          onClick={onExitFocus}
        >
          Exit
        </button>
      </div>

      <p className="scene-timer__status scene-timer__status--secondary">
        Completed Pomodoros {timer.completedWorkCycles} · Long break every{' '}
        {timer.longBreakInterval}
      </p>
    </section>
  )
}
