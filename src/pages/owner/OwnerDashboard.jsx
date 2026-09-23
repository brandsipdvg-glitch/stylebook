import { Link } from 'react-router-dom'
import { FiCalendar, FiClock, FiUsers, FiStar, FiChevronRight, FiScissors, FiDollarSign, FiTrendingUp, FiCheckCircle } from 'react-icons/fi'
import { BarLoader } from '../../components/Loader.jsx'
import { EmptyState } from '../../components/EmptyState.jsx'
import { useOwnerSalon } from '../../hooks/useOwnerSalon.js'

const todayStr = () => new Date().toISOString().slice(0, 10)
const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN')

export default function OwnerDashboard() {
  const { salon, bookings, slots, loading } = useOwnerSalon()
  if (loading) return <BarLoader />
  if (!salon) return <EmptyState title="Salon not found" message="Ask the admin to create your salon profile." />

  const today = todayStr()
  const paidStatuses = ['confirmed', 'completed']
  const completed = bookings.filter((b) => b.status === 'completed')
  const earnedTotal = bookings.filter((b) => paidStatuses.includes(b.status)).reduce((s, b) => s + (b.price || 0), 0)
  const todaysEarned = bookings.filter((b) => b.date === today && paidStatuses.includes(b.status)).reduce((s, b) => s + (b.price || 0), 0)
  const weekEarned = bookings
    .filter((b) => paidStatuses.includes(b.status) && Date.now() - new Date(b.date + 'T' + b.time) <= 7 * 86400000 && new Date(b.date + 'T' + b.time) <= new Date())
    .reduce((s, b) => s + (b.price || 0), 0)

  const todays = bookings.filter((b) => b.date === today)
  const confirmedToday = todays.filter((b) => b.status === 'confirmed')
  const upcoming = bookings.filter((b) => b.status === 'confirmed' || b.status === 'pending')
  const openSlots = slots.filter((s) => s.available).length
  const uniqueCustomers = new Set(bookings.map((b) => b.userId)).size

  const stats = [
    { label: 'Appointments Today', value: todays.length, sub: `${confirmedToday.length} confirmed`, icon: FiCalendar },
    { label: 'Upcoming', value: upcoming.length, sub: 'active bookings', icon: FiClock },
    { label: 'Haircuts Completed', value: completed.length, sub: `earned ${inr(completed.reduce((s, b) => s + (b.price || 0), 0))}`, icon: FiCheckCircle },
    { label: 'Total Customers', value: uniqueCustomers, sub: 'unique bookers', icon: FiUsers },
    { label: 'Open Slots Today', value: openSlots, sub: 'of ' + slots.length + ' slots', icon: FiClock },
    { label: 'Average Rating', value: salon.rating.toFixed(1), sub: `${salon.reviewsCount} reviews`, icon: FiStar },
  ]

  const recentBookings = [...bookings].sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time)).slice(0, 6)

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Welcome back</p>
        <h1 className="text-2xl font-extrabold text-ink-900 dark:text-white">{salon.name}</h1>
        <p className="mt-1 text-sm text-ink-500">{salon.address}</p>
      </div>

      {/* Earnings — the money earned through the app */}
      <div className="rounded-3xl bg-gradient-to-r from-ink-900 via-ink-800 to-brand-800 p-5 text-white sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-300">
              <FiTrendingUp className="h-4 w-4" /> Earnings through the app
            </p>
            <p className="mt-2 text-4xl font-black tracking-tight">{inr(earnedTotal)}</p>
            <p className="mt-1 text-xs text-ink-300">{completed.length} haircuts completed · {inr(completed.reduce((s, b) => s + (b.price || 0), 0))} earned</p>
          </div>
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10">
            <FiDollarSign className="h-7 w-7 text-brand-300" />
          </span>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-white/10 p-3">
            <p className="text-lg font-extrabold">{inr(todaysEarned)}</p>
            <p className="text-[11px] text-ink-300">Today</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-3">
            <p className="text-lg font-extrabold">{inr(weekEarned)}</p>
            <p className="text-[11px] text-ink-300">Last 7 days</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-3">
            <p className="text-lg font-extrabold">{todays.length}</p>
            <p className="text-[11px] text-ink-300">Bookings today</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s) => (
          <div key={s.label} className="card p-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/30">
              <s.icon className="h-4.5 w-4.5" />
            </span>
            <p className="mt-3 text-2xl font-black text-ink-900 dark:text-white">{s.value}</p>
            <p className="text-xs font-semibold text-ink-500">{s.label}</p>
            <p className="text-[10px] text-ink-400">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-lg font-extrabold text-ink-900 dark:text-white">Recent bookings</h2>
        <Link to="/salon/bookings" className="inline-flex items-center text-sm font-semibold text-brand-600 hover:underline">
          Manage all <FiChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {recentBookings.length === 0 ? (
        <div className="mt-4">
          <EmptyState title="No bookings yet" message="New booking requests will appear here in real time." />
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {recentBookings.map((b) => (
            <div key={b.id} className="card flex items-center gap-3 p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-brand-600 ring-1 ring-ink-900/10 dark:bg-ink-800 dark:ring-white/10">
                <FiScissors className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-ink-900 dark:text-white">{b.hairstyleName} — {b.userName}</p>
                <p className="flex items-center gap-1 text-xs text-ink-400">
                  <FiCalendar className="h-3 w-3" /> {b.date} <FiClock className="ml-1 h-3 w-3" /> {b.time}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-ink-900 dark:text-white">{inr(b.price)}</p>
                <span className={`chip text-[10px] ${b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : b.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : b.status === 'completed' ? 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300' : 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                  {b.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}