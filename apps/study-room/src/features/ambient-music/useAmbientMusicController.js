import { useCallback, useEffect, useRef, useState } from 'react'
import { useStudyRoomLocale } from '../../i18n/useStudyRoomLocale.js'
import {
  useStudyRoomActions,
  useStudyRoomState,
} from '../../state/useStudyRoom.js'
import { getAmbientTrackSource, MUSIC_SOURCE_TYPES } from './musicSources.js'
import { loginNetEase, loginNetEasePhone, sendSmsCode, verifySmsCode, fetchUserPlaylists } from './neteaseSource.js'

const getTrackIndex = (tracks, trackId) => {
  const index = tracks.findIndex((track) => track.id === trackId)
  return index >= 0 ? index : 0
}

// Shared audio ref — survives panel mount/unmount
let globalAudio = null

function getGlobalAudio() {
  if (!globalAudio) {
    globalAudio = new Audio()
    globalAudio.preload = 'auto'
  }
  return globalAudio
}

export function useAmbientMusicController() {
  const { preferences } = useStudyRoomState()
  const { setPreference } = useStudyRoomActions()
  const { t } = useStudyRoomLocale()
  const nextTrackRef = useRef(null)
  const [playbackState, setPlaybackState] = useState(getGlobalAudio().paused ? 'idle' : 'playing')
  const [playbackError, setPlaybackError] = useState('')
  const [tracks, setTracks] = useState([])
  const [playlistName, setPlaylistName] = useState('')
  const [loading, setLoading] = useState(false)
  const [neteaseUser, setNeteaseUser] = useState(null)
  const [userPlaylists, setUserPlaylists] = useState([])
  const [loginError, setLoginError] = useState('')
  const sourceType = MUSIC_SOURCE_TYPES.netease
  const trackSource = getAmbientTrackSource(sourceType)
  const audio = getGlobalAudio()

  const selectedTrackIndex = getTrackIndex(tracks, preferences.selectedTrackId)
  const currentTrack = tracks[selectedTrackIndex] || { id: '', title: '', src: '' }

  // Load NetEase playlist on mount
  useEffect(() => {
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
  }, [])

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

  // Store nextTrack function in ref so ended listener always has latest
  nextTrackRef.current = () => goToTrack(1)

  // Auto-advance to next track when current ends
  useEffect(() => {
    const handleEnded = () => { nextTrackRef.current?.() }
    audio.addEventListener('ended', handleEnded)
    return () => audio.removeEventListener('ended', handleEnded)
  }, [])

  const doNetEaseLogin = useCallback(async (account, password) => {
    setLoginError('')
    try {
      // Auto-detect: if account looks like a phone number (11 digits), use phone login
      const isPhone = /^\d{11}$/.test(account)
      const result = isPhone
        ? await loginNetEasePhone(account, password)
        : await loginNetEase(account, password)
      if (result.ok) {
        setNeteaseUser(result.profile)
        localStorage.setItem('netease_user', JSON.stringify(result.profile))
        const pl = await fetchUserPlaylists()
        setUserPlaylists(pl.playlists || [])
      } else {
        setLoginError(result.message || 'Login failed')
      }
    } catch (e) {
      setLoginError(e.message)
    }
  }, [])

  const doSendSms = useCallback(async (phone) => {
    setLoginError('')
    try {
      const result = await sendSmsCode(phone)
      if (!result.ok) setLoginError(result.message || 'Failed to send SMS')
      return result.ok
    } catch (e) {
      setLoginError(e.message)
      return false
    }
  }, [])

  const doSmsLogin = useCallback(async (phone, code) => {
    setLoginError('')
    try {
      const result = await verifySmsCode(phone, code)
      if (result.ok) {
        setNeteaseUser(result.profile)
        localStorage.setItem('netease_user', JSON.stringify(result.profile))
        const pl = await fetchUserPlaylists()
        setUserPlaylists(pl.playlists || [])
      } else {
        setLoginError(result.message || 'Verification failed')
      }
    } catch (e) {
      setLoginError(e.message)
    }
  }, [])

  const doNetEaseLogout = useCallback(() => {
    setNeteaseUser(null)
    setUserPlaylists([])
    localStorage.removeItem('netease_user')
  }, [])

  const switchToPlaylist = useCallback(async (playlistId) => {
    setLoading(true)
    try {
      const res = await fetch(`${import.meta.env.DEV ? 'http://localhost:3001' : ''}/music/playlist/${playlistId}`)
      const data = await res.json()
      if (data.playlist) {
        const newTracks = data.playlist.tracks.map((t) => ({
          id: String(t.id),
          title: t.name,
          artists: t.artists.map((a) => a.name).join(', '),
          album: t.album,
          duration: t.duration,
          src: '',
        }))
        setTracks(newTracks)
        setPlaylistName(data.playlist.name)
        if (newTracks.length > 0) {
          selectTrack(newTracks[0].id)
        }
      }
    } catch (e) {
      setLoginError(e.message)
    } finally {
      setLoading(false)
    }
  }, [selectTrack])

  // Restore login state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('netease_user')
      if (saved) {
        const profile = JSON.parse(saved)
        setNeteaseUser(profile)
        fetchUserPlaylists().then((pl) => setUserPlaylists(pl.playlists || []))
      }
    } catch {}
  }, [])

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
    // NetEase login
    neteaseUser,
    userPlaylists,
    loginError,
    doNetEaseLogin,
    doNetEaseLogout,
    doSendSms,
    doSmsLogin,
    switchToPlaylist,
  }
}
