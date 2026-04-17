import { Trash2, Plus, Minus } from 'lucide-react'
import { useCartStore } from '../../store/cartStore'
import { formatPrice } from '../../utils/whatsapp'

export default function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCartStore()

  return (
    <div className="card p-4 flex items-center gap-4 animate-slide-up">
      {/* Image */}
      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-surface-100 flex-shrink-0">
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-2xl">🛍️</div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="font-display font-semibold text-surface-900 truncate">{item.name}</h4>
        <p className="text-brand-500 font-display font-bold mt-0.5">{formatPrice(item.price)}</p>
      </div>

      {/* Quantity controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          className="w-8 h-8 rounded-xl bg-surface-100 hover:bg-brand-100 hover:text-brand-600 flex items-center justify-center transition-colors duration-200"
        >
          <Minus size={14} />
        </button>
        <span className="w-8 text-center font-display font-bold text-surface-900">
          {item.quantity}
        </span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="w-8 h-8 rounded-xl bg-surface-100 hover:bg-brand-100 hover:text-brand-600 flex items-center justify-center transition-colors duration-200"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Subtotal */}
      <div className="text-right min-w-[80px]">
        <p className="font-display font-bold text-surface-900">
          {formatPrice(item.price * item.quantity)}
        </p>
      </div>

      {/* Remove */}
      <button
        onClick={() => removeItem(item.id)}
        className="p-2 rounded-xl text-surface-400 hover:text-red-400 hover:bg-red-50 transition-colors duration-200"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}
