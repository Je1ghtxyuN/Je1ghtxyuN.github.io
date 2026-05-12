import { Hono } from 'hono'
import { prisma } from '../db/client.js'

function getSessionId(c) {
  const cookie = c.req.header('Cookie') || ''
  const match = cookie.match(/study_session=([^;]+)/)
  return match ? match[1] : null
}

async function resolveUserId(c) {
  const sid = getSessionId(c)
  if (!sid) return null
  const session = await prisma.session.findUnique({ where: { id: sid } })
  if (!session || session.expiresAt < new Date()) return null
  return session.userId
}

const todos = new Hono()

// GET /todos — list user's todos
todos.get('/', async (c) => {
  const userId = await resolveUserId(c)
  if (!userId) return c.json({ items: [] })

  const items = await prisma.todoItem.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
  })
  return c.json({ items })
})

// POST /todos — add a todo
todos.post('/', async (c) => {
  const userId = await resolveUserId(c)
  if (!userId) return c.json({ error: 'Login required' }, 401)

  let body
  try { body = await c.req.json() } catch { return c.json({ error: 'Invalid JSON' }, 400) }
  const { label } = body ?? {}
  if (!label || !label.trim()) return c.json({ error: 'Label required' }, 400)

  const item = await prisma.todoItem.create({
    data: { userId, label: label.trim() },
  })
  return c.json({ item }, 201)
})

// PUT /todos/:id — toggle done
todos.put('/:id', async (c) => {
  const userId = await resolveUserId(c)
  if (!userId) return c.json({ error: 'Login required' }, 401)

  const existing = await prisma.todoItem.findUnique({ where: { id: c.req.param('id') } })
  if (!existing || existing.userId !== userId) return c.json({ error: 'Not found' }, 404)

  const item = await prisma.todoItem.update({
    where: { id: existing.id },
    data: { done: !existing.done },
  })
  return c.json({ item })
})

// DELETE /todos/:id — remove a todo
todos.delete('/:id', async (c) => {
  const userId = await resolveUserId(c)
  if (!userId) return c.json({ error: 'Login required' }, 401)

  const existing = await prisma.todoItem.findUnique({ where: { id: c.req.param('id') } })
  if (!existing || existing.userId !== userId) return c.json({ error: 'Not found' }, 404)

  await prisma.todoItem.delete({ where: { id: existing.id } })
  return c.json({ ok: true })
})

export { todos }
