import { AppRouter } from './app/AppRouter.jsx'
import { StudyRoomProvider } from './state/StudyRoomProvider.jsx'
import './App.css'

function App() {
  return (
    <StudyRoomProvider>
      <AppRouter />
    </StudyRoomProvider>
  )
}

export default App
