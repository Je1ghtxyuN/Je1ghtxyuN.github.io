import sceneOneLoop from '../../../../packages/shared-assets/videos/1.mp4'
import sceneOnePoster from '../../../../packages/shared-assets/videos/1-poster.png'
import sceneTwoLoop from '../../../../packages/shared-assets/videos/2.mp4'
import sceneTwoPoster from '../../../../packages/shared-assets/videos/2-poster.png'
import sceneThreeLoop from '../../../../packages/shared-assets/videos/3.mp4'
import sceneThreePoster from '../../../../packages/shared-assets/videos/3-poster.png'

const DEFAULT_MEDIA_BEHAVIOR = Object.freeze({
  type: 'video',
  src: '',
  poster: '',
  mimeType: 'video/mp4',
  autoPlay: true,
  loop: true,
  muted: true,
  playsInline: true,
})

const DEFAULT_REACTIVE_ATMOSPHERE = Object.freeze({
  work: Object.freeze({
    overlayShift: Object.freeze({
      idle: 0.05,
      focus: 0.08,
    }),
    highlightOpacity: 0.08,
    glowOpacity: 0.66,
    glowScale: 1.02,
    glowDriftY: '-1.15%',
    vignetteOpacity: 0.82,
    mediaBrightness: 0.68,
    mediaSaturation: 1.02,
    mediaContrast: 1.06,
    motionDurationScale: 0.92,
    overlayDriftY: '-0.55%',
    grainDriftX: '-1.25%',
    grainDriftY: '0.72%',
  }),
  shortBreak: Object.freeze({
    overlayShift: Object.freeze({
      idle: -0.04,
      focus: -0.08,
    }),
    highlightOpacity: 0.12,
    glowOpacity: 0.78,
    glowScale: 1.06,
    glowDriftY: '-1.55%',
    vignetteOpacity: 0.68,
    mediaBrightness: 0.76,
    mediaSaturation: 1.05,
    mediaContrast: 1.02,
    motionDurationScale: 1.06,
    overlayDriftY: '-0.4%',
    grainDriftX: '-1%',
    grainDriftY: '0.6%',
  }),
  longBreak: Object.freeze({
    overlayShift: Object.freeze({
      idle: -0.08,
      focus: -0.12,
    }),
    highlightOpacity: 0.15,
    glowOpacity: 0.84,
    glowScale: 1.08,
    glowDriftY: '-1.8%',
    vignetteOpacity: 0.62,
    mediaBrightness: 0.8,
    mediaSaturation: 1.08,
    mediaContrast: 1,
    motionDurationScale: 1.18,
    overlayDriftY: '-0.32%',
    grainDriftX: '-0.8%',
    grainDriftY: '0.48%',
  }),
})

function clampDecimal(value, fallback, minimum = 0, maximum = 1.4) {
  const parsed = Number(value)

  if (!Number.isFinite(parsed)) return fallback

  return Math.min(maximum, Math.max(minimum, parsed))
}

function mergeReactiveAtmosphere(overrides = {}) {
  return Object.freeze({
    work: Object.freeze({
      ...DEFAULT_REACTIVE_ATMOSPHERE.work,
      ...overrides.work,
      overlayShift: {
        ...DEFAULT_REACTIVE_ATMOSPHERE.work.overlayShift,
        ...(overrides.work?.overlayShift ?? {}),
      },
    }),
    shortBreak: Object.freeze({
      ...DEFAULT_REACTIVE_ATMOSPHERE.shortBreak,
      ...overrides.shortBreak,
      overlayShift: {
        ...DEFAULT_REACTIVE_ATMOSPHERE.shortBreak.overlayShift,
        ...(overrides.shortBreak?.overlayShift ?? {}),
      },
    }),
    longBreak: Object.freeze({
      ...DEFAULT_REACTIVE_ATMOSPHERE.longBreak,
      ...overrides.longBreak,
      overlayShift: {
        ...DEFAULT_REACTIVE_ATMOSPHERE.longBreak.overlayShift,
        ...(overrides.longBreak?.overlayShift ?? {}),
      },
    }),
  })
}

function createSceneDefinition(scene) {
  const { reactiveAtmosphere: sceneAtmosphere, ...sceneRest } = scene
  const media = {
    ...DEFAULT_MEDIA_BEHAVIOR,
    ...(sceneRest.media ?? {}),
  }

  return Object.freeze({
    backgroundPosition: 'center center',
    backgroundScale: 1.04,
    idleOverlayStrength: 0.4,
    focusOverlayStrength: 0.68,
    ambientGlow: 'rgba(102, 164, 255, 0.24)',
    accentGlow: 'rgba(255, 214, 156, 0.14)',
    vignetteColor: 'rgba(4, 8, 15, 0.76)',
    description: 'Scene placeholder',
    mediaType: media.type,
    mediaSrc: media.src,
    posterImage: media.poster,
    videoType: media.mimeType,
    videoAutoPlay: media.autoPlay,
    videoLoop: media.loop,
    videoMuted: media.muted,
    videoPlaysInline: media.playsInline,
    reactiveAtmosphere: mergeReactiveAtmosphere(sceneAtmosphere),
    ...sceneRest,
  })
}

export const STUDY_SCENES = Object.freeze([
  createSceneDefinition({
    id: 'coastal-cafe',
    localeKey: 'coastalCafe',
    name: 'Coastal Cafe',
    label: 'Coastal Cafe',
    description:
      'Bright open-air cafe loop for lighter daytime focus sessions.',
    media: {
      type: 'video',
      src: sceneOneLoop,
      poster: sceneOnePoster,
    },
    backgroundPosition: 'center center',
    backgroundScale: 1.03,
    idleOverlayStrength: 0.22,
    focusOverlayStrength: 0.46,
    ambientGlow: 'rgba(126, 210, 255, 0.22)',
    accentGlow: 'rgba(255, 230, 176, 0.18)',
    vignetteColor: 'rgba(4, 11, 22, 0.52)',
    reactiveAtmosphere: {
      work: {
        mediaBrightness: 0.7,
        overlayShift: {
          idle: 0.02,
          focus: 0.05,
        },
      },
      shortBreak: {
        glowOpacity: 0.82,
        mediaBrightness: 0.8,
      },
      longBreak: {
        glowOpacity: 0.88,
        mediaBrightness: 0.84,
      },
    },
  }),
  createSceneDefinition({
    id: 'retro-desk',
    localeKey: 'retroDesk',
    name: 'Retro Desk',
    label: 'Retro Desk',
    description:
      'Warmer CRT desk loop with a denser night-study atmosphere.',
    media: {
      type: 'video',
      src: sceneTwoLoop,
      poster: sceneTwoPoster,
    },
    backgroundPosition: 'center center',
    backgroundScale: 1.05,
    idleOverlayStrength: 0.36,
    focusOverlayStrength: 0.62,
    ambientGlow: 'rgba(120, 189, 255, 0.18)',
    accentGlow: 'rgba(255, 197, 127, 0.16)',
    vignetteColor: 'rgba(5, 9, 16, 0.74)',
    reactiveAtmosphere: {
      work: {
        overlayShift: {
          idle: 0.06,
          focus: 0.11,
        },
        vignetteOpacity: 0.86,
      },
      shortBreak: {
        overlayShift: {
          idle: -0.02,
          focus: -0.06,
        },
      },
      longBreak: {
        glowOpacity: 0.8,
        motionDurationScale: 1.12,
      },
    },
  }),
  createSceneDefinition({
    id: 'aquarium-room',
    localeKey: 'aquariumRoom',
    name: 'Aquarium Room',
    label: 'Aquarium Room',
    description:
      'Quiet indoor loop with aquarium glow for late-night deep work.',
    media: {
      type: 'video',
      src: sceneThreeLoop,
      poster: sceneThreePoster,
    },
    backgroundPosition: 'center center',
    backgroundScale: 1.04,
    idleOverlayStrength: 0.34,
    focusOverlayStrength: 0.58,
    ambientGlow: 'rgba(123, 194, 255, 0.24)',
    accentGlow: 'rgba(214, 246, 255, 0.14)',
    vignetteColor: 'rgba(4, 8, 14, 0.72)',
    reactiveAtmosphere: {
      work: {
        glowOpacity: 0.72,
      },
      shortBreak: {
        glowOpacity: 0.82,
        highlightOpacity: 0.13,
      },
      longBreak: {
        glowOpacity: 0.9,
        glowScale: 1.1,
        motionDurationScale: 1.2,
      },
    },
  }),
])

export const DEFAULT_SCENE_ID = STUDY_SCENES[0].id

const STUDY_SCENE_MAP = new Map(STUDY_SCENES.map((scene) => [scene.id, scene]))

export function getStudyScene(sceneId = DEFAULT_SCENE_ID) {
  return STUDY_SCENE_MAP.get(sceneId) ?? STUDY_SCENE_MAP.get(DEFAULT_SCENE_ID)
}

export function resolveStudyScenePresentation(
  scene,
  { sessionType = 'work', uiMode = 'idle' } = {},
) {
  const activeScene = scene ?? getStudyScene()
  const sessionKey =
    activeScene.reactiveAtmosphere?.[sessionType] != null
      ? sessionType
      : 'work'
  const modeKey = uiMode === 'focus' ? 'focus' : 'idle'
  const reactiveAtmosphere = activeScene.reactiveAtmosphere[sessionKey]
  const overlayShift = reactiveAtmosphere.overlayShift?.[modeKey] ?? 0
  const baseOverlayStrength =
    modeKey === 'focus'
      ? activeScene.focusOverlayStrength
      : activeScene.idleOverlayStrength

  return {
    sessionType: sessionKey,
    uiMode: modeKey,
    overlayStrength: clampDecimal(
      baseOverlayStrength + overlayShift,
      baseOverlayStrength,
    ),
    highlightOpacity: clampDecimal(
      reactiveAtmosphere.highlightOpacity,
      0.1,
      0,
      0.3,
    ),
    glowOpacity: clampDecimal(reactiveAtmosphere.glowOpacity, 0.74),
    glowScale: clampDecimal(reactiveAtmosphere.glowScale, 1.05, 0.9, 1.2),
    glowDriftY: reactiveAtmosphere.glowDriftY ?? '-1.4%',
    vignetteOpacity: clampDecimal(reactiveAtmosphere.vignetteOpacity, 0.78),
    mediaBrightness: clampDecimal(
      reactiveAtmosphere.mediaBrightness,
      0.72,
      0.4,
      1,
    ),
    mediaSaturation: clampDecimal(
      reactiveAtmosphere.mediaSaturation,
      1.03,
      0.5,
      1.4,
    ),
    mediaContrast: clampDecimal(
      reactiveAtmosphere.mediaContrast,
      1.04,
      0.6,
      1.3,
    ),
    motionDurationScale: clampDecimal(
      reactiveAtmosphere.motionDurationScale,
      1,
      0.7,
      1.6,
    ),
    overlayDriftY: reactiveAtmosphere.overlayDriftY ?? '-0.5%',
    grainDriftX: reactiveAtmosphere.grainDriftX ?? '-1.2%',
    grainDriftY: reactiveAtmosphere.grainDriftY ?? '0.7%',
  }
}
