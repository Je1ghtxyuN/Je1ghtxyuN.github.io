import { useStudyRoomLocale } from '../../i18n/useStudyRoomLocale.js'
import { useAmbientMusicController } from './useAmbientMusicController.js'
import { MUSIC_SOURCE_TYPES } from './musicSources.js'

export function AmbientMusicPanel() {
  const { t } = useStudyRoomLocale()
  const {
    musicSourceType,
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
    setSource,
  } = useAmbientMusicController()
  const currentTrackTitle = currentTrack.title || t('studyRoom.music.noTrack', {}, 'No track')
  const artists = currentTrack.artists || ''

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
          {loading ? 'Loading...' : t(`studyRoom.music.playback.${playbackState}`, {}, playbackState)}
        </span>
      </div>

      <div className="field">
        <label>{t('common.source', {}, 'Source')}</label>
        <select
          className="select"
          value={musicSourceType}
          onChange={(e) => setSource(e.target.value)}
        >
          <option value={MUSIC_SOURCE_TYPES.local}>Local Library</option>
          <option value={MUSIC_SOURCE_TYPES.netease}>NetEase Cloud</option>
        </select>
      </div>

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
        <button
          type="button"
          className="button button--ghost"
          onClick={previousTrack}
        >
          {t('common.previous', {}, 'Previous')}
        </button>
        <button
          type="button"
          className="button button--primary"
          onClick={togglePlayback}
          disabled={!soundEnabled}
        >
          {playbackState === 'playing'
            ? t('common.pause', {}, 'Pause')
            : t('common.play', {}, 'Play')}
        </button>
        <button
          type="button"
          className="button button--ghost"
          onClick={nextTrack}
        >
          {t('common.next', {}, 'Next')}
        </button>
      </div>

      <div className="field">
        <label htmlFor="music-volume">
          {t('common.volume', {}, 'Volume')}
        </label>
        <input
          id="music-volume"
          className="feature-card__slider"
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(event) => setVolume(event.target.value)}
        />
      </div>

      <p className="floating-widget__meta">{musicSourceLabel}</p>
      {playbackError ? (
        <p className="floating-widget__hint">{playbackError}</p>
      ) : null}
    </section>
  )
}
