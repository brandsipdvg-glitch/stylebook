import { useEffect, useState } from 'react'
import { FiStar, FiSearch } from 'react-icons/fi'
import Img from '../../components/Img.jsx'
import { BarLoader } from '../../components/Loader.jsx'
import { EmptyState } from '../../components/EmptyState.jsx'
import { getHairstyles } from '../../lib/store.js'

export default function AdminHairstyles() {
  const [styles, setStyles] = useState([])
  const [loading, setLoading] = useState(true)
  const [gender, setGender] = useState('all')
  const [query, setQuery] = useState('')

  useEffect(() => {
    getHairstyles().then((r) => {
      setStyles(r)
      setLoading(false)
    })
  }, [])

  if (loading) return <BarLoader />

  const list = styles
    .filter((h) => (gender === 'all' ? true : h.gender === gender))
    .filter((h) => h.name.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="animate-fade-in">
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold text-ink-900 dark:text-white">Hairstyles</h1>
        <p className="mt-1 text-sm text-ink-500">{styles.length} catalogued styles across the platform</p>
      </div>

      <div className="no-scrollbar mb-4 flex gap-2 overflow-x-auto">
        {['all', 'men', 'women'].map((g) => (
          <button key={g} onClick={() => setGender(g)} className={`chip ${gender === g ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-950' : 'bg-white text-ink-600 ring-1 ring-ink-900/10 dark:bg-ink-800 dark:text-ink-300 dark:ring-white/10'}`}>
            {g}
          </button>
        ))}
      </div>

      <div className="mb-4 max-w-md">
        <div className="relative">
          <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input className="input pl-11" placeholder="Search hairstyles…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      {list.length ? (
        <div className="card p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((h) => (
              <div key={h.id} className="flex items-center gap-3 rounded-2xl bg-ink-50/60 p-3 dark:bg-ink-800/60">
                <Img src={h.image} alt={h.name} className="h-14 w-14 shrink-0 rounded-xl object-cover" fallbackClass="h-14 w-14 shrink-0 rounded-xl" />
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 text-sm font-bold text-ink-900 dark:text-white">
                    {h.name}
                    {h.popular && <FiStar className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
                  </p>
                  <p className="text-xs capitalize text-ink-400">{h.gender} · {h.duration} min</p>
                </div>
                <p className="text-sm font-extrabold text-brand-600">₹{h.price.toLocaleString('en-IN')}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <EmptyState icon={FiSearch} title="No styles found" message="Try a different search." />
      )}
    </div>
  )
}