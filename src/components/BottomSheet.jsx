import { useEffect } from 'react'
import { FiX } from 'react-icons/fi'

export default function BottomSheet({ open, onClose, title, children, wide }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-[90] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm animate-fade-in-fast" onClick={onClose} />
      <div
        className={`relative z-10 w-full ${wide ? 'max-w-2xl' : 'max-w-md'} max-h-[88vh] overflow-y-auto rounded-t-4xl bg-white p-6 shadow-lift animate-slide-up dark:bg-ink-900 sm:rounded-4xl sm:animate-scale-in safe-bottom`}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-ink-200 dark:bg-ink-700 sm:hidden" />
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-ink-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-100 text-ink-500 transition hover:bg-ink-200 dark:bg-ink-800 dark:text-ink-300" aria-label="Close">
            <FiX className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}