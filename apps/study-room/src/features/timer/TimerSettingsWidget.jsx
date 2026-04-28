import { useState } from 'react'
import { useStudyRoomState, useStudyRoomActions } from '../../state/useStudyRoom.js'
import { secondsToMinutes } from './timerUtils.js'

export function TimerSettingsWidget() {
  const { preferences, timer } = useStudyRoomState()
  const { setPreference, setTimerConfiguration } = useStudyRoomActions()
  const [workMinutes, setWorkMinutes] = useState(
    String(secondsToMinutes(timer.durations.work)),
  )
  const [shortBreakMinutes, setShortBreakMinutes] = useState(
    String(secondsToMinutes(timer.durations.shortBreak)),
  )
  const [longBreakMinutes, setLongBreakMinutes] = useState(
    String(secondsToMinutes(timer.durations.longBreak)),
  )
  const [longBreakInterval, setLongBreakInterval] = useState(
    String(timer.longBreakInterval),
  )

  const handleSubmit = (event) => {
    event.preventDefault()

    setTimerConfiguration({
      workMinutes,
      shortBreakMinutes,
      longBreakMinutes,
      longBreakInterval,
    })
  }

  return (
    <section className="floating-widget settings-widget">
      <p className="floating-widget__eyebrow">Timer Configuration</p>
      <h2 className="floating-widget__title">Pomodoro engine</h2>
      <p className="floating-widget__copy">
        Automatic rollover now runs as a three-phase Pomodoro cycle:
        work, short break, and long break.
      </p>

      <form className="widget-form" onSubmit={handleSubmit}>
        <div className="widget-form__grid">
          <div className="field">
            <label htmlFor="settings-work-minutes">Work minutes</label>
            <input
              id="settings-work-minutes"
              className="input"
              type="number"
              min="1"
              max="180"
              value={workMinutes}
              onChange={(event) => setWorkMinutes(event.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="settings-short-break-minutes">Short break</label>
            <input
              id="settings-short-break-minutes"
              className="input"
              type="number"
              min="1"
              max="180"
              value={shortBreakMinutes}
              onChange={(event) => setShortBreakMinutes(event.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="settings-long-break-minutes">Long break</label>
            <input
              id="settings-long-break-minutes"
              className="input"
              type="number"
              min="1"
              max="180"
              value={longBreakMinutes}
              onChange={(event) => setLongBreakMinutes(event.target.value)}
            />
          </div>

          <div className="field">
            <label htmlFor="settings-long-break-interval">Long break every</label>
            <input
              id="settings-long-break-interval"
              className="input"
              type="number"
              min="2"
              max="12"
              value={longBreakInterval}
              onChange={(event) => setLongBreakInterval(event.target.value)}
            />
          </div>
        </div>

        <div className="settings-widget__toggle">
          <div>
            <strong>Completion bell</strong>
            <p className="floating-widget__meta">
              Plays only when the timer naturally rolls into the next Pomodoro
              phase.
            </p>
          </div>
          <button
            type="button"
            className={`button ${preferences.soundEnabled ? 'button--active' : 'button--ghost'}`}
            onClick={() => setPreference('soundEnabled', !preferences.soundEnabled)}
          >
            {preferences.soundEnabled ? 'Enabled' : 'Muted'}
          </button>
        </div>

        <button type="submit" className="button button--primary">
          Apply Timer Settings
        </button>
      </form>
    </section>
  )
}
