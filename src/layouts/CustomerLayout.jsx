import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  FiHome,
  FiGrid,
  FiCalendar,
  FiHeart,
  FiUser,
  FiLogOut,
  FiSun,
  FiMoon,
  FiScissors,
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
  const { logout } = useAuth()
  const { dark, toggle } = useTheme()
  const { gender, setGender } = useGender()
  const { pathname } = useLocation()
  const navigate = useNavigate()

  // Pages with their own pinned price/action bar don't need the global bottom nav.
  const focusedPage = /^\/(book|salons\/[^/]+|hairstyles\/[^/]+)/.test(pathname)

  // First open: show the brand + gender welcome before the app loads.
  if (!gender) {
    return <GenderGate onPick={setGender} />
  }

  const handleLogout = async () => {
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
      {!focusedPage && (
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
      )}
    </div>
  )
}