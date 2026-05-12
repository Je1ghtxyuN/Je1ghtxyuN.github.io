import { useEffect, useReducer, useCallback, useState } from 'react'
import { fetchCurrentUser } from '../../state/studySessionRecorder.js'

const API_BASE = import.meta.env.DEV ? 'http://localhost:3001' : ''

const initialTodoState = { draft: '', items: [], loading: false }

function todoReducer(state, action) {
  switch (action.type) {
    case 'todo/set-draft':
      return { ...state, draft: action.value }
    case 'todo/set-items':
      return { ...state, items: action.items, loading: false }
    case 'todo/set-loading':
      return { ...state, loading: true }
    default:
      return state
  }
}

export function useTodoList() {
  const [state, dispatch] = useReducer(todoReducer, initialTodoState)
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    fetchCurrentUser().then((u) => setUserId(u?.id || null))
  }, [])

  // Load todos when user changes
  useEffect(() => {
    if (!userId) { dispatch({ type: 'todo/set-items', items: [] }); return }
    dispatch({ type: 'todo/set-loading' })
    fetch(`${API_BASE}/todos`, { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => dispatch({ type: 'todo/set-items', items: data.items || [] }))
      .catch(() => dispatch({ type: 'todo/set-items', items: [] }))
  }, [userId])

  const addTodo = useCallback(async (label) => {
    if (!label.trim()) return
    if (!userId) return
    try {
      const res = await fetch(`${API_BASE}/todos`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ label: label.trim() }),
      })
      if (res.ok) {
        const data = await res.json()
        dispatch({ type: 'todo/set-items', items: [...state.items, data.item] })
      }
    } catch {}
    dispatch({ type: 'todo/set-draft', value: '' })
  }, [userId, state.items])

  const toggleTodo = useCallback(async (id) => {
    if (!userId) return
    const prev = [...state.items]
    dispatch({ type: 'todo/set-items', items: state.items.map((i) => i.id === id ? { ...i, done: !i.done } : i) })
    try {
      await fetch(`${API_BASE}/todos/${id}`, { method: 'PUT', credentials: 'include' })
    } catch { dispatch({ type: 'todo/set-items', items: prev }) }
  }, [userId, state.items])

  const deleteTodo = useCallback(async (id) => {
    if (!userId) return
    const prev = [...state.items]
    dispatch({ type: 'todo/set-items', items: state.items.filter((i) => i.id !== id) })
    try {
      await fetch(`${API_BASE}/todos/${id}`, { method: 'DELETE', credentials: 'include' })
    } catch { dispatch({ type: 'todo/set-items', items: prev }) }
  }, [userId, state.items])

  return {
    draft: state.draft, items: state.items, loading: state.loading, userId,
    setDraft(value) { dispatch({ type: 'todo/set-draft', value }) },
    addTodo, toggleTodo, deleteTodo,
  }
}
