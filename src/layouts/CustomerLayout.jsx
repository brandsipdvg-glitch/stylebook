import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  FiHome,
  FiGrid,
  FiCalendar,
  FiHeart,
  FiUser,
  FiLogOut,
  FiSun,
  FiMoon,
  FiMenu,
  FiScissors,
  FiX,
} from 'react-icons/fi'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { useGender } from '../context/GenderContext.jsx'
import ScrollToTop from '../components/ScrollToTop.jsx'
import GenderGate from '../components/GenderGate.jsx'

const tabs = [
  { to: '/', label: 'Home', icon: FiHome, end: true },
  { to: '/hairstyles', label: 'Styles', icon: FiGrid },
  { to: '/bookings', label: 'Bookings', icon: FiCalendar },
  { to: '/favorites', label: 'Saved', icon: FiHeart },
  { to: '/profile', label: 'Profile', icon: FiUser },
]

function Brand({ onClick }) {
  return (
    <Link to="/" onClick={onClick} className="flex items-center gap-2.5">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-glow">
        <FiScissors className="h-5 w-5" />
      </span>
      <span className="text-lg font-extrabold tracking-tight text-ink-900 dark:text-white">
        Style<span className="text-brand-600">Book</span>
      </span>
    </Link>
  )
}

export default function CustomerLayout() {
  const { user, logout } = useAuth()
  const { dark, toggle } = useTheme()
  const { gender, setGender } = useGender()
  const navigate = useNavigate()
  const [menu, setMenu] = useState(false)

  // First open: show the brand + gender welcome before the app loads.
  if (!gender) {
    return <GenderGate onPick={setGender} />
  }

  const handleLogout = async () => {
    setMenu(false)
    await logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-ink-50/60 dark:bg-ink-950">
      <ScrollToTop />
      {/* Desktop header */}
      <header className="sticky top-0 z-40 hidden border-b border-ink-900/5 bg-white/80 backdrop-blur-xl md:block dark:bg-ink-950/80 dark:border-white/5">
        <div className="container-mx flex h-16 items-center justify-between">
          <Brand />
          <nav className="flex items-center gap-1">
            {tabs.map((t) => (
              <NavLink
                key={t.to}
                to={t.to}
                end={t.end}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-2 text-sm font-semibold transition ${
                    isActive ? 'bg-brand-600 text-white' : 'text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800'
                  }`
                }
              >
                {t.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <div className="mr-1 flex items-center gap-1 rounded-2xl bg-ink-100 p-1 dark:bg-ink-800">
              {['all', 'men', 'women'].map((g) => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold capitalize transition ${gender === g ? 'bg-brand-600 text-white shadow-glow' : 'text-ink-500 hover:text-ink-800 dark:hover:text-ink-100'}`}
                >
                  {g === 'all' ? 'All' : g}
                </button>
              ))}
            </div>
            <button onClick={toggle} className="btn-ghost !p-3" aria-label="Toggle theme">
              {dark ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
            </button>
            <button onClick={handleLogout} className="btn-ghost !p-3" aria-label="Logout">
              <FiLogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="pb-24 md:pb-10">
        <Outlet />
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-ink-900/5 bg-white/90 backdrop-blur-xl safe-bottom dark:bg-ink-950/90 dark:border-white/5 md:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around px-2 py-2">
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className={({ isActive }) =>
                `flex min-w-[64px] flex-col items-center gap-1 rounded-2xl px-3 py-1.5 text-[10px] font-semibold transition ${
                  isActive ? 'text-brand-600' : 'text-ink-400 hover:text-ink-600 dark:hover:text-ink-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`relative flex h-8 w-12 items-center justify-center rounded-full transition ${isActive ? 'bg-brand-50 dark:bg-brand-900/30' : ''}`}>
                    <t.icon className="h-5 w-5" />
                  </span>
                  {t.label}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-ink-900/5 bg-white/85 px-4 py-3 backdrop-blur-xl md:hidden safe-top dark:bg-ink-950/85 dark:border-white/5">
        <Brand />
        <div className="flex items-center gap-1">
          <button onClick={toggle} className="flex h-10 w-10 items-center justify-center rounded-2xl text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800" aria-label="Toggle theme">
            {dark ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
          </button>
          <button onClick={() => setMenu(true)} className="flex h-10 w-10 items-center justify-center rounded-2xl text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800" aria-label="Menu">
            <FiMenu className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      {menu && (
        <div className="fixed inset-0 z-[80] md:hidden">
          <div className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm" onClick={() => setMenu(false)} />
          <div className="absolute inset-y-0 right-0 w-72 max-w-[80%] animate-slide-in-right bg-white p-5 shadow-lift dark:bg-ink-900">
            <div className="mb-6 flex items-center justify-between">
              <Brand onClick={() => setMenu(false)} />
              <button onClick={() => setMenu(false)} className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-100 dark:bg-ink-800" aria-label="Close">
                <FiX className="h-5 w-5" />
              </button>
            </div>
            {user && (
              <div className="mb-4 flex items-center gap-3 rounded-2xl bg-ink-50 p-3 dark:bg-ink-800">
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                    {user.name?.[0]?.toUpperCase()}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-ink-900 dark:text-white">{user.name}</p>
                  <p className="truncate text-xs text-ink-500">{user.email}</p>
                </div>
              </div>
            )}
            <div className="space-y-1">
              <p className="px-3 pt-1 text-[10px] font-bold uppercase tracking-widest text-ink-400">Showing styles for</p>
              <div className="flex gap-2 px-3 pb-2">
                {['all', 'men', 'women'].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g)}
                    className={`chip flex-1 ${gender === g ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300'}`}
                  >
                    {g === 'all' ? 'All' : g}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              {tabs.map((t) => (
                <Link
                  key={t.to}
                  to={t.to}
                  onClick={() => setMenu(false)}
                  className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-ink-700 transition hover:bg-ink-50 dark:text-ink-200 dark:hover:bg-ink-800"
                >
                  <t.icon className="h-5 w-5 text-brand-600" />
                  {t.label}
                </Link>
              ))}
              <Link to="/salon" className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-ink-700 transition hover:bg-ink-50 dark:text-ink-200 dark:hover:bg-ink-800">
                <FiScissors className="h-5 w-5 text-brand-600" />
                Salon Owner
              </Link>
              <button onClick={handleLogout} className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:hover:bg-rose-900/20">
                <FiLogOut className="h-5 w-5" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}