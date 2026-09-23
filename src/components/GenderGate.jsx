import { FiScissors } from 'react-icons/fi'
import { IMG_HAIR_MEN, IMG_HAIR_WOMEN } from '../lib/demoData.js'

export default function GenderGate({ onPick }) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-gradient-to-br from-ink-950 via-ink-900 to-brand-900">
      <div className="pointer-events-none absolute inset-0 bg-grid-fade opacity-20" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-600/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 py-14 text-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-brand-600 text-white shadow-glow">
          <FiScissors className="h-10 w-10" />
        </span>
        <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl">
          Style<span className="text-brand-400">Book</span>
        </h1>
        <p className="mt-2 text-base text-ink-300">Your everyday salon booking platform</p>

        <div className="mx-auto mt-12 grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            onClick={() => onPick('men')}
            className="group relative h-44 overflow-hidden rounded-3xl text-left ring-1 ring-white/10 transition hover:-translate-y-1 hover:ring-white/40"
          >
            <img src={IMG_HAIR_MEN[2]} alt="Men's styles" className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105" />
            <span className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/30 to-transparent" />
            <span className="absolute inset-x-0 bottom-0 flex items-center justify-between p-5">
              <span>
                <span className="block text-2xl font-black text-white">Men</span>
                <span className="block text-xs text-ink-300">Fades, crops & classics</span>
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 font-black text-white backdrop-blur transition group-hover:bg-brand-600">
                →
              </span>
            </span>
          </button>

          <button
            onClick={() => onPick('women')}
            className="group relative h-44 overflow-hidden rounded-3xl text-left ring-1 ring-white/10 transition hover:-translate-y-1 hover:ring-white/40"
          >
            <img src={IMG_HAIR_WOMEN[2]} alt="Women's styles" className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105" />
            <span className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/30 to-transparent" />
            <span className="absolute inset-x-0 bottom-0 flex items-center justify-between p-5">
              <span>
                <span className="block text-2xl font-black text-white">Women</span>
                <span className="block text-xs text-ink-300">Cuts, colour & keratin</span>
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 font-black text-white backdrop-blur transition group-hover:bg-brand-600">
                →
              </span>
            </span>
          </button>
        </div>

        <p className="mt-8 text-xs text-ink-400">Choose a profile so we can show styles and salons made for you.</p>
      </div>
    </div>
  )
}