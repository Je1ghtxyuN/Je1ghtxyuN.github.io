import { useState } from 'react'
import { useStudyRoomLocale } from '../../i18n/useStudyRoomLocale.js'
import { useStudyRoomState, useStudyRoomActions } from '../../state/useStudyRoom.js'
import { secondsToMinutes } from './timerUtils.js'

export function TimerSettingsWidget() {
  const { preferences, timer } = useStudyRoomState()
  const { setPreference, setTimerConfiguration } = useStudyRoomActions()
  const { t } = useStudyRoomLocale()
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
    <section className="settings-group">
      <div className="settings-group__header">
        <div>
          <p className="floating-widget__eyebrow">
            {t(
              'studyRoom.settings.timerEyebrow',
              {},
              'Timer Behavior Settings',
            )}
          </p>
          <h3 className="floating-widget__title">
            {t('studyRoom.settings.timerTitle', {}, 'Pomodoro engine')}
          </h3>
        </div>
      </div>

      <form className="settings-form" onSubmit={handleSubmit}>
        <div className="settings-form__grid">
          <div className="field">
            <label htmlFor="settings-work-minutes">
              {t('studyRoom.settings.workMinutes', {}, 'Work minutes')}
            </label>
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
            <label htmlFor="settings-short-break-minutes">
              {t('studyRoom.settings.shortBreakMinutes', {}, 'Short break')}
            </label>
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
            <label htmlFor="settings-long-break-minutes">
              {t('studyRoom.settings.longBreakMinutes', {}, 'Long break')}
            </label>
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
            <label htmlFor="settings-long-break-interval">
              {t(
                'studyRoom.settings.longBreakInterval',
                {},
                'Long break every',
              )}
            </label>
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

        <div className="settings-row">
          <div>
            {t('studyRoom.settings.completionBellTitle', {}, 'Completion bell')}
          </div>
          <button
            type="button"
            className={`button ${preferences.soundEnabled ? 'button--active' : 'button--ghost'}`}
            onClick={() => setPreference('soundEnabled', !preferences.soundEnabled)}
          >
            {preferences.soundEnabled
              ? t('common.enabled', {}, 'Enabled')
              : t('common.muted', {}, 'Muted')}
          </button>
        </div>

        <div className="settings-form__actions">
          <button type="submit" className="button button--primary">
            {t('studyRoom.settings.saveTimer', {}, 'Save Timer Settings')}
          </button>
        </div>
      </form>
    </section>
  )
}
