import { Hono } from 'hono'
import { prisma } from '../db/client.js'

const studySessions = new Hono()

function getUserId(c) {
  const cookie = c.req.header('Cookie') || ''
  const match = cookie.match(/study_session=([^;]+)/)
  return match ? match[1] : null
}

async function resolveUserId(c) {
  const sessionId = getUserId(c)
  if (!sessionId) return null
  const session = await prisma.session.findUnique({ where: { id: sessionId } })
  if (!session || session.expiresAt < new Date()) return null
  return session.userId
}

// POST /study-sessions — record a completed Pomodoro cycle
studySessions.post('/', async (c) => {
  let body
  try { body = await c.req.json() } catch { return c.json({ error: 'Invalid JSON body' }, 400) }
  const { workDuration } = body ?? {}
  if (!workDuration || typeof workDuration !== 'number' || workDuration < 1) {
    return c.json({ error: 'workDuration (minutes) is required' }, 400)
  }

  const userId = await resolveUserId(c)
  const session = await prisma.studySession.create({
    data: { workDuration, userId },
  })
  return c.json({ session }, 201)
})

// GET /study-sessions/stats — per-user stats (or global if not logged in)
studySessions.get('/stats', async (c) => {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekStart = new Date(todayStart)
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())

  const userId = await resolveUserId(c)
  const userFilter = userId ? { userId } : {}

  const [total, today, thisWeek, totalMinutes] = await Promise.all([
    prisma.studySession.count({ where: userFilter }),
    prisma.studySession.count({ where: { ...userFilter, completedAt: { gte: todayStart } } }),
    prisma.studySession.count({ where: { ...userFilter, completedAt: { gte: weekStart } } }),
    prisma.studySession.aggregate({ where: userFilter, _sum: { workDuration: true } }),
  ])

  return c.json({ total, today, thisWeek, totalMinutes: totalMinutes._sum.workDuration || 0 })
})

// GET /study-sessions — recent sessions
studySessions.get('/', async (c) => {
  const limit = Math.min(50, Math.max(1, Number(c.req.query('limit')) || 20))

  const sessions = await prisma.studySession.findMany({
    orderBy: { completedAt: 'desc' },
    take: limit,
  })

  return c.json({ sessions, total: sessions.length })
})

export { studySessions }
