import { useEffect, useState } from 'react'
import { FiSearch, FiCalendar, FiClock, FiScissors } from 'react-icons/fi'
import { BarLoader } from '../../components/Loader.jsx'
import { EmptyState } from '../../components/EmptyState.jsx'
import { getAllBookings, updateBookingStatus } from '../../lib/store.js'
import { useToast } from '../../context/ToastContext.jsx'

const statusStyle = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  confirmed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  completed: 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300',
  cancelled: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
}

export default function AdminBookings() {
  const { toast } = useToast()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('all')
  const [query, setQuery] = useState('')

  const load = async () => {
    setBookings(await getAllBookings())
    setLoading(false)
  }
  useEffect(() => {
    load()
  }, [])

  const list = bookings
    .filter((b) => (status === 'all' ? true : b.status === status))
    .filter((b) => (query ? `${b.userName} ${b.salonName}`.toLowerCase().includes(query.toLowerCase()) : true))
    .sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time))

  const act = async (id, s) => {
    await updateBookingStatus(id, s)
    toast(`Marked ${s}`, 'success')
    load()
  }

  if (loading) return <BarLoader />

  return (
    <div className="animate-fade-in">
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold text-ink-900 dark:text-white">Bookings</h1>
        <p className="mt-1 text-sm text-ink-500">{bookings.length} total across all salons</p>
      </div>

      <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((s) => (
          <button key={s} onClick={() => setStatus(s)} className={`chip shrink-0 ${status === s ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-950' : 'bg-white text-ink-600 ring-1 ring-ink-900/10 dark:bg-ink-800 dark:text-ink-300 dark:ring-white/10'}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="mb-4 max-w-md">
        <div className="relative">
          <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input className="input pl-11" placeholder="Search by customer or salon…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      {list.length ? (
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          {list.map((b) => (
            <div key={b.id} className="card p-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-900/30">
                  <FiScissors className="h-5 w-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-ink-900 dark:text-white">{b.userName} → {b.salonName}</p>
                  <p className="flex flex-wrap items-center gap-x-3 text-xs text-ink-400">
                    <span>{b.hairstyleName}</span>
                    <span className="inline-flex items-center gap-1"><FiCalendar className="h-3 w-3" /> {b.date}</span>
                    <span className="inline-flex items-center gap-1"><FiClock className="h-3 w-3" /> {b.time}</span>
                  </p>
                </div>
                <span className={`chip text-[10px] ${statusStyle[b.status]}`}>{b.status}</span>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-ink-900/5 pt-3 dark:border-white/5">
                <p className="text-sm font-extrabold text-ink-900 dark:text-white">₹{b.price?.toLocaleString('en-IN')}</p>
                <div className="flex gap-1.5">
                  {b.status === 'pending' && (
                    <button onClick={() => act(b.id, 'confirmed')} className="chip bg-emerald-500 text-white text-[10px]">Accept</button>
                  )}
                  {b.status === 'confirmed' && (
                    <button onClick={() => act(b.id, 'completed')} className="chip bg-ink-900 text-white text-[10px] dark:bg-white dark:text-ink-950">Complete</button>
                  )}
                  {(b.status === 'pending' || b.status === 'confirmed') && (
                    <button onClick={() => act(b.id, 'cancelled')} className="chip bg-rose-50 text-rose-600 text-[10px] dark:bg-rose-900/20">Cancel</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon={FiSearch} title="No bookings" message="No bookings match this filter." />
      )}
    </div>
  )
}