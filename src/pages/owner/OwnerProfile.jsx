import { useState } from 'react'
import { FiSave, FiPhone } from 'react-icons/fi'
import { BarLoader } from '../../components/Loader.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { useOwnerSalon } from '../../hooks/useOwnerSalon.js'
import { updateSalonOwnerData } from '../../lib/store.js'

export default function OwnerProfile() {
  const { salon, loading, reload } = useOwnerSalon()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState(
    salon
      ? {
          name: salon.name,
          description: salon.description,
          address: salon.address,
          phone: salon.phone,
          cover: salon.cover,
        }
      : { name: '', description: '', address: '', phone: '', cover: '' },
  )

  if (loading) return <BarLoader />

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const save = async () => {
    setSaving(true)
    await updateSalonOwnerData(salon.id, {
      name: form.name,
      description: form.description,
      address: form.address,
      phone: form.phone,
      cover: form.cover,
    })
    setSaving(false)
    reload()
    toast('Salon profile updated', 'success')
  }

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-ink-900 dark:text-white">Salon Profile</h1>
          <p className="mt-1 text-sm text-ink-500">{salon.rating.toFixed(1)}★ · {salon.reviewsCount} reviews · {salon.gender}</p>
        </div>
        <button onClick={save} disabled={saving} className="btn-primary !rounded-2xl !px-4 !py-3 text-xs">
          <FiSave className="h-4 w-4" /> {saving ? 'Saving…' : 'Save'}
        </button>
      </div>

      <div className="mt-5 space-y-5">
        <div className="card overflow-hidden">
          <div className="relative">
            <img src={form.cover || salon.cover} alt="" className="h-40 w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/70 to-transparent p-3">
              <p className="text-xs font-bold text-white">Cover image</p>
            </div>
          </div>
          <div className="p-5">
            <label className="label">Cover image URL</label>
            <input className="input" value={form.cover} onChange={set('cover')} placeholder="https://…" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="card space-y-4 p-5">
            <div>
              <label className="label">Salon name</label>
              <input className="input" value={form.name} onChange={set('name')} />
            </div>
            <div>
              <label className="label">Description</label>
              <textarea className="input min-h-[110px] resize-none" value={form.description} onChange={set('description')} />
            </div>
          </div>

          <div className="card space-y-4 p-5">
            <div>
              <label className="label">Address</label>
              <input className="input" value={form.address} onChange={set('address')} />
            </div>
            <div>
              <label className="label">Phone</label>
              <div className="relative">
                <FiPhone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input className="input pl-11" value={form.phone} onChange={set('phone')} />
              </div>
            </div>
            <div>
              <label className="label">Working hours</label>
              <p className="rounded-2xl bg-ink-50 px-4 py-3 text-sm font-semibold text-ink-700 dark:bg-ink-800 dark:text-ink-200">
                {salon.openingHours.open} – {salon.openingHours.close}
                <span className="ml-2 text-xs font-normal text-ink-400">edit under Slots</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}