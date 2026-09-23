import { FiScissors } from 'react-icons/fi'

export function ScreenLoader({ label = 'Loading…' }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white dark:bg-ink-950">
      <div className="flex h-16 w-16 animate-scale-in items-center justify-center rounded-3xl bg-brand-600 text-2xl text-white shadow-glow">
        <FiScissors className="h-7 w-7" />
      </div>
      <p className="text-sm font-semibold text-ink-500 animate-pulse">{label}</p>
    </div>
  )
}

export function BarLoader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
    </div>
  )
}