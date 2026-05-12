import { useEffect, useState } from 'react'
import { useStudyRoomLocale } from '../../i18n/useStudyRoomLocale.js'
import { useStudyRoomState } from '../../state/useStudyRoom.js'
import { fetchStats, fetchDailyStats, fetchCurrentUser, loginUser, registerUser, logoutUser, githubCallback } from '../../state/studySessionRecorder.js'

const GITHUB_CLIENT_ID = 'Ov23liu6udKTVF2eWygV'
const DEV = import.meta.env.DEV
const REDIRECT_URI = DEV ? 'http://localhost:5173/' : 'https://je1ght.top/study-app/'

export function StudyStatisticsPanel() {
  const { timer } = useStudyRoomState()
  const { t } = useStudyRoomLocale()
  const [stats, setStats] = useState({ total: 0, today: 0, thisWeek: 0, totalMinutes: 0 })
  const [daily, setDaily] = useState([])
  const [user, setUser] = useState(null)
  const [loginMode, setLoginMode] = useState(null) // null, 'login', 'register'
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginNick, setLoginNick] = useState('')
  const [loginError, setLoginError] = useState('')

  useEffect(() => {
    fetchCurrentUser().then(setUser)
    // Handle GitHub OAuth callback
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    if (code) {
      window.history.replaceState({}, '', window.location.pathname)
      exchangeGitHubCode(code)
    }
  }, [])

  const exchangeGitHubCode = async (code) => {
    setLoginError('')
    try {
      // Exchange code for access token (in browser, bypassing server's China network issue)
      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ client_id: GITHUB_CLIENT_ID, client_secret: '2145d903e6570d36c74337a2dbea575cb00f2171', code }),
      })
      const tokenData = await tokenRes.json()
      if (!tokenData.access_token) { setLoginError('GitHub auth failed'); return }

      // Get GitHub user info
      const userRes = await fetch('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      })
      const githubUser = await userRes.json()

      // Send to our backend to create account
      const result = await githubCallback(tokenData.access_token, githubUser)
      setUser(result.user)
    } catch (err) { setLoginError(err.message) }
  }

  useEffect(() => {
    fetchStats().then(setStats)
    fetchDailyStats().then((d) => setDaily(d.daily || []))
  }, [timer.completedWorkCycles])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginError('')
    try {
      const result = await loginUser(loginEmail, loginPassword)
      setUser(result.user)
      setLoginMode(null)
    } catch (err) { setLoginError(err.message) }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoginError('')
    try {
      await registerUser(loginEmail, loginPassword, loginNick)
      const result = await loginUser(loginEmail, loginPassword)
      setUser(result.user)
      setLoginMode(null)
    } catch (err) { setLoginError(err.message) }
  }

  const handleLogout = async () => {
    await logoutUser()
    setUser(null)
  }

  const handleGitHubLogin = () => {
    const url = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=user:email`
    window.location.href = url
  }

  const hours = Math.floor(stats.totalMinutes / 60)
  const mins = stats.totalMinutes % 60
  const totalTime = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`

  return (
    <section className="floating-widget">
      <div className="floating-widget__header">
        <div>
          <p className="floating-widget__eyebrow">{t('studyRoom.statistics.eyebrow', {}, 'Statistics')}</p>
          <h2 className="floating-widget__title">{t('studyRoom.statistics.title', {}, 'Study Stats')}</h2>
        </div>
        <span className="floating-widget__badge">{user ? user.nickname || user.email : 'Guest'}</span>
      </div>

      {/* Login / User section */}
      {user ? (
        <div className="stats-user">
          <p className="floating-widget__meta">Logged in as <strong>{user.nickname || user.email}</strong></p>
          <button type="button" className="button button--ghost button--sm" onClick={handleLogout}>Logout</button>
        </div>
      ) : loginMode ? (
        <form className="stats-login-form" onSubmit={loginMode === 'login' ? handleLogin : handleRegister}>
          <input className="stats-login-input" type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
          {loginMode === 'register' && (
            <input className="stats-login-input" type="text" placeholder="Nickname (optional)" value={loginNick} onChange={(e) => setLoginNick(e.target.value)} />
          )}
          <input className="stats-login-input" type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required minLength={6} />
          {loginError && <p className="floating-widget__hint">{loginError}</p>}
          <div className="stats-login-actions">
            <button type="submit" className="button button--primary button--sm">{loginMode === 'login' ? 'Login' : 'Register'}</button>
            <button type="button" className="button button--ghost button--sm" onClick={() => setLoginMode(null)}>Cancel</button>
          </div>
        </form>
      ) : (
        <div className="stats-login-actions">
          <button type="button" className="button button--primary button--sm" onClick={() => setLoginMode('login')}>Login</button>
          <button type="button" className="button button--ghost button--sm" onClick={() => setLoginMode('register')}>Register</button>
          <button type="button" className="button button--ghost button--sm stats-gh-btn" onClick={handleGitHubLogin}>
            <i className="fab fa-github" /> GitHub
          </button>
        </div>
      )}

      <div className="widget-metrics">
        <div className="widget-metric">
          <span className="widget-metric__value">{stats.today}</span>
          <span className="widget-metric__label">Today</span>
        </div>
        <div className="widget-metric">
          <span className="widget-metric__value">{stats.total}</span>
          <span className="widget-metric__label">Total</span>
        </div>
        <div className="widget-metric">
          <span className="widget-metric__value">{totalTime}</span>
          <span className="widget-metric__label">Focus time</span>
        </div>
      </div>

      {/* Contribution heatmap */}
      {daily.length > 0 && (
        <div className="stats-heatmap">
          <div className="stats-heatmap__header">
            <span className="stats-heatmap__label">Study Activity</span>
            <span className="stats-heatmap__legend">
              <span className="stats-heatmap__legend-label">Less</span>
              {[0, 15, 30, 60, 120].map((v) => (
                <span key={v} className="stats-heatmap__cell stats-heatmap__cell--lvl{Math.min(4, v === 0 ? 0 : Math.ceil(v / 30))}" />
              ))}
              <span className="stats-heatmap__legend-label">More</span>
            </span>
          </div>
          <div className="stats-heatmap__grid">
            {daily.map((d) => {
              const mins = d.minutes || 0
              const level = mins === 0 ? 0 : mins <= 15 ? 1 : mins <= 30 ? 2 : mins <= 60 ? 3 : 4
              return (
                <span
                  key={d.date}
                  className={`stats-heatmap__cell stats-heatmap__cell--lvl${level}`}
                  title={`${d.date}: ${mins} min`}
                />
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}
