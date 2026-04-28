import { useEffect, useRef, useState } from 'react'
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
  const audioRef = useRef(null)
  const playbackStateRef = useRef('idle')
  const [playbackState, setPlaybackState] = useState('idle')
  const [playbackError, setPlaybackError] = useState('')
  const trackSource = getAmbientTrackSource(MUSIC_SOURCE_TYPES.local)
  const tracks = trackSource.getTracks()

  const selectedTrackIndex = getTrackIndex(tracks, preferences.selectedTrackId)
  const currentTrack = tracks[selectedTrackIndex]

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

    if (!audio) return

    audio.pause()
    audio.src = currentTrack.src
    audio.load()

    if (playbackStateRef.current !== 'playing') return

    void audio.play().catch(() => {
      setPlaybackState('paused')
      setPlaybackError('Playback is blocked until the browser receives a user gesture.')
    })
  }, [currentTrack.id, currentTrack.src])

  useEffect(() => {
    if (preferences.soundEnabled) return

    const audio = audioRef.current

    if (!audio) return

    audio.pause()
    setPlaybackState('paused')
  }, [preferences.soundEnabled])

  const play = async () => {
    const audio = audioRef.current

    if (!audio || !preferences.soundEnabled) {
      setPlaybackError('Enable sound before starting ambient playback.')
      return
    }

    try {
      await audio.play()
      setPlaybackState('playing')
      setPlaybackError('')
    } catch {
      setPlaybackState('paused')
      setPlaybackError('Playback is blocked until the browser receives a user gesture.')
    }
  }

  const pause = () => {
    const audio = audioRef.current

    if (!audio) return

    audio.pause()
    setPlaybackState('paused')
  }

  const selectTrack = (trackId) => {
    setPreference('selectedTrackId', trackId)
    setPlaybackError('')
  }

  const goToTrack = (direction) => {
    const nextIndex =
      (selectedTrackIndex + direction + tracks.length) % tracks.length
    selectTrack(tracks[nextIndex].id)
  }

  return {
    musicSourceType: trackSource.type,
    musicSourceLabel: trackSource.label,
    musicSourceDescription: trackSource.description,
    tracks,
    currentTrack,
    playbackState,
    playbackError,
    volume: preferences.volume,
    soundEnabled: preferences.soundEnabled,
    play,
    pause,
    togglePlayback() {
      if (playbackState === 'playing') {
        pause()
        return
      }

      void play()
    },
    selectTrack,
    nextTrack() {
      goToTrack(1)
    },
    previousTrack() {
      goToTrack(-1)
    },
    setVolume(value) {
      setPreference('volume', value)
    },
  }
}
