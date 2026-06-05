export default function AiSummary({ summary }) {
  if (!summary) return null
  return (
    <div className="bg-gradient-to-br from-orange-900 to-amber-900 border border-orange-700 rounded-xl px-6 py-5 shadow-lg">
      <div className="flex items-center gap-2 mb-3">
        <span className="bg-orange-500 text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full">AI</span>
        <span className="text-xs font-semibold text-orange-200 uppercase tracking-wider">Agronomic Insights</span>
      </div>
      <p className="font-serif text-sm text-orange-50 leading-relaxed">{summary}</p>
    </div>
  )
}