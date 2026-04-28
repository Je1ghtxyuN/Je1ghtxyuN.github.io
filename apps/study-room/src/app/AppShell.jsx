import { Outlet } from 'react-router-dom'
import { BackgroundLayer } from '../components/BackgroundLayer.jsx'
import { getStudyScene } from '../lib/studyScene.js'
import { useStudyRoomState } from '../state/useStudyRoom.js'

export function AppShell() {
  const { preferences, ui } = useStudyRoomState()
  const displayMode = ui.mode === 'panel' ? ui.previousMode : ui.mode
  const activeScene = getStudyScene(preferences.selectedSceneId)
  const appClassName = [
    'study-app',
    `study-app--display-${displayMode}`,
    ui.mode === 'panel' ? 'study-app--panel-open' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={appClassName}>
      <BackgroundLayer scene={activeScene} />
      <div className="study-app__surface">
        <Outlet />
      </div>
    </div>
  )
}
