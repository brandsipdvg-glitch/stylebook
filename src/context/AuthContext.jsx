import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  loginUser,
  registerUser,
  logoutUser,
  loginAsDemo,
  sendOtp,
  verifyOtp,
  sendReset,
  updateProfile,
} from '../lib/auth.js'
import { useToast } from './ToastContext.jsx'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    let active = true
    ;(async () => {
      // Add a tiny initial delay so skeletons show nicely
      setTimeout(async () => {
        const storedUser = user
        // read from session storage synchronously
        let current = null
        try {
          current = JSON.parse(localStorage.getItem('stylebook:session'))
        } catch {
          /* none */
        }
        if (active) {
          setUser(current)
          setLoading(false)
        }
      }, 350)
    })()
    return () => {
      active = false
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthed: Boolean(user),
      isCustomer: user?.role === 'customer',
      isOwner: user?.role === 'owner',
      isAdmin: user?.role === 'admin',

      async login(creds) {
        const u = await loginUser(creds)
        setUser(u)
        return u
      },
      async register(data) {
        const u = await registerUser(data)
        setUser(u)
        return u
      },
      async demoLogin(role) {
        const u = await loginAsDemo(role)
        setUser(u)
        toast(role + ' demo logged in', 'success')
        return u
      },
      async logout() {
        await logoutUser()
        setUser(null)
        toast('Signed out', 'info')
      },
      async phoneLogin(phone) {
        const otp = await sendOtp(phone)
        return otp
      },
      async phoneVerify(phone, otp) {
        const u = await verifyOtp(phone, otp)
        setUser(u)
        return u
      },
      async forgot(email) {
        return sendReset(email)
      },
      async saveProfile(patch) {
        const updated = await updateProfile(patch)
        if (updated) setUser(updated)
        return updated
      },
    }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)