import { useEffect, useRef, useState } from 'react'
import {
  useStudyRoomActions,
  useStudyRoomState,
} from '../../state/useStudyRoom.js'
import { AMBIENT_TRACKS } from './tracks.js'

const getTrackIndex = (trackId) => {
  const index = AMBIENT_TRACKS.findIndex((track) => track.id === trackId)
  return index >= 0 ? index : 0
}

export function useAmbientMusicController() {
  const { preferences } = useStudyRoomState()
  const { setPreference } = useStudyRoomActions()
  const audioRef = useRef(null)
  const playbackStateRef = useRef('idle')
  const [playbackState, setPlaybackState] = useState('idle')
  const [playbackError, setPlaybackError] = useState('')

  const selectedTrackIndex = getTrackIndex(preferences.selectedTrackId)
  const currentTrack = AMBIENT_TRACKS[selectedTrackIndex]

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
      (selectedTrackIndex + direction + AMBIENT_TRACKS.length) % AMBIENT_TRACKS.length
    selectTrack(AMBIENT_TRACKS[nextIndex].id)
  }

  return {
    tracks: AMBIENT_TRACKS,
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
