import { AuthPlaceholderCard } from '../../features/auth/index.js'
import { TimerSettingsWidget } from '../../features/timer/index.js'
import { STUDY_SCENES } from '../../lib/studyScene.js'
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
            <p className="floating-widget__eyebrow">Atmosphere</p>
            <h3 className="floating-widget__title">Scene selection</h3>
          </div>
        </div>

        <p className="floating-widget__meta">
          These video scenes are primary study environments now, and the same
          registry will support future live wallpaper packs.
        </p>

        <div className="scene-selector">
          {STUDY_SCENES.map((scene) => (
            <button
              key={scene.id}
              type="button"
              className={`scene-selector__option${preferences.selectedSceneId === scene.id ? ' scene-selector__option--active' : ''}`}
              onClick={() => setPreference('selectedSceneId', scene.id)}
            >
              <span className="scene-selector__label">{scene.name}</span>
              <span className="scene-selector__meta">{scene.description}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="floating-widget">
        <div className="floating-widget__header">
          <div>
            <p className="floating-widget__eyebrow">Runtime Notes</p>
            <h3 className="floating-widget__title">Automatic Pomodoro flow</h3>
          </div>
        </div>

        <div className="settings-widget__list">
          <div className="settings-widget__toggle">
            <div>
              <strong>Automatic rollover</strong>
              <p className="floating-widget__meta">
                Work always rolls into a short or long break, and any break
                always rolls back into work.
              </p>
            </div>
            <span className="floating-widget__badge">Always On</span>
          </div>
        </div>
      </section>

      <TimerSettingsWidget />
      <AuthPlaceholderCard />
    </div>
  )
}
