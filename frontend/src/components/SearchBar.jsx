import { useState } from 'react'

export default function SearchBar({ onSearch, loading }) {
  const [lat, setLat] = useState('')
  const [lon, setLon] = useState('')
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    setError('')
    
    if (!lat || !lon) {
      setError('Enter both coordinates')
      return
    }

    const latNum = parseFloat(lat)
    const lonNum = parseFloat(lon)

    if (isNaN(latNum) || isNaN(lonNum)) {
      setError('Invalid coordinates')
      return
    }

    if (latNum < -90 || latNum > 90) {
      setError('Latitude must be -90 to 90')
      return
    }

    if (lonNum < -180 || lonNum > 180) {
      setError('Longitude must be -180 to 180')
      return
    }

    onSearch(latNum, lonNum, `${lat}, ${lon}`)
  }

  const clear = () => {
    setLat('')
    setLon('')
    setError('')
  }

  return (
    <>
      <form onSubmit={submit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mb-5">
        <span className="text-[10px] uppercase tracking-widest text-slate-400 shrink-0">Coordinates</span>
        <div className="flex items-stretch border border-slate-600 rounded-lg bg-slate-800 overflow-hidden flex-1 shadow-md w-full">
          <input
            type="number" step="any"
            placeholder="Lat  –1.2921"
            value={lat}
            onChange={e => {
              setLat(e.target.value)
              setError('')
            }}
            className="flex-1 px-3 py-2 text-xs sm:text-sm text-slate-100 bg-transparent placeholder-slate-500 focus:bg-slate-700 outline-none min-w-0"
          />
          <span className="border-x border-slate-600 px-2 flex items-center text-slate-500 text-xs">,</span>
          <input
            type="number" step="any"
            placeholder="Lon  36.8219"
            value={lon}
            onChange={e => {
              setLon(e.target.value)
              setError('')
            }}
            className="flex-1 px-3 py-2 text-xs sm:text-sm text-slate-100 bg-transparent placeholder-slate-500 focus:bg-slate-700 outline-none min-w-0"
          />
          <button
            type="submit"
            disabled={loading || !lat || !lon}
            className="px-4 sm:px-5 bg-blue-600 text-white text-xs font-semibold tracking-wide hover:bg-blue-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
          >
            {loading ? '…' : 'Go'}
          </button>
        </div>
        <div className="flex gap-2 sm:gap-0">
          {lat && lon && (
            <button
              type="button"
              onClick={clear}
              className="px-3 py-2 text-xs text-slate-400 hover:text-slate-300 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </form>
      {error && (
        <div className="px-4 py-2 bg-red-900 border border-red-700 rounded-lg text-xs text-red-200 mb-4">
          ⚠ {error}
        </div>
      )}
    </>
  )
}