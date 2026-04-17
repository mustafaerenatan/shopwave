import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Search, Package } from 'lucide-react'
import { useProductStore } from '../../store/productStore'
import Modal from '../../components/ui/Modal'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import ImageUpload from '../../components/admin/ImageUpload'
import { formatPrice } from '../../utils/whatsapp'
import { FullPageSpinner } from '../../components/ui/Spinner'
import toast from 'react-hot-toast'

const EMPTY_FORM = {
  name: '', description: '', price: '', original_price: '',
  image_url: '', category_id: '', stock: '', is_active: true,
}

export default function AdminProducts() {
  const { products, categories, loading, fetchAllProducts, fetchCategories, createProduct, updateProduct, deleteProduct } = useProductStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchAllProducts()
    fetchCategories()
  }, [])

  const openCreate = () => {
    setEditProduct(null)
    setForm(EMPTY_FORM)
    setModalOpen(true)
  }

  const openEdit = (p) => {
    setEditProduct(p)
    setForm({
      name: p.name || '',
      description: p.description || '',
      price: p.price || '',
      original_price: p.original_price || '',
      image_url: p.image_url || '',
      category_id: p.category_id || '',
      stock: p.stock ?? '',
      is_active: p.is_active ?? true,
    })
    setModalOpen(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.name || !form.price) { toast.error('Ad ve fiyat zorunludur'); return }
    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim() || null,
        price: parseFloat(form.price),
        original_price: form.original_price ? parseFloat(form.original_price) : null,
        image_url: form.image_url || null,
        category_id: form.category_id || null,
        stock: form.stock !== '' ? parseInt(form.stock) : null,
        is_active: form.is_active,
      }
      if (editProduct) {
        await updateProduct(editProduct.id, payload)
        toast.success('Ürün güncellendi!')
      } else {
        await createProduct(payload)
        toast.success('Ürün oluşturuldu!')
      }
      setModalOpen(false)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteProduct(deleteId)
      toast.success('Ürün silindi')
    } catch (err) {
      toast.error(err.message)
    }
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <FullPageSpinner />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Ürünler</h1>
          <p className="text-surface-400 font-body mt-1">{products.length} ürün</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          Yeni Ürün
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
        <input
          type="text"
          placeholder="Ürün ara…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10 text-sm"
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Package size={40} className="mx-auto text-surface-300 mb-3" />
            <p className="font-display font-semibold text-surface-500">Ürün bulunamadı</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-surface-100 bg-surface-50">
                  {['Ürün', 'Kategori', 'Fiyat', 'Stok', 'Durum', 'İşlem'].map((h) => (
                    <th key={h} className="text-left px-6 py-4 text-xs font-display font-semibold text-surface-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-50">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-surface-100 flex-shrink-0">
                          {p.image_url ? (
                            <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-base">🛍️</div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-display font-semibold text-surface-900 text-sm truncate max-w-[180px]">{p.name}</p>
                          {p.description && (
                            <p className="text-xs text-surface-400 truncate max-w-[180px]">{p.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {p.categories?.name ? (
                        <span className="tag-cyan text-xs">{p.categories.name}</span>
                      ) : (
                        <span className="text-surface-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-display font-bold text-brand-600 text-sm">{formatPrice(p.price)}</p>
                        {p.original_price && (
                          <p className="text-xs text-surface-400 line-through">{formatPrice(p.original_price)}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm text-surface-700">
                        {p.stock ?? '∞'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge text-xs ${p.is_active ? 'tag-lime' : 'bg-red-100 text-red-500'}`}>
                        {p.is_active ? 'Aktif' : 'Pasif'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(p)}
                          className="p-2 rounded-xl hover:bg-brand-50 text-surface-400 hover:text-brand-500 transition-colors"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteId(p.id)}
                          className="p-2 rounded-xl hover:bg-red-50 text-surface-400 hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editProduct ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
        size="lg"
      >
        <form onSubmit={handleSave} className="space-y-5">
          {/* Image */}
          <div>
            <label className="text-sm font-display font-semibold text-surface-700 block mb-2">Ürün Resmi</label>
            <ImageUpload value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="text-sm font-display font-semibold text-surface-700 block mb-1.5">Ürün Adı *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Ürün adını girin"
                className="input-field"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-sm font-display font-semibold text-surface-700 block mb-1.5">Açıklama</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Ürün açıklaması…"
                className="input-field resize-none h-24"
              />
            </div>

            <div>
              <label className="text-sm font-display font-semibold text-surface-700 block mb-1.5">Fiyat (₺) *</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="0.00"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="text-sm font-display font-semibold text-surface-700 block mb-1.5">Eski Fiyat (₺)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.original_price}
                onChange={(e) => setForm({ ...form, original_price: e.target.value })}
                placeholder="İndirim için…"
                className="input-field"
              />
            </div>

            <div>
              <label className="text-sm font-display font-semibold text-surface-700 block mb-1.5">Kategori</label>
              <select
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                className="input-field"
              >
                <option value="">— Kategori seç —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-display font-semibold text-surface-700 block mb-1.5">Stok</label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="Boş = sınırsız"
                className="input-field"
              />
            </div>
          </div>

          {/* Active toggle */}
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-surface-50">
            <button
              type="button"
              onClick={() => setForm({ ...form, is_active: !form.is_active })}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${form.is_active ? 'bg-brand-500' : 'bg-surface-300'}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${form.is_active ? 'translate-x-7' : 'translate-x-1'}`} />
            </button>
            <span className="font-display font-semibold text-sm text-surface-700">
              {form.is_active ? 'Aktif (mağazada görünür)' : 'Pasif (gizli)'}
            </span>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn-secondary flex-1">
              İptal
            </button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
              {saving ? <div className="spinner w-5 h-5 border-2" /> : (editProduct ? 'Güncelle' : 'Oluştur')}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete confirm */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Ürünü Sil"
        message="Bu ürünü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
      />
    </div>
  )
}
