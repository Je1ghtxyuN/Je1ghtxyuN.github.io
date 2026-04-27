import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './AppShell.jsx'
import { SettingsPage } from './pages/SettingsPage.jsx'
import { StudyPage } from './pages/StudyPage.jsx'

export function AppRouter() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<StudyPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
