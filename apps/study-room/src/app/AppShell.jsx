import { Outlet } from 'react-router-dom'
import { BackgroundLayer } from '../components/BackgroundLayer.jsx'
import { DEFAULT_STUDY_SCENE } from '../lib/studyScene.js'
import { useStudyRoomState } from '../state/useStudyRoom.js'

export function AppShell() {
  const { ui } = useStudyRoomState()
  const displayMode = ui.mode === 'panel' ? ui.previousMode : ui.mode
  const appClassName = [
    'study-app',
    `study-app--display-${displayMode}`,
    ui.mode === 'panel' ? 'study-app--panel-open' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={appClassName}>
      <BackgroundLayer scene={DEFAULT_STUDY_SCENE} />
      <div className="study-app__surface">
        <Outlet />
      </div>
    </div>
  )
}
