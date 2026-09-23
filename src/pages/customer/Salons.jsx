import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiSliders, FiMapPin } from 'react-icons/fi'
import SearchBar from '../../components/SearchBar.jsx'
import SalonCard from '../../components/SalonCard.jsx'
import BottomSheet from '../../components/BottomSheet.jsx'
import { EmptyState } from '../../components/EmptyState.jsx'
import { ScreenSkeleton } from '../../components/Skeleton.jsx'
import { getSalons, getHairstyle } from '../../lib/store.js'
import { useGender } from '../../context/GenderContext.jsx'

const serviceOptions = ['Haircut', 'Beard Styling', 'Hair Colour', 'Facial', 'Spa', 'Keratin']

export default function Salons() {
  const [params] = useSearchParams()
  const { gender: contextGender } = useGender()
  const [q, setQ] = useState(params.get('q') || '')
  const [sort, setSort] = useState('popular')
  const [minRating, setMinRating] = useState(0)
  const [gender, setGender] = useState(contextGender === 'all' ? 'all' : contextGender || 'all')
  const [services, setServices] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [list, setList] = useState([])
  const [styleName, setStyleName] = useState('')
  const [loading, setLoading] = useState(true)
  const [sheetOpen, setSheetOpen] = useState(false)

  useEffect(() => {
    setGender(contextGender === 'all' ? 'all' : contextGender || 'all')
  }, [contextGender])

  useEffect(() => {
    setQ(params.get('q') || '')
  }, [params])

  const styleId = params.get('style') || ''

  useEffect(() => {
    ;(async () => {
      let rows = await getSalons()
      if (styleId) {
        rows = rows.filter((s) => s.portfolio.some((p) => p.hairstyleId === styleId))
        const st = await getHairstyle(styleId)
        if (st) setStyleName(st.name)
      }
      setList(rows)
      setLoading(false)
    })()
  }, [styleId])

  const filtered = useMemo(() => {
    let rows = list
    if (q) {
      const query = q.toLowerCase()
      rows = rows.filter((s) => s.name.toLowerCase().includes(query) || s.area.toLowerCase().includes(query) || s.city.toLowerCase().includes(query))
    }
    if (gender !== 'all') rows = rows.filter((s) => s.gender === gender || s.gender === 'unisex')
    if (minRating) rows = rows.filter((s) => s.rating >= minRating)
    if (services.length) rows = rows.filter((s) => services.every((sv) => s.services.some((x) => x.name === sv)))
    if (sort === 'rating') rows.sort((a, b) => b.rating - a.rating)
    else if (sort === 'price') rows.sort((a, b) => a.startingPrice - b.startingPrice)
    else if (sort === 'popular') rows.sort((a, b) => b.popular - a.popular)
    return rows
  }, [list, q, gender, minRating, services, sort])

  const toggleService = (sv) =>
    setServices((prev) => (prev.includes(sv) ? prev.filter((x) => x !== sv) : [...prev, sv]))

  const reset = () => {
    setQ('')
    setMinRating(0)
    setGender('all')
    setServices([])
    setSort('popular')
  }

  const activeFilterCount = (gender !== 'all' ? 1 : 0) + (minRating ? 1 : 0) + services.length

  const FilterPanel = (
    <div className="space-y-6">
      <div>
        <p className="label">Gender</p>
        <div className="flex gap-2">
          {[
            { k: 'all', l: 'All' },
            { k: 'men', l: 'Men' },
            { k: 'women', l: 'Women' },
            { k: 'unisex', l: 'Unisex' },
          ].map((o) => (
            <button key={o.k} onClick={() => setGender(o.k)} className={`chip flex-1 ${gender === o.k ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-950' : 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300'}`}>
              {o.l}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="label">Minimum rating</p>
        <div className="flex gap-2">
          {[0, 4.0, 4.3, 4.5, 4.8].map((r) => (
            <button key={r} onClick={() => setMinRating(r)} className={`chip flex-1 ${minRating === r ? 'bg-amber-400 text-ink-950' : 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300'}`}>
              {r === 0 ? 'Any' : `★ ${r}+`}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="label">Services</p>
        <div className="flex flex-wrap gap-2">
          {serviceOptions.map((sv) => (
            <button key={sv} onClick={() => toggleService(sv)} className={`chip ${services.includes(sv) ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300'}`}>
              {sv}
            </button>
          ))}
        </div>
      </div>
      <div>
        <p className="label">Sort by</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { k: 'popular', l: 'Popularity' },
            { k: 'rating', l: 'Top rated' },
            { k: 'price', l: 'Price' },
          ].map((o) => (
            <button key={o.k} onClick={() => setSort(o.k)} className={`chip ${sort === o.k ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-950' : 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300'}`}>
              {o.l}
            </button>
          ))}
        </div>
      </div>
      <button onClick={() => setSheetOpen(false)} className="btn-primary w-full">Apply filters</button>
    </div>
  )

  return (
    <div className="container-mx py-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-ink-900 dark:text-white">Nearby Salons</h1>
        <p className="mt-1 text-sm text-ink-500">
          {styleName ? `Salons offering ${styleName}` : 'Stores ready for your next visit — book in seconds.'}
        </p>
      </div>

      <div className="mb-6 flex items-center gap-2">
        <div className="flex-1">
          <SearchBar value={q} onChange={setQ} onFocus={() => setShowFilters(true)} placeholder="Search salons, area or city…" />
          {showFilters && q && (
            <div className="mt-1 rounded-2xl bg-white p-3 shadow-lift ring-1 ring-ink-900/5 dark:bg-ink-900 animate-scale-in">
              <p className="px-1 text-xs font-semibold text-ink-500">Searching for “{q}” · {filtered.length} result{filtered.length !== 1 ? 's' : ''}</p>
            </div>
          )}
        </div>
        <button onClick={() => setSheetOpen(true)} className="relative flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-2xl bg-white text-ink-700 ring-1 ring-ink-900/10 transition hover:bg-ink-50 dark:bg-ink-800 dark:text-ink-200 dark:ring-white/10">
          <FiSliders className="h-5 w-5" />
          {activeFilterCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      <div className="mb-5 flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-ink-500">
          <FiMapPin className="h-4 w-4 text-brand-600" /> {filtered.length} salons near you
        </p>
        <button onClick={() => setSheetOpen(true)} className="text-xs font-bold text-brand-600 hover:underline">
          {activeFilterCount ? `Filters · ${activeFilterCount}` : 'Filters'}
        </button>
      </div>

      {loading ? (
        <ScreenSkeleton />
      ) : filtered.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <SalonCard key={s.id} salon={s} styleId={styleId || undefined} styleName={styleName || undefined} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={FiMapPin}
          title="No salons matched"
          message="Try removing a filter or searching for a different area."
          onAction={reset}
        />
      )}

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Filter & sort salons" wide>
        {FilterPanel}
      </BottomSheet>
    </div>
  )
}