import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { FiMail, FiLock, FiEye, FiEyeOff, FiPhone } from 'react-icons/fi'
import AuthShell, { DemoLogins } from '../../components/AuthShell.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export default function Login() {
  const { login, demoLogin } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const from = location.state?.from || '/'

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const u = await login({ email, password })
      navigate(u.role === 'owner' ? '/salon' : u.role === 'admin' ? '/admin' : from, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to book your next visit"
      demo={<DemoLogins onLogin={async (r) => { await demoLogin(r); navigate(r === 'owner' ? '/salon' : r === 'admin' ? '/admin' : '/', { replace: true }) }} />}
    >
      <form onSubmit={submit} className="space-y-4">
        {error && <p className="rounded-2xl bg-rose-50 p-3 text-xs font-semibold text-rose-600 dark:bg-rose-900/20 dark:text-rose-400">{error}</p>}
        <div>
          <label className="label">Email</label>
          <div className="relative">
            <FiMail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input className="input pl-11" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
        </div>
        <div>
          <label className="label">Password</label>
          <div className="relative">
            <FiLock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input className="input pl-11 pr-12" type={show ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600" aria-label="toggle password">
              {show ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between text-xs">
          <Link to="/login/phone" className="inline-flex items-center gap-1 font-bold text-brand-600 hover:underline">
            <FiPhone className="h-3.5 w-3.5" /> Login with phone
          </Link>
          <Link to="/forgot-password" className="font-bold text-brand-600 hover:underline">Forgot password?</Link>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full !py-4">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
        <p className="text-center text-xs text-ink-500">
          New to StyleBook?{' '}
          <Link to="/register" className="font-bold text-brand-600 hover:underline">Create account</Link>
        </p>
      </form>
    </AuthShell>
  )
}