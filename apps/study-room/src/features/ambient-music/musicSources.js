import { LOCAL_AMBIENT_TRACKS } from './tracks.js'
import { fetchDefaultPlaylist, fetchSongUrl } from './neteaseSource.js'

export const MUSIC_SOURCE_TYPES = Object.freeze({
  local: 'local',
  netease: 'netease',
})

const LOCAL_TRACK_SOURCE = Object.freeze({
  type: MUSIC_SOURCE_TYPES.local,
  getTracks() {
    return LOCAL_AMBIENT_TRACKS
  },
})

let neteaseTracks = LOCAL_AMBIENT_TRACKS
let neteasePlaylistName = ''
let neteaseLoaded = false

const NETEASE_TRACK_SOURCE = Object.freeze({
  type: MUSIC_SOURCE_TYPES.netease,
  getTracks() {
    return neteaseTracks
  },
  getPlaylistName() {
    return neteasePlaylistName
  },
  async loadPlaylist() {
    if (neteaseLoaded) return { tracks: neteaseTracks, name: neteasePlaylistName }
    try {
      const { playlist, tracks } = await fetchDefaultPlaylist()
      neteaseTracks = tracks
      neteasePlaylistName = playlist.name
      neteaseLoaded = true
      return { tracks, name: playlist.name }
    } catch {
      return { tracks: LOCAL_AMBIENT_TRACKS, name: '' }
    }
  },
  async getTrackUrl(trackId) {
    try {
      return await fetchSongUrl(trackId)
    } catch {
      return null
    }
  },
})

export function getAmbientTrackSource(
  sourceType = MUSIC_SOURCE_TYPES.local,
) {
  switch (sourceType) {
    case MUSIC_SOURCE_TYPES.netease:
      return NETEASE_TRACK_SOURCE

    case MUSIC_SOURCE_TYPES.local:
    default:
      return LOCAL_TRACK_SOURCE
  }
}

