import { useRef, useState } from 'react'
import { FiPlus, FiTrash2, FiUpload } from 'react-icons/fi'
import Img from '../../components/Img.jsx'
import BottomSheet from '../../components/BottomSheet.jsx'
import { BarLoader } from '../../components/Loader.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { useOwnerSalon } from '../../hooks/useOwnerSalon.js'
import { updateSalonOwnerData } from '../../lib/store.js'
import { hairstyles } from '../../lib/demoData.js'

export default function OwnerPortfolio() {
  const { salon, loading, reload } = useOwnerSalon()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [item, setItem] = useState({ hairstyleId: '', before: null, after: null, price: '' })
  const [uploading, setUploading] = useState(false)
  const beforeRef = useRef()

  if (loading) return <BarLoader />

  const readFile = (file) =>
    new Promise((resolve, reject) => {
      const fr = new FileReader()
      fr.onload = () => resolve(fr.result)
      fr.onerror = reject
      fr.readAsDataURL(file)
    })

  const pickBefore = async (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setItem((it) => ({ ...it, before: f }))
  }
  const pickAfter = async (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setItem((it) => ({ ...it, after: f }))
  }

  const save = async () => {
    if (!item.hairstyleId) return toast('Pick a hairstyle', 'error')
    setUploading(true)
    try {
      const style = hairstyles.find((h) => h.id === item.hairstyleId)
      const before = item.before ? await readFile(item.before) : style.image
      const after = item.after ? await readFile(item.after) : style.image
      const portfolio = [
        ...salon.portfolio,
        {
          id: 'pf-' + Date.now(),
          hairstyleId: style.id,
          name: style.name,
          image: after,
          before,
          after,
          price: Number(item.price) || style.price,
        },
      ]
      await updateSalonOwnerData(salon.id, { portfolio })
      setOpen(false)
      setItem({ hairstyleId: '', before: null, after: null, price: '' })
      reload()
      toast('Portfolio updated', 'success')
    } catch {
      toast('Upload failed', 'error')
    } finally {
      setUploading(false)
    }
  }

  const remove = async (id) => {
    await updateSalonOwnerData(salon.id, { portfolio: salon.portfolio.filter((p) => p.id !== id) })
    reload()
    toast('Removed from portfolio', 'info')
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-ink-900 dark:text-white">Portfolio</h1>
          <p className="mt-1 text-sm text-ink-500">{salon.portfolio.length} looks shown to customers</p>
        </div>
        <button onClick={() => setOpen(true)} className="btn-primary !rounded-2xl !px-4 !py-3 text-xs">
          <FiPlus className="h-4 w-4" /> Add look
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {salon.portfolio.map((p) => (
          <div key={p.id} className="group relative overflow-hidden rounded-3xl shadow-card">
            <Img src={p.image} alt={p.name} className="h-40 w-full object-cover" fallbackClass="h-40 w-full" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/85 to-transparent p-3">
              <p className="text-sm font-bold text-white">{p.name}</p>
              <p className="text-xs font-semibold text-brand-300">₹{p.price.toLocaleString('en-IN')}</p>
            </div>
            <button onClick={() => remove(p.id)} className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-rose-500 opacity-0 shadow transition group-hover:opacity-100" aria-label="Remove">
              <FiTrash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <BottomSheet open={open} onClose={() => setOpen(false)} title="Add hairstyle to portfolio" wide>
        <div className="space-y-4">
          <div>
            <label className="label">Hairstyle</label>
            <select className="input" value={item.hairstyleId} onChange={(e) => setItem((it) => ({ ...it, hairstyleId: e.target.value }))}>
              <option value="">Select a hairstyle…</option>
              {hairstyles.map((h) => (
                <option key={h.id} value={h.id}>{h.name} · {h.gender}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Before photo</label>
              <button onClick={() => beforeRef.current?.click()} className="flex h-32 w-full flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-ink-200 text-ink-400 transition hover:border-brand-400 hover:text-brand-500 dark:border-ink-700">
                {item.before ? <img src={URL.createObjectURL(item.before)} alt="" className="h-full w-full rounded-2xl object-cover" /> : <><FiUpload className="h-5 w-5" /><span className="text-xs font-semibold">Upload</span></>}
              </button>
              <input ref={beforeRef} type="file" accept="image/*" className="hidden" onChange={pickBefore} />
            </div>
            <div>
              <label className="label">After photo</label>
              <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-ink-200 text-ink-400 transition hover:border-brand-400 hover:text-brand-500 dark:border-ink-700">
                {item.after ? <img src={URL.createObjectURL(item.after)} alt="" className="h-full w-full rounded-2xl object-cover" /> : <><FiUpload className="h-5 w-5" /><span className="text-xs font-semibold">Upload</span></>}
                <input type="file" accept="image/*" className="hidden" onChange={pickAfter} />
              </label>
            </div>
          </div>

          <div>
            <label className="label">Pricing (₹)</label>
            <input className="input" type="number" placeholder={`Default: ₹${hairstyles.find((h) => h.id === item.hairstyleId)?.price || ''}`} value={item.price} onChange={(e) => setItem((it) => ({ ...it, price: e.target.value }))} />
          </div>

          <button onClick={save} disabled={uploading} className="btn-primary w-full">
            {uploading ? 'Uploading…' : 'Add to portfolio'}
          </button>
        </div>
      </BottomSheet>
    </div>
  )
}