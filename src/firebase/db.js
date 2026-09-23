import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
import { firebaseConfig, isFirebaseEnabled } from './config.js'

let firestore = null
let firebaseAuth = null
let storage = null

if (isFirebaseEnabled) {
  // Direct import prevents tree-shaking dead branches under demo mode.
  const app = initializeApp(firebaseConfig)
  firestore = getFirestore(app)
  firebaseAuth = getAuth(app)
  storage = getStorage(app)
}

export { firestore, firebaseAuth, storage, isFirebaseEnabled }