import { useReducer } from 'react'

const initialTodoState = {
  draft: '',
  items: [
    { id: 'setup-clock', label: 'Review timer session plan', done: false },
    { id: 'pick-track', label: 'Choose an ambient track', done: false },
  ],
}

function todoReducer(state, action) {
  switch (action.type) {
    case 'todo/set-draft':
      return {
        ...state,
        draft: action.value,
      }

    case 'todo/add': {
      const label = action.label.trim()

      if (!label) return state

      return {
        draft: '',
        items: [
          ...state.items,
          {
            id: `todo-${Date.now()}`,
            label,
            done: false,
          },
        ],
      }
    }

    case 'todo/toggle':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.id ? { ...item, done: !item.done } : item,
        ),
      }

    default:
      return state
  }
}

export function useTodoList() {
  const [state, dispatch] = useReducer(todoReducer, initialTodoState)

  return {
    draft: state.draft,
    items: state.items,
    setDraft(value) {
      dispatch({ type: 'todo/set-draft', value })
    },
    addTodo(label) {
      dispatch({ type: 'todo/add', label })
    },
    toggleTodo(id) {
      dispatch({ type: 'todo/toggle', id })
    },
  }
}
