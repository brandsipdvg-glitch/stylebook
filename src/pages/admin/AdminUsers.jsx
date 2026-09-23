import { useEffect, useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import { BarLoader } from '../../components/Loader.jsx'
import { EmptyState } from '../../components/EmptyState.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { getAllUsers, setUserRole } from '../../lib/store.js'

const roles = ['customer', 'owner', 'admin']

export default function AdminUsers() {
  const { toast } = useToast()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')

  const load = async () => {
    setUsers(await getAllUsers())
    setLoading(false)
  }
  useEffect(() => {
    load()
  }, [])

  const list = users.filter((u) => `${u.name} ${u.email}`.toLowerCase().includes(query.toLowerCase()))

  const changeRole = async (u, role) => {
    await setUserRole(u.id, role)
    toast(`${u.name} is now ${role}`, 'success')
    load()
  }

  if (loading) return <BarLoader />

  return (
    <div className="animate-fade-in">
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold text-ink-900 dark:text-white">Users</h1>
        <p className="mt-1 text-sm text-ink-500">{users.length} on the platform</p>
      </div>

      <div className="mb-4 max-w-md">
        <div className="relative">
          <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input className="input pl-11" placeholder="Search users…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      {list.length ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead className="border-b border-ink-900/5 bg-ink-50 text-[11px] font-bold uppercase tracking-wider text-ink-400 dark:border-white/5 dark:bg-ink-800">
                <tr>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-900/5 dark:divide-white/5">
                {list.slice(0, 100).map((u) => (
                  <tr key={u.id} className="transition hover:bg-ink-50/60 dark:hover:bg-ink-800/40">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={u.avatar} alt="" className="h-10 w-10 rounded-full object-cover" />
                        <div>
                          <p className="font-bold text-ink-900 dark:text-white">{u.name}</p>
                          <p className="text-xs text-ink-400">{u.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-xs font-medium text-ink-700 dark:text-ink-200">{u.email}</p>
                      <p className="text-xs text-ink-400">+91 {u.phone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {roles.map((r) => (
                          <button
                            key={r}
                            onClick={() => changeRole(u, r)}
                            className={`chip text-[10px] ${u.role === r ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-500 hover:bg-ink-200 dark:bg-ink-800 dark:hover:bg-ink-700'}`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState icon={FiSearch} title="No users found" message="Try a different search term." />
      )}
    </div>
  )
}