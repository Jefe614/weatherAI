const WMO = {
  0:['Clear sky','☀'],1:['Mainly clear','🌤'],2:['Partly cloudy','⛅'],3:['Overcast','☁'],
  45:['Fog','🌫'],48:['Icy fog','🌫'],51:['Light drizzle','🌦'],53:['Drizzle','🌦'],
  55:['Heavy drizzle','🌧'],61:['Slight rain','🌧'],63:['Moderate rain','🌧'],65:['Heavy rain','🌧'],
  71:['Light snow','❄'],73:['Moderate snow','❄'],75:['Heavy snow','❄'],
  80:['Showers','🌦'],81:['Showers','🌧'],82:['Heavy showers','⛈'],
  95:['Thunderstorm','⛈'],96:['Thunderstorm','⛈'],99:['Thunderstorm','⛈'],
}

const fmt = (v, u = '') => v != null ? `${Math.round(v)}${u}` : '—'

const getCompassDir = (deg) => {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  const index = Math.round(deg / 22.5) % 16
  return dirs[index]
}

export default function WeatherCard({ current, nowHourly, location, country, raw }) {
  if (import.meta.env.DEV && current) {
    console.log('[weather] current =', current)
    console.log('[weather] nowHourly =', nowHourly)
  }

  const temp      = current?.temperature ?? current?.temp_c ?? current?.temperature_2m ?? 0
  const windSpeed = current?.wind_speed ?? current?.wind_kph ?? 0
  const windDir   = current?.wind_direction ?? 0
  const condCode  = String(current?.condition_code ?? current?.weathercode ?? 0)
  const iconUrl   = current?.icon || ''
  
  const [desc, emoji] = WMO[parseInt(condCode)] ?? ['Unknown', '🌡']
  const condText  = desc
  
  const feelsLike = nowHourly?.feels_like ?? current?.feelslike_c ?? current?.apparent_temperature ?? temp
  const humidity  = nowHourly?.humidity ?? current?.humidity ?? 0
  const windGust  = nowHourly?.wind_gust ?? current?.wind_gust ?? 0
  const uv        = nowHourly?.uv_index ?? current?.uv_index ?? 0

  const stats = [
    { label: 'Feels like', value: fmt(feelsLike, '°') },
    { label: 'Humidity',   value: fmt(humidity,  '%') },
    { label: 'Wind',       value: fmt(windSpeed, ' km/h') },
    { label: 'Wind gust',  value: fmt(windGust,  ' km/h') },
    { label: 'UV Index',   value: fmt(uv) },
    { label: 'Direction',  value: `${getCompassDir(windDir)} (${Math.round(windDir)}°)` },
  ]

  return (
    <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-900 shadow-lg">
      {/* Header bar */}
      <div className="bg-gradient-to-r from-slate-950 to-slate-900 text-white px-5 sm:px-7 py-5 sm:py-6 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-sans font-bold text-xl sm:text-2xl tracking-tight leading-none truncate">{location || '—'}</div>
          {country && <div className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-widest mt-1.5">{country}</div>}
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          {iconUrl && <img src={iconUrl} alt={condText} className="w-12 h-12 sm:w-16 sm:h-16 drop-shadow-lg" />}
          {!iconUrl && <span className="text-4xl sm:text-5xl leading-none">{emoji}</span>}
          <span className="text-[10px] sm:text-[11px] text-slate-300 italic font-serif text-right">{condText}</span>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 sm:px-7 py-5 sm:py-6 flex flex-col sm:flex-row gap-5 sm:gap-8 items-start">
        {/* Big temp */}
        <div className="flex items-start gap-1 shrink-0 self-center sm:self-start">
          <span className="font-sans font-black text-6xl sm:text-8xl leading-none tracking-tighter text-white">
            {Math.round(temp)}
          </span>
          <span className="font-sans text-lg sm:text-2xl font-light text-slate-400 mt-1 sm:mt-2">°C</span>
        </div>

        {/* Stats grid */}
        <div className="w-full sm:flex-1 grid grid-cols-2 sm:grid-cols-3 border border-slate-700 rounded-lg overflow-hidden">
          {stats.map((s, i) => (
            <div key={s.label} className={`px-3 sm:px-4 py-2.5 sm:py-3 bg-slate-800 ${i < 3 ? 'border-b border-slate-700' : ''} ${i % 2 !== 1 && i % 3 !== 2 ? 'sm:border-r border-slate-700' : ''} ${i % 2 === 0 ? 'border-r border-slate-700 sm:border-r-0' : ''}`}>
              <div className="text-[8px] sm:text-[9px] uppercase tracking-widest text-slate-400 mb-0.5 sm:mb-1">{s.label}</div>
              <div className="text-xs sm:text-sm font-semibold text-slate-100">{s.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}