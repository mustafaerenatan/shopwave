import { useEffect, useState } from 'react'
import { Users, Search, Shield, User } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { FullPageSpinner } from '../../components/ui/Spinner'
import toast from 'react-hot-toast'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [updatingId, setUpdatingId] = useState(null)

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
    if (!error) setUsers(data || [])
    setLoading(false)
  }

  const toggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin'
    setUpdatingId(user.id)
    const { error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', user.id)
    if (error) {
      toast.error(error.message)
    } else {
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u))
      )
      toast.success(`${user.full_name} artık ${newRole === 'admin' ? 'Admin' : 'Kullanıcı'}`)
    }
    setUpdatingId(null)
  }

  const filtered = users.filter((u) =>
    (u.full_name || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <FullPageSpinner />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Kullanıcılar</h1>
          <p className="text-surface-400 font-body mt-1">{users.length} kayıtlı kullanıcı</p>
        </div>
        <button onClick={fetchUsers} className="btn-secondary text-sm px-4 py-2.5">
          Yenile
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
        <input
          type="text"
          placeholder="İsim veya e-posta…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10 text-sm"
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Users size={40} className="mx-auto text-surface-300 mb-3" />
            <p className="font-display font-semibold text-surface-500">Kullanıcı bulunamadı</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-100 bg-surface-50">
                  {['Kullanıcı', 'E-posta', 'Rol', 'Kayıt Tarihi', 'İşlem'].map((h) => (
                    <th key={h} className="text-left px-6 py-4 text-xs font-display font-semibold text-surface-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-50">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-surface-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-display font-bold text-sm ${u.role === 'admin' ? 'bg-gradient-to-br from-brand-400 to-brand-600' : 'bg-gradient-to-br from-surface-300 to-surface-400'}`}>
                          {(u.full_name?.[0] || u.email?.[0] || '?').toUpperCase()}
                        </div>
                        <p className="font-display font-semibold text-surface-900 text-sm">
                          {u.full_name || '—'}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-surface-600 font-body">{u.email || '—'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge text-xs ${u.role === 'admin' ? 'tag-pink' : 'bg-surface-100 text-surface-500'}`}>
                        {u.role === 'admin' ? (
                          <span className="flex items-center gap-1"><Shield size={10} /> Admin</span>
                        ) : (
                          <span className="flex items-center gap-1"><User size={10} /> Kullanıcı</span>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-surface-400 font-body">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString('tr-TR') : '—'}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleRole(u)}
                        disabled={updatingId === u.id}
                        className={`text-xs font-display font-semibold px-3 py-1.5 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100 ${
                          u.role === 'admin'
                            ? 'bg-red-50 text-red-400 hover:bg-red-100'
                            : 'bg-brand-50 text-brand-500 hover:bg-brand-100'
                        }`}
                      >
                        {updatingId === u.id ? '…' : u.role === 'admin' ? 'Admin Kaldır' : 'Admin Yap'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
