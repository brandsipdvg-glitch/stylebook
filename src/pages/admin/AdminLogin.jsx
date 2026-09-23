import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiMail, FiLock, FiShield } from 'react-icons/fi'
import AuthShell from '../../components/AuthShell.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export default function AdminLogin() {
  const { login, demoLogin } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@styledemo.app')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login({ email, password })
      navigate('/admin', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Admin Panel"
      subtitle="Platform controls and analytics"
      demo={
        <div className="relative z-10 mt-5 w-full max-w-sm">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-ink-200 dark:bg-ink-800" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-400">Instant demo access</p>
            <div className="h-px flex-1 bg-ink-200 dark:bg-ink-800" />
          </div>
          <button onClick={() => demoLogin('admin').then(() => navigate('/admin', { replace: true }))} className="mt-3 w-full rounded-2xl bg-ink-900 py-3 text-xs font-bold text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-ink-950">
            <FiShield className="mx-auto mb-1 h-4 w-4" />
            Enter Admin Panel
          </button>
        </div>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        {error && <p className="rounded-2xl bg-rose-50 p-3 text-xs font-semibold text-rose-600 dark:bg-rose-900/20 dark:text-rose-400">{error}</p>}
        <div>
          <label className="label">Admin email</label>
          <div className="relative">
            <FiMail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input className="input pl-11" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
        </div>
        <div>
          <label className="label">Password</label>
          <div className="relative">
            <FiLock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input className="input pl-11" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full !py-4">{loading ? 'Signing in…' : 'Sign in as admin'}</button>
      </form>
    </AuthShell>
  )
}