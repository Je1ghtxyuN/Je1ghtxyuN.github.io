import { useState } from 'react'
import { getStudyScene } from '../lib/studyScene.js'

function BackgroundVideo({ scene }) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <video
      className={`background-layer__video${isVisible ? ' background-layer__video--visible' : ''}`}
      autoPlay={scene.videoAutoPlay ?? true}
      loop={scene.videoLoop ?? true}
      muted={scene.videoMuted ?? true}
      playsInline
      preload="auto"
      poster={scene.posterImage || scene.backgroundImage}
      onCanPlay={() => setIsVisible(true)}
    >
      <source src={scene.mediaSrc} type={scene.videoType || 'video/mp4'} />
    </video>
  )
}

export function BackgroundLayer({ scene }) {
  const activeScene = scene ?? getStudyScene()
  const sceneStyle = {
    '--study-background-image': `url(${activeScene.posterImage || activeScene.backgroundImage || ''})`,
    '--study-background-idle-overlay-strength': `${activeScene.idleOverlayStrength ?? 0.42}`,
    '--study-background-focus-overlay-strength': `${activeScene.focusOverlayStrength ?? 0.68}`,
    '--study-background-glow': activeScene.ambientGlow,
    '--study-background-accent-glow': activeScene.accentGlow,
    '--study-background-vignette': activeScene.vignetteColor,
    '--study-background-position': activeScene.backgroundPosition || 'center center',
    '--study-background-scale': `${activeScene.backgroundScale ?? 1.06}`,
  }

  const mediaType = activeScene.mediaType || 'image'
  const hasVideoLayer = mediaType === 'video' && activeScene.mediaSrc

  return (
    <div
      className="background-layer"
      style={sceneStyle}
      data-scene-id={activeScene.id}
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
