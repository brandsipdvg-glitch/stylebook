import { useEffect, useMemo, useState } from 'react'
import { FiPlus, FiTrash2, FiClock, FiCalendar, FiMinus, FiX } from 'react-icons/fi'
import { BarLoader } from '../../components/Loader.jsx'
import BottomSheet from '../../components/BottomSheet.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { useOwnerSalon } from '../../hooks/useOwnerSalon.js'
import { addSlot, removeSlot, toggleSlotAvailability, getSalonSlots, updateSalonOwnerData } from '../../lib/store.js'

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function OwnerSlots() {
  const { salon, loading, reload } = useOwnerSalon()
  const { toast } = useToast()
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [daySlots, setDaySlots] = useState([])
  const [loadingDay, setLoadingDay] = useState(true)
  const [sheet, setSheet] = useState(null) // 'add' | 'holiday'
  const [newTime, setNewTime] = useState('10:00')
  const [open, setOpen] = useState(salon?.openingHours?.open || '09:30')
  const [close, setClose] = useState(salon?.openingHours?.close || '20:30')

  useEffect(() => {
    if (!salon) return
    setOpen(salon.openingHours?.open || '09:30')
    setClose(salon.openingHours?.close || '20:30')
  }, [salon])

  useEffect(() => {
    setLoadingDay(true)
    getSalonSlots(salon?.id || 'salon-1', date, { includeName: false })
      .then((s) => setDaySlots(s))
      .finally(() => setLoadingDay(false))
  }, [salon, date])

  const available = useMemo(() => daySlots.filter((s) => s.available).length, [daySlots])

  const dates = useMemo(() => {
    const arr = []
    for (let i = 0; i < 7; i++) {
      const d = new Date()
      d.setDate(d.getDate() + i)
      arr.push(d.toISOString().slice(0, 10))
    }
    return arr
  }, [])

  const add = async () => {
    await addSlot(salon.id, date, newTime)
    setSheet(null)
    setDaySlots(await getSalonSlots(salon.id, date, { includeName: false }))
    reload()
    toast('Slot added', 'success')
  }

  const remove = async (time) => {
    await removeSlot(salon.id, date, time)
    setDaySlots(await getSalonSlots(salon.id, date, { includeName: false }))
    reload()
    toast('Slot removed', 'info')
  }

  const toggle = async (time, cur) => {
    await toggleSlotAvailability(salon.id, date, time, !cur)
    setDaySlots(await getSalonSlots(salon.id, date, { includeName: false }))
    reload()
  }

  const saveHours = async () => {
    if (!open || !close) return toast('Set valid hours', 'error')
    await updateSalonOwnerData(salon.id, { openingHours: { open, close } })
    setSheet(null)
    reload()
    toast('Working hours updated', 'success')
  }

  const toggleHoliday = async (d) => {
    const days = salon.holidays.includes(d) ? salon.holidays.filter((x) => x !== d) : [...salon.holidays, d]
    await updateSalonOwnerData(salon.id, { holidays: days })
    reload()
    toast(days.includes(d) ? 'Marked as holiday' : 'Holiday removed', 'info')
  }

  if (loading) return <BarLoader />

  return (
    <div className="animate-fade-in">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-ink-900 dark:text-white">Slots</h1>
          <p className="mt-1 text-sm text-ink-500">{available} available · {daySlots.length} total this day</p>
        </div>
        <button onClick={() => setSheet('add')} className="btn-primary !rounded-2xl !px-4 !py-3 text-xs">
          <FiPlus className="h-4 w-4" /> Add slot
        </button>
      </div>

      {/* Date picker */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        {dates.map((d) => {
          const dObj = new Date(d)
          const active = d === date
          return (
            <button key={d} onClick={() => setDate(d)} className={`flex w-[84px] shrink-0 flex-col items-center rounded-3xl bg-white px-2 py-3 ring-1 ring-ink-900/10 transition dark:bg-ink-800 dark:ring-white/10 ${active ? '!bg-brand-600 !ring-brand-600 text-white' : 'text-ink-700 dark:text-ink-200'}`}>
              <span className={`text-[10px] font-bold ${active ? 'text-rose-100' : 'text-ink-400'}`}>{dObj.toLocaleDateString('en-IN', { weekday: 'short' })}</span>
              <span className="text-lg font-extrabold">{dObj.getDate()}</span>
              <span className={`text-[10px] ${active ? 'text-rose-100' : 'text-ink-400'}`}>{dObj.toLocaleDateString('en-IN', { month: 'short' })}</span>
            </button>
          )
        })}
      </div>

      {/* Actions */}
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button onClick={() => setSheet('hours')} className="chip bg-white text-ink-600 ring-1 ring-ink-900/10 dark:bg-ink-800 dark:text-ink-300 dark:ring-white/10">
          <FiClock className="h-4 w-4" /> {salon.openingHours.open}–{salon.openingHours.close}
        </button>
        <button onClick={() => setSheet('holiday')} className="chip bg-white text-ink-600 ring-1 ring-ink-900/10 dark:bg-ink-800 dark:text-ink-300 dark:ring-white/10">
          <FiCalendar className="h-4 w-4" /> {salon.holidays.length ? `${salon.holidays.length} holidays` : 'Manage holidays'}
        </button>
      </div>

      {/* Slot grid */}
      {loadingDay ? (
        <BarLoader />
      ) : (
        <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {daySlots.map((s) => (
            <div key={s.id} className={`relative rounded-2xl p-3 text-center ring-1 transition ${s.available ? 'bg-white text-ink-900 ring-ink-900/10 dark:bg-ink-800 dark:text-ink-100 dark:ring-white/10' : 'bg-ink-50 text-ink-300 ring-ink-900/5 dark:bg-ink-900 dark:text-ink-600'}`}>
              <p className="text-sm font-extrabold">{s.time}</p>
              <p className={`text-[10px] font-semibold ${s.available ? 'text-emerald-500' : 'text-ink-300'}`}>{s.booked ? 'Booked' : s.available ? 'Free' : 'Blocked'}</p>
              <div className="mt-2 flex items-center justify-center gap-1.5">
                <button
                  onClick={() => toggle(s.time, s.available)}
                  disabled={s.booked}
                  className={`flex h-7 w-7 items-center justify-center rounded-lg transition disabled:opacity-30 ${s.available ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-900/30' : 'bg-ink-100 text-ink-400 hover:bg-ink-200 dark:bg-ink-800'}`}
                  aria-label="Toggle availability"
                >
                  {s.available ? <FiMinus className="h-3.5 w-3.5" /> : <FiPlus className="h-3.5 w-3.5" />}
                </button>
                {!s.booked && (
                  <button onClick={() => remove(s.time)} className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-50 text-rose-500 transition hover:bg-rose-100 dark:bg-rose-900/20" aria-label="Remove slot">
                    <FiTrash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add slot sheet */}
      <BottomSheet open={sheet === 'add'} onClose={() => setSheet(null)} title={`Add slot for ${new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`}>
        <div className="space-y-4">
          <div>
            <label className="label">Time</label>
            <input className="input" type="time" step={600} value={newTime} onChange={(e) => setNewTime(e.target.value)} />
          </div>
          <button onClick={add} className="btn-primary w-full"><FiPlus className="h-4 w-4" /> Add this slot</button>
        </div>
      </BottomSheet>

      {/* Working hours sheet */}
      <BottomSheet open={sheet === 'hours'} onClose={() => setSheet(null)} title="Working hours">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Opens</label>
            <input className="input" type="time" value={open} onChange={(e) => setOpen(e.target.value)} />
          </div>
          <div>
            <label className="label">Closes</label>
            <input className="input" type="time" value={close} onChange={(e) => setClose(e.target.value)} />
          </div>
        </div>
        <button onClick={saveHours} className="btn-primary mt-5 w-full">Save hours</button>
      </BottomSheet>

      {/* Holiday sheet */}
      <BottomSheet open={sheet === 'holiday'} onClose={() => setSheet(null)} title="Holiday management">
        <p className="mb-3 text-xs text-ink-500">Mark days as holidays — slots won't be bookable.</p>
        <div className="flex flex-wrap gap-2">
          {weekdays.map((w) => (
            <button key={w} onClick={() => toggleHoliday(w)} className={`chip ${salon.holidays.includes(w) ? 'bg-rose-600 text-white' : 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300'}`}>
              {w} {salon.holidays.includes(w) && <FiX className="h-3.5 w-3.5" />}
            </button>
          ))}
        </div>
      </BottomSheet>
    </div>
  )
}