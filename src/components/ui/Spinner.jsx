export default function Spinner({ size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  }
  return (
    <div className={`${sizeMap[size]} border-brand-200 border-t-brand-500 rounded-full animate-spin ${className}`} />
  )
}

export function FullPageSpinner() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="spinner" />
      <p className="text-surface-400 font-body text-sm">Yükleniyor…</p>
    </div>
  )
}
