import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiArrowRight, FiCalendar, FiClock, FiHeart, FiScissors, FiMapPin, FiChevronRight, FiStar } from 'react-icons/fi'
import SearchBar from '../../components/SearchBar.jsx'
import HairstyleCard from '../../components/HairstyleCard.jsx'
import SalonCard from '../../components/SalonCard.jsx'
import Rating from '../../components/Rating.jsx'
import { getHairstyles, getSalons, getReviews } from '../../lib/store.js'
import { useGender } from '../../context/GenderContext.jsx'
import { useEffect } from 'react'

const steps = [
  { icon: FiScissors, title: 'Choose Your Style', desc: 'Browse 20+ trending hairstyles and pick the one that suits you.' },
  { icon: FiMapPin, title: 'Pick Your Salon', desc: 'Discover nearby salons that can deliver your exact look.' },
  { icon: FiCalendar, title: 'Book Your Slot', desc: 'Select a date and time that fits your schedule in seconds.' },
  { icon: FiClock, title: 'Skip The Wait', desc: 'Walk in on time, get styled and be out before you know it.' },
]

export default function Home() {
  const navigate = useNavigate()
  const { gender } = useGender()
  const [styles, setStyles] = useState([])
  const [salons, setSalons] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQ, setSearchQ] = useState('')
  const [allSalons, setAllSalons] = useState([])

  useEffect(() => {
    ;(async () => {
      const [s, sl, rMen, rWomen, aSal] = await Promise.all([
        getHairstyles({ popular: true }),
        getSalons({ featured: true }),
        getReviews('salon-1'),
        getReviews('salon-10'),
        getSalons(),
      ])
      setStyles(s.slice(0, 8))
      setSalons(sl.slice(0, 6))
      setReviews({ men: rMen.slice(0, 5), women: rWomen.slice(0, 5) })
      setAllSalons(aSal)
      setLoading(false)
    })()
  }, [])

  const effective = gender === 'all' || !gender ? null : gender
  const hairstyles = styles.filter((h) => (effective ? h.gender === effective : true))
  const salonsForGender = salons.filter((salon) => (effective ? salon.gender === effective || salon.gender === 'unisex' : true))
  const reviewsForGender = effective ? reviews[effective] || [] : (reviews.men || []).concat(reviews.women || [])

  const onSearch = () => navigate(searchQ.trim() ? `/salons?q=${encodeURIComponent(searchQ.trim())}` : '/salons')
  const onKeyDown = (e) => {
    if (e.key === 'Enter') onSearch()
  }

  const q = searchQ.trim().toLowerCase()
  const salonResults = q
    ? allSalons.filter(
        (s) =>
          (effective ? s.gender === effective || s.gender === 'unisex' : true) &&
          (s.name.toLowerCase().includes(q) || s.area.toLowerCase().includes(q) || s.city.toLowerCase().includes(q)),
      )
    : []
  const searching = !!q

  return (
    <div className="animate-fade-in">
      {/* ---- Hero ---- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ink-950 via-ink-900 to-brand-900">
        <div className="pointer-events-none absolute inset-0 bg-grid-fade opacity-20" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-600/40 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="container-mx relative py-14 sm:py-16 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur">
              <FiStar className="h-3.5 w-3.5 text-amber-400" /> 10+ salons · 20+ styles · Booked on StyleBook
            </span>
            <h1 className="text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Choose Your Style.
              <br />
              <span className="bg-gradient-to-r from-brand-300 via-rose-300 to-amber-200 bg-clip-text text-transparent">
                Book Your Slot.
              </span>
              <br />
              Skip The Wait.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink-300">
              Find the perfect hairstyle and instantly book the salon that can deliver that exact look — right in your pocket.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link to="/hairstyles" className="btn flex-1 sm:flex-none">
                <FiScissors className="h-4 w-4" /> Explore Hairstyles
              </Link>
              <Link to="/salons" className="btn bg-white/10 text-white ring-1 ring-white/20 hover:bg-white/20 flex-1 sm:flex-none">
                <FiMapPin className="h-4 w-4" /> Find Salons
              </Link>
            </div>
            <div className="mx-auto mt-8 max-w-lg">
              <SearchBar
                value={searchQ}
                onChange={setSearchQ}
                onKeyDown={onKeyDown}
                placeholder="Search salon name, area or city…"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---- Live salon search results ---- */}
      {searching && (
        <section className="container-mx py-8">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Search results</p>
              <h2 className="mt-1 text-xl font-extrabold text-ink-900 dark:text-white">
                {salonResults.length} salon{salonResults.length !== 1 ? 's' : ''} matching “{searchQ.trim()}”
              </h2>
            </div>
            <button onClick={onSearch} className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:underline">
              View all <FiChevronRight className="h-4 w-4" />
            </button>
          </div>
          {salonResults.length ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {salonResults.map((s) => (
                <SalonCard key={s.id} salon={s} />
              ))}
            </div>
          ) : (
            <div className="card flex flex-col items-center justify-center gap-2 py-14 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink-100 text-ink-400 dark:bg-ink-800">
                <FiMapPin className="h-6 w-6" />
              </span>
              <p className="text-sm font-bold text-ink-900 dark:text-white">No salons found</p>
              <p className="text-xs text-ink-400">Try a different name, area or city.</p>
            </div>
          )}
        </section>
      )}

      {/* ---- Popular Hairstyles ---- */}
      <section className="container-mx py-10 lg:py-14">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Trending now</p>
            <h2 className="mt-1 text-2xl font-extrabold text-ink-900 dark:text-white">Popular Hairstyles</h2>
          </div>
          <Link to="/hairstyles" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:underline">
            View all <FiChevronRight className="h-4 w-4" />
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="card overflow-hidden">
                <div className="skeleton h-44 w-full rounded-none" />
                <div className="space-y-2 p-4">
                  <div className="skeleton h-4 w-2/3" />
                  <div className="skeleton h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {hairstyles.map((s) => (
              <HairstyleCard key={s.id} style={s} popular={s.popular} />
            ))}
          </div>
        )}
      </section>

      {/* ---- Featured Salons ---- */}
      <section className="bg-ink-50/80 py-10 dark:bg-ink-900/40 lg:py-14">
        <div className="container-mx">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Handpicked for you</p>
              <h2 className="mt-1 text-2xl font-extrabold text-ink-900 dark:text-white">Featured Salons</h2>
            </div>
            <Link to="/salons" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:underline">
              View all <FiChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {salonsForGender.map((s) => (
              <SalonCard key={s.id} salon={s} />
            ))}
          </div>
        </div>
      </section>

      {/* ---- How It Works ---- */}
      <section className="container-mx py-10 lg:py-14">
        <div className="mx-auto mb-8 max-w-xl text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Simple by design</p>
          <h2 className="mt-1 text-2xl font-extrabold text-ink-900 dark:text-white">How It Works</h2>
          <p className="mt-2 text-sm text-ink-500">From inspiration to your salon chair in four easy steps.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title} className="card relative p-6 transition hover:-translate-y-1 hover:shadow-lift">
              <span className="absolute right-5 top-5 text-5xl font-black text-ink-100 dark:text-ink-800">{i + 1}</span>
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-900/30">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="relative mt-4 text-base font-bold text-ink-900 dark:text-white">{s.title}</h3>
              <p className="relative mt-1 text-sm leading-relaxed text-ink-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- Reviews ---- */}
      <section className="bg-ink-50/80 py-10 dark:bg-ink-900/40 lg:py-14">
        <div className="container-mx">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Loved by customers</p>
            <h2 className="mt-1 text-2xl font-extrabold text-ink-900 dark:text-white">What Customers Say</h2>
          </div>
          {reviewsForGender.length ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {reviewsForGender.map((r) => (
                <div key={r.id} className="card p-5">
                  <Rating value={r.rating} showValue={false} count={null} size="h-4 w-4" />
                  <p className="mt-3 text-sm leading-relaxed text-ink-700 dark:text-ink-200">“{r.text}”</p>
                  <div className="mt-4 flex items-center gap-2.5">
                    <img src={r.userAvatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-bold text-ink-900 dark:text-white">{r.userName}</p>
                      <p className="text-xs text-ink-400">Verified booking</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="container-mx py-10 lg:py-14">
        <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-brand-600 via-brand-700 to-ink-900 px-6 py-12 text-center shadow-glow sm:px-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
          <h2 className="relative mx-auto max-w-lg text-3xl font-black leading-tight text-white">
            Your best hair day is just a tap away.
          </h2>
          <p className="relative mx-auto mt-3 max-w-md text-sm text-rose-100">
            Browse styles, compare salons and lock in your slot — all before you finish your coffee.
          </p>
          <div className="relative mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link to="/hairstyles" className="btn bg-white text-ink-900 shadow-lg hover:bg-ink-50">
              <FiScissors className="h-4 w-4" /> Browse Styles
            </Link>
            <Link to="/register" className="btn bg-white/10 text-white ring-1 ring-white/25 hover:bg-white/20">
              <FiHeart className="h-4 w-4" /> Join StyleBook <FiArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}