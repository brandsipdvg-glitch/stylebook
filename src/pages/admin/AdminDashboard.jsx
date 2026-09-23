import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiUsers, FiScissors, FiCalendar, FiActivity, FiChevronRight, FiTrendingUp, FiDollarSign, FiUserCheck, FiLogIn, FiCheckCircle } from 'react-icons/fi'
import { BarLoader } from '../../components/Loader.jsx'
import { getAllUsers, getAllBookings, getSalons, getLoginLog } from '../../lib/store.js'

const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN')
const todayStr = () => new Date().toISOString().slice(0, 10)

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    ;(async () => {
      const [users, salons, bookings, logins] = await Promise.all([getAllUsers(), getSalons(), getAllBookings(), getLoginLog()])
      const today = todayStr()

      const completed = bookings.filter((b) => b.status === 'completed')
      const servedCustomers = new Set(completed.map((b) => b.userId)).size
      const gross = bookings.filter((b) => b.status !== 'cancelled').reduce((s, b) => s + (b.price || 0), 0)
      const cancelled = bookings.filter((b) => b.status === 'cancelled').length
      const revenueBySalon = {}
      bookings.forEach((b) => {
        if (b.status === 'cancelled') return
        revenueBySalon[b.salonName || b.salonId] = (revenueBySalon[b.salonName || b.salonId] || 0) + (b.price || 0)
      })
      const topSalons = Object.entries(revenueBySalon).sort((a, b) => b[1] - a[1]).slice(0, 5)

      const last7 = Array.from({ length: 7 }, (_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - (6 - i))
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        const rev = bookings.filter((b) => b.date === key && b.status !== 'cancelled').reduce((s, b) => s + (b.price || 0), 0)
        return { key, rev, label: d.toLocaleDateString('en', { weekday: 'short' }) }
      })

      const loginToday = logins.filter((l) => (l.ts || '').slice(0, 10) === today).length
      const customerLoginsToday = logins.filter((l) => l.role !== 'admin' && l.role !== 'owner' && (l.ts || '').slice(0, 10) === today).length

      setStats({
        users: users.length,
        salons: salons.length,
        bookings: bookings.length,
        active: bookings.filter((b) => b.status === 'confirmed' || b.status === 'pending').length,
        todayBookings: bookings.filter((b) => b.date === today).length,
        completed: completed.length,
        servedCustomers,
        gross,
        cancelled,
        avg: gross / Math.max(1, bookings.length - cancelled),
        topSalons,
        last7,
        logins: logins.length,
        loginToday,
        customerLoginsToday,
      })
    })()
  }, [])

  if (!stats) return <BarLoader />

  const cards = [
    { label: 'Registered Customers', value: stats.users, sub: `${stats.users} accounts`, icon: FiUsers, to: '/admin/users', tint: 'bg-sky-50 text-sky-600 dark:bg-sky-900/30' },
    { label: 'Sign-ins Today', value: stats.loginToday, sub: `${stats.customerLoginsToday} customers · ${stats.logins} total`, icon: FiLogIn, to: '/admin/users', tint: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30' },
    { label: 'Salons on Platform', value: stats.salons, sub: 'verified & listed', icon: FiScissors, to: '/admin/salons', tint: 'bg-brand-50 text-brand-600 dark:bg-brand-900/30' },
    { label: 'Total Bookings', value: stats.bookings, sub: `${stats.active} active now`, icon: FiCalendar, to: '/admin/bookings', tint: 'bg-violet-50 text-violet-600 dark:bg-violet-900/30' },
  ]

  const maxRev = Math.max(...stats.last7.map((d) => d.rev), 1)

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-widest text-brand-600">Platform overview</p>
        <h1 className="text-2xl font-extrabold text-ink-900 dark:text-white">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-ink-500">{stats.todayBookings} bookings today · {inr(stats.gross)} gross revenue</p>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((c) => (
          <Link to={c.to} key={c.label} className="card group p-4 transition hover:-translate-y-0.5 hover:shadow-lift">
            <div className="flex items-center justify-between">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.tint}`}>
                <c.icon className="h-5 w-5" />
              </span>
              <FiChevronRight className="h-4 w-4 text-ink-300 transition group-hover:translate-x-1" />
            </div>
            <p className="mt-3 text-2xl font-black text-ink-900 dark:text-white">{c.value}</p>
            <p className="text-xs font-semibold text-ink-500">{c.label}</p>
            <p className="text-[10px] text-ink-400">{c.sub}</p>
          </Link>
        ))}
      </div>

      {/* Business results */}
      <div className="mt-6 rounded-3xl bg-gradient-to-r from-ink-900 to-ink-800 p-5 text-white">
        <div className="flex items-center gap-2">
          <FiTrendingUp className="h-5 w-5 text-emerald-400" />
          <p className="text-sm font-bold">Business results</p>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { l: 'Gross revenue', v: inr(stats.gross), icon: FiDollarSign },
            { l: 'Haircuts completed', v: stats.completed, icon: FiCheckCircle },
            { l: 'Customers served', v: stats.servedCustomers, icon: FiUserCheck },
            { l: 'Avg. order value', v: inr(stats.avg), icon: FiActivity },
          ].map((x) => (
            <div key={x.l} className="rounded-2xl bg-white/10 p-3">
              <p className="text-xl font-extrabold">{x.v}</p>
              <p className="text-[11px] text-ink-300">{x.l}</p>
            </div>
          ))}
        </div>

        {/* 7-day revenue */}
        <p className="mt-5 text-[11px] font-bold uppercase tracking-widest text-ink-300">Revenue · last 7 days</p>
        <div className="mt-2 flex items-end gap-2">
          {stats.last7.map((d) => (
            <div key={d.key} className="flex flex-1 flex-col items-center gap-1">
              <p className="text-[10px] font-bold text-white">{inr(d.rev).replace('₹', '')}</p>
              <div className="flex h-16 w-full items-end overflow-hidden rounded-lg bg-white/5">
                <div className="w-full rounded-lg bg-emerald-400/80" style={{ height: `${Math.max(6, (d.rev / maxRev) * 100)}%` }} />
              </div>
              <p className="text-[9px] text-ink-300">{d.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top salons by revenue */}
      <div className="mt-6 grid grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="card p-5">
          <p className="text-sm font-bold text-ink-900 dark:text-white">Top salons by revenue</p>
          <div className="mt-3 space-y-2">
            {stats.topSalons.length === 0 ? (
              <p className="text-xs text-ink-400">No revenue yet.</p>
            ) : (
              stats.topSalons.map(([name, rev], i) => (
                <div key={name} className="flex items-center gap-3 rounded-2xl bg-ink-50 p-3 dark:bg-ink-900">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-xs font-black text-brand-600 dark:bg-brand-900/30">
                    {i + 1}
                  </span>
                  <p className="min-w-0 flex-1 truncate text-sm font-semibold text-ink-800 dark:text-ink-100">{name}</p>
                  <p className="text-sm font-black text-ink-900 dark:text-white">{inr(rev)}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link to="/admin/salons" className="card flex flex-1 items-center gap-3 p-4 transition hover:shadow-lift">
            <FiScissors className="h-5 w-5 text-brand-600" />
            <div>
              <p className="text-sm font-bold text-ink-900 dark:text-white">Manage salons</p>
              <p className="text-xs text-ink-400">Feature, verify, delete</p>
            </div>
            <FiChevronRight className="ml-auto h-4 w-4 text-ink-300" />
          </Link>
          <Link to="/admin/users" className="card flex flex-1 items-center gap-3 p-4 transition hover:shadow-lift">
            <FiUsers className="h-5 w-5 text-sky-600" />
            <div>
              <p className="text-sm font-bold text-ink-900 dark:text-white">Manage users</p>
              <p className="text-xs text-ink-400">Sign-ins, roles & permissions</p>
            </div>
            <FiChevronRight className="ml-auto h-4 w-4 text-ink-300" />
          </Link>
          <Link to="/admin/bookings" className="card flex flex-1 items-center gap-3 p-4 transition hover:shadow-lift">
            <FiCalendar className="h-5 w-5 text-violet-600" />
            <div>
              <p className="text-sm font-bold text-ink-900 dark:text-white">Manage bookings</p>
              <p className="text-xs text-ink-400">All platform bookings</p>
            </div>
            <FiChevronRight className="ml-auto h-4 w-4 text-ink-300" />
          </Link>
        </div>
      </div>
    </div>
  )
}