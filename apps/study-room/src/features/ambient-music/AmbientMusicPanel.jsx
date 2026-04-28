import { useAmbientMusicController } from './useAmbientMusicController.js'

export function AmbientMusicPanel() {
  const {
    musicSourceLabel,
    tracks,
    currentTrack,
    playbackState,
    playbackError,
    volume,
    soundEnabled,
    togglePlayback,
    selectTrack,
    nextTrack,
    previousTrack,
    setVolume,
  } = useAmbientMusicController()

  return (
    <section className="floating-widget music-widget">
      <div className="floating-widget__header">
        <div>
          <p className="floating-widget__eyebrow">Ambient Music</p>
          <h2 className="floating-widget__title">{currentTrack.title}</h2>
          <p className="floating-widget__meta">{musicSourceLabel}</p>
        </div>
        <span className="floating-widget__badge">{playbackState}</span>
      </div>

      <div className="field">
        <label htmlFor="track-select">Track</label>
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
          Previous
        </button>
        <button
          type="button"
          className="button button--primary"
          onClick={togglePlayback}
          disabled={!soundEnabled}
        >
          {playbackState === 'playing' ? 'Pause' : 'Play'}
        </button>
        <button
          type="button"
          className="button button--ghost"
          onClick={nextTrack}
        >
          Next
        </button>
      </div>

      <div className="field">
        <label htmlFor="music-volume">Volume</label>
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

      <p className="floating-widget__meta">{currentTrack.note}</p>
      {playbackError ? (
        <p className="floating-widget__hint">{playbackError}</p>
      ) : null}
    </section>
  )
}
