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

export function useAmbientMusicController() {
  const { preferences } = useStudyRoomState()
  const { setPreference } = useStudyRoomActions()
  const { t } = useStudyRoomLocale()
  const audioRef = useRef(null)
  const playbackStateRef = useRef('idle')
  const [playbackState, setPlaybackState] = useState('idle')
  const [playbackError, setPlaybackError] = useState('')
  const [tracks, setTracks] = useState([])
  const [playlistName, setPlaylistName] = useState('')
  const [loading, setLoading] = useState(false)
  const sourceType = preferences.musicSourceType || MUSIC_SOURCE_TYPES.local
  const trackSource = getAmbientTrackSource(sourceType)

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

  // Fetch song URL when track changes (Netease URLs expire)
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

  useEffect(() => {
    const audio = new Audio()
    audio.loop = true
    audio.preload = 'auto'
    audioRef.current = audio

    return () => {
      audio.pause()
      audio.src = ''
      audioRef.current = null
    }
  }, [])

  useEffect(() => {
    playbackStateRef.current = playbackState
  }, [playbackState])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = preferences.volume
  }, [preferences.volume])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack.src) return

    audio.pause()
    audio.src = currentTrack.src
    audio.load()

    if (playbackStateRef.current !== 'playing') return

    void audio.play().catch(() => {
      setPlaybackState('paused')
      setPlaybackError(t('studyRoom.music.errors.blocked', {}, 'Playback blocked'))
    })
  }, [currentTrack.id, currentTrack.src, t])

  useEffect(() => {
    if (preferences.soundEnabled) return
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    setPlaybackState('paused')
  }, [preferences.soundEnabled])

  const play = useCallback(async () => {
    const audio = audioRef.current
    if (!audio || !preferences.soundEnabled) {
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
    const audio = audioRef.current
    if (!audio) return
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
