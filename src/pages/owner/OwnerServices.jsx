import { useState } from 'react'
import { FiPlus, FiTrash2, FiScissors } from 'react-icons/fi'
import { BarLoader } from '../../components/Loader.jsx'
import BottomSheet from '../../components/BottomSheet.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { useOwnerSalon } from '../../hooks/useOwnerSalon.js'
import { updateSalonOwnerData } from '../../lib/store.js'

const quickServices = ['Haircut', 'Beard Styling', 'Hair Colour', 'Facial', 'Spa', 'Keratin', 'Other Services']

export default function OwnerServices() {
  const { salon, loading, reload } = useOwnerSalon()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ name: '', price: '', duration: '' })

  if (loading) return <BarLoader />

  const add = async (e) => {
    e.preventDefault()
    if (!form.name || !form.price) return toast('Fill name and price', 'error')
    const services = [...salon.services, {
      id: 'svc-' + Date.now(),
      name: form.name,
      price: Number(form.price),
      duration: Number(form.duration || 30),
    }]
    await updateSalonOwnerData(salon.id, { services })
    setOpen(false)
    setForm({ name: '', price: '', duration: '' })
    reload()
    toast('Service added', 'success')
  }

  const remove = async (id) => {
    await updateSalonOwnerData(salon.id, { services: salon.services.filter((s) => s.id !== id) })
    reload()
    toast('Service removed', 'info')
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-ink-900 dark:text-white">Services</h1>
          <p className="mt-1 text-sm text-ink-500">{salon.name} · {salon.services.length} services</p>
        </div>
        <button onClick={() => setOpen(true)} className="btn-primary !rounded-2xl !px-4 !py-3 text-xs">
          <FiPlus className="h-4 w-4" /> Add service
        </button>
      </div>

      <div className="space-y-3">
        {salon.services.map((sv) => (
          <div key={sv.id} className="card flex items-center gap-3 p-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-600 dark:bg-brand-900/30">
              <FiScissors className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-bold text-ink-900 dark:text-white">{sv.name}</p>
              <p className="text-xs text-ink-400">{sv.duration} min</p>
            </div>
            <p className="text-sm font-extrabold text-ink-900 dark:text-white">₹{sv.price.toLocaleString('en-IN')}</p>
            <button onClick={() => remove(sv.id)} className="flex h-9 w-9 items-center justify-center rounded-xl text-ink-400 transition hover:bg-rose-50 hover:text-rose-500 dark:hover:bg-rose-900/20" aria-label="Remove service">
              <FiTrash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <BottomSheet open={open} onClose={() => setOpen(false)} title="Add service">
        <form onSubmit={add} className="space-y-4">
          <div>
            <label className="label">Service name</label>
            <div className="flex flex-wrap gap-2">
              {quickServices.map((q) => (
                <button key={q} type="button" onClick={() => setForm((f) => ({ ...f, name: q }))} className={`chip ${form.name === q ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300'}`}>
                  {q}
                </button>
              ))}
            </div>
            <input className="input mt-3" placeholder="Or custom service name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Price (₹)</label>
              <input className="input" type="number" min="0" placeholder="350" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} required />
            </div>
            <div>
              <label className="label">Duration (min)</label>
              <input className="input" type="number" min="5" placeholder="30" value={form.duration} onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} />
            </div>
          </div>
          <button type="submit" className="btn-primary w-full">Add service</button>
        </form>
      </BottomSheet>
    </div>
  )
}