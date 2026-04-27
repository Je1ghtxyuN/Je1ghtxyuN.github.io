import { useAmbientMusicController } from './useAmbientMusicController.js'

export function AmbientMusicPanel() {
  const {
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
    <section className="feature-card">
      <div className="feature-card__header">
        <div>
          <h2>Ambient Music System</h2>
          <p className="feature-card__copy">
            The controller already supports play, pause, track switching, and
            volume updates using local placeholder tracks.
          </p>
        </div>
        <span className="feature-card__badge">{playbackState}</span>
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

      <div className="feature-card__actions">
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

      <p className="feature-card__meta">{currentTrack.note}</p>
      {playbackError ? (
        <p className="feature-card__hint">{playbackError}</p>
      ) : null}
    </section>
  )
}
