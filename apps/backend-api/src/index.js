import { serve } from '@hono/node-server'
import { env } from './config/env.js'
import { createApp } from './app.js'

const app = createApp()

serve({ fetch: app.fetch, port: env.PORT }, (info) => {
  console.log(`[backend-api] listening on http://localhost:${info.port}`)
})
