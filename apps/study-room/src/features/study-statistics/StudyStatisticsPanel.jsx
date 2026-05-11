import { useEffect, useState } from 'react'
import { useStudyRoomLocale } from '../../i18n/useStudyRoomLocale.js'
import { useStudyRoomState } from '../../state/useStudyRoom.js'
import { fetchStats, fetchCurrentUser, loginUser, registerUser, logoutUser, getGitHubOAuthUrl } from '../../state/studySessionRecorder.js'

export function StudyStatisticsPanel() {
  const { timer } = useStudyRoomState()
  const { t } = useStudyRoomLocale()
  const [stats, setStats] = useState({ total: 0, today: 0, thisWeek: 0, totalMinutes: 0 })
  const [user, setUser] = useState(null)
  const [loginMode, setLoginMode] = useState(null) // null, 'login', 'register'
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginNick, setLoginNick] = useState('')
  const [loginError, setLoginError] = useState('')

  useEffect(() => {
    fetchCurrentUser().then(setUser)
  }, [])

  useEffect(() => {
    fetchStats().then(setStats)
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

  const handleGitHubLogin = async () => {
    const url = await getGitHubOAuthUrl()
    if (url) window.location.href = url
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
          <span className="widget-metric__value">{timer.completedWorkCycles}</span>
          <span className="widget-metric__label">{t('studyRoom.statistics.sessionPomodoros', {}, 'This session')}</span>
        </div>
        <div className="widget-metric">
          <span className="widget-metric__value">{stats.today}</span>
          <span className="widget-metric__label">{t('studyRoom.statistics.todayPomodoros', {}, 'Today')}</span>
        </div>
        <div className="widget-metric">
          <span className="widget-metric__value">{stats.total}</span>
          <span className="widget-metric__label">{t('studyRoom.statistics.totalPomodoros', {}, 'All time')}</span>
        </div>
      </div>

      <p className="floating-widget__meta">{t('studyRoom.statistics.totalTime', {}, `Total focus time: ${totalTime}`)}</p>
    </section>
  )
}
