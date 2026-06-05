import { useState, useCallback } from 'react'
import { fetchWeather } from '../api/client.js'
import WeatherCard from '../components/WeatherCard.jsx'
import ForecastGrid from '../components/ForecastGrid.jsx'
import AiSummary from '../components/AiSummary.jsx'
import SearchBar from '../components/SearchBar.jsx'
import Toast from '../components/Toast.jsx'

const PRESETS = [
  { name: 'Nairobi',  lat: -1.2921, lon: 36.8219 },
  { name: 'Bomet',    lat: -0.7834, lon: 35.3433 },
  { name: 'Kisumu',   lat: -0.1022, lon: 34.7617 },
  { name: 'Mombasa',  lat: -4.0435, lon: 39.6682 },
  { name: 'Nakuru',   lat: -0.3031, lon: 36.0800 },
]

export default function WeatherPage() {
  const [data, setData]         = useState(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)
  const [location, setLocation] = useState(null)
  const [toast, setToast]       = useState(null)

  const load = useCallback(async (lat, lon, name) => {
    setLoading(true); setError(null); setToast(null)
    try {
      const res = await fetchWeather(lat, lon, 7)
      setData(res.data)
      setLocation({ lat, lon, name })
      setToast(`✓ Loaded weather for ${name}`)
    } catch (e) {
      setError(e.response?.data?.error || e.message || 'Failed to fetch weather')
    } finally {
      setLoading(false)
    }
  }, [])

  const current   = data?.current
  const nowHourly = data?.hourly?.[0]  // First hourly entry for additional metrics
  const daily     = data?.daily || []
  const aiSummary = data?.ai_summary || data?.summary

  return (
    <div className="px-4 py-4 sm:px-6 sm:py-6 md:p-8 lg:p-10 max-w-5xl mx-auto">
      {/* Page title */}
      <div className="mb-6 sm:mb-8">
        <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-slate-100 tracking-tight">Weather</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">Real-time conditions with AI agronomic insights</p>
      </div>

      <SearchBar onSearch={load} loading={loading} />

      {/* Presets */}
      <div className="flex gap-2 flex-wrap mb-8">
        {PRESETS.map(p => (
          <button
            key={p.name}
            onClick={() => load(p.lat, p.lon, p.name)}
            className={`px-4 py-1.5 rounded-full border text-xs font-medium transition-all
              ${location?.name === p.name
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600 hover:text-slate-200'}`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 px-4 py-3 bg-red-900 border border-red-700 rounded-lg text-sm text-red-200">
          ⚠ {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center gap-3 py-20 justify-center text-slate-400 text-sm">
          <div className="w-5 h-5 border-2 border-slate-600 border-t-blue-400 rounded-full animate-spin" />
          Fetching weather data…
        </div>
      )}

      {/* Content */}
      {!loading && data && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
          <div className="flex flex-col gap-5">
            {current && (
              <WeatherCard
                current={current}
                nowHourly={nowHourly}
                location={location?.name || data?.location?.name}
                country={data?.location?.country}
                raw={data}
              />
            )}
            {aiSummary && <AiSummary summary={aiSummary} />}
          </div>
          <div>
            {daily.length > 0 && <ForecastGrid days={daily} />}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !data && !error && (
        <div className="flex flex-col items-center gap-3 py-28 text-slate-500 text-sm">
          <span className="text-5xl">◈</span>
          <p>Select a location above to get started</p>
        </div>
      )}

      <Toast message={toast} type="success" onClose={() => setToast(null)} />
    </div>
  )
}