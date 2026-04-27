export function AuthPlaceholderCard() {
  return (
    <section className="feature-card">
      <div className="feature-card__header">
        <div>
          <h2>Auth Placeholder</h2>
          <p className="feature-card__copy">
            This slot is intentionally present now so account-linked Study Room
            state can be added later without reshaping the core pages.
          </p>
        </div>
        <span className="feature-card__badge">Future</span>
      </div>

      <div className="feature-card__pill-row">
        <span className="feature-card__pill">Session handoff</span>
        <span className="feature-card__pill">Protected presets</span>
        <span className="feature-card__pill">Backend token storage</span>
      </div>

      <p className="feature-card__meta">
        The backend service will eventually own login, session validation, and
        user-linked study data. Nothing here relies on Firebase-era browser auth.
      </p>
    </section>
  )
}
