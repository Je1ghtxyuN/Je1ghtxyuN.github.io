import { useTodoList } from './useTodoList.js'

export function TodoPanel() {
  const { draft, items, setDraft, addTodo, toggleTodo } = useTodoList()

  const handleSubmit = (event) => {
    event.preventDefault()
    addTodo(draft)
  }

  return (
    <section className="floating-widget todo-widget">
      <div className="floating-widget__header">
        <div>
          <p className="floating-widget__eyebrow">Task Capture</p>
          <h2 className="floating-widget__title">Current todos</h2>
        </div>
        <span className="floating-widget__badge">{items.length}</span>
      </div>

      <p className="floating-widget__copy">
        Compact local task list for the current study session.
      </p>

      <form className="widget-inline-form" onSubmit={handleSubmit}>
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
        <ul className="todo-widget__list">
          {items.map((item) => (
            <li
              key={item.id}
              className={`todo-widget__list-item${item.done ? ' todo-widget__list-item--done' : ''}`}
            >
              <p className="floating-widget__copy">{item.label}</p>
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
        <div className="floating-widget__empty">No tasks yet.</div>
      )}
    </section>
  )
}
