import { useEffect, useState } from 'react'
import { Plus, Trash2, Tag } from 'lucide-react'
import { useProductStore } from '../../store/productStore'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import { slugify } from '../../utils/whatsapp'
import { FullPageSpinner } from '../../components/ui/Spinner'
import toast from 'react-hot-toast'

export default function AdminCategories() {
  const { categories, loading, fetchCategories, createCategory, deleteCategory } = useProductStore()
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  useEffect(() => { fetchCategories() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!name.trim()) { toast.error('Kategori adı zorunludur'); return }
    setSaving(true)
    try {
      await createCategory(name.trim(), slugify(name))
      toast.success('Kategori oluşturuldu!')
      setName('')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteCategory(deleteId)
      toast.success('Kategori silindi')
    } catch (err) {
      toast.error(err.message)
    }
  }

  if (loading) return <FullPageSpinner />

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="section-title">Kategoriler</h1>
        <p className="text-surface-400 font-body mt-1">{categories.length} kategori</p>
      </div>

      {/* Create form */}
      <div className="card p-6">
        <h2 className="font-display font-bold text-lg text-surface-900 mb-4">Yeni Kategori</h2>
        <form onSubmit={handleCreate} className="flex gap-3">
          <div className="relative flex-1">
            <Tag size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Kategori adı…"
              className="input-field pl-10"
            />
          </div>
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 px-5">
            {saving ? <div className="spinner w-5 h-5 border-2" /> : <><Plus size={18} /> Ekle</>}
          </button>
        </form>
        {name && (
          <p className="text-xs text-surface-400 mt-2 font-mono">
            slug: <span className="text-brand-400">{slugify(name)}</span>
          </p>
        )}
      </div>

      {/* List */}
      <div className="card overflow-hidden">
        {categories.length === 0 ? (
          <div className="py-16 text-center">
            <Tag size={36} className="mx-auto text-surface-300 mb-3" />
            <p className="font-display font-semibold text-surface-500">Henüz kategori yok</p>
            <p className="text-sm text-surface-400 font-body mt-1">Yukarıdan ilk kategorinizi ekleyin</p>
          </div>
        ) : (
          <div className="divide-y divide-surface-50">
            {categories.map((cat, i) => (
              <div
                key={cat.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-surface-50 transition-colors group animate-fade-in"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center">
                    <Tag size={16} className="text-brand-500" />
                  </div>
                  <div>
                    <p className="font-display font-semibold text-surface-900">{cat.name}</p>
                    <p className="text-xs text-surface-400 font-mono">{cat.slug}</p>
                  </div>
                </div>
                <button
                  onClick={() => setDeleteId(cat.id)}
                  className="p-2 rounded-xl opacity-0 group-hover:opacity-100 hover:bg-red-50 text-surface-400 hover:text-red-400 transition-all duration-200"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Kategoriyi Sil"
        message="Bu kategoriyi silmek istediğinizden emin misiniz? İlişkili ürünler kategorisiz kalacak."
      />
    </div>
  )
}
