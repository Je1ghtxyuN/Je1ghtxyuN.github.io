import { AuthPlaceholderCard } from '../../features/auth/index.js'
import { TimerSettingsWidget } from '../../features/timer/index.js'
import {
  useStudyRoomActions,
  useStudyRoomState,
} from '../../state/useStudyRoom.js'

export function SettingsPanelContent() {
  const { preferences } = useStudyRoomState()
  const { setPreference } = useStudyRoomActions()

  return (
    <div className="panel-stack">
      <section className="floating-widget">
        <div className="floating-widget__header">
          <div>
            <p className="floating-widget__eyebrow">Shared Preferences</p>
            <h3 className="floating-widget__title">Session behavior</h3>
          </div>
        </div>

        <div className="settings-widget__list">
          <div className="settings-widget__toggle">
            <div>
              <strong>Auto-start breaks</strong>
              <p className="floating-widget__meta">
                Automatically begin a break after a work session completes.
              </p>
            </div>
            <button
              type="button"
              className={`button ${preferences.autoStartBreaks ? 'button--active' : 'button--ghost'}`}
              onClick={() =>
                setPreference('autoStartBreaks', !preferences.autoStartBreaks)
              }
            >
              {preferences.autoStartBreaks ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          <div className="settings-widget__toggle">
            <div>
              <strong>Auto-start work</strong>
              <p className="floating-widget__meta">
                Automatically return to work after a break finishes.
              </p>
            </div>
            <button
              type="button"
              className={`button ${preferences.autoStartWork ? 'button--active' : 'button--ghost'}`}
              onClick={() =>
                setPreference('autoStartWork', !preferences.autoStartWork)
              }
            >
              {preferences.autoStartWork ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          <div className="settings-widget__toggle">
            <div>
              <strong>Sound enabled</strong>
              <p className="floating-widget__meta">
                Shared audio preference used by the ambient music controller.
              </p>
            </div>
            <button
              type="button"
              className={`button ${preferences.soundEnabled ? 'button--active' : 'button--ghost'}`}
              onClick={() => setPreference('soundEnabled', !preferences.soundEnabled)}
            >
              {preferences.soundEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>
      </section>

      <TimerSettingsWidget />
      <AuthPlaceholderCard />
    </div>
  )
}
