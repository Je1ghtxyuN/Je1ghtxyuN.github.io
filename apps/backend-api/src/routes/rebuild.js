import { Hono } from 'hono'
import { requireAuth } from '../middleware/auth.js'
import { rebuildPortal } from '../services/rebuild.js'

const rebuild = new Hono()

rebuild.post('/', requireAuth(), async (c) => {
  const result = await rebuildPortal()

  if (result.ok) {
    return c.json({
      ok: true,
      message: `Portal rebuilt successfully. ${result.postsGenerated} posts generated.`,
      postsGenerated: result.postsGenerated,
    })
  }

  return c.json({
    ok: false,
    message: 'Portal rebuild failed',
    error: result.error,
    postsGenerated: result.postsGenerated,
  }, 500)
})

export { rebuild }
