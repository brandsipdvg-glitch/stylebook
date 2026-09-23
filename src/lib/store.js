// ============================================================
// DATA LAYER
// Uses Firestore when Firebase is configured, otherwise an
// identical in-memory/localStorage store seeded with demo data
// so the whole app works instantly with demo data.
// ============================================================

import { firestore, isFirebaseEnabled } from '../firebase/db.js'
import {
  salons as seedSalons,
  hairstyles as seedHairstyles,
  seedUsers,
  seedBookings,
  seedReviews,
  seedFavorites,
  genSlots,
  uid,
} from './demoData.js'

const LS = (k) => 'stylebook:' + k

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(LS(key))
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}
function save(key, value) {
  try {
    localStorage.setItem(LS(key), JSON.stringify(value))
  } catch {
    /* storage full */
  }
}
const clone = (v) => JSON.parse(JSON.stringify(v))
const delay = (ms) => new Promise((r) => setTimeout(r, ms))

const todayStr = () => new Date().toISOString().slice(0, 10)

// ---------------- LOCAL (DEMO) STORE ----------------
function ensureLocal() {
  if (!localStorage.getItem(LS('salons'))) {
    save('salons', clone(seedSalons))
    save('hairstyles', clone(seedHairstyles))
    save('users', clone(seedUsers))
    save('bookings', clone(seedBookings))
    save('reviews', clone(seedReviews))
    save('favorites', clone(seedFavorites))
    // regenerate today's slots
    const slots = seedSalons.flatMap((s) => genSlots(s.id, todayStr()))
    save('slots', slots)
  }
}

const lStore = {
  get: async (coll) => {
    ensureLocal()
    await delay(120)
    return clone(load(coll, []))
  },
}

// ---------------- FIREBASE STORE ----------------
async function fGet(name) {
  const snap = await firestore.collection(name).get()
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

// ---------------- PUBLIC API ----------------
export async function getHairstyles(filter = {}) {
  if (isFirebaseEnabled && firestore) {
    const rows = await fGet('hairstyles')
    return rows.filter((h) => (filter.gender ? h.gender === filter.gender : true))
  }
  let rows = await lStore.get('hairstyles')
  if (filter.gender) rows = rows.filter((h) => h.gender === filter.gender)
  if (filter.q) {
    const q = filter.q.toLowerCase()
    rows = rows.filter((h) => h.name.toLowerCase().includes(q))
  }
  if (filter.popular) rows = rows.filter((h) => h.popular)
  return rows
}

export async function getHairstyle(id) {
  if (isFirebaseEnabled && firestore) {
    const doc = await firestore.collection('hairstyles').doc(id).get()
    return doc.exists ? { id: doc.id, ...doc.data() } : null
  }
  const rows = await lStore.get('hairstyles')
  return rows.find((h) => h.id === id) || null
}

export async function getSalons(filter = {}) {
  if (isFirebaseEnabled && firestore) {
    const rows = await fGet('salons')
    return rows.filter((s) => (filter.gender ? s.gender === filter.gender || s.gender === 'unisex' : true))
  }
  let rows = await lStore.get('salons')
  if (filter.q) {
    const q = filter.q.toLowerCase()
    rows = rows.filter(
      (s) => s.name.toLowerCase().includes(q) || s.area.toLowerCase().includes(q) || s.city.toLowerCase().includes(q),
    )
  }
  if (filter.gender) rows = rows.filter((s) => s.gender === filter.gender || s.gender === 'unisex')
  if (filter.minRating) rows = rows.filter((s) => s.rating >= filter.minRating)
  if (filter.service) {
    rows = rows.filter((s) => filter.service.every((sv) => s.services.some((x) => x.name === sv)))
  }
  if (filter.featured) rows = rows.filter((s) => s.featured)
  if (filter.shairstyleId) {
    rows = rows.filter((s) => s.portfolio.some((p) => p.hairstyleId === filter.shairstyleId))
  }
  if (filter.sort === 'rating') rows.sort((a, b) => b.rating - a.rating)
  else if (filter.sort === 'price') rows.sort((a, b) => a.startingPrice - b.startingPrice)
  else if (filter.sort === 'popular') rows.sort((a, b) => b.popular - a.popular)
  return rows
}

export async function getSalon(id) {
  if (isFirebaseEnabled && firestore) {
    const doc = await firestore.collection('salons').doc(id).get()
    return doc.exists ? { id: doc.id, ...doc.data() } : null
  }
  const rows = await lStore.get('salons')
  return rows.find((s) => s.id === id) || null
}

export async function getSalonSlots(salonId, date, { includeName = true } = {}) {
  if (isFirebaseEnabled && firestore) {
    const q = firestore
      .collection('slots')
      .where('salonId', '==', salonId)
      .where('date', '==', date)
    const snap = await q.get()
    return snap.docs.map((d) => d.data())
  }
  ensureLocal()
  let slots = load('slots', [])
  slots = slots.filter((s) => s.salonId === salonId && s.date === date)
  // include today's bookings for this salon to reflect accept/decline
  const bookings = load('bookings', []).filter((b) => b.salonId === salonId && b.date === date)
  slots = slots.map((s) => {
    const matched = bookings.find((b) => b.slotId === s.id && b.status === 'confirmed')
    return { ...s, booked: Boolean(matched) }
  })
  if (slots.length === 0) {
    slots = genSlots(salonId, date).map((s) => ({ ...s, available: true }))
  }
  // never show slots that are already in the past for today
  const todayLocal = dateOnly(new Date())
  if (date === todayLocal) {
    const now = timeOnly(new Date())
    slots = slots.filter((s) => s.time >= now)
  }
  if (!includeName) return clone(slots)
  return clone(slots)
}

function dateOnly(d) {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}
function timeOnly(d) {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export async function createBooking(data) {
  const booking = { ...data, id: 'book-' + uid(), status: 'pending', createdAt: new Date().toISOString() }
  if (isFirebaseEnabled && firestore) {
    const doc = firestore.collection('bookings').doc(booking.id)
    await doc.set(booking)
    return booking
  }
  ensureLocal()
  const bookings = load('bookings', [])
  bookings.unshift(booking)
  save('bookings', bookings)
  // mark slot unavailable
  const slots = load('slots', [])
  const idx = slots.findIndex((s) => s.id === booking.slotId)
  if (idx > -1) slots[idx] = { ...slots[idx], available: false }
  else slots.push({ id: booking.slotId, salonId: booking.salonId, date: booking.date, time: booking.time, available: false })
  save('slots', slots)
  return booking
}

export async function updateBookingStatus(id, status) {
  if (isFirebaseEnabled && firestore) {
    await firestore.collection('bookings').doc(id).update({ status })
    return
  }
  ensureLocal()
  const bookings = load('bookings', [])
  const idx = bookings.findIndex((b) => b.id === id)
  if (idx > -1) {
    bookings[idx] = { ...bookings[idx], status }
    save('bookings', bookings)
  }
}

export async function getUserBookings(userId, onlyUpcoming = false) {
  if (isFirebaseEnabled && firestore) {
    const rows = await fGet('bookings')
    let list = rows.filter((b) => b.userId === userId)
    if (onlyUpcoming) {
      const now = new Date()
      list = list.filter((b) => new Date(b.date + 'T' + b.time) >= now && (b.status === 'confirmed' || b.status === 'pending'))
    }
    return list.sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time))
  }
  ensureLocal()
  let list = load('bookings', []).filter((b) => b.userId === userId)
  if (onlyUpcoming) {
    const now = new Date()
    list = list.filter((b) => new Date(b.date + 'T' + b.time) >= now)
  }
  return clone(list).sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time))
}

export async function getSalonBookings(salonId) {
  if (isFirebaseEnabled && firestore) {
    const rows = await fGet('bookings')
    return rows.filter((b) => b.salonId === salonId).sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time))
  }
  ensureLocal()
  return clone(load('bookings', []))
    .filter((b) => b.salonId === salonId)
    .sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time))
}

export async function getReviews(salonId) {
  if (isFirebaseEnabled && firestore) {
    const snap = await firestore.collection('reviews').where('salonId', '==', salonId).get()
    return snap.docs.map((d) => d.data())
  }
  ensureLocal()
  return clone(load('reviews', [])).filter((r) => r.salonId === salonId)
}

export async function addReview(review) {
  const r = { ...review, id: 'rev-' + uid(), date: new Date().toISOString() }
  if (isFirebaseEnabled && firestore) {
    await firestore.collection('reviews').doc(r.id).set(r)
  } else {
    ensureLocal()
    const reviews = load('reviews', [])
    reviews.unshift(r)
    save('reviews', reviews)
    // bump salon rating slightly
    const salonsList = load('salons', [])
    const s = salonsList.find((x) => x.id === r.salonId)
    if (s) {
      s.reviewsCount += 1
      s.rating = Math.round((s.rating * 10 + r.rating) / (10 + 1) * 10) / 10 || s.rating
      save('salons', salonsList)
    }
  }
  return r
}

// ---------------- FAVORITES ----------------
export async function getFavorites(userId) {
  if (isFirebaseEnabled && firestore) {
    const snap = await firestore.collection('favorites').where('userId', '==', userId).get()
    return snap.docs.map((d) => d.data())
  }
  ensureLocal()
  return clone(load('favorites', [])).filter((f) => f.userId === userId)
}

export async function toggleFavorite(userId, salonId, hairstyleId) {
  if (isFirebaseEnabled && firestore) {
    const q = await firestore
      .collection('favorites')
      .where('userId', '==', userId)
      .where('salonId', '==', salonId)
      .get()
    if (!q.empty) {
      await firestore.collection('favorites').doc(q.docs[0].id).delete()
      return false
    }
    const doc = firestore.collection('favorites').doc()
    await doc.set({ id: doc.id, userId, salonId, hairstyleId, type: hairstyleId ? 'hairstyle' : 'salon' })
    return true
  }
  ensureLocal()
  const list = load('favorites', [])
  const idx = list.findIndex((f) => f.userId === userId && f.salonId === salonId && (f.hairstyleId || null) === (hairstyleId || null))
  if (idx > -1) {
    list.splice(idx, 1)
    save('favorites', list)
    return false
  }
  list.unshift({ id: 'fav-' + uid(), userId, salonId, hairstyleId: hairstyleId || undefined, type: hairstyleId ? 'hairstyle' : 'salon' })
  save('favorites', list)
  return true
}

export async function isFavorite(userId, salonId, hairstyleId) {
  const favs = await getFavorites(userId)
  return favs.some((f) => f.salonId === salonId && (f.hairstyleId || null) === (hairstyleId || null))
}

// ---------------- ADMIN ----------------
export async function getAllUsers() {
  if (isFirebaseEnabled && firestore) {
    return fGet('users')
  }
  ensureLocal()
  return clone(load('users', []))
}

export async function getAllBookings() {
  if (isFirebaseEnabled && firestore) {
    return fGet('bookings')
  }
  ensureLocal()
  return clone(load('bookings', []))
}

export async function getAllReviews() {
  if (isFirebaseEnabled && firestore) {
    return fGet('reviews')
  }
  ensureLocal()
  return clone(load('reviews', []))
}

// Admin analytics: every successful login (local demo mode only).
export async function getLoginLog() {
  if (isFirebaseEnabled && firestore) {
    return []
  }
  try {
    return clone(JSON.parse(localStorage.getItem('stylebook:loginLog')) || [])
  } catch {
    return []
  }
}

export async function setUserRole(userId, role) {
  if (isFirebaseEnabled && firestore) {
    await firestore.collection('users').doc(userId).update({ role })
  } else {
    ensureLocal()
    const users = load('users', [])
    const u = users.find((x) => x.id === userId)
    if (u) {
      u.role = role
      save('users', users)
    }
  }
}

export async function deleteSalon(id) {
  if (isFirebaseEnabled && firestore) {
    await firestore.collection('salons').doc(id).delete()
  } else {
    ensureLocal()
    save('salons', load('salons', []).filter((s) => s.id !== id))
  }
}

export async function setSalonFeatured(id, featured) {
  if (isFirebaseEnabled && firestore) {
    await firestore.collection('salons').doc(id).update({ featured })
  } else {
    ensureLocal()
    const salonsList = load('salons', [])
    const s = salonsList.find((x) => x.id === id)
    if (s) {
      s.featured = featured
      save('salons', salonsList)
    }
  }
}

export async function upsertSalon(salon) {
  if (isFirebaseEnabled && firestore) {
    const doc = salon.id ? firestore.collection('salons').doc(salon.id) : firestore.collection('salons').doc()
    await doc.set({ ...salon, id: doc.id })
    return { ...salon, id: doc.id }
  }
  ensureLocal()
  const salonsList = load('salons', [])
  let result
  if (salon.id) {
    const idx = salonsList.findIndex((s) => s.id === salon.id)
    if (idx > -1) {
      salonsList[idx] = { ...salonsList[idx], ...salon }
      result = salonsList[idx]
    }
  } else {
    result = { ...salon, id: 'salon-' + uid() }
    salonsList.unshift(result)
  }
  save('salons', salonsList)
  return result
}

// Owner helpers on the salon doc itself
export async function updateSalonOwnerData(salonId, patch) {
  if (isFirebaseEnabled && firestore) {
    await firestore.collection('salons').doc(salonId).update(patch)
    return
  }
  ensureLocal()
  const salonsList = load('salons', [])
  const idx = salonsList.findIndex((s) => s.id === salonId)
  if (idx > -1) {
    salonsList[idx] = { ...salonsList[idx], ...patch }
    save('salons', salonsList)
  }
}

export async function getFeaturedSalons() {
  return getSalons({ featured: true })
}

export async function getSalonsForHairstyle(hairstyleId) {
  return getSalons({ hairstyleId })
}

// ---------------- slot management (owner) ----------------
export async function addSlot(salonId, date, time) {
  const slot = {
    id: `${salonId}-${date}-${time.replace(':', '')}`,
    salonId,
    date,
    time,
    available: true,
    booked: false,
  }
  if (isFirebaseEnabled && firestore) {
    await firestore.collection('slots').doc(slot.id).set(slot)
    return slot
  }
  ensureLocal()
  const slots = load('slots', [])
  if (!slots.some((s) => s.id === slot.id)) slots.push(slot)
  save('slots', slots)
  return slot
}

export async function removeSlot(salonId, date, time) {
  const id = `${salonId}-${date}-${time.replace(':', '')}`
  if (isFirebaseEnabled && firestore) {
    await firestore.collection('slots').doc(id).delete()
    return
  }
  ensureLocal()
  save('slots', load('slots', []).filter((s) => s.id !== id))
}

export async function toggleSlotAvailability(salonId, date, time, available) {
  const id = `${salonId}-${date}-${time.replace(':', '')}`
  if (isFirebaseEnabled && firestore) {
    await firestore.collection('slots').doc(id).update({ available })
    return
  }
  ensureLocal()
  const slots = load('slots', [])
  const idx = slots.findIndex((s) => s.id === id)
  if (idx > -1) {
    slots[idx] = { ...slots[idx], available }
    save('slots', slots)
  }
}

export { todayStr, ensureLocal, delay }

export const isDemoMode = () => !isFirebaseEnabled