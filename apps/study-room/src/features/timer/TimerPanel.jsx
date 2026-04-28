import { TIMER_DISPLAY_MODES } from '../../state/studyRoomReducer.js'
import { getSessionPresentation } from './sessionPresentation.js'
import { useTimerController } from './useTimerController.js'

function getTimerDisplayConfig(timerDisplayMode, mode) {
  switch (timerDisplayMode) {
    case TIMER_DISPLAY_MODES.minimalOverlay:
      return {
        showStatusLine: mode === 'focus',
        showSessionSwitch: mode === 'focus',
        showSecondaryStatus: false,
        showFocusHint: mode === 'focus',
        isCompactControls: true,
        isCornerPresentation: false,
      }

    case TIMER_DISPLAY_MODES.cornerEmbed:
      return {
        showStatusLine: false,
        showSessionSwitch: false,
        showSecondaryStatus: false,
        showFocusHint: mode === 'focus',
        isCompactControls: true,
        isCornerPresentation: true,
      }

    case TIMER_DISPLAY_MODES.centerFocus:
    default:
      return {
        showStatusLine: mode === 'focus',
        showSessionSwitch: mode === 'focus',
        showSecondaryStatus: mode === 'focus',
        showFocusHint: mode === 'focus',
        isCompactControls: false,
        isCornerPresentation: false,
      }
  }
}

export function TimerPanel({
  mode = 'idle',
  sceneLabel = 'Coastal Cafe',
  timerDisplayMode = TIMER_DISPLAY_MODES.centerFocus,
  timerStatus,
  onEnterFocus,
  onExitFocus,
}) {
  const {
    timer,
    formattedRemaining,
    startTimer,
    pauseTimer,
    resetTimer,
    setSession,
  } = useTimerController()
  const sessionPresentation = getSessionPresentation(
    timer.sessionType,
    timer.status,
  )
  const focusStatusText = sessionPresentation.statusText
  const sceneMetaText = `${sceneLabel} · ${sessionPresentation.metadataTone}`
  const workSessionsUntilLongBreak =
    timer.longBreakInterval -
    (timer.completedWorkCycles % timer.longBreakInterval)
  const nextBreakHint =
    timer.sessionType === 'work'
      ? workSessionsUntilLongBreak === 1
        ? 'Long Break Next'
        : `Long Break In ${workSessionsUntilLongBreak}`
      : 'Automatic Return To Work'
  const displayConfig = getTimerDisplayConfig(timerDisplayMode, mode)
  const panelClassName = [
    'scene-timer',
    `scene-timer--${mode}`,
    `scene-timer--display-${timerDisplayMode}`,
    `scene-timer--session-${timer.sessionType}`,
    `scene-timer--status-${timer.status}`,
    displayConfig.isCompactControls ? 'scene-timer--compact-controls' : '',
    displayConfig.isCornerPresentation ? 'scene-timer--corner-presentation' : '',
  ]
    .filter(Boolean)
    .join(' ')

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
        className={panelClassName}
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
    <section className={panelClassName}>
      {displayConfig.showStatusLine ? (
        <p className="scene-timer__status">{focusStatusText}</p>
      ) : null}
      <div className="scene-timer__clock">{formattedRemaining}</div>
      <p className="scene-timer__ambient scene-timer__ambient--focus">
        {sceneMetaText} · {nextBreakHint}
      </p>
      {displayConfig.showFocusHint ? (
        <p className="scene-timer__hint">{sessionPresentation.hintText}</p>
      ) : null}

      {displayConfig.showSessionSwitch ? (
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
      ) : null}

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

      {displayConfig.showSecondaryStatus ? (
        <p className="scene-timer__status scene-timer__status--secondary">
          Completed Pomodoros {timer.completedWorkCycles} · Long break every{' '}
          {timer.longBreakInterval}
        </p>
      ) : null}
    </section>
  )
}
