import { useEffect, useState } from 'react'

export function GitHubCallback() {
  const [status, setStatus] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    if (!code) return

    window.history.replaceState({}, '', window.location.pathname)
    setStatus('exchanging')

    fetch('/user/github/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ code }),
    })
      .then(async (r) => {
        const data = await r.json()
        if (!r.ok) throw new Error(data.error || 'Failed')
        return data
      })
      .then((data) => {
        if (data.user) { window.location.reload() }
        else { setStatus('Login failed. Please try again.') }
      })
      .catch((e) => {
        setStatus(e.message || 'Cannot complete GitHub login. Try email login instead.')
      })
  }, [])

  if (!status) return null

  const isExchanging = status === 'exchanging'
  return (
    <div style={{
      position: 'fixed', bottom: '1rem', left: '50%', transform: 'translateX(-50%)',
      padding: '0.6rem 1.2rem', borderRadius: '8px', background: 'rgba(0,0,0,0.85)',
      color: isExchanging ? '#58a6ff' : '#f85149', fontSize: '0.82rem',
      zIndex: 9999, maxWidth: '90vw', textAlign: 'center',
    }}>
      {isExchanging ? 'Logging in with GitHub...' : status}
    </div>
  )
}
