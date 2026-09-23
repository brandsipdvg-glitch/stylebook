// ============================================================
// AUTH LAYER
// Uses Firebase Auth when configured, otherwise a localStorage
// demo auth that supports email + password signup/login,
// phone login (simulated) and password reset (simulated).
// ============================================================

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile as firebaseUpdateProfile,
} from 'firebase/auth'
import {
  firebaseAuth,
  isFirebaseEnabled,
} from '../firebase/db.js'
import { uid } from './demoData.js'

const LS_USERS = 'stylebook:authUsers'
const LS_SESSION = 'stylebook:session'
const LS_OTP = 'stylebook:otp'
const LS_LOGINS = 'stylebook:loginLog'

// Record every login so the admin dashboard can analyse sign-ins.
function recordLogin(role, email) {
  try {
    const log = JSON.parse(localStorage.getItem(LS_LOGINS)) || []
    log.push({ role: role || 'customer', email: email || '', ts: new Date().toISOString() })
    localStorage.setItem(LS_LOGINS, JSON.stringify(log.slice(-2000)))
  } catch {
    /* storage full */
  }
}

function loadUsers() {
  try {
    return JSON.parse(localStorage.getItem(LS_USERS)) || []
  } catch {
    return []
  }
}
function saveUsers(list) {
  localStorage.setItem(LS_USERS, JSON.stringify(list))
}

export const CURRENT = {
  async get() {
    if (isFirebaseEnabled && firebaseAuth) {
      return new Promise((resolve) => firebaseAuth.onAuthStateChanged((u) => resolve(u)))
    }
    try {
      const s = JSON.parse(localStorage.getItem(LS_SESSION))
      if (s && s.id) return s
    } catch {
      /* none */
    }
    return null
  },
}

export async function registerUser({ name, email, phone, password, role = 'customer' }) {
  if (isFirebaseEnabled && firebaseAuth) {
    const cred = await createUserWithEmailAndPassword(firebaseAuth, email, password)
    if (cred.user) {
      await cred.user.updateProfile({ displayName: name })
      return { id: cred.user.uid, name, email, phone, role }
    }
    throw new Error('Signup failed')
  }
  const users = loadUsers()
  if (users.some((u) => u.email === email)) throw new Error('An account with this email already exists')
  const user = {
    id: 'user-' + uid(),
    name,
    email,
    phone: phone || '',
    role,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=e11d48&color=fff&size=96`,
    createdAt: new Date().toISOString(),
  }
  users.push(user)
  saveUsers(users)
  localStorage.setItem(LS_SESSION, JSON.stringify(user))
  recordLogin(role, email)
  return user
}

export async function loginUser({ email, password }) {
  if (isFirebaseEnabled && firebaseAuth) {
    await signInWithEmailAndPassword(firebaseAuth, email, password)
    const u = firebaseAuth.currentUser
    const { idTokenResult } = await u.getIdTokenResult()
    const role = idTokenResult?.claims?.role || 'customer'
    return { id: u.uid, name: u.displayName || email.split('@')[0], email: u.email, role }
  }
  const users = loadUsers()
  let user = users.find((u) => u.email === email)
  if (!user && password) {
    // Allow any seeded-style demo account to log in
    if (email.endsWith('@styledemo.app')) {
      const [, name] = email.split('@')
      user = { id: 'user-' + uid(), name: name.split('')[0].toUpperCase() + email.split('.')[0].slice(1), email, role: 'customer' }
    } else {
      throw new Error('Account not found. Please register first.')
    }
  }
  if (user) {
    localStorage.setItem(LS_SESSION, JSON.stringify(user))
    recordLogin(user.role || 'customer', user.email)
    return user
  }
  throw new Error('Invalid email or password')
}

export async function loginAsDemo(role) {
  if (role === 'owner') {
    // owner of first salon
    const demo = { id: 'owner-demo', name: 'Modern Men\'s Salon', email: 'salon-1@owner.styledemo.app', role: 'owner', salonId: 'salon-1', avatar: '' }
    localStorage.setItem(LS_SESSION, JSON.stringify(demo))
    recordLogin('owner', demo.email)
    return demo
  }
  if (role === 'admin') {
    const demo = { id: 'admin-demo', name: 'Platform Admin', email: 'admin@styledemo.app', role: 'admin' }
    localStorage.setItem(LS_SESSION, JSON.stringify(demo))
    recordLogin('admin', demo.email)
    return demo
  }
  const demo = {
    // Bind to seeded user-1 so the demo account instantly shows seeded
    // bookings and favourites from the seed data.
    id: 'user-1',
    name: 'Arjun Mehta',
    email: 'arjun.demo@styledemo.app',
    phone: '9880012345',
    role: 'customer',
    avatar: 'https://ui-avatars.com/api/?name=Arjun+Mehta&background=0ea5e9&color=fff&size=96',
  }
  // Bind demo customer to seeded bookings
  const existing = loadUsers().find((u) => u.id === demo.id)
  if (existing) {
    localStorage.setItem(LS_SESSION, JSON.stringify({ ...existing, name: demo.name, email: demo.email }))
    recordLogin('customer', demo.email)
    return existing
  }
  localStorage.setItem(LS_SESSION, JSON.stringify(demo))
  recordLogin('customer', demo.email)
  return demo
}

export async function logoutUser() {
  if (isFirebaseEnabled && firebaseAuth) {
    await signOut(firebaseAuth)
  }
  localStorage.removeItem(LS_SESSION)
  localStorage.removeItem(LS_OTP)
}

export async function sendOtp(phone) {
  if (isFirebaseEnabled && firebaseAuth) {
    throw new Error('Configure Firebase Phone provider or use demo mode for OTP login.')
  }
  const otp = String(Math.floor(100000 + Math.random() * 900000))
  localStorage.setItem(LS_OTP, JSON.stringify({ phone, otp }))
  return otp
}

export async function verifyOtp(phone, otp) {
  if (isFirebaseEnabled && firebaseAuth) {
    throw new Error('Configure Firebase Phone provider or use demo mode for OTP login.')
  }
  const stored = JSON.parse(localStorage.getItem(LS_OTP))
  const expected = Array.isArray(otp) ? otp.join('') : otp
  if (!stored || stored.phone !== phone || stored.otp !== expected) throw new Error('Invalid OTP')
  const users = loadUsers()
  let user = users.find((u) => u.phone === phone)
  if (user) {
    localStorage.setItem(LS_SESSION, JSON.stringify(user))
    recordLogin(user.role || 'customer', user.email)
    return user
  }
  const demo = { id: 'user-' + uid(), name: 'Quick User', email: phone + '@styledemo.app', phone, role: 'customer' }
  users.push(demo)
  saveUsers(users)
  localStorage.setItem(LS_SESSION, JSON.stringify(demo))
  recordLogin('customer', demo.email)
  return demo
}

export async function sendReset(email) {
  if (isFirebaseEnabled && firebaseAuth) {
    await sendPasswordResetEmail(firebaseAuth, email)
    return
  }
  await new Promise((r) => setTimeout(r, 600))
  const users = loadUsers()
  const u = users.find((x) => x.email === email)
  if (!u) throw new Error('No account found with this email')
  return true
}

export async function updateProfile(patch) {
  const users = loadUsers()
  const session = JSON.parse(localStorage.getItem(LS_SESSION))
  if (session && session.id) {
    const updated = { ...session, ...patch }
    localStorage.setItem(LS_SESSION, JSON.stringify(updated))
    const idx = users.findIndex((u) => u.id === session.id)
    if (idx > -1) {
      users[idx] = { ...users[idx], ...patch }
      saveUsers(users)
    }
  }
  if (isFirebaseEnabled && firebaseAuth && firebaseAuth.currentUser) {
    if (patch.name) await firebaseUpdateProfile(firebaseAuth.currentUser, { displayName: patch.name })
  }
  return session ? { ...session, ...patch } : null
}

export const demoAuth = {
  getEnabled: () => !isFirebaseEnabled,
}