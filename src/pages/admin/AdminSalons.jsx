import { useEffect, useState } from 'react'
import { FiStar, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi'
import Rating from '../../components/Rating.jsx'
import { BarLoader } from '../../components/Loader.jsx'
import { EmptyState } from '../../components/EmptyState.jsx'
import BottomSheet from '../../components/BottomSheet.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { getSalons, deleteSalon, setSalonFeatured, upsertSalon } from '../../lib/store.js'

export default function AdminSalons() {
  const { toast } = useToast()
  const [salons, setSalons] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', address: '', phone: '', cover: '' })

  const load = async () => {
    setSalons(await getSalons())
    setLoading(false)
  }
  useEffect(() => {
    load()
  }, [])

  const list = salons.filter((s) => `${s.name} ${s.area} ${s.city}`.toLowerCase().includes(query.toLowerCase()))

  const toggleFeatured = async (s, v) => {
    await setSalonFeatured(s.id, v)
    toast(v ? `${s.name} featured` : 'Removed from featured', 'success')
    load()
  }

  const remove = async (s) => {
    if (!window.confirm(`Delete "${s.name}"? This cannot be undone.`)) return
    await deleteSalon(s.id)
    toast('Salon deleted', 'info')
    load()
  }

  const addSalon = async (e) => {
    e.preventDefault()
    if (!form.name) return toast('Name required', 'error')
    await upsertSalon({ ...form, rating: 4.0, reviewsCount: 0, gender: 'unisex', featured: false, verified: true, services: [], portfolio: [], openingHours: { open: '09:30', close: '20:30' }, startingPrice: 200, priceIndex: '$' })
    setOpen(false)
    setForm({ name: '', description: '', address: '', phone: '', cover: '' })
    toast('Salon created', 'success')
    load()
  }

  if (loading) return <BarLoader />

  return (
    <div className="animate-fade-in">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl font-extrabold text-ink-900 dark:text-white">Salons</h1>
          <p className="mt-1 text-sm text-ink-500">{salons.length} on the platform</p>
        </div>
        <button onClick={() => setOpen(true)} className="btn-primary !rounded-2xl !px-4 !py-3 text-xs">
          <FiPlus className="h-4 w-4" /> Add salon
        </button>
      </div>

      <div className="mb-4 max-w-md">
        <div className="relative">
          <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input className="input pl-11" placeholder="Search salons…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      {list.length ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-ink-900/5 bg-ink-50 text-[11px] font-bold uppercase tracking-wider text-ink-400 dark:border-white/5 dark:bg-ink-800">
                <tr>
                  <th className="px-4 py-3">Salon</th>
                  <th className="px-4 py-3">Rating</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-900/5 dark:divide-white/5">
                {list.map((s) => (
                  <tr key={s.id} className="transition hover:bg-ink-50/60 dark:hover:bg-ink-800/40">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={s.logo} alt="" className="h-10 w-10 rounded-xl object-cover" />
                        <div>
                          <p className="font-bold text-ink-900 dark:text-white">{s.name}</p>
                          <p className="text-xs text-ink-400">{s.address}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><Rating value={s.rating} size="h-3.5 w-3.5" className="text-xs" /></td>
                    <td className="px-4 py-3 font-semibold text-ink-700 dark:text-ink-200">₹{s.startingPrice.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleFeatured(s, !s.featured)} className={`chip text-[10px] ${s.featured ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-ink-100 text-ink-500 dark:bg-ink-800'}`}>
                        <FiStar className={`h-3 w-3 ${s.featured ? 'fill-current' : ''}`} /> {s.featured ? 'Featured' : 'Regular'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => remove(s)} className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-ink-400 transition hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-900/20" aria-label="Delete salon">
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState icon={FiSearch} title="No salons found" message="Try another search or create a new salon." />
      )}

      <BottomSheet open={open} onClose={() => setOpen(false)} title="Add salon">
        <form onSubmit={addSalon} className="space-y-4">
          <input className="input" placeholder="Salon name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          <input className="input" placeholder="Address (e.g. HSR Layout, Bengaluru)" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
          <textarea className="input min-h-[90px] resize-none" placeholder="Short description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          <div className="grid grid-cols-2 gap-3">
            <input className="input" placeholder="Phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
            <input className="input" placeholder="Cover image URL" value={form.cover} onChange={(e) => setForm((f) => ({ ...f, cover: e.target.value }))} />
          </div>
          <button type="submit" className="btn-primary w-full">Create salon</button>
        </form>
      </BottomSheet>
    </div>
  )
}