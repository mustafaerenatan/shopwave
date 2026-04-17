import { useState, useRef } from 'react'
import { Upload, X, Image } from 'lucide-react'
import { uploadImage } from '../../lib/supabase'
import toast from 'react-hot-toast'

export default function ImageUpload({ value, onChange, bucket = 'products' }) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef()

  const handleFile = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Lütfen bir resim dosyası seçin')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Dosya 5MB\'dan küçük olmalı')
      return
    }
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const url = await uploadImage(bucket, file, path)
      onChange(url)
      toast.success('Resim yüklendi!')
    } catch (err) {
      toast.error('Resim yüklenemedi: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      {value ? (
        <div className="relative rounded-2xl overflow-hidden group w-full h-48 bg-surface-100">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="p-2 bg-white rounded-xl hover:bg-surface-100 transition-colors"
            >
              <Upload size={18} />
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-2 bg-white rounded-xl hover:bg-red-50 text-red-400 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full h-40 border-2 border-dashed border-brand-200 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-brand-400 hover:bg-brand-50 transition-all duration-200 group"
        >
          {uploading ? (
            <div className="spinner" />
          ) : (
            <>
              <div className="w-10 h-10 rounded-2xl bg-brand-50 group-hover:bg-brand-100 flex items-center justify-center transition-colors">
                <Image size={20} className="text-brand-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-display font-semibold text-brand-500">Resim Yükle</p>
                <p className="text-xs text-surface-400 font-body mt-0.5">PNG, JPG, WEBP — maks 5MB</p>
              </div>
            </>
          )}
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {/* Or paste URL */}
      <div className="flex items-center gap-2">
        <div className="flex-1 h-px bg-surface-200" />
        <span className="text-xs text-surface-400 font-body">ya da</span>
        <div className="flex-1 h-px bg-surface-200" />
      </div>
      <input
        type="url"
        placeholder="Resim URL'si yapıştır…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input-field text-sm"
      />
    </div>
  )
}
