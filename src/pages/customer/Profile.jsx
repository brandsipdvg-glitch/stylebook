import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiUser, FiPhone, FiLogOut, FiSun, FiMoon, FiHeart, FiCalendar, FiChevronRight, FiShield } from 'react-icons/fi'
import { FaStore } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext.jsx'
import { useTheme } from '../../context/ThemeContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'

export default function Profile() {
  const { user, saveProfile, logout, isAuthed } = useAuth()
  const { dark, toggle } = useTheme()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [saving, setSaving] = useState(false)

  if (!isAuthed) {
    return (
      <div className="container-mx-sm py-10">
        <div className="card flex flex-col items-center gap-4 p-8 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600 dark:bg-brand-900/30">
            <FiUser className="h-7 w-7" />
          </span>
          <h1 className="text-xl font-extrabold text-ink-900 dark:text-white">You're signed out</h1>
          <p className="text-sm text-ink-500">Sign in to view your profile, bookings and saved items.</p>
          <Link to="/login" className="btn-primary w-full">Sign in</Link>
          <Link to="/register" className="btn-ghost w-full">Create account</Link>
        </div>
      </div>
    )
  }

  const save = async () => {
    setSaving(true)
    await saveProfile({ name, phone })
    setEditing(false)
    setSaving(false)
    toast('Profile updated', 'success')
  }

  return (
    <div className="container-mx-sm py-6 animate-fade-in">
      {/* Header card */}
      <div className="card relative overflow-hidden p-6">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-100/60 dark:bg-brand-900/20" />
        <div className="relative flex items-center gap-4">
          {user.avatar ? (
            <img src={user.avatar} alt="" className="h-16 w-16 rounded-3xl object-cover ring-2 ring-brand-100 dark:ring-brand-900/30" />
          ) : (
            <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-600 text-2xl font-black text-white">{user.name?.[0]?.toUpperCase()}</span>
          )}
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-extrabold text-ink-900 dark:text-white">{user.name}</h1>
            <p className="truncate text-sm text-ink-500">{user.email}</p>
            {user.phone && <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-400"><FiPhone className="h-3 w-3" /> +91 {user.phone}</p>}
          </div>
          <button onClick={() => setEditing((v) => !v)} className="chip bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">{editing ? 'Close' : 'Edit'}</button>
        </div>
      </div>

      {editing && (
        <div className="card mt-4 space-y-4 p-5 animate-fade-in">
          <div>
            <label className="label">Full name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" value={phone} inputMode="numeric" maxLength={10} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} />
          </div>
          <button onClick={save} disabled={saving} className="btn-primary w-full">{saving ? 'Saving…' : 'Save changes'}</button>
        </div>
      )}

      {/* Menu */}
      <div className="card mt-4 divide-y divide-ink-900/5 dark:divide-white/5">
        {[
          { to: '/bookings', icon: FiCalendar, label: 'My Bookings', sub: 'Upcoming & history' },
          { to: '/favorites', icon: FiHeart, label: 'Saved Items', sub: 'Favourite salons & styles' },
          { to: '/salon', icon: FiStore, label: 'Salon Owner Dashboard', sub: 'Manage your salon' },
        ].map((m) => (
          <Link key={m.to} to={m.to} className="flex items-center gap-3 p-4 transition hover:bg-ink-50 dark:hover:bg-ink-800">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ink-50 text-ink-600 dark:bg-ink-800 dark:text-ink-300"><m.icon className="h-5 w-5" /></span>
            <div className="flex-1">
              <p className="text-sm font-bold text-ink-900 dark:text-white">{m.label}</p>
              <p className="text-xs text-ink-400">{m.sub}</p>
            </div>
            <FiChevronRight className="h-5 w-5 text-ink-300" />
          </Link>
        ))}
      </div>

      {/* Settings */}
      <div className="card mt-4 divide-y divide-ink-900/5 dark:divide-white/5">
        <button onClick={toggle} className="flex w-full items-center gap-3 p-4 transition hover:bg-ink-50 dark:hover:bg-ink-800">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ink-50 text-ink-600 dark:bg-ink-800 dark:text-ink-300">{dark ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}</span>
          <div className="flex-1 text-left">
            <p className="text-sm font-bold text-ink-900 dark:text-white">Dark Mode</p>
            <p className="text-xs text-ink-400">Toggle the theme</p>
          </div>
          <span className={`relative h-6 w-11 rounded-full transition ${dark ? 'bg-brand-600' : 'bg-ink-200'}`}>
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${dark ? 'left-[22px]' : 'left-0.5'}`} />
          </span>
        </button>
        <Link to="/salon" className="flex items-center gap-3 p-4 transition hover:bg-ink-50 dark:hover:bg-ink-800">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-ink-50 text-ink-600 dark:bg-ink-800 dark:text-ink-300"><FiShield className="h-5 w-5" /></span>
          <div className="flex-1">
            <p className="text-sm font-bold text-ink-900 dark:text-white">Privacy & Support</p>
            <p className="text-xs text-ink-400">Terms, help and more</p>
          </div>
          <FiChevronRight className="h-5 w-5 text-ink-300" />
        </Link>
      </div>

      <button
        onClick={async () => {
          await logout()
          navigate('/login')
        }}
        className="btn mt-4 w-full bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-900/20 dark:hover:bg-rose-900/30"
      >
        <FiLogOut className="h-5 w-5" /> Sign out
      </button>
      <p className="mt-4 text-center text-[11px] text-ink-400">StyleBook · Demo Build v1.0</p>
    </div>
  )
}