import { useTimerController } from './useTimerController.js'

export function TimerPanel({
  mode = 'idle',
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
      >
        <p className="scene-timer__label">Timer</p>
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
      <p className="scene-timer__label">{sessionLabel}</p>
      <div className="scene-timer__clock">{formattedRemaining}</div>

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
          className={`scene-timer__chip${timer.sessionType === 'break' ? ' scene-timer__chip--active' : ''}`}
          onClick={() => setSession('break')}
        >
          Break
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
    </section>
  )
}
