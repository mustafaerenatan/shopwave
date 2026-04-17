import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, Tag, Users, LogOut, ChevronRight, Zap,
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import toast from 'react-hot-toast'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Ürünler', icon: Package },
  { to: '/admin/categories', label: 'Kategoriler', icon: Tag },
  { to: '/admin/users', label: 'Kullanıcılar', icon: Users },
]

export default function AdminLayout() {
  const { signOut, profile } = useAuthStore()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    toast.success('Çıkış yapıldı')
    navigate('/')
  }

  return (
    <div className="min-h-screen flex bg-surface-100">
      {/* Sidebar */}
      <aside className="w-64 min-h-screen bg-white border-r border-surface-200 flex flex-col shadow-sm">
        {/* Logo */}
        <div className="p-6 border-b border-surface-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl flex items-center justify-center shadow-neon-pink">
              <Zap size={18} className="text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-surface-900 leading-none">ShopWave</h1>
              <p className="text-xs text-surface-400 font-body mt-0.5">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Profile */}
        <div className="px-4 py-4 border-b border-surface-100">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-brand-50">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-300 to-brand-500 flex items-center justify-center text-white font-display font-bold text-sm">
              {profile?.full_name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-display font-semibold text-surface-800 truncate">
                {profile?.full_name || 'Admin'}
              </p>
              <span className="tag-pink text-[10px]">Admin</span>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 flex flex-col gap-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
              <ChevronRight size={14} className="ml-auto opacity-30" />
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-surface-100">
          <button
            onClick={handleSignOut}
            className="sidebar-link w-full text-red-400 hover:text-red-600 hover:bg-red-50"
          >
            <LogOut size={18} />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="page-enter p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
