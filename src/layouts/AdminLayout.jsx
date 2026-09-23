import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { FiLayout, FiScissors, FiUsers, FiCalendar, FiGrid, FiLogOut, FiArrowLeft } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import ScrollToTop from '../components/ScrollToTop.jsx'

const nav = [
  { to: '/admin', label: 'Overview', icon: FiLayout, end: true },
  { to: '/admin/salons', label: 'Salons', icon: FiScissors },
  { to: '/admin/users', label: 'Users', icon: FiUsers },
  { to: '/admin/bookings', label: 'Bookings', icon: FiCalendar },
  { to: '/admin/hairstyles', label: 'Hairstyles', icon: FiGrid },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleLogout = async () => {
    await logout()
    toast('Signed out of admin panel', 'info')
    navigate('/admin/login')
  }

  return (
    <div className="flex min-h-screen bg-ink-50/60 dark:bg-ink-950">
      <ScrollToTop />
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-ink-900/5 bg-white px-4 py-6 dark:border-white/5 dark:bg-ink-900 lg:flex">
        <button onClick={() => navigate('/')} className="mb-6 flex items-center gap-1 text-xs font-semibold text-ink-400 hover:text-brand-600">
          <FiArrowLeft className="h-3.5 w-3.5" /> Back to app
        </button>
        <div className="mb-6 px-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-400">Admin Panel</p>
          <p className="mt-1 truncate font-extrabold text-ink-900 dark:text-white">{user?.name}</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? 'bg-ink-900 text-white'
                    : 'text-ink-600 hover:bg-ink-50 dark:text-ink-300 dark:hover:bg-ink-800'
                }`
              }
            >
              <n.icon className="h-5 w-5" />
              {n.label}
            </NavLink>
          ))}
        </nav>
        <button onClick={handleLogout} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:hover:bg-rose-900/20">
          <FiLogOut className="h-5 w-5" /> Sign out
        </button>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-40 flex items-center justify-between bg-white px-4 py-3 dark:bg-ink-900 lg:hidden safe-top">
          <button onClick={() => navigate('/')} className="flex h-10 w-10 items-center justify-center rounded-2xl text-ink-500" aria-label="Back">
            <FiArrowLeft className="h-5 w-5" />
          </button>
          <p className="text-sm font-extrabold text-ink-900 dark:text-white">Admin Panel</p>
          <button onClick={handleLogout} className="flex h-10 w-10 items-center justify-center rounded-2xl text-rose-500" aria-label="Logout">
            <FiLogOut className="h-5 w-5" />
          </button>
        </header>

        <div className="no-scrollbar sticky top-[52px] z-30 flex gap-2 overflow-x-auto bg-white px-4 py-3 dark:bg-ink-900 lg:hidden">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `chip shrink-0 ${isActive ? 'bg-ink-900 text-white' : 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300'}`
              }
            >
              <n.icon className="h-4 w-4" />
              {n.label}
            </NavLink>
          ))}
        </div>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-6 pb-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}