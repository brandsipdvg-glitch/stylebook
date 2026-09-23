import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiMail, FiCheckCircle } from 'react-icons/fi'
import AuthShell from '../../components/AuthShell.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export default function ForgotPassword() {
  const { forgot } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await forgot(email)
      setDone(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell title="Reset password" subtitle="We'll email you a link to reset your password">
      {done ? (
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <FiCheckCircle className="h-12 w-12 text-emerald-500" />
          <h3 className="text-lg font-bold text-ink-900 dark:text-white">Check your inbox</h3>
          <p className="text-sm text-ink-500">A reset link has been sent to {email}.</p>
          <Link to="/login" className="btn-primary mt-2 w-full">Back to sign in</Link>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          {error && <p className="rounded-2xl bg-rose-50 p-3 text-xs font-semibold text-rose-600 dark:bg-rose-900/20 dark:text-rose-400">{error}</p>}
          <div>
            <label className="label">Registered email</label>
            <div className="relative">
              <FiMail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input className="input pl-11" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full !py-4">{loading ? 'Sending…' : 'Send reset link'}</button>
          <p className="text-center text-xs text-ink-500">
            Remembered it?{' '}
            <Link to="/login" className="font-bold text-brand-600 hover:underline">Sign in</Link>
          </p>
        </form>
      )}
    </AuthShell>
  )
}