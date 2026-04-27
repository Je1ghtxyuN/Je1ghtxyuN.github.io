import { useTodoList } from './useTodoList.js'

export function TodoPanel() {
  const { draft, items, setDraft, addTodo, toggleTodo } = useTodoList()

  const handleSubmit = (event) => {
    event.preventDefault()
    addTodo(draft)
  }

  return (
    <section className="feature-card">
      <div className="feature-card__header">
        <div>
          <h2>Task Capture</h2>
          <p className="feature-card__copy">
            Local-only for now, but already separated into its own feature
            module so persistence can be added later without touching timer code.
          </p>
        </div>
        <span className="feature-card__badge">{items.length} tasks</span>
      </div>

      <form className="feature-card__inline-form" onSubmit={handleSubmit}>
        <input
          className="input"
          type="text"
          placeholder="Add a small study task"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <button type="submit" className="button button--ghost">
          Add
        </button>
      </form>

      {items.length ? (
        <ul className="feature-card__list">
          {items.map((item) => (
            <li
              key={item.id}
              className={`feature-card__list-item${item.done ? ' feature-card__list-item--done' : ''}`}
            >
              <p className="feature-card__copy">{item.label}</p>
              <button
                type="button"
                className="button button--ghost"
                onClick={() => toggleTodo(item.id)}
              >
                {item.done ? 'Undo' : 'Done'}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="feature-card__empty">No tasks yet.</div>
      )}
    </section>
  )
}
