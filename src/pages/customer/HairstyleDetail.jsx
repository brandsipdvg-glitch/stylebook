import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FiArrowLeft, FiClock, FiScissors, FiStar, FiCalendar, FiChevronRight } from 'react-icons/fi'
import Img from '../../components/Img.jsx'
import Rating from '../../components/Rating.jsx'
import SalonCard from '../../components/SalonCard.jsx'
import { BarLoader } from '../../components/Loader.jsx'
import { EmptyState } from '../../components/EmptyState.jsx'
import { getHairstyle, getSalonsForHairstyle } from '../../lib/store.js'

export default function HairstyleDetail() {
  const { id } = useParams()
  const [style, setStyle] = useState(null)
  const [salons, setSalons] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const s = await getHairstyle(id)
      setStyle(s)
      if (s) setSalons(await getSalonsForHairstyle(s.id))
      setLoading(false)
    })()
    window.scrollTo(0, 0)
  }, [id])

  if (loading) return <BarLoader />
  if (!style)
    return <EmptyState title="Style not found" message="This hairstyle may have been removed." onAction={() => (window.location.hash = '#/hairstyles')} actionLabel="Browse hairstyles" />

  // Cheapest price actually charged by salons offering this style
  const salonsForStyle = salons.filter((s) => s.portfolio?.some((p) => p.hairstyleId === style.id))
  const cheapestSalon = salonsForStyle.reduce((best, s) => {
    const p = s.portfolio.find((x) => x.hairstyleId === style.id)?.price
    if (p != null && (best.min == null || p < best.min)) return { salon: s, min: p }
    return best
  }, { salon: null, min: null })
  const cheapest = cheapestSalon.salon ? cheapestSalon.min : style.price
  const bookLink = cheapestSalon.salon
    ? `/book?style=${style.id}&salon=${cheapestSalon.salon.id}`
    : `/book?style=${style.id}`

  return (
    <div className="pb-28 animate-fade-in dark:bg-ink-950">
      {/* Hero image */}
      <div className="relative">
        <Img src={style.image} alt={style.name} className="h-[46vh] w-full object-cover" fallbackClass="h-[46vh] w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-ink-950/20 to-transparent" />
        <Link to="/hairstyles" className="absolute left-4 top-14 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-ink-900 shadow backdrop-blur" aria-label="Back">
          <FiArrowLeft className="h-5 w-5" />
        </Link>
        <div className="absolute bottom-0 left-0 right-0 p-5">
          {style.popular && (
            <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-amber-400 px-2.5 py-1 text-xs font-bold text-ink-950">
              <FiStar className="h-3.5 w-3.5 fill-current" /> Trending
            </span>
          )}
          <h1 className="text-3xl font-black text-white">{style.name}</h1>
          <p className="mt-1 text-sm font-medium capitalize text-ink-200">For {style.gender} · {style.tags.join(' · ')}</p>
        </div>
      </div>

      {/* Info */}
      <div className="container-mx-sm relative z-10 -mt-6">
        <div className="card flex items-center justify-between p-5">
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">Starting from</p>
            <p className="text-lg font-extrabold text-ink-900 dark:text-white">₹{cheapest.toLocaleString('en-IN')}<span className="text-xs font-medium text-ink-400"> at {salonsForStyle.length} salon{salonsForStyle.length !== 1 ? 's' : ''}</span></p>
          </div>
          <div className="h-10 w-px bg-ink-100 dark:bg-ink-800" />
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">Duration</p>
            <p className="flex items-center gap-1 text-lg font-extrabold text-ink-900 dark:text-white">
              <FiClock className="h-4 w-4 text-brand-600" /> {style.duration}<span className="text-xs font-medium text-ink-400">min</span>
            </p>
          </div>
          <div className="h-10 w-px bg-ink-100 dark:bg-ink-800" />
          <div className="text-center">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">Rating</p>
            <Rating value={4.5} size="h-4 w-4" />
          </div>
        </div>

        <div className="mt-4">
          <h2 className="text-lg font-extrabold text-ink-900 dark:text-white">About this style</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-600 dark:text-ink-300">{style.description}</p>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-ink-900 dark:text-white">Recommended Salons</h2>
            <Link to={`/salons?style=${style.id}`} className="inline-flex items-center text-sm font-semibold text-brand-600 hover:underline">
              See all <FiChevronRight className="h-4 w-4" />
            </Link>
          </div>
          {salons.length ? (
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {salonsForStyle.map((s) => (
                <SalonCard key={s.id} salon={s} styleId={style.id} styleName={style.name} />
              ))}
            </div>
          ) : (
            <EmptyState icon={FiScissors} title="No salons yet" message="Salons offering this style will appear here soon." />
          )}
        </div>

        {/* Always-visible book bar */}
        <div className="fixed inset-x-0 bottom-4 z-40 px-4">
          <Link
            to={bookLink}
            className="btn-primary flex w-full items-center justify-center gap-2 !py-4 text-base shadow-glow"
          >
            <FiCalendar className="h-5 w-5" /> Book {style.name} at {cheapestSalon.salon ? cheapestSalon.salon.name : 'a salon'} · ₹{cheapest.toLocaleString('en-IN')}
          </Link>
        </div>
      </div>
    </div>
  )
}