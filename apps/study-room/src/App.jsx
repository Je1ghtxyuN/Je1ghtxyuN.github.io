import { AppRouter } from './app/AppRouter.jsx'
import { StudyRoomLocaleProvider } from './i18n/StudyRoomLocaleProvider.jsx'
import { StudyRoomProvider } from './state/StudyRoomProvider.jsx'
import './App.css'

function App() {
  return (
    <StudyRoomProvider>
      <StudyRoomLocaleProvider>
        <AppRouter />
      </StudyRoomLocaleProvider>
    </StudyRoomProvider>
  )
}

export default App
