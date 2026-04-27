const PANEL_BUTTONS = [
  { id: 'todo', label: 'TD', title: 'Todo Panel' },
  { id: 'music', label: 'MU', title: 'Music Panel' },
  { id: 'statistics', label: 'ST', title: 'Statistics Panel' },
  { id: 'settings', label: 'SE', title: 'Settings Panel' },
]

export function StudyChromeWidget({
  mode = 'idle',
  activePanel,
  onOpenPanel,
}) {
  return (
    <section className={`scene-chrome scene-chrome--${mode}`}>
      <div className="scene-chrome__group" aria-label="Study Room Panels">
        {PANEL_BUTTONS.map((item) => (
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
        <span className="scene-chrome__brand-text">Study Room</span>
      </div>
    </section>
  )
}
