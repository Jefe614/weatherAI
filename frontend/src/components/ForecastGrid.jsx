const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

const WMO_EMOJI = {
  0:'☀',1:'🌤',2:'⛅',3:'☁',45:'🌫',48:'🌫',51:'🌦',53:'🌦',55:'🌧',
  61:'🌧',63:'🌧',65:'🌧',71:'❄',73:'❄',75:'❄',80:'🌦',81:'🌧',82:'⛈',
  95:'⛈',96:'⛈',99:'⛈',
}

export default function ForecastGrid({ days }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden shadow-lg">
      <div className="px-4 sm:px-5 py-3 border-b border-slate-700 bg-slate-900">
        <span className="text-[10px] uppercase tracking-widest font-semibold text-slate-400">7-Day Forecast</span>
      </div>
      <div className="divide-y divide-slate-700">
        {days.map((d, i) => {
          const date    = new Date(d.date)
          const dayName = i === 0 ? 'Today' : DAYS[date.getDay()]
          const code    = d.condition_code ?? 0
          const emoji   = WMO_EMOJI[code] ?? '🌡'
          const hi      = Math.round(d.temp_max ?? 0)
          const lo      = Math.round(d.temp_min ?? 0)
          const rain    = d.precipitation_probability ?? 0
          const iconUrl = d.icon || ''

          return (
            <div key={i} className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-3 sm:py-4 ${i === 0 ? 'bg-slate-700' : 'hover:bg-slate-700'} transition-colors`}>
              <span className={`w-14 sm:w-16 text-[10px] sm:text-xs font-semibold shrink-0 ${i === 0 ? 'text-slate-100' : 'text-slate-400'}`}>
                {dayName}
              </span>
              {iconUrl ? (
                <img src={iconUrl} alt={emoji} className="w-5 h-5 sm:w-6 sm:h-6 shrink-0" />
              ) : (
                <span className="text-base sm:text-lg leading-none">{emoji}</span>
              )}
              <div className="flex-1 flex items-center gap-1 text-[10px] sm:text-[11px] text-cyan-400">
                {rain > 0 && <><span>💧</span><span>{rain}%</span></>}
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm shrink-0">
                <span className="font-semibold text-slate-100">{hi}°</span>
                <span className="text-slate-400">{lo}°</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}