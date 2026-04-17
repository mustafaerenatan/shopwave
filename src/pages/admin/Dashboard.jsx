import { useEffect, useState } from 'react'
import { Package, Users, Tag, TrendingUp, ShoppingBag, Star, BarChart3, Activity } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import StatCard from '../../components/ui/StatCard'
import { formatPrice } from '../../utils/whatsapp'
import { FullPageSpinner } from '../../components/ui/Spinner'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [recentProducts, setRecentProducts] = useState([])

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    setLoading(true)
    const [
      { count: totalProducts },
      { count: totalUsers },
      { count: totalCategories },
      { count: activeProducts },
      { data: recent },
    ] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('categories').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false }).limit(5),
    ])

    setStats({ totalProducts, totalUsers, totalCategories, activeProducts })
    setRecentProducts(recent || [])
    setLoading(false)
  }

  if (loading) return <FullPageSpinner />

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="section-title">Dashboard</h1>
        <p className="text-surface-400 font-body mt-1">Mağaza istatistiklerinize genel bakış</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Toplam Ürün"
          value={stats?.totalProducts ?? 0}
          icon={Package}
          color="brand"
          sub={`${stats?.activeProducts} aktif`}
        />
        <StatCard
          label="Toplam Kullanıcı"
          value={stats?.totalUsers ?? 0}
          icon={Users}
          color="violet"
        />
        <StatCard
          label="Kategoriler"
          value={stats?.totalCategories ?? 0}
          icon={Tag}
          color="cyan"
        />
        <StatCard
          label="Aktif Ürün"
          value={stats?.activeProducts ?? 0}
          icon={Activity}
          color="lime"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent products */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-lg text-surface-900">Son Eklenen Ürünler</h2>
            <span className="tag-pink">Son 5</span>
          </div>
          <div className="space-y-3">
            {recentProducts.length === 0 && (
              <p className="text-surface-400 font-body text-sm text-center py-8">Henüz ürün eklenmedi</p>
            )}
            {recentProducts.map((p) => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-surface-50 transition-colors">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-surface-100 flex-shrink-0">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg">🛍️</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold text-surface-900 truncate text-sm">{p.name}</p>
                  <p className="text-xs text-surface-400 font-body">{p.categories?.name || 'Kategorisiz'}</p>
                </div>
                <div className="text-right">
                  <p className="font-display font-bold text-brand-600 text-sm">{formatPrice(p.price)}</p>
                  <span className={`badge text-[10px] ${p.is_active ? 'tag-lime' : 'bg-red-100 text-red-500'}`}>
                    {p.is_active ? 'Aktif' : 'Pasif'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary panel */}
        <div className="card p-6 flex flex-col gap-4">
          <h2 className="font-display font-bold text-lg text-surface-900">Hızlı Özet</h2>

          <div className="flex-1 space-y-4">
            {[
              { label: 'Aktif / Toplam Ürün', a: stats?.activeProducts, b: stats?.totalProducts, color: 'bg-brand-500' },
              { label: 'Kayıtlı Kullanıcılar', a: stats?.totalUsers, b: stats?.totalUsers, color: 'bg-violet-500' },
              { label: 'Kategori Sayısı', a: stats?.totalCategories, b: stats?.totalCategories, color: 'bg-cyan-500' },
            ].map(({ label, a, b, color }) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-body text-surface-500">{label}</span>
                  <span className="font-display font-semibold text-surface-800">{a} / {b}</span>
                </div>
                <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${color} rounded-full transition-all duration-700`}
                    style={{ width: b > 0 ? `${(a / b) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-surface-100">
            <div className="flex items-center gap-2 text-sm text-surface-400 font-body">
              <BarChart3 size={14} className="text-brand-400" />
              <span>Analitik veriler canlı güncelleniyor</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
