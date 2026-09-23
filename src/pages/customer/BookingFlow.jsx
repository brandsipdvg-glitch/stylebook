import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { FiArrowLeft, FiArrowRight, FiCheck, FiChevronDown, FiCalendar, FiMapPin, FiClock, FiScissors, FiShield } from 'react-icons/fi'
import Img from '../../components/Img.jsx'
import Rating from '../../components/Rating.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { useGender } from '../../context/GenderContext.jsx'
import { getHairstyles, getSalons, getSalonSlots, createBooking, getSalon } from '../../lib/store.js'

const steps = ['Style', 'Salon', 'Date', 'Slot', 'Details', 'Done']

function dayLabel(d) {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const same = (a, b) => a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()
  if (same(d, today)) return 'Today'
  if (same(d, tomorrow)) return 'Tomorrow'
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
}

export default function BookingFlow() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { user, isAuthed } = useAuth()
  const { toast } = useToast()
  const { gender: contextGender } = useGender()

  const preselectStyle = params.get('style')
  const preselectSalon = params.get('salon')
  const initialStep = preselectStyle && preselectSalon ? 2 : preselectStyle ? 1 : 0
  const [step, setStep] = useState(initialStep)
  const [styles, setStyles] = useState([])
  const [salons, setSalons] = useState([])
  const [slots, setSlots] = useState([])
  const [dates, setDates] = useState([])

  const [style, setStyle] = useState(params.get('style') ? { id: params.get('style') } : null)
  const [salon, setSalon] = useState(params.get('salon') ? { id: params.get('salon') } : null)
  const [date, setDate] = useState('')
  const [slot, setSlot] = useState(null)
  const [details, setDetails] = useState({ name: '', phone: '' })
  const [confirmed, setConfirmed] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    getHairstyles().then(setStyles)
    getSalons().then(setSalons)
    const arr = []
    for (let i = 0; i < 7; i++) {
      const d = new Date()
      d.setHours(0, 0, 0, 0)
      d.setDate(d.getDate() + i)
      arr.push(d.toISOString().slice(0, 10))
    }
    setDates(arr)
  }, [])

  const fullStyle = useMemo(() => (style?.id ? styles.find((s) => s.id === style.id) : null), [style, styles])
  const fullSalon = useMemo(() => (salon?.id ? salons.find((s) => s.id === salon.id) : null), [salon, salons])

  useEffect(() => {
    if (style?.id && styles.length && !styles.find((s) => s.id === style.id)) {
      // resolve partial preselect
      const found = styles.find((s) => s.id === style.id)
      if (found) setStyle(found)
    }
    if (salon?.id && salons.length && !salons.find((s) => s.id === salon.id)) {
      setSalon(salons.find((s) => s.id === salon.id))
    }
  }, [styles, salons, style, salon])

  useEffect(() => {
    if (fullStyle && styles.length && !styles.find((s) => s.id === fullStyle.id)) {
      getHairstyles().then((r) => setStyles(r))
    }
  }, [fullStyle, styles])

  useEffect(() => {
    if (date && salon?.id) getSalonSlots(salon.id, date).then(setSlots)
  }, [date, salon])

  useEffect(() => {
    if (salon?.id && salons.length && !salons.some((s) => s.id === salon.id)) {
      getSalons().then((r) => setSalons(r))
    }
  }, [salon, salons])

  const salonCanDoStyle = fullSalon?.portfolio?.some((p) => p.hairstyleId === fullStyle?.id)
  const salonCompatible = !fullStyle || salonCanDoStyle

  const filteredSalons = useMemo(() => {
    let rows = salons
    if (contextGender && contextGender !== 'all') rows = rows.filter((s) => s.gender === contextGender || s.gender === 'unisex')
    if (fullStyle?.id) rows = rows.filter((s) => s.portfolio.some((p) => p.hairstyleId === fullStyle.id))
    return rows
  }, [salons, fullStyle, contextGender])

  const pickerStyles = useMemo(() => {
    if (!contextGender || contextGender === 'all') return styles
    return styles.filter((s) => s.gender === contextGender)
  }, [styles, contextGender])

  const price = fullStyle ? Math.min(fullStyle.price, fullSalon?.portfolio?.find((p) => p.hairstyleId === fullStyle.id)?.price ?? Infinity) : fullSalon?.startingPrice || 0

  const next = () => setStep((s) => s + 1)
  const back = () => (step === 0 ? navigate(-1) : setStep((s) => s - 1))

  const canNext =
    (step === 0 && fullStyle) ||
    (step === 1 && fullSalon && salonCompatible) ||
    (step === 2 && date) ||
    (step === 3 && slot) ||
    (step === 4 && details.name.trim() && details.phone.trim())

  const submitBooking = async () => {
    if (!isAuthed) {
      toast('Please sign in to confirm your booking', 'info')
      navigate('/login?next=/book')
      return
    }
    setSubmitting(true)
    try {
      const booking = await createBooking({
        salonId: fullSalon.id,
        salonName: fullSalon.name,
        userId: user.id,
        userName: details.name,
        phone: details.phone,
        hairstyleId: fullStyle?.id,
        hairstyleName: fullStyle?.name || 'Consultation',
        price,
        date,
        slotId: `${fullSalon.id}-${date}-${slot.time.replace(':', '')}`,
        time: slot.time,
        endTime: '',
      })
      setConfirmed(booking)
      next()
      toast('Booking request sent!', 'success')
    } catch (e) {
      toast(e.message || 'Could not create booking', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const StepIndicator = (
    <div className="mx-auto flex max-w-md items-center gap-1">
      {steps.map((s, i) => (
        <div key={s} className="flex flex-1 flex-col items-center gap-1">
          <div className={`h-1.5 w-full rounded-full transition ${i <= step ? 'bg-brand-600' : 'bg-ink-100 dark:bg-ink-800'}`} />
          <span className={`text-[10px] font-semibold ${i <= step ? 'text-brand-600' : 'text-ink-400'}`}>{s}</span>
        </div>
      ))}
    </div>
  )

  // ---------------- CONFIRMATION ----------------
  if (step === 5 && confirmed) {
    return (
      <div className="container-mx-sm flex min-h-[80vh] flex-col items-center justify-center py-10 text-center animate-fade-in">
        <div className="relative">
          <span className="flex h-24 w-24 animate-scale-in items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30">
            <FiCheck className="h-12 w-12" strokeWidth={3} />
          </span>
          <span className="absolute -right-1 -top-1 h-4 w-4 animate-ping rounded-full bg-emerald-400" />
        </div>
        <h1 className="mt-6 text-2xl font-black text-ink-900 dark:text-white">Booking Confirmed!</h1>
        <p className="mt-2 text-sm text-ink-500">Show this to the salon when you arrive. We've notified {confirmed.salonName}.</p>

        <div className="card mt-7 w-full p-5 text-left">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-400">Booking summary</p>
          <div className="mt-3 space-y-3 text-sm">
            <div className="flex items-center gap-3"><FiScissors className="h-4 w-4 text-brand-600" /><span className="flex-1 text-ink-500">Hairstyle</span><span className="font-bold text-ink-900 dark:text-white">{confirmed.hairstyleName}</span></div>
            <div className="flex items-center gap-3"><FiMapPin className="h-4 w-4 text-brand-600" /><span className="flex-1 text-ink-500">Salon</span><span className="font-bold text-ink-900 dark:text-white">{confirmed.salonName}</span></div>
            <div className="flex items-center gap-3"><FiCalendar className="h-4 w-4 text-brand-600" /><span className="flex-1 text-ink-500">Date</span><span className="font-bold text-ink-900 dark:text-white">{new Date(confirmed.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span></div>
            <div className="flex items-center gap-3"><FiClock className="h-4 w-4 text-brand-600" /><span className="flex-1 text-ink-500">Time</span><span className="font-bold text-ink-900 dark:text-white">{confirmed.time}</span></div>
            <div className="flex items-center gap-3 border-t border-ink-900/5 pt-3 dark:border-white/5"><span className="flex-1 text-ink-500">Amount</span><span className="font-extrabold text-brand-600">₹{confirmed.price.toLocaleString('en-IN')}</span></div>
          </div>
        </div>

        <p className="mt-4 flex items-center gap-1.5 text-xs text-ink-400"><FiShield className="h-4 w-4" /> Pay at the salon. Free cancellation up to 2 hours before.</p>

        <div className="mt-6 grid w-full grid-cols-2 gap-3">
          <Link to="/bookings" className="btn-primary w-full">View my bookings</Link>
          <Link to="/" className="btn-ghost w-full">Back home</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container-mx-sm pb-32 animate-fade-in">
      <div className="sticky top-0 z-30 -mx-4 bg-white px-4 py-4 dark:bg-ink-950">
        <div className="mb-3 flex items-center gap-2">
          <button onClick={back} className="flex h-9 w-9 items-center justify-center rounded-2xl bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-200" aria-label="Back"><FiArrowLeft className="h-4 w-4" /></button>
          <h1 className="text-lg font-extrabold text-ink-900 dark:text-white">Book Appointment</h1>
        </div>
        {StepIndicator}
      </div>

      {/* STEP 1 - Style */}
      {step === 0 && (
        <div className="mt-4 space-y-3 animate-slide-up">
          <h2 className="text-sm font-bold text-ink-900 dark:text-white">What would you like styled?</h2>
          {pickerStyles.length === 0 && <p className="py-8 text-center text-sm text-ink-400">No styles for this category yet.</p>}
          {pickerStyles.map((s) => (
            <button key={s.id} onClick={() => { setStyle(s); next() }} className={`card flex w-full items-center gap-3 p-3 text-left transition ${style?.id === s.id ? 'ring-2 ring-brand-500' : 'hover:shadow-lift'}`}>
              <Img src={s.image} alt={s.name} className="h-16 w-16 shrink-0 rounded-2xl object-cover" fallbackClass="h-16 w-16 shrink-0 rounded-2xl" />
              <div className="flex-1">
                <p className="text-sm font-bold text-ink-900 dark:text-white">{s.name}</p>
                <p className="text-xs capitalize text-ink-400">{s.gender} · {s.duration} min</p>
              </div>
              <span className="text-sm font-extrabold text-brand-600">₹{s.price.toLocaleString('en-IN')}</span>
            </button>
          ))}
        </div>
      )}

      {/* STEP 2 - Salon */}
      {step === 1 && (
        <div className="mt-4 space-y-3 animate-slide-up">
          <h2 className="text-sm font-bold text-ink-900 dark:text-white">
            {fullStyle ? <>Salons for <span className="text-brand-600">{fullStyle.name}</span></> : 'Choose a salon'}
          </h2>
          {(salonCanDoStyle === false && fullSalon) ? (
            <button onClick={back} className="w-full rounded-3xl bg-amber-50 p-4 text-left text-sm text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
              {fullSalon.name} doesn't offer {fullStyle.name}. Pick one that does ↓
            </button>
          ) : null}
          {filteredSalons.map((s) => {
            const styleAtSalon = fullStyle ? s.portfolio?.find((p) => p.hairstyleId === fullStyle.id)?.price : null
            const shownPrice = styleAtSalon || s.startingPrice
            return (
              <button key={s.id} onClick={() => { setSalon(s); next() }} className={`card flex w-full items-center gap-3 p-4 text-left transition ${salon?.id === s.id ? 'ring-2 ring-brand-500' : 'hover:shadow-lift'}`}>
                <img src={s.logo} alt="" className="h-14 w-14 shrink-0 rounded-2xl object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-ink-900 dark:text-white">{s.name}</p>
                  <Rating value={s.rating} size="h-3 w-3" className="text-xs" />
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-400"><FiMapPin className="h-3 w-3" /> {s.address}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-extrabold text-brand-600">₹{shownPrice.toLocaleString('en-IN')}</p>
                  {fullStyle && styleAtSalon && <p className="text-[10px] font-medium text-ink-400">{fullStyle.name}</p>}
                </div>
              </button>
            )
          })}
          {!filteredSalons.length && <p className="py-8 text-center text-sm text-ink-400">No salons offer this style yet.</p>}
        </div>
      )}

      {/* STEP 3 - Date */}
      {step === 2 && (
        <div className="mt-4 animate-slide-up">
          <h2 className="text-sm font-bold text-ink-900 dark:text-white">Pick a day</h2>
          <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
            {dates.map((d) => {
              const dObj = new Date(d)
              const active = date === d
              const isToday = d === new Date().toISOString().slice(0, 10)
              return (
                <button key={d} onClick={() => { setDate(d); setSlot(null) }} className={`flex w-[76px] shrink-0 flex-col items-center gap-1 rounded-3xl px-3 py-4 transition ${active ? 'bg-brand-600 text-white shadow-glow' : 'bg-white text-ink-700 ring-1 ring-ink-900/10 dark:bg-ink-800 dark:text-ink-200 dark:ring-white/10'}`}>
                  <span className={`text-[11px] font-bold ${active ? 'text-rose-100' : 'text-ink-400'}`}>{dayLabel(dObj)}</span>
                  <span className="text-xl font-extrabold">{dObj.getDate()}</span>
                  <span className={`text-[10px] ${active ? 'text-rose-100' : 'text-ink-400'}`}>{dObj.toLocaleDateString('en-IN', { month: 'short' })}</span>
                  {isToday && <span className="text-[9px]">•</span>}
                </button>
              )
            })}
          </div>
          {date && (
            <div className="mt-4">
              <p className="mb-2 text-sm font-bold text-ink-900 dark:text-white">Available slots</p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {slots.filter((s) => s.available).length === 0 && <p className="col-span-full py-6 text-center text-sm text-ink-400">No slots left that day.</p>}
                {slots.filter((s) => s.available).map((s) => {
                  const on = slot?.id === s.id
                  const past = date === new Date().toISOString().slice(0, 10) && s.time < new Date().toTimeString().slice(0, 5)
                  return (
                    <button key={s.id} disabled={past || !s.available} onClick={() => { setSlot(s); next() }} className={`flex items-center justify-center gap-1 rounded-2xl px-3 py-3 text-sm font-bold transition ${on ? 'bg-brand-600 text-white shadow-glow' : 'bg-white text-ink-700 ring-1 ring-ink-900/10 dark:bg-ink-800 dark:text-ink-200 dark:ring-white/10'} ${(past || !s.available) ? 'opacity-30' : ''}`}>
                      <FiClock className="h-3.5 w-3.5" /> {s.time}
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* STEP 3.5 - slot is part of step 3 combined */}
      {step === 3 && (
        <div className="mt-4 animate-slide-up">
          <h2 className="text-sm font-bold text-ink-900 dark:text-white">Confirm your slot</h2>
          <div className="card mt-3 p-4">
            <div className="flex items-center gap-3">
              <img src={fullSalon?.logo} alt="" className="h-12 w-12 rounded-2xl object-cover" />
              <div className="flex-1">
                <p className="text-sm font-bold text-ink-900 dark:text-white">{fullSalon?.name}</p>
                <p className="text-xs text-ink-400">{fullStyle?.name} · {date ? new Date(date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' }) : ''}</p>
              </div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {slots.filter((s) => s.available).map((s) => {
              const on = slot?.id === s.id
              const past = date === new Date().toISOString().slice(0, 10) && s.time < new Date().toTimeString().slice(0, 5)
              return (
                <button key={s.id} disabled={past} onClick={() => setSlot(s)} className={`flex items-center justify-center gap-1 rounded-2xl px-3 py-3 text-sm font-bold transition ${on ? 'bg-brand-600 text-white shadow-glow' : 'bg-white text-ink-700 ring-1 ring-ink-900/10 dark:bg-ink-800 dark:text-ink-200 dark:ring-white/10'} ${past ? 'opacity-30' : ''}`}>
                  <FiClock className="h-3.5 w-3.5" /> {s.time}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* STEP 4 - Details */}
      {step === 4 && (
        <div className="mt-4 space-y-4 animate-slide-up">
          <h2 className="text-sm font-bold text-ink-900 dark:text-white">Your details</h2>
          <div>
            <label className="label">Full name</label>
            <input className="input" placeholder="e.g. Arjun Mehta" value={details.name} onChange={(e) => setDetails((d) => ({ ...d, name: e.target.value }))} />
          </div>
          <div>
            <label className="label">Phone number</label>
            <input className="input" placeholder="10-digit mobile number" inputMode="numeric" maxLength={10} value={details.phone} onChange={(e) => setDetails((d) => ({ ...d, phone: e.target.value.replace(/\D/g, '') }))} />
          </div>
          <div className="card flex items-center gap-3 p-4">
            <FiMapPin className="h-5 w-5 shrink-0 text-brand-600" />
            <div>
              <p className="text-sm font-bold text-ink-900 dark:text-white">{fullSalon?.name}</p>
              <p className="text-xs text-ink-400">{fullSalon?.address}</p>
            </div>
          </div>
          {!isAuthed && (
            <p className="rounded-2xl bg-amber-50 p-3 text-xs font-medium text-amber-700 dark:bg-amber-900/20 dark:text-amber-300">
              You'll be asked to sign in before confirming.
            </p>
          )}
        </div>
      )}

      {/* Bottom bar */}
      <div className="fixed inset-x-0 bottom-16 z-40 px-4 md:bottom-4">
        <div className="mx-auto flex max-w-md items-center gap-3 rounded-3xl bg-white/95 p-2.5 shadow-lift ring-1 ring-ink-900/5 backdrop-blur safe-bottom dark:bg-ink-900 dark:ring-white/10">
          <div className="flex-1 px-2">
            <p className="text-[11px] text-ink-400">{step === 4 ? 'Total' : 'Estimated'}</p>
            <p className="text-lg font-extrabold text-ink-900 dark:text-white">₹{price ? price.toLocaleString('en-IN') : '—'}</p>
          </div>
          {step < 4 ? (
            <button onClick={next} disabled={!canNext} className="btn-primary flex-none text-base">
              Continue <FiArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button onClick={submitBooking} disabled={!canNext || submitting} className="btn-primary flex-none text-base">
              {submitting ? 'Booking…' : 'Confirm booking'} <FiCheck className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}