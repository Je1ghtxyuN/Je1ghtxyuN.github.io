import { Outlet } from 'react-router-dom'
import { SessionTransitionCue } from './SessionTransitionCue.jsx'
import { GitHubCallback } from './GitHubCallback.jsx'
import { BackgroundLayer } from '../components/BackgroundLayer.jsx'
import {
  getStudyScene,
  resolveStudyScenePresentation,
} from '../lib/studyScene.js'
import { useStudyRoomState } from '../state/useStudyRoom.js'

export function AppShell() {
  const { preferences, timer, ui } = useStudyRoomState()
  const displayMode = ui.mode === 'panel' ? ui.previousMode : ui.mode
  const activeScene = getStudyScene(preferences.selectedSceneId)
  const scenePresentation = resolveStudyScenePresentation(activeScene, {
    sessionType: timer.sessionType,
    uiMode: displayMode,
  })
  const appClassName = [
    'study-app',
    `study-app--display-${displayMode}`,
    `study-app--session-${timer.sessionType}`,
    ui.mode === 'panel' ? 'study-app--panel-open' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={appClassName}>
      <GitHubCallback />
      <BackgroundLayer scene={activeScene} presentation={scenePresentation} />
      <div className="study-app__surface">
        <SessionTransitionCue />
        <Outlet />
      </div>
    </div>
  )
}
