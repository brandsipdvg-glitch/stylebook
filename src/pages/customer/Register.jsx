import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiMail, FiLock, FiUser, FiPhone, FiEye, FiEyeOff } from 'react-icons/fi'
import AuthShell from '../../components/AuthShell.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

export default function Register() {
  const { register } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const u = await register({ ...form, role: 'customer' })
      toast('Account created — welcome to StyleBook!', 'success')
      navigate(u.role === 'owner' ? '/salon' : '/', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell title="Create account" subtitle="Join StyleBook and book your best hair day">
      <form onSubmit={submit} className="space-y-4">
        {error && <p className="rounded-2xl bg-rose-50 p-3 text-xs font-semibold text-rose-600 dark:bg-rose-900/20 dark:text-rose-400">{error}</p>}
        <div>
          <label className="label">Full name</label>
          <div className="relative">
            <FiUser className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input className="input pl-11" placeholder="Your name" value={form.name} onChange={set('name')} required />
          </div>
        </div>
        <div>
          <label className="label">Email</label>
          <div className="relative">
            <FiMail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input className="input pl-11" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
          </div>
        </div>
        <div>
          <label className="label">Phone</label>
          <div className="relative">
            <FiPhone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input className="input pl-11" inputMode="numeric" maxLength={10} placeholder="10-digit mobile" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, '') }))} />
          </div>
        </div>
        <div>
          <label className="label">Password</label>
          <div className="relative">
            <FiLock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input className="input pl-11 pr-12" type={show ? 'text' : 'password'} placeholder="Min. 6 characters" value={form.password} onChange={set('password')} required minLength={6} />
            <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-400" aria-label="toggle">
              {show ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full !py-4">
          {loading ? 'Creating account…' : 'Create account'}
        </button>
        <p className="text-center text-xs text-ink-500">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-brand-600 hover:underline">Sign in</Link>
        </p>
      </form>
    </AuthShell>
  )
}