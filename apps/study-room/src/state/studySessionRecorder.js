const API_BASE = import.meta.env.DEV ? 'http://localhost:3001' : ''

export async function recordPomodoro(workDuration) {
  try {
    await fetch(`${API_BASE}/study-sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ workDuration }),
    })
  } catch {
    // Silently fail — local tracking still works
  }
}

export async function fetchDailyStats(days = 84) {
  try {
    const res = await fetch(`${API_BASE}/study-sessions/daily?days=${days}`, { credentials: 'include' })
    if (!res.ok) return { daily: [] }
    return await res.json()
  } catch {
    return { daily: [] }
  }
}

export async function fetchStats() {
  try {
    const res = await fetch(`${API_BASE}/study-sessions/stats`, { credentials: 'include' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return await res.json()
  } catch {
    return { total: 0, today: 0, thisWeek: 0, totalMinutes: 0 }
  }
}

export async function fetchCurrentUser() {
  try {
    const res = await fetch(`${API_BASE}/user/me`, { credentials: 'include' })
    if (!res.ok) return null
    const data = await res.json()
    return data.user || null
  } catch {
    return null
  }
}

export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE}/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error || 'Login failed')
  }
  return res.json()
}

export async function registerUser(email, password, nickname) {
  const res = await fetch(`${API_BASE}/user/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password, nickname }),
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error || 'Registration failed')
  }
  return res.json()
}

export async function logoutUser() {
  await fetch(`${API_BASE}/user/logout`, {
    method: 'POST',
    credentials: 'include',
  })
}

export async function loadUserPrefs() {
  try {
    const res = await fetch(`${API_BASE}/user/prefs`, { credentials: 'include' })
    if (!res.ok) return null
    const data = await res.json()
    return data.prefs || null
  } catch { return null }
}

export async function saveUserPrefs(preferences) {
  try {
    await fetch(`${API_BASE}/user/prefs`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ preferences }),
    })
  } catch {}
}

export async function getGitHubOAuthUrl() {
  const res = await fetch(`${API_BASE}/user/github`)
  if (!res.ok) return null
  const data = await res.json()
  return data.url || null
}

export async function githubCallback(accessToken, githubUser) {
  const res = await fetch(`${API_BASE}/user/github/callback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ accessToken, githubUser }),
  })
  if (!res.ok) {
    const data = await res.json()
    throw new Error(data.error || 'GitHub login failed')
  }
  return res.json()
}
