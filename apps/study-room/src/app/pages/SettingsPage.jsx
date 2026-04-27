import {
  useStudyRoomActions,
  useStudyRoomState,
} from '../../state/useStudyRoom.js'

export function SettingsPage() {
  const { preferences } = useStudyRoomState()
  const { setPreference } = useStudyRoomActions()

  return (
    <div className="settings-page">
      <section className="settings-card">
        <h2>Future Settings Surface</h2>
        <p className="settings-card__copy">
          This route is intentionally lightweight for now. It already reads from
          the shared Study Room state so backend-backed preferences can later
          replace local-only values without changing the route structure.
        </p>
      </section>

      <section className="settings-card">
        <h2>Session Preferences</h2>
        <div className="settings-card__row">
          <div className="settings-card__toggle">
            <div>
              <strong>Auto-start breaks</strong>
              <p className="settings-card__meta">
                Automatically begin break sessions after a work session completes.
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

          <div className="settings-card__toggle">
            <div>
              <strong>Auto-start work sessions</strong>
              <p className="settings-card__meta">
                Automatically resume focus after a break completes.
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

          <div className="settings-card__toggle">
            <div>
              <strong>Sound enabled</strong>
              <p className="settings-card__meta">
                Shared placeholder preference used by the ambient music feature.
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

      <section className="settings-card">
        <h2>Routing Contract</h2>
        <p className="settings-card__route-note">
          Development keeps the app at <code>http://localhost:5173</code>.
          Production builds keep the portal handoff contract stable by building
          for the <code>/study-app/</code> base path.
        </p>
      </section>
    </div>
  )
}
