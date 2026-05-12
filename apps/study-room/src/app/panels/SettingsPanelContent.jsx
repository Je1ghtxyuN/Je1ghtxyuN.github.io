import { TimerSettingsWidget } from '../../features/timer/index.js'
import { useStudyRoomLocale } from '../../i18n/useStudyRoomLocale.js'
import { STUDY_SCENES } from '../../lib/studyScene.js'
import { TIMER_DISPLAY_MODES } from '../../state/studyRoomReducer.js'
import {
  useStudyRoomActions,
  useStudyRoomState,
} from '../../state/useStudyRoom.js'

export function SettingsPanelContent() {
  const { preferences } = useStudyRoomState()
  const { setPreference } = useStudyRoomActions()
  const { locale, setLocale, supportedLocales, t } = useStudyRoomLocale()
  const timerDisplayModeOptions = [
    {
      id: TIMER_DISPLAY_MODES.centerFocus,
      label: t(
        'studyRoom.settings.displayModes.center_focus.label',
        {},
        'Center Focus',
      ),
      description: t(
        'studyRoom.settings.displayModes.center_focus.description',
        {},
        'The immersive centered timer remains the primary focus surface.',
      ),
    },
    {
      id: TIMER_DISPLAY_MODES.minimalOverlay,
      label: t(
        'studyRoom.settings.displayModes.minimal_overlay.label',
        {},
        'Minimal Overlay',
      ),
      description: t(
        'studyRoom.settings.displayModes.minimal_overlay.description',
        {},
        'A smaller overlay keeps the timer visible while letting the scene dominate.',
      ),
    },
    {
      id: TIMER_DISPLAY_MODES.cornerEmbed,
      label: t(
        'studyRoom.settings.displayModes.corner_embed.label',
        {},
        'Corner Embed',
      ),
      description: t(
        'studyRoom.settings.displayModes.corner_embed.description',
        {},
        'An unobtrusive corner timer shows only the essential study controls.',
      ),
    },
  ]

  return (
    <div className="panel-stack">
      <section className="floating-widget">
        <div className="floating-widget__header">
          <div>
            <p className="floating-widget__eyebrow">
              {t(
                'studyRoom.settings.titleEyebrow',
                {},
                'Study Room Preferences',
              )}
            </p>
            <h3 className="floating-widget__title">
              {t(
                'studyRoom.settings.title',
                {},
                'Display and behavior',
              )}
            </h3>
          </div>
          <span className="floating-widget__badge">
            {t('common.local', {}, 'Local')}
          </span>
        </div>

        <p className="floating-widget__meta">
          {t(
            'studyRoom.settings.intro',
            {},
            'This settings center controls how the scene, timer, and local study runtime feel without touching the underlying Pomodoro engine.',
          )}
        </p>

        <div className="settings-group">
          <div className="settings-group__header">
            <div>
              <p className="floating-widget__eyebrow">
                {t('studyRoom.settings.languageEyebrow', {}, 'Language Settings')}
              </p>
              <h4 className="floating-widget__title">
                {t('studyRoom.settings.languageTitle', {}, 'Interface language')}
              </h4>
            </div>
            <p className="floating-widget__meta">
              {t(
                'studyRoom.settings.languageIntro',
                {},
                'This choice updates shared UI labels across the Study Room and future connected surfaces.',
              )}
            </p>
          </div>

          <div className="settings-choice-grid">
            {supportedLocales.map((item) => (
              <button
                key={item.code}
                type="button"
                className={`settings-choice${locale === item.code ? ' settings-choice--active' : ''}`}
                onClick={() => setLocale(item.code)}
              >
                <span className="settings-choice__label">{item.label}</span>
                <span className="settings-choice__copy">{item.code}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="settings-group">
          <div className="settings-group__header">
            <div>
              <p className="floating-widget__eyebrow">
                {t('studyRoom.settings.sceneEyebrow', {}, 'Scene Settings')}
              </p>
              <h4 className="floating-widget__title">
                {t('studyRoom.settings.sceneTitle', {}, 'Study environments')}
              </h4>
            </div>
            <p className="floating-widget__meta">
              {t(
                'studyRoom.settings.sceneIntro',
                {},
                'Select the active scene now. Custom uploads will attach here in a later pass.',
              )}
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
                <span className="scene-selector__label">
                  {t(
                    `studyRoom.scenes.${scene.localeKey}.name`,
                    {},
                    scene.name,
                  )}
                </span>
                <span className="scene-selector__meta">
                  {t(
                    `studyRoom.scenes.${scene.localeKey}.description`,
                    {},
                    scene.description,
                  )}
                </span>
              </button>
            ))}
          </div>

          <div className="settings-row settings-row--placeholder">
            <div>
              <strong>
                {t(
                  'studyRoom.settings.customUploadsTitle',
                  {},
                  'Custom uploads',
                )}
              </strong>
              <p className="floating-widget__meta">
                {t(
                  'studyRoom.settings.customUploadsCopy',
                  {},
                  'Future self-hosted scene uploads will be managed here without replacing the current video-scene registry.',
                )}
              </p>
            </div>
            <span className="floating-widget__badge">
              {t('common.comingSoon', {}, 'Coming Soon')}
            </span>
          </div>
        </div>

        <div className="settings-group">
          <div className="settings-group__header">
            <div>
              <p className="floating-widget__eyebrow">
                {t(
                  'studyRoom.settings.displayEyebrow',
                  {},
                  'Timer Display Settings',
                )}
              </p>
              <h4 className="floating-widget__title">
                {t(
                  'studyRoom.settings.displayTitle',
                  {},
                  'Presentation mode',
                )}
              </h4>
            </div>
            <p className="floating-widget__meta">
              {t(
                'studyRoom.settings.displayIntro',
                {},
                'Change how the timer sits on top of the study scene without altering the timer engine or session progress.',
              )}
            </p>
          </div>

          <div className="settings-choice-grid">
            {timerDisplayModeOptions.map((option) => (
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

    </div>
  )
}
