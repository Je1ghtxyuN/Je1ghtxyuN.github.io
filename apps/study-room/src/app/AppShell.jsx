import { NavLink, Outlet } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/', label: 'Study Room', end: true },
  { to: '/settings', label: 'Settings', end: false },
]

export function AppShell() {
  return (
    <div className="study-app">
      <div className="study-shell">
        <header className="study-shell__header">
          <div>
            <p className="study-shell__eyebrow">Independent Sub Application</p>
            <h1>Study Room Foundation</h1>
            <p>
              First implementation pass focused on timer architecture, modular
              features, and future backend-friendly state boundaries.
            </p>
          </div>

          <nav className="study-shell__nav" aria-label="Study Room Navigation">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `study-shell__nav-link${isActive ? ' study-shell__nav-link--active' : ''}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="study-shell__content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
