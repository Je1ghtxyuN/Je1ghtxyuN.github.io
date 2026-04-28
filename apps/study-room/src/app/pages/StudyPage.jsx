import { PanelOverlay } from '../PanelOverlay.jsx'
import { SettingsPanelContent } from '../panels/SettingsPanelContent.jsx'
import { StudyChromeWidget } from '../StudyChromeWidget.jsx'
import { AmbientMusicPanel } from '../../features/ambient-music/index.js'
import { StudyStatisticsPanel } from '../../features/study-statistics/index.js'
import { TimerPanel } from '../../features/timer/index.js'
import { TodoPanel } from '../../features/todo/index.js'
import { getStudyScene } from '../../lib/studyScene.js'
import { StudyLayout } from '../../layouts/StudyLayout.jsx'
import {
  useStudyRoomActions,
  useStudyRoomState,
} from '../../state/useStudyRoom.js'

const PANEL_DEFINITIONS = {
  todo: {
    title: 'Todo Panel',
    description: 'Small task capture stays available as an overlay instead of permanently occupying the layout.',
    render: () => <TodoPanel />,
  },
  music: {
    title: 'Music Panel',
    description: 'Ambient playback remains available without crowding the main focus scene.',
    render: () => <AmbientMusicPanel />,
  },
  statistics: {
    title: 'Statistics Panel',
    description: 'Session counters and future progress views now live in a dedicated overlay surface.',
    render: () => <StudyStatisticsPanel />,
  },
  settings: {
    title: 'Settings Panel',
    description: 'Timer configuration and shared preferences open as a floating panel instead of a separate dashboard route.',
    render: () => <SettingsPanelContent />,
  },
}

export function StudyPage() {
  const { preferences, timer, ui } = useStudyRoomState()
  const { closePanel, enterFocusMode, enterIdleMode, openPanel } =
    useStudyRoomActions()
  const displayMode = ui.mode === 'panel' ? ui.previousMode : ui.mode
  const activeScene = getStudyScene(preferences.selectedSceneId)
  const activePanelDefinition = ui.activePanel
    ? PANEL_DEFINITIONS[ui.activePanel]
    : null
  const handleOpenPanel = (panel) => {
    if (ui.mode === 'panel' && ui.activePanel === panel) {
      closePanel()
      return
    }

    openPanel(panel)
  }

  return (
    <>
      <StudyLayout
        variant={displayMode}
        timerDisplayMode={preferences.timerDisplayMode}
        chrome={
          <StudyChromeWidget
            mode={displayMode}
            activePanel={ui.activePanel}
            onOpenPanel={handleOpenPanel}
          />
        }
        center={
          <TimerPanel
            mode={displayMode}
            sceneLabel={activeScene.label}
            timerDisplayMode={preferences.timerDisplayMode}
            timerStatus={timer.status}
            onEnterFocus={enterFocusMode}
            onExitFocus={enterIdleMode}
          />
        }
        onSceneClick={displayMode === 'focus' ? enterIdleMode : undefined}
      />

      {ui.mode === 'panel' && activePanelDefinition ? (
        <PanelOverlay
          title={activePanelDefinition.title}
          description={activePanelDefinition.description}
          onClose={closePanel}
        >
          {activePanelDefinition.render()}
        </PanelOverlay>
      ) : null}
    </>
  )
}
