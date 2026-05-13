import { useEffect, useState } from 'react'
import { useStudyRoomLocale } from '../../i18n/useStudyRoomLocale.js'
import { useStudyRoomState } from '../../state/useStudyRoom.js'
import { fetchStats, fetchDailyStats, fetchCurrentUser, loginUser, registerUser, logoutUser } from '../../state/studySessionRecorder.js'

const GITHUB_CLIENT_ID = 'Ov23liu6udKTVF2eWygV'
const DEV = import.meta.env.DEV
const REDIRECT_URI = DEV ? 'http://localhost:5173/' : 'https://je1ght.top/study-app/'

export function StudyStatisticsPanel() {
  const { timer } = useStudyRoomState()
  const { t } = useStudyRoomLocale()
  const [stats, setStats] = useState({ total: 0, today: 0, thisWeek: 0, totalMinutes: 0 })
  const [daily, setDaily] = useState([])
  const [user, setUser] = useState(null)
  const [loginMode, setLoginMode] = useState(null)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginNick, setLoginNick] = useState('')
  const [loginError, setLoginError] = useState('')

  useEffect(() => {
    fetchCurrentUser().then(setUser)
  }, [])

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

  const githubOAuthUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=user:email`

  const hours = Math.floor(stats.totalMinutes / 60)
  const mins = stats.totalMinutes % 60
  const totalTime = stats.totalMinutes > 0
    ? (hours > 0 ? `${hours}h ${mins}m` : `${mins}m`)
    : '—'

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
          <span className="stats-user__info">
            {user.avatarUrl ? <img src={user.avatarUrl} alt="" className="stats-user__avatar" /> : <i className="fas fa-user-circle stats-user__icon" />}
            <strong>{user.nickname || user.email}</strong>
          </span>
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
          <a href={githubOAuthUrl} className="button button--ghost button--sm stats-gh-btn">
            <i className="fab fa-github" /> GitHub
          </a>
        </div>
      )}

      <div className="stats-metrics-row">
        <div className="stats-metric-card">
          <span className="stats-metric-card__value">{stats.today || '—'}</span>
          <span className="stats-metric-card__label">Pomodoros today</span>
        </div>
        <div className="stats-metric-card">
          <span className="stats-metric-card__value">{stats.total || '—'}</span>
          <span className="stats-metric-card__label">Total completed</span>
        </div>
        <div className="stats-metric-card">
          <span className="stats-metric-card__value">{totalTime}</span>
          <span className="stats-metric-card__label">Focus time</span>
        </div>
      </div>

      {daily.length > 0 && (
        <div className="stats-heatmap">
          <span className="stats-heatmap__label">Last 12 weeks</span>
          <div className="stats-heatmap__grid">
            {daily.map((d) => {
              const mins = d.minutes || 0
              const level = mins === 0 ? 0 : mins <= 15 ? 1 : mins <= 30 ? 2 : mins <= 60 ? 3 : 4
              return <span key={d.date} className={'stats-heatmap__cell stats-heatmap__cell--lvl' + level} title={d.date + ': ' + mins + ' min'} />
            })}
          </div>
          <div className="stats-heatmap__legend">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map((lvl) => <span key={lvl} className={'stats-heatmap__cell stats-heatmap__cell--lvl' + lvl} />)}
            <span>More</span>
          </div>
        </div>
      )}
    </section>
  )
}
