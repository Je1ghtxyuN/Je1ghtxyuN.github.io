const API_BASE = import.meta.env.DEV ? 'http://localhost:3001' : ''

export async function recordPomodoro(workDuration) {
  try {
    await fetch(`${API_BASE}/study-sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workDuration }),
    })
  } catch {
    // Silently fail — local tracking still works
  }
}

export async function fetchStats() {
  try {
    const res = await fetch(`${API_BASE}/study-sessions/stats`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch {
    return { total: 0, today: 0, thisWeek: 0, totalMinutes: 0 }
  }
}
