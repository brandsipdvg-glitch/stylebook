import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { getSalon, getSalonBookings, getSalonSlots } from '../lib/store.js'

export function useOwnerSalon() {
  const { user } = useAuth()
  const [salon, setSalon] = useState(null)
  const [bookings, setBookings] = useState([])
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [refresh, setRefresh] = useState(0)

  const salonId = user?.salonId || 'salon-1'

  useEffect(() => {
    ;(async () => {
      const s = await getSalon(salonId)
      const [b, sl] = await Promise.all([
        s ? getSalonBookings(s.id) : [],
        s ? getSalonSlots(s.id, new Date().toISOString().slice(0, 10), { includeName: false }) : [],
      ])
      setSalon(s)
      setBookings(b)
      setSlots(sl)
      setLoading(false)
    })()
  }, [salonId, refresh])

  const reload = () => setRefresh((r) => r + 1)

  return { salon, bookings, slots, loading, reload, salonId }
}