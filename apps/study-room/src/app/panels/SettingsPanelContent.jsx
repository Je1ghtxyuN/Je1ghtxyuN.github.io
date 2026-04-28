import { TimerSettingsWidget } from '../../features/timer/index.js'
import { STUDY_SCENES } from '../../lib/studyScene.js'
import { TIMER_DISPLAY_MODES } from '../../state/studyRoomReducer.js'
import {
  useStudyRoomActions,
  useStudyRoomState,
} from '../../state/useStudyRoom.js'

const TIMER_DISPLAY_MODE_OPTIONS = [
  {
    id: TIMER_DISPLAY_MODES.centerFocus,
    label: 'Center Focus',
    description:
      'The immersive centered timer remains the primary focus surface.',
  },
  {
    id: TIMER_DISPLAY_MODES.minimalOverlay,
    label: 'Minimal Overlay',
    description:
      'A smaller overlay keeps the timer visible while letting the scene dominate.',
  },
  {
    id: TIMER_DISPLAY_MODES.cornerEmbed,
    label: 'Corner Embed',
    description:
      'An unobtrusive corner timer shows only the essential study controls.',
  },
]

export function SettingsPanelContent() {
  const { preferences } = useStudyRoomState()
  const { setPreference } = useStudyRoomActions()

  return (
    <div className="panel-stack">
      <section className="floating-widget">
        <div className="floating-widget__header">
          <div>
            <p className="floating-widget__eyebrow">Study Room Preferences</p>
            <h3 className="floating-widget__title">Display and behavior</h3>
          </div>
          <span className="floating-widget__badge">Local</span>
        </div>

        <p className="floating-widget__meta">
          This settings center controls how the scene, timer, and local study
          runtime feel without touching the underlying Pomodoro engine.
        </p>

        <div className="settings-group">
          <div className="settings-group__header">
            <div>
              <p className="floating-widget__eyebrow">Scene Settings</p>
              <h4 className="floating-widget__title">Study environments</h4>
            </div>
            <p className="floating-widget__meta">
              Select the active scene now. Custom uploads will attach here in a
              later pass.
            </p>
          </div>

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

          <div className="settings-row settings-row--placeholder">
            <div>
              <strong>Custom uploads</strong>
              <p className="floating-widget__meta">
                Future self-hosted scene uploads will be managed here without
                replacing the current video-scene registry.
              </p>
            </div>
            <span className="floating-widget__badge">Coming Soon</span>
          </div>
        </div>

        <div className="settings-group">
          <div className="settings-group__header">
            <div>
              <p className="floating-widget__eyebrow">Timer Display Settings</p>
              <h4 className="floating-widget__title">Presentation mode</h4>
            </div>
            <p className="floating-widget__meta">
              Change how the timer sits on top of the study scene without
              altering the timer engine or session progress.
            </p>
          </div>

          <div className="settings-choice-grid">
            {TIMER_DISPLAY_MODE_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`settings-choice${preferences.timerDisplayMode === option.id ? ' settings-choice--active' : ''}`}
                onClick={() => setPreference('timerDisplayMode', option.id)}
              >
                <span className="settings-choice__label">{option.label}</span>
                <span className="settings-choice__copy">{option.description}</span>
              </button>
            ))}
          </div>
        </div>

        <TimerSettingsWidget />
      </section>

      <section className="floating-widget settings-placeholder-card">
        <div className="floating-widget__header">
          <div>
            <p className="floating-widget__eyebrow">Audio Architecture Placeholder</p>
            <h3 className="floating-widget__title">Cloud music integration coming soon</h3>
          </div>
          <span className="floating-widget__badge">Future</span>
        </div>

        <p className="floating-widget__meta">
          Ambient playback is still running through the local source provider.
          A future cloud provider will plug into the music-source abstraction
          without replacing the existing playback controller.
        </p>
      </section>
    </div>
  )
}
