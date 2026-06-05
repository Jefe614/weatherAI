import { useState, useRef } from 'react'
import { analyzeTree, fetchTreeQuota } from '../api/client.js'
import Toast from '../components/Toast.jsx'

export default function TreesPage() {
  const [file, setFile]       = useState(null)
  const [preview, setPreview] = useState(null)
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [quota, setQuota]     = useState(null)
  const [toast, setToast]     = useState(null)
  const [form, setForm]       = useState({ farmerId: '', county: '', landAcres: '', notes: '' })
  const inputRef = useRef()

  const pickFile = (f) => {
    if (!f) return
    if (!f.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }
    if (f.size > 20 * 1024 * 1024) {
      setError('File must be smaller than 20 MB')
      return
    }
    setFile(f); setPreview(URL.createObjectURL(f)); setResult(null); setError(null)
  }

  const onDrop = (e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) pickFile(f) }

  const submit = async () => {
    if (!file) return
    
    const acresNum = form.landAcres ? parseFloat(form.landAcres) : null
    if (acresNum && acresNum <= 0) {
      setError('Plot size must be a positive number')
      return
    }
    
    setLoading(true); setError(null); setToast(null)
    try {
      const fd = new FormData()
      fd.append('image', file)
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v) })
      const res = await analyzeTree(fd)
      setResult(res.data)
      const q = await fetchTreeQuota()
      setQuota(q.data)
      setToast(`✓ Analysis complete - ${res.data.total_tree_count} trees detected`)
    } catch (e) {
      setError(e.response?.data?.error || e.message || 'Analysis failed')
    } finally {
      setLoading(false)
    }
  }

  const field = (key, label, placeholder, type = 'text') => (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] uppercase tracking-widest text-slate-400">{label}</label>
      <input
        type={type} placeholder={placeholder} value={form[key]}
        onChange={e => {
          setForm(f => ({ ...f, [key]: e.target.value }))
          setError(null)
        }}
        className="border border-slate-600 rounded-md px-3 py-2 text-sm text-slate-100 bg-slate-700 placeholder-slate-500 focus:border-blue-500 focus:bg-slate-600 outline-none transition-colors"
      />
    </div>
  )

  return (
    <div className="px-4 py-4 sm:px-6 sm:py-6 md:p-8 lg:p-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="font-sans font-extrabold text-2xl sm:text-3xl text-slate-100 tracking-tight">Forestry</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">Upload drone or satellite imagery to count trees & assess canopy health</p>
        </div>
        {quota && (
          <div className="flex items-center gap-1.5 border border-slate-600 rounded-full px-4 py-1.5 bg-slate-800 text-xs whitespace-nowrap">
            <span className="font-bold text-green-400">{quota.used}</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400">{quota.unlimited ? '∞' : quota.limit}</span>
            <span className="text-slate-400 ml-1">analyses used</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6 items-start">
        {/* Left: Upload panel */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col gap-4 shadow-lg">
          {/* Drop zone */}
          <div
            onDragOver={e => e.preventDefault()} onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg min-h-44 flex items-center justify-center cursor-pointer transition-colors overflow-hidden
              ${file ? 'border-slate-500 bg-slate-700' : 'border-slate-600 hover:border-slate-500 hover:bg-slate-700'}`}
          >
            <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp"
              className="hidden" onChange={e => pickFile(e.target.files[0])} />
            {preview ? (
              <div className="w-full">
                <img src={preview} alt="preview" className="w-full h-44 object-cover" />
                <p className="text-[11px] text-slate-400 px-3 py-2 truncate">{file?.name}</p>
              </div>
            ) : (
              <div className="text-center p-6">
                <div className="text-4xl text-slate-600 mb-3">◉</div>
                <div className="text-sm font-medium text-slate-400 mb-1">Drop farm image here</div>
                <div className="text-xs text-slate-500">JPEG · PNG · WEBP · max 20 MB</div>
              </div>
            )}
          </div>

          {file && (
            <button onClick={() => { setFile(null); setPreview(null); setResult(null) }}
              className="text-[11px] text-red-400 hover:text-red-300 text-left transition-colors">
              ✕ Remove image
            </button>
          )}

          {/* Form fields */}
          <div className="grid grid-cols-2 gap-3">
            {field('farmerId',  'Farmer / Plot ID', 'F-001')}
            {field('county',    'County',           'Bomet')}
            {field('landAcres', 'Plot size (acres)', '2.5', 'number')}
            {field('notes',     'Notes for AI',     'Tea plantation…')}
          </div>

          <button
            onClick={submit} disabled={!file || loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg text-sm font-semibold tracking-wide flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {loading
              ? <><span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />Analyzing…</>
              : '◉ Analyze Image'}
          </button>

          {error && (
            <div className="px-4 py-3 bg-red-900 border border-red-700 rounded-lg text-xs text-red-200">⚠ {error}</div>
          )}
        </div>

        {/* Right: Results */}
        <div className="bg-slate-800 border border-slate-700 rounded-xl min-h-80 flex flex-col shadow-lg">
          {!result && !loading && (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-500 py-20 text-sm">
              <span className="text-5xl">◉</span>
              <p>Analysis results will appear here</p>
            </div>
          )}

          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 py-20 text-slate-400 text-sm">
              <div className="w-8 h-8 border-2 border-slate-600 border-t-blue-400 rounded-full animate-spin" />
              <div>Running computer vision analysis…</div>
              <div className="text-xs text-slate-400">This may take up to 30 seconds</div>
            </div>
          )}

          {result && !loading && (
            <div className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-5">

              {/* Low-confidence / empty result warning */}
              {result.low_confidence && result.total_tree_count === 0 && (
                <div className="px-5 py-4 bg-amber-900/40 border border-amber-700 rounded-xl text-sm text-amber-200">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">⚠️</span>
                    <span className="font-semibold text-amber-100">Low confidence result</span>
                  </div>
                  <p className="text-amber-300/80 leading-relaxed">
                    The AI analysis could not confidently detect trees in this image. Try uploading a clearer
                    drone or satellite image with better resolution, or ensure the area contains visible tree
                    canopy.
                  </p>
                </div>
              )}

              {/* Hero */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-xl px-6 sm:px-8 py-5 sm:py-6 text-center border border-slate-700">
                <div className="font-sans font-black text-5xl sm:text-7xl tracking-tighter leading-none">
                  {result.total_tree_count ?? '—'}
                </div>
                <div className="text-[10px] sm:text-xs uppercase tracking-widest text-slate-400 mt-2">Trees Detected</div>
                {result.confidence_score != null && (
                  <div className={`mt-3 inline-block rounded-full px-3 py-1 text-[10px] sm:text-xs border ${
                    result.low_confidence
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                  }`}>
                    {result.low_confidence ? 'Low confidence' : `${Math.round(result.confidence_score * 100)}% confidence`}
                  </div>
                )}
              </div>

              {/* Stats — only show if there's data worth showing */}
              {(result.canopy_coverage_pct != null || result.tree_density_per_acre != null || result.tree_species_guess) && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { label: 'Canopy Coverage', value: result.canopy_coverage_pct != null ? `${result.canopy_coverage_pct}%` : null, color: 'text-green-400' },
                    { label: 'Density / Acre',  value: result.tree_density_per_acre != null ? `${result.tree_density_per_acre}` : null, color: 'text-blue-400' },
                    { label: 'Species',         value: result.tree_species_guess ?? null, color: 'text-orange-400', small: true },
                  ].filter(s => s.value != null).map(s => (
                    <div key={s.label} className="bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-center">
                      <div className={`font-semibold ${s.small ? 'text-xs' : 'text-xl'} ${s.color} mb-1`}>{s.value}</div>
                      <div className="text-[9px] uppercase tracking-widest text-slate-400">{s.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Health bars — only show when trees > 0 */}
              {result.tree_health && result.total_tree_count > 0 && (
                <div className="border border-slate-700 rounded-lg p-4 bg-slate-700/50">
                  <div className="text-[10px] uppercase tracking-widest text-slate-400 mb-3">Canopy Health</div>
                  {[
                    { label: 'Healthy',     n: result.tree_health.healthy,            color: 'bg-green-500' },
                    { label: 'Needs care',  n: result.tree_health.needs_care,          color: 'bg-amber-400' },
                    { label: 'Replace',     n: result.tree_health.needs_replacement,   color: 'bg-red-400' },
                  ].map(b => {
                    const pct = result.total_tree_count > 0 ? (b.n / result.total_tree_count) * 100 : 0
                    return (
                      <div key={b.label} className="flex items-center gap-3 mb-2 last:mb-0">
                        <span className="text-xs text-slate-400 w-20 shrink-0">{b.label}</span>
                        <div className="flex-1 h-1.5 bg-slate-600 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${b.color}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-slate-400 w-6 text-right shrink-0">{b.n}</span>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Observations */}
              {result.observations?.length > 0 && (
                <div className="border border-slate-700 rounded-lg p-4 bg-slate-700/50">
                  <div className="text-[10px] uppercase tracking-widest text-slate-400 mb-3">Observations</div>
                  <div className="flex flex-col divide-y divide-slate-700">
                    {result.observations.map((o, i) => (
                      <div key={i} className="flex gap-2 text-sm text-slate-300 py-2 first:pt-0 last:pb-0 leading-snug">
                        <span className="text-cyan-400 shrink-0 mt-0.5">◎</span> {o}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {result.recommendations?.length > 0 && (
                <div className="border border-slate-700 rounded-lg p-4 bg-slate-700/50">
                  <div className="text-[10px] uppercase tracking-widest text-slate-400 mb-3">Recommendations</div>
                  <div className="flex flex-col divide-y divide-slate-700">
                    {result.recommendations.map((r, i) => (
                      <div key={i} className="flex gap-2.5 text-sm text-slate-300 py-2 first:pt-0 last:pb-0 leading-snug">
                        <span className="w-5 h-5 bg-green-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">{i + 1}</span>
                        {r}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Overlay image */}
              {result.overlay_image_url && (
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-400 mb-2">Annotated Overlay</div>
                  <img src={result.overlay_image_url} alt="overlay" className="w-full rounded-lg border border-slate-700" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Toast message={toast} type="success" onClose={() => setToast(null)} />
    </div>
  )
}