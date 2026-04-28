import { PanelOverlay } from '../PanelOverlay.jsx'
import { SettingsPanelContent } from '../panels/SettingsPanelContent.jsx'
import { StudyChromeWidget } from '../StudyChromeWidget.jsx'
import { AmbientMusicPanel } from '../../features/ambient-music/index.js'
import { StudyStatisticsPanel } from '../../features/study-statistics/index.js'
import { TimerPanel } from '../../features/timer/index.js'
import { TodoPanel } from '../../features/todo/index.js'
import { useStudyRoomLocale } from '../../i18n/useStudyRoomLocale.js'
import { getStudyScene } from '../../lib/studyScene.js'
import { StudyLayout } from '../../layouts/StudyLayout.jsx'
import {
  useStudyRoomActions,
  useStudyRoomState,
} from '../../state/useStudyRoom.js'

export function StudyPage() {
  const { preferences, timer, ui } = useStudyRoomState()
  const { closePanel, enterFocusMode, enterIdleMode, openPanel } =
    useStudyRoomActions()
  const { t } = useStudyRoomLocale()
  const displayMode = ui.mode === 'panel' ? ui.previousMode : ui.mode
  const activeScene = getStudyScene(preferences.selectedSceneId)
  const panelDefinitions = {
    todo: {
      title: t('studyRoom.panels.todo.title', {}, 'Todo Panel'),
      description: t(
        'studyRoom.panels.todo.description',
        {},
        'Small task capture stays available as an overlay instead of permanently occupying the layout.',
      ),
      render: () => <TodoPanel />,
    },
    music: {
      title: t('studyRoom.panels.music.title', {}, 'Music Panel'),
      description: t(
        'studyRoom.panels.music.description',
        {},
        'Ambient playback remains available without crowding the main focus scene.',
      ),
      render: () => <AmbientMusicPanel />,
    },
    statistics: {
      title: t('studyRoom.panels.statistics.title', {}, 'Statistics Panel'),
      description: t(
        'studyRoom.panels.statistics.description',
        {},
        'Session counters and future progress views now live in a dedicated overlay surface.',
      ),
      render: () => <StudyStatisticsPanel />,
    },
    settings: {
      title: t('studyRoom.panels.settings.title', {}, 'Settings Panel'),
      description: t(
        'studyRoom.panels.settings.description',
        {},
        'Timer configuration and shared preferences open as a floating panel instead of a separate dashboard route.',
      ),
      render: () => <SettingsPanelContent />,
    },
  }
  const activePanelDefinition = ui.activePanel
    ? panelDefinitions[ui.activePanel]
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
            sceneLabel={t(
              `studyRoom.scenes.${activeScene.localeKey}.name`,
              {},
              activeScene.label,
            )}
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
