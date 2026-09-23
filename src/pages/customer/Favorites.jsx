import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiHeart } from 'react-icons/fi'
import { BarLoader } from '../../components/Loader.jsx'
import { EmptyState } from '../../components/EmptyState.jsx'
import HairstyleCard from '../../components/HairstyleCard.jsx'
import SalonCard from '../../components/SalonCard.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { getFavorites, getSalon, getHairstyle } from '../../lib/store.js'

export default function Favorites() {
  const { user } = useAuth()
  const [salons, setSalons] = useState([])
  const [styles, setStyles] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('all')

  useEffect(() => {
    ;(async () => {
      const favs = user ? await getFavorites(user.id) : []
      const salonFavs = favs.filter((f) => f.type === 'salon')
      const styleFavs = favs.filter((f) => f.type === 'hairstyle' || f.hairstyleId)
      const loadedSalons = (await Promise.all(salonFavs.map((f) => getSalon(f.salonId)))).filter(Boolean)
      const loadedStyles = (await Promise.all(styleFavs.map((f) => getHairstyle(f.hairstyleId)))).filter(Boolean)
      setSalons(loadedSalons)
      setStyles(loadedStyles)
      setLoading(false)
    })()
  }, [user])

  if (loading) return <BarLoader />

  const tabs = [
    { k: 'all', l: `All (${salons.length + styles.length})` },
    { k: 'salons', l: `Salons (${salons.length})` },
    { k: 'styles', l: `Styles (${styles.length})` },
  ]

  return (
    <div className="container-mx py-6 animate-fade-in">
      <h1 className="text-2xl font-extrabold text-ink-900 dark:text-white">Saved</h1>
      <p className="mt-1 text-sm text-ink-500">Your favourite salons and hairstyles, ready when you are.</p>

      <div className="mt-5 flex gap-2">
        {tabs.map((t) => (
          <button key={t.k} onClick={() => setTab(t.k)} className={`chip ${tab === t.k ? 'bg-ink-900 text-white dark:bg-white dark:text-ink-950' : 'bg-white text-ink-600 ring-1 ring-ink-900/10 dark:bg-ink-800 dark:text-ink-300 dark:ring-white/10'}`}>
            {t.l}
          </button>
        ))}
      </div>

      {salons.length + styles.length === 0 ? (
        <EmptyState
          icon={FiHeart}
          title="Nothing saved yet"
          message="Tap the heart on any salon or hairstyle to keep it here."
        >
          <Link to="/hairstyles" className="btn-primary mt-3">Discover styles</Link>
        </EmptyState>
      ) : (
        <div className="mt-5 space-y-8">
          {(tab === 'all' || tab === 'salons') && salons.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink-400">Salons</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {salons.map((s) => <SalonCard key={s.id} salon={s} />)}
              </div>
            </section>
          )}
          {(tab === 'all' || tab === 'styles') && styles.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-ink-400">Hairstyles</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {styles.map((h) => <HairstyleCard key={h.id} style={h} popular={h.popular} />)}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  )
}