export default function StatCard({ label, value, icon: Icon, color = 'brand', trend, sub }) {
  const colorMap = {
    brand: 'from-brand-400 to-brand-600 shadow-neon-pink',
    lime: 'from-yellow-300 to-green-400 shadow-neon-lime',
    cyan: 'from-cyan-300 to-blue-500 shadow-neon-cyan',
    violet: 'from-violet-400 to-purple-600',
    orange: 'from-orange-300 to-red-400',
  }

  return (
    <div className="stat-card animate-fade-in">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-display font-semibold text-surface-400 uppercase tracking-widest">
            {label}
          </p>
          <p className="font-display font-bold text-3xl text-surface-900 mt-1">{value}</p>
          {sub && <p className="text-xs text-surface-400 mt-1 font-body">{sub}</p>}
        </div>
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center shadow-lg flex-shrink-0`}>
          <Icon size={22} className="text-white" />
        </div>
      </div>
      {trend !== undefined && (
        <div className={`flex items-center gap-1 text-xs font-display font-semibold mt-2 ${trend >= 0 ? 'text-green-500' : 'text-red-400'}`}>
          <span>{trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%</span>
          <span className="text-surface-400 font-body font-normal">bu ay</span>
        </div>
      )}
    </div>
  )
}
