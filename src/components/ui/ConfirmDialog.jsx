import Modal from './Modal'
import { AlertTriangle } from 'lucide-react'

export default function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Sil', danger = true }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${danger ? 'bg-red-100' : 'bg-brand-50'}`}>
          <AlertTriangle size={28} className={danger ? 'text-red-400' : 'text-brand-500'} />
        </div>
        <p className="text-surface-600 font-body">{message}</p>
        <div className="flex gap-3 w-full">
          <button onClick={onClose} className="flex-1 btn-secondary">
            İptal
          </button>
          <button
            onClick={() => { onConfirm(); onClose() }}
            className={`flex-1 font-display font-semibold px-6 py-3 rounded-2xl transition-all duration-200 ${
              danger
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'btn-primary'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  )
}
