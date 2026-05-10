import { useStudyRoomLocale } from '../i18n/useStudyRoomLocale.js'

const PANEL_GROUPS = [
  [{ id: 'todo', label: 'To' }, { id: 'music', label: 'Mu' }],
  [{ id: 'statistics', label: 'St' }, { id: 'settings', label: 'Se' }],
]

export function StudyChromeWidget({
  mode = 'idle',
  activePanel,
  onOpenPanel,
}) {
  const { t } = useStudyRoomLocale()

  const getPanelTitle = (panelId) =>
    t(`studyRoom.panels.${panelId}.title`, {}, `${panelId} panel`)

  return (
    <section className={`scene-chrome scene-chrome--${mode}`}>
      <div
        className="scene-chrome__group scene-chrome__group--left"
        role="group"
        aria-label={t(
          'studyRoom.chrome.panelGroupLabel',
          {},
          'Study Room Panels',
        )}
      >
        <a
          href="/"
          className="scene-chrome__button scene-chrome__home-btn"
          aria-label={t('studyRoom.chrome.backToHome', {}, 'Back to Home')}
          title={t('studyRoom.chrome.backToHome', {}, 'Back to Home')}
        >
          <i className="fas fa-home" />
        </a>
        {PANEL_GROUPS[0].map((item) => (
          <button
            key={item.id}
            type="button"
            className={`scene-chrome__button${activePanel === item.id ? ' scene-chrome__button--active' : ''}`}
            onClick={() => onOpenPanel(item.id)}
            aria-label={getPanelTitle(item.id)}
            title={getPanelTitle(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="scene-chrome__brand" aria-hidden="true">
        <span className="scene-chrome__brand-mark" />
        <span className="scene-chrome__brand-text">
          {t('brand.studyRoomName', {}, 'Study Room')}
        </span>
      </div>

      <div className="scene-chrome__group scene-chrome__group--right" role="group">
        {PANEL_GROUPS[1].map((item) => (
          <button
            key={item.id}
            type="button"
            className={`scene-chrome__button${activePanel === item.id ? ' scene-chrome__button--active' : ''}`}
            onClick={() => onOpenPanel(item.id)}
            aria-label={getPanelTitle(item.id)}
            title={getPanelTitle(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
    </section>
  )
}
