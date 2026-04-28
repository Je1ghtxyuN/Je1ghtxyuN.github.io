import { useReducer } from 'react'
import {
  createInitialStudyRoomState,
  studyRoomReducer,
} from './studyRoomReducer.js'
import { StudyRoomRuntimeEffects } from './StudyRoomRuntimeEffects.jsx'
import {
  StudyRoomDispatchContext,
  StudyRoomStateContext,
} from './studyRoomContext.js'
import { readPersistedStudyRoomState } from './studyRoomStorage.js'

export function StudyRoomProvider({ children }) {
  const [state, dispatch] = useReducer(
    studyRoomReducer,
    undefined,
    () => createInitialStudyRoomState(readPersistedStudyRoomState()),
  )

  return (
    <StudyRoomStateContext.Provider value={state}>
      <StudyRoomDispatchContext.Provider value={dispatch}>
        <StudyRoomRuntimeEffects />
        {children}
      </StudyRoomDispatchContext.Provider>
    </StudyRoomStateContext.Provider>
  )
}
