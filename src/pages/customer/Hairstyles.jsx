import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiLayout, FiHeart } from 'react-icons/fi'
import SearchBar from '../../components/SearchBar.jsx'
import HairstyleCard from '../../components/HairstyleCard.jsx'
import { EmptyState } from '../../components/EmptyState.jsx'
import { ScreenSkeleton } from '../../components/Skeleton.jsx'
import { getHairstyles } from '../../lib/store.js'
import { useGender } from '../../context/GenderContext.jsx'

const filters = [
  { key: 'all', label: 'All Styles', icon: FiLayout },
  { key: 'men', label: 'Men', icon: FiLayout },
  { key: 'women', label: 'Women', icon: FiHeart },
]

export default function Hairstyles() {
  const [params] = useSearchParams()
  const { gender: contextGender } = useGender()
  const [q, setQ] = useState(params.get('q') || '')
  const [gender, setGender] = useState(contextGender || 'all')
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setGender(contextGender || 'all')
  }, [contextGender])

  useEffect(() => {
    getHairstyles().then((rows) => {
      setList(rows)
      setLoading(false)
    })
  }, [])

  const filtered = useMemo(() => {
    let rows = list
    if (gender !== 'all') rows = list.filter((h) => h.gender === gender)
    return rows
  }, [list, gender])

  // live search from the input
  const searched = useMemo(() => {
    return filtered.filter((h) => h.name.toLowerCase().includes(q.toLowerCase()))
  }, [filtered, q])

  const reset = () => {
    setQ('')
    setGender('all')
  }

  return (
    <div className="container-mx py-6 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-ink-900 dark:text-white">Hairstyles</h1>
        <p className="mt-1 text-sm text-ink-500">Find the style you love, then book a salon that does it best.</p>
      </div>

      <div className="mb-5 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setGender(f.key)}
            className={`chip shrink-0 ${gender === f.key ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-950' : 'bg-white text-ink-600 ring-1 ring-ink-900/10 dark:bg-ink-800 dark:text-ink-300 dark:ring-white/10'}`}
          >
            <f.icon className="h-4 w-4" />
            {f.label}
          </button>
        ))}
      </div>

      <div className="mb-8 max-w-md">
        <SearchBar value={q} onChange={setQ} placeholder="Search hairstyles…" />
      </div>

      {loading ? (
        <ScreenSkeleton />
      ) : searched.length ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {searched.map((h) => (
            <HairstyleCard key={h.id} style={h} popular={h.popular} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No styles found"
          message="We couldn't find anything matching your search. Try a different name or reset filters."
          onAction={reset}
        />
      )}
    </div>
  )
}