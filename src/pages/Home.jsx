import { useEffect } from 'react'
import { Sparkles, Search } from 'lucide-react'
import { useState } from 'react'
import { useProductStore } from '../store/productStore'
import ProductCard from '../components/shop/ProductCard'
import { FullPageSpinner } from '../components/ui/Spinner'

export default function Home() {
  const { fetchProducts, fetchCategories, categories, loading, selectedCategory, setSelectedCategory, getFilteredProducts } = useProductStore()
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const filtered = getFilteredProducts().filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.description || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Hero */}
      <div className="relative mb-12 rounded-3xl overflow-hidden bg-gradient-to-br from-brand-500 via-brand-600 to-accent-violet p-8 md:p-12 shadow-neon-pink">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,255,0,0.15),transparent_60%)]" />
        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4">
            <Sparkles size={14} className="text-accent-lime" />
            <span className="text-white text-xs font-display font-semibold">Yeni Ürünler Geldi!</span>
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-white leading-tight">
            Alışverişin<br />
            <span className="text-accent-lime">En Kolay</span> Hali
          </h1>
          <p className="text-white/80 mt-3 font-body text-lg">
            WhatsApp ile anında sipariş ver, hızlı teslimat al.
          </p>
        </div>
        {/* Floating emojis */}
        <div className="absolute right-8 top-6 text-5xl animate-float opacity-70 hidden md:block">🛍️</div>
        <div className="absolute right-28 bottom-6 text-3xl animate-float [animation-delay:2s] opacity-60 hidden md:block">✨</div>
        <div className="absolute right-16 top-1/2 text-4xl animate-float [animation-delay:1s] opacity-50 hidden md:block">💝</div>
      </div>

      {/* Search + Filters */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            placeholder="Ürün ara…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-11"
          />
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`flex-shrink-0 px-4 py-2 rounded-2xl font-display font-semibold text-sm transition-all duration-200 ${
              !selectedCategory
                ? 'bg-brand-500 text-white shadow-neon-pink'
                : 'bg-white text-surface-600 border border-surface-200 hover:border-brand-300'
            }`}
          >
            Tümü
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-2xl font-display font-semibold text-sm transition-all duration-200 ${
                selectedCategory === cat.id
                  ? 'bg-brand-500 text-white shadow-neon-pink'
                  : 'bg-white text-surface-600 border border-surface-200 hover:border-brand-300'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <FullPageSpinner />
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="font-display font-bold text-xl text-surface-700">Ürün bulunamadı</h3>
          <p className="text-surface-400 mt-2 font-body">Farklı bir arama deneyin</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-surface-400 font-body mb-4">{filtered.length} ürün</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
