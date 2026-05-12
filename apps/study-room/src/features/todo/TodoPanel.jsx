import { useStudyRoomLocale } from '../../i18n/useStudyRoomLocale.js'
import { useTodoList } from './useTodoList.js'

export function TodoPanel() {
  const { t } = useStudyRoomLocale()
  const { draft, items, loading, userId, setDraft, addTodo, toggleTodo, deleteTodo } = useTodoList()

  const handleSubmit = (event) => {
    event.preventDefault()
    addTodo(draft)
  }

  return (
    <section className="floating-widget todo-widget">
      <div className="floating-widget__header">
        <div>
          <p className="floating-widget__eyebrow">
            {t('studyRoom.todo.eyebrow', {}, 'Task Capture')}
          </p>
          <h2 className="floating-widget__title">
            {t('studyRoom.todo.title', {}, 'Current todos')}
          </h2>
        </div>
        <span className="floating-widget__badge">{items.length}</span>
      </div>

      <p className="floating-widget__copy">
        {t(
          'studyRoom.todo.intro',
          {},
          'Compact local task list for the current study session.',
        )}
      </p>

      <form className="widget-inline-form" onSubmit={handleSubmit}>
        <input
          className="input"
          type="text"
          placeholder={t(
            'studyRoom.todo.inputPlaceholder',
            {},
            'Add a small study task',
          )}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <button type="submit" className="button button--ghost">
          {t('common.add', {}, 'Add')}
        </button>
      </form>

      {!userId ? (
        <p className="floating-widget__meta">Login to sync tasks across sessions.</p>
      ) : loading ? (
        <p className="floating-widget__meta">Loading...</p>
      ) : items.length ? (
        <ul className="todo-widget__list">
          {items.map((item) => (
            <li key={item.id} className={`todo-widget__list-item${item.done ? ' todo-widget__list-item--done' : ''}`}>
              <p className="floating-widget__copy">{item.label}</p>
              <div className="todo-widget__actions">
                <button type="button" className="button button--ghost button--sm" onClick={() => toggleTodo(item.id)}>
                  {item.done ? 'Undo' : 'Done'}
                </button>
                {item.done ? (
                  <button type="button" className="button button--ghost button--sm" onClick={() => deleteTodo(item.id)}>✕</button>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="floating-widget__empty">No tasks yet.</div>
      )}
    </section>
  )
}
