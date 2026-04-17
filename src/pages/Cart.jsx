import { Link } from 'react-router-dom'
import { ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import CartItem from '../components/shop/CartItem'
import { generateWhatsAppUrl, formatPrice } from '../utils/whatsapp'
import toast from 'react-hot-toast'

export default function Cart() {
  const { items, clearCart, getTotalPrice, getTotalItems } = useCartStore()
  const totalPrice = getTotalPrice()
  const totalItems = getTotalItems()

  const handleWhatsApp = () => {
    if (items.length === 0) {
      toast.error('Sepetiniz boş!')
      return
    }
    const url = generateWhatsAppUrl(items, totalPrice)
    window.open(url, '_blank')
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-8xl mb-6 animate-float">🛒</div>
        <h2 className="font-display font-bold text-3xl text-surface-900 mb-3">Sepetiniz Boş</h2>
        <p className="text-surface-400 font-body mb-8">Hemen ürün ekleyerek alışverişe başlayın!</p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft size={18} />
          Alışverişe Devam Et
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-title">Sepetim</h1>
          <p className="text-surface-400 font-body mt-1">{totalItems} ürün</p>
        </div>
        <button
          onClick={() => { clearCart(); toast.success('Sepet temizlendi') }}
          className="flex items-center gap-2 text-red-400 hover:text-red-500 font-display font-medium text-sm hover:bg-red-50 px-4 py-2 rounded-xl transition-all duration-200"
        >
          <Trash2 size={16} />
          Sepeti Temizle
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
          <Link
            to="/"
            className="flex items-center gap-2 text-brand-500 font-display font-medium text-sm hover:text-brand-600 mt-2 w-fit"
          >
            <ArrowLeft size={16} />
            Alışverişe Devam Et
          </Link>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h3 className="font-display font-bold text-xl text-surface-900 mb-6">Sipariş Özeti</h3>

            {/* Item breakdown */}
            <div className="space-y-3 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm font-body">
                  <span className="text-surface-600 truncate max-w-[160px]">
                    {item.name} <span className="text-surface-400">x{item.quantity}</span>
                  </span>
                  <span className="font-semibold text-surface-800 ml-2 flex-shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-surface-100 pt-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="font-display font-bold text-surface-900">Toplam</span>
                <span className="font-display font-bold text-2xl text-brand-600">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <button
              onClick={handleWhatsApp}
              className="w-full flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-display font-bold text-lg py-4 rounded-2xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              WhatsApp ile Sipariş Ver
            </button>

            <p className="text-center text-xs text-surface-400 font-body mt-3">
              Sipariş bilgileriniz WhatsApp'a aktarılacak
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
