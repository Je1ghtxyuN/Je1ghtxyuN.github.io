import { TimerSettingsWidget } from '../../features/timer/index.js'
import { useStudyRoomLocale } from '../../i18n/useStudyRoomLocale.js'
import { STUDY_SCENES } from '../../lib/studyScene.js'
import { TIMER_DISPLAY_MODES } from '../../state/studyRoomReducer.js'
import {
  useStudyRoomActions,
  useStudyRoomState,
} from '../../state/useStudyRoom.js'

const DISPLAY_OPTIONS = [
  { id: TIMER_DISPLAY_MODES.centerFocus, label: 'Center Focus' },
  { id: TIMER_DISPLAY_MODES.minimalOverlay, label: 'Minimal Overlay' },
  { id: TIMER_DISPLAY_MODES.cornerEmbed, label: 'Corner Embed' },
]

export function SettingsPanelContent() {
  const { preferences } = useStudyRoomState()
  const { setPreference } = useStudyRoomActions()
  const { locale, setLocale, supportedLocales, t } = useStudyRoomLocale()

  return (
    <div className="panel-stack">
      <section className="floating-widget">
        <h3 className="floating-widget__title">{t('studyRoom.settings.title', {}, 'Preferences')}</h3>

        <div className="settings-group">
          <h4 className="floating-widget__title">{t('studyRoom.settings.languageTitle', {}, 'Language')}</h4>
          <div className="settings-choice-grid">
            {supportedLocales.map((item) => (
              <button
                key={item.code}
                type="button"
                className={`settings-choice${locale === item.code ? ' settings-choice--active' : ''}`}
                onClick={() => setLocale(item.code)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="settings-group">
          <h4 className="floating-widget__title">{t('studyRoom.settings.sceneTitle', {}, 'Scene')}</h4>
          <div className="scene-selector">
            {STUDY_SCENES.map((scene) => (
              <button
                key={scene.id}
                type="button"
                className={`scene-selector__option${preferences.selectedSceneId === scene.id ? ' scene-selector__option--active' : ''}`}
                onClick={() => setPreference('selectedSceneId', scene.id)}
              >
                <span className="scene-selector__label">{t(`studyRoom.scenes.${scene.localeKey}.name`, {}, scene.name)}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="settings-group">
          <h4 className="floating-widget__title">{t('studyRoom.settings.displayTitle', {}, 'Timer Display')}</h4>
          <div className="settings-choice-grid">
            {DISPLAY_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`settings-choice${preferences.timerDisplayMode === opt.id ? ' settings-choice--active' : ''}`}
                onClick={() => setPreference('timerDisplayMode', opt.id)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <TimerSettingsWidget />
      </section>
    </div>
  )
}
