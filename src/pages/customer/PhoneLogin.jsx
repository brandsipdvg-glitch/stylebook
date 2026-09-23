import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiPhone } from 'react-icons/fi'
import AuthShell from '../../components/AuthShell.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

export default function PhoneLogin() {
  const { phoneLogin: sendCode, phoneVerify } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [stage, setStage] = useState(1)
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [resetHint, setResetHint] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const send = async (e) => {
    e?.preventDefault()
    setError('')
    if (phone.replace(/\D/g, '').length !== 10) return setError('Enter a valid 10-digit mobile number')
    setLoading(true)
    try {
      const code = await sendCode('+91' + phone)
      setResetHint(true)
      toast('Demo OTP sent', 'info')
      console.log('[demo] OTP for', phone, 'is', code)
      setStage(2)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const verify = async (e) => {
    e?.preventDefault()
    setLoading(true)
    try {
      const u = await phoneVerify('+91' + phone, otp.join(''))
      toast('Phone verified — welcome!', 'success')
      navigate(u.role === 'owner' ? '/salon' : u.role === 'admin' ? '/admin' : '/', { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title={stage === 1 ? 'Login with phone' : 'Enter OTP'}
      subtitle={stage === 1 ? "We'll send a verification code to your phone" : `Code sent to +91 ${phone}`}
    >
      {stage === 1 ? (
        <form onSubmit={send} className="space-y-4">
          {error && <p className="rounded-2xl bg-rose-50 p-3 text-xs font-semibold text-rose-600 dark:bg-rose-900/20 dark:text-rose-400">{error}</p>}
          <div>
            <label className="label">Mobile number</label>
            <div className="relative">
              <FiPhone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input className="input pl-11" inputMode="numeric" maxLength={10} placeholder="10-digit mobile" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} autoFocus />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full !py-4">{loading ? 'Sending…' : 'Send OTP'}</button>
        </form>
      ) : (
        <form onSubmit={verify} className="space-y-5">
          <div className="flex justify-between gap-2">
            {otp.map((v, i) => (
              <input
                key={i}
                className="input !w-full !px-0 text-center text-xl font-extrabold"
                value={v}
                maxLength={1}
                inputMode="numeric"
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '')
                  const next = [...otp]
                  next[i] = val
                  setOtp(next)
                  if (val && i < 5) document.getElementById('otp-' + (i + 1))?.focus()
                }}
                onKeyDown={(e) => e.key === 'Backspace' && !otp[i] && i > 0 && document.getElementById('otp-' + (i - 1))?.focus()}
                id={'otp-' + i}
              />
            ))}
          </div>
          {resetHint && (
            <p className="rounded-2xl bg-amber-50 p-3 text-xs font-medium text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
              Demo mode — use the OTP shown in browser console.
            </p>
          )}
          {error && <p className="rounded-2xl bg-rose-50 p-3 text-xs font-semibold text-rose-600 dark:bg-rose-900/20 dark:text-rose-400">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full !py-4">{loading ? 'Verifying…' : 'Verify & Login'}</button>
          <button type="button" onClick={() => { setStage(1); setOtp(['', '', '', '', '', '']); setResetHint(false) }} className="w-full text-center text-xs font-bold text-ink-400 hover:text-ink-600">
            Change number
          </button>
        </form>
      )}
      <p className="mt-4 text-center text-xs text-ink-500">
        Instead use{' '}
        <Link to="/login" className="font-bold text-brand-600 hover:underline">email login</Link>
      </p>
    </AuthShell>
  )
}