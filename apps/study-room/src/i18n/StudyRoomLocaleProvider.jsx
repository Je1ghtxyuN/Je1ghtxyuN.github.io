import { useMemo } from 'react'
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  normalizeLocale,
  translateLocale,
} from './config.js'
import { StudyRoomLocaleContext } from './studyRoomLocaleContext.js'
import {
  useStudyRoomActions,
  useStudyRoomState,
} from '../state/useStudyRoom.js'

export function StudyRoomLocaleProvider({ children }) {
  const { preferences } = useStudyRoomState()
  const { setPreference } = useStudyRoomActions()
  const locale = normalizeLocale(preferences.locale || DEFAULT_LOCALE)

  const value = useMemo(
    () => ({
      locale,
      supportedLocales: SUPPORTED_LOCALES,
      setLocale(nextLocale) {
        setPreference('locale', normalizeLocale(nextLocale))
      },
      t(keyPath, params = {}, fallback = '') {
        return translateLocale(locale, keyPath, params, fallback)
      },
    }),
    [locale, setPreference],
  )

  return (
    <StudyRoomLocaleContext.Provider value={value}>
      {children}
    </StudyRoomLocaleContext.Provider>
  )
}
