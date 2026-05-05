import { Hono } from 'hono'

const health = new Hono()

health.get('/health', (c) => {
  return c.json({ ok: true, service: 'backend-api' })
})

export { health }
