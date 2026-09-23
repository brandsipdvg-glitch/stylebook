import { createContext, useCallback, useContext, useState } from 'react'
import { FiCheckCircle, FiInfo, FiXCircle } from 'react-icons/fi'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismiss = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id))
  }, [])

  const toast = useCallback(
    (message, type = 'success') => {
      const id = Date.now() + Math.random()
      setToasts((t) => [...t, { id, message, type }])
      setTimeout(() => dismiss(id), 3200)
    },
    [dismiss],
  )

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex flex-col items-center gap-2 px-4 safe-top">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex w-full max-w-sm animate-toast-in items-center gap-3 rounded-2xl bg-ink-900 px-4 py-3 shadow-lift ring-1 ring-white/10"
            role="status"
          >
            {t.type === 'success' && <FiCheckCircle className="h-5 w-5 shrink-0 text-emerald-400" />}
            {t.type === 'error' && <FiXCircle className="h-5 w-5 shrink-0 text-rose-400" />}
            {t.type !== 'success' && t.type !== 'error' && <FiInfo className="h-5 w-5 shrink-0 text-sky-400" />}
            <p className="flex-1 text-sm font-medium text-white">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              className="text-ink-400 transition hover:text-white"
              aria-label="Dismiss"
            >
              <FiXCircle className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)