import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { errorHandler } from './middleware/errorHandler.js'
import { authMiddleware } from './middleware/auth.js'
import { health } from './routes/health.js'
import { auth } from './routes/auth.js'
import { protectedRoutes } from './routes/protected.js'

export function createApp() {
  const app = new Hono()

  app.use('*', logger())
  app.use('*', cors({
    origin: ['http://localhost:4000', 'http://localhost:5173'],
    credentials: true,
  }))
  app.use('*', errorHandler())
  app.use('*', authMiddleware())

  app.route('/', health)
  app.route('/auth', auth)
  app.route('/protected', protectedRoutes)

  app.notFound((c) => c.json({ error: 'Not found' }, 404))

  return app
}
