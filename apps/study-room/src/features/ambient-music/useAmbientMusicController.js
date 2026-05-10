import { useCallback, useEffect, useRef, useState } from 'react'
import { useStudyRoomLocale } from '../../i18n/useStudyRoomLocale.js'
import {
  useStudyRoomActions,
  useStudyRoomState,
} from '../../state/useStudyRoom.js'
import { getAmbientTrackSource, MUSIC_SOURCE_TYPES } from './musicSources.js'

const getTrackIndex = (tracks, trackId) => {
  const index = tracks.findIndex((track) => track.id === trackId)
  return index >= 0 ? index : 0
}

// Shared audio ref — survives panel mount/unmount
let globalAudio = null

function getGlobalAudio() {
  if (!globalAudio) {
    globalAudio = new Audio()
    globalAudio.loop = true
    globalAudio.preload = 'auto'
  }
  return globalAudio
}

export function useAmbientMusicController() {
  const { preferences } = useStudyRoomState()
  const { setPreference } = useStudyRoomActions()
  const { t } = useStudyRoomLocale()
  const playbackStateRef = useRef(getGlobalAudio().paused ? 'idle' : 'playing')
  const [playbackState, setPlaybackState] = useState(getGlobalAudio().paused ? 'idle' : 'playing')
  const [playbackError, setPlaybackError] = useState('')
  const [tracks, setTracks] = useState([])
  const [playlistName, setPlaylistName] = useState('')
  const [loading, setLoading] = useState(false)
  const sourceType = preferences.musicSourceType || MUSIC_SOURCE_TYPES.local
  const trackSource = getAmbientTrackSource(sourceType)
  const audio = getGlobalAudio()

  const selectedTrackIndex = getTrackIndex(tracks, preferences.selectedTrackId)
  const currentTrack = tracks[selectedTrackIndex] || { id: '', title: '', src: '' }

  // Load playlist when source changes
  useEffect(() => {
    if (sourceType === MUSIC_SOURCE_TYPES.netease) {
      setLoading(true)
      trackSource.loadPlaylist().then(({ tracks: newTracks, name }) => {
        setTracks(newTracks)
        setPlaylistName(name)
        setLoading(false)
        if (newTracks.length > 0 && !preferences.selectedTrackId) {
          setPreference('selectedTrackId', newTracks[0].id)
        }
      }).catch(() => {
        setLoading(false)
      })
    } else {
      setTracks(trackSource.getTracks())
      setPlaylistName('')
    }
  }, [sourceType])

  // Fetch song URL when track changes
  useEffect(() => {
    if (sourceType !== MUSIC_SOURCE_TYPES.netease) return
    if (!currentTrack.id) return
    trackSource.getTrackUrl(currentTrack.id).then((url) => {
      if (url) {
        setTracks((prev) =>
          prev.map((t) => (t.id === currentTrack.id ? { ...t, src: url } : t)),
        )
      }
    })
  }, [currentTrack.id, sourceType])

  // Sync volume
  useEffect(() => {
    audio.volume = preferences.volume
  }, [preferences.volume])

  // Switch track
  useEffect(() => {
    if (!currentTrack.src) return
    const wasPlaying = !audio.paused
    audio.pause()
    audio.src = currentTrack.src
    audio.load()
    if (wasPlaying) {
      void audio.play().catch(() => {
        setPlaybackState('paused')
      })
    }
  }, [currentTrack.id, currentTrack.src])

  useEffect(() => {
    if (preferences.soundEnabled) return
    audio.pause()
    setPlaybackState('paused')
  }, [preferences.soundEnabled])

  const play = useCallback(async () => {
    if (!preferences.soundEnabled) {
      setPlaybackError(t('studyRoom.music.errors.enableSound', {}, 'Enable sound'))
      return
    }
    try {
      await audio.play()
      setPlaybackState('playing')
      setPlaybackError('')
    } catch {
      setPlaybackState('paused')
      setPlaybackError(t('studyRoom.music.errors.blocked', {}, 'Playback blocked'))
    }
  }, [preferences.soundEnabled, t])

  const pause = useCallback(() => {
    audio.pause()
    setPlaybackState('paused')
  }, [])

  const selectTrack = useCallback((trackId) => {
    setPreference('selectedTrackId', trackId)
    setPlaybackError('')
  }, [setPreference])

  const goToTrack = useCallback((direction) => {
    const nextIndex = (selectedTrackIndex + direction + tracks.length) % tracks.length
    selectTrack(tracks[nextIndex]?.id)
  }, [selectedTrackIndex, tracks, selectTrack])

  const setSource = useCallback((type) => {
    setPreference('musicSourceType', type)
  }, [setPreference])

  return {
    musicSourceType: sourceType,
    musicSourceLabel: sourceType === MUSIC_SOURCE_TYPES.netease
      ? playlistName || t('studyRoom.music.source.neteaseLabel', {}, 'NetEase Cloud')
      : t('studyRoom.music.source.localLabel', {}, 'Local Library'),
    tracks,
    currentTrack,
    playbackState,
    playbackError,
    loading,
    volume: preferences.volume,
    soundEnabled: preferences.soundEnabled,
    play,
    pause,
    togglePlayback() {
      if (playbackState === 'playing') pause()
      else void play()
    },
    selectTrack,
    nextTrack() { goToTrack(1) },
    previousTrack() { goToTrack(-1) },
    setVolume(value) { setPreference('volume', value) },
    setSource,
  }
}
