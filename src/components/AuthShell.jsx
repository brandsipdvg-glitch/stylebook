import { Link } from 'react-router-dom'
import { FiScissors, FiArrowLeft, FiSun, FiMoon, FiUser, FiShield } from 'react-icons/fi'
import { FaStore } from 'react-icons/fa'
import { useTheme } from '../context/ThemeContext.jsx'

export default function AuthShell({ title, subtitle, children, demo }) {
  const { dark, toggle } = useTheme()
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-ink-50 dark:from-ink-900 dark:via-ink-950 dark:to-ink-900" />
      <button onClick={toggle} className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-ink-600 shadow-card dark:bg-ink-800 dark:text-ink-200" aria-label="Theme">
        {dark ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
      </button>
      <Link to="/" className="absolute left-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-ink-600 shadow-card dark:bg-ink-800 dark:text-ink-200" aria-label="Home">
        <FiArrowLeft className="h-5 w-5" />
      </Link>

      <div className="relative z-10 w-full max-w-sm animate-slide-up">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2.5">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-glow">
            <FiScissors className="h-6 w-6" />
          </span>
          <span className="text-xl font-extrabold tracking-tight text-ink-900 dark:text-white">
            Style<span className="text-brand-600">Book</span>
          </span>
        </Link>
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-ink-900 dark:text-white">{title}</h1>
          <p className="mt-1.5 text-sm text-ink-500">{subtitle}</p>
        </div>
        <div className="card mt-6 p-6">
          {children}
        </div>
        {demo}
      </div>
    </div>
  )
}

export function DemoLogins({ onLogin }) {
  return (
    <div className="relative z-10 mt-5 w-full max-w-sm">
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-ink-200 dark:bg-ink-800" />
        <p className="text-[10px] font-bold uppercase tracking-widest text-ink-400">Instant demo access</p>
        <div className="h-px flex-1 bg-ink-200 dark:bg-ink-800" />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          { role: 'customer', label: 'Customer', icon: FiUser },
        ].map((b) => (
          <button key={b.role} onClick={() => onLogin(b.role)} className="rounded-2xl bg-white py-3 text-xs font-bold text-ink-700 shadow-card ring-1 ring-ink-900/5 transition hover:-translate-y-0.5 hover:shadow-lift dark:bg-ink-800 dark:text-ink-200 dark:ring-white/10">
            <b.icon className="mx-auto mb-1 h-4 w-4 text-brand-600" />
            {b.label}
          </button>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <button onClick={() => onLogin('owner')} className="rounded-2xl bg-white py-3 text-xs font-bold text-ink-700 shadow-card ring-1 ring-ink-900/5 transition hover:-translate-y-0.5 hover:shadow-lift dark:bg-ink-800 dark:text-ink-200 dark:ring-white/10">
          <FaStore className="mx-auto mb-1 h-4 w-4 text-brand-600" />
          Salon Owner
        </button>
        <button onClick={() => onLogin('admin')} className="rounded-2xl bg-white py-3 text-xs font-bold text-ink-700 shadow-card ring-1 ring-ink-900/5 transition hover:-translate-y-0.5 hover:shadow-lift dark:bg-ink-800 dark:text-ink-200 dark:ring-white/10">
          <FiShield className="mx-auto mb-1 h-4 w-4 text-brand-600" />
          Admin
        </button>
      </div>
    </div>
  )
}