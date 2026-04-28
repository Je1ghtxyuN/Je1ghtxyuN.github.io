const PANEL_GROUPS = [
  [
    { id: 'todo', label: 'To', title: 'Todo Panel' },
    { id: 'music', label: 'Mu', title: 'Music Panel' },
  ],
  [
    { id: 'statistics', label: 'St', title: 'Statistics Panel' },
    { id: 'settings', label: 'Se', title: 'Settings Panel' },
  ],
]

export function StudyChromeWidget({
  mode = 'idle',
  activePanel,
  onOpenPanel,
}) {
  return (
    <section className={`scene-chrome scene-chrome--${mode}`}>
      <div
        className="scene-chrome__group scene-chrome__group--left"
        role="group"
        aria-label="Study Room Panels"
      >
        {PANEL_GROUPS[0].map((item) => (
          <button
            key={item.id}
            type="button"
            className={`scene-chrome__button${activePanel === item.id ? ' scene-chrome__button--active' : ''}`}
            onClick={() => onOpenPanel(item.id)}
            aria-label={item.title}
            title={item.title}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="scene-chrome__brand" aria-hidden="true">
        <span className="scene-chrome__brand-mark" />
        <span className="scene-chrome__brand-text">Focus Room</span>
      </div>

      <div className="scene-chrome__group scene-chrome__group--right" role="group">
        {PANEL_GROUPS[1].map((item) => (
          <button
            key={item.id}
            type="button"
            className={`scene-chrome__button${activePanel === item.id ? ' scene-chrome__button--active' : ''}`}
            onClick={() => onOpenPanel(item.id)}
            aria-label={item.title}
            title={item.title}
          >
            {item.label}
          </button>
        ))}
      </div>
    </section>
  )
}
