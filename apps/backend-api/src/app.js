import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { errorHandler } from './middleware/errorHandler.js'
import { health } from './routes/health.js'

export function createApp() {
  const app = new Hono()

  app.use('*', logger())
  app.use('*', cors())
  app.use('*', errorHandler())

  app.route('/', health)

  app.notFound((c) => c.json({ error: 'Not found' }, 404))

  return app
}
