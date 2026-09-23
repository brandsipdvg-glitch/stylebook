import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { FiArrowLeft, FiHeart, FiMapPin, FiClock, FiCalendar, FiShare2, FiPhone, FiChevronRight, FiScissors, FiStar, FiCheck } from 'react-icons/fi'
import Img from '../../components/Img.jsx'
import Rating from '../../components/Rating.jsx'
import { BarLoader } from '../../components/Loader.jsx'
import { EmptyState } from '../../components/EmptyState.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { getSalon, getSalonSlots, getReviews, toggleFavorite, isFavorite } from '../../lib/store.js'

export default function SalonProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const styleId = params.get('style') || ''
  const { user, isAuthed } = useAuth()
  const { toast } = useToast()
  const [salon, setSalon] = useState(null)
  const [slots, setSlots] = useState([])
  const [reviews, setReviews] = useState([])
  const [fav, setFav] = useState(false)
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('portfolio')
  const [showAllServices, setShowAllServices] = useState(false)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    ;(async () => {
      const s = await getSalon(id)
      setSalon(s)
      if (s) {
        const [sl, rv] = await Promise.all([
          getSalonSlots(s.id, new Date().toISOString().slice(0, 10)),
          getReviews(s.id),
        ])
        setSlots(sl)
        setReviews(rv)
      }
      setLoading(false)
    })()
    window.scrollTo(0, 0)
  }, [id])

  useEffect(() => {
    if (isAuthed && user && salon) isFavorite(user.id, salon.id).then(setFav)
  }, [user, salon, isAuthed])

  // Pre-select the style the user came from so the price bar shows its price
  useEffect(() => {
    if (styleId && salon) {
      const item = salon.portfolio?.find((p) => p.hairstyleId === styleId)
      if (item) setSelected({ ...item, type: 'portfolio', id: item.id })
    }
  }, [salon, styleId])

  const toggle = async () => {
    if (!isAuthed) return toast('Sign in to save salons', 'info')
    const nowFav = await toggleFavorite(user.id, salon.id)
    setFav(nowFav)
    toast(nowFav ? 'Added to favourites' : 'Removed from favourites', nowFav ? 'success' : 'info')
  }

  if (loading) return <BarLoader />
  if (!salon) return <EmptyState title="Salon not found" message="This salon may no longer be accepting bookings." onAction={() => navigate('/salons')} actionLabel="Browse salons" />

  const openSlots = slots.filter((s) => s.available).length

  const selectPortfolio = (p) =>
    setSelected((cur) => (cur && cur.id === p.id && cur.type === 'portfolio' ? null : { ...p, type: 'portfolio', id: p.id }))
  const selectService = (sv) =>
    setSelected((cur) => (cur && cur.id === sv.id && cur.type === 'service' ? null : { ...sv, type: 'service', id: sv.id }))
  const price = selected ? selected.price : salon.startingPrice
  const bookLink = selected?.hairstyleId ? `/book?salon=${salon.id}&style=${selected.hairstyleId}` : `/book?salon=${salon.id}`

  return (
    <div className="pb-28 animate-fade-in">
      {/* Cover */}
      <div className="relative">
        <Img src={salon.cover} alt={salon.name} className="h-[42vh] w-full object-cover" fallbackClass="h-[42vh] w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/10 to-transparent" />
        <div className="absolute left-4 top-14 flex gap-2">
          <Link to={styleId ? `/salons?style=${styleId}` : '/salons'} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink-900 shadow backdrop-blur" aria-label="Back"><FiArrowLeft className="h-5 w-5" /></Link>
        </div>
        <div className="absolute right-4 top-14 flex gap-2">
          <button onClick={toggle} className={`flex h-10 w-10 items-center justify-center rounded-full shadow backdrop-blur ${fav ? 'bg-brand-600 text-white' : 'bg-white/90 text-ink-900'}`} aria-label="Save salon">
            <FiHeart className={`h-5 w-5 ${fav ? 'fill-current' : ''}`} />
          </button>
          <button onClick={() => { navigator.share?.({ title: salon.name, url: window.location.href }).catch(() => {}); toast('Link copied', 'success') }} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink-900 shadow backdrop-blur" aria-label="Share">
            <FiShare2 className="h-5 w-5" />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-5">
          <div className="flex items-center gap-3">
            <img src={salon.logo} alt="" className="h-12 w-12 rounded-2xl bg-white/90 object-cover shadow" />
            <div>
              <h1 className="text-2xl font-black text-white">{salon.name}</h1>
              <p className="flex items-center gap-1 text-xs font-medium text-ink-200">
                <FiMapPin className="h-3.5 w-3.5" /> {salon.address} · {salon.gender === 'unisex' ? 'Unisex' : salon.gender}
              </p>
            </div>
          </div>
          <Rating value={salon.rating} count={salon.reviewsCount} className="rounded-full bg-white/90 px-2.5 py-1 text-ink-900 backdrop-blur" />
        </div>
      </div>

      {/* Body */}
      <div className="container-mx-sm">
        <div className="relative z-10 -mt-5 grid grid-cols-3 gap-2">
          {[
            { l: 'Starts at', v: `₹${salon.startingPrice.toLocaleString('en-IN')}` },
            { l: 'Open slots', v: String(openSlots) },
            { l: 'Services', v: `${salon.services.length}+` },
          ].map((s) => (
            <div key={s.l} className="card flex flex-col items-center justify-center px-2 py-3 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-ink-400">{s.l}</p>
              <p className="text-sm font-extrabold text-ink-900 dark:text-white">{s.v}</p>
            </div>
          ))}
        </div>

        <p className="mt-5 text-sm leading-relaxed text-ink-600 dark:text-ink-300">{salon.description}</p>

        <div className="mt-5 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="chip shrink-0 bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300"><FiClock className="h-4 w-4" /> {salon.openingHours.open}–{salon.openingHours.close}</span>
          <span className="chip shrink-0 bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300"><FiPhone className="h-4 w-4" /> {salon.phone}</span>
          <span className="chip shrink-0 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">✓ Working today</span>
        </div>

        {/* Tabs */}
        <div className="sticky top-[64px] z-30 -mx-1 mt-5 border-b border-ink-900/5 bg-white px-1 dark:bg-ink-950 dark:border-white/5">
          <div className="mx-auto flex max-w-md gap-1">
            {['portfolio', 'services', 'reviews'].map((t) => (
              <button key={t} onClick={() => setTab(t)} className={`flex-1 border-b-2 px-2 py-2.5 text-sm font-bold capitalize transition ${tab === t ? 'border-brand-600 text-brand-600' : 'border-transparent text-ink-400'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio */}
        {tab === 'portfolio' && (
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {salon.portfolio.map((p) => {
              const isSelected = selected?.type === 'portfolio' && selected.id === p.id
              return (
                <button key={p.id} onClick={() => selectPortfolio(p)} className={`group relative overflow-hidden rounded-3xl text-left shadow-card transition hover:-translate-y-1 ${isSelected ? 'ring-2 ring-brand-500' : ''}`}>
                  <Img src={p.image} alt={p.name} className="h-36 w-full object-cover transition duration-500 group-hover:scale-110" fallbackClass="h-36 w-full" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/85 to-transparent p-3">
                    <p className="text-sm font-bold text-white">{p.name}</p>
                    <p className="text-xs font-semibold text-brand-300">₹{p.price.toLocaleString('en-IN')}</p>
                  </div>
                  {isSelected && (
                    <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-white shadow">
                      <FiCheck className="h-4 w-4" strokeWidth={3} />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {/* Services */}
        {tab === 'services' && (
          <div className="mt-5 space-y-3">
            {(showAllServices ? salon.services : salon.services.slice(0, 5)).map((sv) => {
              const isSelected = selected?.type === 'service' && selected.id === sv.id
              return (
                <button key={sv.id} onClick={() => selectService(sv)} className={`card flex w-full items-center gap-3 p-4 text-left transition ${isSelected ? 'ring-2 ring-brand-500' : 'hover:shadow-lift'}`}>
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${isSelected ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-600 dark:bg-brand-900/30'}`}>
                    {isSelected ? <FiCheck className="h-5 w-5" strokeWidth={3} /> : <FiScissors className="h-5 w-5" />}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-ink-900 dark:text-white">{sv.name}</p>
                    <p className="text-xs text-ink-400">{sv.duration} min</p>
                  </div>
                  <p className="text-sm font-extrabold text-ink-900 dark:text-white">₹{sv.price.toLocaleString('en-IN')}</p>
                </button>
              )
            })}
            {salon.services.length > 5 && (
              <button onClick={() => setShowAllServices((v) => !v)} className="w-full text-sm font-bold text-brand-600 hover:underline">
                {showAllServices ? 'Show less' : `Show all ${salon.services.length} services`}
              </button>
            )}
          </div>
        )}

        {/* Reviews */}
        {tab === 'reviews' && (
          <div className="mt-5 space-y-3">
            {reviews.length ? (
              reviews.map((r) => (
                <div key={r.id} className="card p-4">
                  <div className="flex items-center gap-3">
                    <img src={r.userAvatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-ink-900 dark:text-white">{r.userName}</p>
                      <Rating value={r.rating} showValue={false} size="h-3.5 w-3.5" />
                    </div>
                    <span className="text-[10px] font-medium text-ink-400">{new Date(r.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                  </div>
                  <p className="mt-2.5 text-sm leading-relaxed text-ink-600 dark:text-ink-300">{r.text}</p>
                </div>
              ))
            ) : (
              <EmptyState icon={FiStar} title="No reviews yet" message="Be the first to review this salon after your visit!" />
            )}
          </div>
        )}

        {/* Slots preview (also shown in the pinned bar below) */}
        {openSlots > 0 && (
          <Link to={bookLink} className="mt-5 flex items-center justify-between rounded-3xl bg-gradient-to-r from-brand-600 to-brand-700 p-4 text-white shadow-glow">
            <div>
              <p className="text-sm font-bold">Available today</p>
              <p className="text-xs text-rose-100">{openSlots} slots open for booking</p>
            </div>
            <FiChevronRight className="h-5 w-5" />
          </Link>
        )}
      </div>

      {/* Pinned book bar — always visible on every screen */}
      <div className="fixed inset-x-0 bottom-16 z-40 px-4 md:bottom-4">
        <div className="mx-auto max-w-md rounded-3xl bg-white/95 p-2.5 shadow-lift ring-1 ring-ink-900/5 backdrop-blur safe-bottom dark:bg-ink-900 dark:ring-white/10">
          {openSlots > 0 && (
            <Link to={bookLink} className="mb-2 flex items-center justify-between rounded-2xl bg-gradient-to-r from-brand-600 to-brand-700 px-3 py-2 text-white">
              <p className="text-xs font-bold">Available today</p>
              <p className="text-[10px] font-semibold text-rose-100">{openSlots} slots open</p>
            </Link>
          )}
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1 pl-1">
              <p className="truncate text-[11px] text-ink-400">{selected ? selected.name : 'Starting from'}{selected && <button onClick={() => setSelected(null)} className="ml-2 font-bold text-brand-600 hover:underline">Clear</button>}</p>
              <p className="text-lg font-extrabold text-ink-900 dark:text-white">₹{price.toLocaleString('en-IN')}</p>
            </div>
            <Link to={bookLink} className="btn-primary flex-none text-base">
              <FiCalendar className="h-5 w-5" /> Book Appointment
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}