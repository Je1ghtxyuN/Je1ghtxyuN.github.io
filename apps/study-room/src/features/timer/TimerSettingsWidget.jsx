import { useState } from 'react'
import { useStudyRoomState, useStudyRoomActions } from '../../state/useStudyRoom.js'
import { secondsToMinutes } from './timerUtils.js'

export function TimerSettingsWidget() {
  const { timer } = useStudyRoomState()
  const { setDurations } = useStudyRoomActions()
  const [workMinutes, setWorkMinutes] = useState(
    String(secondsToMinutes(timer.durations.work)),
  )
  const [breakMinutes, setBreakMinutes] = useState(
    String(secondsToMinutes(timer.durations.break)),
  )

  const handleSubmit = (event) => {
    event.preventDefault()

    setDurations({
      workMinutes,
      breakMinutes,
    })
  }

  return (
    <section className="floating-widget settings-widget">
      <p className="floating-widget__eyebrow">Timer Configuration</p>
      <h2 className="floating-widget__title">Session lengths</h2>
      <p className="floating-widget__copy">
        Duration controls moved out of the center timer so the main study view
        can stay compact and immersive.
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
            <label htmlFor="settings-break-minutes">Break minutes</label>
            <input
              id="settings-break-minutes"
              className="input"
              type="number"
              min="1"
              max="180"
              value={breakMinutes}
              onChange={(event) => setBreakMinutes(event.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="button button--primary">
          Apply Durations
        </button>
      </form>
    </section>
  )
}
