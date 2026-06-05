const NAV = [
  { id: 'weather',  label: 'Weather',   num: '01' },
  { id: 'trees',    label: 'Forestry',  num: '02' },
]

export default function Sidebar({ current, onNav, open, onToggle }) {
  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside className={`
        fixed top-0 left-0 bottom-0 w-56 bg-slate-950 border-r border-slate-700 
        flex flex-col px-5 py-8 z-50 shadow-2xl
        transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        custom-scrollbar overflow-y-auto
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center text-white font-serif italic text-xl shrink-0 shadow-lg">
            A
          </div>
          <div>
            <div className="font-sans font-bold text-sm text-slate-100 tracking-tight">AgroSky</div>
            <div className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">Weather Intelligence</div>
          </div>
        </div>

        <div className="h-px bg-slate-700 mb-5" />

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-1">
          {NAV.map(n => (
            <button
              key={n.id}
              onClick={() => { onNav(n.id); onToggle() }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm w-full text-left transition-all duration-150
                ${current === n.id
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
            >
              <span className={`text-[10px] tracking-wider ${current === n.id ? 'text-blue-300' : 'text-slate-500'}`}>
                {n.num}
              </span>
              <span className="font-medium">{n.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-slate-700 pt-4 flex flex-col gap-1.5">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            API connected
          </div>
          <div className="text-[10px] text-slate-500">Powered by Weather-AI</div>
        </div>
      </aside>
    </>
  )
}
