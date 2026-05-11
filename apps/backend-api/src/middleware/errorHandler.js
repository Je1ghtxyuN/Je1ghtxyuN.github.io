export function errorHandler() {
  return async (c, next) => {
    try {
      await next()
    } catch (err) {
      console.error('[backend-api] unhandled error:', err.message || err)
      if (err.meta) console.error('[backend-api] error meta:', JSON.stringify(err.meta))
      if (err.code) console.error('[backend-api] error code:', err.code)

      const status = err.status ?? 500
      const message = status === 500 ? 'Internal server error' : err.message

      return c.json({ error: message }, status)
    }
  }
}
