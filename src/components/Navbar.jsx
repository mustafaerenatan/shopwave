import { Link, useNavigate, NavLink } from 'react-router-dom'
import { ShoppingCart, LogOut, User, Settings, Zap } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useCartStore } from '../store/cartStore'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { user, isAdmin, signOut } = useAuthStore()
  const getTotalItems = useCartStore((s) => s.getTotalItems)
  const navigate = useNavigate()
  const cartCount = getTotalItems()

  const handleSignOut = async () => {
    await signOut()
    toast.success('Çıkış yapıldı!')
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl flex items-center justify-center shadow-neon-pink group-hover:scale-110 transition-transform duration-200">
            <Zap size={18} className="text-white" />
          </div>
          <span className="font-display font-bold text-xl text-surface-900 tracking-tight">
            Shop<span className="text-gradient">Wave</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/" end className={({ isActive }) => `nav-link px-4 py-2 rounded-xl ${isActive ? 'active bg-brand-50' : ''}`}>
            Ürünler
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => `nav-link px-4 py-2 rounded-xl ${isActive ? 'active bg-brand-50' : ''}`}>
              Admin
            </NavLink>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Cart */}
          <Link
            to="/cart"
            className="relative p-2.5 rounded-xl hover:bg-brand-50 transition-colors duration-200 group"
          >
            <ShoppingCart size={22} className="text-surface-600 group-hover:text-brand-500 transition-colors" />
            {cartCount > 0 && (
              <span className="cart-badge absolute -top-1 -right-1 w-5 h-5 bg-brand-500 text-white text-xs font-display font-bold rounded-full flex items-center justify-center shadow-neon-pink">
                {cartCount > 9 ? '9+' : cartCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {user ? (
            <div className="flex items-center gap-1">
              {isAdmin && (
                <Link
                  to="/admin"
                  className="p-2.5 rounded-xl hover:bg-brand-50 transition-colors duration-200 group"
                  title="Admin Panel"
                >
                  <Settings size={20} className="text-surface-600 group-hover:text-brand-500 transition-colors" />
                </Link>
              )}
              <button
                onClick={handleSignOut}
                className="p-2.5 rounded-xl hover:bg-red-50 transition-colors duration-200 group"
                title="Çıkış Yap"
              >
                <LogOut size={20} className="text-surface-600 group-hover:text-red-400 transition-colors" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn-ghost text-sm py-2 px-4">
                Giriş Yap
              </Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-4">
                Kayıt Ol
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
