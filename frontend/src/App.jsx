import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import WeatherPage from './pages/WeatherPage.jsx'
import TreesPage from './pages/TreesPage.jsx'

export default function App() {
  const [page, setPage] = useState('weather')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar current={page} onNav={setPage} open={sidebarOpen} onToggle={() => setSidebarOpen(false)} />

      {/* Mobile header with hamburger */}
      <div className="fixed top-0 left-0 right-0 z-30 lg:hidden flex items-center gap-3 px-4 py-3 bg-slate-950/90 backdrop-blur-md border-b border-slate-800">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 -ml-1 text-slate-300 hover:text-white transition-colors"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-700 rounded-md flex items-center justify-center text-white font-serif italic text-sm shrink-0 shadow">
            A
          </div>
          <span className="font-sans font-bold text-sm text-slate-100">AgroSky</span>
        </div>
      </div>

      <main className="flex-1 min-h-screen pt-14 lg:pt-0 lg:ml-56">
        {page === 'weather' && <WeatherPage />}
        {page === 'trees'   && <TreesPage />}
      </main>
    </div>
  )
}
