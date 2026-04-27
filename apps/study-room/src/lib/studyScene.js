import heroImage from '../assets/hero.png'

export const DEFAULT_STUDY_SCENE = Object.freeze({
  mediaType: 'image',
  imageUrl: heroImage,
  posterUrl: heroImage,
  videoUrl: '',
  videoType: 'video/mp4',
  videoAutoPlay: true,
  videoLoop: true,
  videoMuted: true,
  overlayGradient:
    'linear-gradient(180deg, rgba(6, 9, 15, 0.24) 0%, rgba(6, 9, 15, 0.68) 55%, rgba(6, 9, 15, 0.88) 100%)',
  focusOverlayGradient:
    'linear-gradient(180deg, rgba(4, 7, 12, 0.42) 0%, rgba(4, 7, 12, 0.72) 48%, rgba(4, 7, 12, 0.88) 100%)',
  glowColor: 'rgba(94, 199, 255, 0.22)',
})
