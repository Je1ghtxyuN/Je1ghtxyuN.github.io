import { Hono } from 'hono'
import { requireAuth } from '../middleware/auth.js'

const protectedRoutes = new Hono()

protectedRoutes.use('*', requireAuth())

protectedRoutes.get('/ping', (c) => {
  const user = c.get('user')
  return c.json({
    ok: true,
    message: 'You are authenticated',
    user,
  })
})

export { protectedRoutes }
