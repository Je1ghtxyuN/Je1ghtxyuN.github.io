import { useState } from 'react'
import { useStudyRoomLocale } from '../../i18n/useStudyRoomLocale.js'
import { useAmbientMusicController } from './useAmbientMusicController.js'

export function AmbientMusicPanel() {
  const { t } = useStudyRoomLocale()
  const {
    musicSourceLabel,
    tracks,
    currentTrack,
    playbackState,
    playbackError,
    loading,
    volume,
    soundEnabled,
    togglePlayback,
    selectTrack,
    nextTrack,
    previousTrack,
    setVolume,
    neteaseUser,
    userPlaylists,
    loginError,
    doNetEaseLogin,
    doNetEaseLogout,
    switchToPlaylist,
  } = useAmbientMusicController()
  const currentTrackTitle = currentTrack.title || t('studyRoom.music.noTrack', {}, 'No track')
  const artists = currentTrack.artists || ''

  const [showLogin, setShowLogin] = useState(false)
  const [loginAccount, setLoginAccount] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = (e) => {
    e.preventDefault()
    doNetEaseLogin(loginAccount, loginPassword)
  }

  return (
    <section className="floating-widget music-widget">
      <div className="floating-widget__header">
        <div>
          <p className="floating-widget__eyebrow">
            {t('studyRoom.music.eyebrow', {}, 'Ambient Music')}
          </p>
          <h2 className="floating-widget__title">{currentTrackTitle}</h2>
          {artists ? <p className="floating-widget__meta">{artists}</p> : null}
        </div>
        <span className="floating-widget__badge">
          {loading ? 'Loading...' : t('studyRoom.music.playback.' + playbackState, {}, playbackState)}
        </span>
      </div>

      {/* NetEase account section */}
      <div className="music-widget__netease">
        {neteaseUser ? (
          <div className="netease-user">
            <span className="netease-user__name">
              <i className="fas fa-user-circle" /> {neteaseUser.nickname}
            </span>
            <button type="button" className="button button--ghost button--sm" onClick={doNetEaseLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="netease-login">
            {!showLogin ? (
              <button type="button" className="button button--ghost button--sm" onClick={() => setShowLogin(true)}>
                <i className="fas fa-music" /> Login NetEase
              </button>
            ) : (
              <form className="netease-login__form" onSubmit={handleLogin}>
                <div className="netease-login__field">
                  <i className="fas fa-user netease-login__icon" />
                  <input className="netease-login__input" type="text" placeholder="Email or phone number" value={loginAccount} onChange={(e) => setLoginAccount(e.target.value)} />
                </div>
                <div className="netease-login__field">
                  <i className="fas fa-lock netease-login__icon" />
                  <input className="netease-login__input" type={showPassword ? 'text' : 'password'} placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                  <button type="button" className="netease-login__eye" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                    <i className={showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'} />
                  </button>
                </div>
                <div className="netease-login__actions">
                  <button type="submit" className="button button--primary button--sm">Login</button>
                  <button type="button" className="button button--ghost button--sm" onClick={() => setShowLogin(false)}>Cancel</button>
                </div>
                {loginError ? <p className="floating-widget__hint">{loginError}</p> : null}
              </form>
            )}
          </div>
        )}
      </div>

      {/* User playlists */}
      {userPlaylists.length > 0 && (
        <div className="field">
          <label>My Playlists</label>
          <select className="select" onChange={(e) => { if (e.target.value) switchToPlaylist(e.target.value) }} defaultValue="">
            <option value="">{musicSourceLabel} (default)</option>
            {userPlaylists.map((pl) => (
              <option key={pl.id} value={pl.id}>{pl.name} ({pl.trackCount})</option>
            ))}
          </select>
        </div>
      )}

      <div className="field">
        <label htmlFor="track-select">
          {t('common.track', {}, 'Track')}
        </label>
        <select
          id="track-select"
          className="select"
          value={currentTrack.id}
          onChange={(event) => selectTrack(event.target.value)}
        >
          {tracks.map((track) => (
            <option key={track.id} value={track.id}>
              {track.title}
            </option>
          ))}
        </select>
      </div>

      <div className="music-widget__controls">
        <button type="button" className="button button--ghost" onClick={previousTrack}>
          {t('common.previous', {}, 'Previous')}
        </button>
        <button type="button" className="button button--primary" onClick={togglePlayback} disabled={!soundEnabled}>
          {playbackState === 'playing' ? t('common.pause', {}, 'Pause') : t('common.play', {}, 'Play')}
        </button>
        <button type="button" className="button button--ghost" onClick={nextTrack}>
          {t('common.next', {}, 'Next')}
        </button>
      </div>

      <div className="field">
        <label htmlFor="music-volume">{t('common.volume', {}, 'Volume')}</label>
        <input id="music-volume" className="feature-card__slider" type="range" min="0" max="1" step="0.05" value={volume} onChange={(event) => setVolume(event.target.value)} />
      </div>

      <p className="floating-widget__meta">{musicSourceLabel}</p>
      {playbackError ? <p className="floating-widget__hint">{playbackError}</p> : null}
    </section>
  )
}
