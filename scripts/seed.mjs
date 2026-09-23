// ============================================================
// FIRESTORE SEED SCRIPT
// Populates Firestore collections with the same demo data used
// by the app's offline demo mode: users, salons, hairstyles,
// reviews, favorites, bookings and slots.
//
// Usage (requires Firebase project configured via env vars):
//   VITE_FIREBASE_API_KEY=... VITE_FIREBASE_PROJECT_ID=... npm run seed
//
// NOTE: This script uses the Admin SDK. Install it with:
//   npm i -D firebase-admin
// and place your service-account key at ./serviceAccountKey.json
// ============================================================

import admin from 'firebase-admin'
import fs from 'node:fs'
import {
  salons,
  hairstyles,
  seedUsers,
  seedReviews,
  seedFavorites,
  seedBookings,
  genSlots,
} from '../src/lib/demoData.js'

const KEY = process.env.GOOGLE_APPLICATION_CREDENTIALS || './serviceAccountKey.json'

if (!fs.existsSync(KEY)) {
  console.error('❌ Missing service account key at', KEY)
  console.error('   Download it from Firebase Console → Project settings → Service accounts.')
  process.exit(1)
}

if (!process.env.VITE_FIREBASE_PROJECT_ID) {
  console.error('❌ Set VITE_FIREBASE_PROJECT_ID env var.')
  process.exit(1)
}

admin.initializeApp({
  credential: admin.credential.cert(KEY),
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
})

const db = admin.firestore()

async function writeCollection(name, items) {
  const col = db.collection(name)
  let count = 0
  for (const item of items) {
    const id = item.id
    await col.doc(id).set({ ...item, id })
    count++
  }
  console.log(`✔ ${name}: ${count}`)
}

async function seed() {
  console.log('🌱 Seeding StyleBook Firestore…')

  await writeCollection('hairstyles', hairstyles)
  await writeCollection('salons', salons)
  await writeCollection('users', seedUsers)
  await writeCollection('reviews', seedReviews)
  await writeCollection('favorites', seedFavorites)
  await writeCollection('bookings', seedBookings)

  // Slots: 20 per salon per day for the next 7 days
  const allSlots = []
  for (const salon of salons) {
    for (let d = 0; d < 7; d++) {
      const dt = new Date()
      dt.setDate(dt.getDate() + d)
      allSlots.push(...genSlots(salon.id, dt.toISOString().slice(0, 10)))
    }
  }
  await writeCollection('slots', allSlots)

  console.log('✅ Done.')
}

seed().catch((e) => {
  console.error('❌ Seeding failed:', e.message)
  process.exit(1)
})