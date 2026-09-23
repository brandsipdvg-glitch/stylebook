import { Link } from 'react-router-dom'
import { FiHeart, FiMapPin, FiClock } from 'react-icons/fi'
import Img from './Img.jsx'
import Rating from './Rating.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { toggleFavorite, isFavorite, getSalonSlots } from '../lib/store.js'
import { useEffect, useState } from 'react'

export default function SalonCard({ salon, distance, styleId, styleName }) {
  const { user, isAuthed } = useAuth()
  const { toast } = useToast()
  const [fav, setFav] = useState(false)
  const [slotsLeft, setSlotsLeft] = useState(null)
  const [busy, setBusy] = useState(false)

  const styleItem = styleId ? salon.portfolio?.find((p) => p.hairstyleId === styleId) : null
  const displayPrice = styleItem?.price || salon.startingPrice

  useEffect(() => {
    if (isAuthed && user) isFavorite(user.id, salon.id).then(setFav)
  }, [user, salon.id, isAuthed])

  useEffect(() => {
    getSalonSlots(salon.id, new Date().toISOString().slice(0, 10))
      .then((slots) => setSlotsLeft(slots.filter((s) => s.available).length))
      .catch(() => {})
  }, [salon.id])

  const toggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthed) return toast('Sign in to save salons', 'info')
    setBusy(true)
    try {
      const nowFav = await toggleFavorite(user.id, salon.id)
      setFav(nowFav)
      toast(nowFav ? 'Saved to favourites' : 'Removed from favourites', nowFav ? 'success' : 'info')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Link
      to={styleId ? `/salons/${salon.id}?style=${styleId}` : `/salons/${salon.id}`}
      className="card group block overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative overflow-hidden">
        <Img src={salon.cover} alt={salon.name} className="h-44 w-full object-cover transition duration-500 group-hover:scale-105" fallbackClass="h-44 w-full" />
        {salon.verified && (
          <span className="absolute left-3 top-3 rounded-full bg-ink-950/70 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
            ✓ Verified
          </span>
        )}
        {salon.featured && (
          <span className="absolute bottom-3 left-3 rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-bold text-ink-950">
            ⭐ Featured
          </span>
        )}
        <button
          onClick={toggle}
          disabled={busy}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur transition ${
            fav ? 'bg-brand-600 text-white' : 'bg-white/90 text-ink-700'
          }`}
          aria-label="Save salon"
        >
          <FiHeart className={`h-4 w-4 ${fav ? 'fill-current animate-like-pop' : ''}`} />
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-[15px] font-bold text-ink-900 dark:text-white">{salon.name}</h3>
          <Rating value={salon.rating} size="h-3 w-3" />
        </div>
        <p className="mt-1 flex items-center gap-1 text-xs text-ink-500">
          <FiMapPin className="h-3.5 w-3.5 shrink-0 text-ink-400" />
          <span className="truncate">{salon.address}</span>
          {distance != null && <span className="shrink-0 font-semibold text-brand-600"> · {distance} km</span>}
        </p>
        <div className="mt-3 flex items-center justify-between border-t border-ink-900/5 pt-3 dark:border-white/5">
          <div className="min-w-0">
            <p className="text-sm font-extrabold text-ink-900 dark:text-white">
              ₹{displayPrice.toLocaleString('en-IN')}
            </p>
            <p className="truncate text-[10px] font-medium text-ink-400">
              {styleItem ? (styleName ? `${styleName} price` : 'for this style') : 'starting price'}
            </p>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            <FiClock className="h-3 w-3" />
            {slotsLeft != null ? `${slotsLeft} slots` : '…'}
          </span>
        </div>
      </div>
    </Link>
  )
}