import { useEffect, useEffectEvent } from 'react'
import {
  useStudyRoomDispatch,
  useStudyRoomState,
} from '../../state/useStudyRoom.js'

export function useTimerEngine() {
  const { timer } = useStudyRoomState()
  const dispatch = useStudyRoomDispatch()

  const dispatchTick = useEffectEvent(() => {
    dispatch({ type: 'timer/tick', now: Date.now() })
  })

  useEffect(() => {
    if (timer.status !== 'running') return undefined

    const intervalId = window.setInterval(() => {
      dispatchTick()
    }, 250)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [timer.status])
}
