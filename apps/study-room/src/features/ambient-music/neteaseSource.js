// In dev (localhost), API is at localhost:3001. In production, same-domain proxy.
const API_BASE = import.meta.env.DEV ? 'http://localhost:3001' : ''

let cachedPlaylist = null
let cachedTracks = null

export async function fetchDefaultPlaylist() {
  if (cachedPlaylist) return cachedPlaylist

  const res = await fetch(`${API_BASE}/music/playlist`)
  if (!res.ok) throw new Error(`Failed to fetch playlist: ${res.status}`)

  const data = await res.json()
  cachedPlaylist = data.playlist
  cachedTracks = data.playlist.tracks.map((t) => ({
    id: String(t.id),
    title: t.name,
    artists: t.artists.map((a) => a.name).join(', '),
    album: t.album,
    duration: t.duration,
    // src is fetched on demand via fetchSongUrl
    src: '',
  }))

  return {
    playlist: cachedPlaylist,
    tracks: cachedTracks,
  }
}

export async function fetchSongUrl(trackId) {
  const res = await fetch(`${API_BASE}/music/song/${trackId}/url`)
  if (!res.ok) throw new Error(`Failed to fetch song URL: ${res.status}`)

  const data = await res.json()
  return data.url || null
}

export async function loginNetEase(email, password) {
  const res = await fetch(`${API_BASE}/music/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error(`Login failed: ${res.status}`)
  return res.json()
}

export async function loginNetEasePhone(phone, password) {
  const res = await fetch(`${API_BASE}/music/login/phone`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, password }),
  })
  if (!res.ok) throw new Error(`Login failed: ${res.status}`)
  return res.json()
}

export async function sendSmsCode(phone) {
  const res = await fetch(`${API_BASE}/music/captcha/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  })
  if (!res.ok) throw new Error(`Failed to send SMS: ${res.status}`)
  return res.json()
}

export async function verifySmsCode(phone, code) {
  const res = await fetch(`${API_BASE}/music/captcha/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, code }),
  })
  if (!res.ok) throw new Error(`Verification failed: ${res.status}`)
  return res.json()
}

export async function fetchUserPlaylists() {
  const res = await fetch(`${API_BASE}/music/user/playlists`)
  if (!res.ok) return { playlists: [] }
  return res.json()
}
