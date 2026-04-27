import { useReducer } from 'react'
import {
  createInitialStudyRoomState,
  studyRoomReducer,
} from './studyRoomReducer.js'
import {
  StudyRoomDispatchContext,
  StudyRoomStateContext,
} from './studyRoomContext.js'

export function StudyRoomProvider({ children }) {
  const [state, dispatch] = useReducer(
    studyRoomReducer,
    undefined,
    createInitialStudyRoomState,
  )

  return (
    <StudyRoomStateContext.Provider value={state}>
      <StudyRoomDispatchContext.Provider value={dispatch}>
        {children}
      </StudyRoomDispatchContext.Provider>
    </StudyRoomStateContext.Provider>
  )
}
