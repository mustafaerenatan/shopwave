import { ShoppingCart, Check, Star } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '../../store/cartStore'
import { formatPrice } from '../../utils/whatsapp'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
  const addItem = useCartStore((s) => s.addItem)
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    addItem(product)
    setAdded(true)
    toast.success(`${product.name} sepete eklendi!`)
    setTimeout(() => setAdded(false), 1500)
  }

  const hasDiscount = product.original_price && product.original_price > product.price
  const discountPct = hasDiscount
    ? Math.round(100 - (product.price / product.original_price) * 100)
    : null

  return (
    <div className="product-card card group cursor-pointer overflow-hidden animate-fade-in">
      {/* Image */}
      <div className="relative overflow-hidden bg-surface-100 h-52">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="product-img w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100">
            <span className="text-5xl">🛍️</span>
          </div>
        )}
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {hasDiscount && (
            <span className="bg-brand-500 text-white text-xs font-display font-bold px-2.5 py-1 rounded-full shadow-neon-pink">
              -{discountPct}%
            </span>
          )}
          {product.categories?.name && (
            <span className="tag-cyan text-[11px]">{product.categories.name}</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        <div>
          <h3 className="font-display font-semibold text-surface-900 text-base leading-snug line-clamp-2">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-sm text-surface-400 mt-1 line-clamp-2 font-body">
              {product.description}
            </p>
          )}
        </div>

        {/* Price row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-xl text-brand-600">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-surface-400 line-through">
                {formatPrice(product.original_price)}
              </span>
            )}
          </div>
          {product.stock !== null && product.stock <= 5 && product.stock > 0 && (
            <span className="tag-lime text-[10px]">Son {product.stock}!</span>
          )}
          {product.stock === 0 && (
            <span className="badge bg-red-100 text-red-500 text-[10px]">Tükendi</span>
          )}
        </div>

        {/* Button */}
        <button
          onClick={handleAdd}
          disabled={product.stock === 0}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl font-display font-semibold text-sm transition-all duration-300 ${
            added
              ? 'bg-green-500 text-white shadow-md'
              : product.stock === 0
              ? 'bg-surface-100 text-surface-400 cursor-not-allowed'
              : 'btn-primary'
          }`}
        >
          {added ? (
            <>
              <Check size={16} />
              Eklendi!
            </>
          ) : (
            <>
              <ShoppingCart size={16} />
              Sepete Ekle
            </>
          )}
        </button>
      </div>
    </div>
  )
}
