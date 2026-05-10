import { Hono } from 'hono'
import {
  getPlaylistDetail,
  getSongUrl,
  login,
  loginPhone,
  sendCaptcha,
  verifyCaptcha,
  getUserPlaylists,
  getDefaultPlaylistId,
} from '../services/music.js'

const music = new Hono()

// Public: get playlist by ID (default playlist if no ID)
music.get('/playlist/:id?', async (c) => {
  const id = c.req.param('id') || getDefaultPlaylistId()

  try {
    const playlist = await getPlaylistDetail(id)
    return c.json({ playlist })
  } catch (err) {
    return c.json({ error: err.message }, 500)
  }
})

// Public: get playable URL for a song
music.get('/song/:id/url', async (c) => {
  const id = c.req.param('id')

  if (!id) {
    return c.json({ error: 'Song ID is required' }, 400)
  }

  try {
    const songUrl = await getSongUrl(id)
    if (!songUrl) {
      return c.json({ error: 'Song URL not available' }, 404)
    }
    return c.json(songUrl)
  } catch (err) {
    return c.json({ error: err.message }, 500)
  }
})

// NetEase account login — email
music.post('/login', async (c) => {
  let body
  try { body = await c.req.json() } catch { return c.json({ error: 'Invalid JSON body' }, 400) }
  const { email, password } = body
  if (!email || !password) return c.json({ error: 'Email and password are required' }, 400)
  try {
    const result = await login(email, password)
    return c.json(result)
  } catch (err) {
    return c.json({ error: err.message }, 500)
  }
})

// NetEase account login — phone
music.post('/login/phone', async (c) => {
  let body
  try { body = await c.req.json() } catch { return c.json({ error: 'Invalid JSON body' }, 400) }
  const { phone, password } = body
  if (!phone || !password) return c.json({ error: 'Phone and password are required' }, 400)
  try {
    const result = await loginPhone(phone, password)
    return c.json(result)
  } catch (err) {
    return c.json({ error: err.message }, 500)
  }
})

// Send SMS verification code
music.post('/captcha/send', async (c) => {
  let body
  try { body = await c.req.json() } catch { return c.json({ error: 'Invalid JSON body' }, 400) }
  const { phone } = body
  if (!phone) return c.json({ error: 'Phone number is required' }, 400)
  try {
    const result = await sendCaptcha(phone)
    return c.json(result)
  } catch (err) {
    return c.json({ error: err.message }, 500)
  }
})

// Verify SMS code and login
music.post('/captcha/verify', async (c) => {
  let body
  try { body = await c.req.json() } catch { return c.json({ error: 'Invalid JSON body' }, 400) }
  const { phone, code } = body
  if (!phone || !code) return c.json({ error: 'Phone and verification code are required' }, 400)
  try {
    const result = await verifyCaptcha(phone, code)
    return c.json(result)
  } catch (err) {
    return c.json({ error: err.message }, 500)
  }
})

// Get logged-in user's playlists
music.get('/user/playlists', async (c) => {
  try {
    const result = await getUserPlaylists()
    return c.json(result)
  } catch (err) {
    return c.json({ error: err.message }, 500)
  }
})

export { music }
