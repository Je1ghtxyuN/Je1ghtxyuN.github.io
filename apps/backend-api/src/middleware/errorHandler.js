export function errorHandler() {
  return async (c, next) => {
    try {
      await next()
    } catch (err) {
      console.error('[backend-api] unhandled error:', err)

      const status = err.status ?? 500
      const message = status === 500 ? 'Internal server error' : err.message

      return c.json({ error: message }, status)
    }
  }
}
