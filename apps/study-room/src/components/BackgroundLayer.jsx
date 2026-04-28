import { useState } from 'react'
import {
  getStudyScene,
  resolveStudyScenePresentation,
} from '../lib/studyScene.js'

function BackgroundVideo({ scene }) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <video
      className={`background-layer__video${isVisible ? ' background-layer__video--visible' : ''}`}
      autoPlay={scene.videoAutoPlay ?? true}
      loop={scene.videoLoop ?? true}
      muted={scene.videoMuted ?? true}
      playsInline={scene.videoPlaysInline ?? true}
      preload="auto"
      poster={scene.posterImage || scene.backgroundImage}
      onCanPlay={() => setIsVisible(true)}
    >
      <source src={scene.mediaSrc} type={scene.videoType || 'video/mp4'} />
    </video>
  )
}

export function BackgroundLayer({ scene, presentation }) {
  const activeScene = scene ?? getStudyScene()
  const activePresentation =
    presentation ?? resolveStudyScenePresentation(activeScene)
  const sceneStyle = {
    '--study-background-image': `url(${activeScene.posterImage || activeScene.backgroundImage || ''})`,
    '--study-background-overlay-strength': `${activePresentation.overlayStrength ?? activeScene.idleOverlayStrength ?? 0.42}`,
    '--study-background-highlight-opacity': `${activePresentation.highlightOpacity ?? 0.08}`,
    '--study-background-glow': activeScene.ambientGlow,
    '--study-background-accent-glow': activeScene.accentGlow,
    '--study-background-vignette': activeScene.vignetteColor,
    '--study-background-position': activeScene.backgroundPosition || 'center center',
    '--study-background-scale': `${activeScene.backgroundScale ?? 1.06}`,
    '--study-background-glow-opacity': `${activePresentation.glowOpacity ?? 0.72}`,
    '--study-background-glow-scale': `${activePresentation.glowScale ?? 1.05}`,
    '--study-background-glow-drift-y': activePresentation.glowDriftY ?? '-1.4%',
    '--study-background-vignette-opacity': `${activePresentation.vignetteOpacity ?? 0.78}`,
    '--study-background-media-brightness': `${activePresentation.mediaBrightness ?? 0.72}`,
    '--study-background-media-saturation': `${activePresentation.mediaSaturation ?? 1.03}`,
    '--study-background-media-contrast': `${activePresentation.mediaContrast ?? 1.04}`,
    '--study-background-motion-scale': `${activePresentation.motionDurationScale ?? 1}`,
    '--study-background-overlay-drift-y': activePresentation.overlayDriftY ?? '-0.5%',
    '--study-background-grain-drift-x': activePresentation.grainDriftX ?? '-1.2%',
    '--study-background-grain-drift-y': activePresentation.grainDriftY ?? '0.7%',
  }

  const mediaType = activeScene.mediaType || 'image'
  const hasVideoLayer = mediaType === 'video' && activeScene.mediaSrc

  return (
    <div
      className="background-layer"
      style={sceneStyle}
      data-scene-id={activeScene.id}
      data-session-type={activePresentation.sessionType}
      aria-hidden="true"
    >
      <div className="background-layer__media">
        <div className="background-layer__image" />
        {hasVideoLayer ? <BackgroundVideo key={activeScene.id} scene={activeScene} /> : null}
      </div>
      <div className="background-layer__ambient-glow" />
      <div className="background-layer__overlay" />
      <div className="background-layer__vignette" />
      <div className="background-layer__grain" />
    </div>
  )
}
