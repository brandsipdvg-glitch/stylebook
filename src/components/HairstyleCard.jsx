import { Link } from 'react-router-dom'
import { FiHeart, FiClock } from 'react-icons/fi'
import Img from './Img.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { toggleFavorite, isFavorite } from '../lib/store.js'
import { useEffect, useState } from 'react'

export default function HairstyleCard({ style, popular }) {
  const { user, isAuthed } = useAuth()
  const { toast } = useToast()
  const [fav, setFav] = useState(false)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (isAuthed && user) isFavorite(user.id, '', style.id).then(setFav)
  }, [user, style.id, isAuthed])

  const toggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthed) return toast('Sign in to save styles', 'info')
    setBusy(true)
    try {
      const nowFav = await toggleFavorite(user.id, style.id, style.id)
      setFav(nowFav)
      toast(nowFav ? 'Saved to favourites' : 'Removed from favourites', nowFav ? 'success' : 'info')
    } finally {
      setBusy(false)
    }
  }

  return (
    <Link
      to={`/hairstyles/${style.id}`}
      className="card group block overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="relative overflow-hidden">
        <Img src={style.image} alt={style.name} className="h-44 w-full object-cover transition duration-500 group-hover:scale-105" fallbackClass="h-44 w-full" />
        {popular && (
          <span className="absolute left-3 top-3 rounded-full bg-brand-600/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur">
            Trending
          </span>
        )}
        <button
          onClick={toggle}
          disabled={busy}
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur transition ${
            fav ? 'bg-brand-600 text-white' : 'bg-white/90 text-ink-700'
          }`}
          aria-label="Save style"
        >
          <FiHeart className={`h-4 w-4 ${fav ? 'fill-current animate-like-pop' : ''}`} />
        </button>
        <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-ink-950/70 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
          <FiClock className="h-3 w-3" /> {style.duration} min
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[15px] font-bold text-ink-900 dark:text-white">{style.name}</h3>
          <span className="shrink-0 text-[11px] font-medium capitalize text-ink-400">{style.gender}</span>
        </div>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-500">{style.description}</p>
        <p className="mt-3 text-sm font-extrabold text-brand-600">
          ₹{style.price.toLocaleString('en-IN')}
          <span className="font-medium text-ink-400"> onwards</span>
        </p>
      </div>
    </Link>
  )
}