import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Zap, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

export default function Register() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!fullName || !email || !password) { toast.error('Tüm alanları doldurun'); return }
    if (password.length < 6) { toast.error('Şifre en az 6 karakter olmalı'); return }
    setLoading(true)
    try {
      await signUp(email, password, fullName)
      toast.success('Kayıt başarılı! E-postanızı kontrol edin.')
      navigate('/login')
    } catch (err) {
      toast.error(err.message || 'Kayıt başarısız')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="card p-8 animate-slide-up">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-accent-violet to-brand-500 rounded-2xl shadow-neon-pink mb-4">
              <Zap size={28} className="text-white" />
            </div>
            <h1 className="font-display font-bold text-2xl text-surface-900">Hesap Oluştur</h1>
            <p className="text-surface-400 font-body mt-1 text-sm">Hemen üye olun, alışverişe başlayın</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-display font-semibold text-surface-700">Ad Soyad</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Adınız Soyadınız"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-display font-semibold text-surface-700">E-posta</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ornek@email.com"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-display font-semibold text-surface-700">Şifre</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="En az 6 karakter"
                  className="input-field pl-10 pr-10"
                  required
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-700">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full mt-2 flex items-center justify-center gap-2">
              {loading ? <div className="spinner w-5 h-5 border-2" /> : 'Kayıt Ol'}
            </button>
          </form>

          <p className="text-center text-sm text-surface-500 font-body mt-6">
            Zaten hesabın var mı?{' '}
            <Link to="/login" className="text-brand-500 hover:text-brand-600 font-display font-semibold">
              Giriş Yap
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
