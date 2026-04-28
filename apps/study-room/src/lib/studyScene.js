import sceneOneLoop from '../../../../packages/shared-assets/videos/1.mp4'
import sceneOnePoster from '../../../../packages/shared-assets/videos/1-poster.png'
import sceneTwoLoop from '../../../../packages/shared-assets/videos/2.mp4'
import sceneTwoPoster from '../../../../packages/shared-assets/videos/2-poster.png'
import sceneThreeLoop from '../../../../packages/shared-assets/videos/3.mp4'
import sceneThreePoster from '../../../../packages/shared-assets/videos/3-poster.png'

function createSceneDefinition(scene) {
  return Object.freeze({
    mediaType: 'video',
    mediaSrc: '',
    posterImage: '',
    videoType: 'video/mp4',
    videoAutoPlay: true,
    videoLoop: true,
    videoMuted: true,
    backgroundPosition: 'center center',
    backgroundScale: 1.04,
    idleOverlayStrength: 0.4,
    focusOverlayStrength: 0.68,
    ambientGlow: 'rgba(102, 164, 255, 0.24)',
    accentGlow: 'rgba(255, 214, 156, 0.14)',
    vignetteColor: 'rgba(4, 8, 15, 0.76)',
    description: 'Scene placeholder',
    ...scene,
  })
}

export const STUDY_SCENES = Object.freeze([
  createSceneDefinition({
    id: 'coastal-cafe',
    name: 'Coastal Cafe',
    label: 'Coastal Cafe',
    description:
      'Bright open-air cafe loop for lighter daytime focus sessions.',
    mediaSrc: sceneOneLoop,
    posterImage: sceneOnePoster,
    backgroundPosition: 'center center',
    backgroundScale: 1.03,
    idleOverlayStrength: 0.22,
    focusOverlayStrength: 0.46,
    ambientGlow: 'rgba(126, 210, 255, 0.22)',
    accentGlow: 'rgba(255, 230, 176, 0.18)',
    vignetteColor: 'rgba(4, 11, 22, 0.52)',
  }),
  createSceneDefinition({
    id: 'retro-desk',
    name: 'Retro Desk',
    label: 'Retro Desk',
    description:
      'Warmer CRT desk loop with a denser night-study atmosphere.',
    mediaSrc: sceneTwoLoop,
    posterImage: sceneTwoPoster,
    backgroundPosition: 'center center',
    backgroundScale: 1.05,
    idleOverlayStrength: 0.36,
    focusOverlayStrength: 0.62,
    ambientGlow: 'rgba(120, 189, 255, 0.18)',
    accentGlow: 'rgba(255, 197, 127, 0.16)',
    vignetteColor: 'rgba(5, 9, 16, 0.74)',
  }),
  createSceneDefinition({
    id: 'aquarium-room',
    name: 'Aquarium Room',
    label: 'Aquarium Room',
    description:
      'Quiet indoor loop with aquarium glow for late-night deep work.',
    mediaSrc: sceneThreeLoop,
    posterImage: sceneThreePoster,
    backgroundPosition: 'center center',
    backgroundScale: 1.04,
    idleOverlayStrength: 0.34,
    focusOverlayStrength: 0.58,
    ambientGlow: 'rgba(123, 194, 255, 0.24)',
    accentGlow: 'rgba(214, 246, 255, 0.14)',
    vignetteColor: 'rgba(4, 8, 14, 0.72)',
  }),
])

export const DEFAULT_SCENE_ID = STUDY_SCENES[0].id

const STUDY_SCENE_MAP = new Map(STUDY_SCENES.map((scene) => [scene.id, scene]))

export function getStudyScene(sceneId = DEFAULT_SCENE_ID) {
  return STUDY_SCENE_MAP.get(sceneId) ?? STUDY_SCENE_MAP.get(DEFAULT_SCENE_ID)
}
