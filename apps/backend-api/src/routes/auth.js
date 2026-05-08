import { Hono } from 'hono'
import { setCookie, deleteCookie } from 'hono/cookie'
import bcrypt from 'bcryptjs'
import { prisma } from '../db/client.js'
import { env } from '../config/env.js'
import { SESSION_COOKIE, SESSION_DURATION_MS, requireAuth } from '../middleware/auth.js'

const auth = new Hono()

auth.post('/login', async (c) => {
  let body
  try {
    body = await c.req.json()
  } catch {
    return c.json({ error: 'Invalid JSON body' }, 400)
  }

  const { email, password } = body ?? {}

  if (!email || !password) {
    return c.json({ error: 'Email and password are required' }, 400)
  }

  let user
  try {
    user = await prisma.adminUser.findUnique({ where: { email } })
  } catch (err) {
    console.error('[auth] login DB error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }

  if (!user) {
    return c.json({ error: 'Invalid credentials' }, 401)
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    return c.json({ error: 'Invalid credentials' }, 401)
  }

  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS)
  let session
  try {
    session = await prisma.session.create({
      data: { userId: user.id, expiresAt },
    })
  } catch (err) {
    console.error('[auth] session creation error:', err)
    return c.json({ error: 'Internal server error' }, 500)
  }

  setCookie(c, SESSION_COOKIE, session.id, {
    httpOnly: true,
    secure: env.COOKIE_DOMAIN !== 'localhost',
    sameSite: 'Lax',
    path: '/',
    maxAge: SESSION_DURATION_MS / 1000,
    domain: env.COOKIE_DOMAIN,
  })

  const { password: _, ...safeUser } = user
  return c.json({ user: safeUser })
})

auth.post('/logout', async (c) => {
  const sessionId = c.get('sessionId')

  if (sessionId) {
    try {
      await prisma.session.delete({ where: { id: sessionId } })
    } catch {
      // session may already be deleted
    }
  }

  deleteCookie(c, SESSION_COOKIE, {
    httpOnly: true,
    secure: env.COOKIE_DOMAIN !== 'localhost',
    sameSite: 'Lax',
    path: '/',
    domain: env.COOKIE_DOMAIN,
  })

  return c.json({ ok: true })
})

auth.get('/session', requireAuth(), async (c) => {
  const user = c.get('user')
  return c.json({ user })
})

export { auth }
