export function BackgroundLayer({ scene }) {
  const sceneStyle = {
    '--study-background-image': `url(${scene.posterUrl || scene.imageUrl})`,
    '--study-background-overlay': scene.overlayGradient,
    '--study-background-focus-overlay':
      scene.focusOverlayGradient || scene.overlayGradient,
    '--study-background-glow': scene.glowColor,
  }

  const mediaType = scene.mediaType || 'image'
  const hasVideoLayer = mediaType === 'video' && scene.videoUrl

  return (
    <div className="background-layer" style={sceneStyle} aria-hidden="true">
      <div className="background-layer__media">
        <div className="background-layer__image" />
        {hasVideoLayer ? (
          <video
            className="background-layer__video"
            autoPlay={scene.videoAutoPlay ?? true}
            loop={scene.videoLoop ?? true}
            muted={scene.videoMuted ?? true}
            playsInline
            poster={scene.posterUrl || scene.imageUrl}
          >
            <source src={scene.videoUrl} type={scene.videoType || 'video/mp4'} />
          </video>
        ) : null}
      </div>
      <div className="background-layer__overlay" />
      <div className="background-layer__grain" />
    </div>
  )
}
