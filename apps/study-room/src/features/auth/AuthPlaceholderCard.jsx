export function AuthPlaceholderCard() {
  return (
    <section className="floating-widget">
      <div className="floating-widget__header">
        <div>
          <p className="floating-widget__eyebrow">Auth Placeholder</p>
          <h2 className="floating-widget__title">Future account layer</h2>
          <p className="floating-widget__copy">
            This slot is intentionally present now so account-linked Study Room
            state can be added later without reshaping the core pages.
          </p>
        </div>
        <span className="floating-widget__badge">Future</span>
      </div>

      <div className="widget-pills">
        <span className="widget-pill">Session handoff</span>
        <span className="widget-pill">Protected presets</span>
        <span className="widget-pill">Backend token storage</span>
      </div>

      <p className="floating-widget__meta">
        The backend service will eventually own login, session validation, and
        user-linked study data. Nothing here relies on Firebase-era browser auth.
      </p>
    </section>
  )
}
