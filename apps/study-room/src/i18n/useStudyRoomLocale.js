import { useContext } from 'react'

import { StudyRoomLocaleContext } from './studyRoomLocaleContext.js'

export function useStudyRoomLocale() {
  const value = useContext(StudyRoomLocaleContext)

  if (!value) {
    throw new Error(
      'useStudyRoomLocale must be used inside StudyRoomLocaleProvider',
    )
  }

  return value
}
