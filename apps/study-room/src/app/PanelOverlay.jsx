import { useEffect } from 'react'

export function PanelOverlay({ title, description, onClose, children }) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <div className="panel-overlay" role="presentation">
      <button
        type="button"
        className="panel-overlay__backdrop"
        aria-label="Close panel"
        onClick={onClose}
      />

      <section
        className="panel-overlay__surface"
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header className="panel-overlay__header">
          <div>
            <p className="panel-overlay__eyebrow">Panel Mode</p>
            <h2 className="panel-overlay__title">{title}</h2>
            {description ? (
              <p className="panel-overlay__copy">{description}</p>
            ) : null}
          </div>

          <button
            type="button"
            className="button button--ghost panel-overlay__close"
            onClick={onClose}
          >
            Close
          </button>
        </header>

        <div className="panel-overlay__content">{children}</div>
      </section>
    </div>
  )
}
