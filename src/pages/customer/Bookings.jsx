import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiCalendar, FiClock, FiMapPin, FiScissors, FiX } from 'react-icons/fi'
import { BarLoader } from '../../components/Loader.jsx'
import { EmptyState } from '../../components/EmptyState.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { getUserBookings, updateBookingStatus } from '../../lib/store.js'

const statusStyle = {
  confirmed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  completed: 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300',
  cancelled: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
}

export default function Bookings() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('upcoming')

  const load = async () => {
    if (!user) return
    const all = await getUserBookings(user.id)
    setBookings(all)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [user])

  const cancel = async (b) => {
    await updateBookingStatus(b.id, 'cancelled')
    toast('Booking cancelled', 'info')
    load()
  }

  if (loading) return <BarLoader />

  const now = new Date()
  const upcoming = bookings.filter((b) => b.status !== 'completed' && b.status !== 'cancelled' && new Date(b.date + 'T' + b.time) >= now)
  const history = bookings.filter((b) => b.status === 'completed' || b.status === 'cancelled' || new Date(b.date + 'T' + b.time) < now)
  const list = tab === 'upcoming' ? upcoming : history

  return (
    <div className="container-mx-sm py-6 animate-fade-in">
      <h1 className="text-2xl font-extrabold text-ink-900 dark:text-white">My Bookings</h1>
      <p className="mt-1 text-sm text-ink-500">Manage your appointments in one place.</p>

      <div className="mt-5 flex gap-2">
        {['upcoming', 'history'].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`chip ${tab === t ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-950' : 'bg-white text-ink-600 ring-1 ring-ink-900/10 dark:bg-ink-800 dark:text-ink-300 dark:ring-white/10'}`}>
            {t === 'upcoming' ? `Upcoming (${upcoming.length})` : `History (${history.length})`}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {list.length === 0 ? (
          <EmptyState
            icon={FiCalendar}
            title={tab === 'upcoming' ? 'No upcoming bookings' : 'No history yet'}
            message={tab === 'upcoming' ? 'Find a style you love and book your next visit.' : 'Your past appointments will show up here.'}
          >
            <Link to="/hairstyles" className="btn-primary mt-3">Explore hairstyles</Link>
          </EmptyState>
        ) : (
          list.map((b) => (
            <div key={b.id} className="card overflow-hidden">
              <div className="flex items-center gap-3 p-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-900/30">
                  <FiScissors className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-ink-900 dark:text-white">{b.hairstyleName}</p>
                  <p className="flex items-center gap-1 text-xs text-ink-500">
                    <FiMapPin className="h-3 w-3" /> {b.salonName}
                  </p>
                </div>
                <span className={`chip text-[10px] ${statusStyle[b.status]}`}>{b.status}</span>
              </div>
              <div className="flex items-center justify-between border-t border-ink-900/5 px-4 py-3 text-xs text-ink-500 dark:border-white/5">
                <span className="flex items-center gap-1.5">
                  <FiCalendar className="h-3.5 w-3.5" />
                  {new Date(b.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                </span>
                <span className="flex items-center gap-1.5">
                  <FiClock className="h-3.5 w-3.5" /> {b.time}
                </span>
                <span className="font-bold text-ink-900 dark:text-white">₹{b.price.toLocaleString('en-IN')}</span>
              </div>
              {(tab === 'upcoming' && (b.status === 'confirmed' || b.status === 'pending')) && (
                <button onClick={() => cancel(b)} className="flex w-full items-center justify-center gap-1.5 border-t border-ink-900/5 py-2.5 text-xs font-bold text-rose-600 transition hover:bg-rose-50 dark:border-white/5 dark:hover:bg-rose-900/20">
                  <FiX className="h-4 w-4" /> Cancel booking
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}