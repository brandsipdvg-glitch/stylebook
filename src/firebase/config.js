// Firebase config loaded from env vars.
// When the keys are left empty the app runs in DEMO MODE using local seed data,
// so the whole platform works instantly without any Firebase project.

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
}

export const isFirebaseEnabled = Boolean(
  config.apiKey && config.projectId && config.authDomain,
)

export const firebaseConfig = config

export const DEMO_EMAIL_DOMAIN = '@stylebook.demo'