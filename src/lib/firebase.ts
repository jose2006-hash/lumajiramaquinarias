import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getDatabase } from 'firebase/database'

const getEnv = (nextKey: string, viteKey: string) =>
  process.env[nextKey] ?? process.env[viteKey] ?? ''

const firebaseConfig = {
  apiKey: getEnv('NEXT_PUBLIC_FIREBASE_API_KEY', 'VITE_FIREBASE_API_KEY'),
  authDomain: getEnv('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', 'VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('NEXT_PUBLIC_FIREBASE_PROJECT_ID', 'VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', 'VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', 'VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('NEXT_PUBLIC_FIREBASE_APP_ID', 'VITE_FIREBASE_APP_ID'),
  databaseURL: getEnv('NEXT_PUBLIC_FIREBASE_DATABASE_URL', 'VITE_FIREBASE_DATABASE_URL'),
}

if (!firebaseConfig.apiKey) {
  throw new Error(
    'Firebase API key is missing. Set NEXT_PUBLIC_FIREBASE_API_KEY (or VITE_FIREBASE_API_KEY) in your environment.'
  )
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]

export const auth = getAuth(app)
export const db = getFirestore(app)
export const rtdb = getDatabase(app)
export default app
