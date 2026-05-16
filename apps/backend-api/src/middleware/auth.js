import { getCookie } from 'hono/cookie'
import { prisma } from '../db/client.js'

const SESSION_COOKIE = 'session_id'
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

export { SESSION_COOKIE, SESSION_DURATION_MS }

export function authMiddleware() {
  return async (c, next) => {
    const sessionId = getCookie(c, SESSION_COOKIE)

    if (!sessionId) {
      c.set('user', null)
      return next()
    }

    try {
      const session = await prisma.session.findUnique({
        where: { id: sessionId },
      })

      if (!session || session.expiresAt < new Date()) {
        if (session) {
          await prisma.session.delete({ where: { id: sessionId } }).catch(() => {})
        }
        c.set('user', null)
        return next()
      }

      const user = await prisma.adminUser.findUnique({ where: { id: session.userId } })
      if (!user) { c.set('user', null); return next() }
      const { password: _, ...safeUser } = user
      c.set('user', safeUser)
      c.set('sessionId', session.id)
    } catch (err) {
      console.error('[auth] session lookup failed:', err)
      c.set('user', null)
    }

    return next()
  }
}

export function requireAuth() {
  return async (c, next) => {
    const user = c.get('user')
    if (!user) {
      return c.json({ error: 'Authentication required' }, 401)
    }
    return next()
  }
}
