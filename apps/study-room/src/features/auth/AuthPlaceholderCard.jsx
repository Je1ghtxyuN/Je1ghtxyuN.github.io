import { useStudyRoomLocale } from '../../i18n/useStudyRoomLocale.js'

export function AuthPlaceholderCard() {
  const { t } = useStudyRoomLocale()

  return (
    <section className="floating-widget">
      <div className="floating-widget__header">
        <div>
          <p className="floating-widget__eyebrow">
            {t('studyRoom.auth.eyebrow', {}, 'Auth Placeholder')}
          </p>
          <h2 className="floating-widget__title">
            {t('studyRoom.auth.title', {}, 'Future account layer')}
          </h2>
          <p className="floating-widget__copy">
            {t(
              'studyRoom.auth.intro',
              {},
              'This slot is intentionally present now so account-linked Study Room state can be added later without reshaping the core pages.',
            )}
          </p>
        </div>
        <span className="floating-widget__badge">
          {t('common.future', {}, 'Future')}
        </span>
      </div>

      <div className="widget-pills">
        <span className="widget-pill">
          {t('studyRoom.auth.sessionHandoff', {}, 'Session handoff')}
        </span>
        <span className="widget-pill">
          {t('studyRoom.auth.protectedPresets', {}, 'Protected presets')}
        </span>
        <span className="widget-pill">
          {t('studyRoom.auth.tokenStorage', {}, 'Backend token storage')}
        </span>
      </div>

      <p className="floating-widget__meta">
        {t(
          'studyRoom.auth.futureCopy',
          {},
          'The backend service will eventually own login, session validation, and user-linked study data. Nothing here relies on Firebase-era browser auth.',
        )}
      </p>
    </section>
  )
}
