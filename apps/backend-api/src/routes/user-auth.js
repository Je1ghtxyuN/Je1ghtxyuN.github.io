import { Hono } from 'hono'
import { setCookie, deleteCookie } from 'hono/cookie'
import bcrypt from 'bcryptjs'
import { prisma } from '../db/client.js'
import { env } from '../config/env.js'
import { SESSION_DURATION_MS } from '../middleware/auth.js'

const userAuth = new Hono()

// POST /user/register — create account with email + password
userAuth.post('/register', async (c) => {
  let body
  try { body = await c.req.json() } catch { return c.json({ error: 'Invalid JSON' }, 400) }
  const { email, password, nickname } = body ?? {}
  if (!email || !password) return c.json({ error: 'Email and password required' }, 400)
  if (password.length < 6) return c.json({ error: 'Password must be at least 6 characters' }, 400)

  const existing = await prisma.studyUser.findUnique({ where: { email } })
  if (existing) return c.json({ error: 'Email already registered' }, 409)

  const hash = await bcrypt.hash(password, 12)
  const user = await prisma.studyUser.create({
    data: { email, password: hash, nickname: nickname || email.split('@')[0] },
  })

  return c.json({ user: { id: user.id, email: user.email, nickname: user.nickname } }, 201)
})

// POST /user/login — login with email + password
userAuth.post('/login', async (c) => {
  let body
  try { body = await c.req.json() } catch { return c.json({ error: 'Invalid JSON' }, 400) }
  const { email, password } = body ?? {}
  if (!email || !password) return c.json({ error: 'Email and password required' }, 400)

  const user = await prisma.studyUser.findUnique({ where: { email } })
  if (!user || !user.password) return c.json({ error: 'Invalid credentials' }, 401)

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return c.json({ error: 'Invalid credentials' }, 401)

  // Issue session cookie for Study Room
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS)
  const session = await prisma.session.create({
    data: { userId: user.id, expiresAt },
  })

  setCookie(c, 'study_session', session.id, {
    httpOnly: true,
    secure: env.COOKIE_DOMAIN !== 'localhost',
    sameSite: 'Lax',
    path: '/',
    maxAge: SESSION_DURATION_MS / 1000,
    domain: env.COOKIE_DOMAIN,
  })

  return c.json({ user: { id: user.id, email: user.email, nickname: user.nickname, avatarUrl: user.avatarUrl } })
})

// GET /user/me — current user info
userAuth.get('/me', async (c) => {
  const sessionId = c.req.header('Cookie')?.match(/study_session=([^;]+)/)?.[1]
  if (!sessionId) return c.json({ user: null })

  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  })

  if (!session || session.expiresAt < new Date()) {
    return c.json({ user: null })
  }

  const u = session.user
  return c.json({ user: { id: u.id, email: u.email, nickname: u.nickname, avatarUrl: u.avatarUrl } })
})

// POST /user/logout
userAuth.post('/logout', async (c) => {
  const sessionId = c.req.header('Cookie')?.match(/study_session=([^;]+)/)?.[1]
  if (sessionId) {
    await prisma.session.delete({ where: { id: sessionId } }).catch(() => {})
  }
  deleteCookie(c, 'study_session', { path: '/', domain: env.COOKIE_DOMAIN })
  return c.json({ ok: true })
})

// GET /user/github — GitHub OAuth login URL
userAuth.get('/github', (c) => {
  const clientId = env.GITHUB_CLIENT_ID
  if (!clientId) return c.json({ error: 'GitHub OAuth not configured' }, 501)
  const redirectUri = `${c.req.url.replace(/\/user\/github.*/, '')}/user/github/callback`
  const url = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email`
  return c.json({ url })
})

// GET /user/github/callback — OAuth callback
userAuth.get('/github/callback', async (c) => {
  const code = c.req.query('code')
  if (!code) return c.json({ error: 'No code provided' }, 400)

  // Exchange code for access token
  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
    }),
  })
  const tokenData = await tokenRes.json()
  if (!tokenData.access_token) return c.json({ error: 'Failed to get access token' }, 400)

  // Get user info
  const userRes = await fetch('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${tokenData.access_token}`, 'User-Agent': 'je1ght-study-room' },
  })
  const githubUser = await userRes.json()

  // Get email if not public
  let email = githubUser.email
  if (!email) {
    const emailsRes = await fetch('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${tokenData.access_token}`, 'User-Agent': 'je1ght-study-room' },
    })
    const emails = await emailsRes.json()
    const primary = emails.find((e) => e.primary)
    email = primary?.email || emails[0]?.email
  }
  if (!email) return c.json({ error: 'Could not get GitHub email' }, 400)

  // Upsert user
  const user = await prisma.studyUser.upsert({
    where: { email },
    update: { githubId: String(githubUser.id), avatarUrl: githubUser.avatar_url, nickname: githubUser.login },
    create: { email, githubId: String(githubUser.id), avatarUrl: githubUser.avatar_url, nickname: githubUser.login },
  })

  // Issue session
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS)
  const session = await prisma.session.create({ data: { userId: user.id, expiresAt } })
  setCookie(c, 'study_session', session.id, {
    httpOnly: true, secure: env.COOKIE_DOMAIN !== 'localhost',
    sameSite: 'Lax', path: '/',
    maxAge: SESSION_DURATION_MS / 1000, domain: env.COOKIE_DOMAIN,
  })

  // Redirect to Study Room
  return c.redirect('/study-app/')
})

export { userAuth }
