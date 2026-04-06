import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProgressProvider } from './context/ProgressContext'
import Navbar from './components/Navbar'
import Landing from './pages/Landing'
import Modules from './pages/Modules'
import ModulePage from './pages/ModulePage'
import Progress from './pages/Progress'

export default function App() {
  return (
    <ProgressProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/modules" element={<Modules />} />
              <Route path="/modules/:moduleId" element={<ModulePage />} />
              <Route path="/progress" element={<Progress />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ProgressProvider>
  )
}
