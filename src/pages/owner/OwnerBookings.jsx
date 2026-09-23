import { useMemo, useState } from 'react'
import { FiCheck, FiX, FiClock, FiCalendar, FiPhone, FiScissors } from 'react-icons/fi'
import { BarLoader } from '../../components/Loader.jsx'
import { EmptyState } from '../../components/EmptyState.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { useOwnerSalon } from '../../hooks/useOwnerSalon.js'
import { updateBookingStatus } from '../../lib/store.js'

const statusStyle = {
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  confirmed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  completed: 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300',
  cancelled: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
}

export default function OwnerBookings() {
  const { salon, bookings, loading, reload } = useOwnerSalon()
  const { toast } = useToast()
  const [tab, setTab] = useState('all')

  const list = useMemo(() => {
    let rows = bookings
    if (tab === 'today') {
      const today = new Date().toISOString().slice(0, 10)
      rows = rows.filter((b) => b.date === today)
    } else if (tab === 'active') {
      rows = rows.filter((b) => b.status === 'pending' || b.status === 'confirmed')
    } else if (tab !== 'all') {
      rows = rows.filter((b) => b.status === tab)
    }
    return [...rows].sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time))
  }, [bookings, tab])

  const act = async (b, status) => {
    await updateBookingStatus(b.id, status)
    toast(`Booking ${status}`, status === 'cancelled' ? 'info' : 'success')
    reload()
  }

  if (loading) return <BarLoader />

  const todayCount = bookings.filter((b) => b.date === new Date().toISOString().slice(0, 10)).length

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-extrabold text-ink-900 dark:text-white">Bookings</h1>
      <p className="mt-1 text-sm text-ink-500">{salon?.name} · {bookings.length} total · {todayCount} today</p>

      <div className="mt-5 flex gap-2 overflow-x-auto no-scrollbar">
        {[
          { k: 'all', l: 'All' },
          { k: 'today', l: 'Today' },
          { k: 'active', l: 'Active' },
          { k: 'pending', l: 'Pending' },
          { k: 'confirmed', l: 'Confirmed' },
          { k: 'completed', l: 'Completed' },
          { k: 'cancelled', l: 'Cancelled' },
        ].map((t) => (
          <button key={t.k} onClick={() => setTab(t.k)} className={`chip shrink-0 ${tab === t.k ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-950' : 'bg-white text-ink-600 ring-1 ring-ink-900/10 dark:bg-ink-800 dark:text-ink-300 dark:ring-white/10'}`}>
            {t.l}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {list.length === 0 ? (
          <EmptyState title="No bookings" message={tab === 'all' ? 'Customer bookings will appear here.' : 'No bookings match this filter yet.'} onAction={() => setTab('all')} />
        ) : (
          list.map((b) => (
            <div key={b.id} className="card p-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-ink-900 dark:text-white">{b.userName}</p>
                  <p className="flex items-center gap-1.5 text-xs text-ink-500">
                    <FiPhone className="h-3 w-3" /> +91 {b.phone}
                  </p>
                </div>
                <span className={`chip text-[10px] ${statusStyle[b.status]}`}>{b.status}</span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-2xl bg-ink-50 px-3 py-2.5 text-xs text-ink-600 dark:bg-ink-800 dark:text-ink-300">
                <span className="inline-flex items-center gap-1"><FiScissors className="h-3.5 w-3.5 text-brand-600" /> {b.hairstyleName}</span>
                <span className="inline-flex items-center gap-1"><FiCalendar className="h-3.5 w-3.5 text-brand-600" /> {b.date}</span>
                <span className="inline-flex items-center gap-1"><FiClock className="h-3.5 w-3.5 text-brand-600" /> {b.time}</span>
                <span className="ml-auto font-extrabold text-ink-900 dark:text-white">₹{b.price.toLocaleString('en-IN')}</span>
              </div>

              <div className="mt-3 flex gap-2">
                {(b.status === 'pending') && (
                  <>
                    <button onClick={() => act(b, 'confirmed')} className="btn bg-emerald-500 text-white hover:bg-emerald-600 flex-1 !py-2.5 text-xs">
                      <FiCheck className="h-4 w-4" /> Accept
                    </button>
                    <button onClick={() => act(b, 'cancelled')} className="btn bg-rose-50 text-rose-600 hover:bg-rose-100 flex-1 !py-2.5 text-xs dark:bg-rose-900/20 dark:hover:bg-rose-900/30">
                      <FiX className="h-4 w-4" /> Decline
                    </button>
                  </>
                )}
                {b.status === 'confirmed' && (
                  <button onClick={() => act(b, 'completed')} className="btn bg-ink-900 text-white hover:bg-ink-800 w-full !py-2.5 text-xs dark:bg-white dark:text-ink-950">
                    <FiCheck className="h-4 w-4" /> Mark complete
                  </button>
                )}
                {(b.status === 'completed' || b.status === 'confirmed') && (
                  <button onClick={() => act(b, 'cancelled')} className="btn bg-rose-50 text-rose-600 hover:bg-rose-100 w-auto !py-2.5 text-xs dark:bg-rose-900/20 dark:hover:bg-rose-900/30">
                    <FiX className="h-4 w-4" /> Cancel
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}