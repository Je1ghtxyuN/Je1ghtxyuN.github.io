import { LOCAL_AMBIENT_TRACKS } from './tracks.js'

export const MUSIC_SOURCE_TYPES = Object.freeze({
  local: 'local',
  cloudFuture: 'cloud_future',
})

const LOCAL_TRACK_SOURCE = Object.freeze({
  type: MUSIC_SOURCE_TYPES.local,
  label: 'Local Library',
  description:
    'Bundled local ambience keeps the current Study Room self-contained and offline-safe.',
  getTracks() {
    return LOCAL_AMBIENT_TRACKS
  },
})

const CLOUD_FUTURE_TRACK_SOURCE = Object.freeze({
  type: MUSIC_SOURCE_TYPES.cloudFuture,
  label: 'Cloud Music',
  description: 'Cloud music integration coming soon.',
  getTracks() {
    return LOCAL_AMBIENT_TRACKS
  },
})

export function getAmbientTrackSource(
  sourceType = MUSIC_SOURCE_TYPES.local,
) {
  // Future cloud providers should attach here. The playback controller already
  // consumes a track-source abstraction so we can add API-backed catalogs
  // later without rewriting audio transport logic.
  switch (sourceType) {
    case MUSIC_SOURCE_TYPES.cloudFuture:
      return CLOUD_FUTURE_TRACK_SOURCE

    case MUSIC_SOURCE_TYPES.local:
    default:
      return LOCAL_TRACK_SOURCE
  }
}
